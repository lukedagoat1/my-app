import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — plenty for a product photo

/** Body: { name: string, data: string (base64) } → { url } */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, data } = await req.json() as { name: string; data: string };
    if (!name || !data) return NextResponse.json({ error: "name and data required" }, { status: 400 });
    if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(name)) {
      return NextResponse.json({ error: "Images only (jpg, png, webp, gif, avif)" }, { status: 400 });
    }
    if (Buffer.byteLength(data, "base64") > MAX_BYTES) {
      return NextResponse.json({ error: "Image too large (max 4MB)" }, { status: 400 });
    }
    const url = await uploadFile(name, data);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
