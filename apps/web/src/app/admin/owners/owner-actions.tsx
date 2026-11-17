"use client";
import { useRouter } from "next/navigation";

export function OwnerActions({ ownerId, status }: { ownerId: string; status: string }) {
  const router = useRouter();

  async function update(newStatus: string) {
    await fetch(`/api/admin/owners/${ownerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <>
          <button onClick={() => update("APPROVED")}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
            Approve
          </button>
          <button onClick={() => update("REJECTED")}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
            Reject
          </button>
        </>
      )}
      {status === "APPROVED" && (
        <button onClick={() => update("SUSPENDED")}
          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200">
          Suspend
        </button>
      )}
      {status === "SUSPENDED" && (
        <button onClick={() => update("APPROVED")}
          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
          Reinstate
        </button>
      )}
    </div>
  );
}
