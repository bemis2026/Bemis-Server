/**
 * Tek seferlik: content bin'inde _translations.en.featuredSection
 * field'ını doğru EN değerlerine override et. MyMemory "Öne Çıkan
 * Ürünler" → "EDigital: Featured Products" gibi anlamsız çeviri
 * üretmiş; admin save'i tetiklediğimizde aynı bozulma tekrar olur.
 *
 * Çalıştırma (cmd):
 *   cd C:\Users\sales\bemis-evcharge-website
 *   set JSONBIN_MASTER_KEY=<JSONBIN_MASTER_KEY>.
 *   node scripts/fix-featured-en.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) { console.error("JSONBIN_MASTER_KEY eksik."); process.exit(1); }

const BIN_ID = "69e5093daaba88219716e044"; // content bin
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const FEATURED_EN = {
  sectionLabel: "Featured Products",
  heading: "Most Preferred",
  subheading: "Our best-selling models, trusted by customers across 60+ countries",
  ctaLabel: "View Product",
};

(async () => {
  console.log("→ content bin okunuyor...");
  const r = await fetch(`${BASE}/latest`, { headers: { "X-Master-Key": MASTER } });
  if (!r.ok) throw new Error(`Read ${r.status}`);
  const record = (await r.json()).record;

  record._translations = record._translations ?? {};
  record._translations.en = record._translations.en ?? {};
  const before = JSON.stringify(record._translations.en.featuredSection ?? {});
  record._translations.en.featuredSection = FEATURED_EN;
  const after  = JSON.stringify(FEATURED_EN);

  if (before === after) {
    console.log("Aynı değer, yazma atlandı.");
    return;
  }
  console.log(`  Eski: ${before}`);
  console.log(`  Yeni: ${after}`);

  console.log("→ yazılıyor...");
  const w = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER },
    body: JSON.stringify(record),
  });
  if (!w.ok) throw new Error(`Write ${w.status}: ${await w.text()}`);
  console.log("✓ Bitti. 60 sn içinde anasayfa EN'i 'Featured Products' başlığı ile yenilenir.");
  console.log("  NOT: admin'den TR save edersen MyMemory bu alanları tekrar otomatik çevirir.");
  console.log("       Bu durumda scripti yeniden çalıştır.");
})();
