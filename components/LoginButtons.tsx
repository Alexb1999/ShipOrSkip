"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { demoSignIn } from "@/app/login/actions";

export function LoginButtons({
  from,
  twitterEnabled,
  error,
}: {
  from: string;
  twitterEnabled: boolean;
  error?: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="mt-8 space-y-3">
      {error ? (
        <p className="rounded-xl border border-line bg-card p-3 text-sm">
          Demo sign-in failed. Is Postgres running?
        </p>
      ) : null}
      <form action={demoSignIn}>
        <input type="hidden" name="from" value={from} />
        <button
          type="submit"
          className="w-full rounded-xl bg-accent py-3 font-semibold text-accent-fg"
        >
          Continue as demo
        </button>
      </form>
      {twitterEnabled ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            signIn("twitter", { redirectTo: from });
          }}
          className="w-full rounded-xl border border-line py-3 font-semibold"
        >
          Continue with X
        </button>
      ) : (
        <p className="font-mono text-[11px] text-muted">
          X login turns on when AUTH_TWITTER_ID and AUTH_TWITTER_SECRET are set.
        </p>
      )}
    </div>
  );
}
