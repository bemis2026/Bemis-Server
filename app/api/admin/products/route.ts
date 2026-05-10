import { NextRequest, NextResponse, after } from "next/server";
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

    // Stage 1 — write TR shards immediately so the admin save returns
    // fast. Keep the previous EN in place for the brief window before
    // stage 2 lands. Net effect: admin sees instant save, EN catches
    // up a few seconds later.
    const trMain = trArr.filter((c) => !extraIds.has(c.id));
    const trEx   = trArr.filter((c) =>  extraIds.has(c.id));
    const prevEnArr = (prevEn ?? []) as unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevEnMain = prevEnArr.filter((c: any) => !extraIds.has(c.id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevEnEx   = prevEnArr.filter((c: any) =>  extraIds.has(c.id));
    await Promise.all([
      writeBin("products",        { products: trMain }),
      writeBin("productsExtra",   { products: trEx }),
      writeBin("productsEn",      { en: prevEnMain }),
      writeBin("productsEnExtra", { en: prevEnEx }),
    ]);
    try { revalidatePath("/api/products"); revalidatePath("/"); revalidatePath("/products"); } catch {}

    // Stage 2 — re-translate and overwrite EN shards in the background
    // once the response is on its way back to the admin client.
    after(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enArr = await translateProducts(trArr, prevTr as any[], prevEn as any[] | null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enMain = enArr.filter((c: any) => !extraIds.has(c.id));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enEx   = enArr.filter((c: any) =>  extraIds.has(c.id));
        await Promise.all([
          writeBin("productsEn",      { en: enMain }),
          writeBin("productsEnExtra", { en: enEx }),
        ]);
        try { revalidatePath("/api/products"); } catch {}
      } catch (e) {
        console.error("[products] background translation failed, keeping previous EN:", e);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("products save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
