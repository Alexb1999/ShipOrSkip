import Stripe from "stripe";
import { appUrl } from "@/lib/ranking";
import { createPendingPayment, fulfillPayment } from "@/lib/economy";
import { prisma } from "@/lib/db";
import type { PaymentKind } from "@prisma/client";

export const SUPER_SHIP_PRICE = 15;
export const CALL_BS_PRICE = 10;
export const VERIFY_PRICE = 19;

export function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function startCheckout(args: {
  userId: string;
  kind: PaymentKind;
  amount: number;
  appId?: string;
  targetTier?: string;
  successPath?: string;
}): Promise<{ url: string; demo: boolean }> {
  const payment = await createPendingPayment(args);
  const stripe = stripeClient();
  const origin = appUrl();
  const success = `${origin}${args.successPath ?? "/leaderboard"}?paid=${args.kind}`;
  const cancel = `${origin}${args.successPath ?? "/leaderboard"}?canceled=1`;

  if (!stripe) {
    await fulfillPayment(payment.id);
    return { url: success, demo: true };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: success,
    cancel_url: cancel,
    metadata: { paymentId: payment.id, kind: args.kind, userId: args.userId },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(args.amount * 100),
          product_data: {
            name:
              args.kind === "outbid"
                ? "Outbid / Rank Hijack"
                : args.kind === "super_ship"
                  ? "Super Ship"
                  : args.kind === "call_bs"
                    ? "Call BS stake"
                    : "Stripe MRR verification",
          },
        },
      },
    ],
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeSessionId: session.id },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { url: session.url, demo: false };
}
