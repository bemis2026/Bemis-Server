// Free TR→(en/de/es/ar/ru) translation via MyMemory (no API key required).
// Falls back to the original string on any error so callers always get a result.
// Kullanım (akıllı hibrit): yalnız DEĞİŞEN alanlar bu motorla çevrilir; değişmeyen
// alanlar önceki premium çeviriyi (data/<bin>-<lang>.json) korur (bkz. contentTranslate).

export type TransLang = "tr" | "en" | "de" | "es" | "ar" | "ru";

const ENDPOINT = "https://api.mymemory.translated.net/get";
// Bumped 4 → 8 — MyMemory's anonymous tier handles parallel calls fine
// up to ~10/s, and the email-tagged tier (we set `de=info@bemis.com.tr`
// on every request) lifts that further. Cuts a typical category-FAQ
// save from ~6s to ~3s on the worst case.
const CONCURRENCY = 8;
const TIMEOUT_MS = 10_000;

async function translateOne(text: string, from: string, to: string): Promise<string> {
  if (!text || !text.trim()) return text;
  // Don't translate URLs, paths, hex colors, very short tokens.
  const t = text.trim();
  if (/^(https?:\/\/|\/|#[0-9a-f]{3,8}|[\d.,+\-/]+)$/i.test(t)) return text;

  try {
    const url = `${ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${from}|${to}&de=info@bemis.com.tr`;
    const r = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!r.ok) return text;
    const d = (await r.json()) as { responseData?: { translatedText?: string } };
    const out = d.responseData?.translatedText ?? "";
    if (!out) return text;
    // MyMemory sometimes returns an upper-cased "MYMEMORY WARNING:" string on errors.
    if (/MYMEMORY WARNING/i.test(out)) return text;
    // Decode common HTML entities.
    return out
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  } catch {
    return text;
  }
}

export async function translateBatch(
  texts: string[],
  from: TransLang = "tr",
  to: TransLang = "en",
): Promise<string[]> {
  if (texts.length === 0) return [];
  const out: string[] = new Array(texts.length).fill("");
  let cursor = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, texts.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= texts.length) break;
      out[i] = await translateOne(texts[i], from, to);
    }
  });
  await Promise.all(workers);
  return out;
}
