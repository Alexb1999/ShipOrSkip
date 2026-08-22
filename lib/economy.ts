import { prisma } from "@/lib/db";
import { bidExpiresAt, effectiveBidAmount } from "@/lib/bids";
import { applyElo, DEFAULT_ELO, ELO_K, SUPER_SHIP_K } from "@/lib/elo";
import { toNumber } from "@/lib/money";
import { appUrl } from "@/lib/ranking";
import { GLOBAL_TOP_SLOT } from "@/lib/tiers";
import type { PaymentKind } from "@prisma/client";
import { Prisma } from "@prisma/client";

export async function expireStaleBids(now = new Date()) {
  await prisma.bid.updateMany({
    where: { status: "active", expiresAt: { lte: now } },
    data: { status: "expired" },
  });
}

export async function getSpotlight(targetTier: string) {
  await expireStaleBids();
  const bids = await prisma.bid.findMany({
    where: { targetTier, status: "active", expiresAt: { gt: new Date() } },
    include: { app: { include: { user: true } } },
  });
  if (bids.length === 0) return null;
  const scored = bids
    .map((bid) => ({
      ...bid,
      effectiveAmount: effectiveBidAmount(toNumber(bid.bidAmount), bid.createdAt),
    }))
    .sort((a, b) => b.effectiveAmount - a.effectiveAmount);
  return scored[0] ?? null;
}

export async function getAllSpotlights() {
  await expireStaleBids();
  const bids = await prisma.bid.findMany({
    where: { status: "active", expiresAt: { gt: new Date() } },
    include: { app: { include: { user: true } } },
  });
  const byTier = new Map<string, (typeof bids)[number] & { effectiveAmount: number }>();
  for (const bid of bids) {
    const effectiveAmount = effectiveBidAmount(toNumber(bid.bidAmount), bid.createdAt);
    const current = byTier.get(bid.targetTier);
    if (!current || effectiveAmount > current.effectiveAmount) {
      byTier.set(bid.targetTier, { ...bid, effectiveAmount });
    }
  }
  return byTier;
}

async function averageElo(): Promise<number> {
  const agg = await prisma.app.aggregate({ _avg: { eloScore: true } });
  return Math.round(agg._avg.eloScore ?? DEFAULT_ELO);
}

export async function applySwipeElo(appId: string, direction: "ship" | "skip" | "super_ship") {
  const app = await prisma.app.findUnique({ where: { id: appId } });
  if (!app) throw new Error("App not found");
  const opponent = await averageElo();
  const won = direction !== "skip";
  const k = direction === "super_ship" ? SUPER_SHIP_K : ELO_K;
  const eloScore = applyElo(app.eloScore, opponent, won, k);
  const superShipUntil =
    direction === "super_ship"
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : app.superShipUntil;
  return prisma.app.update({
    where: { id: appId },
    data: {
      eloScore,
      superShipUntil,
      superShipImpressions:
        direction === "super_ship" ? { increment: 500 } : undefined,
    },
  });
}

export async function fulfillPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status === "completed") return payment;

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "completed" },
  });

  if (payment.kind === "outbid" && payment.appId && payment.targetTier) {
    await fulfillOutbid({
      appId: payment.appId,
      bidderUserId: payment.userId,
      amount: toNumber(payment.amount),
      targetTier: payment.targetTier,
    });
  }

  if (payment.kind === "super_ship" && payment.appId) {
    await applySwipeElo(payment.appId, "super_ship");
    await prisma.swipe.upsert({
      where: {
        voterUserId_appId: { voterUserId: payment.userId, appId: payment.appId },
      },
      update: { direction: "super_ship" },
      create: {
        voterUserId: payment.userId,
        appId: payment.appId,
        direction: "super_ship",
      },
    });
    await prisma.watchlist.upsert({
      where: { userId_appId: { userId: payment.userId, appId: payment.appId } },
      update: {},
      create: { userId: payment.userId, appId: payment.appId },
    });
  }

  if (payment.kind === "call_bs" && payment.appId) {
    await prisma.challenge.create({
      data: {
        challengerId: payment.userId,
        targetAppId: payment.appId,
        stakeAmount: new Prisma.Decimal(10),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: "pending",
      },
    });
  }

  if (payment.kind === "verify") {
    await verifyFounder(payment.userId);
  }

  return prisma.payment.findUnique({ where: { id: paymentId } });
}

