import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin, writeBin } from "../../../../lib/jsonbin";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const binName = lang === "en" ? "content-en" : "content";
  const fallbackPath = path.join(process.cwd(), "data", lang === "en" ? "content-en.json" : "content.json");

  try {
    const data = await readBin(binName, { fresh: true });
    return NextResponse.json(data);
  } catch {}

  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const binName = lang === "en" ? "content-en" : "content";
  try {
    const body = await req.json();
    await writeBin(binName, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("content save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
