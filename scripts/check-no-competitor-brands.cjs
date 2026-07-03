// CI GUARD — Bemis sitesinde rakip marka adı GEÇMEZ (iş kuralı; GEO denetimleri
// defalarca temizledi, geri gelmesin). `prebuild` olarak koşar → build'den ÖNCE
// içerik/ürün verisini tarar; belirsiz OLMAYAN bir rakip marka bulursa build'i
// (dolayısıyla deploy'u) durdurur. Jenerik "wallbox" (kategori adı) HARİÇ tutulur.
const fs = require("fs");

const FILES = [
  "data/content.json",
  "data/content-en.json",
  "data/products.json",
  "data/products-en.json",
];

// Sadece belirsiz olmayan rakip markalar. ABB/KEBA büyük-harf duyarlı ("grabbing"
// gibi kelimelerdeki "abb" yanlış-pozitifini önler); diğerleri ayırt edici.
const BRANDS = [
  /\bABB\b/,
  /\bKEBA\b/,
  /\bSchneider\b/i,
  /\bVestel\b/i,
  /\bEasee\b/i,
  /\bZaptec\b/i,
  /\bAlfen\b/i,
  /\bTritium\b/i,
  /\bFronius\b/i,
  /\bgo-e\b/i,
];

const hits = [];
for (const f of FILES) {
  let txt;
  try { txt = fs.readFileSync(f, "utf8"); } catch { continue; }
  for (const re of BRANDS) {
    const i = txt.search(re);
    if (i !== -1) {
      const m = txt.match(re);
      hits.push({ file: f, brand: m[0], context: txt.slice(Math.max(0, i - 45), i + 45).replace(/\s+/g, " ") });
    }
  }
}

if (hits.length) {
  console.error("\n❌ RAKIP MARKA TESPIT EDILDI — build durduruldu:");
  for (const h of hits) console.error(`   ${h.file}: "${h.brand}"  → ...${h.context}...`);
  console.error("\n   Bemis sitesinde rakip marka adi gecmez (is kurali). Kaldirip tekrar deneyin.\n");
  process.exit(1);
}
console.log("✅ Rakip-marka guard: temiz.");
