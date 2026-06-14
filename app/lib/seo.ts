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

export type ReviewShape = {
  author: string;
  rating: number;          // 1-5
  text: string;
  date?: string;           // ISO or "yyyy-mm-dd" — if not provided we omit datePublished
  platform?: string;       // "Google" / "Trustpilot" — surfaced as publisher
  product?: string;        // free-text — surfaced as itemReviewed.name
};

export type AggregateReviewInput = {
  /** Average score, e.g. 4.9 */
  rating: number;
  /** Total number of reviews shown on site, e.g. "200+" → 200 */
  ratingCount: number;
  /** Individual reviews — schema only takes the top 10-ish anyway. */
  items: ReviewShape[];
};

export function organizationSchema(opts: {
  logo?: string;
  sameAs?: string[];
  phone?: string;
  email?: string;
  address?: { street?: string; locality?: string; region?: string; country?: string };
  reviews?: AggregateReviewInput;
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
  // Reviews block — when supplied, attach AggregateRating + the top
  // few Review entities to the Organization. Schema.org accepts a
  // standalone aggregateRating on Organization; per-review entries
  // give Google more signal but only the aggregate drives the star
  // snippet in SERP. We cap at 10 reviews to keep the JSON-LD small.
  const reviewsBlock: JsonLdObject = {};
  if (opts.reviews && opts.reviews.items.length > 0 && opts.reviews.rating > 0) {
    reviewsBlock.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.reviews.rating.toFixed(1),
      reviewCount: Math.max(opts.reviews.ratingCount, opts.reviews.items.length),
      bestRating: 5,
      worstRating: 1,
    };
    reviewsBlock.review = opts.reviews.items.slice(0, 10).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: Math.max(1, Math.min(5, r.rating)),
        bestRating: 5,
        worstRating: 1,
      },
      author: { "@type": "Person", name: r.author },
      reviewBody: r.text,
      ...(r.date && /^\d/.test(r.date) && { datePublished: r.date }),
      ...(r.platform && {
        publisher: { "@type": "Organization", name: r.platform },
      }),
      // NOTE: we deliberately don't emit `itemReviewed` here even when
      // the review mentions a product. Google's rich-result validator
      // treats every emitted Product entity as a standalone product
      // that needs its own offers/aggregateRating/review — and a free-
      // form name string like "AC Wallbox 22kW" never resolves to a
      // real catalog page. Result: 6 "1 kritik sorun" errors in GSC
      // before this fix. Keeping the review attached to the
      // Organization is enough for the SERP star snippet; per-product
      // review schemas live in productSchema() on the actual product
      // detail page where offers/price are present.
    }));
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
    // Google'a "Bemis E-V Charge, 1994'ten beri üreten Bemis Teknik Elektrik
    // A.Ş.'nin markasıdır" sinyali — köklü şirket otoritesini bağlar + iki
    // domaini (bemisevcharge.com.tr ↔ bemis.com.tr) aynı kurum olarak işaretler.
    parentOrganization: {
      "@type": "Organization",
      name: "Bemis Teknik Elektrik A.Ş.",
      url: "https://www.bemis.com.tr",
    },
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
    ...reviewsBlock,
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

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    ...(opts.image && { image: absolute(opts.image) }),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}#organization` },
    publisher: { "@id": `${SITE_URL}#organization` },
    mainEntityOfPage: absolute(opts.url),
    inLanguage: "tr-TR",
  };
}

