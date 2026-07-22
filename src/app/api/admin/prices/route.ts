import { NextRequest, NextResponse } from "next/server";
import { readSalePrices, writeSalePrices } from "@/lib/sale-prices";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readSalePrices());
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json() as Record<string, unknown>;
    const cleaned: Record<string, number> = {};
    for (const [id, price] of Object.entries(body)) {
      if (typeof price === "number" && price > 0) cleaned[id] = price;
    }
    await writeSalePrices(cleaned);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
