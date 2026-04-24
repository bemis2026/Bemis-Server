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
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    ...(product.subtitle && { alternateName: product.subtitle }),
    ...(product.description && { description: product.description }),
    ...(imgs.length > 0 && { image: imgs }),
    ...(product.code && { sku: product.code, mpn: product.code }),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    manufacturer: { "@id": `${SITE_URL}#organization` },
    ...(categoryName && { category: categoryName }),
    url,
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

export function safeJsonLdString(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
