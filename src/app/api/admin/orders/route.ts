import { NextRequest, NextResponse } from "next/server";
import { readOrders } from "@/lib/orders";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await readOrders(true));
}
