import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { readFileSync } from "fs";
import path from "path";

const BLOB_KEY = "data/b2b.json";
const fallbackPath = path.join(process.cwd(), "data", "b2b.json");

export async function GET() {
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
