import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, ogImage, OG_URL } from "../../lib/seo";
import { getProductsForLang } from "../../lib/serverProductsLang";
import { productNameLocale } from "../../lib/productNamesLocale";
import { LOCALE_LANGS, LOCALE_OG, LOCALE_UI, type LocaleLang } from "../../lib/localeProductSeo";
import ProductsClient from "../../products/ProductsClient";

type ClientCategories = NonNullable<ComponentProps<typeof ProductsClient>["initialCategories"]>;

// Almanca / İspanyolca / Rusça (indekslenebilir) tüm-ürünler sayfası — /de|es|ru/products.
// app/en/products/page.tsx'in dil-parametreli eşi. Çeviriler ZATEN vardı (products bin
// `_translations[lang]` + content overlay); eksik olan yalnız ROTA idi (2026-08-28 ölçümü).
// Kabuk dili LanguageContext'te forcedLangForPath ile zorlanır (lib/languages.ts).
//
// ⚠️ dynamicParams=false → yalnız de/es/ru; başka /<x>/products 404 (ISR amplifikasyonu yok).
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return LOCALE_LANGS.map((lang) => ({ lang }));
}

const HREFLANG = (path: string) => ({
  tr: path, en: `/en${path}`, de: `/de${path}`, es: `/es${path}`, ru: `/ru${path}`, nl: `/nl${path}`, "x-default": path,
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!LOCALE_LANGS.includes(lang as LocaleLang)) return {};
  const L = lang as LocaleLang;
  const ui = LOCALE_UI[L];
  const title = `${ui.allProductsTitle} | Bemis E-V Charge`;
  const canonical = `/${L}/products`;
  return {
    title,
    description: ui.allProductsDesc,
    alternates: { canonical, languages: HREFLANG("/products") },
    openGraph: { title, description: ui.allProductsDesc, type: "website", url: canonical, locale: LOCALE_OG[L], images: ogImage(title) },
    twitter: { card: "summary_large_image", title, description: ui.allProductsDesc, images: [OG_URL] },
  };
}

export default async function LocaleProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LOCALE_LANGS.includes(lang as LocaleLang)) notFound();
  const L = lang as LocaleLang;
  const ui = LOCALE_UI[L];
  // O dilin birleştirilmiş kataloğu — açıklama/spec çevrili. ⚠️ Ürün ADI merge'de
  // TR-kilitli → elle küratörlü harita (productNamesLocale) BURADA uygulanır.
  const raw = (await getProductsForLang(L)) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = raw.map((cat: any) => ({
    ...cat,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: (cat.products ?? []).map((p: any) => (p && typeof p.name === "string" ? { ...p, name: productNameLocale(L, p.name) } : p)),
  }));
  const items = categories.flatMap((cat) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cat.products ?? []).map((p: any) => ({ id: p.id, name: p.name, categoryId: cat.id }))
  );
  const jsonLd = [
    breadcrumbSchema([
      { name: ui.home, url: "/" },
      { name: ui.products, url: `/${L}/products` },
    ]),
    collectionPageSchema({ name: ui.allProducts, description: ui.catalogueDesc, url: `/${L}/products`, products: items }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductsClient initialCategories={categories as unknown as ClientCategories} initialLang={L} />
    </>
  );
}
