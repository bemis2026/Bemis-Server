// Client-side image upload helper.
//
// Vercel serverless functions cap request bodies at ~4.5MB on the free
// plan, and base64 encoding inflates the size by ~33%. So a raw 4MB JPEG
// fails before it even reaches our /api/admin/upload route.
//
// To avoid that, we transcode anything bigger than `THRESHOLD_BYTES`
// through a canvas, capping the long edge at `MAX_DIMENSION` and
// re-encoding as JPEG at high quality. This still leaves uploads at full
// 4K resolution (more than enough for hero / OG / product images) but
// always under the request limit.

const THRESHOLD_BYTES = 3 * 1024 * 1024; // 3 MB raw upload threshold
const MAX_DIMENSION = 3840;              // 4K UHD long edge
const JPEG_QUALITY = 0.92;

async function loadBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

async function compressImage(file: File): Promise<File> {
  const img = await loadBitmap(file);
  const { naturalWidth: w, naturalHeight: h } = img;

  // If the image is already small enough on every axis, skip the canvas
  // round-trip — re-encoding a fine image only loses quality.
  const longEdge = Math.max(w, h);
  if (longEdge <= MAX_DIMENSION && file.size <= THRESHOLD_BYTES) return file;

  const scale = longEdge > MAX_DIMENSION ? MAX_DIMENSION / longEdge : 1;
  const targetW = Math.round(w * scale);
  const targetH = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return file;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY)
  );
  if (!blob) return file;

  // Preserve the original name but force the extension to .jpg so the
  // server's MIME detection picks the right path. Hero / OG / product
  // images are virtually always rasters anyway.
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

export type UploadResult = { url: string };

/**
 * Upload an image file to the admin endpoint, transparently compressing
 * it client-side if it would otherwise exceed Vercel's request-body cap.
 * Throws an Error with a helpful message on any failure — callers can
 * surface `err.message` directly to the user via a toast.
 */
export async function uploadImage(file: File, folder?: string): Promise<UploadResult> {
  let payload: File = file;
  if (file.type.startsWith("image/")) {
    try {
      payload = await compressImage(file);
    } catch {
      // Compression is best-effort; fall through to upload the original.
      payload = file;
    }
  }

  const fd = new FormData();
  fd.append("file", payload);
  if (folder) fd.append("folder", folder);

  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) detail = String(data.error);
    } catch {
      // Body is not JSON — likely the platform itself rejected the
      // request (Vercel body-too-large = HTTP 413, etc.). Surface a
      // hint so the operator knows how to recover.
      if (res.status === 413) {
        detail = "Dosya çok büyük. Lütfen daha düşük çözünürlüklü bir görsel deneyin.";
      }
    }
    throw new Error(detail);
  }

  return (await res.json()) as UploadResult;
}
