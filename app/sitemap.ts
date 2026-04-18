import type { MetadataRoute } from "next";

const BASE = "https://www.bemisevcharge.com.tr";

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

const PRODUCT_IDS: [string, string][] = [
  ["wallbox",           "wallbox-7kw"],
  ["wallbox",           "wallbox-11kw"],
  ["wallbox",           "wallbox-22kw"],
  ["portable",          "portable-2kw"],
  ["portable",          "portable-7kw"],
  ["cables",            "ac-cable-16a"],
  ["cables",            "ac-cable-32a"],
  ["cables",            "mod2-cable"],
  ["cables",            "dc-cable"],
  ["v2l-c2l",           "v2l"],
  ["v2l-c2l",           "c2l"],
  ["v2l-c2l",           "v2l-c2l-combo"],
  ["converters",        "extension-cable"],
  ["converters",        "schuko-adapter"],
  ["converters",        "cee-adapter"],
  ["converters",        "combo-box"],
  ["charger-equipment", "type2-socket"],
  ["charger-equipment", "holster"],
  ["charger-equipment", "pedestal"],
  ["charger-equipment", "wall-mount"],
  ["charger-equipment", "cable-tray"],
  ["accessories",       "electronics"],
  ["accessories",       "rfid-card"],
  ["accessories",       "surge-protector"],
  ["accessories",       "charging-bag"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/products`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/kurumsal`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/documents`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/b2b`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/bayilik`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/operator`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_IDS.map((id) => ({
    url: `${BASE}/products/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = PRODUCT_IDS.map(([catId, productId]) => ({
    url: `${BASE}/products/${catId}/${productId}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
