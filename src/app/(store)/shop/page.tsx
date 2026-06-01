import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop All Authentic Luxury Beauty",
  description: "Browse 100% authentic prestige makeup, skincare and fragrance. Filter by category, brand and price.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-20 text-center text-[var(--s-ink-soft)]">Loading the collection…</div>}>
      <ShopClient />
    </Suspense>
  );
}
