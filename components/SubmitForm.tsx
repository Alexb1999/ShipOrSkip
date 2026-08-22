"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IndieRoast } from "@/components/IndieRoast";
import { TierChip } from "@/components/TierBadge";
import { mrrToTier } from "@/lib/tiers";

type Fields = {
  name: string;
  tagline: string;
  websiteUrl: string;
  pitchVideoUrl: string;
  screenshotUrl: string;
  techStack: string;
  mrrAmount: number;
};

export function SubmitForm({ initial }: { initial: Fields | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Fields>(
    initial ?? {
      name: "",
      tagline: "",
      websiteUrl: "https://",
      pitchVideoUrl: "",
      screenshotUrl: "",
      techStack: "Next.js, Postgres",
      mrrAmount: 0,
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save");
      return;
    }
    router.push(`/u/${data.username}`);
    router.refresh();
  }

  function field(key: keyof Fields) {
    return {
      value: String(form[key] ?? ""),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({
          ...f,
          [key]: key === "mrrAmount" ? Number(e.target.value) : e.target.value,
        })),
    };
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-xs text-muted">
        App name
        <input required className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("name")} />
      </label>
      <label className="block text-xs text-muted">
        Tagline
        <input required maxLength={255} className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("tagline")} />
      </label>
      <label className="block text-xs text-muted">
        Website
        <input required className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("websiteUrl")} />
      </label>
      <label className="block text-xs text-muted">
        Pitch video URL (Loom / YouTube embed)
        <input className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("pitchVideoUrl")} />
      </label>
      <label className="block text-xs text-muted">
        Screenshot URL
        <input className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("screenshotUrl")} />
      </label>
      <label className="block text-xs text-muted">
        Tech stack (comma separated)
        <input className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("techStack")} />
      </label>
      <label className="block text-xs text-muted">
        Self-reported MRR (USD)
        <input type="number" min={0} className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2" {...field("mrrAmount")} />
      </label>
      <div className="space-y-2 rounded-2xl border border-line p-3">
        <TierChip tier={mrrToTier(form.mrrAmount)} />
        <IndieRoast slug={mrrToTier(form.mrrAmount).slug} seed={form.name} compact />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button disabled={busy} className="w-full rounded-xl bg-accent py-3 font-semibold text-accent-fg disabled:opacity-50">
        {busy ? "Saving…" : "Lock in the flex"}
      </button>
    </form>
  );
}
