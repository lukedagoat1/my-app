import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialised lazily so a missing env var at build time doesn't crash the build
function getStripeServer() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeServer();
    const { amount, email, name } = await req.json();

    if (!amount || amount < 0.5) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars → cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      description: "Sara's Trading Post order",
      metadata: { store: "sarastradingpost", customer_name: name || "" },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[create-payment-intent]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
