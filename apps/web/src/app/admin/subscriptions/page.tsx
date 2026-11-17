import { prisma } from "@dinkourt/db";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDate, formatPHP } from "@/lib/utils";

export default async function SubscriptionsPage() {
  const subscriptions = await prisma.ownerSubscription.findMany({
    include: { owner: { include: { user: true } }, plan: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Owner Subscriptions</h1>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              {["Owner", "Plan", "Interval", "Price", "Period End", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {subscriptions.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.owner.user.name}</td>
                <td className="px-4 py-3">{s.plan.name}</td>
                <td className="px-4 py-3 capitalize">{s.interval.toLowerCase()}</td>
                <td className="px-4 py-3">
                  {formatPHP(s.interval === "MONTHLY" ? Number(s.plan.monthlyPrice) : Number(s.plan.annualPrice))}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(s.currentPeriodEnd)}</td>
                <td className="px-4 py-3">
                  <Badge label={s.status} variant={statusVariant(s.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
