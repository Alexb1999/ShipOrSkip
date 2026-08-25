import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Session-pooler caps concurrent clients; each serverless instance gets exactly one slot. */
function pooledUrl(raw: string | undefined): string | undefined {
  if (!raw || /[?&]connection_limit=/.test(raw)) return raw;
  return `${raw}${raw.includes("?") ? "&" : "?"}connection_limit=1&pool_timeout=20`;
}

const datasourceUrl = pooledUrl(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: datasourceUrl ? { db: { url: datasourceUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
