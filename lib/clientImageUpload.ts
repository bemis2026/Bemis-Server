// İstemci tarafı görsel yükleme yardımcısı.
//
// ⚠️ AYNI ANDA GEÇERLİ İKİ KISIT VAR:
//   1. Vercel sunucu fonksiyonlarında istek gövdesi ~4.5 MB ile sınırlı.
//      `/api/admin/upload` vekili dosyayı base64'e çevirdiği için pratik
//      tavan daha da düşük. Bu tavana çarpan yükleme HTTP 413 ile ölür.
//   2. Kullanıcı kuralı: yüklenen görselin KALİTESİ ASLA düşürülmez.
//
// Bu ikisi birlikte tek bir çözüme işaret eder: dosyayı Vercel'e hiç
// uğratmadan tarayıcıdan DOĞRUDAN Cloudinary'e göndermek. Orijinal baytlar
// gider → yeniden kodlama yok, küçültme yok, ŞEFFAFLIK KORUNUR.
//
// ⚠️ 2026-08-07'de ölçülen iki gerçek kusur bu dosyada birleşiyordu:
//   (a) 4.5 MB üstü ürün render'ları sessizce reddediliyordu ("Yükleme
//       başarısız." — sebep gösterilmiyordu);
//   (b) yedek sıkıştırma yolu `alpha:false` tuval + JPEG kullanıyordu →
//       ŞEFFAF PNG'nin arkası SİYAHA dönüyordu. Kataloğun 115 görselinin
//       PNG (şeffaf ürün render'ı) olduğu düşünülürse bu sessiz bir
//       veri bozulmasıydı. Artık şeffaflık korunarak PNG'ye kodlanıyor.

const VEKIL_TAVANI = 4 * 1024 * 1024; // vekil yolun güvenli üst sınırı
const MAX_DIMENSION = 3840; // 4K UHD uzun kenar (yalnız yedek yolda)
const JPEG_QUALITY = 0.92;

export type UploadResult = { url: string };

type DirectConfig = { cloudName: string; preset: string; direct: boolean };

// Yapılandırma oturum boyunca bir kez çekilir (her yüklemede tekrar sormak
// gereksiz round-trip). `null` = henüz sorulmadı, `false` = sorulup yok çıktı.
let cachedConfig: DirectConfig | null = null;
let configFetched = false;

async function getDirectConfig(): Promise<DirectConfig | null> {
  if (configFetched) return cachedConfig;
  configFetched = true;
  try {
    const res = await fetch("/api/admin/upload/config");
    if (!res.ok) return (cachedConfig = null);
    const cfg = (await res.json()) as DirectConfig;
    cachedConfig = cfg?.direct ? cfg : null;
  } catch {
    cachedConfig = null;
  }
  return cachedConfig;
}

/**
 * Dosyayı tarayıcıdan doğrudan Cloudinary'e yükler (imzasız preset).
 * Orijinal baytlar gönderilir — hiçbir dönüşüm uygulanmaz.
 * Başarısız olursa `null` döner ki çağıran vekil yola düşebilsin.
 */
async function uploadDirect(file: File, folder: string): Promise<string | null> {
  const cfg = await getDirectConfig();
  if (!cfg) return null;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", cfg.preset);
  fd.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`,
      { method: "POST", body: fd },
    );
    const json = await res.json();
    if (!res.ok || json?.error) return null;
    return (json.secure_url as string) ?? null;
  } catch {
    return null;
  }
}

async function loadBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

/**
 * YALNIZ vekil yola düşüldüğünde kullanılır (Cloudinary yapılandırması yoksa).
 * Doğrudan yükleme çalıştığı sürece bu fonksiyon hiç çağrılmaz.
 *
 * ⚠️ Şeffaflık taşıyabilen türler (png/webp/gif) tuvalde ALFA KORUNARAK
 * çizilir ve PNG olarak kodlanır — aksi hâlde ürün render'larının arkası
 * siyaha döner.
 */
async function compressImage(file: File): Promise<File> {
  const img = await loadBitmap(file);
  const { naturalWidth: w, naturalHeight: h } = img;

  const longEdge = Math.max(w, h);
  if (longEdge <= MAX_DIMENSION && file.size <= VEKIL_TAVANI) return file;

  const seffafOlabilir = /^image\/(png|webp|gif)$/.test(file.type);
  const scale = longEdge > MAX_DIMENSION ? MAX_DIMENSION / longEdge : 1;
  const targetW = Math.round(w * scale);
  const targetH = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  // alpha: şeffaf olabilen türlerde AÇIK kalmalı (varsayılan true).
  const ctx = canvas.getContext("2d", { alpha: seffafOlabilir });
  if (!ctx) return file;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const mime = seffafOlabilir ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), mime, JPEG_QUALITY),
  );
  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "");
  const ext = seffafOlabilir ? "png" : "jpg";
  return new File([blob], `${baseName}.${ext}`, { type: mime });
}

/**
 * Görseli yükler ve genel URL'ini döndürür.
 *
 * Sıra: (1) doğrudan Cloudinary — orijinal kalite, boyut sınırı yok;
 *       (2) vekil `/api/admin/upload` — yalnız yedek.
 *
 * Hata durumunda GERÇEK sebebi taşıyan Error fırlatır; çağıran
 * `err.message`'ı doğrudan kullanıcıya gösterebilir.
 */
export async function uploadImage(file: File, folder?: string): Promise<UploadResult> {
  const klasor = folder || "products";

  // 1) Doğrudan yol — dosya Vercel'e hiç uğramaz, orijinal baytlar gider.
  if (file.type.startsWith("image/")) {
    const url = await uploadDirect(file, klasor);
    if (url) return { url };
  }

  // 2) Vekil yol (yedek).
  let payload: File = file;
  if (file.type.startsWith("image/")) {
    try {
      payload = await compressImage(file);
    } catch {
      payload = file;
    }
  }

  const fd = new FormData();
  fd.append("file", payload);
  fd.append("folder", klasor);

  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) detail = String(data.error);
    } catch {
      if (res.status === 413) {
        const mb = (payload.size / 1024 / 1024).toFixed(1);
        detail = `Dosya çok büyük (${mb} MB) ve doğrudan yükleme yolu kullanılamadı. Vercel'de CLOUDINARY_CLOUD_NAME ve CLOUDINARY_UPLOAD_PRESET tanımlı mı kontrol edin.`;
      }
    }
    throw new Error(detail);
  }

  return (await res.json()) as UploadResult;
}
