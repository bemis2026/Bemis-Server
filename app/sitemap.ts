import type { MetadataRoute } from "next";
import { getServerProducts } from "./lib/server-content";
import { allPosts } from "./blog/posts";
import { yazilarDilde } from "./lib/serverBlogLang";
import { allPress } from "./blog/press";
import { CITY_PAGES } from "./lib/cities";
import { allTerms } from "./lib/glossary";
// ⚠️ GERÇEK lastmod. Eskiden 35 girdinin 32'si `now` idi = her build'de "bugün
// değişti". Google SAHTE lastmod'u yok sayar, o yüzden GERÇEKTEN güncellenen
// sayfa da öne çıkamıyordu. Tarihler: statik sayfalar → dosyanın son commit'i
// (scripts/gen-lastmod.ts yerelde üretir, JSON commit'lenir — Vercel sığ klon
// yaptığı için build'de git GÜVENİLMEZ); CMS sayfaları → R2 objesinin kendi
// LastModified'ı (admin düzenlemesi commit üretmez ama SAYFAYI değiştirir).
import lastmodJson from "./lib/lastmod.json";
import { binLastModified } from "../lib/store";

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
  const LM = lastmodJson as Record<string, string>;
  /** rota için commit tabanlı tarih; yoksa build zamanı */
  const gt = (k: string) => (LM[k] ? new Date(LM[k]) : now);
  /** CMS tarihi: R2 objesi → yoksa repo yedeğinin commit tarihi */
  const [urunR2, icerikR2] = await Promise.all([binLastModified("products"), binLastModified("content")]);
  const urunT = urunR2 ?? gt("_urunler");
  const icerikT = icerikR2 ?? gt("_icerik");
  /** kategori sayfası hem kategori metnini hem ürünleri gösterir → ikisinden YENİ olanı */
  const katT = new Date(Math.max(urunT.getTime(), icerikT.getTime()));

  // TR anasayfa / EN /export / AR /ar aynı "giriş sayfası" kümesinin dil sürümleri.
  const GIRIS_ALT = { tr: BASE, en: `${BASE}/export`, ar: `${BASE}/ar` };

  const staticRoutes: MetadataRoute.Sitemap = [
    // Giriş sayfası kümesi (TR anasayfa · EN /export · AR /ar) — üçü de aynı hreflang'i verir.
    { url: BASE,                lastModified: gt("/"), changeFrequency: "weekly",  priority: 1.0, alternates: { languages: GIRIS_ALT } },
    { url: `${BASE}/products`,  lastModified: katT, changeFrequency: "weekly",  priority: 0.9, alternates: { languages: { tr: `${BASE}/products`, en: `${BASE}/en/products`, de: `${BASE}/de/products`, es: `${BASE}/es/products`, ru: `${BASE}/ru/products`, nl: `${BASE}/nl/products`, ar: `${BASE}/ar/products` } } },
    { url: `${BASE}/uretici`,   lastModified: gt("/uretici"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kurumsal`,  lastModified: gt("/kurumsal"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/documents`, lastModified: gt("/documents"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/b2b`,       lastModified: gt("/b2b"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/bayilik`,   lastModified: gt("/bayilik"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/operator`,  lastModified: gt("/operator"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/export`,    lastModified: gt("/export"), changeFrequency: "monthly", priority: 0.85, alternates: { languages: GIRIS_ALT } },
    { url: `${BASE}/ar`,        lastModified: gt("/ar"), changeFrequency: "monthly", priority: 0.85, alternates: { languages: GIRIS_ALT } },
    // Körfez + Mısır iniş sayfası — TR/EN karşılığı YOK, bu yüzden alternates verilmez
    // (karşılığı olmayan hreflang Google'da karşılıklılık hatası üretir).
    { url: `${BASE}/ar/middle-east`, lastModified: gt("/ar/middle-east"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/iletisim`,  lastModified: gt("/iletisim"), changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/gizlilik`,        lastModified: gt("/gizlilik"), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cerez-politikasi`, lastModified: gt("/cerez-politikasi"), changeFrequency: "yearly",  priority: 0.3 },
    // Son kullanıcı destek sayfası — "şarj cihazım çalışmıyor" gibi aramaların hedefi.
    { url: `${BASE}/destek`, lastModified: gt("/destek"), changeFrequency: "monthly", priority: 0.6 },
    // Araç uyumluluk rehberi — "Togg'a hangi şarj kablosu" gibi model bazlı
    // aramaların hedefi (2026-08-03). Bkz. app/lib/vehicleCharging.ts
    { url: `${BASE}/arac-sarj-uyumlulugu`, lastModified: gt("/arac-sarj-uyumlulugu"), changeFrequency: "monthly", priority: 0.8 },
    // Kullanıcı paylaşımları (Instagram gömme) — içerik CMS'ten gelir.
    { url: `${BASE}/musteri-videolari`, lastModified: icerikT, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Şehir bazlı yerel-SEO landing sayfaları (örn. /bursa-ev-sarj-istasyonu).
  const cityRoutes: MetadataRoute.Sitemap = CITY_PAGES.map((c) => ({
    url: `${BASE}/${c.slug}`,
    lastModified: gt("_sehir"),
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
      lastModified: katT,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: { tr: `${BASE}/products/${id}`, en: `${BASE}/en/products/${id}`, de: `${BASE}/de/products/${id}`, es: `${BASE}/es/products/${id}`, ru: `${BASE}/ru/products/${id}`, nl: `${BASE}/nl/products/${id}`, ar: `${BASE}/ar/products/${id}` } },
      ...(imgs.length > 0 && { images: imgs }),
    };
  });

  // İngilizce (indekslenebilir) ürün + kategori sayfaları — /en/products(/id).
  // hreflang alternates ile TR karşılığına çift yönlü bağlı (Google keşfi + dil eşleme).
  const enProductRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/en/products`,
      lastModified: katT,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: { languages: { tr: `${BASE}/products`, en: `${BASE}/en/products`, de: `${BASE}/de/products`, es: `${BASE}/es/products`, ru: `${BASE}/ru/products`, nl: `${BASE}/nl/products`, ar: `${BASE}/ar/products` } },
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
        lastModified: katT,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: { languages: { tr: `${BASE}/products/${id}`, en: `${BASE}/en/products/${id}`, de: `${BASE}/de/products/${id}`, es: `${BASE}/es/products/${id}`, ru: `${BASE}/ru/products/${id}`, nl: `${BASE}/nl/products/${id}`, ar: `${BASE}/ar/products/${id}` } },
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
        lastModified: urunT,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: { tr: `${BASE}/products/${cat.id}/${p.id}`, en: `${BASE}/en/products/${cat.id}/${p.id}`, de: `${BASE}/de/products/${cat.id}/${p.id}`, es: `${BASE}/es/products/${cat.id}/${p.id}`, ru: `${BASE}/ru/products/${cat.id}/${p.id}`, nl: `${BASE}/nl/products/${cat.id}/${p.id}`, ar: `${BASE}/ar/products/${cat.id}/${p.id}` } },
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
        lastModified: urunT,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages: { tr: `${BASE}/products/${cat.id}/${p.id}`, en: `${BASE}/en/products/${cat.id}/${p.id}`, de: `${BASE}/de/products/${cat.id}/${p.id}`, es: `${BASE}/es/products/${cat.id}/${p.id}`, ru: `${BASE}/ru/products/${cat.id}/${p.id}`, nl: `${BASE}/nl/products/${cat.id}/${p.id}`, ar: `${BASE}/ar/products/${cat.id}/${p.id}` } },
        ...(imgs.length > 0 && { images: imgs }),
      };
    })
  );

  // 2026-09-03: Almanca / İspanyolca / Rusça kolları (app/[lang]/products). Liste +
  // 8 kategori + tüm ürün detayları; hreflang kümesi TR/EN girişleriyle AYNI (tr,en,de,es,ru).
  const LOCALE_LANGS = ["de", "es", "ru", "nl", "ar"] as const;
  const altSet = (path: string) => ({
    tr: `${BASE}${path}`, en: `${BASE}/en${path}`, de: `${BASE}/de${path}`, es: `${BASE}/es${path}`, ru: `${BASE}/ru${path}`, nl: `${BASE}/nl${path}`, ar: `${BASE}/ar${path}`,
  });
  const localeRoutes: MetadataRoute.Sitemap = LOCALE_LANGS.flatMap((L) => [
    { url: `${BASE}/${L}/products`, lastModified: katT, changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: altSet("/products") } },
    ...CATEGORY_IDS.map((id) => ({
      url: `${BASE}/${L}/products/${id}`, lastModified: katT, changeFrequency: "weekly" as const, priority: 0.75,
      alternates: { languages: altSet(`/products/${id}`) },
    })),
    ...products.flatMap((cat) =>
      (cat.products ?? []).map((p) => ({
        url: `${BASE}/${L}/products/${cat.id}/${p.id}`, lastModified: urunT, changeFrequency: "monthly" as const, priority: 0.55,
        alternates: { languages: altSet(`/products/${cat.id}/${p.id}`) },
      }))
    ),
  ]);

  // Blog — TR + Arapça kol. ⚠️ ar alternate YALNIZ Arapçası tam olan yazıda
  // (arSlug kümesi) verilir; çift yönlü olsun diye TR girişine de aynı küme yazılır.
  const arSlug = new Set(yazilarDilde("ar").map((p) => p.slug));
  const blogAlt = (yol: string) => ({ tr: `${BASE}${yol}`, ar: `${BASE}/ar${yol}` });
  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: gt("/blog"), changeFrequency: "weekly", priority: 0.7, alternates: { languages: blogAlt("/blog") } },
    ...allPosts().map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.dateModified ?? p.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(arSlug.has(p.slug) ? { alternates: { languages: blogAlt(`/blog/${p.slug}`) } } : {}),
    })),
    { url: `${BASE}/ar/blog`, lastModified: gt("/blog"), changeFrequency: "weekly", priority: 0.65, alternates: { languages: blogAlt("/blog") } },
    ...allPosts().filter((p) => arSlug.has(p.slug)).map((p) => ({
      url: `${BASE}/ar/blog/${p.slug}`,
      lastModified: new Date(p.dateModified ?? p.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.55,
      alternates: { languages: blogAlt(`/blog/${p.slug}`) },
    })),
    ...allPress().map((p) => ({
      url: `${BASE}/blog/haber/${p.id}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  // Sözlük — TR + Arapça kol. ⚠️ Çift yönlü alternates: karşılıklılık bozulmasın.
  const sozlukAlt = (yol: string) => ({ tr: `${BASE}${yol}`, ar: `${BASE}/ar${yol}` });
  const glossaryRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/sozluk`, lastModified: gt("_sozluk"), changeFrequency: "monthly", priority: 0.7, alternates: { languages: sozlukAlt("/sozluk") } },
    ...allTerms().map((t) => ({
      url: `${BASE}/sozluk/${t.slug}`,
      lastModified: gt("_sozluk"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: sozlukAlt(`/sozluk/${t.slug}`) },
    })),
    { url: `${BASE}/ar/sozluk`, lastModified: gt("_sozluk"), changeFrequency: "monthly", priority: 0.65, alternates: { languages: sozlukAlt("/sozluk") } },
    ...allTerms().map((t) => ({
      url: `${BASE}/ar/sozluk/${t.slug}`,
      lastModified: gt("_sozluk"),
      changeFrequency: "monthly" as const,
      priority: 0.55,
      alternates: { languages: sozlukAlt(`/sozluk/${t.slug}`) },
    })),
  ];

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes, ...enProductRoutes, ...enProductDetailRoutes, ...localeRoutes, ...productRoutes, ...blogRoutes, ...glossaryRoutes];
}
