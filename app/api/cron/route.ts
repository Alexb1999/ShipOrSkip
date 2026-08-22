import { NextResponse } from "next/server";
import { expireStaleBids, resolveExpiredChallenges } from "@/lib/economy";

function cronSecretFrom(req: Request) {
  const url = new URL(req.url);
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  return url.searchParams.get("secret") ?? req.headers.get("x-cron-secret") ?? bearer;
}

export async function GET(req: Request) {
  const secret = cronSecretFrom(req);
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await expireStaleBids();
  const dropped = await resolveExpiredChallenges();
  return NextResponse.json({ ok: true, challengesResolved: dropped });
}