export async function fulfillOutbid(args: {
  appId: string;
  bidderUserId: string;
  amount: number;
  targetTier: string;
}) {
  const app = await prisma.app.findUnique({
    where: { id: args.appId },
    include: { user: true },
  });
  if (!app) throw new Error("App not found");

  const previous = await getSpotlight(args.targetTier);

  await prisma.bid.create({
    data: {
      appId: args.appId,
      bidderUserId: args.bidderUserId,
      bidAmount: new Prisma.Decimal(args.amount),
      targetTier: args.targetTier,
      expiresAt: bidExpiresAt(),
      status: "active",
    },
  });

  if (previous && previous.appId !== args.appId) {
    await prisma.bid.update({
      where: { id: previous.id },
      data: { status: "outbid" },
    });
    const slot =
      args.targetTier === GLOBAL_TOP_SLOT
        ? "the global header banner"
        : `the ${args.targetTier.replaceAll("_", " ")} tier`;
    await prisma.notification.create({
      data: {
        userId: previous.app.userId,
        title: "You were dethroned",
        body: `You were dethroned by @${app.user.username} for $${args.amount} on ${slot}.`,
        counterBidUrl: `${appUrl()}/leaderboard?outbid=${args.targetTier}&min=${Math.ceil(args.amount) + 1}`,
      },
    });
  }
}

export async function verifyFounder(userId: string) {
  const app = await prisma.app.findUnique({ where: { userId } });
  if (!app) throw new Error("Submit an app before verifying MRR.");

  await prisma.app.update({
    where: { id: app.id },
    data: { isVerified: true, homelessUntil: null },
  });

  const pending = await prisma.challenge.findMany({
    where: { targetAppId: app.id, status: "pending" },
  });

  for (const challenge of pending) {
    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: "verified_success" },
    });
    await prisma.notification.create({
      data: {
        userId: challenge.challengerId,
        title: "Call BS failed",
        body: `@${(await prisma.user.findUnique({ where: { id: userId } }))?.username ?? "founder"} verified via Stripe. Your $10 stake goes to them (80/20 split). They are now a Verified Legend.`,
      },
    });
    await prisma.notification.create({
      data: {
        userId,
        title: "Verified Legend",
        body: "Stripe verification succeeded. You kept the rank and collected the Call BS stake.",
      },
    });
  }
}

export async function resolveExpiredChallenges(now = new Date()) {
  const expired = await prisma.challenge.findMany({
    where: { status: "pending", expiresAt: { lte: now } },
    include: { targetApp: { include: { user: true } }, challenger: true },
  });

  for (const challenge of expired) {
    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: "failed_unverified" },
    });
    await prisma.app.update({
      where: { id: challenge.targetAppId },
      data: {
        homelessUntil: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        isVerified: false,
      },
    });
    await prisma.notification.create({
      data: {
        userId: challenge.targetApp.userId,
        title: "Rank drop: Homeless",
        body: `@${challenge.challenger.username} called BS and you didn't verify in 48h. You're Homeless for 14 days.`,
      },
    });
    await prisma.notification.create({
      data: {
        userId: challenge.challengerId,
        title: "Call BS landed",
        body: `@${challenge.targetApp.user.username} failed to verify. You get your $10 back plus bonus hype.`,
      },
    });
  }

  return expired.length;
}

export async function createPendingPayment(args: {
  userId: string;
  kind: PaymentKind;
  amount: number;
  appId?: string;
  targetTier?: string;
}) {
  return prisma.payment.create({
    data: {
      userId: args.userId,
      kind: args.kind,
      amount: new Prisma.Decimal(args.amount),
      appId: args.appId,
      targetTier: args.targetTier,
      status: "pending",
    },
  });
}
