import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

function getBlobKey(lang: string) {
  return lang === "en" ? "data/content-en.json" : "data/content.json";
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const BLOB_KEY = getBlobKey(lang);
  const fallbackPath = path.join(process.cwd(), "data", lang === "en" ? "content-en.json" : "content.json");
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const blob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (blob) {
      const res = await fetch(blob.url, { cache: "no-store" });
      return NextResponse.json(await res.json());
    }
  } catch {}
  try {
    const content = JSON.parse(readFileSync(fallbackPath, "utf-8"));
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const BLOB_KEY = getBlobKey(lang);
  try {
    const body = await req.json();
    await put(BLOB_KEY, JSON.stringify(body, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("content save error:", e);
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
