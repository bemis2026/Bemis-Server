// Patch missing fields into the content + b2b bins' `_translations.en` blocks
// without disturbing existing translations. Adds:
//   content bin → calculator.* + productShowcase.overlayFeatures + dealer.regionReps[merkez slot]
//   b2b bin     → triggers a fresh translateContent() pass over the whole TR
//
// Usage:
//   JSONBIN_MASTER_KEY=$2a$10$... node scripts/patch-en-fields.cjs

const KEY = process.env.JSONBIN_MASTER_KEY;
if (!KEY) {
  console.error("JSONBIN_MASTER_KEY environment variable is required.");
  process.exit(1);
}

const CONTENT_BIN = "69e5093daaba88219716e044";
const B2B_BIN = "69e5093d36566621a8cd7509"; // Bemis – b2b bin

async function readBin(id) {
  const r = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`, {
    headers: { "X-Master-Key": KEY },
  });
  if (!r.ok) throw new Error(`read ${id} failed: ${r.status}`);
  return (await r.json()).record;
}

async function writeBin(id, body) {
  const r = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`write ${id} failed: ${r.status} ${t}`);
  }
}

async function translateOne(text) {
  const t = String(text ?? "").trim();
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
  } catch { return text; }
}

async function patchContent() {
  console.log("→ patching content bin");
  const cur = await readBin(CONTENT_BIN);
  const en = cur._translations?.en ?? {};
  const tr = { ...cur };
  delete tr._translations;

  // 0. hero.headline2Words (rotating words → translate in same order)
  if (Array.isArray(tr.hero?.headline2Words)) {
    const trWords = tr.hero.headline2Words;
    const enWords = Array.isArray(en.hero?.headline2Words) ? en.hero.headline2Words : [];
    const aligned = await Promise.all(trWords.map(async (w, i) => {
      const existing = enWords[i];
      if (existing && typeof existing === "string" && existing.trim()) return existing;
      if (typeof w === "string" && w.trim()) return await translateOne(w);
      return w;
    }));
    en.hero = { ...(en.hero ?? {}), headline2Words: aligned };
    if (aligned.length > 0) console.log(`  hero.headline2Words: ${aligned.join(" / ")}`);
  }

  // 1. calculator (translate from current TR if missing in EN)
  if (!en.calculator && tr.calculator) {
    const calc = {};
    for (const k of Object.keys(tr.calculator)) {
      const v = tr.calculator[k];
      if (typeof v === "string" && v.trim()) {
        calc[k] = await translateOne(v);
        process.stdout.write(`  calculator.${k}: ${v.slice(0,40)} → ${calc[k].slice(0,40)}\n`);
      } else {
        calc[k] = v;
      }
    }
    en.calculator = calc;
  }

  // 2. productShowcase.overlayFeatures (translate)
  if (tr.productShowcase?.overlayFeatures && (!en.productShowcase?.overlayFeatures)) {
    const ov = await Promise.all(tr.productShowcase.overlayFeatures.map(translateOne));
    en.productShowcase = { ...(en.productShowcase ?? {}), overlayFeatures: ov };
    console.log(`  overlayFeatures: ${ov.join(" / ")}`);
  }

  // 3. dealer.regionReps — make sure EN has same length as TR (merkez slot added)
  if (Array.isArray(tr.dealer?.regionReps)) {
    const trReps = tr.dealer.regionReps;
    const enReps = Array.isArray(en.dealer?.regionReps) ? en.dealer.regionReps : [];
    const aligned = await Promise.all(trReps.map(async (r, i) => {
      const existing = enReps[i] ?? {};
      const title = existing.title || (r.title ? await translateOne(r.title) : r.title);
      return { ...r, ...existing, title };
    }));
    en.dealer = { ...(en.dealer ?? {}), regionReps: aligned };
    console.log(`  dealer.regionReps: aligned ${aligned.length} entries`);
  }

  // 4. dealer.worldSection — Yurtdışı tab copy (sectionLabel/heading/intro/note)
  if (tr.dealer?.worldSection) {
    const trWS = tr.dealer.worldSection;
    const enWS = en.dealer?.worldSection ?? {};
    const fields = ["sectionLabel", "heading", "introTitle", "introDescription", "languagesNote"];
    const out = { ...enWS };
    for (const f of fields) {
      const tv = trWS[f];
      if (typeof tv === "string" && tv.trim() && !out[f]) {
        out[f] = await translateOne(tv);
        process.stdout.write(`  worldSection.${f}: ${tv.slice(0,50)} → ${out[f].slice(0,50)}\n`);
      } else if (typeof tv === "string" && !out[f]) {
        out[f] = tv;
      }
    }
    out.languages = trWS.languages ?? out.languages ?? [];
    en.dealer = { ...(en.dealer ?? {}), worldSection: out };
  }

  // 5. dealer.exportContact — title + hours auto-translated
  if (tr.dealer?.exportContact) {
    const trEC = tr.dealer.exportContact;
    const enEC = en.dealer?.exportContact ?? {};
    const out = { ...trEC, ...enEC };
    if (trEC.title && (!enEC.title)) {
      out.title = await translateOne(trEC.title);
      console.log(`  exportContact.title: ${trEC.title} → ${out.title}`);
    }
    if (trEC.hours && (!enEC.hours)) {
      out.hours = await translateOne(trEC.hours);
      console.log(`  exportContact.hours: ${trEC.hours} → ${out.hours}`);
    }
    en.dealer = { ...(en.dealer ?? {}), exportContact: out };
  }

  // 6. dealer.internationalDealers — translate countryName/city/address/notes
  if (Array.isArray(tr.dealer?.internationalDealers)) {
    const trIntl = tr.dealer.internationalDealers;
    const enIntl = Array.isArray(en.dealer?.internationalDealers) ? en.dealer.internationalDealers : [];
    const enById = {};
    for (const e of enIntl) if (typeof e?.id === "string") enById[e.id] = e;
    const out = await Promise.all(trIntl.map(async (c) => {
      const existing = enById[c.id] ?? {};
      const result = { ...c, ...existing };
      const fields = ["countryName", "city", "address", "notes"];
      for (const f of fields) {
        const tv = c[f];
        if (typeof tv === "string" && tv.trim() && !existing[f]) {
          result[f] = await translateOne(tv);
        }
      }
      return result;
    }));
    en.dealer = { ...(en.dealer ?? {}), internationalDealers: out };
    console.log(`  dealer.internationalDealers: ${out.length} entries`);
  }

  const next = { ...tr, _translations: { ...(cur._translations ?? {}), en } };
  await writeBin(CONTENT_BIN, next);
  console.log("✓ content bin updated");
}

async function patchB2B() {
  console.log("→ patching b2b bin");
  const cur = await readBin(B2B_BIN);
  const en = cur._translations?.en ?? null;
  const tr = { ...cur };
  delete tr._translations;

  // Recursive walker translates any TR string value into EN, reusing existing
  // EN values where they already exist for the same path. Skips href / id-ish
  // values via the regex check inside translateOne.
  async function walk(trNode, enNode) {
    if (Array.isArray(trNode)) {
      const out = [];
      for (let i = 0; i < trNode.length; i++) {
        out.push(await walk(trNode[i], Array.isArray(enNode) ? enNode[i] : undefined));
      }
      return out;
    }
    if (trNode && typeof trNode === "object") {
      const out = {};
      for (const k of Object.keys(trNode)) {
        out[k] = await walk(trNode[k], enNode?.[k]);
      }
      return out;
    }
    if (typeof trNode === "string") {
      // Skip translation for href-like / id-like keys is hard from inside the
      // walker; rely on translateOne's regex to keep URLs intact.
      if (typeof enNode === "string" && enNode.trim()) return enNode;
      return await translateOne(trNode);
    }
    return trNode;
  }

  // Don't translate href fields — overlay them after the walk.
  const enResult = await walk(tr, en ?? {});

  // Restore href fields verbatim from TR.
  if (Array.isArray(enResult.cta?.channels) && Array.isArray(tr.cta?.channels)) {
    enResult.cta.channels = enResult.cta.channels.map((c, i) => ({ ...c, href: tr.cta.channels[i]?.href ?? c.href }));
  }

  // featuredProducts is structural, copy as-is.
  enResult.featuredProducts = tr.featuredProducts;

  const next = { ...tr, _translations: { ...(cur._translations ?? {}), en: enResult } };
  await writeBin(B2B_BIN, next);
  console.log("✓ b2b bin updated");
}

async function main() {
  await patchContent();
  await patchB2B();
}
main().catch(e => { console.error(e); process.exit(1); });
