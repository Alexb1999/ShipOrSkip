import { NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe";
import { fulfillPayment } from "@/lib/economy";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 501 });
  }
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    if (paymentId) {
      await fulfillPayment(paymentId);
    } else if (session.id) {
      const payment = await prisma.payment.findUnique({ where: { stripeSessionId: session.id } });
      if (payment) await fulfillPayment(payment.id);
    }
  }

  return NextResponse.json({ received: true });
}
