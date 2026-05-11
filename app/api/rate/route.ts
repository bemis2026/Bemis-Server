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

const DEFAULT = { eurPerTry: 0.027, tryPerEur: 37, date: null as string | null, source: "fallback" as const };

export async function GET() {
  try {
    const res = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      next: { revalidate: 21600 },
    });
    if (!res.ok) return NextResponse.json(DEFAULT);
    const xml = await res.text();

    // EUR ForexBuying lives inside <Currency CurrencyCode="EUR"><ForexBuying>...
    // Tiny regex parse — adding xml2js for one feed isn't worth it.
    const block = xml.match(/<Currency\s+[^>]*CurrencyCode="EUR"[^>]*>([\s\S]*?)<\/Currency>/);
    const eurTryRate = block?.[1].match(/<ForexBuying>([\d.]+)<\/ForexBuying>/)?.[1];
    const dateMatch = xml.match(/<Tarih_Date[^>]*Tarih="([^"]+)"/);

    if (!eurTryRate) return NextResponse.json(DEFAULT);
    const tryPerEur = Number(eurTryRate);
    if (!isFinite(tryPerEur) || tryPerEur <= 0) return NextResponse.json(DEFAULT);

    return NextResponse.json({
      eurPerTry: Number((1 / tryPerEur).toFixed(6)),
      tryPerEur: Number(tryPerEur.toFixed(4)),
      date: dateMatch?.[1] ?? null,
      source: "tcmb",
    });
  } catch {
    return NextResponse.json(DEFAULT);
  }
}
