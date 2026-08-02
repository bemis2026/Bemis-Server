import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, localBusinessSchema, ogImage, OG_URL } from "../lib/seo";
import { getCityPage } from "../lib/cities";
import { getCityShowcase, getCityDealers } from "../lib/cityShowcase";
import CityLandingClient from "../components/CityLandingClient";

// "bursa şarj kablosu" iniş sayfası (2026-07-26).
// NEDEN: bu sorguda 2. sayfadaydık çünkü kesişimi hedefleyen sayfa yoktu —
// /products/cables ulusal, /bursa-ev-sarj-istasyonu ise istasyon odaklıydı.
// Mevcut şehir sayfası altyapısı (CITY_PAGES + CityLandingClient) yeniden kullanıldı.
const SLUG = "bursa-sarj-kablosu";
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

export default async function BursaSarjKablosuPage() {
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
      name: "Bursa Type 2 Şarj Kablosu Üretimi",
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
