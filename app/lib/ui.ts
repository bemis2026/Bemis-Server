// Arayüz (chrome) metinleri için çeviri yardımcısı — menü, buton, başlık gibi
// KOD içindeki sabit dizeler. Bileşenler eskiden `lang === "en" ? EN : TR` yazıyordu;
// bu yalnız tr/en verir, de/es/ar/ru'da TR'ye düşerdi. pickText bunu 6 dile açar:
//   pickText(lang, tr, en)  →  tr: TR · en: EN · de/es/ar/ru: ui.json'daki çeviri (yoksa EN)
//
// Sözlük `data/i18n/ui.json` biçimi:  { "<İngilizce dize>": { "de": "...", "es": "...", "ar": "...", "ru": "..." } }
// (İngilizce dize anahtardır → ayrı anahtar uydurmaya gerek yok; aynı EN metin aynı çeviriyi paylaşır.)
// EN çevirisi olmayan dize otomatik İngilizce'ye düşer (yarım değil, uluslararası yedek).

// ⚠️⚠️ ui.json (67 KB) artık STATİK import DEĞİL — TEMBEL YÜKLENİR (2026-07-29).
// Sebep: pickText/byLang bu sözlüğe YALNIZ de/es/ar/ru için bakar; tr ve en satır-içi
// argümanlardan döner. Yani ziyaretçilerin neredeyse tamamı hiç okumayacağı 67 KB'ı
// indirip ayrıştırıyordu — üstelik 18 bileşende kullanıldığı için paketleyici dosyayı
// DÖRT AYRI route paketine kopyalamıştı (toplam ~158 KB).
//
// ⚠️ SSR GÜVENLİĞİ (bu deseni bozacak değişiklik yapma): sunucu ve İLK client render'ı
// DAİMA tr (ya da /export-/en yollarında en) ile çalışır — LanguageProvider dili
// localStorage'dan ancak mount sonrası effect'te okur. Dolayısıyla sözlük SSR'da hiç
// gerekmez ve ilk render sunucuyla birebir aynı kalır → hidrasyon uyuşmazlığı OLMAZ.
// Sözlük indikten sonra LanguageProvider bir tick artırır ve tüketiciler yeniden
// render olur (blog.json'daki desenin aynısı). Yüklenene dek yabancı dilde İngilizce
// görünür — yarım/kırık değil, kabul edilebilir uluslararası yedek.
let UI: Record<string, Record<string, string>> = {};
let uiPromise: Promise<void> | null = null;

/** ui.json'u bir kez dinamik yükler. tr/en'de HİÇ yüklenmez (gerekmiyor). */
export function loadUiI18n(lang: string): Promise<void> {
  if (lang === "tr" || lang === "en") return Promise.resolve();
  if (uiPromise) return uiPromise;
  uiPromise = import("../../data/i18n/ui.json")
    .then((m) => { UI = ((m as { default?: unknown }).default ?? m) as Record<string, Record<string, string>>; })
    .catch(() => { uiPromise = null; }); // hata olursa tekrar denenebilir; İngilizce gösterilir
  return uiPromise;
}

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
