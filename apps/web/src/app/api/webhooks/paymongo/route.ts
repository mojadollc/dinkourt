import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import crypto from "crypto";

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paymongo-signature") ?? "";
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const { type, data } = event;

  if (type === "payment.paid") {
    const providerRef = data.id;
    const payment = await prisma.payment.findFirst({ where: { providerRef } });
    if (!payment) return NextResponse.json({ received: true });

    await prisma.$transaction(async tx => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", webhookPayload: event },
      });

      if (payment.bookingId) {
        const booking = await tx.booking.update({
          where: { id: payment.bookingId },
          data: { status: "CONFIRMED" },
          include: { court: true },
        });
        await tx.ledgerEntry.create({
          data: {
            venueId: booking.court.venueId,
            paymentId: payment.id,
            type: "BOOKING_PAYMENT",
            amount: payment.amount,
            feeAmount: booking.feeAmount,
            netAmount: booking.baseAmount,
            description: `Booking ${booking.id}`,
          },
        });
      }

      if (payment.membershipId) {
        const membership = await tx.playerMembership.findUnique({
          where: { id: payment.membershipId },
          include: { plan: true },
        });
        if (membership) {
          await tx.ledgerEntry.create({
            data: {
              venueId: membership.plan.venueId,
              paymentId: payment.id,
              type: "MEMBERSHIP_PAYMENT",
              amount: payment.amount,
              feeAmount: 0,
              netAmount: payment.amount,
              description: `Membership ${membership.id}`,
            },
          });
        }
      }
    });
  }

  if (type === "payment.failed") {
    const providerRef = data.id;
    await prisma.payment.updateMany({
      where: { providerRef },
      data: { status: "FAILED", webhookPayload: event },
    });
  }

  return NextResponse.json({ received: true });
}
