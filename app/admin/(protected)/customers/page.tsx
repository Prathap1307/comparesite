import Link from "next/link";
import prisma from "@/lib/db";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query?.trim();

  const customers = await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage customer contact details.
        </p>
      </div>
      <form className="flex gap-3" method="get">
        <input
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          name="query"
          defaultValue={query}
          placeholder="Search by name or email"
        />
        <button
          className="rounded border border-slate-300 px-4 py-2 text-sm"
          type="submit"
        >
          Search
        </button>
      </form>
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <Link
                    className="font-medium text-slate-900"
                    href={`/admin/customers/${customer.id}`}
                  >
                    {customer.name ?? "-"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {customer.email}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {customer.phone ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {customer.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-slate-500"
                  colSpan={4}
                >
                  No customers found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
