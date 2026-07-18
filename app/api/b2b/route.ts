import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../lib/jsonbin";

type Rec = Record<string, unknown>;

function mergeDeep(target: Rec, source: Rec): Rec {
  const result: Rec = { ...target };
  for (const key in source) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
      result[key] = mergeDeep(tv as Rec, sv as Rec);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripTranslations(obj: any) {
  if (!obj || typeof obj !== "object") return obj;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _translations, ...rest } = obj;
  return rest;
}

const fallbackPath = path.join(process.cwd(), "data", "b2b.json");

// 6 saat — admin save revalidatePath ile anında temizler (backstop; daha az ISR write).
export const revalidate = 21600;

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  let localData: Rec = {};
  try { localData = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bin: any = null;
  try { bin = await readBin("b2b") as Rec; } catch {}

  // ⚠️ localData'nın _translations'ı da soyulmalı — eskiden bin-null dalında ham
  // _translations bloğu HER yanıta sızıyordu (payload şişkinliği; 2026-07-18).
  const localClean = stripTranslations(localData) as Rec;
  const tr = bin ? mergeDeep(localClean, stripTranslations(bin) as Rec) : localClean;

  if (lang === "tr") return NextResponse.json(tr);

  // Çeviri overlay'i (en/de/es/ar/ru): önce bin içi _translations, sonra
  // paketlenmiş data/b2b-<lang>.json; yoksa TR döner. Merge dil-bağımsız —
  // yapısal alanlar (href/id/görsel) TR'den, yalnız metin overlay'den gelir.
  const overlayLang = ["en", "de", "es", "ar", "ru"].includes(lang) ? lang : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enFromBin: any = overlayLang ? (bin?._translations?.[overlayLang] ?? null) : null;
  if (!enFromBin && overlayLang) {
    try { enFromBin = JSON.parse(readFileSync(path.join(process.cwd(), "data", `b2b-${overlayLang}.json`), "utf-8")); } catch {}
  }
  // Son çare: repo b2b.json'a GÖMÜLÜ _translations (EN'in tek kaynağı burası —
  // ayrı b2b-en.json hiç olmadı; R2'de b2b bin'i de yokken EN, TR olarak
  // sızıyordu: kullanıcı /b2b EN'de Türkçe hero gördü, 2026-07-18).
  if (!enFromBin && overlayLang) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enFromBin = (localData as any)?._translations?.[overlayLang] ?? null;
  }
  if (!enFromBin) return NextResponse.json(tr);

  // Per-section merge so untranslatable structural fields (hrefs, image refs,
  // featuredProducts ids) come from TR while EN fills in user-facing strings.
  const merged: Rec = {
    ...tr,
    hero: {
      ...(tr.hero as Rec ?? {}),
      ...(enFromBin.hero ?? {}),
      sectorTags: enFromBin.hero?.sectorTags ?? (tr.hero as Rec)?.sectorTags,
    },
    cta: (() => {
      const trCta = (tr.cta as Rec) ?? {};
      const enCta = (enFromBin.cta as Rec) ?? {};
      const trChannels = Array.isArray(trCta.channels) ? (trCta.channels as Rec[]) : [];
      const enChannels = Array.isArray(enCta.channels) ? (enCta.channels as Rec[]) : [];
      const channels = trChannels.map((c, i) => ({ ...c, ...(enChannels[i] ?? {}), href: c.href }));
      return { ...trCta, ...enCta, channels };
    })(),
    bayilik: (() => {
      const trB = (tr.bayilik as Rec) ?? {};
      const enB = (enFromBin.bayilik as Rec) ?? {};
      const trBenefits = Array.isArray(trB.benefits) ? (trB.benefits as Rec[]) : [];
      const enBenefits = Array.isArray(enB.benefits) ? (enB.benefits as Rec[]) : [];
      const benefits = trBenefits.map((b, i) => ({ ...b, ...(enBenefits[i] ?? {}) }));
      const trInfo = Array.isArray(trB.infoTable) ? (trB.infoTable as Rec[]) : [];
      const enInfo = Array.isArray(enB.infoTable) ? (enB.infoTable as Rec[]) : [];
      const infoTable = trInfo.map((b, i) => ({ ...b, ...(enInfo[i] ?? {}) }));
      return { ...trB, ...enB, benefits, infoTable };
    })(),
    operator: (() => {
      const trO = (tr.operator as Rec) ?? {};
      const enO = (enFromBin.operator as Rec) ?? {};
      const trCap = Array.isArray(trO.capabilities) ? (trO.capabilities as Rec[]) : [];
      const enCap = Array.isArray(enO.capabilities) ? (enO.capabilities as Rec[]) : [];
      const capabilities = trCap.map((c, i) => ({ ...c, ...(enCap[i] ?? {}) }));
      return { ...trO, ...enO, capabilities };
    })(),
  };

  return NextResponse.json(merged);
}
