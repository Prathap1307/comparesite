"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateCustomerPhone } from "@/lib/customers";

export async function saveCustomerPhone(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const phone = String(formData.get("phone") ?? "").trim();

  if (!phone) {
    return { error: "Please provide a phone number." };
  }

  await updateCustomerPhone(userId, phone);
  return { error: null };
}
