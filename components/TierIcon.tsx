import type { Tier, TierSlug } from "@/lib/tiers";
import { getTierBySlug, TIERS } from "@/lib/tiers";

const RANK_NO: Record<TierSlug, number> = {
  homeless: 1,
  pity_purchase: 2,
  ramen: 3,
  still_9_5: 4,
  no_more_9_5: 5,
  rich_af: 6,
  fuck_you_money: 7,
  billionaire_path: 8,
};

function Emblem({ slug }: { slug: TierSlug }) {
  const common = { fill: "currentColor" };
  switch (slug) {
    case "homeless":
      return (
        <g>
          <path d="M22 34h36l-4 22H26L22 34Z" {...common} />
          <path d="M22 34 40 42l18-8-10-10h-16L22 34Z" {...common} opacity={0.7} />
        </g>
      );
    case "pity_purchase":
      return (
        <g>
          <circle cx="40" cy="38" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M40 28v20M34 33c1-3 4-4 6-4 4 0 6 2 6 5 0 6-12 3-12 9 0 3 3 5 6 5 3 0 5-1 6-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case "ramen":
      return (
        <g>
          <path d="M24 40h32v4c0 8-7 14-16 14s-16-6-16-14v-4Z" {...common} />
          <path d="M30 40V30M40 40V28M50 40V31" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    case "still_9_5":
      return (
        <g>
          <path d="M30 30h20v4H30v-4Z" {...common} />
          <path d="M24 34h32v22H24V34Z" {...common} />
          <path d="M36 42h8" fill="none" stroke="#111" strokeWidth="2.4" strokeLinecap="round" opacity={0.35} />
        </g>
      );
    case "no_more_9_5":
      return (
        <g>
          <path d="M40 22 46 34h12l-10 8 4 12-12-7-12 7 4-12-10-8h12Z" {...common} />
        </g>
      );
    case "rich_af":
      return (
        <g>
          <path d="M24 34 40 22l16 12v8c0 10-7 16-16 19-9-3-16-9-16-19v-8Z" {...common} />
          <path d="M32 36h16l-2 6H34l-2-6Z" fill="#111" opacity={0.25} />
        </g>
      );
    case "fuck_you_money":
      return (
        <g>
          <path d="M40 20 46 36h16l-13 10 5 16-14-9-14 9 5-16-13-10h16Z" {...common} />
        </g>
      );
    case "billionaire_path":
      return (
        <g>
          <circle cx="40" cy="38" r="7" {...common} />
          <path d="M22 38h36M40 22c8 6 8 22 0 32M40 22c-8 6-8 22 0 32" fill="none" stroke="currentColor" strokeWidth="2.8" />
          <path d="M40 16l3 7h8l-6 5 2 8-7-4-7 4 2-8-6-5h8l3-7Z" {...common} />
        </g>
      );
  }
}

export function RankBadge({
  slug,
  size = 56,
  tier: tierProp,
}: {
  slug?: string;
  size?: number;
  tier?: Tier;
}) {
  const tier = tierProp ?? (slug ? getTierBySlug(slug) : undefined) ?? TIERS[0];
  const resolvedSlug = tier.slug;
  const n = RANK_NO[resolvedSlug] ?? 1;
  const gid = `medal-${resolvedSlug}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className="shrink-0 drop-shadow-sm"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gid}-metal`} x1="20" y1="8" x2="60" y2="72">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="35%" stopColor={tier.color} />
          <stop offset="100%" stopColor={tier.accent} />
        </linearGradient>
        <linearGradient id={`${gid}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${gid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.4" floodColor={tier.color} floodOpacity="0.65" />
        </filter>
      </defs>
      <g filter={`url(#${gid}-glow)`}>
        <polygon
          points="40,6 70,22 70,54 40,74 10,54 10,22"
          fill={`url(#${gid}-metal)`}
          stroke={tier.accent}
          strokeWidth="2"
        />
        <polygon points="40,14 62,26 62,50 40,64 18,50 18,26" fill="#111" opacity="0.18" />
        <g style={{ color: "#111" }} transform="translate(0, -1)">
          <Emblem slug={resolvedSlug} />
        </g>
        <polygon points="40,6 70,22 40,30 10,22" fill={`url(#${gid}-shine)`} />
      </g>
      <g>
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={16 + i * 6}
            y={72}
            width="4.5"
            height="5"
            rx="0.8"
            fill={i < n ? tier.color : `${tier.color}33`}
            stroke={tier.accent}
            strokeWidth="0.4"
          />
        ))}
      </g>
    </svg>
  );
}

export function RankMark({
  slug,
  className = "h-5 w-5",
}: {
  slug: TierSlug;
  className?: string;
}) {
  return <RankBadge slug={slug} size={22} />;
}

/** @deprecated use RankBadge */
export function TierIcon({
  slug,
  className = "h-5 w-5",
}: {
  slug: TierSlug;
  className?: string;
}) {
  const px = className.includes("h-7") ? 28 : className.includes("h-6") ? 24 : className.includes("h-3") ? 16 : 20;
  return <RankBadge slug={slug} size={px} />;
}

export function tierRankNo(slug: TierSlug) {
  return RANK_NO[slug];
}

export function RankBadgeForTier({ tier, size }: { tier: Tier; size?: number }) {
  return <RankBadge tier={tier} size={size} />;
}
