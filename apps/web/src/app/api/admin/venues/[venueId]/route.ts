import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({ status: z.enum(["ACTIVE", "PENDING", "SUSPENDED"]) });

export async function PATCH(req: NextRequest, { params }: { params: { venueId: string } }) {
  try {
    await requireRole("SUPER_ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const venue = await prisma.venue.update({
    where: { id: params.venueId },
    data: { status: parsed.data.status },
  });
  return NextResponse.json(venue);
}
