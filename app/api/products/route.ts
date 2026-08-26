import { NextRequest, NextResponse } from "next/server";
import { getProductsForLang } from "../../lib/serverProductsLang";

// ⚠️ BİRLEŞTİRME MANTIĞI ARTIK BURADA DEĞİL: `app/lib/serverProductsLang.ts`.
// Sebep (2026-08-26): İngilizce sayfalar aynı kataloğu SUNUCUDA render edebilsin
// diye aynı mantığa server component'lerden de ihtiyaç var. Kopyalansaydı ikisi
// zamanla ayrışır, "API doğru / sayfa yanlış" sınıfı sessiz hata doğardı.
// Bu uç artık yalnız HTTP kabuğu.

// 6 saat — admin save revalidatePath ile ANINDA temizler; bu yalnız backstop.
// Uzun backstop = çok daha az ISR write (Vercel free 200K/ay limiti dolmasın).
export const revalidate = 21600;

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";
  const data = await getProductsForLang(lang);
  if (!data) return NextResponse.json({ error: "Ürünler yüklenemedi" }, { status: 500 });
  return NextResponse.json(data);
}
