import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy · ShipOrSkip.lol",
  description: "What we store: your X handle, your listing, your swipes, and Stripe's payment ids.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Legal-ish</p>
      <h1 className="display mt-3 text-6xl">Privacy</h1>
      <p className="mt-4 text-muted">Last updated August 23, 2026.</p>

      <h2 className="display mt-12 text-3xl">What we collect</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>X account id, username, display name, and avatar if you sign in with X.</li>
        <li>Listings you submit: name, tagline, URLs, stack, claimed MRR, screenshots.</li>
        <li>TrustMRR slug/URL if you paste one, plus the MRR we pulled at verify time.</li>
        <li>Swipes, watchlist, bids, Call BS challenges, and in-app pings.</li>
        <li>Payment records: amount, kind, Stripe session id. Card data stays at Stripe.</li>
        <li>Basic request logs and a coarse visitor count. No ad-tech pixel farm.</li>
      </ul>

      <h2 className="display mt-12 text-3xl">What we don&apos;t</h2>
      <p className="mt-3 text-muted">
        We don&apos;t sell your email list, because we barely have one. Demo login (@demo_hacker) is a shared
        toy account for local/staging, not a production identity.
      </p>

      <h2 className="display mt-12 text-3xl">Processors</h2>
      <p className="mt-3 text-muted">
        Hosting and database on whatever we deploy to (typically Vercel + Postgres). Auth via Auth.js. Payments
        via Stripe. Optional TrustMRR lookup when you ask us to verify. X if you use Continue with X.
      </p>

      <h2 className="display mt-12 text-3xl">Retention</h2>
      <p className="mt-3 text-muted">
        Listings and swipe history stay until you ask us to delete the account or we shut the joke down. Payment
        records stick around as long as tax/Stripe rules say they must.
      </p>

      <h2 className="display mt-12 text-3xl">Delete / contact</h2>
      <p className="mt-3 text-muted">
        DM{" "}
        <a href="https://x.com/alexboots19" className="underline" target="_blank" rel="noreferrer">
          @alexboots19
        </a>{" "}
        to export or wipe a profile. Public roast cards already screenshotted by the internet are gone from our
        DB, not from the timeline.
      </p>
      <p className="mt-10 text-sm text-muted">
        Payments and stakes are in the{" "}
        <Link href="/terms#payments" className="underline">
          terms
        </Link>
        .
      </p>
    </div>
  );
}
