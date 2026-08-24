import Link from "next/link";
import { getSiteStats, LAUNCHED_AT } from "@/lib/stats";
import { usd } from "@/lib/money";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
      <p className="display text-4xl sm:text-5xl">{value}</p>
      <p className="mt-1 text-sm text-muted">
        {label}
        {hint ? ` · ${hint}` : ""}
      </p>
    </div>
  );
}

export default async function AboutPage() {
  const stats = await getSiteStats();
  const launched = LAUNCHED_AT.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="display text-6xl">About</h1>
      <p className="mt-6 text-lg text-muted">
        ShipOrSkip.lol is a satirical indie-hacker colosseum. Self-report MRR. Collect a meme rank. Get
        roasted. Swipe Ship or Skip. Pay to hijack the ladder.
      </p>
      <p className="mt-4 text-muted">
        No ads. No feed algorithm. Rank is hype, cash, and whoever is willing to outbid you. X login is
        identity. TrustMRR is how MRR gets a checkmark. Paying $19 never counted.
      </p>

      <h2 className="display mt-12 text-3xl">How MRR gets real</h2>
      <p className="mt-3 text-muted">
        Claim whatever number you want. That&apos;s a costume. To get{" "}
        <span className="font-mono text-foreground">✓ TrustMRR</span>, paste your{" "}
        <a href="https://trustmrr.com" className="underline" target="_blank" rel="noreferrer">
          TrustMRR
        </a>{" "}
        profile. We pull live MRR from their Stripe (or Lemon, Paddle, etc.) connection. If someone Calls
        BS, you have 48 hours to do that or you go Homeless.
      </p>
      <p className="mt-3 text-muted">The site launched on {launched}.</p>

      <div id="stats" className="mt-8 grid gap-3 sm:grid-cols-3">
        <StatCard label="visitors" value={stats.visitors.toLocaleString()} />
        <StatCard label="revenue" value={usd(stats.revenue)} />
        <StatCard
          label="highest bid (so far)"
          value={usd(stats.highestBid)}
          hint={stats.highestBidApp ?? undefined}
        />
      </div>

      <p className="mt-10 text-muted">
        The board is still here. Same rules. Same idea. Ship, skip, or pay — nothing else.
      </p>

      <div className="mt-10 flex items-center gap-4 rounded-2xl border border-line bg-card p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://unavatar.io/x/alexboots19"
          alt="Alex Boutilier"
          className="h-14 w-14 rounded-full border border-line object-cover"
        />
        <div>
          <p className="font-semibold">
            Alex Boutilier —{" "}
            <a href="https://x.com/alexboots19" className="underline" target="_blank" rel="noreferrer">
              @alexboots19
            </a>
          </p>
          <p className="text-sm text-muted">
            Failed indie hacker. Washed-up unprofessional surfer. Built this instead of getting a real job
            or catching a real wave.{" "}
            <a
              href="https://www.instagram.com/alex_boutilier/"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>

      <footer className="mt-12 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
        <a href="https://x.com/alexboots19" className="hover:text-foreground" target="_blank" rel="noreferrer">
          Built by @alexboots19
        </a>
        <span>·</span>
        <a href="https://www.instagram.com/alex_boutilier/" className="hover:text-foreground" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <span>·</span>
        <Link href="/leaderboard" className="hover:text-foreground">
          Ladder
        </Link>
        <span>·</span>
        <Link href="/about#stats" className="hover:text-foreground">
          Live stats
        </Link>
      </footer>
    </div>
  );
}
