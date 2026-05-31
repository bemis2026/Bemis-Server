// Admin oturum belirteci — HMAC-SHA256 imzalı + süre damgalı.
//
// ESKİ DURUM (güvenlik açığı): admin_auth cookie sabit "1" idi; herkes
//   curl -b "admin_auth=1" ile kimlik doğrulamasız admin'e erişebiliyordu.
// YENİ DURUM: cookie artık "<payloadB64>.<hmac>" formatında imzalı bir
//   token taşır. Sunucu sırrını bilmeden geçerli token üretilemez, ve her
//   token bir son-kullanma (exp) damgası taşır.
//
// Sır kaynağı (öncelik sırası):
//   1. AUTH_COOKIE_SECRET  (önerilen — Vercel env'e eklenebilir)
//   2. ADMIN_PASSWORD      (zaten env'de mevcut bir sunucu sırrı — fallback)
//   3. dev fallback        (yalnız local; üretimde 1 veya 2 daima vardır)
//
// Node runtime gerektirir (crypto). Tüm /api/admin/* route'ları Node
// runtime'da çalışıyor — Edge'e taşınırsa Web Crypto'ya geçilmeli.

import crypto from "crypto";

function getSecret(): string {
  return (
    process.env.AUTH_COOKIE_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "bemis-dev-only-insecure-secret"
  );
}

function sign(payloadB64: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * İmzalı oturum token'ı üretir. maxAgeSec sonra geçersiz olur.
 * Login route'unda cookie değeri olarak set edilir.
 */
export function createAdminSession(maxAgeSec: number): string {
  const payloadB64 = Buffer.from(JSON.stringify({ exp: nowSec() + maxAgeSec })).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Cookie'deki token'ı doğrular: imza sunucu sırrıyla eşleşiyor mu ve
 * süresi dolmamış mı? Eski sabit "1" değeri (veya boş/bozuk) → false.
 * Tüm /api/admin/* route'larındaki isAuthed bunu çağırır.
 */
export function verifyAdminSession(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (typeof payload?.exp !== "number" || payload.exp < nowSec()) return false;
  } catch {
    return false;
  }
  return true;
}
