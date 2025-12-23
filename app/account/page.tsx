import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { upsertCustomerFromClerk } from "@/lib/customers";
import { saveCustomerPhone } from "@/app/account/actions";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const customer = await upsertCustomerFromClerk(user);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold">Your account</h1>
        <p className="mt-2 text-slate-600">
          Manage your contact details for future bookings.
        </p>
      </div>
      <section className="rounded border border-slate-200 p-6">
        <div className="grid gap-2 text-sm text-slate-700">
          <div>
            <span className="font-medium">Name:</span> {customer.name ?? "-"}
          </div>
          <div>
            <span className="font-medium">Email:</span> {customer.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {customer.phone ?? "-"}
          </div>
        </div>
      </section>
      {!customer.phone ? (
        <section className="rounded border border-slate-200 p-6">
          <h2 className="text-lg font-semibold">Add your phone number</h2>
          <p className="mt-2 text-sm text-slate-600">
            We need a phone number to confirm meet and greet details.
          </p>
          <form action={saveCustomerPhone} className="mt-4 flex gap-3">
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              name="phone"
              placeholder="Phone number"
              type="tel"
              required
            />
            <button
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
              type="submit"
            >
              Save
            </button>
          </form>
        </section>
      ) : null}
    </main>
  );
}
