// Tek seferlik: "Şarj Cihazları Fiyat Listesi 2026" → "Fiyat Listesi 2026"
// (kullanıcı isteği: direkt "Fiyat Listesi"). /documents sayfası + navbar
// Dökümanlar dropdown her ikisi de doc.title okur → tek değişiklik her yere yansır.
// Çalıştırma: BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/rename-fiyat-listesi.cjs

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const FROM = "Şarj Cihazları Fiyat Listesi 2026";
const TO = "Fiyat Listesi 2026";

async function streamToString(stream) {
  if (stream && typeof stream[Symbol.asyncIterator] === "function") {
    let s = ""; for await (const c of stream) s += Buffer.isBuffer(c) ? c.toString("utf8") : Buffer.from(c).toString("utf8"); return s;
  }
  const reader = stream.getReader(); const dec = new TextDecoder(); let s = "";
  for (;;) { const { done, value } = await reader.read(); if (done) break; s += dec.decode(value, { stream: true }); } return s + dec.decode();
}
async function readBlob(name) {
  const res = await get(`bins/${name}.json`, { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) throw new Error(`read fail ${name} ${res && res.statusCode}`);
  return JSON.parse(await streamToString(res.stream));
}
async function writeBlob(name, body) {
  await put(`bins/${name}.json`, JSON.stringify(body), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}
const list = (d) => (Array.isArray(d) ? d : (d && Array.isArray(d.documents) ? d.documents : []));
function rename(arr) { let n = 0; arr.forEach((x) => { if (x && x.title === FROM) { x.title = TO; n++; } }); return n; }

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("HATA: BLOB_READ_WRITE_TOKEN yok."); process.exit(1); }
  const docs = await readBlob("documents");
  const n = rename(list(docs));
  await writeBlob("documents", docs);
  console.log(`• documents Blob: "${FROM}" -> "${TO}" (${n} adet).`);
  try {
    const p = path.join(__dirname, "..", "data", "documents.json");
    const local = JSON.parse(fs.readFileSync(p, "utf8"));
    const ln = rename(list(local));
    fs.writeFileSync(p, JSON.stringify(local, null, 2) + "\n", "utf8");
    console.log(`• data/documents.json (${ln} adet).`);
  } catch (e) { console.log("• local güncellenemedi:", (e && e.message) || e); }
  console.log("DONE.");
})().catch((e) => { console.error("ERR:", (e && e.message) || e); process.exit(1); });
