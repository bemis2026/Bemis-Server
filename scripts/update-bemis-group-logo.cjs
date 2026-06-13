/**
 * Tek seferlik: content bin'de dna.groupBrands[0] (Bemis) için
 * yeni logo URL'sini set et. PNG dosyası /public/brand/bemis-logo.png
 * olarak deploy edildikten sonra çalıştır.
 *
 * Çalıştırma (cmd):
 *   cd C:\Users\sales\bemis-evcharge-website
 *   set JSONBIN_MASTER_KEY=<JSONBIN_MASTER_KEY>.
 *   node scripts/update-bemis-group-logo.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) { console.error("JSONBIN_MASTER_KEY eksik."); process.exit(1); }

const BIN_ID = "69e5093daaba88219716e044"; // content bin
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const NEW_LOGO = "/brand/bemis-logo.png";

(async () => {
  console.log("→ content bin okunuyor...");
  const r = await fetch(`${BASE}/latest`, { headers: { "X-Master-Key": MASTER } });
  if (!r.ok) throw new Error(`Read ${r.status}`);
  const record = (await r.json()).record;

  const brands = record.dna?.groupBrands ?? [];
  const bemis = brands.find((b) => b.name === "Bemis");
  if (!bemis) {
    console.error("dna.groupBrands içinde 'Bemis' ismi bulunamadı.");
    process.exit(1);
  }
  const oldLogo = bemis.logo || "(yok)";
  console.log(`  Eski: ${oldLogo}`);
  console.log(`  Yeni: ${NEW_LOGO}`);
  if (oldLogo === NEW_LOGO) {
    console.log("Aynı değer, yazma atlandı.");
    return;
  }
  bemis.logo = NEW_LOGO;

  console.log("→ yazılıyor...");
  const w = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER },
    body: JSON.stringify(record),
  });
  if (!w.ok) throw new Error(`Write ${w.status}: ${await w.text()}`);
  console.log("✓ Bitti. /kurumsal sayfası 60 sn içinde yeni logo ile render eder.");
})();
