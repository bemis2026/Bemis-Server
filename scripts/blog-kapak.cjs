/**
 * BLOG KAPAK ÜRETİCİ — tek komut, tarayıcısız.
 *
 *   node scripts/blog-kapak.cjs            # eksik kapakları üretir + posts.ts'i doldurur
 *   node scripts/blog-kapak.cjs --hepsi    # VARSA DA yeniden üretir
 *   node scripts/blog-kapak.cjs --kuru     # hiçbir şey yazmaz, ne yapacağını söyler
 *
 * NEDEN TARAYICISIZ: ilk üretim (2026-09-16) HTML + Playwright ekran görüntüsüyle
 * yapılmıştı; o yol Playwright kurulumu ve ayakta bir dev sunucu gerektiriyor,
 * yani operatör tek başına çalıştıramıyordu. Burada her şey `sharp` ile yapılır
 * (zaten projede var, Next görsel optimizasyonu kullanıyor) ve Inter yazı tipi
 * SVG'ye GÖMÜLÜ gelir → çıktı makineden bağımsız, siteyle aynı yazı tipinde.
 * ⚠️ Gömülü @font-face'in gerçekten kullanıldığı ölçülerek doğrulandı (gömülü
 *    fontla 483px, sistem fontuyla 526px — aynı metin).
 *
 * TASARIM (kullanıcı kararı 2026-09-16):
 *   A = tipografik koyu kapak — varsayılan, hiçbir varlığa bağlı değil
 *   C = ürün görselli — YALNIZ `URUN` haritasındaki yazılarda
 * ⚠️ URUN haritası ELLE ve EMİN OLUNAN YERDE doldurulur. Ürün eşleşmesi
 *    otomatik çıkarılamıyor (43 yazının yalnız 1'inde ürün sayfasına doğrudan
 *    bağlantı var) ve YANLIŞ ürün görseli, görselsiz kapaktan KÖTÜDÜR.
 *
 * ÇIKTI: public/blog-kapak/<slug>.jpg — 1200×675 (16:9), JPEG q86.
 * ⚠️ JPEG (WebP değil): OG/Twitter kazıyıcılarının tamamı JPEG'i sorunsuz okur.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const sharp = require("sharp");

const KOK = process.cwd();
const POSTS = path.join(KOK, "app", "blog", "posts.ts");
const CIKTI = path.join(KOK, "public", "blog-kapak");
const ONBELLEK = path.join(KOK, "node_modules", ".cache", "blog-kapak");

const G = 1200, Y = 675;
const HEPSI = process.argv.includes("--hepsi");
const KURU = process.argv.includes("--kuru");

const FONT_URL = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2";

/** Ürün görselli (C) yazılar. Yeni eşleşme eklerken: ürün GERÇEKTEN o yazının
 *  konusu mu? Emin değilsen EKLEME — A kapağı her zaman doğrudur. */
const URUN = {
  "dc-sarj-kablosu-ve-ccs2-soketi-nasil-secilir": "v1787315195/products/wu2wt6xq98rvczbdlomm.png",
  "c2l-nedir-v2l-den-farki": "v1783074935/products/ksaotmy4jtffsdokdscl.png",
  "v2l-adaptoru-nasil-secilir": "v1783074935/products/ksaotmy4jtffsdokdscl.png",
  "elektrikli-arac-sarj-uzatma-kablosu-nasil-secilir": "v1787315011/products/rxry0txp7jqkqdgdgkgk.png",
  "portatif-seyyar-sarj-cihazi-nedir-ne-kadar": "v1786127171/products/mdlbke7a0x5zkdf2mijl.png",
  "ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi": "v1786127171/products/mdlbke7a0x5zkdf2mijl.png",
  "hangi-sarj-kablosu-aracima-uyumlu-type-2": "v1787314951/products/dpskojrucajs3izrl3y4.png",
  "elektrikli-arac-sarj-kablosu-kac-metre-kac-amper": "v1787314951/products/dpskojrucajs3izrl3y4.png",
  "ev-sarj-kablosu-secimi-type-2": "v1787314951/products/dpskojrucajs3izrl3y4.png",
  "40-kw-dc-sarj-istasyonu": "v1786127189/products/i3qo3mkpseelmdgb7iiu.png",
  "ev-sarj-cihazi-modelleri-karsilastirma": "v1783076700/products/n45cgijdczyu4xbpb1sa.png",
  "ortak-alan-sarj-yonetim-paneli-apartman-site": "v1783076700/products/n45cgijdczyu4xbpb1sa.png",
  "wallbox-nedir-ev-tipi-sarj-istasyonu-rehberi": "v1783076693/products/hn7jzxjfajjjn9ia0w8w.png",
  "11-kw-mi-22-kw-mi-wallbox-guc-secimi-amper-hesabi": "v1783076693/products/hn7jzxjfajjjn9ia0w8w.png",
};
const CLOUD = "https://res.cloudinary.com/dmnttjyzm/image/upload/";

