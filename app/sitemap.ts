import type { MetadataRoute } from "next";
import { getServerProducts } from "./lib/server-content";
import { allPosts } from "./blog/posts";
import { allPress } from "./blog/press";
import { CITY_PAGES } from "./lib/cities";
import { allTerms } from "./lib/glossary";

const BASE = "https://www.bemisevcharge.com.tr";

// Static categories — order + slugs are stable so this list doubles
// as the source of truth for the canonical kategori URL set.
const CATEGORY_IDS = [
  "wallbox",
  "portable",
  "cables",
  "v2l-c2l",
  "converters",
  "charger-equipment",
  "accessories",
  "dc-units",
];

// Next.js's MetadataRoute.Sitemap accepts an `images` field on every
// entry; when present it emits the standard image sitemap extension
// (xmlns:image) automatically, so Google Image Search indexes the
// product packshots alongside the URL.
//
// We pull real product slugs + image URLs from the JSONBin shards via
// getServerProducts() rather than hardcoding them (the previous list
// was stale — 25 entries with placeholder IDs that didn't match the
// actual catalog of 120 SKUs). Build runs once per deploy so the call
// happens at static generation time, not on every request.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/products`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9, alternates: { languages: { tr: `${BASE}/products`, en: `${BASE}/en/products`, de: `${BASE}/de/products`, es: `${BASE}/es/products`, ru: `${BASE}/ru/products` } } },
    { url: `${BASE}/uretici`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kurumsal`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/documents`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/b2b`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/bayilik`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/operator`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/export`,    lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/iletisim`,  lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/gizlilik`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cerez-politikasi`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    // Son kullanıcı destek sayfası — "şarj cihazım çalışmıyor" gibi aramaların hedefi.
    { url: `${BASE}/destek`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // Araç uyumluluk rehberi — "Togg'a hangi şarj kablosu" gibi model bazlı
    // aramaların hedefi (2026-08-03). Bkz. app/lib/vehicleCharging.ts
    { url: `${BASE}/arac-sarj-uyumlulugu`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Şehir bazlı yerel-SEO landing sayfaları (örn. /bursa-ev-sarj-istasyonu).
  const cityRoutes: MetadataRoute.Sitemap = CITY_PAGES.map((c) => ({
    url: `${BASE}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  let products: Awaited<ReturnType<typeof getServerProducts>> = [];
  try {
    products = await getServerProducts();
  } catch {
    // If JSONBin is unreachable at build time we still ship a
    // sitemap with the static + category routes — partial coverage
    // beats a build failure.
  }

  const productById = new Map(products.map((c) => [c.id, c]));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_IDS.map((id) => {
    const cat = productById.get(id);
    // Collect a small set of representative images for the category
    // — first product image plus the kategori showcase if it exists.
    // Limit to ~5 so the sitemap stays small.
    const imgs: string[] = [];
    if (cat?.products) {
      for (const p of cat.products) {
        const img = (p.image || p.images?.[0] || "").trim();
        if (img && !imgs.includes(img)) imgs.push(img);
        if (imgs.length >= 5) break;
      }
    }
    return {
      url: `${BASE}/products/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: { tr: `${BASE}/products/${id}`, en: `${BASE}/en/products/${id}`, de: `${BASE}/de/products/${id}`, es: `${BASE}/es/products/${id}`, ru: `${BASE}/ru/products/${id}` } },
      ...(imgs.length > 0 && { images: imgs }),
    };
  });

  // İngilizce (indekslenebilir) ürün + kategori sayfaları — /en/products(/id).
  // hreflang alternates ile TR karşılığına çift yönlü bağlı (Google keşfi + dil eşleme).
  const enProductRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/en/products`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: { languages: { tr: `${BASE}/products`, en: `${BASE}/en/products`, de: `${BASE}/de/products`, es: `${BASE}/es/products`, ru: `${BASE}/ru/products` } },
    },
    ...CATEGORY_IDS.map((id) => {
      const cat = productById.get(id);
      const imgs: string[] = [];
      if (cat?.products) {
        for (const p of cat.products) {
          const img = (p.image || p.images?.[0] || "").trim();
          if (img && !imgs.includes(img)) imgs.push(img);
          if (imgs.length >= 5) break;
        }
      }
      return {
        url: `${BASE}/en/products/${id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: { languages: { tr: `${BASE}/products/${id}`, en: `${BASE}/en/products/${id}`, de: `${BASE}/de/products/${id}`, es: `${BASE}/es/products/${id}`, ru: `${BASE}/ru/products/${id}` } },
        ...(imgs.length > 0 && { images: imgs }),
      };
    }),
  ];

  const productRoutes: MetadataRoute.Sitemap = products.flatMap((cat) =>
    (cat.products ?? []).map((p) => {
      const imgs = [p.image, ...(p.images ?? [])]
        .map((x) => (x ?? "").trim())
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i); // de-dup
      return {
        url: `${BASE}/products/${cat.id}/${p.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: { tr: `${BASE}/products/${cat.id}/${p.id}`, en: `${BASE}/en/products/${cat.id}/${p.id}`, de: `${BASE}/de/products/${cat.id}/${p.id}`, es: `${BASE}/es/products/${cat.id}/${p.id}`, ru: `${BASE}/ru/products/${cat.id}/${p.id}` } },
        ...(imgs.length > 0 && { images: imgs }),
      };
    })
  );

  // İngilizce ürün DETAY sayfaları (/en/products/<kategori>/<ürün>) — TR eşiyle
  // çift yönlü hreflang. Kategori/liste EN girişleri yukarıda (enProductRoutes).
  const enProductDetailRoutes: MetadataRoute.Sitemap = products.flatMap((cat) =>
    (cat.products ?? []).map((p) => {
      const imgs = [p.image, ...(p.images ?? [])]
        .map((x) => (x ?? "").trim())
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i);
      return {
        url: `${BASE}/en/products/${cat.id}/${p.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages: { tr: `${BASE}/products/${cat.id}/${p.id}`, en: `${BASE}/en/products/${cat.id}/${p.id}`, de: `${BASE}/de/products/${cat.id}/${p.id}`, es: `${BASE}/es/products/${cat.id}/${p.id}`, ru: `${BASE}/ru/products/${cat.id}/${p.id}` } },
        ...(imgs.length > 0 && { images: imgs }),
      };
    })
  );

  // 2026-09-03: Almanca / İspanyolca / Rusça kolları (app/[lang]/products). Liste +
  // 8 kategori + tüm ürün detayları; hreflang kümesi TR/EN girişleriyle AYNI (tr,en,de,es,ru).
  const LOCALE_LANGS = ["de", "es", "ru"] as const;
  const altSet = (path: string) => ({
    tr: `${BASE}${path}`, en: `${BASE}/en${path}`, de: `${BASE}/de${path}`, es: `${BASE}/es${path}`, ru: `${BASE}/ru${path}`,
  });
  const localeRoutes: MetadataRoute.Sitemap = LOCALE_LANGS.flatMap((L) => [
    { url: `${BASE}/${L}/products`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: altSet("/products") } },
    ...CATEGORY_IDS.map((id) => ({
      url: `${BASE}/${L}/products/${id}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.75,
      alternates: { languages: altSet(`/products/${id}`) },
    })),
    ...products.flatMap((cat) =>
      (cat.products ?? []).map((p) => ({
        url: `${BASE}/${L}/products/${cat.id}/${p.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.55,
        alternates: { languages: altSet(`/products/${cat.id}/${p.id}`) },
      }))
    ),
  ]);

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...allPosts().map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.dateModified ?? p.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...allPress().map((p) => ({
      url: `${BASE}/blog/haber/${p.id}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const glossaryRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/sozluk`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...allTerms().map((t) => ({
      url: `${BASE}/sozluk/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes, ...enProductRoutes, ...enProductDetailRoutes, ...localeRoutes, ...productRoutes, ...blogRoutes, ...glossaryRoutes];
}
