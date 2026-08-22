"use client";

import type { RankedApp } from "@/lib/ranking";
import { formatMrr } from "@/lib/tiers";
import { TierChip } from "@/components/TierBadge";

export function SwipeCard({
  app,
  offset = 0,
}: {
  app: RankedApp;
  offset?: number;
}) {
  return (
    <article
      className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl"
      style={{
        transform: `scale(${1 - offset * 0.04}) translateY(${offset * 12}px)`,
        zIndex: 10 - offset,
      }}
    >
      <div
        className="h-56 bg-cover bg-center"
        style={{
          backgroundImage: app.screenshotUrl
            ? `linear-gradient(to top, #0f172a, transparent 45%), url(${app.screenshotUrl})`
            : `linear-gradient(135deg, ${app.tier.accent}, ${app.tier.color})`,
        }}
      />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              @{app.user.username}
            </p>
            <h2 className="display text-4xl leading-none">{app.name}</h2>
          </div>
          {app.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.user.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full border border-white/20 bg-black"
            />
          ) : null}
        </div>
        <p className="text-sm text-slate-200">{app.tagline}</p>
        <div className="flex flex-wrap gap-2">
          <TierChip tier={app.tier} verified={app.isVerified} compact />
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
            {formatMrr(app.mrrAmount)} MRR
          </span>
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
            {app.eloScore} ELO · #{app.globalRank}
          </span>
          <span className="rounded-full border border-fym/40 bg-fym/10 px-2 py-0.5 font-mono text-[10px] text-fym">
            {app.delusionLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {app.techStack.map((tag) => (
            <span key={tag} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
