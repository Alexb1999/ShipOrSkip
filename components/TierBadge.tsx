import { mrrToTier, type Tier } from "@/lib/tiers";

export function TierBadge({
  mrr,
  homelessUntil,
  verified,
  compact,
}: {
  mrr: number;
  homelessUntil?: Date | null;
  verified?: boolean;
  compact?: boolean;
}) {
  const tier = mrrToTier(mrr, homelessUntil);
  return <TierChip tier={tier} verified={verified} compact={compact} />;
}

export function TierChip({
  tier,
  verified,
  compact,
}: {
  tier: Tier;
  verified?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono uppercase tracking-wider ${compact ? "text-[10px]" : "text-xs"}`}
      style={{
        color: tier.color,
        borderColor: `${tier.color}66`,
        background: `${tier.color}1a`,
        boxShadow: tier.slug === "billionaire_path" ? `0 0 18px ${tier.color}55` : undefined,
      }}
    >
      {tier.label}
      {verified ? <span className="text-[10px] text-sky-300">✓ Verified Legend</span> : null}
    </span>
  );
}
