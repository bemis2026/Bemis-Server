import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, localBusinessSchema, ogImage, OG_URL } from "../lib/seo";
import { getCityPage } from "../lib/cities";
import { getCityShowcase, getCityDealers } from "../lib/cityShowcase";
import CityLandingClient from "../components/CityLandingClient";

// Sehir KABLO inis sayfasi (2026-09-15).
// Mevcut sehir sayfasi altyapisi (CITY_PAGES + CityLandingClient) yeniden
// kullanildi; icerik veri-tabanli, bu dosyada degisen yalniz SLUG.
// ⚠️ URETIM YALNIZ BURSA'DA: serviceSchema adinda "Uretimi" GECMEZ.
const SLUG = "izmir-sarj-kablosu";
const city = getCityPage(SLUG)!;

export const metadata: Metadata = {
  title: city.title,
  description: city.metaDescription,
  alternates: { canonical: `/${SLUG}`, languages: { tr: `/${SLUG}`, "x-default": `/${SLUG}` } },
  keywords: city.keywords,
  openGraph: {
    title: `${city.h1} — Bemis E-V Charge`,
    description: city.metaDescription,
    type: "website",
    url: `/${SLUG}`,
    images: ogImage(`${city.h1} — Bemis E-V Charge`),
  },
  twitter: {
    card: "summary_large_image",
    title: city.title,
    description: city.metaDescription,
    images: [OG_URL],
  },
};

export default async function IzmirSarjKablosuPage() {
  // ⚠️ SUNUCUDA çekilir: bayi adres/telefonları ve ₺ fiyatlar HTML'e basılmalı
  // ki Google görsün (bkz. app/lib/cityShowcase.ts).
  const [showcase, dealers] = await Promise.all([
    getCityShowcase(city.showcaseCategories ?? []),
    city.dealerCityId ? getCityDealers(city.dealerCityId) : Promise.resolve([]),
  ]);
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "AC Şarj Kabloları", url: "/products/cables" },
      { name: city.h1, url: `/${SLUG}` },
    ]),
    serviceSchema({
      name: `${city.city} Type 2 Şarj Kablosu`,
      description: city.metaDescription,
      url: `/${SLUG}`,
      areaServed: city.region,
      offerings: [
        "Type 2 şarj kablosu (Mod 3)",
        "Tek fazlı 16A / 32A şarj kablosu",
        "Üç fazlı 32A şarj kablosu",
        "3–15 metre uzunluk seçenekleri",
        "Proje bazlı özel renk ve uzunluk",
      ],
    }),
    localBusinessSchema({ url: `/${SLUG}`, areaServed: city.region }),
    faqSchema(city.faq),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <CityLandingClient city={city} showcase={showcase} dealers={dealers} />
    </>
  );
}
