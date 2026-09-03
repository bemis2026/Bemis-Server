import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";

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
  // Ürün değişiklik günlüğü (bayi beslemesi). ⚠️ `changelog`DAN AYRI:
  // o site sürüm notları, bu ürün alanı değişiklikleri.
  "productChanges",
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

// ── İletişim formu arşivi: DURAĞAN ŞİFRELEME (AES-256-GCM) ───────────
//
// ⚠️⚠️ NEDEN ŞART (2026-08-19 ÖLÇÜMÜ): R2 kovası HÂLÂ HERKESE AÇIK.
//    Parolasız düz `curl https://pub-*.r2.dev/bins/dealers.json` → **200**
//    (9,2 KB; 29 e-posta, 6'sı kişisel; 17 telefon). content.json ve
//    products.json da açık. Bu yüzden `messages` bin'i (ad · e-posta ·
//    telefon · mesaj metni · IP = KVKK kapsamında kişisel veri) R2'ye
//    ASLA düz metin yazılmaz — yazılsaydı dışarıdan indirilebilirdi.
//
// Depolanan biçim, kovayı indiren biri için anlamsız bir zarftır:
//   { "v":1, "alg":"A256GCM", "iv":"<b64>", "tag":"<b64>", "data":"<b64>" }
//
// ⚠️ ANAHTAR YOKSA YAZMA (fail-closed). Eski davranış (hiç yazmama)
//    korunur; sessizce düz metne DÜŞMEZ.
// ⚠️ `MESSAGES_ENC_KEY` KAYBOLURSA ARŞİV OKUNAMAZ (kurtarma yok) —
//    e-posta zaten ikinci kopya olduğu için kabul edilebilir risk.
const ENCRYPTED_BINS = new Set(["messages"]);

function encKey(): Buffer | null {
  const raw = process.env.MESSAGES_ENC_KEY;
  if (!raw) return null;
  // 32 baytlık ham anahtar (base64/hex) doğrudan; değilse SHA-256 ile türet.
  for (const enc of ["base64", "hex"] as const) {
    try { const b = Buffer.from(raw, enc); if (b.length === 32) return b; } catch {}
  }
  return createHash("sha256").update(raw, "utf8").digest();
}

type Envelope = { v: number; alg: string; iv: string; tag: string; data: string };
function isEnvelope(x: unknown): x is Envelope {
  const o = x as Envelope | null;
  return !!o && typeof o === "object" && o.alg === "A256GCM" &&
    typeof o.iv === "string" && typeof o.tag === "string" && typeof o.data === "string";
}

function sifrele(body: unknown): Envelope {
  const key = encKey();
  if (!key) throw new Error("MESSAGES_ENC_KEY yok — şifreli bin yazılamaz");
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([c.update(JSON.stringify(body), "utf8"), c.final()]);
  return { v: 1, alg: "A256GCM", iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") };
}

function coz(parsed: unknown): unknown {
  // Zarf değilse eski/düz kayıt → olduğu gibi dön (geriye uyum).
  if (!isEnvelope(parsed)) return parsed;
  const key = encKey();
  if (!key) throw new Error("MESSAGES_ENC_KEY yok — arşiv çözülemiyor");
  const d = createDecipheriv("aes-256-gcm", key, Buffer.from(parsed.iv, "base64"));
  d.setAuthTag(Buffer.from(parsed.tag, "base64"));
  const out = Buffer.concat([d.update(Buffer.from(parsed.data, "base64")), d.final()]);
  return JSON.parse(out.toString("utf8"));
}
// Asıl R2 okuması (cache'siz). Obje yoksa (henüz hiç yazılmamış) veya erişilemezse
// throw eder → çağıranlar data/*.json yedeğine düşer (site çalışmaya devam eder).
async function readBlobRaw(name: string): Promise<unknown> {
  const res = await r2().send(new GetObjectCommand({ Bucket: bucket(), Key: pathFor(name) }));
  if (!res.Body) throw new Error(`R2 read empty: ${name}`);
  const text = await res.Body.transformToString();
  const parsed = JSON.parse(text);
  return ENCRYPTED_BINS.has(name) ? coz(parsed) : parsed;
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
    ["store", name, "v96-faq-en"],
    { tags: [tagFor(name)], revalidate: 21600 },
  );
  return cached();
}

/**
 * R2'den HAM dosya oku (bins DIŞI — döküman vekili için).
 *
 * ⚠️ NEDEN VAR (2026-08-05): döküman vekili dosyayı GENEL adresten
 * (`pub-*.r2.dev`) `fetch` ile çekiyordu. Bu, kovanın herkese açık kalmasını
 * ZORUNLU kılıyordu — ve ölçüldü ki aynı açıklık `bins/dealers.json`'ı da
 * dışarıya veriyor (29 e-posta, 6'sı kişisel; 33 telefon). Vekil S3 API +
 * kimlik ile okuyunca genel erişime hiç gerek kalmaz → kovanın public
 * erişimi kapatılabilir, bins/*.json dışarıdan indirilemez olur.
 */
export async function readObject(key: string): Promise<{
  stream: ReadableStream | null;
  contentType?: string;
  contentLength?: number;
}> {
  const res = await r2().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  const b = res.Body as unknown as { transformToWebStream?: () => ReadableStream } | undefined;
  return {
    stream: b?.transformToWebStream ? b.transformToWebStream() : null,
    contentType: res.ContentType,
    contentLength: res.ContentLength,
  };
}

export async function writeBin(name: string, body: unknown): Promise<void> {
  if (!BINS.has(name)) throw new Error(`Unknown bin: ${name}`);
  // ⚠️ GÜVENLİK: R2 kovası HÂLÂ HERKESE AÇIK (2026-08-19 ölçümü, yukarıdaki
  // blok). `messages` = iletişim formu PII'si → düz metin YAZILMAZ, AES-256-GCM
  // ile şifrelenir. Anahtar yoksa hiç yazılmaz (eski "arşiv kapalı" davranışı).
  let payload: unknown = body;
  if (ENCRYPTED_BINS.has(name)) {
    // ⚠️ ÜZERİNE YAZMADAN ÖNCE MEVCUDU ÇÖZEBİLDİĞİMİZİ DOĞRULA.
    // Çağıranlar arşivi `readBin(...).catch(() => null)` ile okuyor; çözülemeyen
    // bir arşiv onlara BOŞ görünür ve ilk yeni mesaj tüm geçmişi EZERDİ
    // (anahtar döndürülürse/kaybolursa tam olarak bu olur). Burada durdurulur.
    try {
      await readBlobRaw(name);
    } catch (e) {
      const yok = (e as { name?: string })?.name === "NoSuchKey";
      if (!yok) throw new Error(`${name} arşivi çözülemedi — üzerine YAZILMADI (anahtar değişmiş olabilir): ${(e as Error).message}`);
      // NoSuchKey = arşiv henüz yok → ilk yazım, sorun değil.
    }
    if (!encKey()) {
      console.error(`[store] ${name} YAZILMADI: MESSAGES_ENC_KEY tanımlı değil (PII düz metin yazılmaz)`);
      return;
    }
    payload = sifrele(body);
  }
  await r2().send(new PutObjectCommand({
    Bucket: bucket(),
    Key: pathFor(name),
    Body: JSON.stringify(payload),
    ContentType: "application/json",
  }));
  try { revalidateTag(tagFor(name), "max"); } catch {}
}
