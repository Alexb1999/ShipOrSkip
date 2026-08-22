import Link from "next/link";
import { prisma } from "@/lib/db";
import { getRankedApps } from "@/lib/ranking";
import { TIERS, formatMrr, formatTierSlot } from "@/lib/tiers";
import { usd } from "@/lib/money";
import { IndieRoast } from "@/components/IndieRoast";
import { RankBadge } from "@/components/TierIcon";
import { BrokieTrigger } from "@/components/BrokieEgg";

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
    ...bids.map((b) => `@${b.app.user.username} bid ${usd(Number(b.bidAmount))} on ${formatTierSlot(b.targetTier)}`),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted">Indie hacker colosseum</p>
      <h1 className="display mt-3 max-w-4xl text-6xl leading-[0.9] sm:text-8xl">
        Rank your MRR.
        <br />
        Get roasted.
        <br />
        Pay to stay #1.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Self-report MRR. Get a meme rank. Swipe the rest — or pay to stay #1.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/submit" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-fg">
          Claim your rank
        </Link>
        <Link href="/deck" className="rounded-full border border-line px-5 py-3 text-sm">
          Ship or Skip
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => {
          const count = ranked.filter((a) => a.tier.slug === tier.slug).length;
          return (
            <div
              key={tier.slug}
              className="row-span-3 grid grid-rows-subgrid rounded-2xl border bg-card p-4"
              style={{ borderColor: `${tier.color}66` }}
            >
              <div className="flex flex-col items-center text-center">
                {tier.slug === "homeless" ? (
                  <BrokieTrigger>
                    <RankBadge tier={tier} size={72} />
                  </BrokieTrigger>
                ) : (
                  <RankBadge tier={tier} size={72} />
                )}
                <p className="display mt-2 text-2xl leading-tight" style={{ color: tier.color }}>
                  {tier.label}
                </p>
              </div>
              <p className="mt-1 text-center font-mono text-xs text-muted">
                {formatMrr(tier.minMrr)}
                {tier.maxMrr == null ? "+" : `–${formatMrr(tier.maxMrr)}`} · {count} founders
              </p>
              <div className="min-h-0">
                <IndieRoast slug={tier.slug} compact />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-10 overflow-hidden rounded-full border border-line bg-card py-2">
        <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap font-mono text-xs text-muted">
          {(ticker.length ? ticker : ["Waiting for the first blood…"]).concat(ticker).join("   ·   ")}
        </div>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted">
        Quotes are parody. The legends did not endorse this. Go join them anyway.
      </p>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
