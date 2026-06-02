"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Minus, Plus, ShoppingBag, Check, BadgeCheck, Truck, RotateCcw, Gift, ChevronRight, Heart, Quote,
} from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart, money } from "@/lib/cart";
import { StarRating, ProductImage } from "@/components/store/bits";
import ProductCard from "@/components/store/ProductCard";
import { reviews } from "@/lib/reviews";
import { useSalePrices, useStock } from "@/components/store/SalePriceProvider";

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [variant, setVariant] = useState<string | null>(null);
  const [needsVariant, setNeedsVariant] = useState(false);
  const salePrices = useSalePrices();
  const stockQtys = useStock();
  const saleOverride = salePrices[product.id];
  const stockQty = stockQtys[product.id];
  const isSoldOut = stockQty === 0;
  const effectivePrice = saleOverride && saleOverride < product.price ? saleOverride : product.price;
  const effectiveCompareAt = saleOverride && saleOverride < product.price ? product.price : product.compareAt;
  const discount = Math.round((1 - effectivePrice / effectiveCompareAt) * 100);
  const saving = effectiveCompareAt - effectivePrice;
  const productReviews = reviews.slice(0, 3);
  const requiresVariant = !!product.variation;

  function handleAdd() {
    if (isSoldOut) return;
    if (requiresVariant && !variant) {
      setNeedsVariant(true);
      return;
    }
    add({ id: product.id, title: product.title, brand: product.brand, price: effectivePrice, image: product.image, ...(variant ? { variant } : {}) }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--s-ink-soft)]">
        <Link href="/" className="hover:text-[var(--s-wine)]">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?cat=${product.category}`} className="hover:text-[var(--s-wine)]">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?cat=${product.category}&sub=${encodeURIComponent(product.sub)}`} className="hover:text-[var(--s-wine)]">{product.sub}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-[var(--s-ink)]">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* image */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--s-line)] bg-white s-shadow">
            <div className="aspect-square overflow-hidden bg-[var(--s-cream-2)]">
              <ProductImage src={product.image} alt={product.title} className="h-full w-full object-cover" />
            </div>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.bestseller && <span className="rounded-full bg-[var(--s-wine)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Bestseller</span>}
              {discount > 0 && <span className="rounded-full bg-[var(--s-gold)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--s-ink)]">Save {discount}%</span>}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: BadgeCheck, t: "100% Authentic" },
              { icon: Truck, t: "Tracked shipping" },
              { icon: Gift, t: "Free sample" },
            ].map((f) => (
              <div key={f.t} className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--s-line)] bg-white p-3 text-center">
                <f.icon className="h-5 w-5 text-[var(--s-wine)]" />
                <span className="text-[11px] font-medium text-[var(--s-ink-soft)]">{f.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--s-wine)]">{product.brand}</span>
          <h1 className="mt-2 font-display text-[26px] font-bold leading-tight text-[var(--s-ink)] sm:text-3xl">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} size={16} showNum count={product.reviews} />
            <span className="text-xs text-[var(--s-ink-soft)]">· {product.sold}+ sold</span>
          </div>

          <div className="mt-5 flex items-end gap-3 flex-wrap">
            {isSoldOut ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2 text-base font-bold text-gray-500">
                Sold Out
              </span>
            ) : (
              <>
                <span className={`font-display text-4xl font-bold ${saleOverride && saleOverride < product.price ? "text-red-600" : "text-[var(--s-ink)]"}`}>
                  {money(effectivePrice)}
                </span>
                {effectiveCompareAt > effectivePrice && (
                  <>
                    <span className="mb-1 text-lg text-[var(--s-ink-soft)] line-through">{money(effectiveCompareAt)}</span>
                    <span className="mb-1.5 rounded-full bg-[var(--s-rose-soft)] px-2.5 py-1 text-xs font-bold text-[var(--s-wine)]">You save {money(saving)}</span>
                  </>
                )}
                {stockQty !== undefined && stockQty > 0 && stockQty <= 5 && (
                  <span className="mb-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">Only {stockQty} left!</span>
                )}
              </>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-[var(--s-ink-soft)]">{product.blurb}</p>

          <ul className="mt-5 space-y-2 text-sm text-[var(--s-ink)]">
            {[
              `Condition: ${product.condition}`,
              "Guaranteed genuine — batch-verified by hand",
              "Ships in 1 business day with tracking",
              "Free beauty sample tucked into every order",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-wine)]" /> {t}
              </li>
            ))}
          </ul>

          {/* variation selector */}
          {product.variation && (
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--s-ink)]">{product.variation.label}:</span>
                <span className="text-sm text-[var(--s-ink-soft)]">{variant ?? "Choose an option"}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.variation.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setVariant(opt); setNeedsVariant(false); }}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      variant === opt
                        ? "border-[var(--s-wine)] bg-[var(--s-wine)] text-white"
                        : "border-[var(--s-line)] bg-white text-[var(--s-ink)] hover:border-[var(--s-wine)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {needsVariant && (
                <p className="mt-2 text-xs font-medium text-[var(--s-wine)]">Please choose a {product.variation.label.toLowerCase()} first.</p>
              )}
            </div>
          )}

          {/* qty + add */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {!isSoldOut && (
              <div className="flex items-center rounded-full border border-[var(--s-line)] bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center rounded-full text-[var(--s-ink)] hover:bg-[var(--s-cream-2)]" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => stockQty !== undefined ? Math.min(q + 1, stockQty) : q + 1)} className="grid h-12 w-12 place-items-center rounded-full text-[var(--s-ink)] hover:bg-[var(--s-cream-2)]" aria-label="Increase"><Plus className="h-4 w-4" /></button>
              </div>
            )}
            <button
              onClick={handleAdd}
              disabled={isSoldOut}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold text-white transition-colors s-shadow ${
                isSoldOut ? "cursor-not-allowed bg-gray-300 text-gray-500" :
                added ? "bg-green-600" : "bg-[var(--s-wine)] hover:bg-[var(--s-wine-deep)]"
              }`}
            >
              {isSoldOut
                ? "Sold Out — Check back soon"
                : added
                  ? <><Check className="h-5 w-5 s-pop" /> Added to bag</>
                  : <><ShoppingBag className="h-5 w-5" /> Add to bag · {money(effectivePrice * qty)}</>
              }
            </button>
            <button aria-label="Save" className="grid h-12 w-12 place-items-center rounded-full border border-[var(--s-line)] bg-white text-[var(--s-wine)] hover:bg-[var(--s-rose-soft)]"><Heart className="h-5 w-5" /></button>
          </div>

          <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-[var(--s-wine)] hover:underline">
            View bag &amp; checkout →
          </Link>

          {/* trust callout */}
          <div className="mt-7 rounded-2xl border border-[var(--s-line)] bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--s-ink)]">
              <BadgeCheck className="h-5 w-5 text-green-600" /> Sold by Sara&apos;s Trading Post
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--s-ink-soft)]">
              99.8% positive feedback across 79,000+ orders. Every item is inspected and authenticated
              before it ships. Not genuine? Full refund, guaranteed. Questions?{" "}
              <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">Email Sara</a>.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--s-ink-soft)]">
              <Link href="/policies#returns" className="flex items-center gap-1.5 hover:text-[var(--s-wine)]"><RotateCcw className="h-3.5 w-3.5 text-[var(--s-wine)]" /> 30-day returns</Link>
              <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-[var(--s-wine)]" /> Fast tracked shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* description */}
      {product.description && (
        <section className="mt-16 border-t border-[var(--s-line)] pt-12">
          <h2 className="font-display text-2xl font-bold text-[var(--s-ink)]">Product details</h2>
          <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
            {product.description.split(/\n{2,}|(?<=\.)\s{2,}/).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
        </section>
      )}

      {/* reviews */}
      <section className="mt-16 border-t border-[var(--s-line)] pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--s-ink)]">What customers are saying</h2>
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={product.rating} size={16} />
              <span className="text-sm text-[var(--s-ink-soft)]">{product.rating.toFixed(1)} out of 5 · {product.reviews} reviews</span>
            </div>
          </div>
          <Link href="/reviews" className="text-sm font-semibold text-[var(--s-wine)] hover:underline">Read all reviews →</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {productReviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-[var(--s-line)] bg-white p-6">
              <Quote className="h-6 w-6 text-[var(--s-rose)]" />
              <StarRating value={r.rating} size={13} />
              <p className="mt-3 text-sm leading-relaxed text-[var(--s-ink-soft)]">{r.body}</p>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--s-line)] pt-3 text-xs">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--s-rose-soft)] font-bold text-[var(--s-wine)]">{r.initials}</span>
                <span><span className="font-semibold text-[var(--s-ink)]">{r.name}</span> · <span className="text-green-700">✓ Verified</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-[var(--s-ink)]">You may also love</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
