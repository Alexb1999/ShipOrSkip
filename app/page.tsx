import Link from "next/link";
import { prisma } from "@/lib/db";
import { getRankedApps } from "@/lib/ranking";
import { TIERS, formatMrr } from "@/lib/tiers";
import { usd } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [ranked, swipes, bids] = await Promise.all([
    getRankedApps(),
    prisma.swipe.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { app: true, voter: true },
    }),
    prisma.bid.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { app: { include: { user: true } } },
    }),
  ]);

  const ticker = [
    ...swipes.map(
      (s) =>
        `@${s.voter.username} ${s.direction === "skip" ? "skipped" : "shipped"} ${s.app.name}`,
    ),
    ...bids.map((b) => `@${b.app.user.username} bid ${usd(Number(b.bidAmount))} on ${b.targetTier}`),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-ramen">Indie hacker colosseum</p>
      <h1 className="display mt-3 max-w-4xl text-6xl leading-[0.9] sm:text-8xl">
        Rank your MRR.
        <br />
        Get roasted.
        <br />
        Pay to stay #1.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Self-report revenue. Collect a satirical tier. Flex the Open Graph card on X. Rivals swipe Ship or
        Skip — or they just outbid you.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
          Claim your rank
        </Link>
        <Link href="/deck" className="rounded-full border border-line px-5 py-3 text-sm">
          Enter the deck
        </Link>
        <Link href="/leaderboard" className="rounded-full border border-line px-5 py-3 text-sm">
          See the ladder
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-full border border-line bg-black/30 py-2">
        <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap font-mono text-xs text-muted">
          {(ticker.length ? ticker : ["Waiting for the first blood…"]).concat(ticker).join("   ·   ")}
        </div>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => {
          const count = ranked.filter((a) => a.tier.slug === tier.slug).length;
          return (
            <div key={tier.slug} className="rounded-2xl border border-line p-4" style={{ borderColor: `${tier.color}55` }}>
              <p className="display text-2xl" style={{ color: tier.color }}>
                {tier.label}
              </p>
              <p className="font-mono text-xs text-muted">
                {formatMrr(tier.minMrr)}
                {tier.maxMrr == null ? "+" : `–${formatMrr(tier.maxMrr)}`} · {count} founders
              </p>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
