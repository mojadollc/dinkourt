"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function RevenueChart({ data }: { data: { date: string; amount: number }[] }) {
  const grouped = data.reduce<Record<string, number>>((acc, d) => {
    acc[d.date] = (acc[d.date] ?? 0) + d.amount;
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([date, amount]) => ({ date, amount }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
        <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
