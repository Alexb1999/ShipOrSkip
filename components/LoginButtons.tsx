"use client";

import { signIn } from "next-auth/react";

export function LoginButtons({
  next,
  twitterEnabled,
}: {
  next: string;
  twitterEnabled: boolean;
}) {
  return (
    <div className="mt-8 space-y-3">
      {twitterEnabled ? (
        <button
          type="button"
          onClick={() => signIn("twitter", { redirectTo: next })}
          className="w-full rounded-xl bg-white py-3 font-semibold text-black"
        >
          Continue with X
        </button>
      ) : (
        <p className="rounded-xl border border-line p-3 font-mono text-xs text-muted">
          AUTH_TWITTER_ID / AUTH_TWITTER_SECRET not set. X login is parked.
        </p>
      )}
      <button
        type="button"
        onClick={() => signIn("demo", { redirectTo: next })}
        className="w-full rounded-xl border border-line py-3 font-semibold"
      >
        Continue as demo
      </button>
    </div>
  );
}
