// Tek seferlik veri düzeltmesi: anasayfa kategori kartlarındaki "X Model"
// etiketini (content bin → categories[id].modelCount) GERÇEK ürün sayısına çeker.
// Kullanıcı isteği: kartlardaki sayılar gerçeğin altındaydı (örn. ekipman "5 Model"
// ama 30 ürün). Ürünlere DOKUNMAZ — yalnız kartın üstündeki sayı (etiket) düzelir.
//
// Çalıştırma (BLOB_READ_WRITE_TOKEN zorunlu):
//   BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/fix-category-modelcounts.cjs
//
// Blob (canlı) `content` bin'ini + data/content.json (offline yedek) günceller,
// yazmadan önce yedek alır, sonra Blob'u yeniden okuyup doğrular.

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const NAME = "content";
const BLOB_PATH = `bins/${NAME}.json`;
const LOCAL_PATH = path.join(__dirname, "..", "data", "content.json");

// Canlı /api/products'tan doğrulanmış gerçek ürün sayıları (2026-06-16).
const COUNTS = {
  "wallbox": 8,
  "portable": 3,
  "cables": 22,
  "v2l-c2l": 17,
  "converters": 17,
  "accessories": 10,
  "dc-units": 6,
  "charger-equipment": 30,
};

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

  // Yedek
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(__dirname, `_backup-content-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`• Yedek alındı: ${path.basename(backupPath)}`);

  console.log("• Değişiklikler:");
  let changed = 0;
  for (const [id, real] of Object.entries(COUNTS)) {
    const cat = cats[id];
    if (!cat) { console.log(`   ⚠ '${id}' kategorisi content'te yok — atlandı.`); continue; }
    const old = cat.modelCount;
    if (old === real) { console.log(`   ${id.padEnd(20)} ${old} (değişmedi)`); continue; }
    cat.modelCount = real;
    changed++;
    console.log(`   ${id.padEnd(20)} ${old} → ${real}`);
  }

  if (!changed) { console.log("• Değişiklik yok, çıkılıyor."); return; }

  console.log("• Blob'a yazılıyor…");
  await writeBlob(data);

  // Offline yedek (data/content.json) — JSON parse/serialize ile minimal güncelle.
  try {
    const local = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8"));
    if (local.categories) {
      for (const [id, real] of Object.entries(COUNTS)) {
        if (local.categories[id]) local.categories[id].modelCount = real;
      }
      fs.writeFileSync(LOCAL_PATH, JSON.stringify(local, null, 2), "utf8");
      console.log("• data/content.json güncellendi.");
    }
  } catch (e) {
    console.log("• data/content.json güncellenemedi:", (e && e.message) || e);
  }

  console.log("• Doğrulama: Blob yeniden okunuyor…");
  const after = await readBlob();
  let ok = true;
  for (const [id, real] of Object.entries(COUNTS)) {
    const v = after.categories && after.categories[id] && after.categories[id].modelCount;
    const good = v === real;
    if (!good) ok = false;
    console.log(`   ${id.padEnd(20)} = ${v} (${good ? "OK" : "FARKLI/stale"})`);
  }
  console.log(ok ? "\nDONE — hepsi doğrulandı." : "\nUYARI: bazı değerler eşleşmedi (Blob gecikmesi olabilir).");
})().catch((e) => { console.error("FIX ERROR:", (e && e.message) || e); process.exit(1); });
