import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const venue = await prisma.venue.findUnique({
    where: { id: params.id, status: "ACTIVE" },
    include: {
      courts: { where: { isActive: true } },
      memberships: { where: { isActive: true } },
      tournaments: { where: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
      openPlaySessions: { where: { status: { in: ["SCHEDULED", "OPEN"] } } },
    },
  });
  if (!venue) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(venue);
}
