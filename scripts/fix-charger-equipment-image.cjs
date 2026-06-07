// Tek seferlik veri düzeltmesi: "charger-equipment" (Şarj Ünitesi Ekipmanları)
// kategorisinin kategori görselini (eski placeholder) o kategorinin GERÇEK bir
// ürün görseliyle değiştirir. Kullanıcı isteği: "eskiden ürünü yoktu, placeholder
// koymuştum, kalmış — ürünlerinin içinden al."
//
// Çalıştırma (BLOB_READ_WRITE_TOKEN zorunlu):
//   BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/fix-charger-equipment-image.cjs
//
// Blob (canlı) `content` bin'ini + data/content.json (offline yedek) günceller,
// yazmadan önce yedek alır, sonra Blob'u yeniden okuyup doğrular.

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const NAME = "content";
const BLOB_PATH = `bins/${NAME}.json`;
const LOCAL_PATH = path.join(__dirname, "..", "data", "content.json");

const CAT_KEY = "charger-equipment";
const OLD_IMG = "/categories/1774998252477-110001360852184.jpg";
// "Pano Prizi" (32A Type2 IIA Mod3) — kategorinin imza ürünü.
const NEW_IMG = "https://i.ibb.co/DHJDfrs7/1778482597259-32-A-type2-IIA-mod3-pano-prizi-2-png.png";

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

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("HATA: BLOB_READ_WRITE_TOKEN env yok.");
    process.exit(1);
  }

  console.log("• Blob'tan content okunuyor…");
  const data = await readBlob();
  const cats = data.categories || {};
  const cat = cats[CAT_KEY];
  if (!cat) { console.error(`HATA: '${CAT_KEY}' kategorisi yok.`); process.exit(1); }

  console.log(`• Mevcut görsel: ${cat.image}`);
  if (cat.image !== OLD_IMG) {
    console.log(`  ⚠ Beklenen placeholder (${OLD_IMG}) değil — yine de yenisiyle değiştiriliyor.`);
  }

  // Yedek
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(__dirname, `_backup-content-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`• Yedek alındı: ${path.basename(backupPath)}`);

  cat.image = NEW_IMG;
  console.log(`• Yeni görsel: ${NEW_IMG}`);

  console.log("• Blob'a yazılıyor…");
  await writeBlob(data);

  // Offline yedek (data/content.json) — sadece ilgili URL'yi değiştir (minimal diff).
  try {
    let local = fs.readFileSync(LOCAL_PATH, "utf8");
    if (local.includes(OLD_IMG)) {
      local = local.split(OLD_IMG).join(NEW_IMG);
      fs.writeFileSync(LOCAL_PATH, local, "utf8");
      console.log("• data/content.json güncellendi (URL değiştirildi).");
    } else {
      console.log("• data/content.json'da eski URL bulunamadı — atlandı (Blob esas).");
    }
  } catch (e) {
    console.log("• data/content.json güncellenemedi:", (e && e.message) || e);
  }

  console.log("• Doğrulama: Blob yeniden okunuyor…");
  const after = await readBlob();
  const v = after.categories && after.categories[CAT_KEY] && after.categories[CAT_KEY].image;
  console.log(`   ${CAT_KEY}.image = ${v} (${v === NEW_IMG ? "OK" : "FARKLI/stale olabilir"})`);
  console.log("\nDONE.");
})().catch((e) => { console.error("FIX ERROR:", (e && e.message) || e); process.exit(1); });
