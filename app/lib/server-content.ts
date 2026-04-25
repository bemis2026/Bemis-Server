import "server-only";
import { readBin } from "../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";
import type { CategoryShape } from "./seo";

type CategoriesMeta = Record<string, { name?: string; subtitle?: string; description?: string }>;

// Returns raw site content (TR baseline) for SSR hydration of ContentProvider.
// Falls back to data/content.json on JSONBin failures so production never
// hard-renders defaultContent placeholder text.
export async function getServerSiteContent(): Promise<unknown> {
  try {
    return await readBin("content");
  } catch {}
  try {
    const fb = path.join(process.cwd(), "data", "content.json");
    return JSON.parse(readFileSync(fb, "utf-8"));
  } catch {}
  return null;
}

export async function getServerProducts(): Promise<CategoryShape[]> {
  try {
    const data = await readBin("products");
    if (Array.isArray(data)) return data as CategoryShape[];
  } catch {}
  try {
    const fb = path.join(process.cwd(), "data", "products.json");
    const parsed = JSON.parse(readFileSync(fb, "utf-8"));
    if (Array.isArray(parsed)) return parsed as CategoryShape[];
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
