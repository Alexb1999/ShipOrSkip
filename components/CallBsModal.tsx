"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CallBsModal({
  appId,
  founder,
  open,
  onClose,
}: {
  appId: string;
  founder: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function stake() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "call_bs", appId, amount: 10 }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not stake");
      return;
    }
    router.push(data.url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "var(--overlay)" }}>
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Call BS</p>
        <h2 className="display mt-1 text-3xl">Stake $10 on @{founder}</h2>
        <p className="mt-2 text-sm text-muted">
          48-hour clock. They have to paste a TrustMRR profile. If the live MRR matches the rank, you lose
          the stake (80% founder / 20% house). If they ghost or the number is a lower rank, you get the $10
          back and they eat it.
        </p>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-line py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={stake}
            className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg disabled:opacity-50"
          >
            {busy ? "Staking…" : "Stake $10"}
          </button>
        </div>
      </div>
    </div>
  );
}
