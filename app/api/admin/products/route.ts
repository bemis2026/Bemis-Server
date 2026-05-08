import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
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

// Read both TR shards. Returns the merged TR array plus the set of
// category IDs that live in the overflow bin so we can split back on
// write.
async function readShardedTr(): Promise<{ tr: unknown[]; extraIds: Set<string> }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main  = await readBin("products",      { fresh: true }); } catch {}
  try { extra = await readBin("productsExtra", { fresh: true }); } catch {}
  if (!main) {
    try { main = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch { main = []; }
  }
  const mainArr  = unwrapTr(main);
  const extraArr = unwrapTr(extra);
  return {
    tr: [...mainArr, ...extraArr],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extraIds: new Set(extraArr.map((c: any) => c.id)),
  };
}

async function readShardedEn(): Promise<unknown[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main  = await readBin("productsEn",       { fresh: true }); } catch {}
  try { extra = await readBin("productsEnExtra",  { fresh: true }); } catch {}
  const m = unwrapEn(main);
  const e = unwrapEn(extra);
  if (!m && !e) return null;
  return [...(m ?? []), ...(e ?? [])];
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { tr } = await readShardedTr();
  return NextResponse.json(tr);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trArr: any[] = Array.isArray(body) ? body : [];

    // Read prior TR + EN (sharded) for diff-aware translation.
    const { tr: prevTr, extraIds } = await readShardedTr();
    const prevEn = await readShardedEn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enArr = await translateProducts(trArr, prevTr as any[], prevEn as any[] | null);

    // Split TR + EN back into the two shards. Categories that started
    // in the extra bin stay there; new categories default to the main
    // bin. The bin can be re-balanced later by editing the extraIds
    // mapping.
    const trMain = trArr.filter((c) => !extraIds.has(c.id));
    const trEx   = trArr.filter((c) =>  extraIds.has(c.id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enMain = enArr.filter((c: any) => !extraIds.has(c.id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enEx   = enArr.filter((c: any) =>  extraIds.has(c.id));

    await Promise.all([
      writeBin("products",        { products: trMain }),
      writeBin("productsExtra",   { products: trEx }),
      writeBin("productsEn",      { en: enMain }),
      writeBin("productsEnExtra", { en: enEx }),
    ]);
    try { revalidatePath("/api/products"); revalidatePath("/"); revalidatePath("/products"); } catch {}
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("products save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
