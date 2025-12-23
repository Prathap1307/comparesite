import { type User } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { ensureDatabase } from "@/lib/ensure-db";

function getPrimaryEmail(user: User) {
  const primaryEmailId = user.primaryEmailAddressId;
  const primary = user.emailAddresses.find(
    (email) => email.id === primaryEmailId
  );

  return primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";
}

function getDisplayName(user: User) {
  if (user.fullName) {
    return user.fullName;
  }

  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.join(" ") || null;
}

function getPhone(user: User) {
  const phoneId = user.primaryPhoneNumberId;
  const phone = user.phoneNumbers.find((item) => item.id === phoneId);
  return phone?.phoneNumber ?? user.phoneNumbers[0]?.phoneNumber ?? null;
}

export async function upsertCustomerFromClerk(user: User) {
  await ensureDatabase();
  const email = getPrimaryEmail(user);
  const name = getDisplayName(user);
  const phone = getPhone(user);

  return prisma.customer.upsert({
    where: { clerkUserId: user.id },
    update: {
      email,
      name,
      phone: phone ?? undefined,
    },
    create: {
      clerkUserId: user.id,
      email,
      name,
      phone,
    },
  });
}

export async function updateCustomerPhone(clerkUserId: string, phone: string) {
  await ensureDatabase();
  return prisma.customer.update({
    where: { clerkUserId },
    data: { phone },
  });
}
