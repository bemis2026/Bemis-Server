import { NextRequest, NextResponse } from "next/server";
import { readBin } from "../../../lib/jsonbin";
import { applyProductSeo } from "../../lib/productSeo";
import { readFileSync } from "fs";
import path from "path";

const fallbackPath = path.join(process.cwd(), "data", "products.json");
const fallbackEnPath = path.join(process.cwd(), "data", "products-en.json");

// 6 saat — admin save revalidatePath ile ANINDA temizler; bu yalnız backstop.
// Uzun backstop = çok daha az ISR write (Vercel free 200K/ay limiti dolmasın).
export const revalidate = 21600;

// Accept any of the three historical shapes:
//   - bare array (legacy, pre-translations)
//   - { products, _translations: { en } } (single-bin layout, replaced
//     when EN was split out to its own bin to stay under the free-tier
//     100KB/record limit)
//   - { products } (current — EN now lives in its own bin)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapTr(record: any): unknown[] {
  if (Array.isArray(record)) return record;
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    return record.products;
  }
  return [];
}

// EN bin is { en: [...] }; older single-bin EN payloads were just an array.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapEn(record: any): unknown[] | null {
  if (Array.isArray(record)) return record;
  if (record && typeof record === "object" && Array.isArray(record.en)) return record.en;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadJsonFile(p: string): any {
  try { return JSON.parse(readFileSync(p, "utf-8")); } catch { return null; }
}

// Per-index merge: TR provides structure (image, accent, ids, hrefs); EN
// overrides only the translatable fields. Anything missing in EN falls back
// to TR.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeCategories(trArr: any[], enArr: any[] | null): any[] {
  if (!enArr) return trArr;
  return trArr.map((trCat, i) => {
    const enCat = enArr[i];
    if (!enCat) return trCat;
    return {
      ...trCat,
      ...enCat,
      // Identity / brand fields always come from TR — they're never
      // translated, so any value still sitting in the EN bin (e.g.
      // from older MyMemory passes when [].name was a translatable
      // path) must be ignored.
      id: trCat.id,
      accent: trCat.accent,
      image: trCat.image,
      name: trCat.name,
      products: Array.isArray(trCat.products)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? trCat.products.map((trP: any, j: number) => {
            const enP = Array.isArray(enCat.products) ? enCat.products[j] : null;
            if (!enP) return trP;
            return {
              ...trP,
              ...enP,
              id: trP.id,
              code: trP.code,
              image: trP.image,
              images: trP.images,
              name: trP.name,
              specs: Array.isArray(trP.specs)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? trP.specs.map((trS: any, k: number) => {
                    const enS = Array.isArray(enP.specs) ? enP.specs[k] : null;
                    if (!enS) return trS;
                    return {
                      ...trS,
                      group: enS.group ?? trS.group,
                      items: Array.isArray(trS.items)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? trS.items.map((trI: any, m: number) => {
                            const enI = Array.isArray(enS.items) ? enS.items[m] : null;
                            return enI ? { ...trI, ...enI } : trI;
                          })
                        : trS.items,
                    };
                  })
                : trP.specs,
            };
          })
        : trCat.products,
    };
  });
}

// Concatenate TR categories from both shards. Categories are
// position-stable within their own bin; the merged order is
// "main bin first, then extra bin", matching how operators add new
// overflow categories at the end.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readShardedTr(): Promise<{ tr: unknown[]; primary: any | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main = await readBin("products"); } catch {}
  try { extra = await readBin("productsExtra"); } catch {}
  if (!main) {
    main = loadJsonFile(fallbackPath);
    return { tr: unwrapTr(main), primary: main };
  }
  const merged = [...unwrapTr(main), ...unwrapTr(extra)];
  return { tr: merged, primary: main };
}

async function readShardedEn(): Promise<unknown[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main = await readBin("productsEn"); } catch {}
  try { extra = await readBin("productsEnExtra"); } catch {}
  const m = unwrapEn(main);
  const e = unwrapEn(extra);
  if (!m && !e) return null;
  return [...(m ?? []), ...(e ?? [])];
}

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  const { tr, primary: trRecord } = await readShardedTr();
  if (tr.length === 0) return NextResponse.json({ error: "Ürünler yüklenemedi" }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trSeo = applyProductSeo(tr as any[]);
  if (lang === "tr") return NextResponse.json(trSeo);

  // EN comes from its own bin pair (or the local fallback file).
  let en = await readShardedEn();
  // Legacy fallback: very early bins kept EN inside the products record.
  if (!en && trRecord && typeof trRecord === "object" && trRecord._translations?.en) {
    en = unwrapEn(trRecord._translations.en);
  }
  if (!en) {
    const fileEn = loadJsonFile(fallbackEnPath);
    if (Array.isArray(fileEn)) en = fileEn;
  }
  return NextResponse.json(mergeCategories(trSeo, en));
}
