import { auth } from "@/auth";
import { LeaderboardTier } from "@/components/LeaderboardTier";
import { BiddingModalGate } from "@/components/BiddingModalGate";
import { getAllSpotlights } from "@/lib/economy";
import { getRankedApps } from "@/lib/ranking";
import { GLOBAL_TOP_SLOT, TIERS, formatMrr } from "@/lib/tiers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ outbid?: string; min?: string; paid?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const [ranked, spotlights] = await Promise.all([getRankedApps(), getAllSpotlights()]);
  const mine = session?.user?.id
    ? await prisma.app.findUnique({ where: { userId: session.user.id } })
    : null;
  const global = spotlights.get(GLOBAL_TOP_SLOT);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Satirical MRR ladder</p>
        <h1 className="display text-6xl">The tiers of cope</h1>
      </div>

      {global ? (
        <div
          className="overflow-hidden rounded-3xl border p-6"
          style={{ borderColor: global.app ? "#fbbf24" : "#334155" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rich">Global header hijack</p>
          <p className="display text-4xl">
            {global.app.name} owns the skyline for ${global.effectiveAmount}
          </p>
          <p className="text-sm text-muted">
            @{global.app.user.username} · {formatMrr(Number(global.app.mrrAmount))} MRR · decays 20%/day
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-line p-6 text-sm text-muted">
          Global banner is unclaimed. First $10 steals it.
        </div>
      )}

      {mine ? (
        <div className="flex flex-wrap gap-2">
          <BiddingModalGate
            appId={mine.id}
            targetTier={GLOBAL_TOP_SLOT}
            currentHigh={global?.effectiveAmount ?? 0}
            label="Hijack global banner"
          />
        </div>
      ) : null}

      {params.paid ? (
        <p className="rounded-xl border border-surviving/40 bg-surviving/10 px-4 py-2 text-sm text-surviving">
          Payment captured ({params.paid}). Rank incoming.
        </p>
      ) : null}

      {TIERS.map((tier) => (
        <LeaderboardTier
          key={tier.slug}
          tier={tier}
          apps={ranked.filter((a) => a.tier.slug === tier.slug)}
          spotlight={
            spotlights.get(tier.slug)
              ? {
                  appId: spotlights.get(tier.slug)!.appId,
                  effectiveAmount: spotlights.get(tier.slug)!.effectiveAmount,
                  username: spotlights.get(tier.slug)!.app.user.username,
                  appName: spotlights.get(tier.slug)!.app.name,
                }
              : null
          }
          myAppId={mine?.id}
        />
      ))}

      {mine && params.outbid ? (
        <BiddingModalGate
          appId={mine.id}
          targetTier={params.outbid}
          currentHigh={Number(params.min ?? 10)}
          autoOpen
          label="Counter-bid"
        />
      ) : null}
    </div>
  );
}
