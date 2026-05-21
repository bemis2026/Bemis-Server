// Client-side PDF / Office document upload helper.
//
// Üç katmanlı strateji (öncelik sırasıyla):
//   1) **Cloudflare R2** (her boyut, sınırsız bandwidth) — server'dan
//      presigned PUT URL alır, browser doğrudan R2'ye yükler. Vercel'i
//      tamamen bypass eder, Cloudinary 10MB limit'i de yoktur.
//   2) **Cloudinary direct** (≤10MB) — `NEXT_PUBLIC_CLOUDINARY_*` env'leri
//      varsa fallback olarak kullanılır. Mevcut Cloudinary asset'leri için.
//   3) **/api/admin/upload** server-side — son fallback (Vercel 4.5MB limit).
//
// R2 endpoint env'leri (R2_ENDPOINT / R2_BUCKET / R2_PUBLIC_URL +
// R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY) Vercel'de tanımlı ise
// /api/admin/upload-r2/sign çalışır, helper bunu öncelikli kullanır.

export type DocUploadResult = { url: string };

async function uploadViaServer(file: File, folder: string): Promise<DocUploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { const data = await res.json(); if (data?.error) detail = String(data.error); }
    catch { if (res.status === 413) detail = "Dosya çok büyük (4.5 MB+). PDF'i sıkıştırıp yeniden deneyin veya Cloudinary direct-upload env'lerini ekleyin."; }
    throw new Error(detail);
  }
  return (await res.json()) as DocUploadResult;
}

async function uploadDirectCloudinary(file: File, folder: string, cloudName: string, preset: string): Promise<DocUploadResult> {
  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
  const publicId = `${Date.now()}-${safeName}`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);
  fd.append("public_id", publicId);
  fd.append("folder", folder);

  // /raw/upload — PDF/Office için. Browser FormData multipart body otomatik
  // hazırlanır; max size Cloudinary preset'inin tanımladığı kadar (free
  // tier'da varsayılan 100 MB raw).
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(`Cloudinary: ${json?.error?.message ?? `HTTP ${res.status}`}`);
  }
  return { url: json.secure_url as string };
}

async function uploadViaR2(file: File, folder: string): Promise<DocUploadResult> {
  // 1) Server'dan presigned PUT URL al (kısa-ömürlü, 5 dk geçerli).
  const signRes = await fetch("/api/admin/upload-r2/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      folder,
    }),
  });
  if (!signRes.ok) {
    let detail = `R2 sign HTTP ${signRes.status}`;
    try { const j = await signRes.json(); if (j?.error) detail = String(j.error); } catch {}
    throw new Error(detail);
  }
  const { uploadUrl, publicUrl } = (await signRes.json()) as { uploadUrl: string; publicUrl: string };

  // 2) Browser doğrudan R2'ye PUT — Vercel body limit yok, sadece R2 (5GB/file).
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!putRes.ok) {
    throw new Error(`R2 PUT HTTP ${putRes.status}`);
  }

  return { url: publicUrl };
}

/**
 * Bir doküman dosyasını yükle. Stratej i (öncelik sırasıyla):
 *   1. R2 — sunucudan presigned URL alıp browser'dan direct PUT.
 *      Önce bunu dene; başarısızsa diğer fallback'lere düşer.
 *   2. Cloudinary direct (NEXT_PUBLIC_CLOUDINARY_* env'leri varsa).
 *   3. /api/admin/upload server-side (Vercel 4.5MB body limit).
 */
export async function uploadDocument(file: File, folder: string = "documents"): Promise<DocUploadResult> {
  // 1) R2 — her boyut için tercih edilen yol
  try {
    return await uploadViaR2(file, folder);
  } catch (r2err) {
    // R2 env'leri yoksa /api/admin/upload-r2/sign 500 dönecek; bu durumda
    // sessizce alternatiflere düş. Aksi halde gerçek bir hata; sondaki
    // server-side fallback de fail ederse onun error'unu kullanıcıya sun.
    console.warn("R2 upload failed, falling back:", r2err);
  }

  // 2) Cloudinary direct (eğer env'ler doluysa)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const preset    = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  if (cloudName && preset) {
    try {
      return await uploadDirectCloudinary(file, folder, cloudName, preset);
    } catch (cloudErr) {
      console.warn("Cloudinary direct upload failed, falling back:", cloudErr);
    }
  }

  // 3) Son çare: server-side upload
  return uploadViaServer(file, folder);
}
