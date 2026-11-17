import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({ tournamentId: z.string(), category: z.string().optional() });

export async function POST(req: NextRequest) {
  const session = await requireRole("PLAYER").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const userId = (session.user as any).id;
  const player = await prisma.player.findUnique({ where: { userId } });
  if (!player) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tournament = await prisma.tournament.findUnique({ where: { id: parsed.data.tournamentId } });
  if (!tournament || tournament.status !== "OPEN")
    return NextResponse.json({ error: "Tournament not open" }, { status: 409 });

  if (tournament.maxPlayers) {
    const count = await prisma.tournamentRegistration.count({
      where: { tournamentId: tournament.id },
    });
    if (count >= tournament.maxPlayers)
      return NextResponse.json({ error: "Tournament full" }, { status: 409 });
  }

  const reg = await prisma.tournamentRegistration.create({
    data: {
      tournamentId: parsed.data.tournamentId,
      playerId: player.id,
      category: parsed.data.category,
    },
  });
  return NextResponse.json(reg, { status: 201 });
}
