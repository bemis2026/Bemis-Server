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
function unwrapTr(record: any): unknown[] {
  if (Array.isArray(record)) return record;
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    return record.products;
  }
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapEn(record: any): unknown[] | null {
  if (Array.isArray(record)) return record;
  if (record && typeof record === "object" && Array.isArray(record.en)) return record.en;
  return null;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let record: any = null;
  try { record = await readBin("products", { fresh: true }); } catch {}
  if (!record) {
    try { record = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch { record = []; }
  }
  return NextResponse.json(unwrapTr(record));
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    const trArr = Array.isArray(body) ? body : [];

    // Fetch the prior TR (for diff-aware translation) and the prior EN
    // (so untouched strings stay as-is and we don't re-translate them).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevTrRecord: any = null;
    try { prevTrRecord = await readBin("products", { fresh: true }); } catch {}
    const prevTr = unwrapTr(prevTrRecord ?? []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevEnRecord: any = null;
    try { prevEnRecord = await readBin("productsEn", { fresh: true }); } catch {}
    let prevEn = unwrapEn(prevEnRecord ?? []);
    // Legacy fallback: very old bins still embed _translations.en in the
    // products record. Honour that on first save after migration so we
    // don't lose the translation diff.
    if (!prevEn && prevTrRecord && typeof prevTrRecord === "object" && prevTrRecord._translations?.en) {
      prevEn = unwrapEn(prevTrRecord._translations.en);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enArr = await translateProducts(trArr, prevTr as any[], prevEn as any[] | null);

    // Write to the two bins. TR is wrapped as { products } so the public
    // GET keeps a stable shape; EN as { en } in its own bin.
    await Promise.all([
      writeBin("products", { products: trArr }),
      writeBin("productsEn", { en: enArr }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("products save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
