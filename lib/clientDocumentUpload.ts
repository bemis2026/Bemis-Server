// Client-side PDF / Office document upload helper.
//
// Vercel'in serverless function gövde sınırı (~4.5 MB) yüzünden büyük PDF'ler
// /api/admin/upload üzerinden geçemiyordu — operatör "yükleme yapılamıyor"
// hatasıyla karşılaşıyordu. Bu yardımcı dosyayı doğrudan Cloudinary'nin
// unsigned upload endpoint'ine atar, Vercel'i tamamen bypass eder.
//
// Çevre değişkenleri:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   — Cloudinary dashboard'daki cloud name
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET — unsigned preset adı (folder: documents)
//
// İkisi de set değilse fallback olarak /api/admin/upload kullanılır (server-side
// upload). Bu yol küçük dosyalarda çalışır, 4.5 MB+ için uyarı verir.

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

/**
 * Bir doküman dosyasını yükle. Cloudinary env'leri tanımlıysa direct upload
 * kullanılır (Vercel body limit'i devre dışı kalır). Aksi halde server-side
 * /api/admin/upload'a fallback yapılır.
 */
export async function uploadDocument(file: File, folder: string = "documents"): Promise<DocUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const preset    = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (cloudName && preset) {
    return uploadDirectCloudinary(file, folder, cloudName, preset);
  }

  // Fallback: küçük dosyalar için server-side upload akışı.
  return uploadViaServer(file, folder);
}
