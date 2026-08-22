import { prisma } from "@/lib/db";
import { delusionLabel, delusionRatio, type DelusionLabel } from "@/lib/delusion";
import { mrrToTier, type Tier } from "@/lib/tiers";
import { toNumber } from "@/lib/money";
import type { App, User } from "@prisma/client";

export type RankedApp = {
  id: string;
  name: string;
  tagline: string;
  websiteUrl: string;
  pitchVideoUrl: string | null;
  screenshotUrl: string | null;
  techStack: string[];
  mrrAmount: number;
  isVerified: boolean;
  eloScore: number;
  homelessUntil: Date | null;
  superShipUntil: Date | null;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
  tier: Tier;
  globalRank: number;
  eloRank: number;
  mrrRank: number;
  delusionRatio: number;
  delusionLabel: DelusionLabel;
};

type AppWithUser = App & { user: User };

function effectiveMrr(app: App): number {
  if (app.homelessUntil && app.homelessUntil.getTime() > Date.now()) return 0;
  return toNumber(app.mrrAmount);
}

export function rankApps(apps: AppWithUser[]): RankedApp[] {
  const byElo = [...apps].sort((a, b) => b.eloScore - a.eloScore);
  const byMrr = [...apps].sort((a, b) => effectiveMrr(b) - effectiveMrr(a));
  const eloRank = new Map(byElo.map((app, i) => [app.id, i + 1]));
  const mrrRank = new Map(byMrr.map((app, i) => [app.id, i + 1]));
  const total = Math.max(apps.length, 1);

  const ranked = apps.map((app) => {
    const mrr = effectiveMrr(app);
    const er = eloRank.get(app.id) ?? total;
    const mr = mrrRank.get(app.id) ?? total;
    return {
      id: app.id,
      name: app.name,
      tagline: app.tagline,
      websiteUrl: app.websiteUrl,
      pitchVideoUrl: app.pitchVideoUrl,
      screenshotUrl: app.screenshotUrl,
      techStack: app.techStack,
      mrrAmount: mrr,
      isVerified: app.isVerified,
      eloScore: app.eloScore,
      homelessUntil: app.homelessUntil,
      superShipUntil: app.superShipUntil,
      createdAt: app.createdAt,
      user: {
        id: app.user.id,
        username: app.user.username,
        name: app.user.name,
        avatarUrl: app.user.avatarUrl,
      },
      tier: mrrToTier(mrr, app.homelessUntil),
      globalRank: er,
      eloRank: er,
      mrrRank: mr,
      delusionRatio: delusionRatio(mr, er),
      delusionLabel: delusionLabel({ mrr, mrrRank: mr, eloRank: er, total }),
    };
  });

  ranked.sort((a, b) => a.globalRank - b.globalRank);
  return ranked;
}

export async function getRankedApps(): Promise<RankedApp[]> {
  const apps = await prisma.app.findMany({ include: { user: true } });
  return rankApps(apps);
}

export async function getAppByUsername(username: string): Promise<RankedApp | null> {
  const ranked = await getRankedApps();
  return ranked.find((a) => a.user.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
