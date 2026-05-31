import { NextRequest, NextResponse } from "next/server";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

const fallbackPath = path.join(process.cwd(), "data", "changelog.json");

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const data = await readBin("changelog", { fresh: true });
    return NextResponse.json(data);
  } catch {}
  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    await writeBin("changelog", body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("changelog save error:", e);
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
