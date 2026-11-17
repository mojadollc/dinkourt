import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { calculateBookingFee } from "@dinkourt/shared";
import { z } from "zod";

const schema = z.object({
  courtId: z.string(),
  slotId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await requireRole("PLAYER").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const userId = (session.user as any).id;
  const player = await prisma.player.findUnique({ where: { userId } });
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  const slot = await prisma.courtSlot.findUnique({
    where: { id: parsed.data.slotId },
    include: { court: { include: { venue: { include: { bookingFeeConfig: true } } } } },
  });
  if (!slot || !slot.isAvailable)
    return NextResponse.json({ error: "Slot not available" }, { status: 409 });

  const durationHours = (slot.endTime.getTime() - slot.startTime.getTime()) / 3600000;
  const baseAmount = Number(slot.court.hourlyRate) * durationHours;

  const feeConfig = slot.court.venue.bookingFeeConfig;
  const feeSnapshot = {
    feeType: feeConfig?.feeType ?? "NONE",
    fixedAmount: feeConfig?.fixedAmount ? Number(feeConfig.fixedAmount) : undefined,
    percentage: feeConfig?.percentage ? Number(feeConfig.percentage) : undefined,
    chargedTo: feeConfig?.chargedTo ?? "PLAYER",
  };
  const feeAmount = calculateBookingFee(baseAmount, feeSnapshot as any);
  const totalAmount = feeSnapshot.chargedTo === "PLAYER" ? baseAmount + feeAmount : baseAmount;

  const booking = await prisma.$transaction(async tx => {
    await tx.courtSlot.update({ where: { id: slot.id }, data: { isAvailable: false } });
    return tx.booking.create({
      data: {
        playerId: player.id,
        courtId: parsed.data.courtId,
        slotId: parsed.data.slotId,
        baseAmount,
        feeAmount,
        totalAmount,
        feeSnapshot,
        status: "PENDING",
      },
    });
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await requireRole("PLAYER").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const player = await prisma.player.findUnique({ where: { userId } });
  if (!player) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bookings = await prisma.booking.findMany({
    where: { playerId: player.id },
    include: { court: { include: { venue: true } }, slot: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}
