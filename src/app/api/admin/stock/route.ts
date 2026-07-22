import { NextRequest, NextResponse } from "next/server";
import { readStock, writeStock } from "@/lib/stock";
import { isAdmin as ok } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!ok(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readStock());
}

export async function PUT(req: NextRequest) {
  if (!ok(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    await writeStock(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
