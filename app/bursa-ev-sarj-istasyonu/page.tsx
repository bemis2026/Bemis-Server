import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, localBusinessSchema, ogImage, OG_URL } from "../lib/seo";
import { getCityPage } from "../lib/cities";
import CityLandingClient from "../components/CityLandingClient";

const SLUG = "bursa-ev-sarj-istasyonu";
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

export default function BursaCityPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: city.h1, url: `/${SLUG}` },
    ]),
    serviceSchema({
      name: `${city.city} Elektrikli Araç Şarj Cihazı`,
      description: city.metaDescription,
      url: `/${SLUG}`,
      areaServed: city.region,
      offerings: [
        "AC Wallbox şarj istasyonu",
        "Taşınabilir şarj cihazı",
        "Type 2 şarj kablosu",
        "V2L / C2L adaptör",
        "Kurumsal & filo şarj çözümleri",
      ],
    }),
    localBusinessSchema({ url: `/${SLUG}`, areaServed: city.region }),
    faqSchema(city.faq),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <CityLandingClient city={city} />
    </>
  );
}
