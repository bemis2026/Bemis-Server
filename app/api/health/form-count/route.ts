import { NextRequest, NextResponse } from "next/server";
import { readBin } from "../../../../lib/store";

/**
 * İletişim formu SAYAÇ ucu — günlük izleme robotu (scripts/daily-monitors.cjs) için.
 *
 * ⚠️ NEDEN VAR (2026-08-22): robot 24 saatlik form sayısını `@vercel/blob`'dan
 * okuyordu. Mesajlar 2026-07-02'de R2'ye taşındı, 2026-08-19'da da AES-256-GCM
 * ile şifrelendi → robot ölü bir kaynağa bakıyor, her gün "0 mesaj" yazıyor ve
 * gerçek bir spam dalgasını ASLA yakalayamıyordu ("cron success" ≠ "cron çalışıyor").
 *
 * ⚠️ NEDEN BU TASARIM: alternatif, R2 kimliklerini + şifre anahtarını GitHub
 * Actions secret'larına kopyalamaktı. Bu uç sayesinde robotun eline YALNIZ bir
 * SAYI geçiyor — ad, e-posta, telefon, mesaj metni hiç dışarı çıkmıyor.
 * Sızsa bile ele geçen tek şey "bugün kaç form geldi" bilgisidir.
 *
 * ⚠️ `MONITOR_KEY` env'i tanımlı DEĞİLSE uç kapalıdır (fail-closed) — anahtarsız
 * bir kurulumda yanlışlıkla herkese açık kalmasın.
 */
type MesajOgesi = { receivedAt?: string; topicLabel?: string; topic?: string };
type MesajlarBin = { items?: MesajOgesi[] };

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const beklenen = process.env.MONITOR_KEY;
  if (!beklenen) {
    return NextResponse.json({ error: "İzleme ucu yapılandırılmamış" }, { status: 503 });
  }
  if (req.headers.get("x-monitor-key") !== beklenen) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let items: MesajOgesi[] = [];
  let arsivVar = true;
  try {
    // ⚠️ `fresh: true` ŞART — sayaç bayat cache'ten okunursa ani artışı kaçırır.
    const bin = (await readBin("messages", { fresh: true })) as MesajlarBin;
    items = Array.isArray(bin?.items) ? bin.items : [];
  } catch (e) {
    // Arşiv henüz hiç yazılmamışsa (NoSuchKey) bu normaldir: 0 mesaj.
    // Başka bir hata ise (ör. şifre çözülemedi) robotun bunu BİLMESİ gerekir.
    const yok = (e as { name?: string })?.name === "NoSuchKey";
    if (!yok) {
      return NextResponse.json(
        { error: "Arşiv okunamadı", detay: (e as Error).message.slice(0, 120) },
        { status: 500 },
      );
    }
    arsivVar = false;
  }

  const esik = Date.now() - 24 * 60 * 60 * 1000;
  const son24 = items.filter((m) => {
    const t = Date.parse(m.receivedAt ?? "");
    return Number.isFinite(t) && t >= esik;
  });

  // Yalnız konu ETİKETLERİ döner — ad/e-posta/telefon/mesaj metni ASLA çıkmaz.
  const konular: Record<string, number> = {};
  for (const m of son24) {
    const k = m.topicLabel || m.topic || "—";
    konular[k] = (konular[k] ?? 0) + 1;
  }

  return NextResponse.json(
    { son24Saat: son24.length, toplam: items.length, konular, arsivVar },
    { headers: { "Cache-Control": "no-store" } },
  );
}
