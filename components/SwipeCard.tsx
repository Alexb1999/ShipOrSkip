"use client";

import type { RankedApp } from "@/lib/ranking";
import { appPreviewSrc } from "@/lib/preview";
import { formatMrr } from "@/lib/tiers";
import { TierChip } from "@/components/TierBadge";
import { IndieRoast } from "@/components/IndieRoast";

export function SwipeCard({
  app,
  offset = 0,
}: {
  app: RankedApp;
  offset?: number;
}) {
  return (
    <article
      className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-card shadow-sm"
      style={{
        transform: `scale(${1 - offset * 0.04}) translateY(${offset * 12}px)`,
        zIndex: 10 - offset,
      }}
    >
      <a
        href={app.websiteUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative block h-[36%] min-h-36 bg-line bg-cover bg-center"
        style={{ backgroundImage: `url(${appPreviewSrc(app)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
          visit site ↗
        </span>
      </a>
      <div className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              @{app.user.username}
            </p>
            <a
              href={app.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="display text-3xl leading-none underline-offset-4 hover:underline"
            >
              {app.name}
            </a>
          </div>
          {app.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.user.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full border border-line bg-line"
            />
          ) : null}
        </div>
        <p className="text-sm">{app.tagline}</p>
        <div className="flex flex-wrap gap-2">
          <TierChip tier={app.tier} verified={app.isVerified} compact />
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
            {formatMrr(app.mrrAmount)} MRR
          </span>
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
            {app.eloScore} ELO · #{app.tierRank} {app.tier.label}
          </span>
          <span className="rounded-full border border-line bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-fg">
            {app.delusionLabel}
          </span>
        </div>
        <IndieRoast slug={app.tier.slug} seed={app.id} compact />
        <div className="flex flex-wrap gap-1">
          {app.techStack.map((tag) => (
            <span key={tag} className="rounded bg-background px-2 py-0.5 font-mono text-[10px] text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
