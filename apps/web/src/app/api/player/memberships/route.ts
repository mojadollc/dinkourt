import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { addMonths, addYears } from "date-fns";

const schema = z.object({ planId: z.string() });

export async function POST(req: NextRequest) {
  const session = await requireRole("PLAYER").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const userId = (session.user as any).id;
  const player = await prisma.player.findUnique({ where: { userId } });
  if (!player) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = await prisma.membershipPlan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan || !plan.isActive) return NextResponse.json({ error: "Plan not available" }, { status: 404 });

  if (plan.capacity) {
    const count = await prisma.playerMembership.count({
      where: { planId: plan.id, isActive: true },
    });
    if (count >= plan.capacity)
      return NextResponse.json({ error: "Membership capacity reached" }, { status: 409 });
  }

  const startDate = new Date();
  const endDate =
    plan.interval === "MONTHLY" ? addMonths(startDate, 1)
    : plan.interval === "QUARTERLY" ? addMonths(startDate, 3)
    : addYears(startDate, 1);

  const membership = await prisma.playerMembership.create({
    data: { playerId: player.id, planId: plan.id, startDate, endDate },
  });
  return NextResponse.json(membership, { status: 201 });
}
