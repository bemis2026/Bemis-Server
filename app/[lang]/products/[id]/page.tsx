import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, faqSchema, ogImage, OG_URL } from "../../../lib/seo";
import { getProductsForLang } from "../../../lib/serverProductsLang";
import { LOCALE_LANGS, LOCALE_OG, LOCALE_UI, localeCategoryMeta, type LocaleLang } from "../../../lib/localeProductSeo";
import { getContentForLang } from "../../../../lib/contentLang";
import { CATEGORY_GUIDES } from "../../../lib/categoryGuides";
import { arRehberleri } from "../../../lib/serverBlogLang";
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
  tr: path, en: `/en${path}`, de: `/de${path}`, es: `/es${path}`, ru: `/ru${path}`, nl: `/nl${path}`, ar: `/ar${path}`, "x-default": path,
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
    title: { absolute: title },
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
  // ⚠️ Kategori + ürün adları `getProductsForLang` içinde yerelleştirilir (TEK KAYNAK).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = raw.find((c: any) => c.id === id) ?? null;
  let aciklama: string | undefined;
  let faq: { q: string; a: string }[] | undefined;
  // GEO cevap blogu — dil kolunda SSR'da O DILDE basilmasi icin sunucudan gecirilir.
  let geoCevap: { q: string; a: string } | null = null;
  // "Projeye Özel Üretim" kartının metinleri de içerik katmanından, O DİLDE.
  // ⚠️ Prop olarak geçilmezse kart İLK HTML'de TÜRKÇE basılır (kök layout içeriği
  // TR hidratlar) → ziyaretçi çeviriyi hidrasyondan sonra görür, Google Türkçe okur.
  let projeKarti: { eyebrow?: string; title?: string; description?: string; ctaPrimaryLabel?: string; ctaSecondaryLabel?: string } | null = null;
  try {
    const c = (await getContentForLang(L)) as {
      categories?: Record<string, { description?: string; faq?: { q: string; a: string }[]; geoAnswer?: { q: string; a: string } }>;
      projectSection?: { eyebrow?: string; title?: string; description?: string; ctaPrimaryLabel?: string; ctaSecondaryLabel?: string };
    } | null;
    const cm = c?.categories?.[id];
    aciklama = cm?.description?.trim() || undefined;
    faq = Array.isArray(cm?.faq) && cm.faq.length > 0 ? cm.faq : undefined;
    const g = cm?.geoAnswer;
    if (g?.q?.trim() && g?.a?.trim()) geoCevap = { q: g.q, a: g.a };
    const ps = c?.projectSection;
    if (ps) projeKarti = { eyebrow: ps.eyebrow, title: ps.title, description: ps.description, ctaPrimaryLabel: ps.ctaPrimaryLabel, ctaSecondaryLabel: ps.ctaSecondaryLabel };
  } catch {}
  // "İlgili Rehberler" — YALNIZ Arapça kolda (blog rotası olan tek dil kolu).
  // Arapçası tam olmayan rehber listeden düşer; liste boşsa blok hiç basılmaz.
  const rehberler = L === "ar" ? arRehberleri(CATEGORY_GUIDES[id] ?? []) : [];
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
    // ⚠️ GEO cevabi FAQPage'in ILK maddesi (sayfada da ilk icerik blogu → sema
    //    ile gorunen icerik ayrismaz).
    ...(((geoCevap ? [geoCevap] : []).concat(faq ?? [])).length > 0
      ? [faqSchema((geoCevap ? [geoCevap] : []).concat(faq ?? []))]
      : []),
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
        geoAnswerOverride={geoCevap}
        projectSectionOverride={projeKarti}
        guidesOverride={rehberler}
        guidesTitle={L === "ar" ? "أدلة ذات صلة" : undefined}
      />
    </>
  );
}
