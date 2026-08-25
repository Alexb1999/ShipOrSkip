import { redirect } from "next/navigation";
import { auth, demoAuthEnabled, twitterAuthEnabled } from "@/auth";
import { LoginButtons } from "@/components/LoginButtons";
import { signOutAction } from "@/app/login/actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; next?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const from = params.from ?? params.next ?? "/deck";
  if (!from.startsWith("/") || from.startsWith("//")) redirect("/login");

  if (session?.user?.id) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="display text-5xl">You&apos;re in</h1>
        <p className="mt-3 text-sm text-muted">
          Signed in as @{session.user.username}. Swipe, claim a rank, or get out.
        </p>
        <div className="mt-8 space-y-3">
          <a
            href={from}
            className="block w-full rounded-xl bg-accent py-3 font-semibold text-accent-fg"
          >
            Continue
          </a>
          <form action={signOutAction}>
            <button type="submit" className="w-full rounded-xl border border-line py-3 font-semibold">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="display text-5xl">Sign in to swipe</h1>
      <p className="mt-3 text-sm text-muted">
        {demoAuthEnabled
          ? "Demo gets you into the deck, ladder, and claim flow. X is optional until you add API keys."
          : twitterAuthEnabled
            ? "X is identity. That's your name on the ladder."
            : "Nobody can sign in until X keys are set. Demo is off in production."}
      </p>
      <LoginButtons
        from={from}
        twitterEnabled={twitterAuthEnabled}
        demoEnabled={demoAuthEnabled}
        error={params.error}
      />
    </div>
  );
}
