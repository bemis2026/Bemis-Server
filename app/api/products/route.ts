import { NextRequest, NextResponse } from "next/server";
import { readBin } from "../../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";

const fallbackPath = path.join(process.cwd(), "data", "products.json");
const fallbackEnPath = path.join(process.cwd(), "data", "products-en.json");

export const revalidate = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap(record: any): { tr: unknown[]; en: unknown[] | null } {
  if (Array.isArray(record)) return { tr: record, en: null };
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    const en = record._translations?.en;
    return { tr: record.products, en: Array.isArray(en) ? en : null };
  }
  return { tr: [], en: null };
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
      id: trCat.id,
      accent: trCat.accent,
      image: trCat.image,
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

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let record: any = null;
  try { record = await readBin("products"); } catch {}
  if (!record) record = loadJsonFile(fallbackPath);
  if (!record) return NextResponse.json({ error: "Ürünler yüklenemedi" }, { status: 500 });

  const { tr, en: binEn } = unwrap(record);

  if (lang === "tr") return NextResponse.json(tr);

  let en = binEn;
  if (!en) {
    const fileEn = loadJsonFile(fallbackEnPath);
    if (Array.isArray(fileEn)) en = fileEn;
  }
  return NextResponse.json(mergeCategories(tr, en));
}
