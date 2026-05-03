// Reads the current TR from JSONBin and the curated EN seed (data/content-en.json
// + its mirror data/content.json snapshot). For every translatable string:
//   - if current TR === snapshot TR → keep curated EN (no API call)
//   - else translate via MyMemory and patch into EN
// Then writes the refreshed EN into bin._translations.en.

const fs = require("fs");
const KEY = process.env.JSONBIN_MASTER_KEY || "$2a$10$zWJKdAUgfHbBy/CeORFuGesiyZ/OdkdVHfK9AiQfwg1fAfbTlnCH.";
const BIN = "69e5093daaba88219716e044";

const TRANSLATABLE_PATHS = [
  "hero.badge", "hero.headline1", "hero.headline2", "hero.headline3",
  "hero.subtitle", "hero.ctaPrimary", "hero.ctaSecondary",
  "stats[].label", "stats[].description",
  "categories.*.name", "categories.*.subtitle", "categories.*.description", "categories.*.badge",
  "featured[].badge", "featured[].highlight",
  "dna.sectionLabel", "dna.sectionHeading", "dna.brandHeading",
  "dna.brandPara1", "dna.brandPara2", "dna.quote", "dna.quoteAttr",
  "dna.ctaLabel", "dna.yearSub",
  "dna.highlights[].title", "dna.highlights[].desc",
  "dna.features[].title", "dna.features[].desc",
  "products.heading", "products.subheading", "products.sectionLabel",
  "products.allProductsLabel", "products.viewLabel", "products.allProductsDescription",
  "dealer.sectionLabel", "dealer.heading", "dealer.description", "dealer.applyText",
  "dealer.findDealerTitle", "dealer.contactBtnLabel",
  "dealer.citiesLabel", "dealer.activeDealersLabel",
  "dealer.mapHint", "dealer.mapTitle",
  "reviews.sectionLabel", "reviews.heading", "reviews.subheading",
  "reviews.ratingLabel", "reviews.platformsPrefix", "reviews.ratingCountSuffix",
  "reviews.items[].author", "reviews.items[].date", "reviews.items[].product", "reviews.items[].text",
  "contactSection.sectionLabel", "contactSection.heading", "contactSection.subheading",
  "featuredSection.sectionLabel", "featuredSection.heading",
  "featuredSection.subheading", "featuredSection.ctaLabel",
  "smartCharger.sectionLabel", "smartCharger.heading", "smartCharger.subheading",
  "smartCharger.ocppBadge", "smartCharger.ctaLabel",
  "smartCharger.features[].title", "smartCharger.features[].desc",
  "productShowcase.badge", "productShowcase.name", "productShowcase.tagline",
  "productShowcase.description", "productShowcase.ctaPrimary", "productShowcase.ctaSecondary",
  "productShowcase.specs[].label", "productShowcase.specs[].value",
  "productShowcase.overlayFeatures[]",
  "productShowcase.products[].badge", "productShowcase.products[].name",
  "productShowcase.products[].tagline", "productShowcase.products[].description",
  "productShowcase.products[].ctaPrimary", "productShowcase.products[].ctaSecondary",
  "productShowcase.products[].specs[].label", "productShowcase.products[].specs[].value",
  "calculator.sectionLabel", "calculator.heading", "calculator.subheading",
  "calculator.tabCharge", "calculator.tabSavings", "calculator.chargeSimLabel",
  "navbar.ctaLabel",
  "navbar.links[].label",
  "footer.description", "footer.followLabel", "footer.copyright", "footer.rightsLabel",
  "footer.tagline", "footer.b2bText", "footer.b2bLinkText", "footer.b2bSuffix",
  "technology.sectionLabel", "technology.heading",
  "technology.features[].title", "technology.features[].desc",
];

function walk(node, parts, i, visits) {
  if (node == null) return;
  if (i >= parts.length) return;
  const seg = parts[i];

  if (seg.endsWith("[]")) {
    const key = seg.slice(0, -2);
    const arr = node[key];
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
  if (seg === "*") {
    if (typeof node !== "object") return;
    for (const k of Object.keys(node)) walk(node[k], parts, i + 1, visits);
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

async function main() {
  // 1. Pull current TR + curated EN from bin.
  const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN}/latest`, {
    headers: { "X-Master-Key": KEY },
  });
  if (!r.ok) throw new Error(`read failed: ${r.status}`);
  const cur = (await r.json()).record;
  const { _translations, ...trCurrent } = cur;
  const enCurrent = _translations?.en ?? null;

  // 2. Snapshot TR (what curated EN was based on) lives in repo.
  const trSnapshot = JSON.parse(fs.readFileSync("data/content.json", "utf-8"));
  const enSeed = JSON.parse(fs.readFileSync("data/content-en.json", "utf-8"));

  // 3. Build EN result by deep-cloning TR-current (gives us correct shape),
  //    then for each translatable path:
  //      - if trCurrent === trSnapshot at that path → use curated EN value
  //      - else translate via MyMemory
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

    // Prefer the most recent EN we have (current bin EN > seed file EN).
    const knownEn = enCurVal ?? enSeedVal;

    if (knownEn != null && trSnap === trVal) {
      targetVisits[i].setter(knownEn);
      continue;
    }

    if (trVal.trim()) toTranslate.push({ idx: i, text: trVal });
    else targetVisits[i].setter(trVal);
  }

  console.log(`translating ${toTranslate.length} changed strings…`);
  // Concurrent translate, throttled.
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

  // 4. Write back.
  const next = { ...trCurrent, _translations: { ...(_translations ?? {}), en: enResult } };
  const w = await fetch(`https://api.jsonbin.io/v3/b/${BIN}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(next),
  });
  if (!w.ok) {
    const err = await w.text();
    throw new Error(`write failed: ${w.status} ${err}`);
  }
  console.log("OK — EN re-synced and written into bin._translations.en");

  // 5. Mirror to local file so it survives next deploy as the new seed.
  fs.writeFileSync("data/content-en.json", JSON.stringify(enResult, null, 2) + "\n");
  console.log("OK — data/content-en.json updated locally");
}

main().catch(e => { console.error(e); process.exit(1); });
