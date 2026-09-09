import { NextResponse, type NextRequest } from "next/server";

// Instagram gönderisinin KENDİ kapak görselini aynı kökenden servis eden vekil.
//
// ⚠️ NEDEN VEKİL (doğrudan CDN adresi değil):
//  1) Instagram'ın kapak adresi imzalıdır ve SÜRESİ DOLAR (`_nc_ohc`, `oe=` parametreleri)
//     → veriye yazılan bir CDN adresi haftalar içinde kırık görsele döner.
//  2) Aynı köken = CSP/`remotePatterns` genişletmeye gerek yok, next/image optimize edebilir.
//     (Aynı desen dökümanlarda zaten kullanılıyor: app/api/documents/file)
//
// ⚠️ NEDEN GÖMME SAYFASINDAN KAZIMA DEĞİL: instagram.com/p/<kod>/embed/ artık tamamen
// istemcide çiziliyor — sunucuya dönen 631 KB'lık HTML'de tek bir CDN adresi bile YOK
// (ölçüldü 2026-09-09). Çalışan tek uç `/media/?size=l` → 302 → gerçek JPEG.
//
// ⚠️ SSRF: giden istek SABİT olarak www.instagram.com'a yapılır (kullanıcı adresi yalnız
// gönderi KODUNU verir) ve yönlendirme sonundaki host beyaz listeye karşı doğrulanır.
//
// ⚠️ HATA = 404: kapak alınamazsa kart markalı yer tutucuya döner (bozuk görsel basılmaz).
// Başarısızlık KISA süre önbelleklenir ki geçici bir kesinti bir hafta yapışıp kalmasın.

export const runtime = "nodejs";

const IG_RE = /instagram\.com\/(?:[A-Za-z0-9._]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;
const IZINLI_CDN = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function yok(sebep: string) {
  return new NextResponse(null, {
    status: 404,
    headers: { "cache-control": "public, max-age=60, s-maxage=300", "x-bemis-kapak": sebep },
  });
}

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u") ?? "";
  const m = IG_RE.exec(u);
  if (!m) return new NextResponse(null, { status: 400 });

  try {
    const res = await fetch(`https://www.instagram.com/p/${m[1]}/media/?size=l`, {
      headers: { "user-agent": UA, accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return yok(`ust-kaynak-${res.status}`);

    // Yönlendirme sonunda gerçekten Instagram/Meta CDN'inde miyiz?
    let host = "";
    try { host = new URL(res.url).hostname; } catch { return yok("adres-cozulemedi"); }
    if (!IZINLI_CDN.test(host)) return yok("beklenmeyen-host");

    const tip = res.headers.get("content-type") ?? "";
    if (!tip.startsWith("image/")) return yok("gorsel-degil");

    const govde = await res.arrayBuffer();
    if (govde.byteLength < 1024) return yok("bos-govde");

    return new NextResponse(govde, {
      headers: {
        "content-type": tip,
        // Uzun CDN önbelleği: Instagram'a ziyaretçi başına değil, haftada bir gidilir.
        "cache-control": "public, max-age=3600, s-maxage=604800, stale-while-revalidate=2592000",
        "x-bemis-kapak": "instagram",
      },
    });
  } catch {
    return yok("istek-basarisiz");
  }
}