// ── yardımcılar ────────────────────────────────────────────────────────────
const kacir = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function indir(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
      if (r.statusCode !== 200) return rej(new Error("HTTP " + r.statusCode + " — " + url));
      const p = []; r.on("data", (c) => p.push(c)); r.on("end", () => res(Buffer.concat(p)));
    }).on("error", rej);
  });
}

/** Ağdan bir kez indirir, sonra node_modules/.cache altından okur. */
async function onbellekli(ad, url) {
  const y = path.join(ONBELLEK, ad);
  if (fs.existsSync(y)) return fs.readFileSync(y);
  const b = await indir(url);
  fs.mkdirSync(ONBELLEK, { recursive: true });
  fs.writeFileSync(y, b);
  return b;
}

/** Kaba ilerleme genişliği — SVG'de otomatik satır kaydırma yok, elle sarmalıyız.
 *  Dar/geniş harfler ayrı katsayıyla sayılır; %6 emniyet payı bırakılır. */
const DAR = new Set([..."iıIlj|!.,:;'’\"()[]{}/\\ft"]);
const GENIS = new Set([..."MWmwĞÜÖÇŞ@%"]);
function genislik(metin, punto) {
  let em = 0;
  for (const c of metin) em += DAR.has(c) ? 0.30 : GENIS.has(c) ? 0.82 : 0.55;
  return em * punto * 1.06;
}

/** Başlığı satırlara böler.
 *  ⚠️ ÖNCE AZ SATIR, SONRA BÜYÜK PUNTO: ilk sürüm "3 satıra sığan en büyük punto"yu
 *     seçiyordu ve tarayıcı sürümünün 2 satır yaptığı başlıkları 3 satıra yayıyordu
 *     (ölçüldü: şerit profili 11,7 puan saptı). Kapakta az satır daha iyi okunur,
 *     o yüzden önce 2 satır denenir; sığmazsa 3'e çıkılır. */
function sarmala(baslik, kutuGenisligi, adaylar, maks) {
  for (let sinir = 2; sinir <= maks; sinir++) {
    const d = sarmalaDene(baslik, kutuGenisligi, adaylar, sinir);
    if (d) return d;
  }
  return sarmalaDene(baslik, kutuGenisligi, adaylar, maks, true);
}

function sarmalaDene(baslik, kutuGenisligi, adaylar, maks, zorla) {
  for (const punto of adaylar) {
    const kelimeler = baslik.split(/\s+/);
    const satirlar = [];
    let mevcut = "";
    let sigmayan = false;
    for (const k of kelimeler) {
      const deneme = mevcut ? mevcut + " " + k : k;
      if (genislik(deneme, punto) <= kutuGenisligi) { mevcut = deneme; continue; }
      if (mevcut) satirlar.push(mevcut);
      // tek kelime bile sığmıyorsa bu punto elenir
      if (genislik(k, punto) > kutuGenisligi) { sigmayan = true; break; }
      mevcut = k;
    }
    if (sigmayan) continue;
    if (mevcut) satirlar.push(mevcut);
    if (satirlar.length <= maks) return { punto, satirlar };
  }
  if (!zorla) return null;
  // hiçbiri olmadıysa en küçük puntoyla zorla böl
  const punto = adaylar[adaylar.length - 1];
  return { punto, satirlar: baslik.split(/\s+/).reduce((a, k) => {
    const s = a[a.length - 1];
    if (s && genislik(s + " " + k, punto) <= kutuGenisligi) a[a.length - 1] = s + " " + k; else a.push(k);
    return a;
  }, []).slice(0, maks) };
}

// ── posts.ts okuma / yazma ─────────────────────────────────────────────────
function yazilariOku() {
  const t = fs.readFileSync(POSTS, "utf-8");
  const re = /"?slug"?:\s*"([a-z0-9-]+)"/g;
  const konum = [];
  let m; while ((m = re.exec(t))) konum.push({ slug: m[1], i: m.index });
  const al = (k, ad) => {
    const x = k.match(new RegExp('"?' + ad + '"?:\\s*"((?:[^"\\\\]|\\\\.)*)"'));
    return x ? x[1] : null;
  };
  return konum.map((k, n) => {
    const kapsam = t.slice(k.i, n + 1 < konum.length ? konum[n + 1].i : t.length);
    const sayi = kapsam.match(/"?readingMinutes"?:\s*(\d+)/);
    return {
      slug: k.slug,
      title: al(kapsam, "title"),
      category: al(kapsam, "category"),
      readingMinutes: sayi ? Number(sayi[1]) : null,
      cover: al(kapsam, "cover"),
    };
  });
}

