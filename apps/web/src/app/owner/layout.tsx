import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { Sidebar } from "@/components/layout/sidebar";
import {
  LayoutDashboard, Building2, CalendarDays, Users, Trophy,
  PlayCircle, UserCog, BarChart3, CreditCard,
} from "lucide-react";

const navItems = [
  { href: "/owner", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/owner/venues", label: "My Venues", Icon: Building2 },
  { href: "/owner/courts", label: "Courts", Icon: CalendarDays },
  { href: "/owner/bookings", label: "Bookings", Icon: CalendarDays },
  { href: "/owner/memberships", label: "Memberships", Icon: CreditCard },
  { href: "/owner/tournaments", label: "Tournaments", Icon: Trophy },
  { href: "/owner/open-play", label: "Open Play", Icon: PlayCircle },
  { href: "/owner/staff", label: "Staff", Icon: UserCog },
  { href: "/owner/analytics", label: "Analytics", Icon: BarChart3 },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireRole("OWNER", "STAFF");
  } catch {
    redirect("/auth/login");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar items={navItems} title="Venue Dashboard" />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
