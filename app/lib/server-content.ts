import "server-only";
import { readBin } from "../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";
import type { CategoryShape } from "./seo";
import { applyProductSeo } from "./productSeo";

type CategoriesMeta = Record<string, { name?: string; subtitle?: string; description?: string }>;

// Returns raw site content (TR baseline) for SSR hydration of ContentProvider.
// Falls back to data/content.json on JSONBin failures so production never
// hard-renders defaultContent placeholder text.
//
// ⚠️ `_translations` BİLEREK ATILIYOR (2026-08-27 ölçümü): bu değer her sayfanın
// RSC yüküne gömülür ve anasayfa HTML'ini 645 KB'a şişiriyordu (23 bin Kiril +
// 17 bin Arapça karakter TR ziyaretçiye iniyordu). Hiçbir İSTEMCİ kodu
// initialContent._translations okumaz (yabancı dil /api/content?lang= ile gelir);
// _translations'ı kullanan her şey SUNUCU tarafında ve bin'i kendisi okur.
// ⚠️ readBin unstable_cache'li PAYLAŞILAN nesne döndürür → delete ile MUTASYON
// YASAK (aynı önbelleği /api/content'in dil merge'ü de kullanıyor); bu yüzden
// yüzeysel kopya (destructure) ile atılır.
function stripTranslationsShallow(obj: unknown): unknown {
  if (obj && typeof obj === "object" && !Array.isArray(obj) && "_translations" in (obj as Record<string, unknown>)) {
    const { _translations: _atilan, ...rest } = obj as Record<string, unknown>;
    return rest;
  }
  return obj;
}

export async function getServerSiteContent(): Promise<unknown> {
  try {
    return stripTranslationsShallow(await readBin("content"));
  } catch {}
  try {
    const fb = path.join(process.cwd(), "data", "content.json");
    return stripTranslationsShallow(JSON.parse(readFileSync(fb, "utf-8")));
  } catch {}
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapTr(record: any): CategoryShape[] {
  if (Array.isArray(record)) return record as CategoryShape[];
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    return record.products as CategoryShape[];
  }
  return [];
}

// Mirrors /api/products shard merge: TR catalog lives across `products` +
// `productsExtra` due to JSONBin's free-tier 100KB/record cap. Server-rendered
// pages must include both shards or charger-equipment (35 SKUs) silently
// drops out of SSR HTML.
export async function getServerProducts(): Promise<CategoryShape[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main = await readBin("products"); } catch {}
  try { extra = await readBin("productsExtra"); } catch {}
  const merged = [...unwrapTr(main), ...unwrapTr(extra)];
  if (merged.length > 0) return applyProductSeo(merged);
  try {
    const fb = path.join(process.cwd(), "data", "products.json");
    const parsed = JSON.parse(readFileSync(fb, "utf-8"));
    return applyProductSeo(unwrapTr(parsed));
  } catch {}
  return [];
}

export async function getServerCategoriesMeta(): Promise<CategoriesMeta> {
  try {
    const data = await readBin("content") as Record<string, unknown>;
    const cats = (data?.categories ?? {}) as CategoriesMeta;
    return cats;
  } catch {}
  return {};
}
