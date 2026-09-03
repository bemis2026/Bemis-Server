import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, faqSchema, ogImage, OG_URL } from "../../../lib/seo";
import { getProductsForLang } from "../../../lib/serverProductsLang";
import { productNameLocale } from "../../../lib/productNamesLocale";
import { LOCALE_LANGS, LOCALE_OG, LOCALE_UI, localeCategoryMeta, type LocaleLang } from "../../../lib/localeProductSeo";
import { getContentForLang } from "../../../../lib/contentLang";
import ProductCategoryClient from "../../../products/[id]/ProductCategoryClient";

// /de|es|ru/products/<kategori> — app/en/products/[id]/page.tsx'in dil-parametreli eşi.
// Gövde SUNUCUDA basılır (initialCategory + initialLang); kategori açıklaması ve SSS
// içerik (CMS) katmanından o dilde alınıp override olarak geçer.
// ⚠️ Kategori açıklaması kayması 2026-08-28'de 5 dilde düzeltildi (commit 105b7d4);
// SSS dizisi kayması bu kolları açarken ayrıca ele alındı (bkz. bağlam dosyası).
export const dynamicParams = false;
export const revalidate = 86400;

const CATEGORY_IDS = ["wallbox", "portable", "cables", "v2l-c2l", "converters", "charger-equipment", "accessories", "dc-units"];

export function generateStaticParams() {
  return LOCALE_LANGS.flatMap((lang) => CATEGORY_IDS.map((id) => ({ lang, id })));
}

type ClientCategory = NonNullable<ComponentProps<typeof ProductCategoryClient>["initialCategory"]>;

const HREFLANG = (path: string) => ({
  tr: path, en: `/en${path}`, de: `/de${path}`, es: `/es${path}`, ru: `/ru${path}`, nl: `/nl${path}`, "x-default": path,
});

async function localeCategoryName(L: LocaleLang, id: string): Promise<string> {
  try {
    const c = (await getContentForLang(L)) as { categories?: Record<string, { name?: string }> } | null;
    return c?.categories?.[id]?.name || id;
  } catch { return id; }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  if (!LOCALE_LANGS.includes(lang as LocaleLang) || !CATEGORY_IDS.includes(id)) return {};
  const L = lang as LocaleLang;
  const m = localeCategoryMeta(L, id, await localeCategoryName(L, id));
  const canonical = `/${L}/products/${id}`;
  const title = `${m.title} | Bemis E-V Charge`;
  return {
    title,
    description: m.description,
    alternates: { canonical, languages: HREFLANG(`/products/${id}`) },
    openGraph: { title, description: m.description, type: "website", url: canonical, locale: LOCALE_OG[L], images: ogImage(m.title) },
    twitter: { card: "summary_large_image", title, description: m.description, images: [OG_URL] },
  };
}

export default async function LocaleProductCategoryPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (!LOCALE_LANGS.includes(lang as LocaleLang) || !CATEGORY_IDS.includes(id)) notFound();
  const L = lang as LocaleLang;
  const ui = LOCALE_UI[L];
  const raw = (await getProductsForLang(L)) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category0 = raw.find((c: any) => c.id === id);
  const category = category0
    ? { ...category0, products: (category0.products ?? []).map((p: { name?: string }) => (p && typeof p.name === "string" ? { ...p, name: productNameLocale(L, p.name) } : p)) }
    : null;
  let aciklama: string | undefined;
  let faq: { q: string; a: string }[] | undefined;
  try {
    const c = (await getContentForLang(L)) as { categories?: Record<string, { description?: string; faq?: { q: string; a: string }[] }> } | null;
    const cm = c?.categories?.[id];
    aciklama = cm?.description?.trim() || undefined;
    faq = Array.isArray(cm?.faq) && cm.faq.length > 0 ? cm.faq : undefined;
  } catch {}
  const m = localeCategoryMeta(L, id, category?.name || id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (category?.products ?? []).map((p: any) => ({ id: p.id, name: p.name, categoryId: id }));
  const jsonLd = [
    breadcrumbSchema([
      { name: ui.home, url: "/" },
      { name: ui.products, url: `/${L}/products` },
      { name: m.name, url: `/${L}/products/${id}` },
    ]),
    collectionPageSchema({ name: m.name, description: m.description, url: `/${L}/products/${id}`, products }),
    ...(faq && faq.length > 0 ? [faqSchema(faq)] : []),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductCategoryClient
        initialCategory={(category ?? null) as unknown as ClientCategory | null}
        initialLang={L}
        titleOverride={m.name}
        descriptionOverride={aciklama}
        faqOverride={faq}
      />
    </>
  );
}
