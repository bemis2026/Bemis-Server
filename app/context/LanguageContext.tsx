"use client";

import { createContext, useCallback, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type LangCode, isLangCode, isRTL, forcedLangForPath } from "../lib/languages";

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
  const pathname = usePathname();
  const [lang, setLangState] = useState<Lang>("tr");
  // Ziyaretçi İngilizce-only sayfadayken seçiciden dil seçerse zorlamayı ezer.
  // Rota değişince sıfırlanır → sayfaya her yeni gelişte yine İngilizce açılır.
  const [pickedHere, setPickedHere] = useState<Lang | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (isLangCode(stored)) setLangState(stored);
  }, []);

  useEffect(() => { setPickedHere(null); }, [pathname]);

  // /export gövdesi İngilizce yazılmış → menü/footer de İngilizce olsun (bkz.
  // ENGLISH_ONLY_PATHS). usePathname ilk yüklemede sunucuda da dolu gelir →
  // İngilizce kabuk SSR'da basılır, "önce Türkçe sonra İngilizce" sıçraması OLMAZ.
  // ⚠️ localStorage'a YAZILMAZ: bu yalnız o sayfanın görünümü; ziyaretçi ayrılınca
  // kendi dil tercihi aynen döner.
  // 2026-09-03: /en → en, /de → de, /es → es, /ru → ru (bkz. forcedLangForPath).
  const forced = forcedLangForPath(pathname);
  const effectiveLang: Lang = forced ? (pickedHere ?? forced) : lang;

  // Dil değişince kök <html> lang + dir güncellenir (ekran okuyucu + SEO sinyali;
  // Arapça için dir=rtl → sağdan-sola yerleşim).
  useEffect(() => {
    document.documentElement.lang = effectiveLang;
    document.documentElement.dir = isRTL(effectiveLang) ? "rtl" : "ltr";
  }, [effectiveLang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setPickedHere(l);
    localStorage.setItem("lang", l);
  }, []);

  const value = useMemo(() => ({ lang: effectiveLang, setLang }), [effectiveLang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
