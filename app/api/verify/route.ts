import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { startCheckout, VERIFY_PRICE } from "@/lib/stripe";
import { verifyFounder } from "@/lib/economy";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  const app = await prisma.app.findUnique({ where: { userId: session.user.id } });
  if (!app) {
    return NextResponse.json({ error: "Claim a rank before verifying" }, { status: 400 });
  }

  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

  if (!stripeConfigured && process.env.NODE_ENV !== "production") {
    await verifyFounder(session.user.id);
    return NextResponse.json({
      demo: true,
      message: "Dev mock: Stripe Connect skipped. You're a Verified Legend.",
    });
  }

  const checkout = await startCheckout({
    userId: session.user.id,
    kind: "verify",
    amount: VERIFY_PRICE,
    successPath: `/u/${session.user.username}`,
  });
  return NextResponse.json(checkout);
}
