// One-shot: insert the "Şarj Setleri / Kabloları" inventory (24 SKUs across
// 4 variant families) into the cables category — both the local JSON
// fallback and the live JSONBin. Same family/variant pattern we already use
// for "Charger 2", so on the public site they collapse into 4 cards with a
// version selector.
//
// Run once with:  JSONBIN_MASTER_KEY=$2a$10$... node scripts/add-charging-sets.cjs

const fs = require("fs");
const KEY = process.env.JSONBIN_MASTER_KEY;
if (!KEY) {
  console.error("JSONBIN_MASTER_KEY environment variable is required.");
  console.error("  Usage: JSONBIN_MASTER_KEY=$2a$10$... node " + __filename);
  process.exit(1);
}
const BIN = "69e5093e856a6821894eaee8";

// Source data, transcribed from the catalog table.
const FAMILIES = [
  {
    name: "Şarj Seti 20A Monofaze",
    description: "Monofaze 20A 3,7 kW gücünde, ev tipi şarj istasyonları için Type 2 — Type 2 Mod 3 uyumlu kablolu şarj seti. Kablo kesiti 3×2.5 mm² + 1×0.75 mm² ttr.",
    phase: "Monofaze",
    amps: "20A",
    kw: "3,7 kW",
    section: "3 × 2.5 mm² + 1 × 0.75 mm² ttr",
    codePrefix: "BEV-3020-12",
    variants: [
      { length: "3m",  code: "03", price: "EUR 58,00"  },
      { length: "5m",  code: "05", price: "EUR 62,50"  },
      { length: "7m",  code: "07", price: "EUR 70,00"  },
      { length: "8m",  code: "08", price: "EUR 73,00"  },
      { length: "10m", code: "10", price: "EUR 79,00"  },
    ],
  },
  {
    name: "Şarj Seti 32A Monofaze",
    description: "Monofaze 32A 7,4 kW gücünde, ev ve iş yeri şarjı için Type 2 — Type 2 Mod 3 uyumlu kablolu şarj seti. Kablo kesiti 3×6 mm² + 1×0.75 mm² ttr.",
    phase: "Monofaze",
    amps: "32A",
    kw: "7,4 kW",
    section: "3 × 6 mm² + 1 × 0.75 mm² ttr",
    codePrefix: "BEV-3032-12",
    variants: [
      { length: "3m",  code: "03", price: "EUR 86,00"  },
      { length: "5m",  code: "05", price: "EUR 92,50"  },
      { length: "7m",  code: "07", price: "EUR 101,00" },
      { length: "8m",  code: "08", price: "EUR 105,00" },
      { length: "10m", code: "10", price: "EUR 114,00" },
    ],
  },
  {
    name: "Şarj Seti 20A Trifaze",
    description: "Trifaze 20A 11 kW gücünde, ticari ve iş yeri şarjı için Type 2 — Type 2 Mod 3 uyumlu kablolu şarj seti. Kablo kesiti 5×2.5 mm² + 1×0.75 mm² ttr.",
    phase: "Trifaze",
    amps: "20A",
    kw: "11 kW",
    section: "5 × 2.5 mm² + 1 × 0.75 mm² ttr",
    codePrefix: "BEV-5020-12",
    variants: [
      { length: "3m",  code: "03", price: "EUR 78,00"  },
      { length: "5m",  code: "05", price: "EUR 85,00"  },
      { length: "7m",  code: "07", price: "EUR 93,00"  },
      { length: "8m",  code: "08", price: "EUR 98,00"  },
      { length: "10m", code: "10", price: "EUR 110,00" },
      { length: "15m", code: "15", price: "EUR 140,00" },
    ],
  },
  {
    name: "Şarj Seti 32A Trifaze",
    description: "Trifaze 32A 22 kW gücünde, hızlı AC şarj için Type 2 — Type 2 Mod 3 uyumlu kablolu şarj seti. Kablo kesiti 5×6 mm² + 1×0.75 mm² ttr.",
    phase: "Trifaze",
    amps: "32A",
    kw: "22 kW",
    section: "5 × 6 mm² + 1 × 0.75 mm² ttr",
    codePrefix: "BEV-5032-12",
    variants: [
      { length: "3m",  code: "03", price: "EUR 114,00" },
      { length: "5m",  code: "05", price: "EUR 122,50" },
      { length: "7m",  code: "07", price: "EUR 136,00" },
      { length: "8m",  code: "08", price: "EUR 143,00" },
      { length: "10m", code: "10", price: "EUR 160,00" },
      { length: "15m", code: "15", price: "EUR 200,00" },
    ],
  },
];

