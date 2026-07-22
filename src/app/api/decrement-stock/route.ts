import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillPaymentIntent } from "@/lib/fulfill";
import { isRateLimited } from "@/lib/rateLimit";

// Client-triggered fulfilment path — fires right after checkout for instant
// stock updates. The Stripe webhook (/api/webhooks/stripe) is the durable
// safety net if the browser never gets here (closed tab, redirect payment
// methods). Both call the same idempotent fulfillPaymentIntent.
export async function POST(req: NextRequest) {
  if (isRateLimited(req, "decrement-stock", 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
  }
  try {
    const { paymentIntentId } = await req.json() as { paymentIntentId?: string };
    if (!paymentIntentId?.startsWith("pi_")) {
      return NextResponse.json({ error: "paymentIntentId required" }, { status: 400 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded" || pi.metadata.store !== "sarastradingpost") {
      return NextResponse.json({ error: "Payment not verified" }, { status: 403 });
    }
    const recorded = await fulfillPaymentIntent(pi);
    return NextResponse.json({ ok: true, recorded });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[decrement-stock]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
