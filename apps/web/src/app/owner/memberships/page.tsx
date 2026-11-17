import { getSession } from "@/lib/auth/session";
import { prisma } from "@dinkourt/db";
import { formatPHP } from "@/lib/utils";
import Link from "next/link";

export default async function MembershipsPage() {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  const owner = await prisma.owner.findUnique({
    where: { userId },
    include: { venues: { select: { id: true } } },
  });
  if (!owner) return <p>No owner profile.</p>;

  const plans = await prisma.membershipPlan.findMany({
    where: { venueId: { in: owner.venues.map(v => v.id) } },
    include: {
      venue: { select: { name: true } },
      _count: { select: { playerMemberships: { where: { isActive: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Membership Plans</h1>
        <Link href="/owner/memberships/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark">
          + New Plan
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(p => (
          <div key={p.id} className="bg-white border rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.venue.name}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {p.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold">{formatPHP(Number(p.price))}</p>
            <p className="text-xs text-gray-500">{p.interval.toLowerCase()}</p>
            <p className="mt-2 text-sm text-gray-600">
              {p._count.playerMemberships} active members
              {p.capacity ? ` / ${p.capacity}` : ""}
            </p>
            {Number(p.bookingDiscount) > 0 && (
              <p className="text-xs text-brand mt-1">
                {(Number(p.bookingDiscount) * 100).toFixed(0)}% booking discount
              </p>
            )}
          </div>
        ))}
        {plans.length === 0 && <p className="text-gray-500">No membership plans yet.</p>}
      </div>
    </div>
  );
}
