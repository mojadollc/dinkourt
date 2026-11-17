import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const search = searchParams.get("search");

  const venues = await prisma.venue.findMany({
    where: {
      status: "ACTIVE",
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    include: {
      courts: { where: { isActive: true }, select: { id: true, hourlyRate: true } },
      _count: { select: { courts: true } },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(venues);
}
