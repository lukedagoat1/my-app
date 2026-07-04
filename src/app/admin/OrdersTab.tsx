"use client";

import { useEffect, useState } from "react";
import { products as catalog } from "@/lib/products";
import type { OrderRecord } from "@/lib/orders";

const WINE = "#7a1e2e";

function titleFor(id: string, customTitles: Record<string, string>) {
  return customTitles[id] ?? catalog.find((p) => p.id === id)?.title ?? id;
}

export default function OrdersTab({ password }: { password: string }) {
  const [orders, setOrders] = useState<OrderRecord[] | null>(null);
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/orders", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d: OrderRecord[]) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]));
    fetch("/api/admin/listings", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d: { custom?: { id: string; title: string }[] }) =>
        setCustomTitles(Object.fromEntries((d.custom ?? []).map((p) => [p.id, p.title]))))
      .catch(() => {});
  }, [password]);

  if (orders === null) return <p style={{ color: "#999", fontSize: 14 }}>Loading orders…</p>;

  const revenue = orders.reduce((a, o) => a + o.amount, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Orders" value={String(orders.length)} />
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} />
        <StatCard label="Latest" value={orders[0] ? new Date(orders[0].date).toLocaleDateString() : "—"} />
      </div>

      <div style={{ background: "#fff8e6", border: "1px solid #f0d060", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#6b4c00", lineHeight: 1.6 }}>
        Orders appear here automatically when a customer completes checkout. For refunds or payment details, use your{" "}
        <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noreferrer" style={{ color: WINE, fontWeight: 700 }}>Stripe dashboard</a>.
      </div>

      {orders.length === 0 ? (
        <p style={{ color: "#999", fontSize: 14, textAlign: "center", padding: "40px 0" }}>No orders yet — they&apos;ll show up here as soon as someone buys.</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d8", overflow: "hidden" }}>
          {orders.map((o, i) => (
            <div key={o.pi} style={{ padding: "14px 16px", borderTop: i > 0 ? "1px solid #f0ebe4" : undefined, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "baseline" }}>
              <div style={{ minWidth: 130 }}>
                <strong style={{ display: "block", color: "#111", fontSize: 14 }}>{o.orderId || o.pi.slice(0, 14)}</strong>
                <span style={{ color: "#999", fontSize: 12 }}>{new Date(o.date).toLocaleString()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <span style={{ display: "block", color: "#333", fontSize: 13, fontWeight: 600 }}>{o.name || "—"} · {o.email || "no email"}</span>
                <span style={{ color: "#777", fontSize: 12.5 }}>
                  {o.items.length
                    ? o.items.map((it) => `${it.qty}× ${titleFor(it.id, customTitles)}`).join(" · ")
                    : "items not recorded"}
                </span>
              </div>
              <strong style={{ color: WINE, fontSize: 15, whiteSpace: "nowrap" }}>${o.amount.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e0d8", borderRadius: 14, padding: "14px 22px", minWidth: 120 }}>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: WINE }}>{value}</p>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999" }}>{label}</p>
    </div>
  );
}
