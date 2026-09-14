/**
 * TEK SEFERLİK: 8 DC CCS2 ürününün BAYAT `meta*` alanlarını veri katmanından SİLER.
 *
 * 🔴 NEDEN (kayıtlı tuzak, `npm run check:seo` yakaladı):
 *    `applyProductSeo` → `pick(veri, kod)`: veri katmanındaki (R2 / repo yedeği)
 *    `meta*` değeri DOLUYSA `app/lib/productSeo.ts` haritasını **EZER**.
 *    Bu ürünlerin R2 kayıtlarında eski "…Soketi…" metinleri duruyordu →
 *    2026-09-14'te koda yazılan yeni "…Kablosu…" metinleri CANLIYA HİÇ ÇIKMAZDI
 *    (bekçi 32 sorun bildirdi: canlı ≠ kod).
 *
 * ⚠️ `""` YAZILMAZ, anahtar **`delete`** edilir. Boş string overlay'de TR'nin
 *    değerini ezip alanı tamamen yok eder (daha önce 5 dilde metaTitle'ı
 *    silmişti — kayıtlı ders).
 *
 * ⚠️ Tüm kollar temizlenir (TR tabanı + `_translations.*` + productsEn),
 *    yoksa yabancı dil sayfası hâlâ bayat metni servis eder.
 *
 * ÇALIŞTIRMA (proje kökünden):
 *   vercel env pull .env.sentinel --environment=production --yes
 *   node scripts/dc-meta-temizle.cjs          # KURU ÇALIŞMA
 *   node scripts/dc-meta-temizle.cjs --yaz
 *   rm -f .env.sentinel
 */

const fs = require("fs");
const path = require("path");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const envYol = path.join(process.cwd(), ".env.sentinel");
if (fs.existsSync(envYol)) {
  for (const satir of fs.readFileSync(envYol, "utf-8").split(/\r?\n/)) {
    const m = satir.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const KIMLIK = "dc-sarj-soketi-ccs2-bir-ucu-acik";
const ALANLAR = ["metaTitle", "metaDescription", "focusKeyword", "keywords"];
const BINLER = ["products", "productsExtra", "productsEn", "productsEnExtra"];
const TR_BEKLENEN = 8;
const YAZ = process.argv.includes("--yaz");

function r2() {
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error("R2 env eksik. Once: vercel env pull .env.sentinel --environment=production --yes");
    process.exit(1);
  }
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
}

/** Ağaçta id'si DC ürününe ait olan HER düğümü bulur (şekilden bağımsız). */
function bul(dugum, yol, cikti) {
  if (Array.isArray(dugum)) {
    dugum.forEach((c, i) => bul(c, yol + "[" + i + "]", cikti));
  } else if (dugum && typeof dugum === "object") {
    if (typeof dugum.id === "string" && dugum.id.includes(KIMLIK)) cikti.push({ yol, dugum });
    for (const k of Object.keys(dugum)) bul(dugum[k], yol + "." + k, cikti);
  }
  return cikti;
}

function temizle(dugumler) {
  let n = 0;
  for (const { dugum } of dugumler) {
    for (const a of ALANLAR) {
      if (a in dugum) { delete dugum[a]; n++; }
    }
  }
  return n;
}

(async () => {
  let toplam = 0;

  // ── 1) Repo yedekleri (R2 okunamazsa devreye girer) ───────────────────
  for (const ad of fs.readdirSync("data")) {
    if (!(ad === "products.json" || (ad.startsWith("products-") && ad.endsWith(".json")))) continue;
    const yol = path.join("data", ad);
    const veri = JSON.parse(fs.readFileSync(yol, "utf-8"));
    const bulunan = bul(veri, "kok", []);
    const varOlan = bulunan.filter((b) => ALANLAR.some((a) => a in b.dugum)).length;
    if (!varOlan) { console.log("atlandi  " + yol + " (meta yok)"); continue; }
    if (!YAZ) { console.log("kuru     " + yol + "  " + varOlan + " urun"); continue; }
    const n = temizle(bulunan);
    fs.writeFileSync(yol, JSON.stringify(veri, null, 2) + "\n", "utf-8");
    toplam += n;
    console.log("ok       " + yol + "  (" + n + " alan)");
  }

  // ── 2) R2 bin'leri ────────────────────────────────────────────────────
  const client = r2();
  for (const BIN of BINLER) {
    const key = `bins/${BIN}.json`;
    const res = await client.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
    const veri = JSON.parse(await res.Body.transformToString());
    fs.writeFileSync(path.join("scratchpad", `_${BIN}.metabak.json`), JSON.stringify(veri), "utf-8");

    const bulunan = bul(veri, "kok", []);
    const tr = bulunan.filter((b) => !b.yol.includes("_translations"));
    const varOlan = bulunan.filter((b) => ALANLAR.some((a) => a in b.dugum)).length;
    console.log(`\n→ ${key}  urun:${bulunan.length} (TR ${tr.length})  meta tasiyan:${varOlan}`);

    if (bulunan.length === 0) { console.log("  bu shard'da DC urunu yok → atlandi."); continue; }
    if (tr.length !== TR_BEKLENEN) {
      console.error(`  ✖ TR kolunda ${TR_BEKLENEN} bekleniyordu, ${tr.length} bulundu → IPTAL.`);
      process.exit(1);
    }
    if (varOlan === 0) { console.log("  meta alani yok → atlandi."); continue; }
    if (!YAZ) { console.log("  ── KURU CALISMA (yazilmadi) ──"); continue; }

    const n = temizle(bulunan);
    const govde = JSON.stringify(veri);
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET, Key: key, Body: govde, ContentType: "application/json",
    }));
    toplam += n;
    console.log(`  ✓ YAZILDI (${govde.length} bayt, ${n} alan silindi).`);
  }

  console.log("");
  if (YAZ) {
    console.log(`✓ TOPLAM ${toplam} alan silindi — tek kaynak artik app/lib/productSeo.ts.`);
    console.log("  ⚠️ SIRADA: lib/store.ts cache surum segmentini bump + deploy + npm run check:seo");
    console.log("  ⚠️ .env.sentinel SIL: rm -f .env.sentinel");
  } else {
    console.log("(kuru calisma bitti — gercekten yazmak icin --yaz)");
  }
})().catch((e) => { console.error("HATA:", e.message); process.exit(1); });
