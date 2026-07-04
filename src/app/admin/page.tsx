"use client";

import { useState, useEffect } from "react";
import { products, type Product } from "@/lib/products";
import type { StockEntry } from "@/lib/stock";
import ListingsTab from "./ListingsTab";
import OrdersTab from "./OrdersTab";

const WINE = "#7a1e2e";

// ── Auth ──────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/prices", { headers: { "x-admin-password": pw } });
    if (res.ok) { onLogin(pw); }
    else { setErr("Wrong password. Try again."); }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,.10)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🌸</div>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: WINE, margin: 0 }}>Sara&apos;s Trading Post</h1>
          <p style={{ color: "#777", fontSize: 14, marginTop: 6 }}>Admin Panel</p>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555" }}>Password</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} required
              style={{ display: "block", width: "100%", marginTop: 6, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2d8d0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          {err && <p style={{ color: "#c00", fontSize: 13, margin: 0 }}>{err}</p>}
          <button type="submit" style={{ background: WINE, color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 4 }}>
            Log in
          </button>
        </form>
        <p style={{ color: "#aaa", fontSize: 11, textAlign: "center", marginTop: 20 }}>
          Set <code>ADMIN_PASSWORD</code> in Vercel env vars to change the password.
        </p>
      </div>
    </div>
  );
}

// ── Prices tab ────────────────────────────────────────────────────────────────

