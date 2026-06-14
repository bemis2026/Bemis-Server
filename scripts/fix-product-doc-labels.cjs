// Tek seferlik: ürünlere yüklü dokümanların `label`'ı slug ("bemis-ev-charge-
// hizli-kurulum-kilavuzu") olarak görünüyor → düzgün başlığa çevir. Eşleme:
// önce documents bin'inden URL/dosya adıyla gerçek title, yoksa slug'ı çöz.
// DRY (varsayılan): yazmaz, rapor eder. Uygulamak için APPLY=1.
// Çalıştırma: BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' APPLY=1 node scripts/fix-product-doc-labels.cjs

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const APPLY = process.env.APPLY === "1";

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

const isSlug = (l) => typeof l === "string" && l.length > 0 && !/\s/.test(l) && /[-_]/.test(l);
const deslug = (s) => s.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
  .split(" ").map((w) => (w ? w[0].toLocaleUpperCase("tr") + w.slice(1) : w)).join(" ");
const catsOf = (d) => Array.isArray(d) ? d : (d && Array.isArray(d.categories) ? d.categories : (d && Array.isArray(d.products) ? d.products : []));

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("HATA: BLOB_READ_WRITE_TOKEN yok."); process.exit(1); }

  // documents bin → URL/dosya adı → title eşlemesi
  const docsBin = await readBlob("documents");
  const docs = Array.isArray(docsBin) ? docsBin : (docsBin.documents || []);
  const byUrl = new Map(), byFile = new Map();
  docs.forEach((d) => { if (d && d.title) { if (d.url) byUrl.set(d.url, d.title); if (d.filename) byFile.set(d.filename.replace(/\.[^.]+$/, ""), d.title); } });

  const changes = [];
  function fix(cats) {
    let n = 0;
    (cats || []).forEach((c) => (c.products || []).forEach((p) => (p.documents || []).forEach((doc) => {
      if (!doc || !doc.label) return;
      if (!isSlug(doc.label)) return; // zaten düzgün başlık
      const nl = (doc.url && byUrl.get(doc.url)) || byFile.get(doc.label) || deslug(doc.label);
      if (nl && nl !== doc.label) { changes.push(`"${doc.label}"  →  "${nl}"`); doc.label = nl; n++; }
    })));
    return n;
  }

  for (const bin of ["products", "productsExtra", "productsEn", "productsEnExtra"]) {
    let data; try { data = await readBlob(bin); } catch (e) { console.log(`  [${bin}] okunamadı: ${e.message}`); continue; }
    const n = fix(catsOf(data));
    if (n > 0) {
      if (APPLY) { await writeBlob(bin, data); console.log(`  [${bin}] ${n} label DÜZELTİLDİ (yazıldı).`); }
      else console.log(`  [${bin}] ${n} label DÜZELECEK (dry).`);
    } else console.log(`  [${bin}] değişiklik yok.`);
  }

  for (const f of ["products.json", "productsExtra.json", "productsEn.json", "productsEnExtra.json"]) {
    const fp = path.join(__dirname, "..", "data", f);
    if (!fs.existsSync(fp)) continue;
    const local = JSON.parse(fs.readFileSync(fp, "utf8"));
    const n = fix(catsOf(local));
    if (n > 0 && APPLY) { fs.writeFileSync(fp, JSON.stringify(local, null, 2) + "\n", "utf8"); console.log(`  [data/${f}] ${n} (yazıldı).`); }
    else if (n > 0) console.log(`  [data/${f}] ${n} (dry).`);
  }

  console.log(`\n${APPLY ? "UYGULANDI" : "DRY"} — değişiklikler:`);
  [...new Set(changes)].forEach((c) => console.log("   " + c));
  console.log("DONE.");
})().catch((e) => { console.error("ERR:", (e && e.message) || e); process.exit(1); });
