import { readJson, writeJson } from "@/lib/db";
import type { Product } from "@/lib/products";

// Sara's own listings, stored durably (see db.ts). `hidden` = ids of catalog
// products she has taken off the storefront.
export interface ListingsDoc {
  custom: Product[];
  hidden: string[];
}

const EMPTY: ListingsDoc = { custom: [], hidden: [] };

export async function readListings(fresh = false): Promise<ListingsDoc> {
  const doc = await readJson<ListingsDoc>("listings", EMPTY, { fresh });
  return { custom: doc.custom ?? [], hidden: doc.hidden ?? [] };
}

export async function writeListings(doc: ListingsDoc): Promise<void> {
  await writeJson("listings", doc);
}
