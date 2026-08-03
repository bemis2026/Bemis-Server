#!/usr/bin/env node
/**
 * Site sağlık + veri bütünlüğü bekçisi (cihazdan bağımsız sürüm).
 *
 * NEDEN VAR: Bu kontrol daha önce yalnız kullanıcının Windows masaüstünde
 * (`Desktop\Bemis_Raporlar\site-sentinel.cjs` + yerel zamanlanmış görev)
 * çalışıyordu. O bilgisayar kapalıyken hiçbir koruma yoktu ve telefondan /
 * başka bir bilgisayardan erişilemiyordu. Bu sürüm repoda durur, GitHub
 * Actions üzerinde çalışır → hiçbir cihazın açık olması gerekmez.
 *
 * NE YAPAR:
 *   1. Kritik sayfaların HTTP 200 döndüğünü doğrular.
 *   2. Katalog sayımlarını (kategori/ürün/şehir/bayi/döküman/bölüm) okur ve
 *      `data/site-baseline.json` ile karşılaştırır.
 *
 * RATCHET (cırcır) MANTIĞI — sessiz veri kaybını yakalamak için:
 *   - Sayım ARTARSA  → yeni değer taban çizgisine yazılır (normal büyüme).
 *   - Sayım DÜŞERSE  → 🔴 ALARM. Düşüş asla "yeni normal" sayılmaz.
 *   - Alarm varken taban çizgisi DONDURULUR (maskeleme yok).
 *   - Meşru düşüşte (ör. ürün gerçekten kaldırıldı) elle: --rebaseline
 *
 * YAPI TOLERANSI (öğrenilmiş tuzak): `/api/documents` ÇIPLAK DİZİ döner,
 * diğerleri nesne. Bir uç noktanın yapısı tanınmazsa "0'a düştü" DEMEZ →
 * 🟡 uyarı verir. Aksi halde bir API şekli değişince sahte alarm üretirdi.
 *
 * KULLANIM:
 *   node scripts/site-sentinel.cjs               # kontrol et, rapor bas
 *   node scripts/site-sentinel.cjs --rebaseline  # mevcut değerleri taban yap
 *   node scripts/site-sentinel.cjs --json        # makine okunur çıktı
 *
 * ÇIKIŞ KODU: 🔴 varsa 1, yoksa 0. (Workflow bunu severity'ye çevirir.)
 *
 * Harici paket YOK — Node 20+ global fetch yeterli.
 */

const fs = require("fs");
const path = require("path");

const SITE = process.env.SENTINEL_SITE || "https://www.bemisevcharge.com.tr";
const BASELINE_PATH = path.join(process.cwd(), "data", "site-baseline.json");
const TIMEOUT_MS = 20000;

/** Ayakta olması şart sayfalar. Biri 200 dönmezse 🔴. */
const PAGES = ["/", "/products", "/uretici", "/blog", "/iletisim"];

// ─────────────────────────── sayım yardımcıları ───────────────────────────
// Her biri ya {metrik: sayı} döner ya da null (= yapı tanınmadı → 🟡).

/** /api/products → kategori dizisi, her kategoride products[]. */
function countProducts(data) {
  if (!Array.isArray(data)) return null;
  let products = 0;
  let sawList = false;
  for (const cat of data) {
    if (Array.isArray(cat?.products)) {
      sawList = true;
      products += cat.products.length;
    }
  }
  // Dolu bir dizi ama hiç products[] yoksa → şekil değişmiş, sayma.
  if (data.length > 0 && !sawList) return null;
  return { categories: data.length, products };
}

/** /api/dealers → { cityId: { dealers: [...] } } */
function countDealers(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const cities = Object.keys(data);
  let dealers = 0;
  let sawList = false;
  for (const key of cities) {
    const v = data[key];
    const list = Array.isArray(v?.dealers) ? v.dealers : Array.isArray(v) ? v : null;
    if (list) {
      sawList = true;
      dealers += list.length;
    }
  }
  if (cities.length > 0 && !sawList) return null;
  return { cities: cities.length, dealers };
}

/** /api/documents → ÇIPLAK DİZİ (bazı yedeklerde { documents: [...] }). */
function countDocuments(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.documents)
      ? data.documents
      : null;
  if (!list) return null;
  return { documents: list.length };
}

/** /api/content ve /api/b2b → üst seviye bölüm sayısı. */
function countSections(data, metric) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return { [metric]: Object.keys(data).length };
}

const ENDPOINTS = [
  { path: "/api/products", count: countProducts },
  { path: "/api/dealers", count: countDealers },
  { path: "/api/documents", count: countDocuments },
  { path: "/api/content", count: (d) => countSections(d, "contentSections") },
  { path: "/api/b2b", count: (d) => countSections(d, "b2bSections") },
];

// ──────────────────────────────── ağ ────────────────────────────────

async function head(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "bemis-site-sentinel" },
    });
    return { status: res.status };
  } catch (e) {
    return { status: 0, error: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function getJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "bemis-site-sentinel" },
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, status: res.status, data: await res.json() };
  } catch (e) {
    return { ok: false, status: 0, error: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(timer);
  }
}

// ────────────────────────── taban çizgisi (baseline) ──────────────────────

