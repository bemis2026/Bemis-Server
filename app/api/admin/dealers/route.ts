import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const dealersPath = path.join(process.cwd(), "data", "dealers.json");

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const data = JSON.parse(readFileSync(dealersPath, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    writeFileSync(dealersPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
