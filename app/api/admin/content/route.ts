import { NextRequest, NextResponse, after } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { translateContent } from "../../../../lib/contentTranslate";
import type { TransLang } from "../../../../lib/translate";
import { verifyAdminSession } from "@/lib/adminAuth";

// Akıllı hibrit için hedef diller. TR kaydında DEĞİŞEN alanlar MyMemory ile
// çevrilir; değişmeyenler her dilin premium temelinden (bin _translations[lang]
// yoksa data/content-<lang>.json) KORUNUR → bedava + otomatik + premium kalite.
const HYBRID_LANGS: TransLang[] = ["en", "de", "es", "ar", "ru", "nl"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadOverlayFile(lang: string): any | null {
  try { return JSON.parse(readFileSync(path.join(process.cwd(), "data", `content-${lang}.json`), "utf-8")); }
  catch { return null; }
}

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
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
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tr: any = null;
  try { tr = await readBin("content", { fresh: true }); } catch {}
  if (!tr) {
    try { tr = JSON.parse(readFileSync(path.join(process.cwd(), "data", "content.json"), "utf-8")); } catch {}
  }
  if (!tr) return NextResponse.json({});

  if (lang === "en") {
    const fromBin = tr?._translations?.en;
    if (fromBin) return NextResponse.json(fromBin);
    try {
      const fb = JSON.parse(readFileSync(path.join(process.cwd(), "data", "content-en.json"), "utf-8"));
      return NextResponse.json(fb);
    } catch {
      return NextResponse.json(stripTranslations(tr));
    }
  }

  return NextResponse.json(stripTranslations(tr));
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  try {
    const body = await req.json();

    if (lang === "en") {
      // Direct EN edit — store under TR bin's _translations.en, leaving TR untouched.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let curTr: any = {};
      try { curTr = await readBin("content", { fresh: true }) ?? {}; } catch {}
      const next = { ...curTr, _translations: { ...(curTr._translations ?? {}), en: stripTranslations(body) } };
      await writeBin("content", next);
      try { revalidatePath("/api/content"); revalidatePath("/"); } catch {}
      return NextResponse.json({ ok: true });
    }

    // TR save — write the new TR immediately so admin sees a fast
    // success, then translate to EN in `after()` once the response is
    // already on its way back. The end state is identical (TR + EN
    // both in the bin), but the operator doesn't sit waiting on
    // MyMemory while the spinner spins.
    const trBody = stripTranslations(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevBin: any = {};
    try { prevBin = (await readBin("content", { fresh: true })) ?? {}; } catch {}
    const prevTr = stripTranslations(prevBin);
    const prevEn = prevBin?._translations?.en ?? null;

    // Stage 1 — fast TR write keeping the previous EN. If translate
    // fails later, this is the worst case (TR fresh, EN slightly stale).
    const intermediate = { ...trBody, _translations: { ...(prevBin._translations ?? {}), en: prevEn ?? trBody } };
    await writeBin("content", intermediate);
    try { revalidatePath("/api/content"); revalidatePath("/"); } catch {}

    // Stage 2 — arka planda 5 dile (en/de/es/ar/ru) yeniden çevir. Her dil için
    // temel = mevcut bin çevirisi ?? premium overlay dosyası; sadece TR'si değişen
    // alanlar MyMemory'ye gider, gerisi premium korunur.
    after(async () => {
      const nextTranslations: Record<string, unknown> = { ...(prevBin._translations ?? {}) };
      for (const lng of HYBRID_LANGS) {
        try {
          const baseline = prevBin?._translations?.[lng] ?? loadOverlayFile(lng);
          const translated = await translateContent(trBody, prevTr, baseline, lng);
          nextTranslations[lng] = translated ?? baseline ?? trBody;
        } catch (e) {
          console.error(`[content] ${lng} arka-plan çeviri başarısız, önceki korunuyor:`, e);
        }
      }
      try {
        const final = { ...trBody, _translations: nextTranslations };
        await writeBin("content", final);
        revalidatePath("/api/content"); revalidatePath("/");
      } catch (e) {
        console.error("[content] final write failed:", e);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("content save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
