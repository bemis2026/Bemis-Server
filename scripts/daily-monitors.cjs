#!/usr/bin/env node
/**
 * Daily monitor sweep — quick checks, each gated by a hard threshold so we
 * only ping the operator when something actually needs attention.
 *
 *   form-spam : new contact-form submissions in the last 24h > 10
 *   ssl-expiry: production cert < 14 days from expiry
 *
 * NOT: Eski "bin-size" kontrolü kaldırıldı — veri JSONBin'den Vercel Blob'a
 * taşındı (2026-06-01). Blob'da 100KB kayıt limiti YOK, dolayısıyla boyut
 * uyarısına gerek kalmadı.
 *
 * Each surfaced finding is piped through notify-finding.cjs so the
 * notification surface stays uniform (GitHub Issue + email).
 *
 * Env required:
 *   BLOB_READ_WRITE_TOKEN — read messages bin from Vercel Blob
 *   GH_TOKEN + GH_REPO    — issue creation
 *   RESEND_API_KEY + NOTIFY_EMAIL — email pipe (notify-finding)
 *
 * Idempotency: notify-finding.cjs already de-dupes by issue title.
 */

const { spawnSync } = require("child_process");
const tls = require("tls");
// ⚠️ 2026-08-22: Vercel Blob TERK EDİLDİ (2026-07-02'de R2'ye geçildi) ama bu betik
//    mesajları hâlâ oradan okuyordu → her gün "0 mesaj" yazıyor, gerçek bir spam
//    dalgasını ASLA yakalayamıyordu. Artık sayıyı sitenin korumalı sayaç ucundan alır.
//    Böylece R2 kimlikleri ve şifre anahtarı GitHub secret'larına kopyalanmak zorunda
//    kalmadı; robotun eline yalnız bir SAYI geçiyor (ad/e-posta/telefon çıkmıyor).
const SITE       = process.env.SITE_URL || "https://www.bemisevcharge.com.tr";
const MONITOR_KEY = process.env.MONITOR_KEY;

const FORM_SPAM_THRESHOLD = 10;     // mesaj / 24h
const SSL_DAYS_THRESHOLD  = 14;

function notify(title, severity, body, source) {
  const payload = JSON.stringify({ title, severity, body, source });
  const r = spawnSync("node", ["scripts/notify-finding.cjs"], {
    input: payload,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (r.status !== 0) console.error("[monitors] notify failed");
}

// Form sayacını oku. ⚠️ Uç 401/503 dönerse SESSİZ GEÇME — körlük tam da bu şekilde
//    oluşmuştu; hata fırlatılır ve aşağıda raporlanır.
async function formSayaci() {
  if (!MONITOR_KEY) throw new Error("MONITOR_KEY tanımlı değil");
  const r = await fetch(`${SITE}/api/health/form-count`, {
    headers: { "x-monitor-key": MONITOR_KEY },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`sayaç ucu HTTP ${r.status}`);
  return await r.json();
}
// ── form spam ──
async function checkFormSpam() {
  try {
    const sayac = await formSayaci();
    const recent = { length: sayac.son24Saat };
    console.log(`form spam: ${sayac.son24Saat} mesaj / 24h (arşiv toplam ${sayac.toplam})`);
    if (recent.length > FORM_SPAM_THRESHOLD) {
      notify(
        `İletişim formu — 24 saatte ${recent.length} mesaj (eşik ${FORM_SPAM_THRESHOLD})`,
        recent.length > FORM_SPAM_THRESHOLD * 3 ? "critical" : "medium",
        [
          `Son 24 saatte ${recent.length} form gönderildi (normal eşik: ${FORM_SPAM_THRESHOLD}).`,
          ``,
          `Spam olabilir — admin → Mesajlar üzerinden gözden geçir.`,
          `Yoğun bir kampanya/PR çıktığı bir gün ise yok say.`,
          ``,
          `Konu dağılımı:`,
          ...Object.entries(sayac.konular || {}).map(([k, v]) => `  · ${k}: ${v}`),
        ].join("\n"),
        "form-spam"
      );
    }
  } catch (e) {
    // ⚠️ Eskiden burada yalnız console.error vardı → kontrol yıllarca kör kalabilirdi.
    //    Artık okunamama DA bildirilir; sessiz başarısızlık yok.
    console.error("form spam check failed:", e.message);
    notify(
      "İzleme: form sayacı okunamadı",
      "medium",
      [`Günlük robot form sayısını alamadı: ${e.message}`, ``,
       `Kontrol: MONITOR_KEY hem Vercel env'inde hem GitHub secret'larında tanımlı mı?`,
       `Uç: ${SITE}/api/health/form-count`].join(String.fromCharCode(10)),
      "form-count-unreachable"
    );
  }
}

// ── SSL expiry ──
function checkSsl(host) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert?.valid_to) return resolve({ ok: false });
      const expires = new Date(cert.valid_to);
      const days = Math.round((expires.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      resolve({ ok: true, days, expires });
    });
    socket.on("error", () => resolve({ ok: false }));
    socket.setTimeout(8000, () => { socket.destroy(); resolve({ ok: false }); });
  });
}

async function checkSslExpiry() {
  const hosts = ["www.bemisevcharge.com.tr", "bemisevcharge.com.tr", "www.bemisevcharge.com", "bemisevcharge.com"];
  const results = [];
  for (const h of hosts) {
    const r = await checkSsl(h);
    results.push({ host: h, ...r });
    console.log(`ssl ${h.padEnd(28)} ${r.ok ? r.days + " gün" : "—"}`);
  }
  const expiring = results.filter((r) => r.ok && r.days < SSL_DAYS_THRESHOLD);
  if (expiring.length > 0) {
    notify(
      `SSL sertifikası uyarısı — ${expiring.length} domain <14 gün`,
      expiring.some((r) => r.days < 5) ? "critical" : "medium",
      [
        `Let's Encrypt 90 günlük — Vercel otomatik yeniliyor. Yenileme başarısız olursa erken uyarı:`,
        ``,
        ...expiring.map((r) => `  · ${r.host}: ${r.days} gün (${r.expires?.toISOString()?.slice(0, 10)})`),
        ``,
        `Vercel → Domains → her domain için "Refresh" tetikle. Hala yenilenmiyorsa DNS sorunu var.`,
      ].join("\n"),
      "ssl-expiry"
    );
  }
}

(async () => {
  console.log(`=== Daily monitors — ${new Date().toISOString()} ===\n`);
  await checkFormSpam();
  console.log("");
  await checkSslExpiry();
})();