function readBaseline() {
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function writeBaseline(counts) {
  const body = {
    _comment:
      "site-sentinel taban çizgisi. Sayımlar yalnız YUKARI çıkar; her düşüş alarmdır. " +
      "Meşru düşüşte: node scripts/site-sentinel.cjs --rebaseline",
    updatedAt: new Date().toISOString(),
    site: SITE,
    counts,
  };
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(body, null, 2) + "\n", "utf-8");
}

// ──────────────────────────────── ana akış ────────────────────────────────

async function run() {
  const rebaseline = process.argv.includes("--rebaseline");
  const asJson = process.argv.includes("--json");

  const red = [];
  const yellow = [];
  const lines = [];
  const counts = {};

  lines.push(`# Site sağlık kontrolü — ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`);
  lines.push(`Site: ${SITE}\n`);

  // 1) Sayfa erişilebilirliği
  lines.push("## Sayfalar");
  for (const p of PAGES) {
    const r = await head(SITE + p);
    if (r.status === 200) {
      lines.push(`  🟢 ${p} — 200`);
    } else {
      const detail = r.error ? `${r.error}` : `HTTP ${r.status}`;
      lines.push(`  🔴 ${p} — ${detail}`);
      red.push(`${p} erişilemiyor (${detail})`);
    }
  }

  // 2) Veri sayımları
  lines.push("\n## Veri uç noktaları");
  let anyEndpointDown = false;
  for (const ep of ENDPOINTS) {
    const r = await getJson(SITE + ep.path);
    if (!r.ok) {
      const detail = r.error ? r.error : `HTTP ${r.status}`;
      lines.push(`  🔴 ${ep.path} — ${detail}`);
      red.push(`${ep.path} yanıt vermiyor (${detail})`);
      anyEndpointDown = true;
      continue;
    }
    const c = ep.count(r.data);
    if (!c) {
      // Yapı tanınmadı → sayımı 0 sayma, sadece uyar.
      lines.push(`  🟡 ${ep.path} — yanıt geldi ama yapı tanınmadı (sayım atlandı)`);
      yellow.push(`${ep.path} yapısı değişmiş olabilir — sayım yapılamadı`);
      anyEndpointDown = true;
      continue;
    }
    Object.assign(counts, c);
    lines.push(`  🟢 ${ep.path} — ${Object.entries(c).map(([k, v]) => `${k}: ${v}`).join(" · ")}`);
  }

  // 3) Taban çizgisiyle karşılaştır
  const baseline = readBaseline();
  lines.push("\n## Taban çizgisi karşılaştırması");

  if (!baseline) {
    if (anyEndpointDown) {
      lines.push("  🟡 Taban çizgisi YOK ve bazı uç noktalar okunamadı → tohumlama atlandı.");
      yellow.push("Taban çizgisi tohumlanamadı (eksik veri) — bir sonraki çalışmada denenecek");
    } else {
      writeBaseline(counts);
      lines.push("  🟢 Taban çizgisi ilk kez oluşturuldu:");
      for (const [k, v] of Object.entries(counts)) lines.push(`      ${k}: ${v}`);
    }
  } else if (rebaseline) {
    writeBaseline(counts);
    lines.push("  🟢 --rebaseline: taban çizgisi mevcut değerlerle güncellendi.");
  } else {
    const prev = baseline.counts || {};
    const grown = {};
    for (const [k, v] of Object.entries(counts)) {
      const before = prev[k];
      if (typeof before !== "number") {
        lines.push(`  🟢 ${k}: ${v} (yeni metrik)`);
        grown[k] = v;
      } else if (v < before) {
        lines.push(`  🔴 ${k}: ${before} → ${v}  (DÜŞTÜ — ${before - v} kayıp)`);
        red.push(`${k} sayısı ${before} → ${v} düştü`);
      } else if (v > before) {
        lines.push(`  🟢 ${k}: ${before} → ${v} (arttı)`);
        grown[k] = v;
      } else {
        lines.push(`  🟢 ${k}: ${v} (değişmedi)`);
      }
    }

    if (red.length > 0) {
      lines.push("\n  ⏸️  Alarm var → taban çizgisi DONDURULDU (düşüş maskelenmiyor).");
      lines.push("      Düşüş meşruysa: node scripts/site-sentinel.cjs --rebaseline");
    } else if (Object.keys(grown).length > 0) {
      writeBaseline({ ...prev, ...counts });
      lines.push("\n  ✏️  Taban çizgisi yukarı güncellendi.");
    }
  }

  // 4) Özet
  lines.push("\n## Özet");
  if (red.length) {
    lines.push(`  🔴 ${red.length} kritik bulgu:`);
    red.forEach((r) => lines.push(`     - ${r}`));
  }
  if (yellow.length) {
    lines.push(`  🟡 ${yellow.length} uyarı:`);
    yellow.forEach((y) => lines.push(`     - ${y}`));
  }
  if (!red.length && !yellow.length) lines.push("  🟢 Her şey yolunda — gerileme yok.");

  const report = lines.join("\n");
  if (asJson) {
    console.log(JSON.stringify({ red, yellow, counts, report }, null, 2));
  } else {
    console.log(report);
  }
  process.exitCode = red.length ? 1 : 0;
}

if (require.main === module) {
  run().catch((e) => {
    console.error("site-sentinel çöktü:", e);
    process.exitCode = 1;
  });
}

module.exports = { countProducts, countDealers, countDocuments, countSections };
