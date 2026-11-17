import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dinkourt/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string() });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "secret");
  const token = await new SignJWT({ sub: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
