import "server-only";
import { readBin } from "../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";
import type { CategoryShape } from "./seo";

type CategoriesMeta = Record<string, { name?: string; subtitle?: string; description?: string }>;

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
