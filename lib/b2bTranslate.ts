// Path list for the b2b bin (covers /b2b, /bayilik, /operator pages plus the
// homepage B2BCta block). Mirrors the content walker's path notation:
//   "a.b.c"        — nested object
//   "arr[].field"  — every item in arr, take .field
//   "obj.*.field"  — every value in record-like object, take .field
//
// Anything NOT listed is preserved verbatim in EN (so URLs, hrefs, ids stay TR).
export const B2B_TRANSLATABLE_PATHS: string[] = [
  // Hero (used by /b2b page)
  "hero.eyebrow", "hero.heading1", "hero.heading2", "hero.description",
  "hero.sectorTags[]",

  // Homepage CTA block
  "cta.eyebrow", "cta.heading", "cta.description", "cta.tags[]",
  "cta.channels[].label", "cta.channels[].sub",

  // Bayilik page
  "bayilik.heading1", "bayilik.heading2", "bayilik.description",
  "bayilik.benefits[].title", "bayilik.benefits[].body",
  "bayilik.criteria[]",
  "bayilik.trCriteria[]", "bayilik.intlCriteria[]",
  "bayilik.networkStats[].label",
  "bayilik.infoTable[].label", "bayilik.infoTable[].value",
  "bayilik.marketingEvents[].title", "bayilik.marketingEvents[].location", "bayilik.marketingEvents[].date",

  // Operator page
  "operator.heading1", "operator.heading2", "operator.description",
  "operator.capabilities[].title", "operator.capabilities[].body",
  "operator.ocppFeatures[]",

  // OEM applications gallery (replaces the 6-bullet advantages section)
  "applications[].title", "applications[].body",
];
