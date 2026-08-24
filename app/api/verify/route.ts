import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { verifyWithTrustMrr } from "@/lib/economy";
import { fetchTrustMrrProfile, hostOf } from "@/lib/trustmrr";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  const app = await prisma.app.findUnique({ where: { userId: session.user.id } });
  if (!app) {
    return NextResponse.json({ error: "Claim a rank before verifying" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as { url?: string };
  const url = String(body.url ?? "").trim();
  if (!url) {
    return NextResponse.json({ error: "Paste your TrustMRR URL" }, { status: 400 });
  }

  try {
    const proof = await fetchTrustMrrProfile(url);
    const listingHost = hostOf(app.websiteUrl);
    const proofHost = hostOf(proof.website);
    if (listingHost && proofHost && listingHost !== proofHost) {
      return NextResponse.json(
        {
          error: `TrustMRR site is ${proofHost}, your listing is ${listingHost}. URLs have to match.`,
        },
        { status: 400 },
      );
    }

    const result = await verifyWithTrustMrr(session.user.id, proof);
    return NextResponse.json({
      ok: true,
      mrr: result.mrr,
      slug: result.slug,
      inflated: result.inflated,
      message: result.inflated
        ? `TrustMRR says $${Math.round(result.mrr)} MRR — lower rank than you claimed. Badge on, flex off.`
        : `Verified at $${Math.round(result.mrr)} MRR via TrustMRR.`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Verify failed" },
      { status: 400 },
    );
  }
}
