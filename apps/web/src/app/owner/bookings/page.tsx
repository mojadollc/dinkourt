import { getSession } from "@/lib/auth/session";
import { prisma } from "@dinkourt/db";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDate, formatPHP } from "@/lib/utils";

export default async function BookingsPage() {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  const owner = await prisma.owner.findUnique({
    where: { userId },
    include: { venues: { select: { id: true } } },
  });
  if (!owner) return <p>No owner profile.</p>;

  const venueIds = owner.venues.map(v => v.id);
  const bookings = await prisma.booking.findMany({
    where: { court: { venueId: { in: venueIds } } },
    include: {
      player: { include: { user: true } },
      court: { include: { venue: true } },
      slot: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              {["Player", "Venue", "Court", "Date", "Amount", "Fee", "Status", "Payment"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.player.user.name}</td>
                <td className="px-4 py-3 text-gray-500">{b.court.venue.name}</td>
                <td className="px-4 py-3">{b.court.name}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(b.slot.startTime)}</td>
                <td className="px-4 py-3">{formatPHP(Number(b.totalAmount))}</td>
                <td className="px-4 py-3 text-gray-500">{formatPHP(Number(b.feeAmount))}</td>
                <td className="px-4 py-3">
                  <Badge label={b.status} variant={statusVariant(b.status)} />
                </td>
                <td className="px-4 py-3">
                  {b.payment ? (
                    <Badge label={b.payment.status} variant={statusVariant(b.payment.status)} />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
