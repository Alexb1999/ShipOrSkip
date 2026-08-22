"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GLOBAL_TOP_SLOT, type TierSlug } from "@/lib/tiers";
import { minNextBid, MIN_BID } from "@/lib/bids";

export function BiddingModal({
  appId,
  targetTier,
  currentHigh,
  open,
  onClose,
}: {
  appId: string;
  targetTier: TierSlug | typeof GLOBAL_TOP_SLOT;
  currentHigh: number;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const min = useMemo(() => Math.max(MIN_BID, minNextBid(currentHigh)), [currentHigh]);
  const [amount, setAmount] = useState(String(min));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function pay() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "outbid",
        appId,
        targetTier,
        amount: Number(amount),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Checkout failed");
      return;
    }
    router.push(data.url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Outbid / hijack</p>
        <h2 className="display mt-1 text-3xl">Pay to steal the spot</h2>
        <p className="mt-2 text-sm text-muted">
          Min ${min}. Boosts shed 20% every 24h. Hold the {targetTier.replaceAll("_", " ")} spotlight.
        </p>
        <label className="mt-4 block text-xs text-muted">Bid amount (USD)</label>
        <input
          type="number"
          min={min}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2"
        />
        {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
          >
            Never mind
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={pay}
            className="flex-1 rounded-lg bg-ramen px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {busy ? "Opening…" : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
