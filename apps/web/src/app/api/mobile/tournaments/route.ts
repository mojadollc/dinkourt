import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";

export async function GET(_req: NextRequest) {
  const tournaments = await prisma.tournament.findMany({
    where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    include: { venue: { select: { name: true, city: true } } },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(tournaments);
}
