import { NextRequest, NextResponse } from "next/server";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "ico"];
const DOC_EXTS   = ["pdf", "doc", "docx", "xls", "xlsx"];

async function uploadToImgbb(bytes: ArrayBuffer, filename: string, apiKey: string): Promise<string> {
  const base64 = Buffer.from(bytes).toString("base64");
  const body = new URLSearchParams();
  body.append("key", apiKey);
  body.append("image", base64);
  body.append("name", `${Date.now()}-${filename.replace(/[^a-z0-9.\-_]/gi, "_")}`);
  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(`ImgBB error: ${JSON.stringify(json)}`);
  return json.data.display_url as string;
}

async function uploadToCloudinary(bytes: ArrayBuffer, filename: string, cloudName: string, preset: string): Promise<string> {
  const base64 = Buffer.from(bytes).toString("base64");
  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const dataUri = `data:application/octet-stream;base64,${base64}`;
  const body = new FormData();
  body.append("file", dataUri);
  body.append("upload_preset", preset);
  body.append("public_id", `documents/${Date.now()}-${filename.replace(/[^a-z0-9.\-_]/gi, "_")}`);
  body.append("resource_type", "raw");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, { method: "POST", body });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Cloudinary error: ${JSON.stringify(json.error)}`);
  // Append extension hint so browsers download correctly
  return `${json.secure_url}.${ext}` as string;
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
      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) return NextResponse.json({ error: "IMGBB_API_KEY tanımlı değil" }, { status: 500 });
      const url = await uploadToImgbb(bytes, file.name, apiKey);
      return NextResponse.json({ url });
    }

    if (DOC_EXTS.includes(ext)) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const preset    = process.env.CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !preset) {
        return NextResponse.json(
          { error: "Döküman yükleme için CLOUDINARY_CLOUD_NAME ve CLOUDINARY_UPLOAD_PRESET env değişkenleri gerekli" },
          { status: 500 }
        );
      }
      const url = await uploadToCloudinary(bytes, file.name, cloudName, preset);
      return NextResponse.json({ url });
    }

    return NextResponse.json(
      { error: "Desteklenmeyen dosya türü. Görseller: jpg/png/webp. Dökümanlar: pdf/doc/xls" },
      { status: 400 }
    );
  } catch (e) {
    console.error("upload error:", e);
    return NextResponse.json({ error: "Yükleme hatası: " + String(e) }, { status: 500 });
  }
}
