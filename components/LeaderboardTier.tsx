"use client";

import { useState } from "react";
import Link from "next/link";
import type { RankedApp } from "@/lib/ranking";
import { formatMrr, type Tier } from "@/lib/tiers";
import { BiddingModal } from "@/components/BiddingModal";
import { CallBsModal } from "@/components/CallBsModal";
import { IndieRoast } from "@/components/IndieRoast";
import { RankBadge } from "@/components/TierIcon";
import { BrokieTrigger } from "@/components/BrokieEgg";

type Spotlight = {
  appId: string;
  effectiveAmount: number;
  username: string;
  appName: string;
};

export function LeaderboardTier({
  tier,
  apps,
  spotlight,
  myAppId,
}: {
  tier: Tier;
  apps: RankedApp[];
  spotlight: Spotlight | null;
  myAppId?: string;
}) {
  const [bidApp, setBidApp] = useState<string | null>(null);
  const [bsApp, setBsApp] = useState<RankedApp | null>(null);

  return (
    <section
      className="rounded-3xl border bg-card p-5"
      style={{ borderColor: `${tier.color}66` }}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {formatMrr(tier.minMrr)}
            {tier.maxMrr === null ? "+" : ` – ${formatMrr(tier.maxMrr)}`} / mo
          </p>
          <h2 className="display flex items-center gap-3 text-4xl" style={{ color: tier.color }}>
            {tier.slug === "homeless" ? (
              <BrokieTrigger>
                <RankBadge tier={tier} size={64} />
              </BrokieTrigger>
            ) : (
              <RankBadge tier={tier} size={64} />
            )}
            {tier.label}
          </h2>
        </div>
        {spotlight ? (
          <div className="rounded-2xl border border-line bg-accent px-4 py-2 text-sm text-accent-fg">
            Hijacked by @{spotlight.username} · ${spotlight.effectiveAmount} effective
          </div>
        ) : (
          <p className="text-xs text-muted">No paid hijack. Organic for now.</p>
        )}
      </div>
      <div className="mb-4">
        <IndieRoast slug={tier.slug} />
      </div>
      <div className="space-y-2">
        {apps.length === 0 ? (
          <p className="text-sm text-muted">Empty tier. Claim it.</p>
        ) : (
          apps.map((app, i) => (
            <div
              key={app.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-background px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-8 font-mono text-accent-fg">
                  <span className="rounded-sm bg-accent px-1">#{app.tierRank}</span>
                </span>
                {app.user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={app.user.avatarUrl} alt="" className="h-9 w-9 rounded-full bg-line" />
                ) : null}
                <div className="min-w-0">
                  <Link href={`/u/${app.user.username}`} className="font-semibold hover:underline">
                    {app.name}
                  </Link>
                  <p className="truncate text-xs text-muted">
                    @{app.user.username} · {app.delusionLabel}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm">{app.eloScore} ELO</span>
                <span className="font-mono text-xs text-muted">{formatMrr(app.mrrAmount)}</span>
                {app.isVerified ? (
                  <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
                    TRUSTMRR
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBsApp(app)}
                    className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px]"
                  >
                    Call BS
                  </button>
                )}
                {i < 3 && myAppId ? (
                  <button
                    type="button"
                    onClick={() => setBidApp(myAppId)}
                    className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-fg"
                  >
                    Outbid
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
      {bidApp ? (
        <BiddingModal
          appId={bidApp}
          targetTier={tier.slug}
          currentHigh={spotlight?.effectiveAmount ?? 0}
          open
          onClose={() => setBidApp(null)}
        />
      ) : null}
      {bsApp ? (
        <CallBsModal
          appId={bsApp.id}
          founder={bsApp.user.username}
          open
          onClose={() => setBsApp(null)}
        />
      ) : null}
    </section>
  );
}
