import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  venueId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  entryFee: z.number().min(0).default(0),
  maxPlayers: z.number().int().positive().optional(),
  categories: z.array(z.string()).default([]),
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

  const tournament = await prisma.tournament.create({
    data: { ...parsed.data, startDate: new Date(parsed.data.startDate), endDate: new Date(parsed.data.endDate) },
  });
  return NextResponse.json(tournament, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const venueId = searchParams.get("venueId");
  if (!venueId) return NextResponse.json({ error: "venueId required" }, { status: 400 });
  const tournaments = await prisma.tournament.findMany({
    where: { venueId },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(tournaments);
}
