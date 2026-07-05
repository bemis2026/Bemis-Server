"use client";

import { createContext, useCallback, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { type LangCode, isLangCode, isRTL } from "../lib/languages";

// Lang = 6 dil (tr/en/de/es/ar/ru). Mevcut `lang === "en"`/`"tr"` karşılaştırmaları
// aynen geçerli; nesne-indeksleme (`{tr,en}[lang]`) siteleri byLang() kullanır.
export type Lang = LangCode;

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "tr",
  setLang: () => {},
});

export function useLanguage() { return useContext(LanguageContext); }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (isLangCode(stored)) setLangState(stored);
  }, []);

  // Dil değişince kök <html> lang + dir güncellenir (ekran okuyucu + SEO sinyali;
  // Arapça için dir=rtl → sağdan-sola yerleşim).
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
