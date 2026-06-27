import type { ComponentProps } from "react";
import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, faqSchema, categoryMetaTitle, categoryMetaDescription, ogImage, OG_URL } from "../../lib/seo";
import { getServerProducts, getServerCategoriesMeta } from "../../lib/server-content";
import ProductCategoryClient from "./ProductCategoryClient";

type ClientCategory = NonNullable<ComponentProps<typeof ProductCategoryClient>["initialCategory"]>;

// STATİK (ISR) — generateStaticParams (8 kategori) + dynamicParams=false + uzun revalidate.
// ⚠️ Eski force-dynamic'in sebebi: dynamicParams=TRUE + ISR iken botlar
// /products/<rastgele> üretip ISR'a sınırsız yazıyordu (200k/ay kota patlaması).
// YENİ YÖNTEM AMPLİFİKASYONU GİDERİR: dynamicParams=FALSE ile yalnız gerçek kategori
// yolları üretilir, bilinmeyen URL 404 → amplifikasyon YOK. revalidate=86400 (1 gün).
// Veri build'de getServerProducts (data/products.json fallback); yeni kategori redeploy ile.
// ⚠️ ISR Writes metriğini birkaç gün İZLE; artışta revalidate'i uzat / geri al.
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  const categories = await getServerProducts();
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [categories, catsMeta] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
  ]);
  const category = categories.find(c => c.id === id);
  if (!category) {
    return {
      title: "Kategori bulunamadı",
      description: "Aradığınız kategori artık mevcut değil. Tüm kategorileri /products üzerinden inceleyebilirsiniz.",
    };
  }
  const meta = catsMeta[id] ?? {};
  const displayName = meta.name || category.name;
  const productCount = (category.products ?? []).length;
  const title = categoryMetaTitle(category, displayName);
  const description = categoryMetaDescription({
    category,
    displayName,
    description: meta.description || meta.subtitle,
    productCount,
  });
  const canonical = `/products/${id}`;
  return {
    title,
    description,
    alternates: { canonical, languages: { tr: canonical, "x-default": canonical } },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: ogImage(title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_URL],
    },
  };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, catsMeta] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
  ]);
  const category = categories.find(c => c.id === id);
  if (!category) return <ProductCategoryClient />;
  const initialCategory = category as unknown as ClientCategory;
  const meta = catsMeta[id] ?? {};
  // faq, getServerCategoriesMeta'nın dar tipinde yok ama çalışma zamanında
  // CMS verisinde mevcut (data.categories tam obje) — cast ile alıyoruz.
  const catFaq = (meta as unknown as { faq?: { q: string; a: string }[] }).faq ?? [];
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Tüm Ürünler", url: "/products" },
      { name: meta.name || category.name, url: `/products/${id}` },
    ]),
    collectionPageSchema({
      name: meta.name || category.name,
      description: meta.description || meta.subtitle || category.tagline,
      url: `/products/${id}`,
      products: (category.products ?? []).map(p => ({ id: p.id, name: p.name, categoryId: id })),
    }),
    ...(catFaq.length > 0 ? [faqSchema(catFaq)] : []),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductCategoryClient initialCategory={initialCategory} />
    </>
  );
}
