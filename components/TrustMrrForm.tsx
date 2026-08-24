"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TrustMrrForm({ challenged }: { challenged?: boolean }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErr(null);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(data.error ?? "Verify failed");
      return;
    }
    setMsg(data.message ?? "Verified");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-2 rounded-2xl border border-line bg-background p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {challenged ? "Prove it · 48h clock" : "Verify MRR"}
      </p>
      <p className="text-sm text-muted">
        {challenged
          ? "Someone called BS. Paste your TrustMRR profile or you go Homeless."
          : "X is just the door. TrustMRR is the lie detector. Paste the public URL."}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://trustmrr.com/startup/your-app"
          className="min-w-0 flex-1 rounded-lg border border-line bg-card px-3 py-2 font-mono text-xs"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg disabled:opacity-50"
        >
          {busy ? "Checking…" : "Verify with TrustMRR"}
        </button>
      </div>
      <p className="font-mono text-[10px] text-muted">
        Don’t have a page? Connect Stripe on{" "}
        <a href="https://trustmrr.com" className="underline" target="_blank" rel="noreferrer">
          trustmrr.com
        </a>{" "}
        first.
      </p>
      {err ? <p className="text-sm text-danger">{err}</p> : null}
      {msg ? <p className="text-sm">{msg}</p> : null}
    </form>
  );
}
