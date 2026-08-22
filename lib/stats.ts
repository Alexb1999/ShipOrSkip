import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/money";

export const LAUNCHED_AT = new Date("2026-08-21T23:00:00-03:00");
export const ONLINE_WINDOW_MS = 5 * 60 * 1000;

export type SiteStats = {
  online: number;
  visitors: number;
  revenue: number;
  highestBid: number;
  highestBidApp: string | null;
  launchedAt: string;
};

async function countVisitors(since?: Date) {
  if (since) {
    const rows = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM "Visitor" WHERE "lastSeen" >= ${since}
    `;
    return Number(rows[0]?.count ?? 0);
  }
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM "Visitor"
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function getSiteStats(): Promise<SiteStats> {
  const since = new Date(Date.now() - ONLINE_WINDOW_MS);
  const [online, visitors, paid, topBid] = await Promise.all([
    countVisitors(since),
    countVisitors(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "completed" },
    }),
    prisma.bid.findFirst({
      orderBy: { bidAmount: "desc" },
      include: { app: true },
    }),
  ]);

  return {
    online,
    visitors,
    revenue: toNumber(paid._sum.amount),
    highestBid: topBid ? toNumber(topBid.bidAmount) : 0,
    highestBidApp: topBid?.app.name ?? null,
    launchedAt: LAUNCHED_AT.toISOString(),
  };
}

export async function heartbeat(visitorId?: string | null) {
  const now = new Date();
  if (visitorId) {
    try {
      const updated = await prisma.$executeRaw`
        UPDATE "Visitor" SET "lastSeen" = ${now}
        WHERE id = CAST(${visitorId} AS uuid)
      `;
      if (updated > 0) return { id: visitorId };
    } catch {
      // Bad or stale cookie — mint a new visitor.
    }
  }
  const created = await prisma.$queryRaw<{ id: string }[]>`
    INSERT INTO "Visitor" (id, "lastSeen", "createdAt")
    VALUES (gen_random_uuid(), ${now}, ${now})
    RETURNING id::text
  `;
  return { id: created[0].id };
}
