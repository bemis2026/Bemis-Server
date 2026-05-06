import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { translateProducts } from "../../../../lib/productsTranslate";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const fallbackPath = path.join(process.cwd(), "data", "products.json");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap(record: any): { tr: unknown[]; en: unknown[] | null } {
  if (Array.isArray(record)) return { tr: record, en: null };
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    const en = record._translations?.en;
    return { tr: record.products, en: Array.isArray(en) ? en : null };
  }
  return { tr: [], en: null };
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let record: any = null;
  try { record = await readBin("products", { fresh: true }); } catch {}
  if (!record) {
    try { record = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch { record = []; }
  }
  const { tr } = unwrap(record);
  return NextResponse.json(tr);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    const trArr = Array.isArray(body) ? body : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevRecord: any = null;
    try { prevRecord = await readBin("products", { fresh: true }); } catch {}
    const { tr: prevTr, en: prevEn } = unwrap(prevRecord ?? []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enArr = await translateProducts(trArr, prevTr as any[], prevEn as any[] | null);

    await writeBin("products", { products: trArr, _translations: { en: enArr } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("products save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
