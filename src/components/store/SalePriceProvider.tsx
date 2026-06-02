"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SalePrices = Record<string, number>;

const SalePriceContext = createContext<SalePrices>({});

export function useSalePrices() {
  return useContext(SalePriceContext);
}

export default function SalePriceProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<SalePrices>({});

  useEffect(() => {
    fetch("/api/sale-prices")
      .then((r) => r.json())
      .then((data: SalePrices) => setPrices(data))
      .catch(() => {});
  }, []);

  return (
    <SalePriceContext.Provider value={prices}>
      {children}
    </SalePriceContext.Provider>
  );
}
