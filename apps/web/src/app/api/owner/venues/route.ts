import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  address: z.string().min(5),
  city: z.string().min(2),
  province: z.string().min(2),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await requireRole("OWNER", "STAFF").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const owner = await prisma.owner.findUnique({ where: { userId } });
  if (!owner) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const venues = await prisma.venue.findMany({ where: { ownerId: owner.id } });
  return NextResponse.json(venues);
}

export async function POST(req: NextRequest) {
  const session = await requireRole("OWNER").catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const owner = await prisma.owner.findUnique({ where: { userId } });
  if (!owner || owner.status !== "APPROVED")
    return NextResponse.json({ error: "Owner not approved" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const venue = await prisma.venue.create({
    data: { ...parsed.data, ownerId: owner.id },
  });
  return NextResponse.json(venue, { status: 201 });
}
