import type { MetadataRoute } from "next";
import { getServerProducts } from "./lib/server-content";
import { allPosts } from "./blog/posts";

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
    { url: `${BASE}/products`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/uretici`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kurumsal`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/documents`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/b2b`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/bayilik`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/operator`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

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
      ...(imgs.length > 0 && { images: imgs }),
    };
  });

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
        ...(imgs.length > 0 && { images: imgs }),
      };
    })
  );

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...allPosts().map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.dateModified ?? p.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
