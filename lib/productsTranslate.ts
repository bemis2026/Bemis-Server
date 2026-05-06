import { translateBatch } from "./translate";

// Path notation for products (root is an array of categories):
//   "[].field"          — every category's .field
//   "[].arr[].field"    — every category's .arr items' .field
const TRANSLATABLE_PATHS: string[] = [
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type Visit = { getter: () => string; setter: (v: string) => void };

function walk(node: Any, parts: string[], i: number, visits: Visit[]) {
  if (node == null) return;
  if (i >= parts.length) return;
  const seg = parts[i];

  if (seg.endsWith("[]")) {
    const key = seg.slice(0, -2);
    const arr: Any = key === "" ? node : node[key];
    if (!Array.isArray(arr)) return;
    if (i === parts.length - 1) {
      arr.forEach((v, idx) => {
        if (typeof v === "string") {
          visits.push({
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

  if (i === parts.length - 1) {
    const v = node[seg];
    if (typeof v === "string") {
      visits.push({
        getter: () => node[seg],
        setter: (s: string) => { node[seg] = s; },
      });
    }
    return;
  }

  walk(node[seg], parts, i + 1, visits);
}

function collectVisits(root: Any): Visit[] {
  const all: Visit[] = [];
  for (const p of TRANSLATABLE_PATHS) walk(root, p.split("."), 0, all);
  return all;
}

export async function translateProducts(
  tr: Any[],
  prevTr: Any[] | null,
  prevEn: Any[] | null,
): Promise<Any[]> {
  const clone: Any[] = JSON.parse(JSON.stringify(tr));
  const visits = collectVisits(clone);
  const prevTrVisits = prevTr ? collectVisits(JSON.parse(JSON.stringify(prevTr))) : [];
  const prevEnVisits = prevEn ? collectVisits(JSON.parse(JSON.stringify(prevEn))) : [];

  const toTranslateIdx: number[] = [];
  const toTranslateText: string[] = [];

  visits.forEach((v, idx) => {
    const trVal = v.getter();
    const prevTrVal = prevTrVisits[idx]?.getter();
    const prevEnVal = prevEnVisits[idx]?.getter();

    if (prevTrVal != null && prevEnVal != null && prevTrVal === trVal) {
      v.setter(prevEnVal);
      return;
    }

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
