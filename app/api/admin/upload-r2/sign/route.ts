// Cloudflare R2 — presigned PUT URL üretir.
// Browser bu URL'ye doğrudan dosyayı PUT'lar → Vercel serverless'i bypass
// edilir, body limit (4.5 MB) ve Cloudinary raw limit (10 MB) sorun olmaz.
//
// Akış:
//   1. Client POST /api/admin/upload-r2/sign  body: { filename, contentType, folder }
//   2. Endpoint: kısa-ömürlü (5 dk) presigned PUT URL döndürür + final public URL
//   3. Client: fetch(presignedUrl, { method: "PUT", body: file })
//   4. Done → public URL DocEntry.url olarak admin'e yazılır

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

// Cloudflare R2 — AWS S3 uyumlu, region "auto"; endpoint env'den
// `https://<account-id>.r2.cloudflarestorage.com` formatında gelir.
function getClient() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 env eksik (R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)");
  }
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const { filename, contentType, folder } = await req.json();
    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "filename gerekli" }, { status: 400 });
    }
    const bucket = process.env.R2_BUCKET;
    const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
    if (!bucket || !publicBase) {
      return NextResponse.json({ error: "R2_BUCKET / R2_PUBLIC_URL env eksik" }, { status: 500 });
    }

    const safeName = filename.replace(/[^a-z0-9.\-_]/gi, "_");
    const folderPart = (folder || "documents").replace(/[^a-z0-9\-_/]/gi, "_");
    const key = `${folderPart}/${Date.now()}-${safeName}`;

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });
    const uploadUrl = await getSignedUrl(getClient(), cmd, { expiresIn: 300 });
    const publicUrl = `${publicBase}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (e) {
    console.error("r2-sign error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
