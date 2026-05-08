import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { translateContent } from "../../../../lib/contentTranslate";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
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

    // TR save — translate to EN, embed under _translations.en.
    const trBody = stripTranslations(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevBin: any = {};
    try { prevBin = (await readBin("content", { fresh: true })) ?? {}; } catch {}
    const prevTr = stripTranslations(prevBin);
    const prevEn = prevBin?._translations?.en ?? null;

    let enBody = prevEn;
    try {
      enBody = await translateContent(trBody, prevTr, prevEn);
    } catch (e) {
      console.error("[content] translation failed, keeping previous EN:", e);
    }

    const next = { ...trBody, _translations: { ...(prevBin._translations ?? {}), en: enBody ?? trBody } };
    await writeBin("content", next);
    try { revalidatePath("/api/content"); revalidatePath("/"); } catch {}
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("content save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
