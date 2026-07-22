import { NextRequest, NextResponse } from "next/server";
import { readListings, writeListings } from "@/lib/listings";
import { isAdmin } from "@/lib/adminAuth";
import type { Product, Category } from "@/lib/products";

const CATEGORIES: Category[] = ["Makeup", "Skincare", "Fragrance"];

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readListings(true));
}

/** Upsert a custom listing. Body: partial product; id present = edit. */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json() as Partial<Product>;
    const title = String(body.title ?? "").trim();
    const price = Number(body.price);
    const category = CATEGORIES.includes(body.category as Category) ? body.category as Category : "Makeup";
    if (!title || !isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Title and a valid price are required" }, { status: 400 });
    }
    const doc = await readListings(true);
    const id = body.id && doc.custom.some(p => p.id === body.id)
      ? body.id
      : "sara-" + Math.random().toString(36).slice(2, 10);
    const compareAt = Number(body.compareAt);
    const product: Product = {
      id,
      title,
      brand: String(body.brand ?? "Sara's Trading Post").trim() || "Sara's Trading Post",
      category,
      sub: String(body.sub ?? "Other").trim() || "Other",
      price: +price.toFixed(2),
      compareAt: isFinite(compareAt) && compareAt > price ? +compareAt.toFixed(2) : +price.toFixed(2),
      image: String(body.image ?? ""),
      rating: 5,
      reviews: 0,
      sold: 0,
      condition: String(body.condition ?? "New / Sealed").trim() || "New / Sealed",
      blurb: String(body.blurb ?? "").trim() || title,
      bestseller: false,
      description: String(body.description ?? "").trim() || undefined,
      variation: body.variation?.label && body.variation.options?.length
        ? { label: String(body.variation.label), options: body.variation.options.map(String).filter(Boolean) }
        : undefined,
    };
    const i = doc.custom.findIndex(p => p.id === id);
    if (i >= 0) doc.custom[i] = product; else doc.custom.push(product);
    await writeListings(doc);
    return NextResponse.json({ ok: true, product });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

/** Delete a custom listing, or toggle hide on a catalog product. Body: { id, action: "delete" | "hide" | "show" } */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, action } = await req.json() as { id: string; action: "delete" | "hide" | "show" };
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const doc = await readListings(true);
    if (action === "delete") doc.custom = doc.custom.filter(p => p.id !== id);
    else if (action === "hide" && !doc.hidden.includes(id)) doc.hidden.push(id);
    else if (action === "show") doc.hidden = doc.hidden.filter(h => h !== id);
    await writeListings(doc);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
