import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, categoryMetaTitle, categoryMetaDescription } from "../../lib/seo";
import { getServerProducts, getServerCategoriesMeta } from "../../lib/server-content";
import ProductCategoryClient from "./ProductCategoryClient";

export const revalidate = 60;
export const dynamicParams = true;

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
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const categories = await getServerProducts();
  return categories.map(c => ({ id: c.id }));
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
  const meta = catsMeta[id] ?? {};
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
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductCategoryClient />
    </>
  );
}
