import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const BLOB_KEY = "data/dealers.json";
const fallbackPath = path.join(process.cwd(), "data", "dealers.json");
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
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
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    const json = JSON.stringify(body, null, 2);
    if (hasBlob) {
      await put(BLOB_KEY, json, {
        access: "public", contentType: "application/json", allowOverwrite: true,
      });
    } else {
      writeFileSync(fallbackPath, json, "utf-8");
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("dealers save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
