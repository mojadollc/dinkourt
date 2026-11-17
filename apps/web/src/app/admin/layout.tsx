import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { Sidebar } from "@/components/layout/sidebar";
import {
  LayoutDashboard, Users, Building2, CreditCard, BarChart3, Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/owners", label: "Court Owners", Icon: Users },
  { href: "/admin/venues", label: "Venues", Icon: Building2 },
  { href: "/admin/subscriptions", label: "Subscriptions", Icon: CreditCard },
  { href: "/admin/fees", label: "Booking Fees", Icon: Settings },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireRole("SUPER_ADMIN");
  } catch {
    redirect("/auth/login");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar items={navItems} title="DinkHub Admin" />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
