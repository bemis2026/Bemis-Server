/**
 * CSS arka plan görselini Next görsel optimizer'ından geçir.
 *
 * ⚠️ NEDEN VAR (2026-08-22 ölçümü): kategori kartlarının `sliderImage`'ı
 * `backgroundImage: url(...)` ile veriliyordu. CSS arka planları `next/image`
 * bileşeninden GEÇMEZ → ham dosya her ziyaretçiye olduğu gibi iniyordu.
 * Ölçüm: `/products` sayfasında tek bir PNG **1,65 MB** doğrudan Cloudinary'den
 * indiriliyordu; sayfadaki diğer TÜM görseller (65 istek) optimize edilmiş
 * hâlde toplam 1,24 MB idi. Cloudinary panelinde aylık 12,56 GB bant genişliği
 * = ücretsiz kotanın ~%50'si; bu tek dosya oranın neredeyse tamamını açıklıyor
 * (1,65 MB × ~300 görüntüleme × 30 gün ≈ 14 GB).
 *
 * ⚠️ KALİTE DÜŞMEZ: kaynak dosyaya DOKUNULMAZ. Optimizer aynı görseli AVIF/WebP
 * olarak, istenen genişlikte ve `q=90` ile servis eder — bayt başına kalite
 * ARTAR. Ayrıca sonuç Vercel kenar önbelleğinde 30 gün kalır, yani Cloudinary'e
 * ziyaretçi başına değil, varyant başına bir kez gidilir.
 *
 * ⚠️ `qualities` ve `deviceSizes` listesi `next.config.ts`'te tanımlı — buradaki
 * değerler O LİSTEDE olmalı, yoksa optimizer HTTP 400 döner.
 */
const IZINLI_GENISLIK = [640, 828, 1080, 1920, 2560, 3840] as const;

export function optimizeBg(url?: string | null, genislik: number = 2560, kalite: number = 90): string | undefined {
  if (!url) return undefined;
  // Yerel/veri URL'leri ve zaten optimize edilmiş adresler olduğu gibi kalır.
  if (url.startsWith("data:") || url.startsWith("/_next/image")) return url;
  const w = IZINLI_GENISLIK.includes(genislik as (typeof IZINLI_GENISLIK)[number])
    ? genislik
    : 2560;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${kalite}`;
}

/** `backgroundImage` değerini doğrudan üretir (tırnak dahil). */
export function bgUrl(url?: string | null, genislik?: number, kalite?: number): string | undefined {
  const o = optimizeBg(url, genislik, kalite);
  return o ? `url("${o}")` : undefined;
}
