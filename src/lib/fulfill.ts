import Stripe from "stripe";
import { decrementStock } from "@/lib/stock";
import { recordOrder } from "@/lib/orders";

/** Verified fulfilment: stock decrement + order log. Idempotent per payment intent. */
export async function fulfillPaymentIntent(pi: Stripe.PaymentIntent): Promise<boolean> {
  if (pi.status !== "succeeded" || pi.metadata.store !== "sarastradingpost") return false;

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
  return isNew;
}