/** `cover` alanı olmayan yazılara ekler. Dosyası olmayan yazıya ASLA yazmaz. */
function coverYaz(sluglar) {
  let metin = fs.readFileSync(POSTS, "utf-8");
  const SS = metin.includes("\r\n") ? "\r\n" : "\n";
  const re = /"?slug"?:\s*"([a-z0-9-]+)"/g;
  const konum = []; let m;
  while ((m = re.exec(metin))) konum.push({ slug: m[1], i: m.index });
  let n_ = 0;
  // SONDAN BAŞA: ekleme yapınca önceki indeksler kaymaz.
  for (let n = konum.length - 1; n >= 0; n--) {
    const { slug, i } = konum[n];
    if (!sluglar.includes(slug)) continue;
    const son = n + 1 < konum.length ? konum[n + 1].i : metin.length;
    const kapsam = metin.slice(i, son);
    if (/"?cover"?:/.test(kapsam)) continue;
    if (!fs.existsSync(path.join(CIKTI, slug + ".jpg"))) continue;
    const tirnakli = kapsam.match(/(\s*)"title":\s*"(?:[^"\\]|\\.)*",/);
    const duz = kapsam.match(/(\s*)title:\s*"(?:[^"\\]|\\.)*",/);
    const t = tirnakli || duz;
    if (!t) continue;
    const girinti = t[1].replace(/^[\r\n]+/, "");
    const ek = SS + girinti + (tirnakli ? '"cover"' : "cover") + ': "/blog-kapak/' + slug + '.jpg",';
    const nokta = i + kapsam.indexOf(t[0]) + t[0].length;
    metin = metin.slice(0, nokta) + ek + metin.slice(nokta);
    n_++;
  }
  if (n_ && !KURU) fs.writeFileSync(POSTS, metin, "utf-8");
  return n_;
}

