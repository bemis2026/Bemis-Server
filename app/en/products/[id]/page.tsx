import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, faqSchema, ogImage, OG_URL } from "../../../lib/seo";
import type { ComponentProps } from "react";
import { getProductsForLang } from "../../../lib/serverProductsLang";
import { productNameEn } from "../../../lib/productNamesEn";
import { enCategoryMeta } from "../../../lib/enProductSeo";
import { getContentForLang } from "../../../../lib/contentLang";
import ProductCategoryClient from "../../../products/[id]/ProductCategoryClient";

// İngilizce (indekslenebilir) kategori sayfaları — /en/products/<kategori>.
// TR karşılığı /products/<kategori>; hreflang ile karşılıklı bağlı. İçerik
// LanguageContext tarafından İngilizce zorlanır (lib/languages ENGLISH_ONLY_PATHS
// → /en/* ).
//
// ⚠️ Gövde SUNUCUDA basılır (initialCategory + initialLang="en"). Eskiden yalnız
// istemci /api/products?lang=en çekiyordu → arama motoru bu sayfalarda ~30 kelime
// ve HİÇ <h1> görmüyordu (TR eşi 844 kelime). Bkz. app/lib/serverProductsLang.ts.
//
// ⚠️ Statik (ISR): TR sayfasıyla aynı 8 kategori; dynamicParams=false → bilinmeyen
// /en/products/<x> 404 (ISR write amplifikasyonu yok). revalidate 1 gün.
export const dynamicParams = false;
export const revalidate = 86400;

const CATEGORY_IDS = [
  "wallbox", "portable", "cables", "v2l-c2l",
  "converters", "charger-equipment", "accessories", "dc-units",
];

export function generateStaticParams() {
  return CATEGORY_IDS.map((id) => ({ id }));
}

// İngilizce kategori meta'sı ORTAK dosyada (app/lib/enProductSeo.ts) — ürün detay
// sayfası da aynı kaynağı kullanır; kopya metin tutulmaz.
const enMeta = enCategoryMeta;

type ClientCategory = NonNullable<ComponentProps<typeof ProductCategoryClient>["initialCategory"]>;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!CATEGORY_IDS.includes(id)) {
    return { title: "Category not found", description: "Browse all products at /en/products." };
  }
  // İngilizce kategori adı (çeviri) — fallback için.
  let enName = id;
  try {
    const en = (await getContentForLang("en")) as { categories?: Record<string, { name?: string }> } | null;
    enName = en?.categories?.[id]?.name || id;
  } catch {}
  const m = enMeta(id, enName);
  const canonical = `/en/products/${id}`;
  const trCanonical = `/products/${id}`;
  const title = `${m.title} | Bemis E-V Charge`;
  return {
    title,
    description: m.description,
    alternates: {
      canonical,
      languages: { en: canonical, tr: trCanonical, de: `/de${trCanonical}`, es: `/es${trCanonical}`, ru: `/ru${trCanonical}`, "x-default": trCanonical },
    },
    openGraph: {
      title, description: m.description, type: "website", url: canonical,
      locale: "en_US", images: ogImage(m.title),
    },
    twitter: { card: "summary_large_image", title, description: m.description, images: [OG_URL] },
  };
}

export default async function EnProductCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // İngilizce birleştirilmiş katalog — ad/açıklama/spec İngilizce.
  const categories = (await getProductsForLang("en")) ?? [];
  // ⚠️ Kategori AÇIKLAMASI ve SSS ürün verisinde değil İÇERİK (CMS) katmanında.
  // Kök layout içeriği TR hidratladığı için bunlar İngilizce sayfada da Türkçe
  // basılıyordu — sayfanın en ağır özgün SEO metni. Sunucudan İngilizcesini alıp
  // prop olarak geçiriyoruz. (Menü/footer etiketleri hâlâ TR SSR — kök layout
  // rotayı bilmediği için bilinen mimari sınır, tüm diller için geçerli.)
  let enAciklama: string | undefined;
  let enFaq: { q: string; a: string }[] | undefined;
  try {
    const enContent = (await getContentForLang("en")) as {
      categories?: Record<string, { description?: string; faq?: { q: string; a: string }[] }>;
    } | null;
    const cm = enContent?.categories?.[id];
    enAciklama = cm?.description?.trim() || undefined;
    enFaq = Array.isArray(cm?.faq) && cm.faq.length > 0 ? cm.faq : undefined;
  } catch {}
  const category = categories.find((c) => c.id === id);
  const m = enMeta(id, category?.name || id);
  // Adlar getProductsForLang("en") içinde zaten İngilizceleştirildi; productNameEn
  // burada ikinci kez uygulanır — eşleşme yoksa değeri AYNEN döndürdüğü için
  // güvenli (İngilizceye çevrilmiş ada tekrar uygulamak zarar vermez).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (category?.products ?? []).map((p: any) => ({ id: p.id, name: productNameEn(p.name), categoryId: id }));
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/en/products" },
      { name: m.name, url: `/en/products/${id}` },
    ]),
    collectionPageSchema({
      name: m.name,
      description: m.description,
      url: `/en/products/${id}`,
      products,
    }),
    // TR kategori sayfasıyla parite: SSS varsa FAQPage şeması da basılır.
    // (Google kuralı: şemadaki soru-cevap sayfada GÖRÜNÜR olmalı — enFaq aynı
    // anda hem şemaya hem gövdeye gidiyor.)
    ...(enFaq && enFaq.length > 0 ? [faqSchema(enFaq)] : []),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      {/* titleOverride → H1 İngilizce (kategori adı kimlik-alanı olduğu için ürün
          verisinde TR sabit; İngilizce sayfada İngilizce H1 SEO için şart). */}
      <ProductCategoryClient
        initialCategory={(category ?? null) as unknown as ClientCategory | null}
        initialLang="en"
        titleOverride={m.name}
        descriptionOverride={enAciklama}
        faqOverride={enFaq}
      />
    </>
  );
}
