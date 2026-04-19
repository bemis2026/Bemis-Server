import { NextRequest, NextResponse } from "next/server";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "IMGBB_API_KEY tanımlı değil" }, { status: 500 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!ext || !allowed.includes(ext)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü (jpg, png, webp, gif)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const body = new URLSearchParams();
    body.append("key", apiKey);
    body.append("image", base64);
    body.append("name", `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body,
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("imgbb error:", json);
      return NextResponse.json({ error: "ImgBB yükleme hatası" }, { status: 500 });
    }

    return NextResponse.json({ url: json.data.display_url });
  } catch (e) {
    console.error("upload error:", e);
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 });
  }
}
