import { NextResponse } from "next/server";

// Daily-cached EUR/TRY rate from TCMB (Türkiye Cumhuriyet Merkez Bankası).
// We refresh the cache once every 6 hours — TCMB only updates the feed
// once a day (~15:30 TR time) so a tighter window doesn't buy us
// anything, and a looser window risks serving Friday's rate all weekend
// when the FX market is closed.
export const revalidate = 21600; // 6h

// TCMB publishes the XML at /kurlar/today.xml. We fall back to /kurlar
// (which is a folder listing) by date if today is missing — relevant
// on weekends + holidays. For now we stick to today and ship a
// fallback rate via the CurrencyContext.

// ⚠️⚠️ SABİT YEDEK KUR KALDIRILDI (2026-08-04, kullanıcı kararı).
// Eskiden kur çekilemeyince 37 dönüyordu; ölçülen gerçek kur 54,69'du → bir TCMB
// kesintisinde TÜM ₺ fiyatlar %32 DÜŞÜK yayınlanıyordu (ticari taahhüt + Merchant
// "fiyat uyuşmazlığı" riski). Artık kur yoksa `tryPerEur: null` döner ve ÇAĞIRAN
// TARAF ₺ fiyatı HİÇ GÖSTERMEZ. Aynı ilke `app/lib/cityShowcase.ts`'te zaten vardı.
// 📌 Yanlış fiyat, fiyatsızlıktan kötüdür.
const YOK = { eurPerTry: null, tryPerEur: null, date: null as string | null, source: "unavailable" as const };
// ⚠️ Başarısızlık ÖNBELLEĞE ALINMAZ: route 6 saat revalidate'li olduğu için hatayı
// 200 ile döndürmek anlık bir TCMB kesintisini 6 saat boyunca kalıcı kılardı.
const yokYanit = () =>
  NextResponse.json(YOK, { status: 503, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  try {
    const res = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      next: { revalidate: 21600 },
    });
    if (!res.ok) return yokYanit();
    const xml = await res.text();

    // EUR ForexBuying lives inside <Currency CurrencyCode="EUR"><ForexBuying>...
    // Tiny regex parse — adding xml2js for one feed isn't worth it.
    const block = xml.match(/<Currency\s+[^>]*CurrencyCode="EUR"[^>]*>([\s\S]*?)<\/Currency>/);
    const eurTryRate = block?.[1].match(/<ForexBuying>([\d.]+)<\/ForexBuying>/)?.[1];
    const dateMatch = xml.match(/<Tarih_Date[^>]*Tarih="([^"]+)"/);

    if (!eurTryRate) return yokYanit();
    const tryPerEur = Number(eurTryRate);
    if (!isFinite(tryPerEur) || tryPerEur <= 0) return yokYanit();

    return NextResponse.json({
      eurPerTry: Number((1 / tryPerEur).toFixed(6)),
      tryPerEur: Number(tryPerEur.toFixed(4)),
      date: dateMatch?.[1] ?? null,
      source: "tcmb",
    });
  } catch {
    return yokYanit();
  }
}
