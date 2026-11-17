import { prisma } from "@dinkourt/db";
import { StatCard } from "@/components/ui/stat-card";
import { formatPHP } from "@/lib/utils";

export default async function AdminDashboard() {
  const [owners, venues, bookings, revenue] = await Promise.all([
    prisma.owner.count(),
    prisma.venue.count(),
    prisma.booking.count(),
    prisma.ledgerEntry.aggregate({ _sum: { netAmount: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Court Owners" value={owners} />
        <StatCard label="Venues" value={venues} />
        <StatCard label="Total Bookings" value={bookings} />
        <StatCard label="Net Revenue" value={formatPHP(Number(revenue._sum.netAmount ?? 0))} />
      </div>
    </div>
  );
}
