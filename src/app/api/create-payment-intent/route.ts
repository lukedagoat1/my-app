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
    const { amount, email, name, orderId, items } = await req.json();

    if (!amount || amount < 0.5) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Compact "id:qty,id:qty" so fulfilment (stock decrement, order log) can
    // trust Stripe instead of the client. Stripe metadata values cap at 500.
    let itemsMeta = "";
    if (Array.isArray(items)) {
      for (const it of items as { id?: unknown; qty?: unknown }[]) {
        const id = String(it.id ?? "").replace(/[^a-z0-9-]/gi, "");
        const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
        if (!id) continue;
        const piece = (itemsMeta ? "," : "") + `${id}:${qty}`;
        if (itemsMeta.length + piece.length > 490) break; // ponytail: huge carts lose trailing lines in the log, payment unaffected
        itemsMeta += piece;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars → cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      description: "Sara's Trading Post order",
      metadata: {
        store: "sarastradingpost",
        customer_name: name || "",
        order_id: String(orderId ?? ""),
        items: itemsMeta,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[create-payment-intent]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
