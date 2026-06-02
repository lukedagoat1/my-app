import { NextResponse } from "next/server";
import { readSalePrices } from "@/lib/sale-prices";
import { getStockQtys } from "@/lib/stock";

export const dynamic = "force-dynamic";

export async function GET() {
  const [prices, stock] = await Promise.all([readSalePrices(), getStockQtys()]);
  return NextResponse.json({ prices, stock });
}
