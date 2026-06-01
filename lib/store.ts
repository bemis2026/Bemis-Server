import "server-only";
import { revalidateTag } from "next/cache";
import { put, get } from "@vercel/blob";

// Kalıcı veri deposu — Vercel Blob (private).
// JSONBin'in yerine geçer; readBin/writeBin imzası AYNI kalır, böylece
// uygulamanın geri kalanı değişmeden çalışır. Her "bin" tek bir JSON blob
// olarak `bins/<name>.json` yolunda saklanır (private, sabit ad, üzerine yazılır).
// İstek/ay limiti YOK; 100KB kayıt limiti YOK.
//
// Okuma: get() içeriği stream olarak döndürür (token BLOB_READ_WRITE_TOKEN
// env'inden otomatik alınır). private olduğu için içerik dışarıdan URL ile
// okunamaz — kişisel veri (messages) güvende. Token yoksa get() hata fırlatır
// → çağıranlar data/*.json yedeğine düşer (güvenlik ağı korunur).

const tagFor = (name: string) => `store:${name}`;
const pathFor = (name: string) => `bins/${name}.json`;

const BINS = new Set([
  "b2b", "content", "dealers", "products", "productsExtra",
  "productsEn", "productsEnExtra", "documents", "messages", "changelog",
]);

export async function readBin(name: string, _opts: { fresh?: boolean } = {}): Promise<unknown> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  const res = await get(pathFor(name), { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) {
    throw new Error(`Blob read failed: ${name} status=${res?.statusCode ?? "none"}`);
  }
  return await new Response(res.stream as unknown as ReadableStream).json();
}

export async function writeBin(name: string, body: unknown): Promise<void> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  await put(pathFor(name), JSON.stringify(body), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  try { revalidateTag(tagFor(name), "max"); } catch {}
}
