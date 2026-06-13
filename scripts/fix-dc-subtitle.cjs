/**
 * Tek seferlik: content.categories['dc-units'].subtitle değerini
 * "30-240kW" → "40-200kW" düzelt. Memory v2 günlüğünden eski karışıklık.
 *
 * Çalıştırma (cmd):
 *   cd C:\Users\sales\bemis-evcharge-website
 *   set JSONBIN_MASTER_KEY=<JSONBIN_MASTER_KEY>.
 *   node scripts/fix-dc-subtitle.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) { console.error("JSONBIN_MASTER_KEY eksik."); process.exit(1); }

const BIN_ID = "69e5093daaba88219716e044"; // content bin
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const NEW_SUBTITLE = "40-200kW";

(async () => {
  console.log("→ content bin okunuyor...");
  const r = await fetch(`${BASE}/latest`, { headers: { "X-Master-Key": MASTER } });
  if (!r.ok) throw new Error(`Read ${r.status}`);
  const record = (await r.json()).record;

  const dc = record.categories?.["dc-units"];
  if (!dc) { console.error("dc-units kategorisi bulunamadı."); process.exit(1); }

  const oldSubtitle = dc.subtitle || "(yok)";
  console.log(`  Eski: "${oldSubtitle}"`);
  console.log(`  Yeni: "${NEW_SUBTITLE}"`);
  if (oldSubtitle === NEW_SUBTITLE) {
    console.log("Aynı değer, yazma atlandı.");
    return;
  }
  dc.subtitle = NEW_SUBTITLE;

  console.log("→ yazılıyor...");
  const w = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER },
    body: JSON.stringify(record),
  });
  if (!w.ok) throw new Error(`Write ${w.status}: ${await w.text()}`);
  console.log("✓ Bitti. 60 sn içinde anasayfa kategori kartı + /products/dc-units güncellenir.");
  console.log("  EN çevirisi için: admin'den TR save (auto-translate)");
  console.log("  veya: node scripts/resync-en.cjs");
})();
