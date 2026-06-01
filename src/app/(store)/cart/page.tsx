"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, BadgeCheck } from "lucide-react";
import { useCart, useHydrated, money } from "@/lib/cart";
import OrderSummary, { FreeShipBar } from "@/components/store/OrderSummary";
import { products } from "@/lib/products";
import ProductCard from "@/components/store/ProductCard";

export default function CartPage() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const suggestions = products
    .filter((p) => p.bestseller && !lines.some((l) => l.id === p.id))
    .slice(0, 4);

  if (!hydrated) {
    return <div className="mx-auto max-w-7xl px-6 py-24 text-center text-[var(--s-ink-soft)]">Loading your bag…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--s-rose-soft)]">
          <ShoppingBag className="h-9 w-9 text-[var(--s-wine)]" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-[var(--s-ink)]">Your bag is empty</h1>
        <p className="mt-2 text-[var(--s-ink-soft)]">Let&apos;s find you something beautiful — and authentic.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--s-wine)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)]">
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-[var(--s-ink)] sm:text-4xl">Your Bag</h1>
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--s-ink-soft)] hover:text-[var(--s-wine)]">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4"><FreeShipBar /></div>
          <ul className="divide-y divide-[var(--s-line)] rounded-2xl border border-[var(--s-line)] bg-white">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 p-4 sm:p-5">
                <Link href={`/product/${l.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--s-line)] bg-[var(--s-cream-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt={l.title} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--s-wine)]">{l.brand}</span>
                      <Link href={`/product/${l.id}`} className="block text-sm font-medium leading-snug text-[var(--s-ink)] hover:underline">{l.title}</Link>
                      {l.variant && <span className="mt-1 inline-block rounded-full bg-[var(--s-cream-2)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--s-ink-soft)]">{l.variant}</span>}
                    </div>
                    <button onClick={() => remove(l.key)} className="shrink-0 text-[var(--s-ink-soft)] transition-colors hover:text-[var(--s-wine)]" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-[var(--s-line)]">
                      <button onClick={() => setQty(l.key, l.qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--s-cream-2)]" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{l.qty}</span>
                      <button onClick={() => setQty(l.key, l.qty + 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--s-cream-2)]" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="font-display text-lg font-bold text-[var(--s-ink)]">{money(l.price * l.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            cta={
              <Link href="/checkout" className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--s-wine)] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[var(--s-wine-deep)]">
                Secure checkout <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--s-ink-soft)]">
            <BadgeCheck className="h-4 w-4 text-green-600" /> 99.8% positive · 79,000+ orders shipped
          </p>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-[var(--s-ink)]">Complete the look</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {suggestions.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
