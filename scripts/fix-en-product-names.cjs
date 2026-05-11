// Repair the productsEn / productsEnExtra bins by overwriting every
// product `.name` and category `.name` with the TR-source value.
//
// Why: MyMemory had translated brand/model names ("Mini Mobile" →
// "Pro Mobile", "Mono Mobile" → "Şarj Seti 20A Monofaze"), which
// then collided with sibling products and merged them into a single
// card via the variant-by-name grouper on the public listing.
//
// After this script runs once, future admin saves will keep the
// names intact because lib/productsTranslate.ts no longer includes
// `[].name` and `[].products[].name` in TRANSLATABLE_PATHS.
//
// Usage:
//   JSONBIN_MASTER_KEY=$2a$10$... node scripts/fix-en-product-names.cjs

const KEY = process.env.JSONBIN_MASTER_KEY;
if (!KEY) {
  console.error("JSONBIN_MASTER_KEY environment variable is required.");
  process.exit(1);
}

const BINS = [
  { tr: "69e5093e856a6821894eaee8", en: "69fbc8a0c0954111d8e8ed31", label: "products / productsEn" },
  { tr: "69fbcdf1c0954111d8e90670", en: "69fbcdf2250b1311c313f456", label: "productsExtra / productsEnExtra" },
];

const BASE = "https://api.jsonbin.io/v3/b";

async function readBin(id) {
  const r = await fetch(`${BASE}/${id}/latest`, { headers: { "X-Master-Key": KEY } });
  if (!r.ok) throw new Error(`read ${id} failed: ${r.status}`);
  return (await r.json()).record;
}
async function writeBin(id, body) {
  const r = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`write ${id} failed: ${r.status} ${await r.text()}`);
}

// TR bin record can be either [...] (legacy) or { products: [...] }.
// EN bin record can be either [...] (legacy) or { en: [...] }.
// Return [ array, putBack(updatedArray) ] so we write back in the
// original shape.
function unwrapTr(rec) {
  if (Array.isArray(rec)) return [rec, arr => arr];
  if (rec && Array.isArray(rec.products)) return [rec.products, arr => ({ ...rec, products: arr })];
  return [null, null];
}
function unwrapEn(rec) {
  if (Array.isArray(rec)) return [rec, arr => arr];
  if (rec && Array.isArray(rec.en)) return [rec.en, arr => ({ ...rec, en: arr })];
  return [null, null];
}

(async () => {
  for (const { tr, en, label } of BINS) {
    console.log(`\n[${label}]`);
    const trRec = await readBin(tr);
    const enRec = await readBin(en);
    const [trData] = unwrapTr(trRec);
    const [enData, enPutBack] = unwrapEn(enRec);
    if (!trData || !enData) {
      console.warn(`  Skipping — unrecognised bin shape (TR: ${typeof trRec}, EN: ${typeof enRec})`);
      continue;
    }

    let fixes = 0;
    const trByCat = new Map(trData.map(c => [c.id, c]));
    for (const enCat of enData) {
      const trCat = trByCat.get(enCat.id);
      if (!trCat) continue;
      if (enCat.name !== trCat.name) {
        console.log(`  Category ${enCat.id}.name: "${enCat.name}" → "${trCat.name}"`);
        enCat.name = trCat.name;
        fixes++;
      }
      const trProdById = new Map((trCat.products ?? []).map(p => [p.id, p]));
      for (const enProd of (enCat.products ?? [])) {
        const trProd = trProdById.get(enProd.id);
        if (!trProd) continue;
        if (enProd.name !== trProd.name) {
          console.log(`  Product ${enCat.id}/${enProd.id}.name: "${enProd.name}" → "${trProd.name}"`);
          enProd.name = trProd.name;
          fixes++;
        }
      }
    }

    if (fixes === 0) {
      console.log(`  No fixes needed.`);
      continue;
    }
    console.log(`  Writing ${fixes} fix(es) to EN bin…`);
    await writeBin(en, enPutBack(enData));
    console.log(`  Done.`);
  }
  console.log("\nAll EN bins repaired. ✓");
})().catch(e => { console.error(e); process.exit(1); });