function PricesTab({ password, allProducts }: { password: string; allProducts: Product[] }) {
  const products = allProducts;
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/prices", { headers: { "x-admin-password": password } })
      .then(r => r.json())
      .then((d: Record<string, number>) => {
        const s: Record<string, string> = {};
        for (const [id, p] of Object.entries(d)) s[id] = String(p);
        setPrices(s);
      }).catch(() => {});
  }, [password]);

  async function save() {
    setSaving(true); setMsg("");
    const body: Record<string, number> = {};
    for (const [id, val] of Object.entries(prices)) {
      const n = parseFloat(val);
      if (!isNaN(n) && n > 0) body[id] = n;
    }
    const res = await fetch("/api/admin/prices", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(body) });
    setSaving(false);
    setMsg(res.ok ? "✓ Saved! Prices are now live." : "✗ Error saving. Try again.");
    setTimeout(() => setMsg(""), 3500);
  }

  const grouped = products.reduce<Record<string, typeof products>>((acc, p) => { (acc[p.category] ??= []).push(p); return acc; }, {});
  const activeSales = Object.values(prices).filter(v => parseFloat(v) > 0).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#777", fontSize: 13, margin: 0 }}>
          {activeSales > 0 ? `${activeSales} product${activeSales > 1 ? "s" : ""} on sale` : "No active sale prices"}
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ color: msg.startsWith("✓") ? "#2e7d32" : "#c00", fontSize: 13, fontWeight: 600 }}>{msg}</span>}
          <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save All Prices"}</Btn>
        </div>
      </div>

      <InfoBanner>Enter a sale price <em>lower</em> than the regular price and click Save. Leave blank to remove the sale.</InfoBanner>

      {Object.entries(grouped).map(([cat, prods]) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <CatHeader>{cat}</CatHeader>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d8", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#faf6f2", borderBottom: "1px solid #e8e0d8" }}>
                  <th style={th}></th>
                  <th style={{ ...th, textAlign: "left" }}>Product</th>
                  <th style={{ ...th, textAlign: "right" }}>Regular</th>
                  <th style={{ ...th, textAlign: "right" }}>Sale Price</th>
                  <th style={{ ...th, width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {prods.map((p, i) => {
                  const val = prices[p.id] ?? "";
                  const n = parseFloat(val);
                  const onSale = !isNaN(n) && n > 0 && n < p.price;
                  return (
                    <tr key={p.id} style={{ borderTop: i > 0 ? "1px solid #f0ebe4" : undefined, background: onSale ? "#fff5f7" : undefined }}>
                      <td style={{ padding: "8px 14px", width: 48 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 8, border: "1px solid #e8e0d8" }} />
                      </td>
                      <td style={{ padding: "8px 14px" }}>
                        <strong style={{ display: "block", color: "#111" }}>{p.brand}</strong>
                        <span style={{ color: "#777", display: "block", maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                        {onSale && <span style={{ background: "#e53935", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 2 }}>SALE −{Math.round((1 - n / p.price) * 100)}%</span>}
                      </td>
                      <td style={{ padding: "8px 14px", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>
                        <span style={{ color: "#aaa", fontSize: 12 }}>$</span>
                        <input type="number" step="0.01" min="0.01" max={p.price - 0.01} placeholder="—" value={val}
                          onChange={e => setPrices(prev => ({ ...prev, [p.id]: e.target.value }))}
                          style={{ width: 72, padding: "6px 8px", borderRadius: 8, border: onSale ? "1.5px solid #e53935" : "1.5px solid #e2d8d0", fontSize: 13, outline: "none", background: onSale ? "#fff5f7" : "#fff", color: onSale ? "#c00" : "#111", fontWeight: onSale ? 700 : 400, textAlign: "right" }} />
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        {val && <button onClick={() => setPrices(prev => { const n = { ...prev }; delete n[p.id]; return n; })} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18 }}>×</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 40, gap: 10 }}>
        {msg && <span style={{ color: msg.startsWith("✓") ? "#2e7d32" : "#c00", fontSize: 13, fontWeight: 600, alignSelf: "center" }}>{msg}</span>}
        <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save All Prices"}</Btn>
      </div>
    </div>
  );
}

// ── Stock tab ─────────────────────────────────────────────────────────────────

function StockTab({ password, allProducts }: { password: string; allProducts: Product[] }) {
  const products = allProducts;
  const [stock, setStock] = useState<Record<string, StockEntry>>({});
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState("");
  const hasEbay = false; // set true if EBAY env vars detected (can't read them client-side)

  useEffect(() => {
    fetch("/api/admin/stock", { headers: { "x-admin-password": password } })
      .then(r => r.json())
      .then((d: Record<string, StockEntry>) => setStock(d))
      .catch(() => {});
  }, [password]);

  function getEntry(id: string): StockEntry { return stock[id] ?? {}; }

  function setQty(id: string, val: string) {
    const n = parseInt(val, 10);
    setStock(prev => ({
      ...prev,
      [id]: { ...getEntry(id), qty: isNaN(n) || val === "" ? undefined : Math.max(0, n) },
    }));
  }

  function setEbayId(id: string, val: string) {
    setStock(prev => ({
      ...prev,
      [id]: { ...getEntry(id), ebayItemId: val.trim() || undefined },
    }));
  }

  function removeTracking(id: string) {
    setStock(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function save() {
    setSaving(true); setMsg("");
    // Remove entries with no data
    const clean: Record<string, StockEntry> = {};
    for (const [id, e] of Object.entries(stock)) {
      if (e.qty !== undefined || e.ebayItemId) clean[id] = e;
    }
    const res = await fetch("/api/admin/stock", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(clean) });
    setSaving(false);
    setMsg(res.ok ? "✓ Stock saved." : "✗ Error saving.");
    setTimeout(() => setMsg(""), 3500);
  }

  async function syncEbay() {
    setSyncing(true); setMsg("");
    const res = await fetch("/api/admin/ebay-sync", { method: "POST", headers: { "x-admin-password": password } });
    const data = await res.json() as { ok?: boolean; updated?: number; errors?: string[]; error?: string };
    setSyncing(false);
    if (data.ok) {
      setMsg(`✓ Synced ${data.updated} product${data.updated !== 1 ? "s" : ""} from eBay.`);
      // Reload stock
      fetch("/api/admin/stock", { headers: { "x-admin-password": password } }).then(r => r.json()).then((d: Record<string, StockEntry>) => setStock(d)).catch(() => {});
    } else {
      setMsg(`✗ ${data.error ?? "Sync failed"}`);
    }
    setTimeout(() => setMsg(""), 5000);
  }

  const soldOutCount = Object.values(stock).filter(e => e.qty === 0).length;
  const trackedCount = Object.values(stock).filter(e => e.qty !== undefined).length;

  const grouped = products.reduce<Record<string, typeof products>>((acc, p) => { (acc[p.category] ??= []).push(p); return acc; }, {});

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#777", fontSize: 13, margin: 0 }}>
          {trackedCount} product{trackedCount !== 1 ? "s" : ""} tracked &nbsp;·&nbsp; {soldOutCount} sold out
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ color: msg.startsWith("✓") ? "#2e7d32" : "#c00", fontSize: 13, fontWeight: 600 }}>{msg}</span>}
          <Btn onClick={syncEbay} disabled={syncing} secondary>{syncing ? "Syncing…" : "↻ Sync from eBay"}</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Stock"}</Btn>
        </div>
      </div>

      <InfoBanner>
        <strong>How it works:</strong> Set a quantity for each product you want to track. Leave blank = unlimited stock (never shows "Sold Out"). When qty reaches 0, the product shows as Sold Out and can&apos;t be added to cart. Stock auto-decrements when orders are placed.<br /><br />
        <strong>eBay Sync:</strong> Add your eBay item ID (the number from the listing URL) and click &quot;Sync from eBay&quot; to automatically pull quantities. Requires <code>EBAY_APP_ID</code> and <code>EBAY_CERT_ID</code> in Vercel env vars.
      </InfoBanner>

      {Object.entries(grouped).map(([cat, prods]) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <CatHeader>{cat}</CatHeader>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d8", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#faf6f2", borderBottom: "1px solid #e8e0d8" }}>
                  <th style={th}></th>
                  <th style={{ ...th, textAlign: "left" }}>Product</th>
                  <th style={{ ...th, textAlign: "center" }}>Qty in Stock</th>
                  <th style={{ ...th, textAlign: "left" }}>eBay Item ID</th>
                  <th style={{ ...th, width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {prods.map((p, i) => {
                  const entry = getEntry(p.id);
                  const tracked = entry.qty !== undefined;
                  const soldOut = entry.qty === 0;
                  const low = tracked && !soldOut && (entry.qty ?? 99) <= 5;
                  return (
                    <tr key={p.id} style={{ borderTop: i > 0 ? "1px solid #f0ebe4" : undefined, background: soldOut ? "#fff5f7" : low ? "#fffbf0" : undefined }}>
                      <td style={{ padding: "8px 14px", width: 48 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 8, border: "1px solid #e8e0d8" }} />
                      </td>
                      <td style={{ padding: "8px 14px" }}>
                        <strong style={{ display: "block", color: "#111" }}>{p.brand}</strong>
                        <span style={{ color: "#777", display: "block", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                        {soldOut && <span style={{ background: "#333", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 2, letterSpacing: "0.05em" }}>SOLD OUT</span>}
                        {low && <span style={{ background: "#f57c00", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 2 }}>LOW STOCK</span>}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <input
                          type="number" min="0" step="1" placeholder="—"
                          value={entry.qty ?? ""}
                          onChange={e => setQty(p.id, e.target.value)}
                          style={{ width: 70, padding: "6px 8px", borderRadius: 8, border: soldOut ? "1.5px solid #e53935" : low ? "1.5px solid #f57c00" : "1.5px solid #e2d8d0", fontSize: 13, outline: "none", textAlign: "center", background: soldOut ? "#fff5f7" : "#fff", color: soldOut ? "#c00" : "#111", fontWeight: tracked ? 700 : 400 }}
                        />
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <input
                          type="text" placeholder="e.g. 335618391268"
                          value={entry.ebayItemId ?? ""}
                          onChange={e => setEbayId(p.id, e.target.value)}
                          style={{ width: "100%", maxWidth: 180, padding: "6px 8px", borderRadius: 8, border: "1.5px solid #e2d8d0", fontSize: 12, outline: "none", fontFamily: "monospace" }}
                        />
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        {(tracked || entry.ebayItemId) && (
                          <button onClick={() => removeTracking(p.id)} title="Remove tracking" style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18 }}>×</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 40, gap: 10 }}>
        {msg && <span style={{ color: msg.startsWith("✓") ? "#2e7d32" : "#c00", fontSize: 13, fontWeight: 600, alignSelf: "center" }}>{msg}</span>}
        <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Stock"}</Btn>
      </div>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────────────────

const th: React.CSSProperties = { padding: "10px 14px", fontWeight: 700, color: "#555", fontSize: 12, whiteSpace: "nowrap" };

function Btn({ onClick, disabled, children, secondary }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; secondary?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#ccc" : secondary ? "#fff" : WINE,
      color: disabled ? "#999" : secondary ? WINE : "#fff",
      border: secondary ? `1.5px solid ${WINE}` : "none",
      borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13,
      cursor: disabled ? "default" : "pointer", whiteSpace: "nowrap",
    }}>
      {children}
    </button>
  );
}

function CatHeader({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#666", marginBottom: 10 }}>{children}</h2>;
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff8e6", border: "1px solid #f0d060", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#6b4c00", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"listings" | "orders" | "prices" | "stock">("listings");
  const [custom, setCustom] = useState<Product[]>([]);

  // Stay logged in across refreshes (this tab only)
  useEffect(() => {
    const saved = sessionStorage.getItem("sara-admin-pw");
    if (saved) { setPassword(saved); setAuthed(true); }
  }, []);

  // Sara's own listings join the catalog in the Prices + Stock tabs
  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/listings", { headers: { "x-admin-password": password } })
      .then(r => r.json())
      .then((d: { custom?: Product[] }) => setCustom(d.custom ?? []))
      .catch(() => {});
  }, [authed, password, tab]);

  const allProducts = [...products, ...custom];

  if (!authed) return <LoginScreen onLogin={(pw) => { setPassword(pw); setAuthed(true); sessionStorage.setItem("sara-admin-pw", pw); }} />;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: WINE, margin: 0 }}>Sara&apos;s Trading Post — Admin</h1>
          <p style={{ color: "#999", fontSize: 12, marginTop: 4 }}>Changes take effect immediately for all visitors.</p>
        </div>
        <button onClick={() => { setAuthed(false); setPassword(""); sessionStorage.removeItem("sara-admin-pw"); }} style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: "#888", cursor: "pointer" }}>
          Log out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "2px solid #e8e0d8", paddingBottom: 0 }}>
        {(["listings", "orders", "prices", "stock"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 20px", fontWeight: 700, fontSize: 14,
            color: tab === t ? WINE : "#888",
            borderBottom: tab === t ? `2px solid ${WINE}` : "2px solid transparent",
            marginBottom: -2, textTransform: "capitalize",
          }}>
            {t === "listings" ? "🛍️ My Listings" : t === "orders" ? "🧾 Orders" : t === "prices" ? "💰 Sale Prices" : "📦 Inventory / Stock"}
          </button>
        ))}
      </div>

      {tab === "listings" ? <ListingsTab password={password} />
        : tab === "orders" ? <OrdersTab password={password} />
        : tab === "prices" ? <PricesTab password={password} allProducts={allProducts} />
        : <StockTab password={password} allProducts={allProducts} />}

      <p style={{ textAlign: "center", color: "#ccc", fontSize: 11, paddingBottom: 24 }}>Sara&apos;s Trading Post · Admin</p>
    </div>
  );
}
