import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2">
          <span className="text-4xl">🏓</span>
          <h1 className="text-4xl font-bold text-brand">Dinkourt</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">
          The nationwide pickleball court marketplace in the Philippines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="rounded-lg bg-brand px-6 py-3 text-white font-semibold hover:bg-brand-dark transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-brand px-6 py-3 text-brand font-semibold hover:bg-brand-light transition"
          >
            Register as Court Owner
          </Link>
        </div>
      </div>
    </main>
  );
}
