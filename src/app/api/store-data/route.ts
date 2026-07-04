import { NextResponse } from "next/server";
import { readSalePrices } from "@/lib/sale-prices";
import { getStockQtys } from "@/lib/stock";
import { readListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function GET() {
  const [prices, stock, listings] = await Promise.all([
    readSalePrices(),
    getStockQtys(),
    readListings(),
  ]);
  return NextResponse.json({ prices, stock, custom: listings.custom, hidden: listings.hidden });
}
