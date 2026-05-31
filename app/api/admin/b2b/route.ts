import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { translateContent } from "../../../../lib/contentTranslate";
import { B2B_TRANSLATABLE_PATHS } from "../../../../lib/b2bTranslate";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

const fallbackPath = path.join(process.cwd(), "data", "b2b.json");

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

    // Save TR + auto-translate to EN, mirroring the content bin pattern.
    const trBody = stripTranslations(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevBin: any = {};
    try { prevBin = (await readBin("b2b", { fresh: true })) ?? {}; } catch {}
    const prevTr = stripTranslations(prevBin);
    const prevEn = prevBin?._translations?.en ?? null;

    let enBody = prevEn;
    try {
      enBody = await translateContent(trBody, prevTr, prevEn, B2B_TRANSLATABLE_PATHS);
    } catch (e) {
      console.error("[b2b] translation failed, keeping previous EN:", e);
    }

    const next = { ...trBody, _translations: { ...(prevBin._translations ?? {}), en: enBody ?? trBody } };
    await writeBin("b2b", next);
    try { revalidatePath("/api/b2b"); revalidatePath("/"); revalidatePath("/b2b"); revalidatePath("/bayilik"); revalidatePath("/operator"); } catch {}
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("b2b save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
