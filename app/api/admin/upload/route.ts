import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["jpg", "jpeg", "png", "webp", "svg", "mp4", "webm", "mov"];
    if (!ext || !allowed.includes(ext)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü" }, { status: 400 });
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const blob = await put(`${folder}/${safeName}`, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("upload error:", e);
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 });
  }
}
