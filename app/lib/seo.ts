export const SITE_URL = "https://www.bemisevcharge.com.tr";
export const SITE_NAME = "Bemis E-V Charge";
export const ORG_LEGAL_NAME = "Bemis Teknik Elektrik A.Ş.";

// GEO/AEO — yapay zeka aramaları (ChatGPT/Perplexity/AI Overviews) markayı net ve
// doğru anlasın diye Organization şemasına eklenen entity sinyalleri. Tüm değerler
// doğrulanmış gerçeklere dayanır (1994/tesis = ANA ŞİRKET; EV markası onun markası).
// sameAs sabit baseline'dır → içerik verisi build'de okunamasa bile her zaman yayında olur.
const ORG_SAME_AS = [
  "https://www.wikidata.org/wiki/Q140262626", // Bemis E-V Charge Wikidata varlığı — entity bağı (Google KG + YZ)
  "https://maps.app.goo.gl/xXSxhLffa5WDA81V7", // Google Business Profile (GBP) — site↔harita kartı entity bağı (yerel SEO)
  "https://www.linkedin.com/company/104588906",
  "https://www.instagram.com/bemis.evcharge/",
  "https://www.youtube.com/@bemisteknikelektrika.s.2025",
  "https://www.facebook.com/bemisteknik/?locale=tr_TR",
];
const ORG_DESCRIPTION =
  "Bemis E-V Charge, 1994'ten beri üreten Bemis Teknik Elektrik A.Ş.'nin yerli elektrikli araç (EV) şarj markasıdır. " +
  "Bursa Organize Sanayi Bölgesi'ndeki üretim tesisinden AC Wallbox şarj istasyonları (7,4–22 kW), taşınabilir AC şarj " +
  "cihazları, Type 2 şarj kabloları (Mod 2 & Mod 3), V2L/C2L adaptörler, CEE uzatma & dönüştürücüler, DC hızlı şarj " +
  "üniteleri ve şarj ünitesi ekipmanları sunar. Ürünler CE ve IP65/IP66 korumalı, OCPP uyumludur; 60+ ülkeye ihraç edilir.";
const ORG_SLOGAN = "Yerli üretim elektrikli araç şarj çözümleri — doğrudan üreticiden.";
const ORG_KNOWS_ABOUT = [
  "Elektrikli araç şarj istasyonu üretimi",
  "AC Wallbox şarj istasyonu",
  "Taşınabilir AC şarj cihazı",
  "Type 2 şarj kablosu",
  "Mod 2 ve Mod 3 şarj kabloları",
  "V2L adaptör",
  "C2L adaptör",
  "DC hızlı şarj ünitesi",
  "OCPP uyumlu şarj cihazı",
  "CEE uzatma ve dönüştürücü",
  "Type 2 priz ve soket ekipmanları",
  "Yerli EV şarj üreticisi",
];
const ORG_OFFER_CATALOG = [
  "AC Wallbox Şarj İstasyonları",
  "AC Taşınabilir/Mobil Şarj Cihazları",
  "Type 2 Şarj Kabloları (Mod 2 & Mod 3)",
  "V2L/C2L Adaptörler",
  "Uzatma ve Dönüştürücüler (CEE)",
  "Aksesuarlar",
  "DC Hızlı Şarj Üniteleri",
  "Şarj Ünitesi Ekipmanları",
];

export type JsonLdObject = Record<string, unknown>;

