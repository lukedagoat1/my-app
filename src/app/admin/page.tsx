"use client";

import { useState, useEffect } from "react";
import { products } from "@/lib/products";

const WINE = "#7a1e2e";
const GOLD = "#c9a84c";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Load existing sale prices after login
  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/prices", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((data: Record<string, number>) => {
        const asStrings: Record<string, string> = {};
        for (const [id, p] of Object.entries(data)) asStrings[id] = String(p);
        setPrices(asStrings);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/prices", { headers: { "x-admin-password": password } });
    if (res.ok) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Wrong password. Try again.");
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    const body: Record<string, number> = {};
    for (const [id, val] of Object.entries(prices)) {
      const n = parseFloat(val);
      if (!isNaN(n) && n > 0) body[id] = n;
    }
    const res = await fetch("/api/admin/prices", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "Saved! Prices are now live." : "Error saving. Please try again.");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  function clearPrice(id: string) {
    setPrices((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  if (!authed) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fdf0f2", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 12 }}>
              🌸
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 22, color: WINE, margin: 0 }}>Sara&apos;s Trading Post</h1>
            <p style={{ color: "#777", fontSize: 14, marginTop: 6 }}>Admin — Price Manager</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{ display: "block", width: "100%", marginTop: 6, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2d8d0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {authError && (
              <p style={{ color: "#c00", fontSize: 13, margin: 0 }}>{authError}</p>
            )}
            <button
              type="submit"
              style={{ background: WINE, color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 4 }}
            >
              Log in
            </button>
          </form>
          <p style={{ color: "#aaa", fontSize: 11, textAlign: "center", marginTop: 20 }}>
            Set <code>ADMIN_PASSWORD</code> in your environment to change the password.
          </p>
        </div>
      </div>
    );
  }

  const grouped = products.reduce<Record<string, typeof products>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  const activeSaleCount = Object.keys(prices).filter((id) => {
    const val = parseFloat(prices[id]);
    return !isNaN(val) && val > 0;
  }).length;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 26, color: WINE, margin: 0 }}>Price Manager</h1>
          <p style={{ color: "#777", fontSize: 13, marginTop: 4 }}>
            {activeSaleCount > 0
              ? `${activeSaleCount} product${activeSaleCount !== 1 ? "s" : ""} on sale — prices shown to all shoppers`
              : "No active sale prices — all products showing at regular price"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saveMsg && (
            <span style={{ color: saveMsg.startsWith("Saved") ? "#2e7d32" : "#c00", fontSize: 14, fontWeight: 600 }}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: saving ? "#999" : WINE, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}
          >
            {saving ? "Saving…" : "Save All Prices"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background: "#fff8e6", border: "1px solid #f0d060", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#6b4c00" }}>
        <strong>How to use:</strong> Enter a sale price lower than the regular price and click Save. Leave a field blank to remove the sale. Prices apply site-wide immediately after saving.
      </div>

      {/* Product tables by category */}
      {Object.entries(grouped).map(([category, prods]) => (
        <div key={category} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: 12 }}>{category}</h2>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d8", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#faf6f2", borderBottom: "1px solid #e8e0d8" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#555", width: 56 }}></th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#555" }}>Product</th>
                  <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>Reg. Price</th>
                  <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>Sale Price</th>
                  <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 700, color: "#555", width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {prods.map((p, i) => {
                  const saleVal = prices[p.id];
                  const saleNum = parseFloat(saleVal ?? "");
                  const isOnSale = !isNaN(saleNum) && saleNum > 0 && saleNum < p.price;
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderTop: i > 0 ? "1px solid #f0ebe4" : undefined,
                        background: isOnSale ? "#fff5f7" : undefined,
                      }}
                    >
                      <td style={{ padding: "10px 16px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.title} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8, border: "1px solid #e8e0d8" }} />
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontWeight: 600, color: "#1a1a1a", display: "block" }}>{p.brand}</span>
                        <span style={{ color: "#777", display: "block", maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.title}
                        </span>
                        {isOnSale && (
                          <span style={{ background: "#e53935", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, letterSpacing: "0.05em", display: "inline-block", marginTop: 2 }}>
                            SALE — Save {Math.round((1 - saleNum / p.price) * 100)}% extra
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>
                        ${p.price.toFixed(2)}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                          <span style={{ color: "#aaa", fontSize: 13 }}>$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={p.price - 0.01}
                            placeholder="—"
                            value={prices[p.id] ?? ""}
                            onChange={(e) => setPrices((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            style={{
                              width: 80,
                              padding: "7px 10px",
                              borderRadius: 8,
                              border: isOnSale ? "1.5px solid #e53935" : "1.5px solid #e2d8d0",
                              fontSize: 13,
                              outline: "none",
                              background: isOnSale ? "#fff5f7" : "#fff",
                              color: isOnSale ? "#c00" : "#1a1a1a",
                              fontWeight: isOnSale ? 700 : 400,
                              textAlign: "right",
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        {(prices[p.id] ?? "") !== "" && (
                          <button
                            onClick={() => clearPrice(p.id)}
                            title="Remove sale price"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 18, lineHeight: 1, padding: "2px 4px" }}
                          >
                            ×
                          </button>
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

      {/* Bottom save */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8, paddingBottom: 40 }}>
        {saveMsg && (
          <span style={{ color: saveMsg.startsWith("Saved") ? "#2e7d32" : "#c00", fontSize: 14, fontWeight: 600, alignSelf: "center" }}>
            {saveMsg}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? "#999" : WINE, color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15, cursor: saving ? "default" : "pointer" }}
        >
          {saving ? "Saving…" : "Save All Prices"}
        </button>
      </div>

      <p style={{ textAlign: "center", color: "#bbb", fontSize: 11, paddingBottom: 24 }}>
        Sara&apos;s Trading Post · Admin
      </p>
    </div>
  );
}
