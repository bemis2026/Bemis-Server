// İngilizce (/en) ürün & kategori SEO metinleri — TEK KAYNAK.
// /en/products/[id] ve /en/products/[id]/[productId] sayfaları buradan okur.
//
// İhracat/OEM anahtar kelimelerine göre ELLE yazıldı (otomatik çeviriden güçlü).
// ⚠️ Gerçek ürün aralıklarıyla uyumlu — uydurma spec YOK.
import { productNameEn } from "./productNamesEn";

export const EN_CATEGORY_SEO: Record<string, { name: string; title: string; description: string }> = {
  "wallbox": {
    name: "AC Wallbox EV Chargers",
    title: "AC Wallbox EV Charger Manufacturer (7.4–22 kW, OCPP)",
    description: "Type 2 AC wallbox EV chargers, 7.4–22 kW, single & three-phase, IP65, OCPP-ready. Manufactured in Türkiye since 1994. OEM/ODM, private label & wholesale export.",
  },
  "portable": {
    name: "Portable EV Chargers",
    title: "Portable EV Charger Manufacturer (Type 2, adjustable 6–32 A)",
    description: "Portable / mobile Type 2 EV chargers, adjustable 6–32 A, plug-and-charge — no installation. CE, IP65. Manufactured in Türkiye. OEM & wholesale export.",
  },
  "cables": {
    name: "EV Charging Cables",
    title: "Type 2 EV Charging Cable Manufacturer (Mode 3, 16–32 A)",
    description: "Type 2 / Mode 3 EV charging cables, 16–32 A, single & three-phase, 3–15 m, halogen-free. CE, IEC 62196. Manufactured in Türkiye. OEM & wholesale export.",
  },
  "v2l-c2l": {
    name: "V2L / C2L Adapters",
    title: "V2L & C2L Adapter Manufacturer for Electric Vehicles",
    description: "Vehicle-to-Load (V2L) and C2L adapters for EVs — power your devices and appliances from your car. Brand-compatible, CE. Manufactured in Türkiye, export worldwide.",
  },
  "converters": {
    name: "EV Charging Extensions & Adapters",
    title: "EV Charging Extension Cables & Adapters Manufacturer",
    description: "EV charging extension cables and adapters / converters, Type 2 compatible. CE. Manufactured in Türkiye. OEM & wholesale export to 60+ countries.",
  },
  "charger-equipment": {
    name: "EV Charger Components",
    title: "EV Charger Components & EVSE Spare Parts Supplier",
    description: "EVSE components, connectors, sockets and spare parts for EV chargers. OEM supply for charge-point manufacturers and operators. Made in Türkiye.",
  },
  "accessories": {
    name: "EV Charging Accessories",
    title: "EV Charging Accessories Manufacturer & Supplier",
    description: "EV charging accessories — connector holders, carry bags, cable management and more. CE. Manufactured in Türkiye, wholesale export.",
  },
  "dc-units": {
    name: "DC Fast Chargers",
    title: "DC Fast Charger Manufacturer (CCS2 / CHAdeMO, OCPP)",
    description: "DC fast chargers with CCS2 / CHAdeMO connectors, OCPP-ready. Manufactured in Türkiye. OEM/ODM and wholesale export for operators and distributors.",
  },
};

export function enCategoryMeta(id: string, fallbackName: string) {
  return EN_CATEGORY_SEO[id] ?? {
    name: fallbackName,
    title: `${fallbackName} — Manufacturer | Bemis E-V Charge`,
    description: `${fallbackName} manufactured in Türkiye by Bemis E-V Charge. CE certified. OEM/ODM & wholesale export.`,
  };
}

// ── Ürün meta'sı ─────────────────────────────────────────────────────────────
// 150+ ürün için elle metin yazmak yerine, ürünün KENDİ spec'lerinden türetilir.
// ⚠️ Yalnız veride GERÇEKTEN olan değerler kullanılır (uydurma yok). Spec
// ETİKETLERİ Türkçe (Güç / Faz / Kablo Uzunluğu…) ama DEĞERLER dil-nötr (22 kW, 5m).
type SpecItem = { label?: string; value?: string };
type SpecGroup = { group?: string; items?: SpecItem[] };
type ProductLike = { name?: string; specs?: SpecGroup[] };

function specValue(product: ProductLike, labelPattern: RegExp): string | null {
  for (const g of product.specs ?? []) {
    const it = (g.items ?? []).find((i) => i?.label && labelPattern.test(i.label));
    if (it?.value) return String(it.value).trim();
  }
  return null;
}

/** Ürünün spec'lerinden İngilizce, olgusal bir "öne çıkanlar" dizisi üretir. */
export function enProductHighlights(product: ProductLike): string[] {
  const bits: string[] = [];
  const power = specValue(product, /güç|power/i);
  if (power) bits.push(power.replace(",", "."));           // "3,7 kW" → "3.7 kW"
  const phase = specValue(product, /^faz$|phase/i);
  if (phase) {
    if (/trifaze|three/i.test(phase)) bits.push("three-phase");
    else if (/monofaze|single/i.test(phase)) bits.push("single-phase");
  }
  const amp = specValue(product, /maks.*akım|current/i);
  if (amp) bits.push(amp);
  const len = specValue(product, /kablo uzunlu|cable length/i);
  if (len) bits.push(`${len} cable`);
  const conn = specValue(product, /konnektör|connector/i);
  if (conn) bits.push(conn.replace(/\s*\(.*?\)\s*/g, "").trim()); // "Type 2 — Type 2"
  return bits.filter(Boolean);
}

/** İngilizce ürün meta başlığı + açıklaması (spec-türetimli, olgusal). */
export function enProductMeta(product: ProductLike, categoryId: string, fallbackCategoryName: string) {
  const enName = productNameEn(product.name);
  const cat = enCategoryMeta(categoryId, fallbackCategoryName);
  const bits = enProductHighlights(product);
  const title = `${enName} — ${cat.name} | Bemis E-V Charge`;
  const specLine = bits.length ? `${bits.join(" · ")}. ` : "";
  const description =
    `${enName} — ${specLine}Manufactured by Bemis E-V Charge in Bursa, Türkiye. ` +
    `Contact us for pricing, wholesale and OEM / private-label orders.`;
  return { enName, title, description, categoryName: cat.name };
}
