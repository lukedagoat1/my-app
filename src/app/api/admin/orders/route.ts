import { NextRequest, NextResponse } from "next/server";
import { readOrders } from "@/lib/orders";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sara2024";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await readOrders(true));
}
