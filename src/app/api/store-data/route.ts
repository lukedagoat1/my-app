import { NextResponse } from "next/server";
import { readSalePrices } from "@/lib/sale-prices";
import { readBasePrices } from "@/lib/base-prices";
import { getStockQtys } from "@/lib/stock";
import { readListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function GET() {
  const [prices, basePrices, stock, listings] = await Promise.all([
    readSalePrices(),
    readBasePrices(),
    getStockQtys(),
    readListings(),
  ]);
  return NextResponse.json({ prices, basePrices, stock, custom: listings.custom, hidden: listings.hidden });
}
