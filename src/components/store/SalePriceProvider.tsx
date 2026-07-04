"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/products";

export type SalePrices = Record<string, number>;
export type StockQtys = Record<string, number | undefined>;

interface StoreData { prices: SalePrices; stock: StockQtys; custom?: Product[]; hidden?: string[] }

const PriceCtx = createContext<SalePrices>({});
const StockCtx = createContext<StockQtys>({});
const CustomCtx = createContext<Product[]>([]);
const HiddenCtx = createContext<string[]>([]);

export function useSalePrices()     { return useContext(PriceCtx); }
export function useStock()          { return useContext(StockCtx); }
export function useCustomProducts() { return useContext(CustomCtx); }
export function useHiddenIds()      { return useContext(HiddenCtx); }

export default function SalePriceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>({ prices: {}, stock: {} });

  useEffect(() => {
    fetch("/api/store-data")
      .then((r) => r.json())
      .then((d: StoreData) => setData(d))
      .catch(() => {});
  }, []);

  return (
    <PriceCtx.Provider value={data.prices ?? {}}>
      <StockCtx.Provider value={data.stock ?? {}}>
        <CustomCtx.Provider value={data.custom ?? []}>
          <HiddenCtx.Provider value={data.hidden ?? []}>
            {children}
          </HiddenCtx.Provider>
        </CustomCtx.Provider>
      </StockCtx.Provider>
    </PriceCtx.Provider>
  );
}
