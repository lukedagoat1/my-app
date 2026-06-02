import { promises as fs } from "fs";
import path from "path";

// In development: persist to src/data/sale-prices.json (survives restarts, committed to git)
// In production (Vercel): write to /tmp (survives within a warm Lambda instance)
function filePath() {
  return process.env.NODE_ENV === "development"
    ? path.join(process.cwd(), "src", "data", "sale-prices.json")
    : "/tmp/sara-sale-prices.json";
}

export async function readSalePrices(): Promise<Record<string, number>> {
  try {
    const raw = await fs.readFile(filePath(), "utf-8");
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

export async function writeSalePrices(prices: Record<string, number>): Promise<void> {
  await fs.writeFile(filePath(), JSON.stringify(prices, null, 2), "utf-8");
}