export type ProductShape = {
  id: string;
  name: string;
  code?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string[];
  /** Ürün bazlı SEO geçersiz kılmaları (admin'den düzenlenir). Boş ise
   *  üretilen (productMetaTitle/Description) değere düşülür — asla boş kalmaz. */
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  /** Virgülle ayrılmış anahtar kelimeler. */
  keywords?: string;
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

// İletişim + adres baseline (gerçek, doğrulanmış veri). content meta build'de
// boş gelse bile Organization'da contactPoint + PostalAddress ASLA boş kalmaz
// (GEO/AEO + yerel SEO entity sinyali — sameAs baseline'ı ile aynı mantık).
const ORG_PHONE = "+90 224 433 02 16";
const ORG_EMAIL = "info@bemisevcharge.com";
const ORG_ADDRESS = { street: "Yeşil Cad. No:31", locality: "Bursa", region: "Bursa", postalCode: "16140", country: "TR" } as const;
// Gerçek işletme koordinatı (GBP pin — Nilüfer/OSB Bursa, kullanıcı verdi). LocalBusiness geo tek kaynağı.
export const ORG_GEO = { lat: 40.245558, lng: 28.945849 } as const;

export function organizationSchema(opts: {
  logo?: string;
  sameAs?: string[];
  phone?: string;
  email?: string;
  address?: { street?: string; locality?: string; region?: string; postalCode?: string; country?: string };
  reviews?: AggregateReviewInput;
}): JsonLdObject {
  // Sabit baseline (gerçek sosyal profiller) + içerikten gelenleri birleştir, tekille.
  // Böylece içerik verisi build'de boş gelse bile sameAs ASLA boş kalmaz (entity sinyali).
  const sameAs = [...new Set([...ORG_SAME_AS, ...(opts.sameAs ?? [])])].filter(Boolean);
  // Baseline fallback — content meta boş gelse bile contactPoint + adres dolu kalır.
  const phone = opts.phone ?? ORG_PHONE;
  const email = opts.email ?? ORG_EMAIL;
  const addr = opts.address && (opts.address.street || opts.address.locality) ? opts.address : ORG_ADDRESS;
  const contactPoints: JsonLdObject[] = [{
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: phone,
    email,
    areaServed: "TR",
    availableLanguage: ["Turkish", "English"],
  }];
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
    // GEO/AEO entity sinyalleri — YZ'nin "Bemis = yerli EV şarj üreticisi" + ne ürettiğini
    // net anlaması için. (Atıf: 1994/tesis ANA ŞİRKET; bkz. parentOrganization.)
    description: ORG_DESCRIPTION,
    slogan: ORG_SLOGAN,
    knowsAbout: ORG_KNOWS_ABOUT,
    areaServed: "Türkiye",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Elektrikli Araç Şarj Ürünleri",
      // ⚠️ itemOffered = "Service" (Product DEĞİL): bunlar kategori HATLARI
      // (gerçek ürün sayfası değil). "@type: Product" yapılırsa Google Rich
      // Results her birini ürün-snippet'i sayıp "image + offers/review/
      // aggregateRating eksik" uyarısı verir (8 hat = 8 uyarı). Service bu
      // doğrulamayı tetiklemez; GEO "ne üretiyoruz" sinyali korunur. GERÇEK
      // Product snippet'leri ürün DETAY sayfalarında (image+offers+sku tam).
      // ⚠️ Product'a GERİ ÇEVİRME — Rich Results uyarıları geri gelir.
      itemListElement: ORG_OFFER_CATALOG.map((catName) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: catName },
      })),
    },
    // Google'a "Bemis E-V Charge, 1994'ten beri üreten Bemis Teknik Elektrik
    // A.Ş.'nin markasıdır" sinyali — köklü şirket otoritesini bağlar + iki
    // domaini (bemisevcharge.com.tr ↔ bemis.com.tr) aynı kurum olarak işaretler.
    parentOrganization: {
      "@type": "Organization",
      name: "Bemis Teknik Elektrik A.Ş.",
      url: "https://www.bemis.com.tr",
      sameAs: ["https://www.wikidata.org/wiki/Q140267525"], // ana şirket Wikidata varlığı
    },
    ...(sameAs.length > 0 && { sameAs }),
    contactPoint: contactPoints,
    address: {
      "@type": "PostalAddress",
      ...(addr.street && { streetAddress: addr.street }),
      ...(addr.locality && { addressLocality: addr.locality }),
      ...(addr.region && { addressRegion: addr.region }),
      ...(addr.postalCode && { postalCode: addr.postalCode }),
      addressCountry: addr.country ?? "TR",
    },
    ...reviewsBlock,
  };
}

// OG görsel meta — sitenin /opengraph-image kartı (1200×630). Custom openGraph
// kuran iç sayfalar dosya-tabanlı OG'yi kaybediyordu; bunu metadata'ya açıkça
// eklemek için (og:image + width/height/alt + twitter:image).
export const OG_URL = `${SITE_URL}/opengraph-image`;
export function ogImage(alt: string) {
  return [{ url: OG_URL, width: 1200, height: 630, alt }];
}

