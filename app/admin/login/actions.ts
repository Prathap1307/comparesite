"use server";

import { redirect } from "next/navigation";
import { createAdminSession } from "@/lib/admin-auth";

export async function loginAdmin(
  _prevState: { error?: string },
  formData: FormData
) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const session = await createAdminSession(username, password);

  if (!session) {
    return { error: "Invalid admin credentials." };
  }

  redirect("/admin");
}
