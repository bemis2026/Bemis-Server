import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { readFileSync } from "fs";
import path from "path";

const BLOB_KEY = "data/b2b.json";
const fallbackPath = path.join(process.cwd(), "data", "b2b.json");

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

export async function GET() {
  let localData: Rec = {};
  try { localData = JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}

  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const blob = blobs.find(b => b.pathname === BLOB_KEY);
    if (blob) {
      const res = await fetch(blob.url, { cache: "no-store" });
      const blobData: Rec = await res.json();
      return NextResponse.json(mergeDeep(localData, blobData));
    }
  } catch {}

  if (Object.keys(localData).length) return NextResponse.json(localData);
  return NextResponse.json({ hero: {}, solutions: [] });
}
