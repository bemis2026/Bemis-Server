// scripts/sentry-health.cjs
//
// Local-only Sentry health report. Pulls recent issues + counts from
// the Sentry API and prints a human-readable summary. Used by the
// production-health agent (.claude/agents/production-health.md) and
// also runnable by hand:
//
//   node scripts/sentry-health.cjs [period]
//
//   period — "24h" | "14d" (default: "14d")
//            Sentry's project-issues endpoint only accepts these two
//            values; longer windows would need the Discover query API
//            which costs more quota.
//
// Auth lives in .env.local (gitignored):
//   SENTRY_AUTH_TOKEN — user-auth token with event:read, issue:read,
//                       org:read, project:read
//   SENTRY_ORG        — org slug (e.g. bemis-teknik-elektrik-as)
//   SENTRY_PROJECT    — project slug (e.g. javascript-nextjs)
//   SENTRY_REGION     — "de" | "us" | "" — Sentry self-host region
//
// Read-only — never writes to Sentry.

const fs = require("fs");
const path = require("path");

// Tiny .env.local loader so the script doesn't depend on dotenv.
(function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const txt = fs.readFileSync(envPath, "utf-8");
  for (const raw of txt.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key]) continue; // don't override shell vars
    process.env[key] = line.slice(eq + 1).trim();
  }
})();

const token   = process.env.SENTRY_AUTH_TOKEN;
const org     = process.env.SENTRY_ORG ?? "";
const project = process.env.SENTRY_PROJECT ?? "";
const region  = process.env.SENTRY_REGION ?? "de";

if (!token || !org || !project) {
  console.error("Missing SENTRY_AUTH_TOKEN / SENTRY_ORG / SENTRY_PROJECT in .env.local");
  process.exit(1);
}

const VALID_PERIODS = new Set(["24h", "14d", ""]);
let period = process.argv[2] ?? "14d";
if (!VALID_PERIODS.has(period)) {
  console.warn(`Geçersiz dönem "${period}" — "14d" kullanılıyor. (Sentry sadece 24h | 14d kabul ediyor.)`);
  period = "14d";
}
const apiBase = region ? `https://${region}.sentry.io/api/0` : "https://sentry.io/api/0";

async function api(pathname) {
  const res = await fetch(`${apiBase}${pathname}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Sentry API ${res.status} ${pathname}: ${await res.text()}`);
  }
  return res.json();
}

function relTime(iso) {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = 60_000, h = 60 * m, d = 24 * h;
  if (diff < m) return `${Math.floor(diff / 1000)} sn önce`;
  if (diff < h) return `${Math.floor(diff / m)} dk önce`;
  if (diff < d) return `${Math.floor(diff / h)} sa önce`;
  return `${Math.floor(diff / d)} gün önce`;
}

function severityFor(issue) {
  const pri = (issue.priority ?? "").toLowerCase();
  const userCount = Number(issue.userCount ?? 0);
  const count = Number(issue.count ?? 0);
  if (pri === "high" || userCount >= 10 || count >= 50) return { tag: "🔴 KRİTİK", weight: 3 };
  if (pri === "medium" || userCount >= 3 || count >= 10) return { tag: "🟡 ORTA", weight: 2 };
  return { tag: "🟢 DÜŞÜK", weight: 1 };
}

(async () => {
  console.log(`\n══════════════════════════════════════════════════════════════════════`);
  console.log(`  Bemis Production Health — Sentry rapor`);
  console.log(`  Dönem: ${period}   ·   Proje: ${org}/${project}`);
  console.log(`══════════════════════════════════════════════════════════════════════\n`);

  // 1. Project meta — current event volume / users affected.
  const proj = await api(`/projects/${org}/${project}/`).catch(() => null);
  if (proj) {
    console.log(`📦 Proje      : ${proj.name}  (platform: ${proj.platform})`);
    console.log(`👤 Üye sayısı : ${proj.teams?.length ?? 0} takım\n`);
  }

  // 2. Issues newest-first.
  const issues = await api(`/projects/${org}/${project}/issues/?statsPeriod=${period}&limit=25&sort=date`);
  console.log(`📋 ${issues.length} açık hata (son ${period})\n`);

  if (issues.length === 0) {
    console.log(`✓ Bu dönemde production'da hiç hata yakalanmadı. Temiz.\n`);
    return;
  }

  // Sort: by severity then by recency.
  issues.sort((a, b) => {
    const sa = severityFor(a).weight;
    const sb = severityFor(b).weight;
    if (sa !== sb) return sb - sa;
    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
  });

  const groups = { 3: [], 2: [], 1: [] };
  for (const iss of issues) groups[severityFor(iss).weight].push(iss);

  for (const w of [3, 2, 1]) {
    if (groups[w].length === 0) continue;
    const label = w === 3 ? "🔴 KRİTİK" : w === 2 ? "🟡 ORTA" : "🟢 DÜŞÜK";
    console.log(`──── ${label}  (${groups[w].length} hata) ──────────────────────────────`);
    for (const iss of groups[w]) {
      const url = `https://${org}.sentry.io/issues/${iss.id}/`;
      const where = (iss.metadata?.filename ?? "").replace("app:///", "");
      console.log(`\n  ${iss.shortId}  ${iss.title}`);
      console.log(`    count: ${iss.count}  ·  users: ${iss.userCount}  ·  son: ${relTime(iss.lastSeen)}  ·  ilk: ${relTime(iss.firstSeen)}`);
      if (where) console.log(`    yer  : ${where}${iss.metadata?.function ? ` → ${iss.metadata.function}()` : ""}`);
      if (iss.culprit) console.log(`    sayfa: ${iss.culprit}`);
      console.log(`    link : ${url}`);
    }
    console.log();
  }

  // 3. Summary footer
  const total = issues.reduce((s, i) => s + Number(i.count ?? 0), 0);
  const usersAffected = new Set();
  for (const i of issues) {
    if (Number(i.userCount ?? 0) > 0) usersAffected.add(i.id);
  }
  console.log(`──────────────────────────────────────────────────────────────────────`);
  console.log(`  Toplam event: ${total}   ·   Hata türü: ${issues.length}   ·   Yeni: ${issues.filter(i => i.substatus === "new").length}`);
  console.log(`──────────────────────────────────────────────────────────────────────\n`);
})().catch(e => {
  console.error("Hata:", e.message);
  process.exit(1);
});
