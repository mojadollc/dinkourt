"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewVenuePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/owner/venues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Failed to create venue");
    }
    router.push("/owner/venues");
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Venue</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        {[
          { name: "name", placeholder: "Venue Name", required: true },
          { name: "slug", placeholder: "URL Slug (e.g. my-venue)", required: true },
          { name: "address", placeholder: "Address", required: true },
          { name: "city", placeholder: "City", required: true },
          { name: "province", placeholder: "Province", required: true },
        ].map(f => (
          <input key={f.name} {...f}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        ))}
        <textarea name="description" placeholder="Description (optional)" rows={3}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-brand text-white rounded-lg py-2 font-semibold hover:bg-brand-dark disabled:opacity-50">
          {loading ? "Creating…" : "Create Venue"}
        </button>
      </form>
    </div>
  );
}
