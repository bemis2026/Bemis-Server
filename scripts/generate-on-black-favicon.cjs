/**
 * Tek seferlik: light-mode browser tab'larında beyaz arka plana karşı
 * "siyah kare içinde beyaz B" gösterilecek favicon set'ini yarat.
 *
 *   public/favicon-white-{64,192,512}.png  (şeffaf zemin, beyaz B)
 *      →
 *   public/favicon-on-black-{64,192,512}.png  (siyah zemin, beyaz B)
 *
 * Çalıştırma:
 *   node scripts/generate-on-black-favicon.cjs
 *
 * Gereksinim: sharp (zaten kuruluysa kullanır; yoksa npm install sharp).
 */

const fs = require("fs");
const path = require("path");

(async () => {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("HATA: 'sharp' paketi yüklü değil. Çalıştır: npm install sharp");
    process.exit(1);
  }

  const sizes = [64, 192, 512];
  const pubDir = path.join(__dirname, "..", "public");

  for (const size of sizes) {
    const inPath = path.join(pubDir, `favicon-white-${size}.png`);
    const outPath = path.join(pubDir, `favicon-on-black-${size}.png`);
    if (!fs.existsSync(inPath)) {
      console.warn(`  skip ${size} — kaynak yok: ${inPath}`);
      continue;
    }

    // Siyah, opak canvas + üzerine beyaz-B (şeffaf) composite.
    // Beyaz B'yi canvas'ın %78'lik orta alanına yerleştir (favicon
    // padding'i — köşeleri dolu görünmesin, "B" kare içinde nefes alsın).
    const padded = Math.round(size * 0.78);
    const overlay = await sharp(inPath).resize(padded, padded, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const offset = Math.round((size - padded) / 2);

    await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
    })
      .composite([{ input: overlay, top: offset, left: offset }])
      .png()
      .toFile(outPath);

    console.log(`  ✓ ${outPath}`);
  }

  console.log("\n✓ Bitti. Şimdi app/layout.tsx'te icon listesini güncelle.");
})();
