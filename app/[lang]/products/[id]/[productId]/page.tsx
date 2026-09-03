import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import JsonLd from "../../../../components/JsonLd";
import { breadcrumbSchema, productSchema, ogImage, OG_URL, SITE_URL, reviewsForProduct, type ReviewShape } from "../../../../lib/seo";
import { getServerProducts, getServerCategoriesMeta, getServerSiteContent } from "../../../../lib/server-content";
import { getProductsForLang } from "../../../../lib/serverProductsLang";
import { productNameLocale } from "../../../../lib/productNamesLocale";
import { LOCALE_LANGS, LOCALE_OG, LOCALE_UI, localeProductMeta, type LocaleLang } from "../../../../lib/localeProductSeo";
import ProductDetailClient from "../../../../products/[id]/[productId]/ProductDetailClient";

// /de|es|ru/products/<kategori>/<ürün> — app/en/products/[id]/[productId]/page.tsx'in
// dil-parametreli eşi. Gövde sunucuda basılır; Product şeması o dilin birleştirilmiş
// ürünüyle (açıklama çevrili) + elle küratörlü ürün adıyla üretilir.
// ⚠️ localeProductMeta'ya BİLEREK TR ürünü verilir (spec değerleri dil-nötr; etiket
// eşleme TR/EN kalıplarıyla çalışır) — EN sayfasındaki ispatlı desen.
export const dynamicParams = false;
export const revalidate = 86400;

type DetailProps = ComponentProps<typeof ProductDetailClient>;

export async function generateStaticParams() {
  const categories = await getServerProducts();
  return LOCALE_LANGS.flatMap((lang) =>
    categories.flatMap((c) => (c.products ?? []).map((p) => ({ lang, id: c.id, productId: p.id })))
  );
}

const HREFLANG = (path: string) => ({
  tr: path, en: `/en${path}`, de: `/de${path}`, es: `/es${path}`, ru: `/ru${path}`, "x-default": path,
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string; productId: string }> }): Promise<Metadata> {
  const { lang, id, productId } = await params;
  if (!LOCALE_LANGS.includes(lang as LocaleLang)) return {};
  const L = lang as LocaleLang;
  const [categories, catsMeta] = await Promise.all([getServerProducts(), getServerCategoriesMeta()]);
  const category = categories.find((c) => c.id === id);
  const product = category?.products?.find((p) => p.id === productId);
  if (!category || !product) return { title: LOCALE_UI[L].notFoundProduct };
  const meta = catsMeta[id] ?? {};
  const { name, title, description } = localeProductMeta(product, L, id, meta.name || category.name);
  const canonical = `/${L}/products/${id}/${productId}`;
  const image = product.image || product.images?.[0];
  // og:image optimize — TR/EN ürün sayfasıyla aynı (ham PNG 1–4 MB → ~200 KB; w=1080 deviceSizes'ta).
  const ogImg = image ? `${SITE_URL}/_next/image?url=${encodeURIComponent(image)}&w=1080&q=88` : undefined;
  return {
    title,
    description,
    alternates: { canonical, languages: HREFLANG(`/products/${id}/${productId}`) },
    openGraph: { title, description, type: "website", url: canonical, locale: LOCALE_OG[L], images: ogImg ? [{ url: ogImg, alt: name, width: 1080 }] : ogImage(name) },
    twitter: { card: "summary_large_image", title, description, images: ogImg ? [ogImg] : [OG_URL] },
  };
}

export default async function LocaleProductDetailPage({ params }: { params: Promise<{ lang: string; id: string; productId: string }> }) {
  const { lang, id, productId } = await params;
  if (!LOCALE_LANGS.includes(lang as LocaleLang)) notFound();
  const L = lang as LocaleLang;
  const ui = LOCALE_UI[L];
  const [trCategories, locCategories, catsMeta, site] = await Promise.all([
    getServerProducts(), getProductsForLang(L), getServerCategoriesMeta(), getServerSiteContent(),
  ]);
  const category = trCategories.find((c) => c.id === id);
  const product = category?.products?.find((p) => p.id === productId);
  if (!category || !product) notFound();
  const meta = catsMeta[id] ?? {};
  const { name, categoryName } = localeProductMeta(product, L, id, meta.name || category.name);
  // O dilin birleştirilmiş kataloğu + elle küratörlü adlar (merge adı TR-kilitli).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locCats = ((locCategories ?? []) as any[]).map((cat) => ({
    ...cat,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: (cat.products ?? []).map((p: any) => (p && typeof p.name === "string" ? { ...p, name: productNameLocale(L, p.name) } : p)),
  }));
  const locCategory = locCats.find((c) => c.id === id) ?? category;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locProduct = (locCategory?.products ?? []).find((p: any) => p.id === productId) ?? product;
  const reviewItems = ((site as { reviews?: { items?: ReviewShape[] } })?.reviews?.items) ?? [];
  const productReviews = reviewsForProduct(productId, reviewItems);
  const jsonLd = [
    breadcrumbSchema([
      { name: ui.home, url: "/" },
      { name: ui.products, url: `/${L}/products` },
      { name: categoryName, url: `/${L}/products/${id}` },
      { name, url: `/${L}/products/${id}/${productId}` },
    ]),
    productSchema({
      product: { ...locProduct, name },
      categoryName,
      categoryId: id,
      reviews: productReviews,
      urlPath: `/${L}/products/${id}/${productId}`,
    }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient
        initialCategory={locCategory as unknown as NonNullable<DetailProps["initialCategory"]>}
        initialProduct={locProduct as unknown as NonNullable<DetailProps["initialProduct"]>}
        initialAllCategories={locCats as unknown as NonNullable<DetailProps["initialAllCategories"]>}
        initialLang={L}
        productReviews={productReviews}
      />
    </>
  );
}
