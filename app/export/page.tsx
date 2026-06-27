import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import ExportLandingClient from "./ExportLandingClient";

const URL_PATH = "/export";

export const metadata: Metadata = {
  title: "EV Charging Cable & Charger Manufacturer (Türkiye)",
  description:
    "Bemis E-V Charge — EU-adjacent manufacturer of Type 2 / Mode 3 EV charging cables, AC wallboxes & DC chargers. CE, IP65/IP66, OCPP. OEM/ODM, export to 60+ countries. Request a quote.",
  keywords: [
    "ev charging cable manufacturer", "type 2 charging cable supplier", "mode 3 ev cable",
    "ev charger manufacturer", "wallbox manufacturer", "evse manufacturer turkey",
    "oem ev charger", "odm ev charger", "private label ev charger", "ev charging equipment supplier",
    "ev charger supplier europe",
  ],
  alternates: {
    canonical: URL_PATH,
    languages: { en: URL_PATH, "x-default": URL_PATH },
  },
  openGraph: {
    title: "EV Charging Cable & Charger Manufacturer — Bemis E-V Charge (Türkiye)",
    description:
      "Real EU-adjacent manufacturer since 1994. Type 2 / Mode 3 cables, AC wallboxes, DC chargers. CE, IP65/IP66, OCPP. OEM/ODM, export to 60+ countries.",
    type: "website",
    url: URL_PATH,
    locale: "en_US",
    images: ogImage("Bemis E-V Charge — EV charging cable & charger manufacturer, Türkiye"),
  },
  twitter: {
    card: "summary_large_image",
    title: "EV Charging Cable & Charger Manufacturer (Türkiye)",
    description:
      "Bemis E-V Charge — EU-adjacent manufacturer of Type 2 / Mode 3 EV charging cables, AC wallboxes & DC chargers. CE, IP65/IP66, OCPP. OEM/ODM, export to 60+ countries. Request a quote.",
    images: [OG_URL],
  },
};

// faqSchema kaynağı — ExportLandingClient'taki Export FAQ ile AYNI içerik (schema için server'da).
const FAQ = [
  { q: "Are you a manufacturer or a trader?", a: "A manufacturer. Bemis E-V Charge is the EV-charging brand of Bemis Teknik Elektrik A.Ş., producing in its own facility in Bursa, Türkiye since 1994." },
  { q: "Do you offer OEM / ODM / private label?", a: "Yes. We produce under your brand with custom branding, packaging and configurations for distributors, importers and EV-charging operators." },
  { q: "Which standards and certifications do you have?", a: "Our products are CE marked, rated IP65/IP66, built to Type 2 / Mode 3 (IEC 62196) and are OCPP-ready. Documentation is provided for import." },
  { q: "Do you ship to Europe and my country?", a: "We export to 60+ countries. Send us your country in the quote form and we will confirm shipping, lead time and terms." },
  { q: "What is the minimum order quantity?", a: "It depends on the product and configuration. Contact us with your requirement and we will share wholesale / bulk terms." },
  { q: "How fast is delivery to Europe?", a: "As an EU-adjacent manufacturer in Türkiye, lead times to Europe are typically shorter than from China. Exact timing depends on the order; we confirm in the quote." },
];

export default function ExportPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "EV Charging Manufacturer / Export", url: URL_PATH },
    ]),
    serviceSchema({
      name: "EV Charging Equipment Manufacturing & Export",
      description:
        "Manufacturer of Type 2 / Mode 3 EV charging cables, AC wallboxes (7.4–22 kW), DC fast chargers and V2L/C2L adapters. CE, IP65/IP66, OCPP-ready. OEM / ODM / private label and wholesale export from Türkiye to 60+ countries.",
      url: URL_PATH,
      areaServed: "Worldwide",
      offerings: [
        "EV charging cable manufacturing (Type 2 / Mode 3)",
        "AC wallbox manufacturing (7.4–22 kW)",
        "DC fast charger manufacturing",
        "V2L / C2L adapter manufacturing",
        "OEM / ODM / private label production",
        "Wholesale & bulk export",
      ],
    }),
    faqSchema(FAQ),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ExportLandingClient />
    </>
  );
}
