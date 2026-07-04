import { readJson, writeJson } from "@/lib/db";

export async function readSalePrices(): Promise<Record<string, number>> {
  return readJson("sale-prices", {});
}

export async function writeSalePrices(prices: Record<string, number>): Promise<void> {
  await writeJson("sale-prices", prices);
}
