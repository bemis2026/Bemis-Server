import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, ogImage, OG_URL } from "../../../lib/seo";
import { getServerProducts } from "../../../lib/server-content";
import { productNameEn } from "../../../lib/productNamesEn";
import { enCategoryMeta } from "../../../lib/enProductSeo";
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

// İngilizce kategori meta'sı ORTAK dosyada (app/lib/enProductSeo.ts) — ürün detay
// sayfası da aynı kaynağı kullanır; kopya metin tutulmaz.
const enMeta = enCategoryMeta;

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
