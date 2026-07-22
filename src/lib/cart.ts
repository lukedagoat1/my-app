"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CartLine {
  key: string;        // unique per product + variant
  id: string;         // product id (for linking to detail page)
  title: string;
  brand: string;
  price: number;
  image: string;
  qty: number;
  variant?: string;   // e.g. selected shade/color/type
}

/** Stable line key from product id + chosen variant. */
export const lineKey = (id: string, variant?: string) =>
  variant ? `${id}__${variant}` : id;

interface CartState {
  lines: CartLine[];
  add: (item: Omit<CartLine, "qty" | "key">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  lastAdded: string | null;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      lastAdded: null,
      add: (item, qty = 1) =>
        set((s) => {
          const key = lineKey(item.id, item.variant);
          const existing = s.lines.find((l) => l.key === key);
          const lines = existing
            ? s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { ...item, key, qty }];
          return { lines, lastAdded: key };
        }),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [], lastAdded: null }),
    }),
    {
      name: "sara-cart",
      version: 1,
      // Older carts stored lines without a `key`; backfill from id.
      migrate: (persisted: unknown) => {
        const state = persisted as CartState | undefined;
        if (state?.lines) {
          state.lines = state.lines.map((l) => ({ ...l, key: l.key ?? lineKey(l.id, l.variant) }));
        }
        return state as CartState;
      },
    }
  )
);

export function useCartCount() {
  const [n, setN] = useState(0);
  const lines = useCart((s) => s.lines);
  useEffect(() => setN(lines.reduce((a, l) => a + l.qty, 0)), [lines]);
  return n;
}

export const SHIPPING_THRESHOLD = 75;
export const SHIPPING_FLAT = 6.95;
export const TAX_RATE = 0.0825;
// Sara has sales-tax nexus only in Texas — extend when the business
// registers in more states. Shared with the server-side price recompute
// in src/lib/pricing.ts so the checkout estimate matches the real charge.
export const TAX_STATES = new Set(["TX"]);

/** state = 2-letter shipping destination, once known; omit for a pre-address estimate. */
export function useCartTotals(state?: string) {
  const lines = useCart((s) => s.lines);
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = state && TAX_STATES.has(state.toUpperCase()) ? +(subtotal * TAX_RATE).toFixed(2) : 0;
  const total = +(subtotal + shipping + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), shipping, tax, total };
}

/** Hydration-safe flag so server and first client render match. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
