#!/usr/bin/env node
/**
 * BEMIS SEO BEKÇİSİ (deterministik — yorum yapmaz)
 *
 * ⚠️⚠️ KONUM: önce `Desktop\Bemis_Raporlar\` altındaydı, o klasör en az ÜÇ KEZ
 *    silindi ve görev kör çalıştı. Artık masaüstünde DEĞİL. BU KLASÖRÜ SİLME.
 *
 * 22 kilit adresi canlıdan tarar, ÖNCEKİ turun temeliyle kıyaslar.
 * Amaç: bir deploy'un sessizce SEO gerilemesi yaratmasını yakalamak
 * (sayfa 404'e düştü · noindex oldu · canonical kayboldu · JSON-LD kırıldı).
 *
 * ⚠️ HAM HTTP + regex kullanılır. Markdown'a çeviren / JS gerektiren araçlar
 *    `<head>` meta'sını ve JSON-LD'yi ATAR → SSR Next.js'te YANLIŞ POZİTİF verir.
 * ⚠️ Next.js hreflang'i `hrefLang` (büyük L) yazar — NORMALDİR.
 *
 * RATCHET: bir sayfa bir kez "iyi" görüldüyse kötüleşmesi GERİLEMEDİR.
 * Gerileme varken temel DONDURULUR. ÇIKIŞ: 0 temiz · 1 gerileme
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const KOK = __dirname;
const TEMEL = path.join(KOK, "seo-baseline.json");
const RAPOR = path.join(KOK, "SEO_Sentinel_Rapor.md");
const HOST = "www.bemisevcharge.com.tr";
const REBASE = process.argv.includes("--rebaseline");

const SAYFALAR = [
  "/", "/products", "/products/wallbox", "/products/cables", "/products/portable",
  "/products/dc-units", "/products/v2l-c2l", "/products/converters",
  "/products/charger-equipment", "/products/accessories",
  "/uretici", "/kurumsal", "/b2b", "/bayilik", "/blog", "/sozluk", "/documents", "/destek",
];
const ALTYAPI = ["/sitemap.xml", "/robots.txt", "/llms.txt", "/meta-catalog.xml"];

const iste = (yol) => new Promise((res) => {
  const req = https.get({ host: HOST, path: yol, headers: { "User-Agent": "BemisSeoSentinel/1.0" }, timeout: 25000 },
    (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res({ kod: r.statusCode, govde: b, basliklar: r.headers })); });
  req.on("timeout", () => { req.destroy(); res({ kod: 0, govde: "", basliklar: {} }); });
  req.on("error", () => res({ kod: 0, govde: "", basliklar: {} }));
});

function olc(html, basliklar) {
  const bloklar = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  let semaGecerli = bloklar.length > 0;
  for (const m of bloklar) { try { JSON.parse(m[1]); } catch { semaGecerli = false; } }
  const robotsMeta = (html.match(/<meta name="robots" content="([^"]*)"/i) || [])[1] || "";
  const xRobots = String(basliklar["x-robots-tag"] || "");
  return {
    baslik: !!(html.match(/<title>([^<]+)<\/title>/i) || [])[1],
    aciklama: /<meta name="description" content="[^"]{20,}"/i.test(html),
    h1: (html.match(/<h1[\s>]/gi) || []).length,
    canonical: /<link rel="canonical"/i.test(html),
    indexlenir: !/noindex/i.test(robotsMeta) && !/noindex/i.test(xRobots),
    sema: semaGecerli,
  };
}

(async () => {
  const simdi = new Date().toISOString().slice(0, 16).replace("T", " ");
  const yeni = {};
  for (const s of SAYFALAR) {
    const r = await iste(s);
    yeni[s] = r.kod !== 200 ? { kod: r.kod } : Object.assign({ kod: 200 }, olc(r.govde, r.basliklar));
  }
  for (const s of ALTYAPI) { const r = await iste(s); yeni[s] = { kod: r.kod, boyut: r.govde.length }; }

  let temel = {};
  if (fs.existsSync(TEMEL)) { try { temel = JSON.parse(fs.readFileSync(TEMEL, "utf8")); } catch { temel = {}; } }
  const ilk = Object.keys(temel).length === 0;

  const gerileme = [];
  if (!ilk) {
    for (const [s, y] of Object.entries(yeni)) {
      const t = temel[s]; if (!t) continue;
      if (t.kod === 200 && y.kod !== 200) { gerileme.push(s + ": HTTP " + t.kod + " -> " + (y.kod || "erişilemedi")); continue; }
      if (y.kod !== 200) continue;
      if (t.indexlenir && !y.indexlenir) gerileme.push(s + ": indekslenebilirdi -> NOINDEX");
      if (t.canonical && !y.canonical) gerileme.push(s + ": canonical KAYBOLDU");
      if (t.sema && !y.sema) gerileme.push(s + ": JSON-LD kırıldı/kayboldu");
      if (t.baslik && !y.baslik) gerileme.push(s + ": <title> KAYBOLDU");
      if (t.aciklama && !y.aciklama) gerileme.push(s + ": meta description KAYBOLDU");
      if (t.h1 === 1 && y.h1 !== 1) gerileme.push(s + ": H1 sayısı 1 -> " + y.h1);
      if (typeof t.boyut === "number" && y.boyut < t.boyut * 0.5) gerileme.push(s + ": içerik yarıya düştü (" + t.boyut + " -> " + y.boyut + ")");
    }
  }

  const temiz = gerileme.length === 0;
  if (temiz || ilk || REBASE) fs.writeFileSync(TEMEL, JSON.stringify(Object.assign({}, yeni, { _guncellendi: simdi }), null, 2));

  const ok200 = Object.values(yeni).filter((x) => x.kod === 200).length;
  console.log(ilk ? "SEO BASELINE KURULDU" : temiz ? "GERILEME YOK - OK" : "GERILEMELER:");
  console.log("  taranan " + Object.keys(yeni).length + " adres, 200 dönen " + ok200);
  if (!temiz) { gerileme.forEach((g) => console.log("  • " + g)); console.log("  (temel DONDURULDU — meşru değişimde: --rebaseline)"); }

  let g = "## " + simdi + " — " + (ilk ? "BASELINE KURULDU" : temiz ? "GERİLEME YOK" : "GERİLEME") + "\n\n- Taranan: " + Object.keys(yeni).length + " · HTTP 200: " + ok200 + "\n";
  if (!temiz) g += gerileme.map((x) => "- " + x).join("\n") + "\n";
  g += "\n";
  let eski = "";
  if (fs.existsSync(RAPOR)) {
    eski = fs.readFileSync(RAPOR, "utf8").replace(/^# Bemis SEO Bekçi Raporu\n+/, "");
    eski = eski.split(/(?=^## )/m).filter(Boolean).slice(0, 44).join("");
  }
  fs.writeFileSync(RAPOR, "# Bemis SEO Bekçi Raporu\n\n" + g + eski);
  process.exit(temiz ? 0 : 1);
})();
