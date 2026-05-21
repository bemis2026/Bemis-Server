import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../lib/jsonbin";

const fallbackPath = path.join(process.cwd(), "data", "dealers.json");

// 1 saat — admin save zaten /api/dealers'ı `revalidatePath` ile anında
// temizliyor; otomatik döngü sadece bot trafiği + edge cache miss fallback.
// Önceden 60s idi → Vercel free ISR write limit'i (200K/ay) hızlıca dolup
// projenin pause olmasına yol açıyordu.
export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await readBin("dealers"));
  } catch {}
  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({});
  }
}
