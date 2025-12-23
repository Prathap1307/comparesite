import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
  });

  if (!customer) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <Link className="text-sm text-slate-500" href="/admin/customers">
          ← Back to customers
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Customer details</h1>
      </div>
      <div className="rounded border border-slate-200 p-6 text-sm text-slate-700">
        <div className="grid gap-3">
          <div>
            <span className="font-medium">Name:</span> {customer.name ?? "-"}
          </div>
          <div>
            <span className="font-medium">Email:</span> {customer.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {customer.phone ?? "-"}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {customer.createdAt.toLocaleString()}
          </div>
        </div>
      </div>
    </section>
  );
}
