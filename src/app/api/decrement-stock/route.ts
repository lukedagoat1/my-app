import { NextRequest, NextResponse } from "next/server";
import { decrementStock } from "@/lib/stock";

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json() as { items: { id: string; qty: number }[] };
    if (!Array.isArray(items)) return NextResponse.json({ error: "items required" }, { status: 400 });
    await decrementStock(items);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
