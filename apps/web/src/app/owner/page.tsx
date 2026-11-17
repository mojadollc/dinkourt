import { getSession } from "@/lib/auth/session";
import { prisma } from "@dinkourt/db";
import { StatCard } from "@/components/ui/stat-card";
import { formatPHP } from "@/lib/utils";

export default async function OwnerDashboard() {
  const session = await getSession();
  const userId = (session?.user as any)?.id;

  const owner = await prisma.owner.findUnique({
    where: { userId },
    include: { venues: { select: { id: true } } },
  });

  if (!owner) return <p className="text-gray-500">No owner profile found.</p>;

  const venueIds = owner.venues.map(v => v.id);

  const [courts, bookings, members] = await Promise.all([
    prisma.court.count({ where: { venueId: { in: venueIds } } }),
    prisma.booking.count({ where: { court: { venueId: { in: venueIds } } } }),
    prisma.playerMembership.count({ where: { plan: { venueId: { in: venueIds } } } }),
  ]);

  const revenue = await prisma.ledgerEntry.aggregate({
    where: { venueId: { in: venueIds } },
    _sum: { netAmount: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Venues" value={owner.venues.length} />
        <StatCard label="Courts" value={courts} />
        <StatCard label="Total Bookings" value={bookings} />
        <StatCard label="Active Members" value={members} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4">
        <StatCard label="Net Revenue" value={formatPHP(Number(revenue._sum.netAmount ?? 0))} />
      </div>
    </div>
  );
}
