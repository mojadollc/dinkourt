"use client";
import { useRouter } from "next/navigation";

export function VenueStatusActions({ venueId, status }: { venueId: string; status: string }) {
  const router = useRouter();

  async function update(newStatus: string) {
    await fetch(`/api/admin/venues/${venueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <button onClick={() => update("ACTIVE")}
          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
          Activate
        </button>
      )}
      {status === "ACTIVE" && (
        <button onClick={() => update("SUSPENDED")}
          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200">
          Suspend
        </button>
      )}
      {status === "SUSPENDED" && (
        <button onClick={() => update("ACTIVE")}
          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
          Reinstate
        </button>
      )}
    </div>
  );
}
