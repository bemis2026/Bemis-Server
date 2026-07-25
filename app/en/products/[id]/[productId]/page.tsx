import type { Metadata } from "next";
import JsonLd from "../../../../components/JsonLd";
import { breadcrumbSchema, productSchema, ogImage, OG_URL, reviewsForProduct, type ReviewShape } from "../../../../lib/seo";
import { getServerProducts, getServerCategoriesMeta, getServerSiteContent } from "../../../../lib/server-content";
import { productNameEn } from "../../../../lib/productNamesEn";
import { enProductMeta } from "../../../../lib/enProductSeo";
import ProductDetailClient from "../../../../products/[id]/[productId]/ProductDetailClient";

// İNGİLİZCE ürün detay sayfası — TR eşinin (/products/[id]/[productId]) aynası.
// Sunucu tarafı = SEO (İngilizce metadata + JSON-LD + karşılıklı hreflang);
// gövde = AYNI ProductDetailClient. ⚠️ initialProduct/initialCategory GEÇİLMEZ →
// istemci `lang="en"` ile /api/products?lang=en çeker (adlar/açıklamalar İngilizce).
// Bu, /en/products/[id] kategori sayfasıyla AYNI desen.
//
// ISR: dynamicParams=false + generateStaticParams → yalnız gerçek ürün yolları
// üretilir (bot amplifikasyonu yok), revalidate 1 gün — TR sayfasıyla aynı politika.
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  const categories = await getServerProducts();
  return categories.flatMap((c) => (c.products ?? []).map((p) => ({ id: c.id, productId: p.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}): Promise<Metadata> {
  const { id, productId } = await params;
  const [categories, catsMeta] = await Promise.all([getServerProducts(), getServerCategoriesMeta()]);
  const category = categories.find((c) => c.id === id);
  const product = category?.products?.find((p) => p.id === productId);
  if (!category || !product) {
    return { title: "Product not found", description: "This product is no longer available. Browse all categories at /en/products." };
  }
  const meta = catsMeta[id] ?? {};
  const { title, description } = enProductMeta(product, id, meta.name || category.name);
  const canonical = `/en/products/${id}/${productId}`;
  const trPath = `/products/${id}/${productId}`;
  const image = product.image || product.images?.[0];
  const enName = productNameEn(product.name);
  return {
    title,
    description,
    alternates: {
      canonical,
      // Karşılıklı hreflang: TR eşi ↔ bu sayfa; x-default TR (ana pazar).
      languages: { tr: trPath, en: canonical, "x-default": trPath },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      locale: "en_US",
      images: image ? [{ url: image, alt: enName }] : ogImage(enName),
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [OG_URL] },
  };
}

export default async function EnProductDetailPage({
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
  const category = categories.find((c) => c.id === id);
  const product = category?.products?.find((p) => p.id === productId);
  if (!category || !product) return <ProductDetailClient />;
  const meta = catsMeta[id] ?? {};
  const { enName, categoryName } = enProductMeta(product, id, meta.name || category.name);
  // Gerçek müşteri yorumları — TR sayfasıyla AYNI (şema + görünür bölüm birlikte;
  // Google yapılandırılmış veri politikası görünmeyen yorumu şemaya koymayı yasaklar).
  const reviewItems = ((site as { reviews?: { items?: ReviewShape[] } })?.reviews?.items) ?? [];
  const productReviews = reviewsForProduct(productId, reviewItems);
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/en/products" },
      { name: categoryName, url: `/en/products/${id}` },
      { name: enName, url: `/en/products/${id}/${productId}` },
    ]),
    // Ad İngilizce + şema URL'i bu sayfaya (varsayılan TR yolu değil).
    productSchema({
      product: { ...product, name: enName },
      categoryName,
      categoryId: id,
      reviews: productReviews,
      urlPath: `/en/products/${id}/${productId}`,
    }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient productReviews={productReviews} />
    </>
  );
}
