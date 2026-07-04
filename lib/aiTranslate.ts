// AI çeviri motoru — Anthropic Claude (kaliteli, EV-terminolojisine hâkim çeviri).
// Hem CLI pipeline'ı (scripts/translate.ts) hem de ileride CMS admin-kayıt akışı
// buradan import eder. "server-only" YOK → Node script'i de kullanabilir.
//
// Kullanım:  const out = await translateRecords(records, "de");
//   records: { key, text }[]  →  out: { [key]: "çeviri" }
//
// Model: env TRANSLATE_MODEL (varsayılan claude-opus-4-8). Anahtar: ANTHROPIC_API_KEY.
// MyMemory (lib/translate.ts) makine-çevirisinin AI muadili; kalite çok daha yüksek.

import Anthropic from "@anthropic-ai/sdk";
import { promptLangName, type LangCode } from "../app/lib/languages";

export type TranslatableRecord = { key: string; text: string };

const MODEL = process.env.TRANSLATE_MODEL || "claude-opus-4-8";

// Her API çağrısında en fazla bu kadar kayıt (çıktı token'ını sınırlı tutar).
const BATCH_SIZE = 24;
// Kaç dil/batch aynı anda (Anthropic rate-limit dostu).
const CONCURRENCY = 3;

// ⚠️ ASLA çevrilmeyecek — birebir korunur (marka, standart, birim, model adları).
// Sistem-prompt'una gömülür; sayı+birimler zaten korunur (aşağıdaki kural).
const PROTECTED_TERMS = [
  "Bemis", "Bemis E-V Charge", "Bemis Teknik", "BYES",
  "Type 2", "CCS2", "CCS", "CHAdeMO", "Combo 2", "IEC 62196",
  "OCPP", "OCPP 1.6J", "OCPP 2.0.1", "CSMS", "EVSE", "DLM", "RFID",
  "V2L", "C2L", "V2G", "AC", "DC", "CP", "PP",
  "CE", "TSE", "TÜV", "RoHS", "IP44", "IP54", "IP65", "IP66",
  "BEVDC", "Charger 2", "Mini Mobile", "Mono", "Pro Mobile", "Wallbox",
  "kW", "kWh", "V", "A", "mm", "m²",
];

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (_client) return _client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY tanımlı değil. Çeviri motoru bir Anthropic API anahtarı gerektirir.\n" +
        "  Yerel:  PowerShell → $env:ANTHROPIC_API_KEY=\"sk-ant-...\"  (veya .env.local)\n" +
        "  Üretim: Vercel → Project → Settings → Environment Variables → ANTHROPIC_API_KEY",
    );
  }
  _client = new Anthropic(); // anahtarı ANTHROPIC_API_KEY env'inden okur
  return _client;
}

function systemPrompt(target: LangCode): string {
  return [
    `You are a professional native ${promptLangName(target)} translator specialising in the electric-vehicle (EV) charging industry.`,
    `You translate marketing and technical website copy for Bemis E-V Charge, a Turkish manufacturer of EV charging equipment.`,
    ``,
    `Translate the Turkish source text into fluent, natural, professional ${promptLangName(target)} — the way a native marketing copywriter in that language would write it, not a literal word-for-word rendering. Preserve the meaning, tone, and technical accuracy exactly.`,
    ``,
    `STRICT RULES:`,
    `- Keep these terms and names EXACTLY as written, untranslated: ${PROTECTED_TERMS.join(", ")}.`,
    `- Keep ALL numbers, units, ratios and measurements unchanged (e.g. "7,4 kW", "22 kW", "40–120 kW", "IEC 62196-2"). You MAY localise the decimal separator to the target language's convention only if it is standard there; otherwise leave numbers as-is.`,
    `- Do NOT add, remove, or invent any facts, specs, certifications, prices, or claims. Translate only what is given.`,
    `- Do NOT mention or introduce any competitor brand names.`,
    `- Preserve any HTML/markup, punctuation structure, and quotation marks.`,
    `- Product model names (Charger 2, BEVDC, Mini Mobile, etc.) stay in their original form.`,
    ``,
    `OUTPUT FORMAT: You receive a JSON object mapping string keys to Turkish source strings. Return ONLY a JSON object with the SAME keys, where each value is the ${promptLangName(target)} translation of the corresponding source string. No commentary, no markdown code fences — just the raw JSON object.`,
  ].join("\n");
}

// LLM yanıtından JSON objesini dayanıklı biçimde çıkar (kod-çiti / önek olsa bile).
function extractJsonObject(text: string): Record<string, string> {
  let t = text.trim();
  // ```json ... ``` çitini soy
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Yanıtta JSON objesi bulunamadı");
  }
  const parsed = JSON.parse(t.slice(start, end + 1));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Yanıt bir JSON objesi değil");
  }
  return parsed as Record<string, string>;
}

async function translateOneBatch(
  batch: TranslatableRecord[],
  target: LangCode,
): Promise<Record<string, string>> {
  const source: Record<string, string> = {};
  for (const r of batch) source[r.key] = r.text;

  const run = async (): Promise<Record<string, string>> => {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 16000,
      // Adaptif düşünme AÇIK: gerekçelendirme "thinking" bloğuna gider, metin
      // bloğu TEMİZ JSON kalır (parse güvenilirliği artar). Çeviri için maliyet ölçülü.
      thinking: { type: "adaptive" },
      system: systemPrompt(target),
      messages: [{ role: "user", content: JSON.stringify(source, null, 0) }],
    });
    const textBlock = msg.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) throw new Error("Yanıtta metin bloğu yok");
    return extractJsonObject(textBlock.text);
  };

  let out: Record<string, string>;
  try {
    out = await run();
  } catch {
    // Tek retry — geçici parse/ağ hatalarına karşı.
    out = await run();
  }

  // Eksik anahtar kalırsa kaynağı koru (yarım çeviri kırık görünmesin).
  const result: Record<string, string> = {};
  for (const r of batch) {
    const v = out[r.key];
    result[r.key] = typeof v === "string" && v.trim() ? v : r.text;
  }
  return result;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Bir dizi {key,text} kaydını hedef dile çevirir; { key → çeviri } döndürür.
 * Dahili olarak batch'ler ve sınırlı eşzamanlılıkla çağırır.
 */
export async function translateRecords(
  records: TranslatableRecord[],
  target: LangCode,
): Promise<Record<string, string>> {
  if (records.length === 0) return {};
  const batches = chunk(records, BATCH_SIZE);
  const merged: Record<string, string> = {};

  let cursor = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, batches.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= batches.length) break;
      const res = await translateOneBatch(batches[i], target);
      Object.assign(merged, res);
    }
  });
  await Promise.all(workers);
  return merged;
}
