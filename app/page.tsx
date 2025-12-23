import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold">CompareSite</h1>
        <p className="mt-2 text-slate-600">
          Phase 1: Customer accounts and admin management.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          className="rounded border border-slate-300 px-4 py-2 text-sm"
          href="/login"
        >
          Customer Login
        </Link>
        <Link
          className="rounded border border-slate-300 px-4 py-2 text-sm"
          href="/signup"
        >
          Customer Signup
        </Link>
        <Link
          className="rounded border border-slate-300 px-4 py-2 text-sm"
          href="/admin/login"
        >
          Admin Login
        </Link>
      </div>
    </main>
  );
}