export function faqSchema(items: { q: string; a: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function blogListingSchema(opts: {
  url: string;
  posts: { title: string; url: string; datePublished: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: `${SITE_NAME} Blog`,
    url: absolute(opts.url),
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE_URL}#organization` },
    blogPost: opts.posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absolute(p.url),
      datePublished: p.datePublished,
    })),
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

// ── Kategori bazlı SEO anahtar kelimeleri ───────────────────────────────────
// Rakiplerin (elektromarketim, truwatt, greenc) hedeflediği yüksek-hacimli
// aramalar. Kategori ve ürün meta BAŞLIK/AÇIKLAMALARINA enjekte edilir —
// kategori başlığında CMS adının yerine geçer (örn. "AC Şarj Kabloları" yerine
// "Elektrikli Araç Şarj Kablosu — Type 2"). Yeni kategori = buraya 1 kayıt.
const CATEGORY_SEO: Record<string, { title: string; desc: string; short: string }> = {
  wallbox: {
    title: "Elektrikli Araç Şarj İstasyonu — AC Wallbox",
    desc: "Bemis yerli üretim AC Wallbox ev şarj istasyonu: 7,4–22 kW, Type 2, OCPP uyumlu. Ev ve iş yeri için. CE, IP65 — üreticisinden.",
    short: "AC Wallbox Şarj İstasyonu",
  },
  portable: {
    title: "Taşınabilir Elektrikli Araç Şarj Cihazı",
    desc: "Bemis yerli üretim taşınabilir (seyyar) elektrikli araç şarj cihazı: Type 2, monofaze/trifaze, fişe tak-şarj et. CE, IP65 — üreticisinden.",
    short: "Taşınabilir Şarj Cihazı",
  },
  cables: {
    title: "Elektrikli Araç Şarj Kablosu — Type 2",
    desc: "Bemis yerli üretim Type 2 (Tip 2) elektrikli araç şarj kablosu: 16A/32A, monofaze ve trifaze, 3–10 m. CE, IP65 — üreticisinden teklif alın.",
    short: "Type 2 EV Şarj Kablosu",
  },
  "v2l-c2l": {
    title: "V2L / C2L Adaptör — Araçtan Elektrik",
    desc: "Bemis yerli üretim V2L ve C2L adaptör: aracınızı seyyar elektrik kaynağına çevirin. Type 2 uyumlu, kamp ve saha için. CE sertifikalı.",
    short: "V2L / C2L Adaptör",
  },
  converters: {
    title: "EV Şarj Uzatma & Dönüştürücü Kablo",
    desc: "Bemis yerli üretim elektrikli araç şarj uzatma kablosu ve dönüştürücü adaptör. Type 2 uyumlu. CE, IP65 — üreticisinden.",
    short: "Şarj Uzatma & Dönüştürücü",
  },
  "charger-equipment": {
    title: "Elektrikli Araç Şarj Ünitesi Ekipmanları",
    desc: "Bemis yerli üretim elektrikli araç şarj ünitesi ekipmanları: Type 2 priz, pano prizi ve şarj ekipmanları. CE, IP65 — üreticisinden.",
    short: "Şarj Ünitesi Ekipmanı",
  },
  accessories: {
    title: "Elektrikli Araç Şarj Aksesuarları",
    desc: "Bemis yerli üretim elektrikli araç şarj aksesuarları: tutucu, adaptör ve ekipmanlar. Type 2 uyumlu. Üreticisinden.",
    short: "EV Şarj Aksesuarı",
  },
  "dc-units": {
    title: "DC Hızlı Şarj Üniteleri — CCS2",
    desc: "Bemis elektrikli araç DC hızlı şarj üniteleri: CCS2, yüksek güçlü hızlı şarj. Yerli üretim — üreticisinden.",
    short: "DC Hızlı Şarj Ünitesi",
  },
};

export function productMetaTitle(product: ProductShape, categoryName?: string): string {
  // Ürün başlığı: ad + ayrıştırıcı alt başlık (örn. "Şarj Seti 20A Monofaze ·
  // 5m Kablolu"). Anahtar kelimeler açıklamada — başlığa marka soneki eklendiği
  // için kısa tutulur (layout " | Bemis E-V Charge" ekler).
  const core = [product.name, product.subtitle, categoryName].filter(Boolean).join(" · ");
  return clampTitle(core, 55);
}

export function productMetaDescription(product: ProductShape, categoryName?: string, categoryId?: string): string {
  // Açıklamaya kategori anahtar kelimesini öne al (rakip deseni: "Type 2 EV
  // Şarj Kablosu — ..."). Kendi açıklaması varsa korunur, başına kelime eklenir.
  const seo = categoryId ? CATEGORY_SEO[categoryId] : undefined;
  const kw = seo?.short || categoryName;
  const own = product.description?.trim();
  if (own) {
    return clampDescription(kw ? `${kw} — ${own}` : own);
  }
  const head = [kw, product.name, product.subtitle].filter(Boolean).join(" · ");
  const tail = ". Bemis yerli üretim — CE, IP65. Üreticisinden teklif alın.";
  return clampDescription(head + tail);
}

export function categoryMetaTitle(category: CategoryShape, displayName?: string): string {
  const seo = CATEGORY_SEO[category.id];
  return clampTitle(seo?.title || displayName || category.name, 56);
}

export function categoryMetaDescription(opts: {
  category: CategoryShape;
  displayName?: string;
  description?: string;
  productCount: number;
}): string {
  // Eşlenen kategoriler için anahtar-kelime optimize açıklama (meta görünmez,
  // saf SEO alanı — sayfadaki CMS açıklaması ayrı). Eşleşmeyen kategoriler için
  // CMS açıklaması + güven sinyalleri.
  const seo = CATEGORY_SEO[opts.category.id];
  if (seo?.desc) return clampDescription(seo.desc);
  const own = opts.description?.trim() || opts.category.tagline?.trim();
  const name = opts.displayName || opts.category.name;
  const hint = opts.productCount > 0
    ? ` ${opts.productCount} model · CE, IP65 · Bemis yerli üretim.`
    : ` CE, IP65 · Bemis yerli üretim.`;
  const base = own || `${name} kategorisi.`;
  return clampDescription(base + hint);
}
