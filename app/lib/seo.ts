export const SITE_URL = "https://www.bemisevcharge.com.tr";
export const SITE_NAME = "Bemis E-V Charge";
export const ORG_LEGAL_NAME = "Bemis Teknik Elektrik A.Ş.";

export type JsonLdObject = Record<string, unknown>;

export type ProductShape = {
  id: string;
  name: string;
  code?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string[];
  /** Optional spec groups — when present and a price group exists
   *  (TR "Fiyat" / EN "Price"), productSchema() emits an Offer block
   *  so the price shows up in Google's rich snippet. */
  specs?: { group: string; items: { label: string; value: string }[] }[];
};

export type CategoryShape = {
  id: string;
  name: string;
  tagline?: string;
  products?: ProductShape[];
};

function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

export function organizationSchema(opts: {
  logo?: string;
  sameAs?: string[];
  phone?: string;
  email?: string;
  address?: { street?: string; locality?: string; region?: string; country?: string };
}): JsonLdObject {
  const sameAs = (opts.sameAs ?? []).filter(Boolean);
  const hasAddr = opts.address && (opts.address.street || opts.address.locality);
  const contactPoints: JsonLdObject[] = [];
  if (opts.phone || opts.email) {
    contactPoints.push({
      "@type": "ContactPoint",
      contactType: "customer service",
      ...(opts.phone && { telephone: opts.phone }),
      ...(opts.email && { email: opts.email }),
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    legalName: ORG_LEGAL_NAME,
    url: SITE_URL,
    ...(opts.logo && { logo: absolute(opts.logo) }),
    foundingDate: "1994",
    foundingLocation: "Bursa, Türkiye",
    ...(sameAs.length > 0 && { sameAs }),
    ...(contactPoints.length > 0 && { contactPoint: contactPoints }),
    ...(hasAddr && {
      address: {
        "@type": "PostalAddress",
        ...(opts.address!.street && { streetAddress: opts.address!.street }),
        ...(opts.address!.locality && { addressLocality: opts.address!.locality }),
        ...(opts.address!.region && { addressRegion: opts.address!.region }),
        addressCountry: opts.address!.country ?? "TR",
      },
    }),
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE_URL}#organization` },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.url),
    })),
  };
}

/**
 * Pull a price out of the product's spec groups. Looks for any group
 * whose name reads "fiyat" (TR) or "price" (EN-translated) and grabs
 * the first numeric value inside. Returns `null` when no parseable
 * number exists — non-numeric admin notes like "Sorunuz" pass through.
 */
function extractOffer(product: ProductShape): { price: number; currency: string } | null {
  if (!product.specs) return null;
  const priceGroup = product.specs.find(g => /fiyat|price/i.test(g.group));
  if (!priceGroup || !priceGroup.items?.length) return null;
  // Prefer "Liste Fiyatı" if present, otherwise first row.
  const item = priceGroup.items.find(i => /liste|list/i.test(i.label)) ?? priceGroup.items[0];
  if (!item?.value) return null;
  const match = item.value.match(/(\d{1,3}(?:[.,]\d{3})+|\d+)([.,]\d+)?/);
  if (!match) return null;
  const whole = match[1].replace(/[.,]/g, "");
  const frac = match[2] ? match[2].replace(/[.,]/, ".") : "";
  const price = Number(whole + frac);
  if (!isFinite(price) || price <= 0) return null;
  // Operator entered list prices in EUR (see BEMIS_PROJECT_CONTEXT.md);
  // fall back to TRY only if the raw value carries a ₺/TL marker.
  const currency = /₺|\bTL\b/.test(item.value) ? "TRY" : "EUR";
  return { price, currency };
}

