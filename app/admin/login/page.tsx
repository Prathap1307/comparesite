"use client";

import { useFormState } from "react-dom";
import { loginAdmin } from "@/app/admin/login/actions";

const initialState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdmin, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded border border-slate-200 p-6"
      >
        <div>
          <h1 className="text-xl font-semibold">Admin login</h1>
          <p className="mt-1 text-sm text-slate-600">
            Use your admin credentials to continue.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </div>
        {state.error ? (
          <p className="text-sm text-red-600">{state.error}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
