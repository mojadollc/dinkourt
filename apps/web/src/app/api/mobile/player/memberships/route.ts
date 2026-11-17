import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { jwtVerify } from "jose";

async function getPlayerFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "secret");
    const { payload } = await jwtVerify(token, secret);
    const player = await prisma.player.findUnique({ where: { userId: payload.sub } });
    return player;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const player = await getPlayerFromRequest(req);
  if (!player) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await prisma.playerMembership.findMany({
    where: { playerId: player.id },
    include: { plan: { include: { venue: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(memberships);
}
