"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FeeType = "NONE" | "FIXED" | "PERCENTAGE" | "FIXED_PLUS_PERCENTAGE";

export function FeeEditor({ venue, config }: { venue: any; config: any }) {
  const router = useRouter();
  const [feeType, setFeeType] = useState<FeeType>(config?.feeType ?? "NONE");
  const [fixed, setFixed] = useState(config?.fixedAmount ?? "");
  const [pct, setPct] = useState(config?.percentage ? Number(config.percentage) * 100 : "");
  const [chargedTo, setChargedTo] = useState(config?.chargedTo ?? "PLAYER");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/fees/${venue.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feeType,
        fixedAmount: fixed ? Number(fixed) : null,
        percentage: pct ? Number(pct) / 100 : null,
        chargedTo,
      }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">{venue.name}</h3>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Fee Type</label>
          <select value={feeType} onChange={e => setFeeType(e.target.value as FeeType)}
            className="border rounded-lg px-3 py-2 text-sm">
            <option value="NONE">No Fee</option>
            <option value="FIXED">Fixed Amount</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_PLUS_PERCENTAGE">Fixed + Percentage</option>
          </select>
        </div>
        {(feeType === "FIXED" || feeType === "FIXED_PLUS_PERCENTAGE") && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">Fixed (₱)</label>
            <input type="number" value={fixed} onChange={e => setFixed(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-28" />
          </div>
        )}
        {(feeType === "PERCENTAGE" || feeType === "FIXED_PLUS_PERCENTAGE") && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">Percentage (%)</label>
            <input type="number" value={pct} onChange={e => setPct(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-24" />
          </div>
        )}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Charged To</label>
          <select value={chargedTo} onChange={e => setChargedTo(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm">
            <option value="PLAYER">Player</option>
            <option value="VENUE">Venue</option>
          </select>
        </div>
        <button onClick={save} disabled={saving}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