export function productSchema(opts: {
  product: ProductShape;
  categoryName?: string;
  categoryId: string;
}): JsonLdObject {
  const { product, categoryName, categoryId } = opts;
  const imgs = [product.image, ...(product.images ?? [])]
    .filter((x): x is string => Boolean(x))
    .map(u => absolute(u))
    .filter((x): x is string => Boolean(x));
  const url = `${SITE_URL}/products/${categoryId}/${product.id}`;
  const offer = extractOffer(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    ...(product.subtitle && { alternateName: product.subtitle }),
    ...(product.description && { description: product.description }),
    ...(imgs.length > 0 && { image: imgs }),
    ...(product.code && { sku: product.code, mpn: product.code }),
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": `${SITE_URL}#organization` },
    ...(categoryName && { category: categoryName }),
    url,
    ...(offer && {
      offers: {
        "@type": "Offer",
        url,
        price: offer.price.toFixed(2),
        priceCurrency: offer.currency,
        // Pricing is "Liste Fiyatı" — valid until end of current year
        // (Bemis revises list prices annually). Conservative date so the
        // markup never serves a stale "still valid" claim.
        priceValidUntil: `${new Date().getFullYear()}-12-31`,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": `${SITE_URL}#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: offer.price.toFixed(2),
          priceCurrency: offer.currency,
          valueAddedTaxIncluded: false,
        },
      },
    }),
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description?: string;
  url: string;
  products?: { id: string; name: string; categoryId: string }[];
}): JsonLdObject {
  const { name, description, url, products } = opts;
  const itemListElement = (products ?? []).map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/products/${p.categoryId}/${p.id}`,
    name: p.name,
  }));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    ...(description && { description }),
    url: absolute(url),
    inLanguage: "tr-TR",
    isPartOf: { "@id": `${SITE_URL}#website` },
    ...(itemListElement.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: itemListElement.length,
        itemListElement,
      },
    }),
  };
}

/**
 * Service schema for the four corporate sub-pages (/b2b, /bayilik,
 * /operator, /kurumsal). These are services Bemis sells, not products,
 * so they need a different markup than Product. Google surfaces them
 * with a richer "service provider" panel + reviews when available.
 */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  /** Tags shown as the provider's offerings (e.g. ["OEM Manufacturing", "White Label", "Bulk Orders"]). */
  offerings?: string[];
  /** Service area — defaults to TR. */
  areaServed?: string;
}): JsonLdObject {
  const { name, description, url, offerings, areaServed = "TR" } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absolute(url),
    provider: { "@id": `${SITE_URL}#organization` },
    areaServed,
    ...(offerings && offerings.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name,
        itemListElement: offerings.map((o, i) => ({
          "@type": "Offer",
          position: i + 1,
          itemOffered: { "@type": "Service", name: o },
        })),
      },
    }),
  };
}

export function safeJsonLdString(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// ── Meta tag helpers ────────────────────────────────────────────────────────
// Trim to ~155 chars so Google doesn't truncate mid-word in search snippets.
function clampDescription(text: string, max = 155): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

function clampTitle(text: string, max = 60): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export function productMetaTitle(product: ProductShape, categoryName?: string): string {
  const parts = [product.name];
  if (product.subtitle) parts.push(product.subtitle);
  if (categoryName) parts.push(categoryName);
  // layout.tsx adds " | Bemis E-V Charge" suffix so leave room for it
  return clampTitle(parts.join(" · "), 50);
}

export function productMetaDescription(product: ProductShape, categoryName?: string): string {
  const own = product.description?.trim();
  if (own) return clampDescription(own);
  // Fall back to a generic but data-driven description
  const head = [product.name, product.subtitle, categoryName].filter(Boolean).join(" — ");
  const tail = ". Bemis E-V Charge — Türkiye'nin yerli EV şarj ekipmanı üreticisi. CE, IP65 sertifikalı.";
  return clampDescription(head + tail);
}

export function categoryMetaTitle(category: CategoryShape, displayName?: string): string {
  return clampTitle(displayName || category.name, 50);
}

export function categoryMetaDescription(opts: {
  category: CategoryShape;
  displayName?: string;
  description?: string;
  productCount: number;
}): string {
  const own = opts.description?.trim() || opts.category.tagline?.trim();
  const name = opts.displayName || opts.category.name;
  const hint = opts.productCount > 0
    ? ` ${opts.productCount} model · IP65 sertifikalı · OCPP uyumlu · Bemis yerli üretim.`
    : " IP65 sertifikalı · OCPP uyumlu · Bemis yerli üretim.";
  const base = own || `${name} kategorisi.`;
  return clampDescription(base + hint);
}
