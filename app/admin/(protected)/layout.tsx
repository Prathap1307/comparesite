import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-auth";
import { handleAdminLogout } from "@/app/admin/(protected)/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 bg-slate-50 p-6">
        <div className="mb-6 text-lg font-semibold">Admin Panel</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link className="rounded px-3 py-2 hover:bg-white" href="/admin">
            Dashboard
          </Link>
          <Link
            className="rounded px-3 py-2 hover:bg-white"
            href="/admin/customers"
          >
            Customers
          </Link>
          <form action={handleAdminLogout}>
            <button
              type="submit"
              className="w-full rounded px-3 py-2 text-left hover:bg-white"
            >
              Logout
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
