import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  venueId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  hourlyRate: z.number().positive(),
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

  const court = await prisma.court.create({ data: parsed.data });
  return NextResponse.json(court, { status: 201 });
}
