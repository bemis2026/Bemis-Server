"use client";

import { createContext, useCallback, useContext, useState, useEffect, useMemo, ReactNode } from "react";

export type Currency = "TRY" | "EUR";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** EUR per 1 TRY (e.g. 0.0271). Multiply a TRY amount by this to get EUR. */
  eurPerTry: number;
  /** ISO date string from TCMB feed, for display. */
  rateDate: string | null;
};

const DEFAULT_RATE = 0.027; // fallback used until /api/rate responds

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TRY",
  setCurrency: () => {},
  eurPerTry: DEFAULT_RATE,
  rateDate: null,
});

export function useCurrency() { return useContext(CurrencyContext); }

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("TRY");
  const [eurPerTry, setEurPerTry] = useState<number>(DEFAULT_RATE);
  const [rateDate, setRateDate] = useState<string | null>(null);

  // Restore preference from localStorage.
  useEffect(() => {
    const stored = localStorage.getItem("currency") as Currency | null;
    if (stored === "TRY" || stored === "EUR") setCurrencyState(stored);
  }, []);

  // Pull the live TCMB rate via our cached API route. The route revalidates
  // daily, so this fetch is cheap and avoids a per-tab call to TCMB.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/rate")
      .then(r => r.json())
      .then((data: { eurPerTry?: number; date?: string }) => {
        if (cancelled) return;
        if (typeof data.eurPerTry === "number" && data.eurPerTry > 0) {
          setEurPerTry(data.eurPerTry);
        }
        if (data.date) setRateDate(data.date);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, eurPerTry, rateDate }),
    [currency, setCurrency, eurPerTry, rateDate],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
