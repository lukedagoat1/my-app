"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Mail, Gift, ArrowRight, Truck, XCircle, Search } from "lucide-react";
import { money, useCart } from "@/lib/cart";

interface Order {
  id: string; email: string; name: string; address: string;
  items: { title: string; qty: number; price: number; image: string; variant?: string }[];
  totals: { subtotal: number; shipping: number; tax: number; total: number };
  date: string;
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-6 py-24 text-center text-[var(--s-ink-soft)]">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "empty">("loading");
  const searchParams = useSearchParams();
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");
    const paymentIntent = searchParams.get("payment_intent");

    try {
      const raw = sessionStorage.getItem("sara-last-order");
      if (raw) {
        const parsed = JSON.parse(raw) as Order;
        setOrder(parsed);

        if (redirectStatus === "failed") {
          setStatus("failed");
          sessionStorage.removeItem("sara-last-order");
        } else {
          setStatus("success");
          sessionStorage.removeItem("sara-last-order");
          clear();
          // Send receipt email to Sara (fire and forget)
          fetch("/api/send-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed),
          }).catch(() => {});
        }
      } else if (paymentIntent) {
        setStatus(redirectStatus === "succeeded" ? "success" : "failed");
      } else {
        setStatus("empty");
      }
    } catch {
      setStatus("empty");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center text-[var(--s-ink-soft)]">Loading…</div>
  );

  if (status === "failed") return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <XCircle className="mx-auto h-16 w-16 text-red-500" />
      <h1 className="mt-6 font-display text-3xl font-bold text-[var(--s-ink)]">Payment not completed</h1>
      <p className="mt-2 text-[var(--s-ink-soft)]">Your card was not charged. Please try again.</p>
      <Link href="/checkout" className="mt-6 inline-block rounded-full bg-[var(--s-wine)] px-6 py-3 text-sm font-semibold text-white">Try again</Link>
    </div>
  );

  if (status === "empty" || !order) return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-[var(--s-ink)]">No recent order found</h1>
      <p className="mt-2 text-[var(--s-ink-soft)]">Looks like there&apos;s nothing to show here yet.</p>
      <Link href="/shop" className="mt-6 inline-block rounded-full bg-[var(--s-wine)] px-6 py-3 text-sm font-semibold text-white">Browse the collection</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <div className="text-center">
        <span className="s-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-11 w-11" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-[var(--s-ink)] sm:text-4xl">
          Thank you, {order.name.split(" ")[0]}! 🎉
        </h1>
        <p className="mt-2 text-[var(--s-ink-soft)]">Your order is confirmed and being lovingly packed.</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-white px-5 py-2 text-sm font-semibold text-[var(--s-ink)]">
          <Package className="h-4 w-4 text-[var(--s-wine)]" /> Order {order.id}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
        <div className="flex items-start gap-3 rounded-xl bg-[var(--s-rose-soft)]/50 p-4">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--s-wine)]" />
          <p className="text-sm text-[var(--s-ink)]">
            A confirmation is on its way to <span className="font-semibold">{order.email}</span>.
            We&apos;ll email tracking the moment it ships (usually within one business day).
          </p>
        </div>

        <ul className="mt-5 divide-y divide-[var(--s-line)]">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center gap-3 py-3 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt={it.title} className="h-14 w-14 rounded-lg border border-[var(--s-line)] object-cover" />
              <span className="line-clamp-2 flex-1 text-[var(--s-ink-soft)]">
                {it.title}{it.variant && ` (${it.variant})`} × {it.qty}
              </span>
              <span className="font-semibold text-[var(--s-ink)]">{money(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-[var(--s-line)] pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-[var(--s-ink-soft)]">Subtotal</dt><dd>{money(order.totals.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--s-ink-soft)]">Shipping</dt><dd>{order.totals.shipping === 0 ? "Free" : money(order.totals.shipping)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--s-ink-soft)]">Tax</dt><dd>{money(order.totals.tax)}</dd></div>
          <div className="flex justify-between border-t border-[var(--s-line)] pt-2 font-display text-base font-bold">
            <dt>Total charged</dt><dd>{money(order.totals.total)}</dd>
          </div>
        </dl>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--s-line)] p-3.5 text-sm">
            <Truck className="h-5 w-5 text-[var(--s-wine)]" />
            <div>
              <p className="font-semibold text-[var(--s-ink)]">Shipping to</p>
              <p className="text-xs text-[var(--s-ink-soft)]">{order.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--s-line)] bg-[var(--s-cream-2)] p-3.5 text-sm">
            <Gift className="h-5 w-5 text-[var(--s-wine)]" />
            <div>
              <p className="font-semibold text-[var(--s-ink)]">A free beauty sample</p>
              <p className="text-xs text-[var(--s-ink-soft)]">is tucked into your package 🎁</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--s-wine)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)]"
        >
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/track-order?id=${order.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--s-ink)] hover:border-[var(--s-wine)]"
        >
          <Search className="h-4 w-4" /> Track this order
        </Link>
        <p className="mt-2 text-xs text-[var(--s-ink-soft)]">
          Questions? Email{" "}
          <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
            sarastradingpost@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
