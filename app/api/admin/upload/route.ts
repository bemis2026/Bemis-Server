import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "ico"];
const DOC_EXTS   = ["pdf", "doc", "docx", "xls", "xlsx"];

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const IMAGE_MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", ico: "image/x-icon",
};

async function uploadToImgbb(bytes: ArrayBuffer, filename: string, apiKey: string): Promise<string> {
  const base64 = Buffer.from(bytes).toString("base64");
  const body = new URLSearchParams();
  body.append("key", apiKey);
  body.append("image", base64);
  body.append("name", `${Date.now()}-${filename.replace(/[^a-z0-9.\-_]/gi, "_")}`);
  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(`ImgBB hatası: ${json?.error?.message ?? res.status}`);
  // Prefer the original-resolution URL. `display_url` returns the auto-resized
  // (max ~1280px wide) variant, which is why hero / OG images came back tiny.
  // `image.url` is the full upload, `data.url` is its mirror.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = json.data as any;
  return (d?.image?.url ?? d?.url ?? d?.display_url) as string;
}

async function uploadToCloudinary(bytes: ArrayBuffer, filename: string, ext: string, cloudName: string, preset: string): Promise<string> {
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = MIME[ext] ?? "application/octet-stream";
  const safeName = filename.replace(/[^a-z0-9.\-_]/gi, "_");
  // public_id must not contain slashes — Cloudinary derives display_name
  // from public_id (per preset setting) and slashes are rejected. Send
  // folder as a separate parameter so the asset still lands in /documents.
  // Note: display_name parameter is not permitted on unsigned uploads.
  const publicId = `${Date.now()}-${safeName}`;

  const body = new URLSearchParams();
  body.append("file", `data:${mime};base64,${base64}`);
  body.append("upload_preset", preset);
  body.append("public_id", publicId);
  body.append("folder", "documents");

  // Use the /raw/upload endpoint directly for non-image documents.
  // Sending resource_type in the body alongside /auto/upload caused
  // Cloudinary to occasionally fall through to signed-upload validation,
  // returning a misleading "unknown API key" error.
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() }
  );
  const json = await res.json();
  if (!res.ok || json.error) {
    const cloudinaryMsg: string = json?.error?.message ?? `HTTP ${res.status}`;
    // "Unknown API key" with no api_key sent = Cloudinary couldn't resolve the
    // cloud_name. Surface what we actually used so the operator can compare it
    // against the value shown in the Cloudinary dashboard.
    if (/unknown api key/i.test(cloudinaryMsg)) {
      throw new Error(`Cloudinary hatası: "${cloudinaryMsg}". Vercel'de CLOUDINARY_CLOUD_NAME=\"${cloudName}\" olarak ayarlanmış. Cloudinary dashboard'daki Cloud name (sol üst) ile birebir aynı mı kontrol edin.`);
    }
    throw new Error(`Cloudinary hatası: ${cloudinaryMsg}`);
  }
  return json.secure_url as string;
}

// Görseller Cloudinary'nin /image/upload ucuna gider (res.cloudinary.com — kalıcı,
// güvenilir görsel CDN'i; folder=products). Orijinal bayt yüklenir → kalite AYNI
// (yeniden boyutlandırma/sıkıştırma YOK). public_id verilmez → Cloudinary otomatik
// benzersiz kimlik üretir (çakışma yok). Bu, eski i.ibb.co (ImgBB) bağımlılığını
// yeni yüklemelerde de ortadan kaldırır; ImgBB yalnızca yedek yol olarak kalır.
async function uploadImageToCloudinary(bytes: ArrayBuffer, ext: string, cloudName: string, preset: string): Promise<string> {
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = IMAGE_MIME[ext] ?? "image/png";

  const body = new URLSearchParams();
  body.append("file", `data:${mime};base64,${base64}`);
  body.append("upload_preset", preset);
  body.append("folder", "products");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() }
  );
  const json = await res.json();
  if (!res.ok || json.error) {
    const cloudinaryMsg: string = json?.error?.message ?? `HTTP ${res.status}`;
    if (/unknown api key/i.test(cloudinaryMsg)) {
      throw new Error(`Cloudinary görsel hatası: "${cloudinaryMsg}". Vercel'de CLOUDINARY_CLOUD_NAME=\"${cloudName}\" olarak ayarlanmış. Cloudinary dashboard'daki Cloud name (sol üst) ile birebir aynı mı kontrol edin.`);
    }
    throw new Error(`Cloudinary görsel hatası: ${cloudinaryMsg}`);
  }
  return json.secure_url as string;
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const bytes = await file.arrayBuffer();

    if (IMAGE_EXTS.includes(ext)) {
      // Öncelik: Cloudinary /image/upload (kalıcı, güvenilir CDN). Env varsa oraya.
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
      const preset    = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
      if (cloudName && preset) {
        const url = await uploadImageToCloudinary(bytes, ext, cloudName, preset);
        return NextResponse.json({ url });
      }
      // Yedek: ImgBB (eski yol) — Cloudinary env'i yoksa.
      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "Görsel yükleme yapılandırması eksik: CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET (önerilen) veya IMGBB_API_KEY tanımlı olmalı." },
          { status: 500 }
        );
      }
      const url = await uploadToImgbb(bytes, file.name, apiKey);
      return NextResponse.json({ url });
    }

    if (DOC_EXTS.includes(ext)) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
      const preset    = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();
      const missing: string[] = [];
      if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
      if (!preset)    missing.push("CLOUDINARY_UPLOAD_PRESET");
      if (missing.length) {
        return NextResponse.json(
          { error: `Eksik env değişkeni: ${missing.join(", ")}. Vercel → Settings → Environment Variables sekmesinde Production ortamına eklendiğinden emin olun ve yeni bir deploy tetikleyin.` },
          { status: 500 }
        );
      }
      const url = await uploadToCloudinary(bytes, file.name, ext, cloudName!, preset!);
      return NextResponse.json({ url });
    }

    return NextResponse.json(
      { error: `Desteklenmeyen dosya türü: .${ext}` },
      { status: 400 }
    );
  } catch (e) {
    console.error("upload error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
