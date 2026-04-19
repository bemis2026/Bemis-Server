import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const BLOB_KEY = "data/b2b.json";
const fallbackPath = path.join(process.cwd(), "data", "b2b.json");
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

type Rec = Record<string, unknown>;

function mergeDeep(target: Rec, source: Rec): Rec {
  const result: Rec = { ...target };
  for (const key in source) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
      result[key] = mergeDeep(tv as Rec, sv as Rec);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  let localData: Rec = {};
  try { localData = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}

  if (hasBlob) {
    try {
      const { blobs } = await list({ prefix: BLOB_KEY });
      const blob = blobs.find(b => b.pathname === BLOB_KEY);
      if (blob) {
        const res = await fetch(blob.url, { cache: "no-store" });
        const blobData: Rec = await res.json();
        return NextResponse.json(mergeDeep(localData, blobData));
      }
    } catch {}
  }

  if (Object.keys(localData).length) return NextResponse.json(localData);
  return NextResponse.json({ hero: {}, solutions: [] });
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
      // Local dev fallback: write to filesystem
      writeFileSync(fallbackPath, json, "utf-8");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("b2b save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
