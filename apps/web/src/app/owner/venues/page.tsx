import { getSession } from "@/lib/auth/session";
import { prisma } from "@dinkourt/db";
import { Badge, statusVariant } from "@/components/ui/badge";
import Link from "next/link";

export default async function VenuesPage() {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  const owner = await prisma.owner.findUnique({ where: { userId } });
  if (!owner) return <p>No owner profile.</p>;

  const venues = await prisma.venue.findMany({
    where: { ownerId: owner.id },
    include: { _count: { select: { courts: true, bookings: { where: {} } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Venues</h1>
        <Link href="/owner/venues/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark">
          + Add Venue
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {venues.map(v => (
          <div key={v.id} className="bg-white border rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{v.name}</h3>
                <p className="text-sm text-gray-500">{v.city}, {v.province}</p>
              </div>
              <Badge label={v.status} variant={statusVariant(v.status)} />
            </div>
            <div className="mt-3 flex gap-4 text-sm text-gray-500">
              <span>{v._count.courts} courts</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/owner/venues/${v.id}`}
                className="text-sm text-brand font-medium hover:underline">
                Manage →
              </Link>
            </div>
          </div>
        ))}
        {venues.length === 0 && (
          <p className="text-gray-500 col-span-2">No venues yet. Add your first venue.</p>
        )}
      </div>
    </div>
  );
}
