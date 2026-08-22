export type TierSlug =
  | "homeless"
  | "ramen"
  | "surviving"
  | "replacing_9_5"
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
    slug: "ramen",
    label: "Ramen & Noodles",
    minMrr: 1,
    maxMrr: 1000,
    color: "#F97316",
    accent: "#C2410C",
    theme: "Orange / warm noodle",
  },
  {
    slug: "surviving",
    label: "Surviving",
    minMrr: 1001,
    maxMrr: 5000,
    color: "#22C55E",
    accent: "#15803D",
    theme: "Green / basic utility",
  },
  {
    slug: "replacing_9_5",
    label: "Replacing 9-5",
    minMrr: 5001,
    maxMrr: 10000,
    color: "#3B82F6",
    accent: "#1D4ED8",
    theme: "Electric blue / badge of freedom",
  },
  {
    slug: "rich_af",
    label: "Rich AF",
    minMrr: 10001,
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
    label: "Billionaire Path",
    minMrr: 500001,
    maxMrr: null,
    color: "#FB7185",
    accent: "#F43F5E",
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

export function getTierBySlug(slug: string): Tier | undefined {
  return TIERS.find((t) => t.slug === slug);
}

export function formatMrr(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const GLOBAL_TOP_SLOT = "global_top";
