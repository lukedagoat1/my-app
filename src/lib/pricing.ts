import { getProduct } from "@/lib/products";
import { readListings } from "@/lib/listings";
import { readSalePrices } from "@/lib/sale-prices";
import { getStockQtys } from "@/lib/stock";
import { SHIPPING_THRESHOLD, SHIPPING_FLAT, TAX_RATE, TAX_STATES } from "@/lib/cart";

/**
 * Recomputes an order total server-side from the live catalog/listings/stock —
 * never trusts a client-supplied amount. This is the only source of truth for
 * what a Stripe charge is created for.
 */
export async function priceOrder(items: { id: string; qty: number }[], state: string) {
  const [listings, salePrices, stock] = await Promise.all([
    readListings(),
    readSalePrices(),
    getStockQtys(),
  ]);

  let subtotal = 0;
  for (const { id, qty } of items) {
    if (!id || !Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("Invalid item");
    const product = getProduct(id) ?? listings.custom.find((p) => p.id === id);
    if (!product) throw new Error(`Unknown product: ${id}`);
    if (listings.hidden.includes(id)) throw new Error(`Product not available: ${id}`);
    const available = stock[id];
    if (available !== undefined && available < qty) throw new Error(`Not enough stock: ${id}`);
    const sale = salePrices[id];
    const price = sale && sale < product.price ? sale : product.price;
    subtotal += price * qty;
  }
  subtotal = +subtotal.toFixed(2);

  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = TAX_STATES.has(state.toUpperCase()) ? +(subtotal * TAX_RATE).toFixed(2) : 0;
  const total = +(subtotal + shipping + tax).toFixed(2);

  return { subtotal, shipping, tax, total };
}
