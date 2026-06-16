import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
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

// Asıl Blob okuması (cache'siz). private get → stream → JSON.
// Hata fırlatırsa (token yok / Blob erişilemez) çağıranlar data/*.json yedeğine düşer.
async function readBlobRaw(name: string): Promise<unknown> {
  const res = await get(pathFor(name), { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) {
    throw new Error(`Blob read failed: ${name} status=${res?.statusCode ?? "none"}`);
  }
  return await new Response(res.stream as unknown as ReadableStream).json();
}

// readBin: genel (salt-okuma) çağrılar Next Data Cache'inde tutulur — böylece her
// ziyaretçi/bot Blob'a "advanced operation" göndermez (Vercel Blob ücretsiz kotası
// 2.000 işlem/ay; önbelleksiz her istek bunu hızla tüketiyordu). Cache yalnız
// writeBin'in revalidateTag'i ile (admin/iletişim kaydı) ya da revalidate süresi
// (güvenlik ağı) dolunca tazelenir → Blob işlemi ~%95+ azalır.
// ⚠️ Oku-değiştir-yaz akışları (admin route'ları + iletişim formu mesaj ekleme)
// `{ fresh: true }` geçer → cache ATLANIR, taze veri okunur (stale yazma riski yok).
export async function readBin(name: string, opts: { fresh?: boolean } = {}): Promise<unknown> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  if (opts.fresh) return readBlobRaw(name);
  const cached = unstable_cache(
    () => readBlobRaw(name),
    ["store", name],
    { tags: [tagFor(name)], revalidate: 1800 },
  );
  return cached();
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
