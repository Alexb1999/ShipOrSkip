"use client";

import Link from "next/link";

export function SuperShipModal({
  appName,
  busy,
  error,
  onClose,
  onConfirm,
}: {
  appName: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "var(--overlay)" }}>
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Super Ship · $15</p>
        <h2 className="display mt-1 text-3xl">Buy {appName} a megaphone</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          <li>10× ELO vs a normal Ship</li>
          <li>Front of the swipe deck for 24 hours</li>
          <li>+500 impressions on the listing</li>
        </ul>
        <p className="mt-3 text-sm text-muted">
          Digital attention.{" "}
          <Link href="/terms#refunds" className="underline">
            No refunds
          </Link>{" "}
          because you got shy.
        </p>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-line py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background disabled:opacity-50"
          >
            {busy ? "Redirecting…" : "Pay $15"}
          </button>
        </div>
      </div>
    </div>
  );
}
