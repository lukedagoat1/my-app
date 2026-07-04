import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { decrementStock } from "@/lib/stock";
import { recordOrder } from "@/lib/orders";

// Fulfils a PAID checkout: verifies the payment intent with Stripe, reads the
// purchased items from its metadata (never from the client), decrements stock
// once, and appends to the durable order log. Replays are no-ops.
export async function POST(req: NextRequest) {
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

    const items = (pi.metadata.items ?? "")
      .split(",")
      .map((pair) => { const [id, qty] = pair.split(":"); return { id, qty: Number(qty) || 1 }; })
      .filter((it) => it.id);

    const isNew = await recordOrder({
      pi: pi.id,
      orderId: pi.metadata.order_id ?? "",
      date: new Date(pi.created * 1000).toISOString(),
      name: pi.metadata.customer_name ?? "",
      email: pi.receipt_email ?? "",
      items,
      amount: pi.amount / 100,
    });
    if (isNew && items.length) await decrementStock(items);

    return NextResponse.json({ ok: true, recorded: isNew });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[decrement-stock]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
