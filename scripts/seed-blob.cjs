// Tek seferlik tohum (seed): Masaüstü JSONBin export dosyalarını Vercel Blob'a yükler.
// Çalıştırma (BLOB_READ_WRITE_TOKEN env zorunlu — Vercel Blob store'dan alınır):
//   BLOB_READ_WRITE_TOKEN='vercel_blob_rw_...' node scripts/seed-blob.cjs
//
// Export dosyaları orijinal bin yapısını korur (products/productsExtra ayrı,
// messages dahil), böylece Blob bin'leri JSONBin ile birebir eşleşir.

const { put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const SRC = "C:\\Users\\sales\\Desktop\\Jsonbin Bemis";

// Blob bin adı -> export dosya adı
const MAP = {
  content:         "bemis-content.txt",
  products:        "bemis-products.txt",
  productsExtra:   "products-extra.txt",
  productsEn:      "products-en.txt",
  productsEnExtra: "products-en-extra.txt",
  dealers:         "bemis-dealers.txt",
  b2b:             "bemis-b2b.txt",
  documents:       "bemis-documents.txt",
  messages:        "messages.txt",
  changelog:       "changelog.txt",
};

function load(fn) {
  const raw = fs.readFileSync(path.join(SRC, fn), "utf-8").replace(/^﻿/, "").trim();
  let d = JSON.parse(raw);
  // JSONBin API sarmalı geldiyse (record+metadata) aç
  if (d && typeof d === "object" && !Array.isArray(d) && "record" in d && "metadata" in d) d = d.record;
  return d;
}

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("HATA: BLOB_READ_WRITE_TOKEN env yok. Vercel -> Storage -> Blob -> token.");
    process.exit(1);
  }
  let ok = 0;
  for (const [name, fn] of Object.entries(MAP)) {
    const data = load(fn);
    const res = await put(`bins/${name}.json`, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    console.log(`  ✓ ${name.padEnd(16)} -> ${res.pathname}`);
    ok++;
  }
  console.log(`DONE — ${ok}/${Object.keys(MAP).length} bin Blob'a yüklendi.`);
})().catch((e) => { console.error("SEED ERROR:", e && e.message ? e.message : e); process.exit(1); });
