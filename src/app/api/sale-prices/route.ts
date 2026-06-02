import { NextResponse } from "next/server";
import { readSalePrices } from "@/lib/sale-prices";

export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await readSalePrices();
  return NextResponse.json(prices);
}
