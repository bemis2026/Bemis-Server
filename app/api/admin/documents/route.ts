import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const filePath = () => path.join(process.cwd(), "data", "documents.json");

function read() {
  try {
    return JSON.parse(fs.readFileSync(filePath(), "utf-8"));
  } catch {
    return { documents: [] };
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    fs.writeFileSync(filePath(), JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
