import { redirect } from "next/navigation";
import { twitterAuthEnabled } from "@/auth";
import { LoginButtons } from "@/components/LoginButtons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/deck";
  if (!next.startsWith("/")) redirect("/login");
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="display text-5xl">Sign in to swipe</h1>
      <p className="mt-3 text-sm text-muted">
        Twitter/X is the real door. Demo is how you play tonight without an X developer app.
      </p>
      <LoginButtons next={next} twitterEnabled={twitterAuthEnabled} />
    </div>
  );
}
