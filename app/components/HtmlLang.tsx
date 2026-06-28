"use client";

import { useEffect } from "react";

// Belirli bir sayfada <html lang> değerini geçersiz kılar. Kök layout global
// olarak lang="tr" verir; İngilizce /export sayfası bunu istemci tarafında "en"
// yapar (Google JS render eder → lang=en görür; sayfadan ayrılınca eski değere
// döner). Tam SSR lang override'ı route-group ROOT layout'ları gerektirir (her
// rotayı taşımak = riskli); bu hafif çözüm a11y + tarayıcı + JS-render crawler içindir.
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
