import Link from "next/link";
import { getRankedApps } from "@/lib/ranking";
import { formatMrr } from "@/lib/tiers";
import { IndieRoast } from "@/components/IndieRoast";

export const dynamic = "force-dynamic";

export default async function ArenaPage() {
  const ranked = await getRankedApps();
  const pair = ranked.slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="display text-5xl">Head-to-head arena</h1>
      <p className="mt-2 text-sm text-muted">Two apps. One winner. Go swipe if you want the real physics.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {pair.map((app) => (
          <Link key={app.id} href={`/u/${app.user.username}`} className="rounded-3xl border bg-card p-6" style={{ borderColor: `${app.tier.color}66` }}>
            <p className="font-mono text-xs" style={{ color: app.tier.color }}>
              {app.tier.label}
            </p>
            <h2 className="display text-4xl">{app.name}</h2>
            <p className="mt-2 text-sm">{app.tagline}</p>
            <p className="mt-4 font-mono text-xs text-muted">
              @{app.user.username} · {formatMrr(app.mrrAmount)} · {app.eloScore} ELO
            </p>
            <div className="mt-4">
              <IndieRoast slug={app.tier.slug} seed={app.user.username} compact />
            </div>
          </Link>
        ))}
      </div>
      <Link href="/deck" className="mt-8 inline-block text-sm underline">
        Settle it on the deck
      </Link>
    </div>
  );
}
