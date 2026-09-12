import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL, SITE_URL, SITE_NAME } from "../lib/seo";
import HesapClient from "./HesapClient";

// ŞARJ SÜRESİ HESAPLAMA — /sarj-suresi-hesaplama
// ⚠️ NEDEN AYRI SAYFA (2026-09-12): hesaplayıcı yalnızca anasayfanın `#calculator`
// bölümüydü → kendi URL'i, H1'i, meta açıklaması ve `WebApplication` şeması YOKTU.
// "şarj süresi hesaplama" gibi ARAÇ ARAYAN sorgularda yarışacak hedef yoktu.
// ⚠️ Sayfa TR-ONLY: hreflang yalnız tr (karşılığı olmayan dil etiketi Google'da
//    karşılıklılık hatası üretir — bu sitede daha önce yaşandı, bkz. /ar/middle-east).
export const metadata: Metadata = {
  title: "Şarj Süresi Hesaplama",
  description:
    "Elektrikli araç şarj süresi hesaplama: aracınızı ve şarj gücünü seçin, tahmini şarj süresini ve km başına maliyeti görün. AC ve DC için, araç sınırını dikkate alarak.",
  keywords: [
    "şarj süresi hesaplama", "elektrikli araç şarj süresi", "ev şarj süresi hesaplama",
    "kaç saatte şarj olur", "elektrikli araba şarj maliyeti hesaplama", "km başına şarj maliyeti",
  ],
  alternates: {
    canonical: "/sarj-suresi-hesaplama",
    languages: { tr: "/sarj-suresi-hesaplama", "x-default": "/sarj-suresi-hesaplama" },
  },
  openGraph: {
    title: "Elektrikli Araç Şarj Süresi Hesaplama | Bemis E-V Charge",
    description:
      "Aracınızı ve şarj cihazınızı seçin; tahmini şarj süresi ve km başına maliyet. Araç sınırını dikkate alan hesaplayıcı.",
    type: "website",
    url: "/sarj-suresi-hesaplama",
    images: ogImage("Elektrikli Araç Şarj Süresi Hesaplama"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Şarj Süresi Hesaplama",
    description: "Aracınızı seçin, şarj süresini ve km başına maliyeti hesaplayın.",
    images: [OG_URL],
  },
};

export default function Page() {
  const url = `${SITE_URL}/sarj-suresi-hesaplama`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Şarj Süresi Hesaplama", url: "/sarj-suresi-hesaplama" },
    ]),
    // ⚠️ `WebApplication` — tarayıcıda çalışan bir ARAÇ olduğunu bildirir.
    // Referans SEO çalışmasında 15 hesaplama aracı bu tiple yayınlanmış.
    // 📌 `offers` FİYATSIZ değil, BEDAVA: araç ücretsiz → price "0". Uydurma
    //    ticari şart değil, gerçek durum.
    // 📌 `description` sayfada GÖRÜNÜR paragrafla aynı bilgiyi verir (Google kuralı).
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#webapp`,
      name: "Elektrikli Araç Şarj Süresi Hesaplama",
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "JavaScript gerektirir",
      inLanguage: "tr-TR",
      isAccessibleForFree: true,
      description:
        "Aracınızı ve şarj cihazınızı seçerek batarya kapasitesi, aracın dahili AC şarj gücü ve seçilen akım kademesine göre tahmini şarj süresini ve km başına maliyeti hesaplar.",
      featureList: [
        "Araç modeline göre batarya kapasitesi ve dahili AC şarj gücü",
        "AC ve DC şarj süresi tahmini",
        "Akım kademesine göre güç hesabı",
        "Elektrik birim fiyatına göre km başına maliyet",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      publisher: { "@id": `${SITE_URL}#organization` },
      provider: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}#organization` },
    },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <HesapClient />
    </>
  );
}
