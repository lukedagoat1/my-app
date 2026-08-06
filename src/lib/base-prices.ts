import { readJson, writeJson } from "@/lib/db";

// Regular-price overrides for catalog products (the static, auto-generated
// products.ts prices aren't editable from admin otherwise). Distinct from
// sale-prices.ts, which only ever discounts below whatever this resolves to.
export async function readBasePrices(): Promise<Record<string, number>> {
  return readJson("base-prices", {});
}

export async function writeBasePrices(prices: Record<string, number>): Promise<void> {
  await writeJson("base-prices", prices);
}
