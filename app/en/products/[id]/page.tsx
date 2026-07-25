import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, ogImage, OG_URL } from "../../../lib/seo";
import { getServerProducts } from "../../../lib/server-content";
import { productNameEn } from "../../../lib/productNamesEn";
import { getContentForLang } from "../../../../lib/contentLang";
import ProductCategoryClient from "../../../products/[id]/ProductCategoryClient";

// İngilizce (indekslenebilir) kategori sayfaları — /en/products/<kategori>.
// TR karşılığı /products/<kategori>; hreflang ile karşılıklı bağlı. İçerik
// LanguageContext tarafından İngilizce zorlanır (lib/languages ENGLISH_ONLY_PATHS
// → /en/* ). ProductCategoryClient bu yolda lang="en" ile /api/products?lang=en
// çeker → gövde İngilizce render olur; metadata + JSON-LD burada sunucuda İngilizce.
//
// ⚠️ Statik (ISR): TR sayfasıyla aynı 8 kategori; dynamicParams=false → bilinmeyen
// /en/products/<x> 404 (ISR write amplifikasyonu yok). revalidate 1 gün.
export const dynamicParams = false;
export const revalidate = 86400;

const CATEGORY_IDS = [
  "wallbox", "portable", "cables", "v2l-c2l",
  "converters", "charger-equipment", "accessories", "dc-units",
];

export function generateStaticParams() {
  return CATEGORY_IDS.map((id) => ({ id }));
}

// İhracat/OEM anahtar kelimelerine göre elle yazılmış İngilizce meta (otomatik
// çeviriden daha güçlü). Gerçek ürün aralıklarıyla uyumlu — uydurma spec YOK.
const EN_SEO: Record<string, { name: string; title: string; description: string }> = {
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

function enMeta(id: string, fallbackName: string) {
  return EN_SEO[id] ?? {
    name: fallbackName,
    title: `${fallbackName} — Manufacturer | Bemis E-V Charge`,
    description: `${fallbackName} manufactured in Türkiye by Bemis E-V Charge. CE certified. OEM/ODM & wholesale export.`,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!CATEGORY_IDS.includes(id)) {
    return { title: "Category not found", description: "Browse all products at /en/products." };
  }
  // İngilizce kategori adı (çeviri) — fallback için.
  let enName = id;
  try {
    const en = (await getContentForLang("en")) as { categories?: Record<string, { name?: string }> } | null;
    enName = en?.categories?.[id]?.name || id;
  } catch {}
  const m = enMeta(id, enName);
  const canonical = `/en/products/${id}`;
  const trCanonical = `/products/${id}`;
  const title = `${m.title} | Bemis E-V Charge`;
  return {
    title,
    description: m.description,
    alternates: {
      canonical,
      languages: { en: canonical, tr: trCanonical, "x-default": trCanonical },
    },
    openGraph: {
      title, description: m.description, type: "website", url: canonical,
      locale: "en_US", images: ogImage(m.title),
    },
    twitter: { card: "summary_large_image", title, description: m.description, images: [OG_URL] },
  };
}

export default async function EnProductCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getServerProducts();
  const category = categories.find((c) => c.id === id);
  const m = enMeta(id, category?.name || id);
  // Ürün adları veride TR — İngilizce sayfanın JSON-LD'sinde de İngilizce olmalı
  // (Google şemayı okur). Eşlemesi olmayan ad aynen kalır.
  const products = (category?.products ?? []).map((p) => ({ id: p.id, name: productNameEn(p.name), categoryId: id }));
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/en/products" },
      { name: m.name, url: `/en/products/${id}` },
    ]),
    collectionPageSchema({
      name: m.name,
      description: m.description,
      url: `/en/products/${id}`,
      products,
    }),
  ];
  // initialCategory GEÇİLMEZ → client lang="en" ile /api/products?lang=en çeker
  // (İngilizce gövde). /export ile aynı desen (sunucu = SEO metadata, client = içerik).
  return (
    <>
      <JsonLd data={jsonLd} />
      {/* titleOverride → H1 İngilizce (kategori adı kimlik-alanı olduğu için ürün
          verisinde TR sabit; İngilizce sayfada İngilizce H1 SEO için şart). */}
      <ProductCategoryClient titleOverride={m.name} />
    </>
  );
}
