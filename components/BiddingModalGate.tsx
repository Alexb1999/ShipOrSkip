"use client";

import { useState } from "react";
import { BiddingModal } from "@/components/BiddingModal";
import { GLOBAL_TOP_SLOT, type TierSlug } from "@/lib/tiers";

export function BiddingModalGate({
  appId,
  targetTier,
  currentHigh,
  label,
  autoOpen,
}: {
  appId: string;
  targetTier: string;
  currentHigh: number;
  label: string;
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(autoOpen));
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg"
      >
        {label}
      </button>
      <BiddingModal
        appId={appId}
        targetTier={targetTier as TierSlug | typeof GLOBAL_TOP_SLOT}
        currentHigh={currentHigh}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
