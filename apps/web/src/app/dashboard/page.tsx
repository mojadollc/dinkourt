import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function DashboardRedirect() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  const role = (session.user as any).role;
  if (role === "SUPER_ADMIN") redirect("/admin");
  if (role === "OWNER" || role === "STAFF") redirect("/owner");
  redirect("/auth/login");
}
