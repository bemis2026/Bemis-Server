// Reads the current TR products from JSONBin and (re)builds the EN translation,
// then writes it back into bin._translations.en. Mirrors data/products-en.json
// locally so it survives next deploy as the fallback seed.
//
// Usage: node scripts/resync-products-en.cjs

const fs = require("fs");
const KEY = process.env.JSONBIN_MASTER_KEY;
if (!KEY) {
  console.error("JSONBIN_MASTER_KEY environment variable is required.");
  console.error("  Usage: JSONBIN_MASTER_KEY=$2a$10$... node " + __filename);
  process.exit(1);
}
const BIN = "69e5093e856a6821894eaee8";

const TRANSLATABLE_PATHS = [
  "[].name",
  "[].tagline",
  "[].subtitle",
  "[].description",

  "[].products[].name",
  "[].products[].subtitle",
  "[].products[].description",
  "[].products[].badge",

  "[].products[].specs[].group",
  "[].products[].specs[].items[].label",
  "[].products[].specs[].items[].value",
];

function walk(node, parts, i, visits) {
  if (node == null) return;
  if (i >= parts.length) return;
  const seg = parts[i];

  if (seg.endsWith("[]")) {
    const key = seg.slice(0, -2);
    const arr = key === "" ? node : node[key];
    if (!Array.isArray(arr)) return;
    if (i === parts.length - 1) {
      arr.forEach((v, idx) => {
        if (typeof v === "string") {
          visits.push({
            getter: () => arr[idx],
            setter: (s) => { arr[idx] = s; },
          });
        }
      });
      return;
    }
    arr.forEach((_, idx) => walk(arr[idx], parts, i + 1, visits));
    return;
  }
  if (i === parts.length - 1) {
    const v = node[seg];
    if (typeof v === "string") {
      visits.push({
        getter: () => node[seg],
        setter: (s) => { node[seg] = s; },
      });
    }
    return;
  }
  walk(node[seg], parts, i + 1, visits);
}

function collect(root) {
  const all = [];
  for (const p of TRANSLATABLE_PATHS) walk(root, p.split("."), 0, all);
  return all;
}

async function translateOne(text) {
  const t = text.trim();
  if (!t) return text;
  if (/^(https?:\/\/|\/|#[0-9a-f]{3,8}|[\d.,+\-/]+)$/i.test(t)) return text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en&de=info@bemis.com.tr`;
    const r = await fetch(url);
    if (!r.ok) return text;
    const d = await r.json();
    const out = d.responseData?.translatedText ?? "";
    if (!out || /MYMEMORY WARNING/i.test(out)) return text;
    return out
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  } catch {
    return text;
  }
}

function unwrap(record) {
  if (Array.isArray(record)) return { tr: record, en: null };
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    return { tr: record.products, en: Array.isArray(record._translations?.en) ? record._translations.en : null };
  }
  return { tr: [], en: null };
}

async function main() {
  const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN}/latest`, {
    headers: { "X-Master-Key": KEY },
  });
  if (!r.ok) throw new Error(`read failed: ${r.status}`);
  const cur = (await r.json()).record;
  const { tr: trCurrent, en: enCurrent } = unwrap(cur);

  let trSnapshot = [];
  try { trSnapshot = JSON.parse(fs.readFileSync("data/products.json", "utf-8")); } catch {}
  let enSeed = [];
  try { enSeed = JSON.parse(fs.readFileSync("data/products-en.json", "utf-8")); } catch {}

  const enResult = JSON.parse(JSON.stringify(trCurrent));

  const trCurVisits = collect(JSON.parse(JSON.stringify(trCurrent)));
  const trSnapVisits = collect(JSON.parse(JSON.stringify(trSnapshot)));
  const enSeedVisits = collect(JSON.parse(JSON.stringify(enSeed)));
  const enCurVisits = enCurrent ? collect(JSON.parse(JSON.stringify(enCurrent))) : [];
  const targetVisits = collect(enResult);

  const toTranslate = [];
  for (let i = 0; i < targetVisits.length; i++) {
    const trVal = trCurVisits[i]?.getter();
    if (trVal == null) continue;

    const trSnap = trSnapVisits[i]?.getter();
    const enSeedVal = enSeedVisits[i]?.getter();
    const enCurVal = enCurVisits[i]?.getter();

    const knownEn = enCurVal ?? enSeedVal;
    if (knownEn != null && trSnap === trVal) {
      targetVisits[i].setter(knownEn);
      continue;
    }
    if (trVal.trim()) toTranslate.push({ idx: i, text: trVal });
    else targetVisits[i].setter(trVal);
  }

  console.log(`translating ${toTranslate.length} changed product strings…`);
  const CONC = 4;
  let cursor = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (true) {
      const j = cursor++;
      if (j >= toTranslate.length) break;
      const { idx, text } = toTranslate[j];
      const out = await translateOne(text);
      targetVisits[idx].setter(out);
      process.stdout.write(`  [${j + 1}/${toTranslate.length}] ${text.slice(0, 50)} → ${out.slice(0, 50)}\n`);
    }
  }));

  const next = { products: trCurrent, _translations: { en: enResult } };
  const w = await fetch(`https://api.jsonbin.io/v3/b/${BIN}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(next),
  });
  if (!w.ok) {
    const err = await w.text();
    throw new Error(`write failed: ${w.status} ${err}`);
  }
  console.log("OK — products EN written into bin._translations.en");

  fs.writeFileSync("data/products-en.json", JSON.stringify(enResult, null, 2) + "\n");
  console.log("OK — data/products-en.json updated locally");
}

main().catch(e => { console.error(e); process.exit(1); });
