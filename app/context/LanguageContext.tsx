"use client";

import { createContext, useCallback, useContext, useState, useEffect, useMemo, ReactNode } from "react";

export type Lang = "tr" | "en";

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
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "en" || stored === "tr") setLangState(stored);
  }, []);

  // <html lang> her zaman 'tr' kalıyordu (layout.tsx'te sabit). EN'e
  // geçince kök lang attribute'unu da güncelle — ekran okuyucu doğru dili
  // seslendirsin ve arama motoruna doğru dil sinyali gitsin. (Görsel etki yok.)
  useEffect(() => {
    document.documentElement.lang = lang;
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
