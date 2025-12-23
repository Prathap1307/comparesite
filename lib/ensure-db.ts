import prisma from "@/lib/db";

let didEnsure = false;

export async function ensureDatabase() {
  if (didEnsure) {
    return;
  }

  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Customer (
      id TEXT PRIMARY KEY,
      clerkUserId TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS AdminUser (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS AdminSession (
      id TEXT PRIMARY KEY,
      adminUserId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      expiresAt DATETIME NOT NULL,
      FOREIGN KEY (adminUserId) REFERENCES AdminUser(id) ON DELETE CASCADE
    );
  `);

  didEnsure = true;
}
