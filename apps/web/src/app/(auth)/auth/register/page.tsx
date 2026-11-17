"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        businessName: fd.get("businessName"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Registration failed");
    }
    router.push("/auth/login?registered=1");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-brand mb-2 text-center">🏓 Dinkourt</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Register as Court Owner</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          <input name="businessName" placeholder="Business Name" required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          <input name="email" type="email" placeholder="Email" required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          <input name="password" type="password" placeholder="Password (min 8 chars)" minLength={8} required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-brand text-white rounded-lg py-2 font-semibold hover:bg-brand-dark disabled:opacity-50">
            {loading ? "Registering…" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
