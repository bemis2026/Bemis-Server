import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

// Kalıcı veri deposu — Cloudflare R2 (S3 uyumlu, private).
// ⚠️ 2026-07-02: Vercel Blob deposu ASKIYA ALINDI (kota) → tüm admin kayıtları
// fail veriyordu ("This store has been suspended"). Veri katmanı ÜCRETSİZ +
// cömert kotalı R2'ye taşındı (R2 free tier: 10GB + milyonlarca işlem/ay).
// readBin/writeBin imzası AYNI kaldı → uygulamanın geri kalanı DEĞİŞMEDİ.
// Her "bin" tek JSON objesi: `bins/<name>.json` (sabit ad, üzerine yazılır).
//
// Kimlik bilgileri env'den (döküman yüklemeleriyle AYNI R2 hesabı):
//   R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET
// Okuma: GetObject → transformToString → JSON. Obje yok/erişilemezse THROW →
// çağıranlar `data/*.json` yedeğine düşer (güvenlik ağı korunur).
//
// ⚠️ GÜVENLİK: `messages` bin'i iletişim formu verisi (PII) içerir. R2 bucket'ı
// PUBLIC olmamalı — `bins/` yolu dışarıya açık serve edilmemeli (private erişim).

const tagFor = (name: string) => `store:${name}`;
const pathFor = (name: string) => `bins/${name}.json`;

const BINS = new Set([
  "b2b", "content", "dealers", "products", "productsExtra",
  "productsEn", "productsEnExtra", "documents", "messages", "changelog",
]);

// S3/R2 istemcisi — modül seviyesinde tekil (serverless invocation'lar arası yeniden kullanılır).
let _client: S3Client | null = null;
function r2(): S3Client {
  if (_client) return _client;
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 env eksik (R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)");
  }
  _client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

function bucket(): string {
  const b = process.env.R2_BUCKET;
  if (!b) throw new Error("R2_BUCKET env eksik");
  return b;
}

// Asıl R2 okuması (cache'siz). Obje yoksa (henüz hiç yazılmamış) veya erişilemezse
// throw eder → çağıranlar data/*.json yedeğine düşer (site çalışmaya devam eder).
async function readBlobRaw(name: string): Promise<unknown> {
  const res = await r2().send(new GetObjectCommand({ Bucket: bucket(), Key: pathFor(name) }));
  if (!res.Body) throw new Error(`R2 read empty: ${name}`);
  const text = await res.Body.transformToString();
  return JSON.parse(text);
}

// readBin: genel (salt-okuma) çağrılar Next Data Cache'inde tutulur — her
// ziyaretçi/bot R2'ye istek göndermez (ucuz olsa da gereksiz). Cache yalnız
// writeBin'in revalidateTag'i ile (admin/iletişim kaydı) ya da revalidate süresi
// (güvenlik ağı) dolunca tazelenir.
// ⚠️ Oku-değiştir-yaz akışları (admin route'ları + iletişim formu mesaj ekleme)
// `{ fresh: true }` geçer → cache ATLANIR, taze veri okunur (stale yazma riski yok).
export async function readBin(name: string, opts: { fresh?: boolean } = {}): Promise<unknown> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  if (opts.fresh) return readBlobRaw(name);
  const cached = unstable_cache(
    () => readBlobRaw(name),
    // ⚠️ Cache anahtarı sürümlü: görseller i.ibb.co→Cloudinary'e taşınınca (2026-07)
    // R2 bin'leri güncellendi ama eski unstable_cache (Data Cache) i.ibb.co URL'lerini
    // 6 saat tutuyordu. Sürüm segmentini bump'lamak = yeni anahtar = tek seferlik
    // cache miss = R2'den TAZE okuma (Cloudinary). İleride benzer veri göçünde bump'la.
    ["store", name, "v55-dc-metin-seo"],
    { tags: [tagFor(name)], revalidate: 21600 },
  );
  return cached();
}

export async function writeBin(name: string, body: unknown): Promise<void> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  // ⚠️ GÜVENLİK: R2 bucket'ı PUBLIC (r2.dev — dökümanlar için açık). `messages`
  // iletişim formu PII'si içerir → public bucket'a YAZMA (dışarıdan okunabilir
  // olur). İletişim formu zaten e-posta (Resend) gönderiyor; mesaj-store geçici
  // devre dışı. Ayrı PRIVATE bir bins bucket'ı kurulunca bu istisna kaldırılır.
  if (name === "messages") return;
  await r2().send(new PutObjectCommand({
    Bucket: bucket(),
    Key: pathFor(name),
    Body: JSON.stringify(body),
    ContentType: "application/json",
  }));
  try { revalidateTag(tagFor(name), "max"); } catch {}
}
