import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, faqSchema, ogImage, OG_URL } from "../lib/seo";
import { getProductsForLang } from "../lib/serverProductsLang";
import { LOCALE_CATEGORY_SEO, LOCALE_UI, localeCategoryMeta } from "../lib/localeProductSeo";
import { AR_SSS } from "./arIcerik";
import ArLandingClient from "./ArLandingClient";

// Arapça giriş sayfası — /ar. Körfez/Orta Doğu ziyaretçisi için "üretici kimdir"
// sayfası; /export'un Arapça muadili. Bu rota AÇILMADAN ÖNCE /ar adresi 404 veriyordu
// (yalnız /ar/products… vardı) → Arapça kol ürün rotalarının dışına ilk kez çıkıyor.
//
// ⚠️ NEDEN app/ar/page.tsx DEĞİL: statik bir `ar` segmenti, aynı seviyedeki dinamik
// `app/[lang]/products` kolunu gölgeler ve /ar/products altındaki 159 sayfayı kırardı.
// Bu yüzden dinamik segment kullanılıp params YALNIZ "ar" ile sınırlandırıldı.
// ⚠️ Bu dizine layout.tsx EKLEME — segment ayarları (dynamicParams) çocuklara da
// iner ve /ar/products kolunu etkiler.
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return [{ lang: "ar" }];
}

// /ar = anasayfa kümesinin Arapça sürümü (TR anasayfa · EN /export · AR /ar).
// ⚠️ Küme KARŞILIKLI olmalı: app/page.tsx ve app/export/page.tsx da ar: "/ar" verir.
const HREFLANG = { tr: "/", en: "/export", ar: "/ar", "x-default": "/" } as const;

const TITLE = "مصنّع محطات شحن السيارات الكهربائية | Bemis E-V Charge";
const DESC =
  "مصنّع لمعدات شحن السيارات الكهربائية منذ 1994: محطات جدارية AC من 3,7 إلى 22 kW، شحن سريع DC حتى 200 kW، كابلات Type 2. شهادة CE و IP65. إنتاج OEM/ODM وتصدير إلى أكثر من 80 دولة.";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== "ar") return {};
  return {
    title: { absolute: TITLE },
    description: DESC,
    keywords: [
      "مصنّع شواحن السيارات الكهربائية",
      "محطات شحن جدارية",
      "شاحن سريع DC",
      "كابل شحن Type 2",
      "OEM شواحن كهربائية",
      "تصدير شواحن السيارات الكهربائية",
    ],
    alternates: { canonical: "/ar", languages: HREFLANG },
    openGraph: {
      title: TITLE,
      description: DESC,
      type: "website",
      url: "/ar",
      locale: "ar_AE",
      siteName: "Bemis E-V Charge",
      images: ogImage(TITLE),
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_URL] },
  };
}

export default async function ArLandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ar") notFound();

  // Kategori adı/özeti Arapça SEO haritasından; sıra + hangi kategorilerin var olduğu
  // CANLI kataloğdan gelir (kategori eklenir/kaldırılırsa sayfa kendiliğinden uyar).
  const raw = (await getProductsForLang("ar")) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canli = (raw as any[])
    .filter((c) => c?.id && (c.products?.length ?? 0) > 0)
    .map((c) => {
      const meta = localeCategoryMeta("ar", String(c.id), String(c.name ?? c.id));
      return { id: String(c.id), ad: meta.name, ozet: meta.description };
    });
  // Katalog okunamazsa (yerel derleme, R2 kimliği yok) sayfa kategorisiz kalmasın.
  const kategoriler = canli.length
    ? canli
    : Object.keys(LOCALE_CATEGORY_SEO.ar).map((id) => {
        const meta = localeCategoryMeta("ar", id, id);
        return { id, ad: meta.name, ozet: meta.description };
      });

  const ui = LOCALE_UI.ar;
  const jsonLd = [
    breadcrumbSchema([
      { name: ui.home, url: "/" },
      { name: "Bemis E-V Charge", url: "/ar" },
    ]),
    // ⚠️ Sorular arIcerik.ts'ten gelir = sayfada GÖRÜNEN metinle birebir aynı
    // (Google: şemadaki içerik sayfada görünür olmalı).
    faqSchema(AR_SSS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArLandingClient kategoriler={kategoriler} />
    </>
  );
}
