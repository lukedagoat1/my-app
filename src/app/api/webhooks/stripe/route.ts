import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillPaymentIntent } from "@/lib/fulfill";

// Server-authoritative fulfilment. Stripe calls this directly, so orders are
// recorded and stock decrements even if the customer's browser never makes
// it back to the success page (closed tab, crash, redirect-based payment
// methods like Klarna/iDEAL that leave and return via a different flow).
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    // Signature verification needs the raw body — do not JSON.parse first.
    const rawBody = await req.text();
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    await fulfillPaymentIntent(event.data.object as Stripe.PaymentIntent);
  }

  return NextResponse.json({ received: true });
}
