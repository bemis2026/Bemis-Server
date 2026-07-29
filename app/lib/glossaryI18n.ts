// Sözlük terimlerinin ÇEVİRİLERİ — kaynak (TR) glossary.ts'te kalır; çeviriler
// dile göre `data/i18n/glossary.json` dosyasında tutulur (kaynak kod şişmesin +
// AI-pipeline bu dosyayı üretir/günceller: `npm run translate`).
//
// GlossaryClient aktif dile göre bu çeviriyi TR terimin üstüne bindirir;
// ÇEVİRİSİ OLMAYAN terim/alan otomatik TR'ye düşer (yarım çeviri kırık görünmez).
//
// Yapı: GLOSSARY_I18N[dil][slug] = { term, abbr, short, definition, faq }
// (slug/diagram/related/keywords TR kaynaktan gelir — çevrilmez.)
// Yeni dil eklemek = `npm run translate` (data/i18n/glossary.json'a yazar); burada iş yok.

// ⚠️ glossary.json (253 KB — 15 terimin 5 dildeki çevirisi) artık STATİK import DEĞİL:
// TR okuyucu (çoğunluk) bu dosyayı hiç indirmesin diye YALNIZ yabancı dil seçilince
// tembel yüklenir. Yüklenene dek terim TR görünür (güvenli yedek). blog.json ve
// ui.json ile aynı desen. SSR daima TR olduğu için hidrasyon uyuşmazlığı olmaz.

export type GlossaryTranslation = {
  term?: string;
  abbr?: string;
  short?: string;
  definition?: string;
  faq?: { q: string; a: string }[];
};

// Dil kodu → { slug → çeviri }. Tembel dolar; yüklenene dek boş = TR'ye düşülür.
export let GLOSSARY_I18N: Record<string, Record<string, GlossaryTranslation>> = {};

let loadPromise: Promise<void> | null = null;

/** glossary.json'u bir kez dinamik yükler. TR'de HİÇ yüklenmez (gerekmiyor). */
export function loadGlossaryI18n(lang: string): Promise<void> {
  if (lang === "tr") return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = import("../../data/i18n/glossary.json")
    .then((m) => {
      GLOSSARY_I18N = ((m as { default?: unknown }).default ?? m) as Record<string, Record<string, GlossaryTranslation>>;
    })
    .catch(() => { loadPromise = null; }); // hata olursa tekrar denenebilir; TR gösterilir
  return loadPromise;
}
