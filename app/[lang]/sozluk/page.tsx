import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, definedTermSetSchema, ogImage, OG_URL } from "../../lib/seo";
import { terimlerDilde } from "../../lib/serverGlossaryLang";
import GlossaryClient from "../../sozluk/GlossaryClient";

// Arapça sözlük listesi — /ar/sozluk.
//
// ⚠️ ÇEVİRİ ZATEN VARDI, EKSİK OLAN ROTAYDI: `data/i18n/glossary.json` 15 terimin
// Arapçasını aylardır taşıyordu ama indekslenebilir bir Arapça ADRES yoktu — ziyaretçi
// dili değiştirince metin Arapça oluyordu, Google ise yalnız TR adresi görüyordu.
// Aynı kusur sınıfı 2026-08-26'da /en ürünlerinde yaşanmıştı.
//
// ⚠️ İçerik SUNUCUDA Arapça basılır (terimler o dilde prop olarak geçilir) — istemci
// yeniden birleştirse de sonuç aynıdır (birleştirme idempotent).
// ⚠️ Bu dizine layout.tsx EKLEME: segment ayarları çocuklara iner, /ar/products kolunu etkiler.

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return [{ lang: "ar" }];
}

const BASLIK = "قاموس مصطلحات شحن السيارات الكهربائية | Bemis E-V Charge";
const ACIKLAMA =
  "شرح مختصر وواضح لأكثر مصطلحات شحن السيارات الكهربائية تداولاً: Type 2 و CCS2 و OCPP و V2L و kW/kWh وإدارة الأحمال (DLM) و IP65/IP66 وغيرها.";
const SET_ADI = "قاموس مصطلحات شحن السيارات الكهربائية";

// ⚠️ Karşılıklı küme: /sozluk ve /sozluk/[slug] de ar girişini verir.
const HREFLANG = { tr: "/sozluk", ar: "/ar/sozluk", "x-default": "/sozluk" } as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== "ar") return {};
  return {
    title: { absolute: BASLIK },
    description: ACIKLAMA,
    alternates: { canonical: "/ar/sozluk", languages: HREFLANG },
    openGraph: {
      title: BASLIK, description: ACIKLAMA, type: "website",
      url: "/ar/sozluk", locale: "ar_AE", siteName: "Bemis E-V Charge", images: ogImage(SET_ADI),
    },
    twitter: { card: "summary_large_image", title: BASLIK, description: ACIKLAMA, images: [OG_URL] },
  };
}

export default async function ArapcaSozlukPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ar") notFound();

  const terimler = terimlerDilde("ar");
  const jsonLd = [
    breadcrumbSchema([
      { name: "الرئيسية", url: "/" },
      { name: "المصطلحات", url: "/ar/sozluk" },
    ]),
    // ⚠️ taban "/ar/sozluk": şemadaki her adres Arapça sayfaya işaret etmeli,
    // TR adresine değil (aksi hâlde şema başka bir sayfayı tarif eder).
    definedTermSetSchema(terimler, { taban: "/ar/sozluk", dil: "ar", setAdi: SET_ADI }),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <GlossaryClient mode="index" terms={terimler} />
    </>
  );
}
