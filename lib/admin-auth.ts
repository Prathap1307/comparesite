import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function ensureDefaultAdminUser() {
  const existing = await prisma.adminUser.findUnique({
    where: { username: "admin" },
  });

  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash("admin", 10);
  return prisma.adminUser.create({
    data: {
      username: "admin",
      passwordHash,
    },
  });
}

export async function getAdminSession() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
    include: { adminUser: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function createAdminSession(username: string, password: string) {
  const adminUser =
    (await prisma.adminUser.findUnique({ where: { username } })) ??
    (username === "admin" ? await ensureDefaultAdminUser() : null);

  if (!adminUser) {
    return null;
  }

  const isValid = await bcrypt.compare(password, adminUser.passwordHash);

  if (!isValid) {
    return null;
  }

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const session = await prisma.adminSession.create({
    data: {
      adminUserId: adminUser.id,
      expiresAt,
    },
  });

  cookies().set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });

  return session;
}

export async function logoutAdmin() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await prisma.adminSession.deleteMany({ where: { id: sessionId } });
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
  });
}
