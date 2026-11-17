import { prisma } from "@dinkourt/db";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { VenueStatusActions } from "./venue-status-actions";

export default async function AdminVenuesPage() {
  const venues = await prisma.venue.findMany({
    include: {
      owner: { include: { user: true } },
      _count: { select: { courts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Venues</h1>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              {["Venue", "Owner", "City", "Courts", "Status", "Created", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {venues.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{v.name}</td>
                <td className="px-4 py-3 text-gray-500">{v.owner.user.name}</td>
                <td className="px-4 py-3">{v.city}</td>
                <td className="px-4 py-3">{v._count.courts}</td>
                <td className="px-4 py-3">
                  <Badge label={v.status} variant={statusVariant(v.status)} />
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(v.createdAt)}</td>
                <td className="px-4 py-3">
                  <VenueStatusActions venueId={v.id} status={v.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
