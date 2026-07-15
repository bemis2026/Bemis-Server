// Site dilleri — TEK KAYNAK. Hem uygulama (dil seçici, LanguageContext) hem de
// çeviri pipeline'ı (scripts/translate.ts) buradan okur. Framework-bağımsız:
// "use client" / "server-only" YOK → Node script'i de import edebilir.
//
// Yeni dil eklemek = LANGS'a bir kayıt. `dir:"rtl"` olan diller (Arapça) için
// LanguageContext kök <html dir> attribute'unu ayarlar.

export type LangCode = "tr" | "en" | "de" | "es" | "ar" | "ru";

export type LangMeta = {
  code: LangCode;
  /** Dilin KENDİ dilindeki adı (seçicide gösterilir). */
  native: string;
  /** İngilizce adı (loglar / erişilebilirlik). */
  english: string;
  /** Yazım yönü. */
  dir: "ltr" | "rtl";
  /** Seçicide bayrak (emoji). */
  flag: string;
};

// SIRA = seçicide gösterim sırası. TR kaynak dildir (çevrilmez).
export const LANGS: LangMeta[] = [
  { code: "tr", native: "Türkçe",   english: "Turkish", dir: "ltr", flag: "🇹🇷" },
  { code: "en", native: "English",  english: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "de", native: "Deutsch",  english: "German",  dir: "ltr", flag: "🇩🇪" },
  { code: "es", native: "Español",  english: "Spanish", dir: "ltr", flag: "🇪🇸" },
  { code: "ar", native: "العربية",  english: "Arabic",  dir: "rtl", flag: "🇸🇦" },
  { code: "ru", native: "Русский",  english: "Russian", dir: "ltr", flag: "🇷🇺" },
];

export const SOURCE_LANG: LangCode = "tr";

/** Kaynak (tr) dışındaki tüm hedef diller — pipeline bunları üretir. */
export const TARGET_LANGS: LangCode[] = LANGS
  .map((l) => l.code)
  .filter((c) => c !== SOURCE_LANG);

export const LANG_CODES: LangCode[] = LANGS.map((l) => l.code);

const BY_CODE: Record<string, LangMeta> = Object.fromEntries(LANGS.map((l) => [l.code, l]));

export function langMeta(code: string): LangMeta | undefined {
  return BY_CODE[code];
}

export function isLangCode(v: unknown): v is LangCode {
  return typeof v === "string" && v in BY_CODE;
}

export function isRTL(code: string): boolean {
  return BY_CODE[code]?.dir === "rtl";
}

/** LLM sistem-prompt'unda kullanılan tam dil adı (ör. "German (Deutsch)"). */
export function promptLangName(code: LangCode): string {
  const m = BY_CODE[code];
  return m ? `${m.english} (${m.native})` : code;
}

/**
 * İçeriği YALNIZ İngilizce yazılmış sayfalar. Buralarda menü/footer de İngilizce
 * gösterilir — aksi halde İngilizce gövdenin etrafında Türkçe menü çıkıyor
 * (yabancı alıcı için tutarsız; /export reklamlarının iniş sayfası).
 *
 * ⚠️ Bu bir GÖRÜNÜM zorlaması, tercih DEĞİL: LanguageContext bunu localStorage'a
 * YAZMAZ → sayfadan çıkan Türk ziyaretçi kendi dilinde devam eder. Ziyaretçi bu
 * sayfadayken seçiciden dil seçerse onun seçimi kazanır.
 */
export const ENGLISH_ONLY_PATHS: readonly string[] = ["/export"];

export function isEnglishOnlyPath(pathname: string | null | undefined): boolean {
  return !!pathname && ENGLISH_ONLY_PATHS.includes(pathname);
}
