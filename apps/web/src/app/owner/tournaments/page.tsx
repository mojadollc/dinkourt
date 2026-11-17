import { getSession } from "@/lib/auth/session";
import { prisma } from "@dinkourt/db";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDate, formatPHP } from "@/lib/utils";
import Link from "next/link";

export default async function TournamentsPage() {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  const owner = await prisma.owner.findUnique({
    where: { userId },
    include: { venues: { select: { id: true } } },
  });
  if (!owner) return <p>No owner profile.</p>;

  const tournaments = await prisma.tournament.findMany({
    where: { venueId: { in: owner.venues.map(v => v.id) } },
    include: {
      venue: { select: { name: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { startDate: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <Link href="/owner/tournaments/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark">
          + New Tournament
        </Link>
      </div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              {["Name", "Venue", "Start", "End", "Entry Fee", "Registrations", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {tournaments.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-gray-500">{t.venue.name}</td>
                <td className="px-4 py-3">{formatDate(t.startDate)}</td>
                <td className="px-4 py-3">{formatDate(t.endDate)}</td>
                <td className="px-4 py-3">{formatPHP(Number(t.entryFee))}</td>
                <td className="px-4 py-3">
                  {t._count.registrations}{t.maxPlayers ? ` / ${t.maxPlayers}` : ""}
                </td>
                <td className="px-4 py-3">
                  <Badge label={t.status} variant={statusVariant(t.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