// ── SVG kalıbı ─────────────────────────────────────────────────────────────
function svg({ title, category, readingMinutes }, fontB64, logoB64, urunB64) {
  const solKenar = 64;
  const kutu = urunB64 ? 600 : G - solKenar * 2;
  const { punto, satirlar } = sarmala(title, kutu, urunB64 ? [54, 48, 42, 37, 33] : [70, 62, 54, 47, 41], 3);
  const satirYuk = punto * 1.12;
  // ⚠️ Çip yüksekliği 36 (rect'te de 36). İlk sürümde 46 yazılmıştı ve başlık
  //    bloğu 16px AŞAĞI kayıyordu — ölçüldü: tarayıcı sürümü 140–269, bu
  //    sürüm 156–282. Blok yüksekliği zaten aynıydı (129/126), sorun yalnız
  //    başlangıç noktasıydı. Ascent katsayısı da 0.82 → 0.72'ye çekildi.
  const CIP_YUK = 36;
  const ustBasla = (urunB64 ? 96 : 78) + CIP_YUK + 26 + punto * 0.72;

  const grid = `<pattern id="izgara" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0 L0 0 0 56" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/></pattern>`;

  const urunKatmani = urunB64
    ? `<image href="data:image/png;base64,${urunB64}" x="${G - 56 - 470}" y="${(Y - 470) / 2}" width="470" height="470" preserveAspectRatio="xMidYMid meet"/>`
    : "";

  const cizgiY = ustBasla + (satirlar.length - 1) * satirYuk + 34;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${G}" height="${Y}" viewBox="0 0 ${G} ${Y}">
  <defs>
    <style>@font-face{font-family:'InterKapak';src:url(data:font/woff2;base64,${fontB64}) format('woff2');font-weight:100 900;}</style>
    <linearGradient id="zemin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${urunB64 ? "#0a0a0d" : "#0b0b0e"}"/>
      <stop offset="0.58" stop-color="#111118"/>
      <stop offset="1" stop-color="${urunB64 ? "#101018" : "#0c0c11"}"/>
    </linearGradient>
    <radialGradient id="isik" cx="${urunB64 ? "0.78" : "0.88"}" cy="${urunB64 ? "0.5" : "-0.08"}" r="0.62">
      <stop offset="0" stop-color="#3B82F6" stop-opacity="${urunB64 ? "0.26" : "0.22"}"/>
      <stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="izgaraMask" cx="0.63" cy="0.12" r="0.62">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="mIzgara"><rect width="${G}" height="${Y}" fill="url(#izgaraMask)"/></mask>
    <linearGradient id="vurgu" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
    </linearGradient>
    ${grid}
  </defs>

  <rect width="${G}" height="${Y}" fill="url(#zemin)"/>
  <rect width="${G}" height="${Y}" fill="url(#izgara)" mask="url(#mIzgara)" opacity="0.5"/>
  <rect width="${G}" height="${Y}" fill="url(#isik)"/>
  ${urunKatmani}

  <g font-family="InterKapak, Arial, sans-serif">
    <rect x="${solKenar}" y="${urunB64 ? 96 : 78}" rx="10" ry="10"
      width="${Math.round(genislik(category.toLocaleUpperCase("tr"), 17)) + 32}" height="36"
      fill="#3B82F6" fill-opacity="0.14" stroke="#3B82F6" stroke-opacity="0.34"/>
    <text x="${solKenar + 16}" y="${(urunB64 ? 96 : 78) + 24}" font-size="17" font-weight="700" fill="#93C5FD"
      letter-spacing="0.3">${kacir(category.toLocaleUpperCase("tr"))}</text>

    ${satirlar.map((s, i) => `<text x="${solKenar}" y="${ustBasla + i * satirYuk}" font-size="${punto}" font-weight="900" fill="#ffffff" letter-spacing="-${(punto * 0.02).toFixed(2)}">${kacir(s)}</text>`).join("\n    ")}

    <rect x="${solKenar}" y="${cizgiY}" width="112" height="4" rx="2" fill="url(#vurgu)"/>

    <image href="data:image/png;base64,${logoB64}" x="${solKenar}" y="${Y - 52 - 34}" height="34" width="140" preserveAspectRatio="xMinYMid meet" opacity="0.95"/>
    <text x="${G - solKenar}" y="${Y - 52 - 10}" font-size="17" font-weight="600" fill="#ffffff" fill-opacity="0.52"
      text-anchor="end">${kacir(readingMinutes + " dk okuma · bemisevcharge.com.tr")}</text>
  </g>
</svg>`;
}

// ── ana akış ───────────────────────────────────────────────────────────────
(async () => {
  const yazilar = yazilariOku();
  const eksikAlan = yazilar.filter((p) => !p.title || !p.category || !p.readingMinutes);
  if (eksikAlan.length) {
    console.error("✖ alanı eksik yazı: " + eksikAlan.map((x) => x.slug).join(", "));
    process.exit(1);
  }

  const hedef = HEPSI ? yazilar : yazilar.filter((p) => !fs.existsSync(path.join(CIKTI, p.slug + ".jpg")));
  console.log("yazı            : " + yazilar.length);
  console.log("üretilecek kapak: " + hedef.length + (HEPSI ? "  (--hepsi)" : "  (eksik olanlar)"));
  if (!hedef.length) {
    const eklendi = coverYaz(yazilar.map((p) => p.slug));
    console.log("posts.ts cover  : " + eklendi + " eklendi");
    console.log("\n✅ üretilecek yeni kapak yok.");
    return;
  }
  if (KURU) { console.log("\n(kuru çalışma — yazılmadı)"); return; }

  const font = (await onbellekli("inter.woff2", FONT_URL)).toString("base64");
  const logo = fs.readFileSync(path.join(KOK, "public", "logo-white.png")).toString("base64");

  fs.mkdirSync(CIKTI, { recursive: true });
  let toplamKB = 0;
  const hatalar = [];

  for (const p of hedef) {
    try {
      let urunB64 = null;
      if (URUN[p.slug]) {
        const ad = URUN[p.slug].replace(/[/]/g, "_");
        urunB64 = (await onbellekli(ad, CLOUD + URUN[p.slug])).toString("base64");
      }
      const buf = await sharp(Buffer.from(svg(p, font, logo, urunB64)))
        .jpeg({ quality: 86, mozjpeg: true }).toBuffer();
      fs.writeFileSync(path.join(CIKTI, p.slug + ".jpg"), buf);
      toplamKB += buf.length / 1024;
      console.log("  ✓ " + (URUN[p.slug] ? "[C] " : "[A] ") + p.slug + ".jpg  " + Math.round(buf.length / 1024) + " KB");
    } catch (e) {
      hatalar.push(p.slug + " → " + e.message);
    }
  }

  const eklendi = coverYaz(hedef.map((p) => p.slug));
  console.log("");
  console.log("üretilen        : " + (hedef.length - hatalar.length) + "/" + hedef.length +
    " · ortalama " + Math.round(toplamKB / Math.max(1, hedef.length - hatalar.length)) + " KB");
  console.log("posts.ts cover  : " + eklendi + " eklendi");
  if (hatalar.length) { console.log("HATALAR:"); hatalar.forEach((h) => console.log("  " + h)); process.exit(1); }
  console.log("\n✅ bitti.");
})().catch((e) => { console.error("HATA: " + e.message); process.exit(1); });
