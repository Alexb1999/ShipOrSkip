"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { demoSignIn } from "@/app/login/actions";

export function LoginButtons({
  from,
  twitterEnabled,
  demoEnabled,
  error,
}: {
  from: string;
  twitterEnabled: boolean;
  demoEnabled: boolean;
  error?: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="mt-8 space-y-3">
      {error === "demo-off" ? (
        <p className="rounded-xl border border-line bg-card p-3 text-sm">
          Demo login is off here. Sign in with X.
        </p>
      ) : error ? (
        <p className="rounded-xl border border-line bg-card p-3 text-sm">
          Demo sign-in failed. Is Postgres running?
        </p>
      ) : null}
      {demoEnabled ? (
        <form action={demoSignIn}>
          <input type="hidden" name="from" value={from} />
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3 font-semibold text-accent-fg"
          >
            Continue as demo
          </button>
        </form>
      ) : null}
      {twitterEnabled ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            signIn("twitter", { redirectTo: from });
          }}
          className={
            demoEnabled
              ? "w-full rounded-xl border border-line py-3 font-semibold"
              : "w-full rounded-xl bg-accent py-3 font-semibold text-accent-fg"
          }
        >
          Continue with X
        </button>
      ) : (
        <p className="font-mono text-[11px] text-muted">
          {demoEnabled
            ? "X login turns on when AUTH_TWITTER_ID and AUTH_TWITTER_SECRET are set."
            : "Set AUTH_TWITTER_ID and AUTH_TWITTER_SECRET, or ALLOW_DEMO_LOGIN=true for staging."}
        </p>
      )}
    </div>
  );
}
