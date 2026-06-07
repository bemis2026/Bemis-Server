// Tek seferlik veri düzeltmesi: üst menüdeki "Hesaplayıcı" linki artık "Rehber"
// dropdown'ı (Hesaplayıcı + Rehberler + SSS). Navbar linkleri admin verisinde
// (content bin → navbar.links) tutulduğu için ETİKETİ veride değiştiriyoruz:
//   href "#calculator" olan link: "Hesaplayıcı" -> "Rehber", "Calculator" -> "Guide".
// (Dropdown davranışı Navbar.tsx'te href "#calculator" ile algılanır; bu sadece
//  görünen etiketi günceller — TR + EN, içerik ağacında nerede olursa olsun.)
//
// Çalıştırma: BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/fix-navbar-rehber-label.cjs

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const NAME = "content";
const BLOB_PATH = `bins/${NAME}.json`;
const LOCAL_PATH = path.join(__dirname, "..", "data", "content.json");

let changed = 0;
function walk(node) {
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (node && typeof node === "object") {
    if (node.href === "#calculator" && typeof node.label === "string") {
      if (node.label === "Hesaplayıcı") { node.label = "Rehber"; changed++; }
      else if (node.label === "Calculator") { node.label = "Guide"; changed++; }
    }
    for (const v of Object.values(node)) walk(v);
  }
}

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
async function readBlob() {
  const res = await get(BLOB_PATH, { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) throw new Error(`Blob read failed: ${res && res.statusCode}`);
  return JSON.parse(await streamToString(res.stream));
}
async function writeBlob(body) {
  await put(BLOB_PATH, JSON.stringify(body), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("HATA: BLOB_READ_WRITE_TOKEN env yok."); process.exit(1); }

  console.log("• Blob'tan content okunuyor…");
  const data = await readBlob();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(__dirname, `_backup-content-${stamp}.json`), JSON.stringify(data, null, 2), "utf8");
  console.log(`• Yedek: _backup-content-${stamp}.json`);

  changed = 0; walk(data);
  console.log(`• Blob'ta güncellenen etiket: ${changed}`);
  if (changed > 0) { console.log("• Blob'a yazılıyor…"); await writeBlob(data); }

  // Offline yedek
  try {
    const local = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8"));
    changed = 0; walk(local);
    fs.writeFileSync(LOCAL_PATH, JSON.stringify(local, null, 2) + "\n", "utf8");
    console.log(`• data/content.json güncellendi (etiket: ${changed}).`);
  } catch (e) { console.log("• data/content.json güncellenemedi:", (e && e.message) || e); }

  console.log("• Doğrulama: Blob yeniden okunuyor…");
  const after = await readBlob();
  let labels = [];
  (function find(n){ if(Array.isArray(n)) return n.forEach(find); if(n&&typeof n==="object"){ if(n.href==="#calculator"&&n.label) labels.push(n.label); for(const v of Object.values(n)) find(v);} })(after);
  console.log(`   #calculator linklerinin etiketleri: ${JSON.stringify(labels)}`);
  console.log("\nDONE.");
})().catch((e) => { console.error("FIX ERROR:", (e && e.message) || e); process.exit(1); });
