import { getSession } from "@/lib/auth/session";
import { prisma } from "@dinkourt/db";
import { StatCard } from "@/components/ui/stat-card";
import { formatPHP } from "@/lib/utils";
import { RevenueChart } from "./revenue-chart";

export default async function AnalyticsPage() {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  const owner = await prisma.owner.findUnique({
    where: { userId },
    include: { venues: { select: { id: true } } },
  });
  if (!owner) return <p>No owner profile.</p>;

  const venueIds = owner.venues.map(v => v.id);

  const [totalBookings, confirmedBookings, revenue, members] = await Promise.all([
    prisma.booking.count({ where: { court: { venueId: { in: venueIds } } } }),
    prisma.booking.count({ where: { court: { venueId: { in: venueIds } }, status: "CONFIRMED" } }),
    prisma.ledgerEntry.aggregate({
      where: { venueId: { in: venueIds } },
      _sum: { netAmount: true, feeAmount: true },
    }),
    prisma.playerMembership.count({ where: { plan: { venueId: { in: venueIds } }, isActive: true } }),
  ]);

  const last30Days = await prisma.ledgerEntry.findMany({
    where: {
      venueId: { in: venueIds },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    select: { createdAt: true, netAmount: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={totalBookings} />
        <StatCard label="Confirmed" value={confirmedBookings} />
        <StatCard label="Active Members" value={members} />
        <StatCard label="Net Revenue" value={formatPHP(Number(revenue._sum.netAmount ?? 0))} />
      </div>
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Revenue — Last 30 Days</h2>
        <RevenueChart data={last30Days.map(e => ({
          date: e.createdAt.toISOString().slice(0, 10),
          amount: Number(e.netAmount),
        }))} />
      </div>
    </div>
  );
}
