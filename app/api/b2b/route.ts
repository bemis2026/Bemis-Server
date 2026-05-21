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

// 1 saat — admin save sonrası revalidatePath manuel temizliyor.
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  let localData: Rec = {};
  try { localData = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bin: any = null;
  try { bin = await readBin("b2b") as Rec; } catch {}

  const tr = bin ? mergeDeep(localData, stripTranslations(bin) as Rec) : localData;

  if (lang !== "en") return NextResponse.json(tr);

  // EN: prefer in-bin translation, then fall back to TR.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enFromBin: any = bin?._translations?.en ?? null;
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
