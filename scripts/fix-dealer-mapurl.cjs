// Tek seferlik veri düzeltmesi: bayilerin `mapUrl` alanına yanlışlıkla
// girilmiş WEB SİTELERİNİ `website` alanına taşır, `mapUrl`'i temizler.
//
// Kural (güvenli/koruyucu):
//   - mapUrl gerçek bir HARİTA linkiyse (Google Maps vb.) DOKUNMA.
//   - mapUrl bir website ise:
//       * website boş VEYA bemis'in kendi alan adıysa (placeholder) →
//         website = (temizlenmiş) mapUrl, mapUrl = "" (TAŞINDI)
//       * website zaten gerçek/farklı bir site ise → mapUrl'e DOKUNMA,
//         sadece raporla (veri kaybı olmasın).
//
// Çalıştırma (BLOB_READ_WRITE_TOKEN zorunlu):
//   BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/fix-dealer-mapurl.cjs
//
// Blob'u (canlı) VE data/dealers.json (offline yedek) güncelleyip Blob'u
// yeniden okuyarak doğrular. Yazmadan önce ham veriyi yedekler.

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const NAME = "dealers";
const BLOB_PATH = `bins/${NAME}.json`;
const LOCAL_PATH = path.join(__dirname, "..", "data", "dealers.json");

// Gerçek harita servisleri — bileşendeki MAP_DOMAINS ile aynı.
const MAP_DOMAINS =
  /(?:google\.[a-z.]+\/maps|maps\.google|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|openstreetmap\.org|yandex\.[a-z.]+\/maps)/i;
// website "değiştirilebilir" sayılır: boş VEYA bemis'in kendi alan adı.
const OWN_DOMAIN = /(?:^|\/\/|\.)bemis\.com(?:\.tr)?(?:$|\/)/i;

const isMapUrl = (u) => !!u && MAP_DOMAINS.test(u);
const isEmpty = (s) => !s || !String(s).trim();
// Taşınan URL'den izleme/junk query + hash'i at, yolu koru.
const cleanUrl = (u) => String(u).trim().split("#")[0].split("?")[0];

async function streamToString(stream) {
  if (stream && typeof stream[Symbol.asyncIterator] === "function") {
    let s = "";
    for await (const chunk of stream) {
      s += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : Buffer.from(chunk).toString("utf8");
    }
    return s;
  }
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let s = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    s += dec.decode(value, { stream: true });
  }
  return s + dec.decode();
}

async function readBlob() {
  const res = await get(BLOB_PATH, { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) {
    throw new Error(`Blob read failed: status=${res && res.statusCode}`);
  }
  return JSON.parse(await streamToString(res.stream));
}

async function writeBlob(body) {
  await put(BLOB_PATH, JSON.stringify(body), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

function transform(data) {
  const moved = [];
  const skipped = [];
  const kept = [];
  let dealerCount = 0;

  for (const city of Object.keys(data)) {
    const list = (data[city] && data[city].dealers) || [];
    for (const dlr of list) {
      dealerCount++;
      const u = dlr.mapUrl && String(dlr.mapUrl).trim();
      if (!u) continue;
      if (isMapUrl(u)) { kept.push(`${city}/${dlr.name}`); continue; } // gerçek harita linki → bırak
      // website (bir bayi sitesi)
      if (isEmpty(dlr.website) || OWN_DOMAIN.test(dlr.website)) {
        const newSite = cleanUrl(u);
        moved.push({ city, name: dlr.name, from: dlr.website || "(boş)", to: newSite });
        dlr.website = newSite;
        dlr.mapUrl = "";
      } else {
        skipped.push({ city, name: dlr.name, website: dlr.website, mapUrl: u });
      }
    }
  }
  return { moved, skipped, kept, dealerCount };
}

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("HATA: BLOB_READ_WRITE_TOKEN env yok.");
    process.exit(1);
  }

  console.log("• Blob'tan dealers okunuyor…");
  const original = await readBlob();
  const before = JSON.parse(JSON.stringify(original)); // yedek için derin kopya

  // Yedek
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(__dirname, `_backup-dealers-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(before, null, 2), "utf8");
  console.log(`• Yedek alındı: ${path.basename(backupPath)}`);

  const result = transform(original);

  console.log(`\n— ${result.dealerCount} bayi tarandı —`);
  console.log(`TAŞINAN (mapUrl→website): ${result.moved.length}`);
  result.moved.forEach((m) => console.log(`   ✓ ${m.city}/${m.name}: ${m.from} → ${m.to}`));
  if (result.kept.length) console.log(`GERÇEK HARİTA LİNKİ (dokunulmadı): ${result.kept.length}`);
  if (result.skipped.length) {
    console.log(`ATLANAN (website zaten dolu — elle bak): ${result.skipped.length}`);
    result.skipped.forEach((s) => console.log(`   • ${s.city}/${s.name}: website=${s.website} | mapUrl=${s.mapUrl}`));
  }

  if (result.moved.length === 0) {
    console.log("\nDeğişiklik yok — yazma atlandı.");
    return;
  }

  console.log("\n• Blob'a yazılıyor…");
  await writeBlob(original);
  console.log("• data/dealers.json güncelleniyor…");
  fs.writeFileSync(LOCAL_PATH, JSON.stringify(original, null, 2) + "\n", "utf8");

  console.log("• Doğrulama: Blob yeniden okunuyor…");
  const after = await readBlob();
  let afterCount = 0, stillBad = 0;
  for (const city of Object.keys(after)) {
    for (const dlr of (after[city].dealers || [])) {
      afterCount++;
      if (dlr.mapUrl && !isMapUrl(dlr.mapUrl)) stillBad++;
    }
  }
  console.log(`   bayi sayısı: ${result.dealerCount} → ${afterCount} (${afterCount === result.dealerCount ? "OK" : "FARKLI!"})`);
  console.log(`   website tutan mapUrl kalan: ${stillBad} (beklenen: 0 veya atlanan sayısı=${result.skipped.length})`);
  console.log("\nDONE.");
})().catch((e) => { console.error("FIX ERROR:", (e && e.message) || e); process.exit(1); });
