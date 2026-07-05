import { NextRequest, NextResponse, after } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { translateContent } from "../../../../lib/contentTranslate";
import type { TransLang } from "../../../../lib/translate";
import { B2B_TRANSLATABLE_PATHS } from "../../../../lib/b2bTranslate";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

const fallbackPath = path.join(process.cwd(), "data", "b2b.json");

// Akıllı hibrit hedef dilleri (bkz. content). Değişen alan MyMemory'ye,
// değişmeyen premium temele (bin _translations[lang] ?? data/b2b-<lang>.json) kalır.
const HYBRID_LANGS: TransLang[] = ["en", "de", "es", "ar", "ru"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadOverlayFile(lang: string): any | null {
  try { return JSON.parse(readFileSync(path.join(process.cwd(), "data", `b2b-${lang}.json`), "utf-8")); }
  catch { return null; }
}

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

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  let localData: Rec = {};
  try { localData = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}

  try {
    const binData = await readBin("b2b", { fresh: true }) as Rec;
    return NextResponse.json(mergeDeep(localData, binData));
  } catch {}

  return NextResponse.json(localData);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();

    // Save TR + auto-translate to 5 langs (akıllı hibrit), mirroring content.
    const trBody = stripTranslations(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevBin: any = {};
    try { prevBin = (await readBin("b2b", { fresh: true })) ?? {}; } catch {}
    const prevTr = stripTranslations(prevBin);

    // Stage 1 — hızlı TR yaz, mevcut çevirileri koru (kısa pencere premium kalır).
    const intermediate = { ...trBody, _translations: { ...(prevBin._translations ?? {}) } };
    await writeBin("b2b", intermediate);
    const revalidate = () => { try { revalidatePath("/api/b2b"); revalidatePath("/"); revalidatePath("/b2b"); revalidatePath("/bayilik"); revalidatePath("/operator"); } catch {} };
    revalidate();

    // Stage 2 — arka planda 5 dile çevir (yalnız değişen alan; gerisi premium temelden).
    after(async () => {
      const nextTranslations: Record<string, unknown> = { ...(prevBin._translations ?? {}) };
      for (const lng of HYBRID_LANGS) {
        try {
          const baseline = prevBin?._translations?.[lng] ?? loadOverlayFile(lng);
          const translated = await translateContent(trBody, prevTr, baseline, lng, B2B_TRANSLATABLE_PATHS);
          nextTranslations[lng] = translated ?? baseline ?? trBody;
        } catch (e) {
          console.error(`[b2b] ${lng} arka-plan çeviri başarısız, önceki korunuyor:`, e);
        }
      }
      try {
        await writeBin("b2b", { ...trBody, _translations: nextTranslations });
        revalidate();
      } catch (e) {
        console.error("[b2b] final write failed:", e);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("b2b save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
