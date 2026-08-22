"use client";

import { useState } from "react";
import Link from "next/link";
import type { RankedApp } from "@/lib/ranking";
import { formatMrr, type Tier } from "@/lib/tiers";
import { BiddingModal } from "@/components/BiddingModal";
import { CallBsModal } from "@/components/CallBsModal";

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
    <section className="rounded-3xl border border-line bg-card/70 p-5" style={{ borderColor: `${tier.color}44` }}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: tier.color }}>
            {tier.theme}
          </p>
          <h2 className="display text-4xl" style={{ color: tier.color }}>
            {tier.label}
          </h2>
          <p className="text-xs text-muted">
            {formatMrr(tier.minMrr)}
            {tier.maxMrr === null ? "+" : ` – ${formatMrr(tier.maxMrr)}`} / mo
          </p>
        </div>
        {spotlight ? (
          <div className="rounded-2xl border px-4 py-2 text-sm" style={{ borderColor: tier.color }}>
            Hijacked by @{spotlight.username} · ${spotlight.effectiveAmount} effective
          </div>
        ) : (
          <p className="text-xs text-muted">No paid hijack. Organic for now.</p>
        )}
      </div>
      <div className="space-y-2">
        {apps.length === 0 ? (
          <p className="text-sm text-muted">Empty tier. Claim it.</p>
        ) : (
          apps.map((app, i) => (
            <div
              key={app.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-black/20 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-8 font-mono text-muted">#{i + 1}</span>
                {app.user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={app.user.avatarUrl} alt="" className="h-9 w-9 rounded-full bg-black" />
                ) : null}
                <div className="min-w-0">
                  <Link href={`/u/${app.user.username}`} className="font-semibold hover:underline">
                    {app.name}
                  </Link>
                  <p className="truncate text-xs text-muted">
                    @{app.user.username} · {app.delusionLabel} · {app.eloScore} ELO
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm">{formatMrr(app.mrrAmount)}</span>
                {app.isVerified ? (
                  <span className="rounded-full bg-sky-400/15 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                    VERIFIED
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBsApp(app)}
                    className="rounded-full border border-rose-400/40 px-2 py-0.5 font-mono text-[10px] text-rose-300"
                  >
                    Call BS
                  </button>
                )}
                {i < 3 && myAppId ? (
                  <button
                    type="button"
                    onClick={() => setBidApp(myAppId)}
                    className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] text-black"
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
