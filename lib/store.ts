import "server-only";
import { revalidateTag } from "next/cache";
import { put, list } from "@vercel/blob";

// Kalıcı veri deposu — Vercel Blob.
// JSONBin'in yerine geçer; readBin/writeBin imzası AYNI kalır, böylece
// uygulamanın geri kalanı değişmeden çalışır. Her "bin" tek bir JSON blob
// olarak `bins/<name>.json` yolunda saklanır (sabit ad, üzerine yazılır).
// İstek/ay limiti YOK; ücretsiz katman bizim için fazlasıyla yeter.
//
// Not: BLOB_READ_WRITE_TOKEN env'i (Vercel'de Blob store açılınca otomatik
// eklenir) yoksa list/put hata fırlatır → çağıranlar data/*.json yedeğine
// düşer (mevcut güvenlik ağı korunur).

const REVALIDATE_SECONDS = 3600;
const tagFor = (name: string) => `store:${name}`;
const pathFor = (name: string) => `bins/${name}.json`;

const BINS = new Set([
  "b2b", "content", "dealers", "products", "productsExtra",
  "productsEn", "productsEnExtra", "documents", "messages", "changelog",
]);

export async function readBin(name: string, opts: { fresh?: boolean } = {}): Promise<unknown> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  const p = pathFor(name);
  const { blobs } = await list({ prefix: p, limit: 100 });
  const blob = blobs.find((b) => b.pathname === p);
  if (!blob) throw new Error(`Blob not found: ${name}`);
  const init: RequestInit = opts.fresh
    ? { cache: "no-store" }
    : ({ next: { revalidate: REVALIDATE_SECONDS, tags: [tagFor(name)] } } as RequestInit);
  const res = await fetch(blob.url, init);
  if (!res.ok) throw new Error(`Blob read failed: ${res.status}`);
  return res.json();
}

export async function writeBin(name: string, body: unknown): Promise<void> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  await put(pathFor(name), JSON.stringify(body), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  try { revalidateTag(tagFor(name), "max"); } catch {}
}
