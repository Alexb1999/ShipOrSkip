"use client";

import { useState } from "react";
import Link from "next/link";
import { TrustMrrForm } from "@/components/TrustMrrForm";

export function ProfileActions({
  shareUrl,
  tweetText,
  mine,
  verified,
  challenged,
  trustMrrUrl,
}: {
  shareUrl: string;
  tweetText: string;
  mine: boolean;
  verified: boolean;
  challenged?: boolean;
  trustMrrUrl?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <a href={intent} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg">
        Flex on X
      </a>
      <button type="button" onClick={copy} className="rounded-full border border-line px-4 py-2 text-sm">
        {copied ? "Copied" : "Copy share link"}
      </button>
      {verified && trustMrrUrl ? (
        <a
          href={trustMrrUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line px-4 py-2 text-sm"
        >
          TrustMRR proof
        </a>
      ) : null}
      {mine ? (
        <Link href="/submit" className="rounded-full border border-line px-4 py-2 text-sm">
          Edit listing
        </Link>
      ) : null}
      {mine && !verified ? (
        <div className="basis-full">
          <TrustMrrForm challenged={challenged} />
        </div>
      ) : null}
    </div>
  );
}
