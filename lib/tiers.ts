export type TierSlug =
  | "homeless"
  | "pity_purchase"
  | "ramen"
  | "still_9_5"
  | "no_more_9_5"
  | "rich_af"
  | "fuck_you_money"
  | "billionaire_path";

export type Tier = {
  slug: TierSlug;
  label: string;
  minMrr: number;
  maxMrr: number | null;
  color: string;
  accent: string;
  theme: string;
};

export const TIERS: Tier[] = [
  {
    slug: "homeless",
    label: "Homeless",
    minMrr: 0,
    maxMrr: 0,
    color: "#9CA3AF",
    accent: "#6B7280",
    theme: "Grey / cardboard / monospace",
  },
  {
    slug: "pity_purchase",
    label: "Pity Purchase",
    minMrr: 1,
    maxMrr: 999,
    color: "#EAB308",
    accent: "#A16207",
    theme: "Sickly gold / one Stripe notification",
  },
  {
    slug: "ramen",
    label: "Ramen & Noodles",
    minMrr: 1000,
    maxMrr: 5000,
    color: "#F97316",
    accent: "#C2410C",
    theme: "Orange / warm noodle",
  },
  {
    slug: "still_9_5",
    label: "Still 9-5",
    minMrr: 5001,
    maxMrr: 9999,
    color: "#22C55E",
    accent: "#15803D",
    theme: "Olive drab / you can almost quit",
  },
  {
    slug: "no_more_9_5",
    label: "No More 9-5",
    minMrr: 10000,
    maxMrr: 25000,
    color: "#3B82F6",
    accent: "#1D4ED8",
    theme: "Electric blue / badge of freedom",
  },
  {
    slug: "rich_af",
    label: "Rich AF",
    minMrr: 25001,
    maxMrr: 100000,
    color: "#FBBF24",
    accent: "#D97706",
    theme: "Gold / glowing highlights",
  },
  {
    slug: "fuck_you_money",
    label: "Fuck You Money",
    minMrr: 100001,
    maxMrr: 500000,
    color: "#C084FC",
    accent: "#7C3AED",
    theme: "Diamond / cyberpunk purple",
  },
  {
    slug: "billionaire_path",
    label: "Tech Oligarch",
    minMrr: 500001,
    maxMrr: null,
    color: "#C6F03C",
    accent: "#84A318",
    theme: "Holographic / fire",
  },
];

export function mrrToTier(
  mrr: number,
  homelessUntil?: Date | null,
): Tier {
  if (homelessUntil && homelessUntil.getTime() > Date.now()) {
    return TIERS[0];
  }
  const amount = Number(mrr) || 0;
  if (amount <= 0) return TIERS[0];
  for (const tier of TIERS) {
    if (tier.maxMrr === null && amount >= tier.minMrr) return tier;
    if (amount >= tier.minMrr && tier.maxMrr !== null && amount <= tier.maxMrr) {
      return tier;
    }
  }
  return TIERS[TIERS.length - 1];
}

const LEGACY_SLUGS: Record<string, TierSlug> = {
  american_peasant: "still_9_5",
};

export function resolveTierSlug(slug: string): TierSlug {
  return LEGACY_SLUGS[slug] ?? (TIERS.some((t) => t.slug === slug) ? (slug as TierSlug) : "homeless");
}

export function getTierBySlug(slug: string): Tier | undefined {
  const resolved = LEGACY_SLUGS[slug] ?? slug;
  return TIERS.find((t) => t.slug === resolved);
}

export function formatMrr(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const GLOBAL_TOP_SLOT = "global_top";

export function formatTierSlot(slot: string): string {
  if (slot === GLOBAL_TOP_SLOT) return "global banner";
  return getTierBySlug(slot)?.label ?? slot.replaceAll("_", " ");
}
