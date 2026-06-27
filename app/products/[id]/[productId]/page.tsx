import type { ComponentProps } from "react";
import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, productSchema, productMetaTitle, productMetaDescription, productKeywords, ogImage, OG_URL } from "../../../lib/seo";
import { getServerProducts, getServerCategoriesMeta } from "../../../lib/server-content";
import ProductDetailClient from "./ProductDetailClient";

type DetailProps = ComponentProps<typeof ProductDetailClient>;

// DİNAMİK (SSR) — ISR DEĞİL.
// Neden: dynamicParams=true + ISR iken bot/tarayıcı taramaları geçersiz
// /products/<rastgele>/<rastgele> yollarını 200 sayfa olarak render edip ISR
// cache'e YAZIYORDU (iki segment = sınırsız kombinasyon). Her benzersiz yol =
// 1 ISR yazma → Vercel "ISR Writes" limiti (200k/ay) doluyor, proje
// duraklatılma riskine giriyordu. force-dynamic ile sayfa her istekte sunucuda
// render edilir, ISR'a HİÇ yazılmaz; içerik her zaman GÜNCEL; yeni ürünler
// redeploy beklemeden çalışır. (Görünür içerik zaten client-side taze geliyor.)
export const dynamic = "force-dynamic";

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
  // Ürün bazlı SEO geçersiz kılmaları (admin) varsa onları kullan; yoksa üret.
  const title = product.metaTitle?.trim() || productMetaTitle(product, categoryName);
  const description = product.metaDescription?.trim() || productMetaDescription(product, categoryName, id);
  const keywords = productKeywords(product);
  const canonical = `/products/${id}/${productId}`;
  const image = product.image || product.images?.[0];
  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: { canonical, languages: { tr: canonical, "x-default": canonical } },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      // Üründe foto varsa onu KORU (override etme); yoksa sitenin OG kartına düş.
      images: image ? [{ url: image, alt: product.name }] : ogImage(product.name),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [OG_URL],
    },
  };
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
