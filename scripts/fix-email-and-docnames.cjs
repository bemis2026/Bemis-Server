// Tek seferlik veri düzeltmesi (kullanıcı isteği):
//   1. content bin → contact.email: eski "info@bemis.com.tr" → "info@bemisevcharge.com"
//      (yeni kurumsal mail; sitede gösterilen + JSON-LD organizationSchema buradan okur).
//   2. documents bin → bazı döküman başlıklarını kurumsal/doğru yazıma çek (küçük harf,
//      "sarj"→"Şarj", eksik "Kılavuzu" vb.).
// Hem Blob (canlı) hem data/*.json (yedek) güncellenir; her bin yedeklenir.
//
// Çalıştırma: BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/fix-email-and-docnames.cjs

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const NEW_EMAIL = "info@bemisevcharge.com";
const DOC_RENAME = {
  "Bemis e-v charge hızlı kurulum kılavuzu": "E-V Charge Hızlı Kurulum Kılavuzu",
  "Bemis sarj cihazları fiyat listesi 2026": "Şarj Cihazları Fiyat Listesi 2026",
  "Bemis Servis ve Bakım": "Servis ve Bakım Kılavuzu",
  "Bemis Mobil Uygulama": "Bemis Mobil Uygulama Kılavuzu",
};

async function streamToString(stream) {
  if (stream && typeof stream[Symbol.asyncIterator] === "function") {
    let s = "";
    for await (const chunk of stream) s += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : Buffer.from(chunk).toString("utf8");
    return s;
  }
  const reader = stream.getReader(); const dec = new TextDecoder(); let s = "";
  for (;;) { const { done, value } = await reader.read(); if (done) break; s += dec.decode(value, { stream: true }); }
  return s + dec.decode();
}
async function readBlob(name) {
  const res = await get(`bins/${name}.json`, { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) throw new Error(`Blob read failed (${name}): ${res && res.statusCode}`);
  return JSON.parse(await streamToString(res.stream));
}
async function writeBlob(name, body) {
  await put(`bins/${name}.json`, JSON.stringify(body), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}
function backup(name, data, stamp) {
  fs.writeFileSync(path.join(__dirname, `_backup-${name}-${stamp}.json`), JSON.stringify(data, null, 2), "utf8");
}
function docsArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.documents)) return data.documents;
  return [];
}
function renameDocs(list) {
  let n = 0;
  list.forEach((d) => { if (d && typeof d.title === "string" && DOC_RENAME[d.title]) { console.log(`   "${d.title}" -> "${DOC_RENAME[d.title]}"`); d.title = DOC_RENAME[d.title]; n++; } });
  return n;
}

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("HATA: BLOB_READ_WRITE_TOKEN env yok."); process.exit(1); }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  // ───── 1. CONTENT: email ─────
  console.log("• content bin okunuyor…");
  const content = await readBlob("content");
  backup("content", content, stamp);
  const oldEmail = content.contact && content.contact.email;
  if (content.contact) content.contact.email = NEW_EMAIL;
  await writeBlob("content", content);
  console.log(`• content.contact.email: "${oldEmail}" -> "${NEW_EMAIL}" (Blob yazıldı)`);

  // ───── 2. DOCUMENTS: başlıklar ─────
  console.log("• documents bin okunuyor…");
  const docsData = await readBlob("documents");
  backup("documents", docsData, stamp);
  const list = docsArray(docsData);
  console.log(`• döküman sayısı: ${list.length}, yeniden adlandırma:`);
  const n = renameDocs(list);
  await writeBlob("documents", docsData);
  console.log(`• documents Blob yazıldı (değişen başlık: ${n}).`);

  // ───── 3. Yerel yedek dosyalar ─────
  try {
    const p = path.join(__dirname, "..", "data", "content.json");
    const local = JSON.parse(fs.readFileSync(p, "utf8"));
    if (local.contact) local.contact.email = NEW_EMAIL;
    fs.writeFileSync(p, JSON.stringify(local, null, 2) + "\n", "utf8");
    console.log("• data/content.json e-posta güncellendi.");
  } catch (e) { console.log("• data/content.json güncellenemedi:", (e && e.message) || e); }
  try {
    const p = path.join(__dirname, "..", "data", "documents.json");
    const localD = JSON.parse(fs.readFileSync(p, "utf8"));
    const ln = renameDocs(docsArray(localD));
    fs.writeFileSync(p, JSON.stringify(localD, null, 2) + "\n", "utf8");
    console.log(`• data/documents.json güncellendi (başlık: ${ln}).`);
  } catch (e) { console.log("• data/documents.json güncellenemedi:", (e && e.message) || e); }

  // ───── 4. Doğrulama ─────
  console.log("• Doğrulama (Blob yeniden okunuyor)…");
  const c2 = await readBlob("content");
  const d2 = docsArray(await readBlob("documents"));
  console.log("   contact.email:", c2.contact && c2.contact.email);
  console.log("   döküman başlıkları:", JSON.stringify(d2.map((x) => x.title)));
  console.log("\nDONE.");
})().catch((e) => { console.error("FIX ERROR:", (e && e.message) || e); process.exit(1); });
