// Arayüz (chrome) metinleri için çeviri yardımcısı — menü, buton, başlık gibi
// KOD içindeki sabit dizeler. Bileşenler eskiden `lang === "en" ? EN : TR` yazıyordu;
// bu yalnız tr/en verir, de/es/ar/ru'da TR'ye düşerdi. pickText bunu 6 dile açar:
//   pickText(lang, tr, en)  →  tr: TR · en: EN · de/es/ar/ru: ui.json'daki çeviri (yoksa EN)
//
// Sözlük `data/i18n/ui.json` biçimi:  { "<İngilizce dize>": { "de": "...", "es": "...", "ar": "...", "ru": "..." } }
// (İngilizce dize anahtardır → ayrı anahtar uydurmaya gerek yok; aynı EN metin aynı çeviriyi paylaşır.)
// EN çevirisi olmayan dize otomatik İngilizce'ye düşer (yarım değil, uluslararası yedek).

import uiData from "../../data/i18n/ui.json";

const UI = uiData as Record<string, Record<string, string>>;

export function pickText(lang: string, tr: string, en: string): string {
  if (lang === "tr") return tr;
  if (lang === "en") return en;
  return UI[en]?.[lang] ?? en;
}

// `{ tr, en }[lang]` biçimindeki nesne-indeksleme desenini 6 dile güvenli açar.
// Dilin anahtarı varsa onu döner; yoksa STRING değerlerde ui.json çevirisini
// dener (çeviriler tek yerde toplansın), en son İngilizce'ye (sonra TR'ye) düşer.
// Değer string olmak zorunda değil (Footer nav grubu dizisi gibi) → jenerik T.
export function byLang<T>(map: Record<string, T>, lang: string): T {
  const v = map[lang];
  if (v != null) return v;
  const en = map.en;
  if (typeof en === "string" && lang !== "tr" && lang !== "en") {
    const t = UI[en]?.[lang];
    if (typeof t === "string") return t as unknown as T;
  }
  return en ?? map.tr;
}
