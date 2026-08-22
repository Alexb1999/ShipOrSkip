import { NextResponse } from "next/server";
import { expireStaleBids, resolveExpiredChallenges } from "@/lib/economy";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") ?? req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await expireStaleBids();
  const dropped = await resolveExpiredChallenges();
  return NextResponse.json({ ok: true, challengesResolved: dropped });
}
