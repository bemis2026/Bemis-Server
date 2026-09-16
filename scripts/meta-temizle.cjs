/**
 * Bir KATEGORİNİN bayat `meta*` alanlarını veri katmanından siler → o kategoride
 * tek SEO kaynağı `app/lib/productSeo.ts` olur.
 *
 * 🔴 NEDEN (kayıtlı tuzak, ÜÇÜNCÜ kez çıktı: dc-units → wallbox → portable):
 *    `applyProductSeo` → `pick(veri, kod)`. Veri katmanındaki (R2 / repo yedeği)
 *    `meta*` değeri DOLUYSA `productSeo.ts` haritasını **EZER**. Yani koda yazılan
 *    yeni başlık/açıklama CANLIYA HİÇ ÇIKMAZ ve bunu ancak `npm run check:seo`
 *    görür ("VERİ KATMANI KOD HARİTASINI EZİYOR").
 *
 * 📌 Bu betik `scripts/dc-meta-temizle.cjs` ve `scripts/wallbox-meta-temizle.cjs`
 *    tek-seferliklerinin GENEL hâlidir. Yeni bir kategorinin metasını koddan
 *    yönetmeye başlarken bunu çalıştır — üçüncü bir kopya yazma.
 *
 * ⚠️ `""` YAZILMAZ, anahtar **`delete`** edilir. Boş string overlay'de TR'nin
 *    değerini ezip alanı tamamen yok eder (kayıtlı ders).
 * ⚠️ TÜM kollar temizlenir (TR tabanı + `_translations.*` + productsEn shard'ları),
 *    yoksa yabancı dil sayfası hâlâ bayat metni servis eder.
 * ⚠️ Kategorinin ürün kimlikleri `data/products.json`'dan okunur; TR kolunda
 *    beklenen sayı tutmazsa İPTAL eder (yanlış ürüne dokunmasın).
 *
 * ÇALIŞTIRMA (proje kökünden):
 *   vercel env pull .env.sentinel --environment=production --yes
 *   node scripts/meta-temizle.cjs portable            # KURU ÇALIŞMA
 *   node scripts/meta-temizle.cjs portable --yaz
 *   rm -f .env.sentinel
 * SONRA: lib/store.ts cache sürüm segmentini bump + deploy + npm run check:seo
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

const ALANLAR = ["metaTitle", "metaDescription", "focusKeyword", "keywords"];
const BINLER = ["products", "productsExtra", "productsEn", "productsEnExtra"];

const KATEGORI = process.argv.find((a) => !a.startsWith("-") && !a.endsWith("node.exe") && !a.endsWith(".cjs"));
const YAZ = process.argv.includes("--yaz");

if (!KATEGORI) {
  console.error("Kullanim: node scripts/meta-temizle.cjs <kategori-id> [--yaz]");
  process.exit(1);
}

// ── kategorinin ürün kimlikleri (repo yedeğinden — daima mevcut) ──────────
function kats(kok) {
  if (Array.isArray(kok)) return kok;
  if (kok && Array.isArray(kok.products)) return kok.products;
  if (kok && typeof kok === "object") {
    const sayisal = Object.keys(kok).filter((k) => /^\d+$/.test(k));
    if (sayisal.length) return sayisal.sort((a, b) => +a - +b).map((k) => kok[k]);
  }
  return null;
}

const repoKok = JSON.parse(fs.readFileSync(path.join("data", "products.json"), "utf-8"));
const kat = (kats(repoKok) || []).find((c) => c && c.id === KATEGORI);
if (!kat || !Array.isArray(kat.products)) {
  console.error("Kategori bulunamadi: " + KATEGORI);
  process.exit(1);
}
const KIMLIKLER = new Set(kat.products.map((p) => p.id));
const TR_BEKLENEN = KIMLIKLER.size;
console.log("kategori: " + KATEGORI + "  ·  urun: " + TR_BEKLENEN);

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

/** Ağaçta id'si listede olan HER düğümü bulur (şekilden bağımsız). */
function bul(dugum, yol, cikti) {
  if (Array.isArray(dugum)) {
    dugum.forEach((c, i) => bul(c, yol + "[" + i + "]", cikti));
  } else if (dugum && typeof dugum === "object") {
    if (typeof dugum.id === "string" && KIMLIKLER.has(dugum.id)) cikti.push({ yol, dugum });
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
    let veri;
    try {
      const res = await client.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
      veri = JSON.parse(await res.Body.transformToString());
    } catch (e) {
      console.log(`\n→ ${key}  okunamadi (${e.name}) → atlandi.`);
      continue;
    }
    fs.writeFileSync(path.join("scratchpad", `_${BIN}.${KATEGORI}.metabak.json`), JSON.stringify(veri), "utf-8");

    const bulunan = bul(veri, "kok", []);
    const tr = bulunan.filter((b) => !b.yol.includes("_translations"));
    const varOlan = bulunan.filter((b) => ALANLAR.some((a) => a in b.dugum)).length;
    console.log(`\n→ ${key}  urun:${bulunan.length} (TR ${tr.length})  meta tasiyan:${varOlan}`);

    if (bulunan.length === 0) { console.log(`  bu shard'da ${KATEGORI} urunu yok → atlandi.`); continue; }
    if (tr.length && tr.length !== TR_BEKLENEN) {
      console.error(`  ✖ TR kolunda ${TR_BEKLENEN} bekleniyordu, ${tr.length} bulundu → IPTAL.`);
      process.exit(1);
    }
    if (varOlan === 0) { console.log("  meta alani yok → atlandi."); continue; }

    if (!YAZ) {
      // Kuru çalışmada NE SİLİNECEĞİ görünsün — operatörün elle yazdığı bir
      // özelleştirmeyi silmediğimizden emin olmak için.
      const ornek = bulunan.find((b) => ALANLAR.some((a) => a in b.dugum));
      console.log("  ornek: " + ornek.dugum.id);
      for (const a of ALANLAR) {
        if (a in ornek.dugum) console.log("    " + a + ": " + String(ornek.dugum[a]).slice(0, 90));
      }
      console.log("  ── KURU CALISMA (yazilmadi) ──");
      continue;
    }

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
    console.log(`✓ TOPLAM ${toplam} alan silindi — ${KATEGORI} icin tek kaynak artik app/lib/productSeo.ts.`);
    console.log("  ⚠️ SIRADA: lib/store.ts cache surum segmentini bump + deploy + npm run check:seo");
    console.log("  ⚠️ .env.sentinel SIL: rm -f .env.sentinel");
  } else {
    console.log("(kuru calisma bitti — gercekten yazmak icin --yaz)");
  }
})().catch((e) => { console.error("HATA:", e.message); process.exit(1); });
