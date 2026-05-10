import { translateBatch } from "./translate";

// Path notation:
//   "a.b.c"        — nested object
//   "arr[].field"  — every item in arr, take .field
//   "obj.*.field"  — every value in record-like object, take .field
//
// Add new translatable fields here. Anything NOT listed is preserved verbatim
// in EN (so URLs, hrefs, hex colors, image paths, layout coords stay TR).
const TRANSLATABLE_PATHS: string[] = [
  "hero.badge", "hero.headline1", "hero.headline2", "hero.headline3",
  "hero.subtitle", "hero.ctaPrimary", "hero.ctaSecondary",
  "hero.headline2Words[]",

  "stats[].label", "stats[].description",

  "categories.*.name", "categories.*.subtitle", "categories.*.description", "categories.*.badge",
  "categories.*.faq[].q", "categories.*.faq[].a",
  "warranty.duration", "warranty.certification",

  "featured[].badge", "featured[].highlight",

  "dna.sectionLabel", "dna.sectionHeading", "dna.brandHeading",
  "dna.brandPara1", "dna.brandPara2", "dna.quote", "dna.quoteAttr",
  "dna.ctaLabel", "dna.yearSub",
  "dna.highlights[].title", "dna.highlights[].desc",
  "dna.features[].title", "dna.features[].desc",
  "dna.timeline[].title", "dna.timeline[].desc",
  "dna.certifications[].sub",
  "dna.groupBrandsTitle", "dna.groupBrandsBody",

  "products.heading", "products.subheading", "products.sectionLabel",
  "products.allProductsLabel", "products.viewLabel", "products.allProductsDescription",

  "dealer.sectionLabel", "dealer.heading", "dealer.description", "dealer.applyText",
  "dealer.findDealerTitle", "dealer.contactBtnLabel",
  "dealer.citiesLabel", "dealer.activeDealersLabel",
  "dealer.mapHint", "dealer.mapTitle",
  "dealer.regionReps[].title",
  "dealer.internationalDealers[].countryName",
  "dealer.internationalDealers[].city",
  "dealer.internationalDealers[].address",
  "dealer.internationalDealers[].notes",
  "dealer.exportContact.title",
  "dealer.exportContact.hours",
  "dealer.worldSection.sectionLabel",
  "dealer.worldSection.heading",
  "dealer.worldSection.introTitle",
  "dealer.worldSection.introDescription",
  "dealer.worldSection.languagesNote",

  "reviews.sectionLabel", "reviews.heading", "reviews.subheading",
  "reviews.ratingLabel", "reviews.platformsPrefix", "reviews.ratingCountSuffix",
  "reviews.items[].author", "reviews.items[].date", "reviews.items[].product", "reviews.items[].text",

  "contactSection.sectionLabel", "contactSection.heading", "contactSection.subheading",

  "featuredSection.sectionLabel", "featuredSection.heading",
  "featuredSection.subheading", "featuredSection.ctaLabel",

  "referenceProjectsSection.sectionLabel", "referenceProjectsSection.heading",
  "referenceProjectsSection.subheading",
  "referenceProjectsSection.items[].title",
  "referenceProjectsSection.items[].location",
  "referenceProjectsSection.items[].description",

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type Visit = { path: string; getter: () => string; setter: (v: string) => void };

function walkPath(root: Any, path: string, visits: Visit[]) {
  const parts = path.split(".");
  walk(root, parts, 0, visits);
}

function walk(node: Any, parts: string[], i: number, visits: Visit[]) {
  if (node == null) return;
  if (i >= parts.length) return;
  const seg = parts[i];

  if (seg.endsWith("[]")) {
    const key = seg.slice(0, -2);
    const arr = node[key];
    if (!Array.isArray(arr)) return;
    // Trailing "[]" with no following segment → array of primitive strings.
    if (i === parts.length - 1) {
      arr.forEach((v, idx) => {
        if (typeof v === "string") {
          visits.push({
            path: `${key}[${idx}]`,
            getter: () => arr[idx],
            setter: (s: string) => { arr[idx] = s; },
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
        path: seg,
        getter: () => node[seg],
        setter: (s: string) => { node[seg] = s; },
      });
    }
    return;
  }

  walk(node[seg], parts, i + 1, visits);
}

function collectVisits(root: Any, paths: string[] = TRANSLATABLE_PATHS): Visit[] {
  const all: Visit[] = [];
  for (const p of paths) walkPath(root, p, all);
  return all;
}

// Read TR's translatable values; if `prevTr` provides the same value at the
// same logical path AND `prevEn` has a value there, reuse it. Otherwise call
// the translation API.
//
// Returns a new content object that mirrors TR's shape but with EN strings in
// the translatable slots.
export async function translateContent(
  tr: Any,
  prevTr: Any | null,
  prevEn: Any | null,
  paths: string[] = TRANSLATABLE_PATHS,
): Promise<Any> {
  // Deep clone TR — we'll mutate the clone in place.
  const clone: Any = JSON.parse(JSON.stringify(tr));
  const visits = collectVisits(clone, paths);

  // For diffing, we need the same visit order on prevTr and prevEn.
  const prevTrVisits = prevTr ? collectVisits(JSON.parse(JSON.stringify(prevTr)), paths) : [];
  const prevEnVisits = prevEn ? collectVisits(JSON.parse(JSON.stringify(prevEn)), paths) : [];

  const toTranslateIdx: number[] = [];
  const toTranslateText: string[] = [];

  visits.forEach((v, idx) => {
    const trVal = v.getter();
    const prevTrVal = prevTrVisits[idx]?.getter();
    const prevEnVal = prevEnVisits[idx]?.getter();

    // If prev TR matches and prev EN exists, reuse — saves API calls.
    if (prevTrVal != null && prevEnVal != null && prevTrVal === trVal) {
      v.setter(prevEnVal);
      return;
    }

    // Otherwise queue for translation.
    if (trVal && trVal.trim()) {
      toTranslateIdx.push(idx);
      toTranslateText.push(trVal);
    }
  });

  if (toTranslateText.length === 0) return clone;

  const translated = await translateBatch(toTranslateText, "tr", "en");
  toTranslateIdx.forEach((visitIdx, k) => {
    visits[visitIdx].setter(translated[k] || visits[visitIdx].getter());
  });

  return clone;
}
