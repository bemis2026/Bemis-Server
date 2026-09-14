/**
 * TEK SEFERLİK: DC CCS2 ürününün GÖRÜNEN adına "Kablo" kelimesini ekler.
 *
 *   "DC Şarj Soketi CCS2 (Bir Ucu Açık)"
 *     → "DC Şarj Kablosu / Soketi CCS2 (Bir Ucu Açık)"
 *
 * NEDEN (2026-09-14, kullanıcı kararı): saha/servis firmaları ve istasyon
 * üreticileri Google'da "dc şarj kablosu", "ccs2 şarj kablosu" diye arıyor
 * (Google otomatik tamamlamadan ölçüldü — hacim verisi YOK, sorgular gerçek).
 * Bizim tüm adlandırmamız "soket" diyordu; aynı ürünü "DC Şarj Kablosu" diye
 * adlandıran rakip o sorgularda görünüyor. Ad artık her iki kelimeyi taşır.
 *
 * ⚠️ AD BİR KİMLİK ALANIDIR — bu betik TEK BAŞINA YETMEZ:
 *   1) ürün adı 6 dil haritasının ANAHTARI (productNamesEn.ts +
 *      productNamesLocale.ts ×5). Anahtarlar AYNI commit'te güncellenmezse
 *      yabancı dil sayfalarında ad TÜRKÇEYE düşer
 *      (serverProductsLang.ts: "eşlemesi olmayan ad AYNEN kalır").
 *   2) varyant gruplaması `name` üzerinden çalışır → 8 varyantın HEPSİ aynı
 *      anda değişmeli, yoksa ürün ikiye bölünür.
 *   3) `lib/store.ts` unstable_cache sürüm segmenti BUMP'LANMALI (doğrudan R2
 *      yazımı revalidateTag tetiklemez → 6 saat bayat kalır).
 *   4) SLUG DEĞİŞMEZ — URL'ler korunur (/products/charger-equipment/dc-sarj-soketi-...).
 *
 * ⚠️ `_translations.<dil>` kopyalarında da aynı TR ad duruyor. Birleştirmede
 *    ürün adı TR-kilitli olduğu için bunlar RENDER'a girmez; yine de bayat
 *    dize bırakmamak için hepsi güncellenir (zararsız, tutarlı).
 *
 * ÇALIŞTIRMA (proje kökünden):
 *   vercel env pull .env.sentinel --environment=production --yes
 *   node scripts/rename-dc-kablo-soket.cjs            # KURU ÇALIŞMA (yazmaz)
 *   node scripts/rename-dc-kablo-soket.cjs --yaz      # gerçekten yazar
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

const ESKI = "DC Şarj Soketi CCS2 (Bir Ucu Açık)";
const YENI = "DC Şarj Kablosu / Soketi CCS2 (Bir Ucu Açık)";
const BINLER = ["products", "productsExtra", "productsEn", "productsEnExtra"];
const TR_BEKLENEN = 8;                       // TR kolundaki varyant sayısı
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

async function oku(client, key) {
  const res = await client.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
  return JSON.parse(await res.Body.transformToString());
}

function bul(dugum, yol, cikti) {
  if (Array.isArray(dugum)) {
    dugum.forEach((c, i) => bul(c, yol + "[" + i + "]", cikti));
  } else if (dugum && typeof dugum === "object") {
    if (dugum.name === ESKI) cikti.push({ yol, dugum });
    for (const k of Object.keys(dugum)) bul(dugum[k], yol + "." + k, cikti);
  }
  return cikti;
}

(async () => {
  const client = r2();
  let toplamYazilan = 0;

  for (const BIN of BINLER) {
    const key = `bins/${BIN}.json`;
    console.log("\n→ R2: " + key);
    const veri = await oku(client, key);

    const yedek = path.join("scratchpad", `_${BIN}.yedek.json`);
    fs.writeFileSync(yedek, JSON.stringify(veri, null, 1), "utf-8");

    const bulunan = bul(veri, "kok", []);
    const trOlanlar = bulunan.filter((b) => !b.yol.includes("_translations"));
    const ceviriOlanlar = bulunan.length - trOlanlar.length;
    console.log(`  eslesen: ${bulunan.length}  (TR kolu ${trOlanlar.length} · _translations ${ceviriOlanlar})`);

    if (bulunan.length === 0) {
      console.log("  bu shard'da ESKI ad yok → atlandi.");
      continue;
    }
    if (trOlanlar.length !== TR_BEKLENEN) {
      console.error(`  ✖ TR kolunda ${TR_BEKLENEN} bekleniyordu, ${trOlanlar.length} bulundu → YAZMA IPTAL.`);
      process.exit(1);
    }
    for (const b of trOlanlar) {
      console.log(`    ${b.dugum.id || "?"}  (${b.dugum.subtitle || ""})`);
    }

    if (!YAZ) {
      console.log("  ── KURU CALISMA (yazilmadi) ──");
      console.log(`     eski: ${ESKI}`);
      console.log(`     yeni: ${YENI}`);
      continue;
    }

    bulunan.forEach((b) => { b.dugum.name = YENI; });
    const govde = JSON.stringify(veri);
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: govde,
      ContentType: "application/json",
    }));
    toplamYazilan += bulunan.length;
    console.log(`  ✓ YAZILDI (${govde.length} bayt, ${bulunan.length} ad).`);
  }

  if (YAZ) {
    console.log(`\n✓ TOPLAM ${toplamYazilan} ad guncellendi.`);
    console.log("  ⚠️ SIRADA: lib/store.ts cache surum segmenti bump + 6 dil haritasi anahtari.");
    console.log("  ⚠️ .env.sentinel SIL: rm -f .env.sentinel");
  } else {
    console.log("\n(kuru calisma bitti — gercekten yazmak icin --yaz)");
  }
})().catch((e) => { console.error("HATA:", e.message); process.exit(1); });
