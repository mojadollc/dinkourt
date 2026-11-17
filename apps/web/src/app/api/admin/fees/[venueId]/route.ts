import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import { requireRole } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  feeType: z.enum(["NONE", "FIXED", "PERCENTAGE", "FIXED_PLUS_PERCENTAGE"]),
  fixedAmount: z.number().nullable().optional(),
  percentage: z.number().nullable().optional(),
  chargedTo: z.enum(["PLAYER", "VENUE"]),
});

export async function PUT(req: NextRequest, { params }: { params: { venueId: string } }) {
  try {
    await requireRole("SUPER_ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const config = await prisma.bookingFeeConfig.upsert({
    where: { venueId: params.venueId },
    create: { venueId: params.venueId, ...parsed.data },
    update: parsed.data,
  });
  return NextResponse.json(config);
}
