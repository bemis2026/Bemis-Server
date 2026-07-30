// Arayüz (chrome) metinleri için çeviri yardımcısı — menü, buton, başlık gibi
// KOD içindeki sabit dizeler. Bileşenler eskiden `lang === "en" ? EN : TR` yazıyordu;
// bu yalnız tr/en verir, de/es/ar/ru'da TR'ye düşerdi. pickText bunu 6 dile açar:
//   pickText(lang, tr, en)  →  tr: TR · en: EN · de/es/ar/ru: ui.json'daki çeviri (yoksa EN)
//
// Sözlük `data/i18n/ui.json` biçimi:  { "<İngilizce dize>": { "de": "...", "es": "...", "ar": "...", "ru": "..." } }
// (İngilizce dize anahtardır → ayrı anahtar uydurmaya gerek yok; aynı EN metin aynı çeviriyi paylaşır.)
// EN çevirisi olmayan dize otomatik İngilizce'ye düşer (yarım değil, uluslararası yedek).

// ⚠️⚠️ TEMBEL YÜKLEME DENENDİ VE GERİ ALINDI (2026-07-29 → 2026-07-31).
// Amaç 67 KB kazanmaktı (pickText/byLang bu sözlüğe YALNIZ de/es/ar/ru için bakar;
// tr/en satır-içi argümandan döner → ziyaretçilerin çoğu boşuna indiriyordu).
// Kurulum: modül seviyesinde `let UI = {}` + dinamik import + LanguageProvider'da
// yükleyip tick ile yeniden render.
//
// 🔴 NEDEN GERİ ALINDI: canlıda de/es/ar/ru'da TÜM arayüz çevirileri İngilizce'ye
// düştü — Rusça sayfada "Find a Dealer", "Guides" gibi dizeler İngilizce kaldı.
// Ölçüldü: ui.json chunk'ı İNİYOR, ama `pickText`in okuduğu modül örneğindeki `UI`
// boş kalıyor (yükleyen LanguageProvider ile okuyan 18 bileşen farklı modül
// grafiklerinde). Zorlanan yeniden render bile düzeltmedi → sorun render değil,
// paylaşılmayan modül durumu.
//
// 📌 TEKRAR DENENECEKSE: modül seviyesinde mutable değişken KULLANMA. Doğru tasarım
// sözlüğü React state'ine koymak (LanguageContext içinde tutup context ile dağıtmak)
// ve pickText'i o sözlüğü argüman alan bir hook'a çevirmek. 18 çağrı noktası
// güncellenmeli — ayrı ve dikkatli bir iş.
// (Aynı desen glossary.json'da ÇALIŞIYOR çünkü orada yükleyen ve okuyan AYNI bileşen.)
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
