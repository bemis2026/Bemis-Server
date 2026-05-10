import type { ComponentProps } from "react";
import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, productSchema, productMetaTitle, productMetaDescription } from "../../../lib/seo";
import { getServerProducts, getServerCategoriesMeta } from "../../../lib/server-content";
import ProductDetailClient from "./ProductDetailClient";

type DetailProps = ComponentProps<typeof ProductDetailClient>;

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}): Promise<Metadata> {
  const { id, productId } = await params;
  const [categories, catsMeta] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
  ]);
  const category = categories.find(c => c.id === id);
  const product = category?.products?.find(p => p.id === productId);
  if (!category || !product) {
    return {
      title: "Ürün bulunamadı",
      description: "Aradığınız ürün artık mevcut değil. Tüm kategorileri /products üzerinden inceleyebilirsiniz.",
    };
  }
  const meta = catsMeta[id] ?? {};
  const categoryName = meta.name || category.name;
  const title = productMetaTitle(product, categoryName);
  const description = productMetaDescription(product, categoryName);
  const canonical = `/products/${id}/${productId}`;
  const image = product.image || product.images?.[0];
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      ...(image && { images: [{ url: image, alt: product.name }] }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export async function generateStaticParams() {
  const categories = await getServerProducts();
  const out: { id: string; productId: string }[] = [];
  for (const cat of categories) {
    for (const p of (cat.products ?? [])) {
      out.push({ id: cat.id, productId: p.id });
    }
  }
  return out;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  const [categories, catsMeta] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
  ]);
  const category = categories.find(c => c.id === id);
  const product = category?.products?.find(p => p.id === productId);
  if (!category || !product) return <ProductDetailClient />;
  const meta = catsMeta[id] ?? {};
  const initialCategory = category as unknown as NonNullable<DetailProps["initialCategory"]>;
  const initialProduct = product as unknown as NonNullable<DetailProps["initialProduct"]>;
  const initialAllCategories = categories as unknown as NonNullable<DetailProps["initialAllCategories"]>;
  const categoryName = meta.name || category.name;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Tüm Ürünler", url: "/products" },
      { name: categoryName, url: `/products/${id}` },
      { name: product.name, url: `/products/${id}/${productId}` },
    ]),
    productSchema({ product, categoryName, categoryId: id }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient
        initialCategory={initialCategory}
        initialProduct={initialProduct}
        initialAllCategories={initialAllCategories}
      />
    </>
  );
}
