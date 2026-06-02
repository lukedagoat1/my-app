import { NextRequest, NextResponse } from "next/server";
import { readStock, writeStock } from "@/lib/stock";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sara2024";

async function getEbayToken(): Promise<string> {
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;
  if (!appId || !certId) throw new Error("Set EBAY_APP_ID and EBAY_CERT_ID in Vercel environment variables.");
  const creds = Buffer.from(`${appId}:${certId}`).toString("base64");
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  });
  const data = await res.json() as { access_token?: string; error_description?: string };
  if (!data.access_token) throw new Error(data.error_description ?? "eBay token request failed");
  return data.access_token;
}

async function fetchEbayQty(token: string, itemId: string): Promise<number | null> {
  const res = await fetch(`https://api.ebay.com/buy/browse/v1/item/v1|${itemId}|0`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });
  if (!res.ok) return null;
  const data = await res.json() as { estimatedAvailabilities?: { estimatedAvailableQuantity?: number }[] };
  return data.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity ?? null;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const token = await getEbayToken();
    const stock = await readStock();
    let updated = 0;
    const errors: string[] = [];

    for (const [productId, entry] of Object.entries(stock)) {
      if (!entry.ebayItemId) continue;
      const qty = await fetchEbayQty(token, entry.ebayItemId);
      if (qty !== null) {
        stock[productId] = { ...entry, qty };
        updated++;
      } else {
        errors.push(`${productId}: could not fetch (eBay ID ${entry.ebayItemId})`);
      }
    }
    await writeStock(stock);
    return NextResponse.json({ ok: true, updated, errors });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
