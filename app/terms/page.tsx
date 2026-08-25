import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms · ShipOrSkip.lol",
  description: "Parody, payments, refunds. Don't sue us, don't fake MRR without a plan.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Legal-ish</p>
      <h1 className="display mt-3 text-6xl">Terms</h1>
      <p className="mt-4 text-muted">
        Last updated August 23, 2026. This is a joke site that still takes real money. Read it.
      </p>

      <h2 className="display mt-12 text-3xl">What this is</h2>
      <p className="mt-3 text-muted">
        ShipOrSkip.lol is satire. Rankings, roasts, legend cards, and tier names are parody. Nobody on this
        site endorsed it. We are not affiliated with X, Stripe, TrustMRR, or any founder we dunk on.
      </p>
      <p className="mt-3 text-muted">
        You get a meme rank, a swipe deck, and the option to pay for attention. You do not get investment
        advice, tax advice, or a hug.
      </p>

      <h2 id="payments" className="display mt-12 text-3xl">
        Payments
      </h2>
      <p className="mt-3 text-muted">Cards go through Stripe. We never see your full card number.</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>
          <span className="text-foreground">Super Ship — $15.</span> 10× ELO versus a normal Ship, front of
          the swipe deck for 24 hours, +500 impressions on the listing.
        </li>
        <li>
          <span className="text-foreground">Call BS — $10 stake.</span> 48 hours for the founder to paste a
          TrustMRR profile. If they match the claimed rank, the stake goes 80% to them / 20% to the house. If
          they ghost, or TrustMRR shows a lower rank, you get the $10 back.
        </li>
        <li>
          <span className="text-foreground">Outbid.</span> Variable. You buy a ladder / header slot until
          someone pays more or the bid decays. That&apos;s the product.
        </li>
      </ul>
      <p className="mt-3 text-muted">
        X login is identity. A TrustMRR URL is how MRR gets a checkmark. Paying never verified revenue. There
        is no $19 Verified Legend product.
      </p>

      <h2 id="refunds" className="display mt-12 text-3xl">
        Refunds
      </h2>
      <p className="mt-3 text-muted">
        Super Ship and Outbid are digital attention. No refunds because you changed your mind, lost a rank, or
        didn&apos;t go viral. If Stripe double-charges you or checkout succeeds and nothing applied, email{" "}
        <a href="https://x.com/alexboots19" className="underline" target="_blank" rel="noreferrer">
          @alexboots19
        </a>{" "}
        and we&apos;ll fix the actual bug.
      </p>
      <p className="mt-3 text-muted">
        Call BS is a stake, not a tip. It returns automatically when the challenge rules say you won. It does
        not return because you regret the tweet.
      </p>

      <h2 className="display mt-12 text-3xl">Your listing</h2>
      <p className="mt-3 text-muted">
        You can claim whatever MRR you want. That number is a costume until TrustMRR says otherwise. We can
        hide, edit, or delete listings that are spam, illegal, or boring in a way that breaks the site. You
        keep rights to your own name and screenshots; you give us a license to show them on the ladder, deck,
        and share cards.
      </p>

      <h2 className="display mt-12 text-3xl">Conduct</h2>
      <p className="mt-3 text-muted">
        Don&apos;t scrape us into a weapon. Don&apos;t try to steal accounts. Don&apos;t upload CSAM or malware.
        Don&apos;t use this to harass people off-platform with a straight face. We will ban you and we will not
        write a thoughtful essay about it.
      </p>

      <h2 className="display mt-12 text-3xl">Liability</h2>
      <p className="mt-3 text-muted">
        The site is provided as-is. Rank is not a valuation. ELO is a toy. If you lose money, status, or sleep,
        that&apos;s the bit. Our liability is capped at the amount you paid us in the 30 days before the claim,
        except where the law says we can&apos;t cap it.
      </p>
      <p className="mt-3 text-muted">
        Nova Scotia, Canada. If we have to pick a courthouse, it&apos;s there.
      </p>

      <p className="mt-10 text-sm text-muted">
        Also see{" "}
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
        . Questions:{" "}
        <a href="https://x.com/alexboots19" className="underline" target="_blank" rel="noreferrer">
          @alexboots19
        </a>
        .
      </p>
    </div>
  );
}
