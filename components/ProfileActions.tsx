"use client";

import { useState } from "react";
import Link from "next/link";

export function ProfileActions({
  shareUrl,
  tweetText,
  mine,
  verified,
  username,
}: {
  shareUrl: string;
  tweetText: string;
  mine: boolean;
  verified: boolean;
  username: string;
}) {
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function copy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  async function verify() {
    const res = await fetch("/api/verify", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Verify failed");
      return;
    }
    if (data.url) window.location.href = data.url;
    else setMsg(data.message ?? "Verified");
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
      {mine && !verified ? (
        <button type="button" onClick={verify} className="rounded-full border border-line px-4 py-2 text-sm">
          Get Verified Legend · $19
        </button>
      ) : null}
      {mine ? (
        <Link href="/submit" className="rounded-full border border-line px-4 py-2 text-sm">
          Edit listing
        </Link>
      ) : null}
      {msg ? <p className="w-full text-sm text-muted">{msg} @{username}</p> : null}
    </div>
  );
}
