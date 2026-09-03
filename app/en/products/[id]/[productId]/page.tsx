import type { Metadata } from "next";
import JsonLd from "../../../../components/JsonLd";
import { breadcrumbSchema, productSchema, ogImage, OG_URL, SITE_URL, reviewsForProduct, type ReviewShape } from "../../../../lib/seo";
import type { ComponentProps } from "react";
import { getServerProducts, getServerCategoriesMeta, getServerSiteContent } from "../../../../lib/server-content";
import { getProductsForLang } from "../../../../lib/serverProductsLang";
import { productNameEn } from "../../../../lib/productNamesEn";
import { enProductMeta } from "../../../../lib/enProductSeo";
import ProductDetailClient from "../../../../products/[id]/[productId]/ProductDetailClient";

// İNGİLİZCE ürün detay sayfası — TR eşinin (/products/[id]/[productId]) aynası.
// Sunucu tarafı = SEO (İngilizce metadata + JSON-LD + karşılıklı hreflang);
// gövde = AYNI ProductDetailClient.
//
// ⚠️ GÖVDE ARTIK SUNUCUDA BASILIR (initialProduct/initialCategory + initialLang="en").
// Eskiden yalnız istemci /api/products?lang=en çekiyordu; ölçüm (2026-08-26):
// arama motoru bu sayfalarda 46 kelime ve HİÇ <h1> görmüyordu (TR eşi 804 kelime),
// üstelik sunucuda basılan Product şemasının açıklaması TÜRKÇE'ydi — çünkü şemaya
// TR ürün nesnesi veriliyordu. Bkz. app/lib/serverProductsLang.ts.
//
// ⚠️ enProductMeta'ya BİLEREK TR ürünü verilir: İngilizce meta başlık/açıklamayı
// TR spec değerlerinden üretir ve bu ZATEN doğru İngilizce çıktı veriyor
// ("22 kW · three-phase · 32A"). EN spec'lerine geçirmek çalışan metni değiştirirdi.
//
// ISR: dynamicParams=false + generateStaticParams → yalnız gerçek ürün yolları
// üretilir (bot amplifikasyonu yok), revalidate 1 gün — TR sayfasıyla aynı politika.
export const dynamicParams = false;
export const revalidate = 86400;

type DetailProps = ComponentProps<typeof ProductDetailClient>;

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
  // og:image optimize — TR ürün sayfasıyla aynı gerekçe (ham PNG 1–4 MB → ~50 KB). w=1080 deviceSizes'ta.
  const ogImg = image ? `${SITE_URL}/_next/image?url=${encodeURIComponent(image)}&w=1080&q=88` : undefined;
  const enName = productNameEn(product.name);
  return {
    title,
    description,
    alternates: {
      canonical,
      // Karşılıklı hreflang: TR eşi ↔ bu sayfa; x-default TR (ana pazar).
      languages: { tr: trPath, en: canonical, de: `/de${trPath}`, es: `/es${trPath}`, ru: `/ru${trPath}`, "x-default": trPath },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      locale: "en_US",
      images: ogImg ? [{ url: ogImg, alt: enName, width: 1080 }] : ogImage(enName),
    },
    twitter: { card: "summary_large_image", title, description, images: ogImg ? [ogImg] : [OG_URL] },
  };
}

export default async function EnProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  const [trCategories, enCategories, catsMeta, site] = await Promise.all([
    getServerProducts(),
    getProductsForLang("en"),
    getServerCategoriesMeta(),
    getServerSiteContent(),
  ]);
  const category = trCategories.find((c) => c.id === id);
  const product = category?.products?.find((p) => p.id === productId);
  if (!category || !product) return <ProductDetailClient />;
  const meta = catsMeta[id] ?? {};
  const { enName, categoryName } = enProductMeta(product, id, meta.name || category.name);
  // İngilizce karşılıklar — overlay bir şekilde okunamazsa TR'ye düşer, yani
  // sayfa boş kalmaz (sessiz bozulma yerine görünür ama Türkçe içerik).
  const enCats = enCategories ?? [];
  const enCategory = enCats.find((c) => c.id === id) ?? category;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enProduct = (enCategory?.products ?? []).find((p: any) => p.id === productId) ?? product;
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
      // ⚠️ TR ürün DEĞİL, İngilizce birleştirilmiş ürün — `description` bu yüzden
      // artık İngilizce. `enName` = productNameEn(product.name), yani enProduct.name
      // ile birebir aynı; açıkça yazılması şema adını değişmez tutar.
      product: { ...enProduct, name: enName },
      categoryName,
      categoryId: id,
      reviews: productReviews,
      urlPath: `/en/products/${id}/${productId}`,
    }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient
        initialCategory={enCategory as unknown as NonNullable<DetailProps["initialCategory"]>}
        initialProduct={enProduct as unknown as NonNullable<DetailProps["initialProduct"]>}
        initialAllCategories={enCats as unknown as NonNullable<DetailProps["initialAllCategories"]>}
        initialLang="en"
        productReviews={productReviews}
      />
    </>
  );
}
