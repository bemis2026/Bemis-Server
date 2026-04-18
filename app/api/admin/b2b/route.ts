import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const BLOB_KEY = "data/b2b.json";
const fallbackPath = path.join(process.cwd(), "data", "b2b.json");

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const blob = blobs.find(b => b.pathname === BLOB_KEY);
    if (blob) {
      const res = await fetch(blob.url, { cache: "no-store" });
      return NextResponse.json(await res.json());
    }
  } catch {}
  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({ hero: {}, solutions: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    await put(BLOB_KEY, JSON.stringify(body, null, 2), {
      access: "public", contentType: "application/json", allowOverwrite: true,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("b2b save error:", e);
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
