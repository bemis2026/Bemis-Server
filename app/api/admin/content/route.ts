import { NextRequest, NextResponse, after } from "next/server";
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

    // Stage 2 — re-translate and write EN in the background.
    after(async () => {
      try {
        const enBody = await translateContent(trBody, prevTr, prevEn);
        const final = { ...trBody, _translations: { ...(prevBin._translations ?? {}), en: enBody ?? trBody } };
        await writeBin("content", final);
        try { revalidatePath("/api/content"); revalidatePath("/"); } catch {}
      } catch (e) {
        console.error("[content] background translation failed, keeping previous EN:", e);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("content save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
