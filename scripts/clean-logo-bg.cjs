/**
 * Tek seferlik: bir logo görselinin BEYAZ arka planını saydam yapar.
 *
 * Önemli: kenardan flood-fill kullanır. Yani sadece "image kenarına
 * bağlı beyaz bölgeler" silinir — logonun içindeki beyaz alanlar
 * (örn. B harfinin içi) bozulmadan kalır.
 *
 * Çalıştırma:
 *   node scripts/clean-logo-bg.cjs <input> <output> [whiteThreshold]
 *
 * Örnek:
 *   node scripts/clean-logo-bg.cjs "C:/.../bemis-logo.jpg" "C:/.../bemis-logo.png"
 *   node scripts/clean-logo-bg.cjs "C:/.../bemis-logo.jpg" "C:/.../bemis-logo.png" 220
 *
 * whiteThreshold (default 235): pixel luminance bunun üstündeyse
 * "potansiyel beyaz" sayılır. Düşür → daha agresif temizleme.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function cleanBackground(input, output, whiteThreshold = 235) {
  const inputBuf = fs.readFileSync(input);
  const { data, info } = await sharp(inputBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`  ${path.basename(input)} → ${width}×${height} (${channels} ch)`);

  // 1) Binary mask: each pixel "is this white-ish?" by luminance.
  const isWhite = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += channels, p++) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    isWhite[p] = luminance >= whiteThreshold ? 1 : 0;
  }

  // 2) Flood-fill from every edge pixel that's white. Only the
  // connected region reachable from outside gets marked as background.
  const visited = new Uint8Array(width * height);
  const queue = [];
  const pushIfWhite = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx] || !isWhite[idx]) return;
    visited[idx] = 1;
    queue.push(idx);
  };
  for (let x = 0; x < width; x++) {
    pushIfWhite(x, 0);
    pushIfWhite(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfWhite(0, y);
    pushIfWhite(width - 1, y);
  }
  while (queue.length) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx - x) / width;
    pushIfWhite(x - 1, y);
    pushIfWhite(x + 1, y);
    pushIfWhite(x, y - 1);
    pushIfWhite(x, y + 1);
  }

  // 3) Set alpha=0 wherever the flood-fill reached. Smoothing pass:
  //    nearby semi-white pixels (luminance 180-235) get partial alpha
  //    so anti-aliased edges don't read as a sharp jagged cutout.
  let bgPixels = 0;
  for (let p = 0; p < width * height; p++) {
    const off = p * channels;
    if (visited[p]) {
      data[off + 3] = 0;
      bgPixels++;
    } else {
      const r = data[off], g = data[off + 1], b = data[off + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 180 && lum < whiteThreshold) {
        // Soft alpha taper for anti-aliased rim.
        const t = (whiteThreshold - lum) / (whiteThreshold - 180);
        data[off + 3] = Math.round(255 * Math.max(0, Math.min(1, t)));
      }
    }
  }
  console.log(`  · ${bgPixels.toLocaleString()} arka plan pikseli saydam yapıldı`);

  await sharp(data, { raw: info })
    .png({ compressionLevel: 9 })
    .toFile(output);
  const outSize = fs.statSync(output).size;
  console.log(`  ✓ ${output} (${(outSize / 1024).toFixed(1)} KB)`);
}

(async () => {
  const [, , inputArg, outputArg, thresholdArg] = process.argv;
  if (!inputArg || !outputArg) {
    console.error("Kullanım: node scripts/clean-logo-bg.cjs <input> <output> [threshold]");
    process.exit(1);
  }
  await cleanBackground(inputArg, outputArg, thresholdArg ? Number(thresholdArg) : 235);
})();
