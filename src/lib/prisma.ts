import { PrismaClient } from "@/generated/prisma";
import Database from "better-sqlite3";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const sqlite = new Database(dbPath);
  const adapter = new PrismaBetterSQLite3(sqlite);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
