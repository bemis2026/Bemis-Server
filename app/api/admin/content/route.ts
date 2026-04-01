import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const content = JSON.parse(readFileSync(contentPath, "utf-8"));
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    writeFileSync(contentPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