function slugify(s) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build all 22 product entries. They share `name` per family so the public
// site groups them into one card with a version selector; the variant tab
// shows subtitle = length and the code underneath.
function buildProducts() {
  const out = [];
  for (const fam of FAMILIES) {
    const familySlug = slugify(fam.name);
    for (const v of fam.variants) {
      const code = `${fam.codePrefix}${v.code}`;
      out.push({
        id: `${familySlug}-${v.length}`,
        name: fam.name,
        code,
        subtitle: `${v.length} Kablolu`,
        badge: null,
        description: fam.description,
        specs: [
          {
            group: "Elektriksel",
            items: [
              { label: "Güç",          value: fam.kw },
              { label: "Faz",          value: fam.phase },
              { label: "Maks. Akım",   value: fam.amps },
            ],
          },
          {
            group: "Kablo & Bağlantı",
            items: [
              { label: "Kablo Uzunluğu", value: v.length },
              { label: "Kablo Kesiti",   value: fam.section },
              { label: "Konnektör",      value: "Type 2 — Type 2 (IEC 62196-2)" },
              { label: "Mod",            value: "Mod 3 (IEC 61851-1)" },
            ],
          },
          {
            group: "Fiyat",
            items: [
              { label: "Liste Fiyatı", value: v.price },
            ],
          },
        ],
        generalFeatures: [
          `${fam.phase.toLowerCase().charAt(0).toUpperCase() + fam.phase.toLowerCase().slice(1)} ${fam.amps} ${fam.kw} güç çıkışı`,
          "Type 2 (IEC 62196-2) konnektör — tüm Avrupa EV markalarıyla uyumlu",
          "Mod 3 sinyal protokolü, mekanik kilitleme",
          "Esnek bakır iletken, UV ve hava koşullarına dayanıklı dış kılıf",
          "CE ve TSE uygunluk testi tamamlanmış",
        ],
      });
    }
  }
  return out;
}

function unwrap(record) {
  if (Array.isArray(record)) return { tr: record, en: null };
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    return { tr: record.products, en: Array.isArray(record._translations?.en) ? record._translations.en : null };
  }
  return { tr: [], en: null };
}

async function main() {
  // 1. Build new entries.
  const newProducts = buildProducts();
  console.log(`Built ${newProducts.length} new product entries across ${FAMILIES.length} families.`);

  // 2. Update local data/products.json so deploys carry the data even if
  //    the JSONBin write later fails.
  const localPath = "data/products.json";
  const local = JSON.parse(fs.readFileSync(localPath, "utf-8"));
  const cablesIdx = local.findIndex((c) => c.id === "cables");
  if (cablesIdx < 0) throw new Error("Local cables category not found");
  // Skip if any of the new IDs already exist (idempotent re-runs).
  const existingIds = new Set(local[cablesIdx].products.map((p) => p.id));
  const filtered = newProducts.filter((p) => !existingIds.has(p.id));
  if (filtered.length === 0) {
    console.log("All entries already present in data/products.json — skipping local write.");
  } else {
    local[cablesIdx].products = [...local[cablesIdx].products, ...filtered];
    fs.writeFileSync(localPath, JSON.stringify(local, null, 2) + "\n");
    console.log(`Local data/products.json updated (+${filtered.length} entries).`);
  }

  // 3. Read live JSONBin, append the new entries, write back.
  const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN}/latest`, {
    headers: { "X-Master-Key": KEY },
  });
  if (!r.ok) throw new Error(`bin read failed: ${r.status}`);
  const cur = (await r.json()).record;
  const { tr, en } = unwrap(cur);

  const liveCablesIdx = tr.findIndex((c) => c.id === "cables");
  if (liveCablesIdx < 0) throw new Error("Live cables category not found");
  const liveExistingIds = new Set(tr[liveCablesIdx].products.map((p) => p.id));
  const liveFiltered = newProducts.filter((p) => !liveExistingIds.has(p.id));
  if (liveFiltered.length === 0) {
    console.log("All entries already present in live bin — nothing to write.");
    return;
  }
  tr[liveCablesIdx].products = [...tr[liveCablesIdx].products, ...liveFiltered];

  // The bin uses the wrapped { products, _translations.en } shape. We
  // append to TR; EN gets re-synced on the next admin save (or via
  // scripts/resync-products-en.cjs).
  const next = en
    ? { products: tr, _translations: { en } }
    : { products: tr };
  const w = await fetch(`https://api.jsonbin.io/v3/b/${BIN}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(next),
  });
  if (!w.ok) {
    const err = await w.text();
    throw new Error(`bin write failed: ${w.status} ${err}`);
  }
  console.log(`OK — live bin updated (+${liveFiltered.length} entries).`);
  console.log("  Run scripts/resync-products-en.cjs to back-fill the EN translations.");
}

main().catch((e) => { console.error(e); process.exit(1); });
