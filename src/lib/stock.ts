import { promises as fs } from "fs";
import path from "path";

export interface StockEntry {
  qty?: number;        // undefined = not tracked (always available); 0 = sold out
  ebayItemId?: string; // eBay item ID (numeric string) for auto-sync
}

function filePath() {
  return process.env.NODE_ENV === "development"
    ? path.join(process.cwd(), "src", "data", "stock.json")
    : "/tmp/sara-stock.json";
}

export async function readStock(): Promise<Record<string, StockEntry>> {
  try {
    const raw = await fs.readFile(filePath(), "utf-8");
    return JSON.parse(raw) as Record<string, StockEntry>;
  } catch {
    return {};
  }
}

export async function writeStock(stock: Record<string, StockEntry>): Promise<void> {
  await fs.writeFile(filePath(), JSON.stringify(stock, null, 2), "utf-8");
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
  const stock = await readStock();
  for (const { id, qty } of items) {
    const entry = stock[id];
    if (entry && entry.qty !== undefined) {
      entry.qty = Math.max(0, entry.qty - qty);
    }
  }
  await writeStock(stock);
}
