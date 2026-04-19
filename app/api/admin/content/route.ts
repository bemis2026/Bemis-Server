import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

function getBlobKey(lang: string) {
  return lang === "en" ? "data/content-en.json" : "data/content.json";
}

function getLocalPath(lang: string) {
  return path.join(process.cwd(), "data", lang === "en" ? "content-en.json" : "content.json");
}

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const BLOB_KEY = getBlobKey(lang);
  const fallbackPath = getLocalPath(lang);

  if (hasBlob) {
    try {
      const { blobs } = await list({ prefix: BLOB_KEY });
      const blob = blobs.find((b) => b.pathname === BLOB_KEY);
      if (blob) {
        const res = await fetch(blob.url, { cache: "no-store" });
        return NextResponse.json(await res.json());
      }
    } catch {}
  }

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
  const fallbackPath = getLocalPath(lang);
  try {
    const body = await req.json();
    const json = JSON.stringify(body, null, 2);

    if (hasBlob) {
      await put(BLOB_KEY, json, {
        access: "public",
        contentType: "application/json",
        allowOverwrite: true,
      });
    } else {
      // Local dev fallback: write to filesystem
      writeFileSync(fallbackPath, json, "utf-8");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("content save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
