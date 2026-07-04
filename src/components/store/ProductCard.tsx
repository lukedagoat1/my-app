"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, Plus, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart, money } from "@/lib/cart";
import { StarRating, ProductImage } from "./bits";
import { useSalePrices, useStock } from "./SalePriceProvider";
import { Tilt, flyToCart } from "./fx";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const imgRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const salePrices = useSalePrices();
  const stockQtys = useStock();
  const saleOverride = salePrices[product.id];
  const stockQty = stockQtys[product.id];          // undefined = untracked, 0 = sold out
  const isSoldOut = stockQty === 0;
  const effectivePrice = saleOverride && saleOverride < product.price ? saleOverride : product.price;
  const effectiveCompareAt = saleOverride && saleOverride < product.price ? product.price : product.compareAt;
  const discount = Math.round((1 - effectivePrice / effectiveCompareAt) * 100);
  const hasVariation = !!product.variation;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    // Products with shade/color options need a choice — send to the detail page.
    if (hasVariation) {
      router.push(`/product/${product.id}`);
      return;
    }
    add({ id: product.id, title: product.title, brand: product.brand, price: effectivePrice, image: product.image });
    flyToCart(imgRef.current, product.image);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Tilt max={6} glare className="h-full">
    <Link
      href={`/product/${product.id}`}
      className="s-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--s-line)] bg-white s-shadow"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div ref={imgRef} className="s-shine-wrap relative aspect-square overflow-hidden bg-[var(--s-cream-2)]">
        <ProductImage
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-gray-800 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {!isSoldOut && product.bestseller && (
            <span className="rounded-full bg-[var(--s-wine)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Bestseller
            </span>
          )}
          {!isSoldOut && saleOverride && saleOverride < product.price && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              SALE
            </span>
          )}
          {!isSoldOut && discount > 0 && (
            <span className="rounded-full bg-[var(--s-gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--s-ink)]">
              Save {discount}%
            </span>
          )}
          {stockQty !== undefined && stockQty > 0 && stockQty <= 5 && (
            <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Only {stockQty} left
            </span>
          )}
        </div>
        {!isSoldOut && (
          <button
            onClick={handleAdd}
            aria-label={hasVariation ? "Choose options" : "Add to cart"}
            title={hasVariation ? "Choose options" : "Add to cart"}
            className={`absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full shadow-lg transition-all duration-300 ${
              added ? "bg-green-600 text-white" : "bg-white text-[var(--s-wine)] hover:bg-[var(--s-wine)] hover:text-white"
            } translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
          >
            {added ? <Check className="h-5 w-5 s-pop" /> : hasVariation ? <SlidersHorizontal className="h-[18px] w-[18px]" /> : <Plus className="h-5 w-5" />}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--s-wine)]">{product.brand}</span>
          <StarRating value={product.rating} size={12} />
        </div>
        <h3 className="mt-1.5 line-clamp-2 flex-1 text-[13.5px] font-medium leading-snug text-[var(--s-ink)]">
          {product.title}
        </h3>
        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-lg font-bold ${saleOverride && saleOverride < product.price ? "text-red-600" : "text-[var(--s-ink)]"}`}>
              {money(effectivePrice)}
            </span>
            {effectiveCompareAt > effectivePrice && (
              <span className="text-xs text-[var(--s-ink-soft)] line-through">{money(effectiveCompareAt)}</span>
            )}
          </div>
          <span className="text-[10.5px] font-medium text-[var(--s-ink-soft)]">{product.sold}+ sold</span>
        </div>
      </div>
    </Link>
    </Tilt>
  );
}
