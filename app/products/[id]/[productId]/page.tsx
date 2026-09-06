import type { ComponentProps } from "react";
import type { Metadata } from "next";
import { cloudinarySrc } from "../../../lib/cloudinary";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, productSchema, productMetaTitle, productMetaDescription, productKeywords, ogImage, OG_URL, SITE_URL, reviewsForProduct, type ReviewShape } from "../../../lib/seo";
import { getServerProducts, getServerCategoriesMeta, getServerSiteContent } from "../../../lib/server-content";
import ProductDetailClient from "./ProductDetailClient";

type DetailProps = ComponentProps<typeof ProductDetailClient>;

// STATİK (ISR, SINIRLI yazma) — generateStaticParams + dynamicParams=false + uzun revalidate.
// ⚠️ Eski force-dynamic'in sebebi: dynamicParams=TRUE + ISR iken botlar
// /products/<rastgele>/<rastgele> üretip ISR'a SINIRSIZ yazıyordu (200k/ay kota
// patlaması — gerçek olay). YENİ YÖNTEM AMPLİFİKASYONU GİDERİR: dynamicParams=FALSE
// ile YALNIZ gerçek ürün yolları üretilir, bilinmeyen URL 404 → amplifikasyon YOK.
// revalidate=86400 (1 gün) → ~113 sayfa × günde 1 ≈ aylık birkaç bin yazma (200k'nın
// çok altında). Ürün verisi build'de getServerProducts (data/products.json fallback);
// yeni ürünler redeploy ile yayınlanır (Blob okuması kapalı, içerik zaten commit'le geliyor).
// ⚠️ ISR Writes metriğini birkaç gün İZLE; beklenmedik artışta revalidate'i uzat / geri al.
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  const categories = await getServerProducts();
  return categories.flatMap((c) =>
    (c.products ?? []).map((p) => ({ id: c.id, productId: p.id })),
  );
}

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
  // ⚠️ og:image OPTİMİZE (2026-09-03 denetimi): ham Cloudinary PNG'leri 1–4,2 MB idi
  // (12/12 üründe, ort. 2,3 MB) → WhatsApp/LinkedIn her paylaşımda bunu indiriyordu.
  // Aynı görsel Next optimizer'dan geçer (~50 KB); w=1080 next.config deviceSizes'ta
  // OLMALI (1200 listede yok → 400 dönerdi). Scraper Accept'e göre PNG/WebP alır.
  const ogImg = image ? `${SITE_URL}/_next/image?url=${encodeURIComponent(cloudinarySrc(image))}&w=1080&q=88` : undefined;
  return {
    title,
    description,
    ...(keywords && { keywords }),
    // Karşılıklı hreflang: İngilizce eşi /en/products/... (2026-07-25).
    alternates: { canonical, languages: { tr: canonical, en: `/en${canonical}`, de: `/de${canonical}`, es: `/es${canonical}`, ru: `/ru${canonical}`, nl: `/nl${canonical}`, "x-default": canonical } },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      // Üründe foto varsa onu KORU (override etme); yoksa sitenin OG kartına düş.
      images: ogImg ? [{ url: ogImg, alt: product.name, width: 1080 }] : ogImage(product.name),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImg ? [ogImg] : [OG_URL],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  const [categories, catsMeta, site] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
    getServerSiteContent(),
  ]);
  const category = categories.find(c => c.id === id);
  const product = category?.products?.find(p => p.id === productId);
  if (!category || !product) return <ProductDetailClient />;
  const meta = catsMeta[id] ?? {};
  const initialCategory = category as unknown as NonNullable<DetailProps["initialCategory"]>;
  const initialProduct = product as unknown as NonNullable<DetailProps["initialProduct"]>;
  const initialAllCategories = categories as unknown as NonNullable<DetailProps["initialAllCategories"]>;
  const categoryName = meta.name || category.name;
  // Bu ürüne ait gerçek müşteri yorumları (curated eşleşme) → Product'a yıldız.
  const reviewItems = ((site as { reviews?: { items?: ReviewShape[] } })?.reviews?.items) ?? [];
  const productReviews = reviewsForProduct(productId, reviewItems);
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Tüm Ürünler", url: "/products" },
      { name: categoryName, url: `/products/${id}` },
      { name: product.name, url: `/products/${id}/${productId}` },
    ]),
    productSchema({ product, categoryName, categoryId: id, reviews: productReviews }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient
        initialCategory={initialCategory}
        initialProduct={initialProduct}
        initialAllCategories={initialAllCategories}
        productReviews={productReviews}
      />
    </>
  );
}
