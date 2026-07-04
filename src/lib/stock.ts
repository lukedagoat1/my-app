import { readJson, writeJson } from "@/lib/db";

export interface StockEntry {
  qty?: number;        // undefined = not tracked (always available); 0 = sold out
  ebayItemId?: string; // eBay item ID (numeric string) for auto-sync
}

export async function readStock(): Promise<Record<string, StockEntry>> {
  return readJson("stock", {});
}

export async function writeStock(stock: Record<string, StockEntry>): Promise<void> {
  await writeJson("stock", stock);
}

/** Returns productId -> qty (undefined = untracked / always available, 0 = sold out) */
export async function getStockQtys(): Promise<Record<string, number | undefined>> {
  const stock = await readStock();
  return Object.fromEntries(
    Object.entries(stock).map(([id, e]) => [id, e.qty])
  );
}

/** Decrement stock for each purchased item. Floors at 0. */
export async function decrementStock(items: { id: string; qty: number }[]): Promise<void> {
  const stock = await readJson<Record<string, StockEntry>>("stock", {}, { fresh: true });
  let changed = false;
  for (const { id, qty } of items) {
    const entry = stock[id];
    if (entry && entry.qty !== undefined) {
      entry.qty = Math.max(0, entry.qty - qty);
      changed = true;
    }
  }
  if (changed) await writeStock(stock);
}
