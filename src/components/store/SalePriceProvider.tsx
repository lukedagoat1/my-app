"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SalePrices = Record<string, number>;
export type StockQtys = Record<string, number | undefined>;

interface StoreData { prices: SalePrices; stock: StockQtys }

const PriceCtx = createContext<SalePrices>({});
const StockCtx = createContext<StockQtys>({});

export function useSalePrices() { return useContext(PriceCtx); }
export function useStock()      { return useContext(StockCtx); }

export default function SalePriceProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<SalePrices>({});
  const [stock, setStock]   = useState<StockQtys>({});

  useEffect(() => {
    fetch("/api/store-data")
      .then((r) => r.json())
      .then((d: StoreData) => { setPrices(d.prices ?? {}); setStock(d.stock ?? {}); })
      .catch(() => {});
  }, []);

  return (
    <PriceCtx.Provider value={prices}>
      <StockCtx.Provider value={stock}>
        {children}
      </StockCtx.Provider>
    </PriceCtx.Provider>
  );
}
