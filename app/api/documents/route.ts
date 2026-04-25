import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../lib/jsonbin";

const fallbackPath = path.join(process.cwd(), "data", "documents.json");

export const revalidate = 60;

type DocumentItem = { visible?: boolean };

function pickVisible(raw: unknown): DocumentItem[] {
  const list =
    Array.isArray(raw) ? raw :
    Array.isArray((raw as { documents?: unknown[] })?.documents) ? (raw as { documents: unknown[] }).documents :
    [];
  return (list as DocumentItem[]).filter(d => d?.visible !== false);
}

export async function GET() {
  try {
    const data = await readBin("documents");
    return NextResponse.json(pickVisible(data));
  } catch {}
  try {
    return NextResponse.json(pickVisible(JSON.parse(readFileSync(fallbackPath, "utf-8"))));
  } catch {
    return NextResponse.json([]);
  }
}
