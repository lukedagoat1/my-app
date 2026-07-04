"use client";

import { useEffect, useRef, useState } from "react";
import { products as catalog, type Product, type Category } from "@/lib/products";

const WINE = "#7a1e2e";
const CATEGORIES: Category[] = ["Makeup", "Skincare", "Fragrance"];

interface ListingsDoc { custom: Product[]; hidden: string[] }

type Draft = {
  id?: string;
  title: string; brand: string; category: Category; sub: string;
  price: string; compareAt: string; condition: string;
  blurb: string; description: string; image: string;
  variationLabel: string; variationOptions: string;
};

const emptyDraft: Draft = {
  title: "", brand: "", category: "Makeup", sub: "",
  price: "", compareAt: "", condition: "New / Sealed",
  blurb: "", description: "", image: "",
  variationLabel: "", variationOptions: "",
};

export default function ListingsTab({ password }: { password: string }) {
  const [doc, setDoc] = useState<ListingsDoc>({ custom: [], hidden: [] });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const authHeaders = { "x-admin-password": password };

  function load() {
    fetch("/api/admin/listings", { headers: authHeaders })
      .then(r => r.json())
      .then((d: ListingsDoc) => setDoc({ custom: d.custom ?? [], hidden: d.hidden ?? [] }))
      .catch(() => {});
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [password]);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 4000); }

  function editProduct(p: Product) {
    setDraft({
      id: p.id, title: p.title, brand: p.brand, category: p.category, sub: p.sub,
      price: String(p.price), compareAt: p.compareAt > p.price ? String(p.compareAt) : "",
      condition: p.condition, blurb: p.blurb === p.title ? "" : p.blurb,
      description: p.description ?? "", image: p.image,
      variationLabel: p.variation?.label ?? "", variationOptions: p.variation?.options.join(", ") ?? "",
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      }
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ name: file.name, data: btoa(binary) }),
      });
      const d = await res.json() as { url?: string; error?: string };
      if (d.url) setDraft(prev => prev ? { ...prev, image: d.url! } : prev);
      else flash(`✗ ${d.error ?? "Upload failed"}`);
    } catch { flash("✗ Upload failed"); }
    setUploading(false);
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.trim() || !parseFloat(draft.price)) { flash("✗ Title and price are required"); return; }
    setSaving(true);
    const body = {
      id: draft.id,
      title: draft.title, brand: draft.brand, category: draft.category,
      sub: draft.sub || "Other", price: parseFloat(draft.price),
      compareAt: parseFloat(draft.compareAt) || undefined,
      condition: draft.condition, blurb: draft.blurb, description: draft.description,
      image: draft.image,
      variation: draft.variationLabel.trim() && draft.variationOptions.trim()
        ? { label: draft.variationLabel.trim(), options: draft.variationOptions.split(",").map(s => s.trim()).filter(Boolean) }
        : undefined,
    };
    const res = await fetch("/api/admin/listings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) { setDraft(null); flash("✓ Listing saved! Live in the shop within about 30 seconds."); load(); }
    else { const d = await res.json().catch(() => ({})) as { error?: string }; flash(`✗ ${d.error ?? "Error saving"}`); }
  }

  async function act(id: string, action: "delete" | "hide" | "show") {
    if (action === "delete" && !confirm("Delete this listing permanently?")) return;
    const res = await fetch("/api/admin/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) { load(); flash(action === "delete" ? "✓ Deleted." : action === "hide" ? "✓ Hidden from the shop." : "✓ Back in the shop."); }
    else flash("✗ Something went wrong");
  }

  const input: React.CSSProperties = { display: "block", width: "100%", marginTop: 5, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2d8d0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#555" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#777", fontSize: 13, margin: 0 }}>
          {doc.custom.length} of your own listing{doc.custom.length !== 1 ? "s" : ""} · {doc.hidden.length} hidden
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ color: msg.startsWith("✓") ? "#2e7d32" : "#c00", fontSize: 13, fontWeight: 600 }}>{msg}</span>}
          <button onClick={() => setDraft({ ...emptyDraft })} style={{ background: WINE, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            ＋ Add new listing
          </button>
        </div>
      </div>

      <div style={{ background: "#fff8e6", border: "1px solid #f0d060", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#6b4c00", lineHeight: 1.6 }}>
        Add your own products here — they appear in the shop instantly, with checkout, stock tracking and sale prices, just like everything else. You can also hide any product you no longer want to sell.
      </div>

      {/* Sara's own listings */}
      {doc.custom.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#666", marginBottom: 10 }}>Your listings</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {doc.custom.map(p => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e0d8", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.image ? <img src={p.image} alt="" style={{ width: "100%", height: 140, objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: 140, background: "#f6f0ea", display: "grid", placeItems: "center", color: "#c8b8a8", fontSize: 12 }}>No photo</div>}
                <div style={{ padding: "10px 12px" }}>
                  <strong style={{ display: "block", fontSize: 13, color: "#111", lineHeight: 1.3, maxHeight: 34, overflow: "hidden" }}>{p.title}</strong>
                  <span style={{ color: "#777", fontSize: 12 }}>{p.brand} · ${p.price.toFixed(2)}</span>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button onClick={() => editProduct(p)} style={{ flex: 1, background: "#fff", color: WINE, border: `1.5px solid ${WINE}`, borderRadius: 8, padding: "7px 0", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => act(p.id, "delete")} style={{ background: "#fff", color: "#c00", border: "1.5px solid #e0b4b4", borderRadius: 8, padding: "7px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog products — hide/show */}
      <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#666", marginBottom: 10 }}>Store catalog</h2>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d8", overflow: "hidden" }}>
        {catalog.map((p, i) => {
          const hidden = doc.hidden.includes(p.id);
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", borderTop: i > 0 ? "1px solid #f0ebe4" : undefined, opacity: hidden ? 0.5 : 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 8, border: "1px solid #e8e0d8", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: "block", fontSize: 13, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</strong>
                <span style={{ color: "#777", fontSize: 12 }}>{p.brand} · ${p.price.toFixed(2)}{hidden && " · HIDDEN"}</span>
              </div>
              <button onClick={() => act(p.id, hidden ? "show" : "hide")}
                style={{ background: hidden ? WINE : "#fff", color: hidden ? "#fff" : "#888", border: hidden ? "none" : "1px solid #ddd", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                {hidden ? "Show" : "Hide"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add / Edit modal */}
      {draft && (
        <div onClick={e => { if (e.target === e.currentTarget) setDraft(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(30,10,15,.45)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 16px", overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 26px", width: "100%", maxWidth: 620, boxShadow: "0 12px 48px rgba(0,0,0,.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontWeight: 800, fontSize: 19, color: WINE, margin: 0 }}>{draft.id ? "Edit listing" : "Add a new listing"}</h2>
              <button onClick={() => setDraft(null)} style={{ background: "none", border: "none", fontSize: 22, color: "#999", cursor: "pointer" }}>×</button>
            </div>

            {/* Photo */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {draft.image ? <img src={draft.image} alt="" style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12, border: "1px solid #e8e0d8" }} />
                : <div style={{ width: 90, height: 90, borderRadius: 12, background: "#f6f0ea", display: "grid", placeItems: "center", color: "#c8b8a8", fontSize: 11, textAlign: "center" }}>No photo yet</div>}
              <div>
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  style={{ background: "#fff", color: WINE, border: `1.5px solid ${WINE}`, borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {uploading ? "Uploading…" : draft.image ? "Change photo" : "📷 Upload photo"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
                <p style={{ color: "#999", fontSize: 11, marginTop: 6 }}>JPG or PNG, up to 4MB. A clear photo sells best!</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={label}>Title *</label>
                <input style={input} value={draft.title} placeholder="e.g. CHANEL No.5 Eau de Parfum 3.4oz — New in Box"
                  onChange={e => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div>
                <label style={label}>Brand</label>
                <input style={input} value={draft.brand} placeholder="e.g. CHANEL" onChange={e => setDraft({ ...draft, brand: e.target.value })} />
              </div>
              <div>
                <label style={label}>Category</label>
                <select style={{ ...input, background: "#fff" }} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as Category })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Price * ($)</label>
                <input style={input} type="number" min="0.5" step="0.01" value={draft.price} placeholder="29.99" onChange={e => setDraft({ ...draft, price: e.target.value })} />
              </div>
              <div>
                <label style={label}>Compare-at price ($, optional)</label>
                <input style={input} type="number" min="0" step="0.01" value={draft.compareAt} placeholder="Retail price, shows the savings" onChange={e => setDraft({ ...draft, compareAt: e.target.value })} />
              </div>
              <div>
                <label style={label}>Condition</label>
                <input style={input} value={draft.condition} onChange={e => setDraft({ ...draft, condition: e.target.value })} />
              </div>
              <div>
                <label style={label}>Type (shown in filters)</label>
                <input style={input} value={draft.sub} placeholder="e.g. Perfume, Lipstick, Serum" onChange={e => setDraft({ ...draft, sub: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={label}>Short tagline (one sentence, shown on the card)</label>
                <input style={input} value={draft.blurb} placeholder="e.g. The timeless classic, sealed and authentic." onChange={e => setDraft({ ...draft, blurb: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={label}>Full description</label>
                <textarea style={{ ...input, minHeight: 100, resize: "vertical" }} value={draft.description}
                  placeholder="Size, condition details, authenticity, shipping notes…" onChange={e => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div>
                <label style={label}>Options label (optional)</label>
                <input style={input} value={draft.variationLabel} placeholder="e.g. Shade" onChange={e => setDraft({ ...draft, variationLabel: e.target.value })} />
              </div>
              <div>
                <label style={label}>Options (comma-separated)</label>
                <input style={input} value={draft.variationOptions} placeholder="e.g. Ivory, Beige, Sand" onChange={e => setDraft({ ...draft, variationOptions: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
              <button onClick={() => setDraft(null)} style={{ background: "#fff", color: "#888", border: "1px solid #ddd", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={save} disabled={saving || uploading}
                style={{ background: saving ? "#ccc" : WINE, color: "#fff", border: "none", borderRadius: 10, padding: "11px 26px", fontWeight: 700, fontSize: 13, cursor: saving ? "default" : "pointer" }}>
                {saving ? "Saving…" : draft.id ? "Save changes" : "Publish listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
