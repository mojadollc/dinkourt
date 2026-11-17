import { prisma } from "@dinkourt/db";
import { FeeEditor } from "./fee-editor";

export default async function FeesPage() {
  const venues = await prisma.venue.findMany({
    include: { bookingFeeConfig: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Booking Fee Configuration</h1>
      <div className="space-y-4">
        {venues.map(v => (
          <FeeEditor key={v.id} venue={v} config={v.bookingFeeConfig} />
        ))}
      </div>
    </div>
  );
}
