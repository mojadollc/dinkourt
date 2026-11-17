import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({ status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]) });

export async function PATCH(req: NextRequest, { params }: { params: { ownerId: string } }) {
  try {
    await requireRole("SUPER_ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const owner = await prisma.owner.update({
    where: { id: params.ownerId },
    data: { status: parsed.data.status },
  });
  return NextResponse.json(owner);
}
