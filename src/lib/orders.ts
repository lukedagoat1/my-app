import { readJson, writeJson } from "@/lib/db";

// Order log, appended when a paid checkout completes. Doubles as the
// idempotency record: a payment intent is only fulfilled once.
export interface OrderRecord {
  pi: string;                 // Stripe payment intent id
  orderId: string;            // STP-XXXXXX
  date: string;               // ISO
  name: string;
  email: string;
  items: { id: string; qty: number }[];
  amount: number;             // dollars
}

export async function readOrders(fresh = false): Promise<OrderRecord[]> {
  return readJson<OrderRecord[]>("orders", [], { fresh });
}

/** Append if this payment intent hasn't been recorded yet. Returns false on replay. */
export async function recordOrder(order: OrderRecord): Promise<boolean> {
  const orders = await readOrders(true);
  if (orders.some((o) => o.pi === order.pi)) return false;
  orders.unshift(order);
  await writeJson("orders", orders.slice(0, 500)); // ponytail: cap the log; page it if she ever passes 500 orders
  return true;
}
