import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema, ogImage, OG_URL } from "../../lib/seo";
import { ORTADOGU_SSS, PAZARLAR } from "./ortadoguIcerik";
import OrtadoguClient from "./OrtadoguClient";

// /ar/middle-east — Körfez (KKİK 6 ülke) + Mısır iniş sayfası.
// Kullanıcı kararı 2026-09-09: hedef pazar BAE · Suudi · Katar · Kuveyt · Bahreyn ·
// Umman + Mısır; dönüşüm hedefi hem distribütör daveti hem proje/toplu satış.
//
// ⚠️ NEDEN TEK BÖLGESEL SAYFA, ülke başına ayrı sayfa DEĞİL: Körfez'de distribütörümüz
// yok ve ülkeye ÖZEL doğrulanmış olgu (yerel fiyat, stok, referans, adres) da yok →
// 7 ayrı sayfa birbirinin kopyası olur (ince/kopya içerik riski). Ülkeler bu sayfada
// kendi bölümleriyle geçer; ülkeye özel GERÇEK içerik doğduğunda ayrı sayfa anlamlı olur.
//
// ⚠️ Rota `app/ar/...` DEĞİL: statik bir `ar` segmenti aynı seviyedeki dinamik
// `app/[lang]/products` kolunu gölgeler ve 159 ürün sayfasını kırardı (2026-09-09 kararı).
// ⚠️ Bu dizine layout.tsx EKLEME — segment ayarları çocuklara iner.
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return [{ lang: "ar" }];
}

const TITLE = "شواحن السيارات الكهربائية للخليج ومصر | Bemis E-V Charge";
const DESC =
  "مصنّع ومورّد معدات شحن السيارات الكهربائية للإمارات والسعودية وقطر والكويت والبحرين وعُمان ومصر. محطات AC من 3,7 إلى 22 kW وشحن سريع DC حتى 200 kW، تعمل على 50/60 هرتز. CE و IP65. إنتاج OEM وشراكات توزيع.";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== "ar") return {};
  return {
    title: { absolute: TITLE },
    description: DESC,
    keywords: [
      "شواحن السيارات الكهربائية الخليج",
      "محطات شحن السيارات الكهربائية السعودية",
      "شاحن سيارة كهربائية الإمارات",
      "موزّع شواحن السيارات الكهربائية",
      "شحن سريع DC مصر",
      "OEM شواحن كهربائية",
    ],
    // ⚠️ hreflang YOK: bu sayfanın TR/EN karşılığı yok. Karşılığı olmayan dil
    // etiketi vermek Google'da karşılıklılık hatası üretir (2026-09-09 kuralı).
    alternates: { canonical: "/ar/middle-east" },
    openGraph: {
      title: TITLE,
      description: DESC,
      type: "website",
      url: "/ar/middle-east",
      locale: "ar_AE",
      siteName: "Bemis E-V Charge",
      images: ogImage(TITLE),
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_URL] },
  };
}

export default async function OrtadoguPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ar") notFound();

  const jsonLd = [
    breadcrumbSchema([
      { name: "Bemis E-V Charge", url: "/ar" },
      { name: "الخليج والشرق الأوسط", url: "/ar/middle-east" },
    ]),
    // areaServed = hedef pazarların ISO kodları (YZ/arama motoruna açık bölge sinyali).
    serviceSchema({
      name: "تصدير وتوزيع معدات شحن السيارات الكهربائية",
      description: DESC,
      url: "/ar/middle-east",
      offerings: [
        "محطات شحن جدارية AC",
        "محطات شحن سريع DC (CCS2)",
        "كابلات شحن Type 2",
        "شواحن متنقلة",
        "إنتاج OEM / ODM وعلامة خاصة",
        "شراكات التوزيع",
      ],
      areaServed: PAZARLAR.map((p) => p.kod),
    }),
    // ⚠️ Sorular ortadoguIcerik.ts'ten = sayfada GÖRÜNEN metinle birebir aynı
    // (Google: şemadaki içerik sayfada görünür olmalı).
    faqSchema(ORTADOGU_SSS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <OrtadoguClient />
    </>
  );
}
