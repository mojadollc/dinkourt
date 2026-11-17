import { prisma } from "@dinkourt/db";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { OwnerActions } from "./owner-actions";

export default async function OwnersPage() {
  const owners = await prisma.owner.findMany({
    include: { user: true, _count: { select: { venues: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Court Owners</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              {["Name", "Email", "Business", "Venues", "Status", "Joined", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {owners.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.user.name}</td>
                <td className="px-4 py-3 text-gray-500">{o.user.email}</td>
                <td className="px-4 py-3">{o.businessName}</td>
                <td className="px-4 py-3">{o._count.venues}</td>
                <td className="px-4 py-3">
                  <Badge label={o.status} variant={statusVariant(o.status)} />
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <OwnerActions ownerId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
