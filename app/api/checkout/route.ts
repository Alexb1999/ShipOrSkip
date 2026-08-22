import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { minNextBid, MIN_BID } from "@/lib/bids";
import { getSpotlight } from "@/lib/economy";
import { CALL_BS_PRICE, startCheckout, SUPER_SHIP_PRICE, VERIFY_PRICE } from "@/lib/stripe";
import type { PaymentKind } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }
  const body = await req.json();
  const kind = body.kind as PaymentKind;
  const appId = body.appId ? String(body.appId) : undefined;
  const targetTier = body.targetTier ? String(body.targetTier) : undefined;
  let amount = Number(body.amount ?? 0);

  if (kind === "super_ship") amount = SUPER_SHIP_PRICE;
  if (kind === "call_bs") amount = CALL_BS_PRICE;
  if (kind === "verify") amount = VERIFY_PRICE;

  if (kind === "outbid") {
    if (!appId || !targetTier) {
      return NextResponse.json({ error: "Need app and target slot" }, { status: 400 });
    }
    const mine = await prisma.app.findUnique({ where: { id: appId } });
    if (!mine || mine.userId !== session.user.id) {
      return NextResponse.json({ error: "Outbid your own listing" }, { status: 403 });
    }
    const current = await getSpotlight(targetTier);
    const min = minNextBid(current?.effectiveAmount ?? 0);
    if (amount < Math.max(MIN_BID, min)) {
      return NextResponse.json({ error: `Bid at least $${Math.max(MIN_BID, min)}` }, { status: 400 });
    }
  }

  if ((kind === "super_ship" || kind === "call_bs") && !appId) {
    return NextResponse.json({ error: "Missing app" }, { status: 400 });
  }

  try {
    const checkout = await startCheckout({
      userId: session.user.id,
      kind,
      amount,
      appId,
      targetTier,
      successPath: kind === "super_ship" ? "/deck" : kind === "verify" ? `/u/${session.user.username}` : "/leaderboard",
    });
    return NextResponse.json(checkout);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Checkout failed" }, { status: 500 });
  }
}
