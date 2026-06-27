import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../lib/jsonbin";

// ⚠️ GEÇİCİ — tek seferlik rakip-marka temizliği (Aksesuarlar SSS). Vercel runtime'da
// çalışır (Blob okuma orada izinli; lokalden 403). Çalıştırıldıktan sonra bu route SİLİNİR.
// Gizli anahtar zorunlu; anahtarsız 404. Yalnız "ABB, Schneider, Wallbox, Easee" geçen
// FAQ string'lerini jenerik metinle değiştirir, başka hiçbir veriyi EZMEZ.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "bf_9k3mZ7qX_brandfix_2026";
const BRAND = "ABB, Schneider, Wallbox, Easee";

const TR_NEW =
  "Konnektör standartları (Type 2, CCS2, RFID Mifare) evrensel olduğundan Bemis aksesuarlarımız Type 2 / CCS2 standart konnektörlü tüm elektrikli araçlar ve şarj istasyonlarıyla uyumludur. Marka-spesifik özellikler (firmware kilidi, tescilli kart sistemi) varsa dökümanda belirtilir.";
const EN_NEW =
  "Since connector standards (Type 2, CCS2, RFID Mifare) are universal, our Bemis accessories are compatible with all electric vehicles and charging stations that use standard Type 2 / CCS2 connectors. Brand-specific features (firmware lock, registered card system) are specified in the document, if any.";

function fixBin(bin: unknown): { fixed: unknown; tr: number; en: number; unknown: number } {
  let tr = 0, en = 0, unknown = 0;
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") {
      if (v.includes(BRAND)) {
        if (/compatible|connector standards/i.test(v)) { en++; return EN_NEW; }
        if (/uyumludur|Konnektör|markalarla/i.test(v)) { tr++; return TR_NEW; }
        unknown++; return v; // sınıflandırılamadı → DOKUNMA (güvenlik)
      }
      return v;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const o: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) o[k] = walk(val);
      return o;
    }
    return v;
  };
  return { fixed: walk(bin), tr, en, unknown };
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("k") !== KEY) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  // Cache invalidation modu — Blob get() bozuksa (403) bayat-cache markalı içerik
  // serve ediliyor. store:content tag'ini düşürünce sonraki okuma cache-miss olur →
  // readBin 403 fırlatır → çağıranlar markasız data/content.json'a düşer. Blob'a YAZMAZ.
  if (req.nextUrl.searchParams.get("revalidate") === "1") {
    revalidateTag("store:content");
    for (const p of ["/", "/api/content", "/blog", "/products", "/products/accessories", "/products/wallbox", "/export", "/sozluk"]) {
      try { revalidatePath(p); } catch {}
    }
    return NextResponse.json({ ok: true, revalidated: true });
  }
  const dryRun = req.nextUrl.searchParams.get("dry") === "1";
  let bin: unknown;
  try {
    bin = await readBin("content", { fresh: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "read failed: " + (e as Error).message }, { status: 500 });
  }
  const { fixed, tr, en, unknown } = fixBin(bin);
  // Güvenlik: sınıflandırılamayan marka string'i varsa YAZMA.
  if (unknown > 0) {
    return NextResponse.json({ ok: false, tr, en, unknown, note: "unknown brand string — yazılmadı" }, { status: 409 });
  }
  if (dryRun) return NextResponse.json({ ok: true, dryRun: true, wouldReplace: { tr, en } });
  if (tr === 0 && en === 0) return NextResponse.json({ ok: true, replaced: 0, note: "marka bulunamadı (zaten temiz?)" });
  await writeBin("content", fixed);
  return NextResponse.json({ ok: true, replaced: { tr, en } });
}