// LocalBusiness — kanonik NAP (ORG_*) ile. /iletisim ve şehir landing'lerinde
// yerel-SEO sinyali. openingHoursSpecification = gerçek mesai (Pzt–Cuma 08:30–18:00,
// sitede görünür). geo (lat/long) yalnız kullanıcı GERÇEK koordinatı verince (uydurma yok).
export function localBusinessSchema(opts: { url: string; areaServed?: string; geo?: { lat: number; lng: number } }): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absolute(opts.url)}#localbusiness`,
    name: SITE_NAME,
    legalName: ORG_LEGAL_NAME,
    url: absolute(opts.url),
    image: OG_URL,
    telephone: ORG_PHONE,
    email: ORG_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG_ADDRESS.street,
      addressLocality: ORG_ADDRESS.locality,
      addressRegion: ORG_ADDRESS.region,
      postalCode: ORG_ADDRESS.postalCode,
      addressCountry: ORG_ADDRESS.country,
    },
    ...(opts.areaServed && { areaServed: opts.areaServed }),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "18:00",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: opts.geo?.lat ?? ORG_GEO.lat,
      longitude: opts.geo?.lng ?? ORG_GEO.lng,
    },
    parentOrganization: { "@id": `${SITE_URL}#organization` },
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

/** focusKeyword + keywords (virgülle) → tekilleştirilmiş, virgülle birleşik
 *  kelime dizisi (JSON-LD Product.keywords + <meta name="keywords"> için).
 *  Hiçbiri yoksa undefined. */
