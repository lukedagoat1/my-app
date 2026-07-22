"use client";

import { Truck, Tag, Lock } from "lucide-react";
import { useCart, useCartTotals, money, SHIPPING_THRESHOLD } from "@/lib/cart";

export function FreeShipBar() {
  const { subtotal } = useCartTotals();
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
  return (
    <div className="rounded-xl border border-[var(--s-line)] bg-[var(--s-rose-soft)]/50 p-3.5">
      <p className="flex items-center gap-2 text-[13px] font-medium text-[var(--s-ink)]">
        <Truck className="h-4 w-4 text-[var(--s-wine)]" />
        {remaining > 0 ? (
          <>You&apos;re <span className="font-bold text-[var(--s-wine)]">{money(remaining)}</span> away from free shipping</>
        ) : (
          <span className="font-semibold text-green-700">You&apos;ve unlocked free shipping! 🎉</span>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[var(--s-wine)] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

type Totals = { subtotal: number; shipping: number; tax: number; total: number };

export default function OrderSummary({
  showItems = false,
  cta,
  totals,
}: {
  showItems?: boolean;
  cta?: React.ReactNode;
  /** Pass the checkout page's live/verified totals so this matches what's actually charged. Omit to estimate from the cart alone (pre-address). */
  totals?: Totals;
}) {
  const lines = useCart((s) => s.lines);
  const fallback = useCartTotals();
  const { subtotal, shipping, tax, total } = totals ?? fallback;

  return (
    <div className="rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
      <h2 className="font-display text-lg font-bold text-[var(--s-ink)]">Order summary</h2>

      {showItems && (
        <ul className="mt-4 space-y-3 border-b border-[var(--s-line)] pb-4">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-3 text-sm">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--s-line)] bg-[var(--s-cream-2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt={l.title} className="h-full w-full object-cover" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--s-wine)] text-[10px] font-bold text-white">{l.qty}</span>
              </span>
              <span className="line-clamp-2 flex-1 text-[var(--s-ink-soft)]">{l.title}{l.variant && <span className="text-[var(--s-ink-soft)]/80"> · {l.variant}</span>}</span>
              <span className="font-semibold text-[var(--s-ink)]">{money(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-[var(--s-ink-soft)]">Subtotal</dt><dd className="font-medium text-[var(--s-ink)]">{money(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-[var(--s-ink-soft)]">Shipping</dt>
          <dd className="font-medium text-[var(--s-ink)]">{shipping === 0 ? <span className="text-green-700">Free</span> : money(shipping)}</dd>
        </div>
        <div className="flex justify-between"><dt className="text-[var(--s-ink-soft)]">Estimated tax</dt><dd className="font-medium text-[var(--s-ink)]">{money(tax)}</dd></div>
        <div className="mt-2 flex items-center justify-between border-t border-[var(--s-line)] pt-3">
          <dt className="font-display text-base font-bold text-[var(--s-ink)]">Total</dt>
          <dd className="font-display text-xl font-bold text-[var(--s-ink)]">{money(total)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--s-cream-2)] px-3 py-2 text-[11.5px] text-[var(--s-ink-soft)]">
        <Tag className="h-3.5 w-3.5 text-[var(--s-wine)]" /> A free beauty sample 🎁 is included with this order.
      </div>

      {cta && <div className="mt-4">{cta}</div>}

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--s-ink-soft)]">
        <Lock className="h-3 w-3" /> Secure, encrypted checkout
      </p>
    </div>
  );
}
