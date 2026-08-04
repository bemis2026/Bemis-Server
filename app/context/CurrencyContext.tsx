"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { useLanguage } from "./LanguageContext";

export type Currency = "TRY" | "EUR";

type CurrencyContextType = {
  /** Derived from active language: TR → TRY, EN → EUR. No user toggle. */
  currency: Currency;
  /**
   * TRY per 1 EUR (ör. 54,69). EUR tutarı bununla çarpılır.
   * ⚠️ `null` = kur ÇEKİLEMEDİ → ₺ fiyat GÖSTERİLMEZ (uydurma kura düşülmez).
   */
  tryPerEur: number | null;
  /** ISO date string from TCMB feed, for display. */
  rateDate: string | null;
};

// ⚠️ SABİT YEDEK KUR YOK (2026-08-04): kur gelene kadar da, hiç gelmezse de `null`.
// Gerekçe ve tarihçe: app/api/rate/route.ts

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TRY",
  tryPerEur: null,
  rateDate: null,
});

export function useCurrency() { return useContext(CurrencyContext); }

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const currency: Currency = lang === "en" ? "EUR" : "TRY";

  const [tryPerEur, setTryPerEur] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState<string | null>(null);

  // Pull live TCMB rate via our daily-cached API route. The route does
  // a server-side fetch and revalidates every 6h, so this is cheap.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/rate")
      .then(r => r.json())
      .then((data: { tryPerEur?: number; date?: string }) => {
        if (cancelled) return;
        if (typeof data.tryPerEur === "number" && data.tryPerEur > 0) {
          setTryPerEur(data.tryPerEur);
        }
        if (data.date) setRateDate(data.date);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(
    () => ({ currency, tryPerEur, rateDate }),
    [currency, tryPerEur, rateDate],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