export function productKeywords(product: ProductShape): string | undefined {
  const parts: string[] = [];
  if (product.focusKeyword?.trim()) parts.push(product.focusKeyword.trim());
  if (product.keywords?.trim()) {
    for (const k of product.keywords.split(",")) {
      const t = k.trim();
      if (t) parts.push(t);
    }
  }
  const seen = new Set<string>();
  const uniq = parts.filter((p) => {
    const key = p.toLocaleLowerCase("tr");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return uniq.length ? uniq.join(", ") : undefined;
}

// Türkçe "Ay YYYY" (ör. "Mart 2025") veya ISO tarihi → ISO "YYYY-MM-01".
// Tanınmazsa undefined döner → datePublished EMIT EDİLMEZ (uydurma tarih yok).
const TR_AYLAR: Record<string, string> = {
  ocak: "01", şubat: "02", subat: "02", mart: "03", nisan: "04", mayıs: "05",
  mayis: "05", haziran: "06", temmuz: "07", ağustos: "08", agustos: "08",
  eylül: "09", eylul: "09", ekim: "10", kasım: "11", kasim: "11", aralık: "12", aralik: "12",
};
function toIsoDate(date?: string): string | undefined {
  if (!date) return undefined;
  const d = date.trim();
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(d)) return d.length === 7 ? `${d}-01` : d;
  const m = d.toLowerCase().match(/^([a-zçğıöşü]+)\s+(\d{4})$/);
  const mm = m ? TR_AYLAR[m[1]] : undefined;
  return mm && m ? `${m[2]}-${mm}-01` : undefined;
}

export function productSchema(opts: {
  product: ProductShape;
  categoryName?: string;
  categoryId: string;
  reviews?: ReviewShape[]; // gerçek müşteri yorumları (curated eşleşme) → AggregateRating + Review
}): JsonLdObject {
  const { product, categoryName, categoryId } = opts;
  const imgs = [product.image, ...(product.images ?? [])]
    .filter((x): x is string => Boolean(x))
    .map(u => absolute(u))
    .filter((x): x is string => Boolean(x))
    .filter((v, i, arr) => arr.indexOf(v) === i); // dedupe — aynı URL 2 kez olmasın
  const url = `${SITE_URL}/products/${categoryId}/${product.id}`;
  const offer = extractOffer(product);
  const kw = productKeywords(product);
  // Teknik özellikler → additionalProperty (güç/faz/soket/IP/kablo). Fiyat grubu hariç (offers'ta).
  const addProps = (product.specs ?? [])
    .filter(g => !/fiyat|price/i.test(g.group))
    .flatMap(g => g.items ?? [])
    .filter(it => it && it.label && it.value)
    .map(it => ({ "@type": "PropertyValue", name: it.label, value: it.value }));
  // Gerçek müşteri yorumları → AggregateRating + Review. Yıldız zengin sonucu
  // PRODUCT tipinde çıkar; marka-geneli "4.9/500+" SELF-SERVING olduğu için
  // Organization'a DEĞİL, yalnız gerçek ürün yorumları buraya basılır.
  const prodReviews = (opts.reviews ?? [])
    .filter((r) => r?.author && r?.text && (r.rating ?? 0) > 0)
    .slice(0, 10);
  const reviewBlock: JsonLdObject = {};
  if (prodReviews.length > 0) {
    const avg =
      prodReviews.reduce((s, r) => s + Math.max(1, Math.min(5, r.rating)), 0) /
      prodReviews.length;
    reviewBlock.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: prodReviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    reviewBlock.review = prodReviews.map((r) => {
      const iso = toIsoDate(r.date);
      return {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: Math.max(1, Math.min(5, r.rating)),
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: r.author },
        reviewBody: r.text,
        ...(iso && { datePublished: iso }),
        ...(r.platform && { publisher: { "@type": "Organization", name: r.platform } }),
      };
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    ...(product.subtitle && { alternateName: product.subtitle }),
    ...(product.description && { description: product.description }),
    ...(imgs.length > 0 && {
      // ImageObject (sadece URL değil) → AI multimodal + Google Görseller alıntı bağlamı.
      image: imgs.map((u) => ({
        "@type": "ImageObject",
        contentUrl: u,
        name: product.name,
        caption: `${product.name}${categoryName ? ` — ${categoryName}` : ""} · Bemis E-V Charge yerli üretim`,
      })),
    }),
    ...(product.code && { sku: product.code, mpn: product.code }),
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": `${SITE_URL}#organization` },
    ...(categoryName && { category: categoryName }),
    ...(CATEGORY_TERM[categoryId] && {
      about: { "@type": "DefinedTerm", "@id": `${SITE_URL}/sozluk/${CATEGORY_TERM[categoryId]}#definedterm` },
    }),
    ...(kw && { keywords: kw }),
    ...(addProps.length > 0 && { additionalProperty: addProps }),
    ...reviewBlock,
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

/** Curated review→ürün eşlemesi: ana sayfadaki gerçek müşteri yorumlarını (her
 *  birinde `product` serbest-metni var) doğru ürün DETAY sayfasına bağlar. Yıldız
 *  zengin sonucu Product tipinde çıkar. Marka-geneli "4.9/500+" buraya GİRMEZ
 *  (self-serving). Eşleşme curated çünkü review.product ("AC Wallbox 7kW") tek bir
 *  ürün id'sine otomatik çözülemez; review METNİ kW içermez → ürün-agnostik, güvenli. */
// Kategori → ilgili sözlük terimi (Product.about → DefinedTerm mesh). Belirsiz olanlar (converters,
// accessories) eşlenmez. @id formatı definedTermSchema ile birebir (#definedterm).
const CATEGORY_TERM: Record<string, string> = {
  wallbox: "wallbox",
  cables: "type-2",
  "v2l-c2l": "v2l",
  "dc-units": "ccs2",
  portable: "mod-2-mod-3",
  "charger-equipment": "ccs2",
};

// Gerçek müşteri yorumları artık YALNIZ anasayfada gösteriliyor (Hepsiburada 11 kW
// kablo, doğrulanmış 5.0/59). Ürün DETAY sayfası review şeması, gerçek per-ürün yorum
// verisi netleşince (ör. Pro Mobile Trendyol) doğru id→ürün eşlemesiyle bağlanacak.
// Eski placeholder eşlemeler kaldırıldı — uydurma review şeması riski taşıyordu.
const PRODUCT_REVIEW_KEY: Record<string, string> = {};

export function reviewsForProduct(productId: string, allReviews: ReviewShape[]): ReviewShape[] {
  const key = PRODUCT_REVIEW_KEY[productId];
  if (!key) return [];
  return (allReviews ?? []).filter(
    (r) => r?.product === key && r?.author && r?.text && (r.rating ?? 0) > 0,
  );
}

/** Kategori HATTI için ItemList (kategori bir Product DEĞİL — audit). Ürünleri
 *  ListItem olarak işaretler; tekil ürünlerin TAM Product şeması ürün DETAY
 *  sayfalarında (fiyatlar orada). Boş kategoride null döner.
 *  ⚠️ Kategoriyi Product + AggregateOffer ile İŞARETLEME (yanlış tip; Rich Results
 *  her birini ürün-snippet'i sayıp offers/image bekler). Kategori sayfaları zaten
 *  collectionPageSchema (CollectionPage) kullanıyor. */
export function categoryListSchema(opts: {
  categoryId: string;
  name: string;
  products: ProductShape[];
}): JsonLdObject | null {
  const { categoryId, name, products } = opts;
  if (products.length === 0) return null;
  const url = `${SITE_URL}/products/${categoryId}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#category`,
    name,
    url,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/products/${categoryId}/${p.id}`,
    })),
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
  datePublished?: string;
  dateModified?: string;
  wordCount?: number;
  keywords?: string[];
  articleSection?: string;
}): JsonLdObject {
  // image → ImageObject. Kapak varsa onu kullan; yoksa sitenin OG kartı (1200×630).
  // width/height YALNIZ default OG'de emit edilir (boyutu kesin); kapak görselinin
  // boyutu bilinmediğinden orada sadece url verilir (yanlış boyut iddiası olmasın).
  const image: JsonLdObject = opts.image
    ? { "@type": "ImageObject", url: absolute(opts.image) }
    : { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image,
    ...(opts.datePublished && {
      datePublished: opts.datePublished,
      dateModified: opts.dateModified ?? opts.datePublished,
    }),
    author: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}#organization` },
    publisher: { "@id": `${SITE_URL}#organization` },
    mainEntityOfPage: absolute(opts.url),
    inLanguage: "tr-TR",
    ...(opts.wordCount && opts.wordCount > 0 && { wordCount: opts.wordCount }),
    ...(opts.keywords && opts.keywords.length > 0 && { keywords: opts.keywords.join(", ") }),
    ...(opts.articleSection && { articleSection: opts.articleSection }),
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

// Sözlük (GEO/AEO) — DefinedTermSet + DefinedTerm. "X nedir" sorgularını
// alıntılanabilir tanımlarla karşılar. name = kısa terim etiketi (abbr).
const GLOSSARY_SET_ID = `${SITE_URL}/sozluk#definedtermset`;
const GLOSSARY_SET_NAME = "Elektrikli Araç Şarj Terimleri Sözlüğü";

export function definedTermSetSchema(terms: { slug: string; abbr: string; definition: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": GLOSSARY_SET_ID,
    name: GLOSSARY_SET_NAME,
    url: `${SITE_URL}/sozluk`,
    inLanguage: "tr-TR",
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.abbr,
      description: t.definition,
      url: `${SITE_URL}/sozluk/${t.slug}`,
    })),
  };
}

export function definedTermSchema(t: { slug: string; abbr: string; definition: string }, seeAlso?: string[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${SITE_URL}/sozluk/${t.slug}#definedterm`,
    name: t.abbr,
    description: t.definition,
    url: `${SITE_URL}/sozluk/${t.slug}`,
    inLanguage: "tr-TR",
    inDefinedTermSet: { "@type": "DefinedTermSet", "@id": GLOSSARY_SET_ID, name: GLOSSARY_SET_NAME, url: `${SITE_URL}/sozluk` },
    ...(seeAlso && seeAlso.length > 0 && { seeAlso }), // terim↔terim mesh (TERM_SEE_ALSO)
  };
}

export function howToSchema(opts: {
  name: string;
  description?: string;
  steps: { name: string; text: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    inLanguage: "tr-TR",
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
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
    title: "Elektrikli Araç Şarj İstasyonu — Wallbox",
    desc: "Ev şarj ünitesi (AC Wallbox): 7,4–22 kW, Type 2, OCPP uyumlu elektrikli araç şarj istasyonu. Ev ve iş yeri için. Bemis yerli üretim, CE & IP65.",
    short: "AC Wallbox Şarj İstasyonu",
  },
  portable: {
    title: "Taşınabilir Elektrikli Araç Şarj Cihazı",
    desc: "Taşınabilir elektrikli araç şarj cihazı: Type 2, monofaze/trifaze, prize tak-şarj et, kurulum yok. Seyahat ve yedek için ideal. Bemis yerli üretim, CE & IP65.",
    short: "Taşınabilir Şarj Cihazı",
  },
  cables: {
    title: "Elektrikli Araç Şarj Kablosu — Type 2",
    desc: "Elektrikli araç şarj kablosu — Type 2 (Tip 2), 16A/32A, monofaze ve trifaze AC, 3–10 m seçenekler. Aracınıza uygun kabloyu seçin. Bemis yerli üretim, CE & IP65.",
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

/** Görünür kategori H1'i için keyword'lü başlık (TR). Yoksa undefined → çağıran
 *  `category.name`e (CMS adı) düşer. CMS verisine DOKUNMAZ; sadece görünür H1'i
 *  SEO için zenginleştirir (meta başlığıyla aynı kaynak: CATEGORY_SEO.title). */
export function categoryH1(categoryId: string): string | undefined {
  return CATEGORY_SEO[categoryId]?.title;
}

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
