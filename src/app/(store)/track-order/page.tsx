"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, Search, CheckCircle2, Clock, XCircle, Loader2, ArrowRight } from "lucide-react";

interface TrackResult {
  status: string;
  statusInfo: { label: string; color: string; description: string };
  amount: number;
  customerEmail: string;
  created: number;
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-6 py-24 text-center text-[var(--s-ink-soft)]">Loading…</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") ?? "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(id: string) {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/track-order?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Not found");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Order not found.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-lookup if id is in URL
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) lookup(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    green: <CheckCircle2 className="h-10 w-10 text-green-600" />,
    blue:  <Clock className="h-10 w-10 text-blue-500" />,
    red:   <XCircle className="h-10 w-10 text-red-500" />,
    yellow:<Clock className="h-10 w-10 text-yellow-500" />,
    gray:  <Package className="h-10 w-10 text-gray-400" />,
  };

  const bgMap: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue:  "bg-blue-50 border-blue-200 text-blue-800",
    red:   "bg-red-50 border-red-200 text-red-800",
    yellow:"bg-yellow-50 border-yellow-200 text-yellow-800",
    gray:  "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--s-rose-soft)] text-[var(--s-wine)]">
          <Package className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-[var(--s-ink)]">Track Your Order</h1>
        <p className="mt-2 text-sm text-[var(--s-ink-soft)]">Enter your order ID from your confirmation email.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
        <label className="text-xs font-semibold text-[var(--s-ink)]">Order ID</label>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup(orderId)}
            placeholder="e.g. STP-A1B2C3"
            className="flex-1 rounded-xl border border-[var(--s-line)] bg-white px-3.5 py-3 text-sm text-[var(--s-ink)] outline-none focus:border-[var(--s-wine)]"
          />
          <button
            onClick={() => lookup(orderId)}
            disabled={loading || !orderId.trim()}
            className="flex items-center gap-2 rounded-xl bg-[var(--s-wine)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Look up
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {result && (
          <div className="mt-5">
            <div className={`flex items-start gap-4 rounded-xl border p-4 ${bgMap[result.statusInfo.color] ?? bgMap.gray}`}>
              {iconMap[result.statusInfo.color] ?? iconMap.gray}
              <div>
                <p className="font-display text-lg font-bold">{result.statusInfo.label}</p>
                <p className="mt-0.5 text-sm">{result.statusInfo.description}</p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--s-ink-soft)]">Order placed</dt>
                <dd>{new Date(result.created * 1000).toLocaleDateString("en-US", { dateStyle: "medium" })}</dd>
              </div>
              {result.amount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--s-ink-soft)]">Amount charged</dt>
                  <dd className="font-semibold">${result.amount.toFixed(2)}</dd>
                </div>
              )}
            </dl>

            {result.status === "succeeded" && (
              <div className="mt-4 rounded-xl border border-[var(--s-line)] bg-[var(--s-cream-2)] p-4 text-sm text-[var(--s-ink-soft)]">
                <p className="font-semibold text-[var(--s-ink)]">📦 What happens next?</p>
                <p className="mt-1">Sara is packing your order with care. You&apos;ll receive a shipping confirmation email with tracking within 1 business day.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--s-ink-soft)]">
        Can&apos;t find your order?{" "}
        <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
          Email sarastradingpost@gmail.com
        </a>
      </p>

      <div className="mt-8 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--s-wine)] hover:underline">
          Back to shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
