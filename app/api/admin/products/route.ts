import { NextRequest, NextResponse, after } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { translateProducts } from "../../../../lib/productsTranslate";
import { applyProductSeo } from "../../../lib/productSeo";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

const fallbackPath = path.join(process.cwd(), "data", "products.json");

// Akıllı hibrit: de/es/ar/ru çevirileri products bin'inin _translations'ında
// tutulur (EN kendi shard bin'lerinde kalır). Değişen alan MyMemory'ye, değişmeyen
// premium temele (bin _translations[lang] ?? data/products-<lang>.json) kalır.
const HYBRID_LANGS = ["de", "es", "ar", "ru"] as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadOverlayFile(lang: string): any[] | null {
  try {
    const f = JSON.parse(readFileSync(path.join(process.cwd(), "data", `products-${lang}.json`), "utf-8"));
    return Array.isArray(f) ? f : null;
  } catch { return null; }
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(applyProductSeo(tr as any[]));
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

    // Mevcut de/es/ar/ru çevirileri products bin'inin _translations'ında saklanır;
    // yeniden yazarken kaybolmasın diye önce oku (premium temel budur).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevMain: any = null;
    try { prevMain = await readBin("products", { fresh: true }); } catch {}
    const prevTranslations: Record<string, unknown> =
      (prevMain && typeof prevMain === "object" && prevMain._translations) ? prevMain._translations : {};

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
      writeBin("products",        { products: trMain, _translations: prevTranslations }),
      writeBin("productsExtra",   { products: trEx }),
      writeBin("productsEn",      { en: prevEnMain }),
      writeBin("productsEnExtra", { en: prevEnEx }),
    ]);
    try { revalidatePath("/api/products"); revalidatePath("/"); revalidatePath("/products"); } catch {}

    // Stage 2 — arka planda EN (kendi shard bin'leri) + de/es/ar/ru (products
    // bin _translations) yeniden çevir. Her dil için temel = mevcut çeviri ??
    // premium overlay dosyası; yalnız TR'si değişen alan MyMemory'ye gider.
    after(async () => {
      // EN — mevcut shard akışı korunur.
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enArr = await translateProducts(trArr, prevTr as any[], prevEn as any[] | null, "en");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enMain = enArr.filter((c: any) => !extraIds.has(c.id));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enEx   = enArr.filter((c: any) =>  extraIds.has(c.id));
        await Promise.all([
          writeBin("productsEn",      { en: enMain }),
          writeBin("productsEnExtra", { en: enEx }),
        ]);
      } catch (e) {
        console.error("[products] EN arka-plan çeviri başarısız, önceki korunuyor:", e);
      }
      // de/es/ar/ru — products bin _translations'a tam çeviri dizisi (index hizalı).
      const nextTranslations: Record<string, unknown> = { ...prevTranslations };
      for (const lng of HYBRID_LANGS) {
        try {
          const base = Array.isArray(prevTranslations[lng]) ? (prevTranslations[lng] as unknown[]) : loadOverlayFile(lng);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const arr = await translateProducts(trArr, prevTr as any[], (base as any[]) ?? null, lng);
          nextTranslations[lng] = arr;
        } catch (e) {
          console.error(`[products] ${lng} arka-plan çeviri başarısız, önceki korunuyor:`, e);
        }
      }
      try {
        await writeBin("products", { products: trMain, _translations: nextTranslations });
        revalidatePath("/api/products");
      } catch (e) {
        console.error("[products] _translations final write failed:", e);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("products save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
