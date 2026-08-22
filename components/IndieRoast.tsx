"use client";

import { useState } from "react";
import { quoteFor } from "@/lib/roasts";
import type { TierSlug } from "@/lib/tiers";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.735-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function IndieRoast({
  slug,
  seed,
  compact,
  className = "",
}: {
  slug: TierSlug;
  seed?: string;
  compact?: boolean;
  className?: string;
}) {
  const { voice, quote } = quoteFor(slug, seed);
  const [imgOk, setImgOk] = useState(true);

  return (
    <figure
      className={`flex h-full gap-3 rounded-2xl border border-line bg-background ${compact ? "p-2.5" : "p-3"} ${className}`}
    >
      <a
        href={`https://x.com/${voice.handle}`}
        target="_blank"
        rel="noreferrer"
        className="shrink-0"
      >
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={voice.portrait}
            alt={`@${voice.handle}`}
            className={`rounded-full border border-line object-cover ${compact ? "h-12 w-12" : "h-16 w-16"}`}
            onError={() => setImgOk(false)}
          />
        ) : (
          <span
            className={`flex items-center justify-center rounded-full border border-line bg-line font-mono ${compact ? "h-12 w-12 text-sm" : "h-16 w-16 text-lg"}`}
          >
            {voice.handle.slice(0, 1).toUpperCase()}
          </span>
        )}
      </a>
      <figcaption className="min-w-0">
        <p className={`leading-snug ${compact ? "text-xs" : "text-sm"}`}>“{quote}”</p>
        <a
          href={`https://x.com/${voice.handle}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-muted hover:text-foreground"
        >
          <XLogo className="h-3 w-3" />
          @{voice.handle}
        </a>
      </figcaption>
    </figure>
  );
}
