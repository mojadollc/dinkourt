import { getServerSession } from "next-auth";
import { authOptions } from "./options";
import { UserRole } from "@dinkourt/db";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireRole(...roles: UserRole[]) {
  const session = await getSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;
  if (!session || !userRole || !roles.includes(userRole)) {
    throw new Error("Unauthorized");
  }
  return session;
}
