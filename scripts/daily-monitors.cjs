#!/usr/bin/env node
/**
 * Daily monitor sweep — three quick checks, each gated by a hard
 * threshold so we only ping the operator when something actually
 * needs attention.
 *
 *   form-spam : new contact-form submissions in the last 24h > 10
 *   bin-size  : any JSONBin record > 80KB (free-tier 100KB hard cap)
 *   ssl-expiry: production cert < 14 days from expiry
 *
 * Each surfaced finding is piped through notify-finding.cjs so the
 * notification surface stays uniform (GitHub Issue + email).
 *
 * Env required:
 *   JSONBIN_MASTER_KEY  — read bin sizes + messages bin
 *   GH_TOKEN + GH_REPO  — issue creation
 *   RESEND_API_KEY + NOTIFY_EMAIL  — email pipe (notify-finding)
 *
 * Idempotency: notify-finding.cjs already de-dupes by issue title,
 * so an unresolved condition re-comments on the same issue daily
 * instead of opening a new one.
 */

const { spawnSync } = require("child_process");
const tls = require("tls");

const MASTER = process.env.JSONBIN_MASTER_KEY;
const BASE = "https://api.jsonbin.io/v3/b";

// Bin map mirrored from lib/jsonbin.ts — kept in sync manually.
const BIN_IDS = {
  b2b:             "69e5093d36566621a8cd7509",
  content:         "69e5093daaba88219716e044",
  dealers:         "69e5093e36566621a8cd750f",
  products:        "69e5093e856a6821894eaee8",
  productsExtra:   "69fbcdf1c0954111d8e90670",
  productsEn:      "69fbc8a0c0954111d8e8ed31",
  productsEnExtra: "69fbcdf2250b1311c313f456",
  documents:       "69e5093f856a6821894eaeec",
  messages:        "69fb7b59adc21f119a61e79f",
  changelog:       "69fb7b5eadc21f119a61e7c8",
};

const FORM_SPAM_THRESHOLD = 10;     // mesaj / 24h
const BIN_SIZE_THRESHOLD  = 80_000; // 80KB → tavanına 20KB kala uyar
const SSL_DAYS_THRESHOLD  = 14;

function notify(title, severity, body, source) {
  const payload = JSON.stringify({ title, severity, body, source });
  const r = spawnSync("node", ["scripts/notify-finding.cjs"], {
    input: payload,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (r.status !== 0) console.error("[monitors] notify failed");
}

async function readBin(name) {
  if (!MASTER) throw new Error("JSONBIN_MASTER_KEY missing");
  const r = await fetch(`${BASE}/${BIN_IDS[name]}/latest`, {
    headers: { "X-Master-Key": MASTER },
  });
  if (!r.ok) throw new Error(`bin ${name}: HTTP ${r.status}`);
  return r.json();
}

// ── form spam ──
async function checkFormSpam() {
  try {
    const j = await readBin("messages");
    const items = j.record?.items ?? [];
    const since = Date.now() - 24 * 60 * 60 * 1000;
    const recent = items.filter((i) => {
      const t = Date.parse(i.receivedAt ?? "");
      return Number.isFinite(t) && t >= since;
    });
    console.log(`form spam: ${recent.length} mesaj / 24h`);
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
          `Son 5 mesajın konuları:`,
          ...recent.slice(0, 5).map((m) => `  · ${m.topicLabel || m.topic || "—"} (${m.name || "anonim"})`),
        ].join("\n"),
        "form-spam"
      );
    }
  } catch (e) {
    console.error("form spam check failed:", e.message);
  }
}

// ── bin size ──
async function checkBinSize() {
  try {
    const offenders = [];
    for (const name of Object.keys(BIN_IDS)) {
      try {
        const j = await readBin(name);
        const bytes = Buffer.byteLength(JSON.stringify(j.record ?? {}), "utf8");
        if (bytes > BIN_SIZE_THRESHOLD) offenders.push({ name, bytes });
        console.log(`bin ${name.padEnd(18)} ${(bytes / 1024).toFixed(1)} KB`);
      } catch (e) {
        console.warn(`bin ${name}: ${e.message}`);
      }
    }
    if (offenders.length > 0) {
      notify(
        `JSONBin tavan uyarısı — ${offenders.length} bin >80KB`,
        offenders.some((o) => o.bytes > 95_000) ? "critical" : "medium",
        [
          `Free tier 100KB hard limit. >80KB olan bin'leri shard'a bölmek gerek:`,
          ``,
          ...offenders.map((o) => `  · ${o.name}: ${(o.bytes / 1024).toFixed(1)} KB`),
          ``,
          `Mevcut pattern: products↔productsExtra (charger-equipment overflow). Yeni shard eklerken lib/jsonbin.ts'deki BIN_IDS + app/api/products/route.ts merge mantığını güncelle.`,
        ].join("\n"),
        "bin-size"
      );
    }
  } catch (e) {
    console.error("bin size check failed:", e.message);
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
  await checkBinSize();
  console.log("");
  await checkSslExpiry();
})();
