import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  venueId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  interval: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),
  price: z.number().positive(),
  bookingDiscount: z.number().min(0).max(1).default(0),
  benefits: z.array(z.string()).default([]),
  usageLimit: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  const session = await requireRole("OWNER", "STAFF").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const userId = (session.user as any).id;
  const owner = await prisma.owner.findUnique({ where: { userId } });
  const venue = await prisma.venue.findFirst({
    where: { id: parsed.data.venueId, ownerId: owner?.id },
  });
  if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });

  const plan = await prisma.membershipPlan.create({ data: parsed.data });
  return NextResponse.json(plan, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const venueId = searchParams.get("venueId");
  if (!venueId) return NextResponse.json({ error: "venueId required" }, { status: 400 });
  const plans = await prisma.membershipPlan.findMany({
    where: { venueId, isActive: true },
  });
  return NextResponse.json(plans);
}
