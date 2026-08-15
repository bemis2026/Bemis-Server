import { NextRequest, NextResponse } from "next/server";
import { readBin } from "../../../../lib/jsonbin";
import type { UrunDegisiklik } from "../../../../lib/productChangeLog";

/**
 * BAYİ DEĞİŞİKLİK BESLEMESİ — "hiçbir eksik kalmasın" ucu.
 *
 * GET /api/catalog/changes?since=2026-08-01&limit=500
 *   since : ISO tarih/zaman (opsiyonel). Bu andan SONRAKİ kayıtlar döner.
 *   limit : en fazla kayıt (varsayılan 1000, tavan 4000).
 *
 * Kayıtlar admin her kaydettiğinde YAZMA ANINDA üretilir
 * (bkz. lib/productChangeLog.ts) — sonradan üretilemez.
 *
 * ⚠️ GİZLİLİK: burada YALNIZ liste fiyatı var; o zaten `/api/products` ile
 *    herkese açık. BAYİYE ÖZEL İSKONTOLU FİYAT BURAYA ASLA KONMAZ —
 *    o kimlik doğrulamalı bir yüzeye (B2B portalı) aittir.
 */
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const since = url.searchParams.get("since");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 1000) || 1000, 4000);

  let entries: UrunDegisiklik[] = [];
  try {
    const kutu = (await readBin("productChanges")) as { entries?: UrunDegisiklik[] };
    if (Array.isArray(kutu?.entries)) entries = kutu.entries;
  } catch {
    // Kutu henüz hiç yazılmamışsa (ilk kurulum) boş liste döner — hata değil.
  }

  let sinir: number | null = null;
  if (since) {
    const t = Date.parse(since);
    // ⚠️ Geçersiz tarihi SESSİZCE yok sayma — bayi yanlış parametreyle
    //    "değişiklik yok" sanıp veriyi kaçırmasın.
    if (Number.isNaN(t)) {
      return NextResponse.json(
        { error: "since geçersiz. ISO tarih bekleniyor, ör. 2026-08-01 veya 2026-08-01T00:00:00Z" },
        { status: 400 },
      );
    }
    sinir = t;
  }

  const suzulmus = (sinir === null ? entries : entries.filter((e) => Date.parse(e.at) > sinir!)).slice(0, limit);

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      since: since ?? null,
      count: suzulmus.length,
      // Kayıt yoksa bunun "değişiklik olmadı" mı yoksa "günlük henüz boş" mu
      // olduğunu bayi ayırt edebilsin.
      logStartedAt: entries.length ? entries[entries.length - 1].at : null,
      entries: suzulmus,
    },
    { headers: { "Cache-Control": "public, max-age=120, s-maxage=300, stale-while-revalidate=3600" } },
  );
}
