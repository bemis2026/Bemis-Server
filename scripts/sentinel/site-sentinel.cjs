#!/usr/bin/env node
/**
 * BEMIS SİTE SAĞLIK + VERİ-BÜTÜNLÜĞÜ BEKÇİSİ (deterministik — yorum yapmaz)
 *
 * ⚠️⚠️ KONUM: bu dosya ÖNCE `Desktop\Bemis_Raporlar\` altındaydı ve o klasör
 *    EN AZ ÜÇ KEZ SİLİNDİ. Her seferinde cron görevleri "çalıştı" ama
 *    karşılaştırma yapamadığı için hiçbir şey yakalamadı — kullanıcı ancak
 *    elle sorunca öğrendi. Bu yüzden artık masaüstünde DEĞİL.
 *    📌 BU KLASÖRÜ TAŞIMA/SİLME: cron görevleri bu yolu çağırıyor.
 *
 * RATCHET: sayımlar yalnız YUKARI çıkar. Herhangi bir DÜŞÜŞ = alarm.
 * Alarm varken temel DONDURULUR (kayıp maskelenmesin). Meşru düşüşte --rebaseline.
 * YAPI TOLERANSI: uç şekli tanınmazsa "0'a düştü" DEME → uyarı.
 * ÇIKIŞ: 0 temiz · 1 alarm
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const KOK = __dirname;
const TEMEL = path.join(KOK, "site-baseline.json");
const RAPOR = path.join(KOK, "Site_Saglik_Rapor.md");
const HOST = "www.bemisevcharge.com.tr";
const REBASE = process.argv.includes("--rebaseline");
const MAXG = 45;
const SAYFALAR = ["/", "/products", "/uretici", "/iletisim", "/documents"];
const REPO = "C:/Users/sales/bemis-evcharge-website/data/products.json";

const iste = (yol) => new Promise((res) => {
  const req = https.get({ host: HOST, path: yol, headers: { "User-Agent": "BemisSentinel/1.0" }, timeout: 20000 },
    (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res({ kod: r.statusCode, govde: b })); });
  req.on("timeout", () => { req.destroy(); res({ kod: 0, govde: "" }); });
  req.on("error", (e) => res({ kod: 0, govde: "", hata: e.message }));
});
const J = (t) => { try { return JSON.parse(t); } catch { return null; } };

const sayimlar = {
  async products() {
    const r = await iste("/api/products"); if (r.kod !== 200) return null;
    const j = J(r.govde); const K = Array.isArray(j) ? j : j && j.products;
    if (!Array.isArray(K)) return null;
    let u = 0; for (const k of K) { if (!Array.isArray(k && k.products)) return null; u += k.products.length; }
    return { kategori: K.length, urun: u };
  },
  async dealers() {
    const r = await iste("/api/dealers"); if (r.kod !== 200) return null;
    const j = J(r.govde); if (!j || typeof j !== "object" || Array.isArray(j)) return null;
    const s = Object.values(j).filter((v) => v && Array.isArray(v.dealers));
    return s.length ? { sehir: s.length, bayi: s.reduce((a, v) => a + v.dealers.length, 0) } : null;
  },
  async documents() {
    const r = await iste("/api/documents"); if (r.kod !== 200) return null;
    const j = J(r.govde);
    // ⚠️ ÇIPLAK DİZİ döner — {documents:[...]} sanma (bu tuzağa düşüldü).
    const l = Array.isArray(j) ? j : (j && Array.isArray(j.documents) ? j.documents : null);
    return l ? { dokuman: l.length } : null;
  },
  async content() {
    const r = await iste("/api/content"); if (r.kod !== 200) return null;
    const j = J(r.govde); if (!j || typeof j !== "object" || Array.isArray(j)) return null;
    return { icerikBolum: Object.keys(j).length, oneCikan: Array.isArray(j.featured) ? j.featured.length : 0 };
  },
  async b2b() {
    const r = await iste("/api/b2b"); if (r.kod !== 200) return null;
    const j = J(r.govde);
    return (!j || typeof j !== "object" || Array.isArray(j)) ? null : { b2bBolum: Object.keys(j).length };
  },
};

// EK 1 — repo yedeği CANLIDAN saptı mı? Admin YALNIZ R2'ye yazar; repo yalnız
// R2 okunamayan build'de devreye girer. Bayatlarsa o build eski veriyi yayınlar.
async function repoSapmasi() {
  if (!fs.existsSync(REPO)) return { atlandi: "repo dosyası yok" };
  const r = await iste("/api/products"); if (r.kod !== 200) return { atlandi: "canlı okunamadı" };
  const c = J(r.govde), rp = J(fs.readFileSync(REPO, "utf8"));
  if (!c || !rp) return { atlandi: "JSON bozuk" };
  const duz = (x) => {
    const m = {}; const K = Array.isArray(x) ? x : x.products;
    if (!Array.isArray(K)) return null;
    for (const k of K) for (const p of ((k && k.products) || [])) m[p.id] = p;
    return m;
  };
  const C = duz(c), R = duz(rp); if (!C || !R) return { atlandi: "yapı tanınmadı" };
  const fy = (p) => { for (const g of (p.specs || [])) for (const i of (g.items || [])) if (/fiyat|price/i.test(i.label || "")) return String(i.value || ""); return ""; };
  const alan = { gorsel: (p) => p.image || "", ad: (p) => p.name || "", kod: (p) => p.code || "", fiyat: fy, sertifika: (p) => JSON.stringify(p.certificates || []) };
  const s = {};
  for (const id of Object.keys(C)) { if (!R[id]) continue; for (const [a, f] of Object.entries(alan)) if (f(C[id]) !== f(R[id])) (s[a] = s[a] || []).push(id); }
  return { sapma: s, eksik: Object.keys(C).filter((i) => !R[i]).length, toplam: Object.values(s).reduce((a, v) => a + v.length, 0) };
}

// EK 2 — dil hizası. Çeviri TR ile POZİSYONEL eşleşir; kayarsa başlık yuvasına
// CÜMLE düşer ve düzen bozulur. Bu sınıf hata 2026-08'de üç kez çıktı.
async function dilHizasi() {
  const tr = await iste("/api/content?lang=tr"); if (tr.kod !== 200) return { atlandi: "TR okunamadı" };
  const T = J(tr.govde); if (!T) return { atlandi: "TR JSON bozuk" };
  const sorun = [];
  for (const d of ["en", "de", "es", "ar", "ru"]) {
    const r = await iste("/api/content?lang=" + d);
    if (r.kod !== 200) { sorun.push(d + ": okunamadı"); continue; }
    const X = J(r.govde); if (!X) { sorun.push(d + ": JSON bozuk"); continue; }
    const a = Array.isArray(T.featured) ? T.featured.length : -1;
    const b = Array.isArray(X.featured) ? X.featured.length : -1;
    if (a !== b) sorun.push(d + ": öne çıkanlar " + b + " != TR " + a);
    for (const [blok, alan] of [["dealer", "heading"], ["products", "heading"], ["dna", "sectionHeading"]]) {
      const v = String((X[blok] || {})[alan] || ""), t = String((T[blok] || {})[alan] || "");
      if (v && t && v.length > Math.max(t.length * 2.2, 60)) sorun.push(d + ": " + blok + "." + alan + " " + v.length + " kr (TR " + t.length + ") kayma şüphesi");
    }
  }
  return { sorun };
}

(async () => {
  const alarm = [], uyari = [], buyume = [];
  const tarih = new Date().toISOString().slice(0, 16).replace("T", " ");

  const ayakta = [];
  for (const s of SAYFALAR) {
    const r = await iste(s); ayakta.push({ s, kod: r.kod });
    if (r.kod !== 200) alarm.push(s + " -> HTTP " + (r.kod || "erişilemedi"));
  }
  const up = ayakta.filter((x) => x.kod === 200).length;

  const yeni = {};
  for (const [ad, fn] of Object.entries(sayimlar)) {
    const s = await fn();
    if (s === null) { uyari.push("/api/" + ad + " okunamadı veya yapısı tanınmadı — sayım ATLANDI"); continue; }
    Object.assign(yeni, s);
  }

  try {
    const rs = await repoSapmasi();
    if (rs.atlandi) uyari.push("repo sapma denetimi atlandı: " + rs.atlandi);
    else if (rs.toplam > 0 || rs.eksik > 0) uyari.push("repo yedeği CANLIDAN sapmış -> " +
      Object.entries(rs.sapma).map(([a, v]) => a + " " + v.length).join(", ") +
      (rs.eksik ? ", repoda eksik " + rs.eksik : "") + " (R2 okunamayan build eski veriyi yayınlar)");
  } catch (e) { uyari.push("repo denetimi hata: " + e.message); }

  try {
    const dh = await dilHizasi();
    if (dh.atlandi) uyari.push("dil hizası atlandı: " + dh.atlandi);
    else if (dh.sorun.length) uyari.push("dil hizası: " + dh.sorun.join(" | "));
  } catch (e) { uyari.push("dil hizası hata: " + e.message); }

  let temel = {};
  if (fs.existsSync(TEMEL)) temel = J(fs.readFileSync(TEMEL, "utf8")) || {};
  const ilk = Object.keys(temel).length === 0;
  for (const [k, v] of Object.entries(yeni)) {
    const t = temel[k]; if (typeof t !== "number") continue;
    if (v < t) alarm.push(k + ": " + t + " -> " + v + " (DÜŞTÜ, " + (t - v) + " eksik)");
    else if (v > t) buyume.push(k + ": " + t + " -> " + v);
  }

  const temiz = alarm.length === 0;
  if (temiz || ilk || REBASE) fs.writeFileSync(TEMEL, JSON.stringify(Object.assign({}, temel, yeni, { _guncellendi: tarih }), null, 2));

  const ozet = Object.entries(yeni).map(([k, v]) => k + " " + v).join(", ");
  const bas = ilk ? "SITE BASELINE KURULDU" : temiz ? "SITE OK" : "SITE ALARM";
  console.log(bas + " — uptime " + up + "/" + SAYFALAR.length + ", " + ozet);
  if (buyume.length) console.log("BUYUME: " + buyume.join(" | "));
  if (uyari.length) console.log("UYARI:\n  " + uyari.join("\n  "));
  if (alarm.length) console.log("ALARM:\n  " + alarm.join("\n  "));
  if (!temiz && !ilk) console.log("(temel DONDURULDU — meşru düşüşte: --rebaseline)");

  let g = "## " + tarih + " — " + bas + "\n\n- Uptime: " + up + "/" + SAYFALAR.length + "\n- Sayımlar: " + ozet + "\n";
  if (buyume.length) g += "- Büyüme: " + buyume.join(" · ") + "\n";
  if (uyari.length) g += "- UYARI: " + uyari.join(" · ") + "\n";
  if (alarm.length) g += "- ALARM: " + alarm.join(" · ") + "\n";
  g += "\n";
  let eski = "";
  if (fs.existsSync(RAPOR)) {
    eski = fs.readFileSync(RAPOR, "utf8").replace(/^# Bemis Site Sağlık Raporu\n+/, "");
    eski = eski.split(/(?=^## )/m).filter(Boolean).slice(0, MAXG - 1).join("");
  }
  fs.writeFileSync(RAPOR, "# Bemis Site Sağlık Raporu\n\n" + g + eski);
  process.exit(temiz ? 0 : 1);
})();
