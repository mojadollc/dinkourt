import { prisma } from "@dinkourt/db";
import { StatCard } from "@/components/ui/stat-card";
import { formatPHP } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const [owners, venues, bookings, players, revenue, subscriptions] = await Promise.all([
    prisma.owner.count({ where: { status: "APPROVED" } }),
    prisma.venue.count({ where: { status: "ACTIVE" } }),
    prisma.booking.count(),
    prisma.player.count(),
    prisma.ledgerEntry.aggregate({ _sum: { amount: true, feeAmount: true, netAmount: true } }),
    prisma.ownerSubscription.count({ where: { status: "ACTIVE" } }),
  ]);

  const mrr = await prisma.ownerSubscription.findMany({
    where: { status: "ACTIVE", interval: "MONTHLY" },
    include: { plan: true },
  });
  const mrrTotal = mrr.reduce((sum, s) => sum + Number(s.plan.monthlyPrice), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Owners" value={owners} />
        <StatCard label="Active Venues" value={venues} />
        <StatCard label="Total Players" value={players} />
        <StatCard label="Total Bookings" value={bookings} />
        <StatCard label="Active Subscriptions" value={subscriptions} />
        <StatCard label="MRR" value={formatPHP(mrrTotal)} sub="Monthly Recurring Revenue" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="Gross Revenue" value={formatPHP(Number(revenue._sum.amount ?? 0))} />
        <StatCard label="Platform Fees Collected" value={formatPHP(Number(revenue._sum.feeAmount ?? 0))} />
        <StatCard label="Net to Venues" value={formatPHP(Number(revenue._sum.netAmount ?? 0))} />
      </div>
    </div>
  );
}
