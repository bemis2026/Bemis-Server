import { NextRequest, NextResponse } from "next/server";
import { getContentForLang } from "../../../lib/contentLang";

// İnce sarmalayıcı — tüm dil-birleştirme mantığı lib/contentLang.ts'te
// (tek kaynak; /en SSR sayfası da aynı fonksiyonu kullanır, Faz A 2026-07-18).
export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const merged = await getContentForLang(lang);
  if (!merged) return NextResponse.json({ error: "İçerik yüklenemedi" }, { status: 500 });
  return NextResponse.json(merged);
}
