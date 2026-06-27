import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL, SITE_URL, type JsonLdObject } from "../lib/seo";
import ContactPageClient from "./ContactPageClient";

const URL_PATH = "/iletisim";
const SITE = SITE_URL; // https://www.bemisevcharge.com.tr

export const metadata: Metadata = {
  title: "İletişim | Bemis E-V Charge",
  description:
    "Bemis E-V Charge iletişim: Yeşil Cad. No:31, 16140 Bursa. Telefon +90 224 433 02 16, e-posta info@bemisevcharge.com. Ürün, bayilik ve teklif talepleriniz için bize ulaşın.",
  keywords: ["bemis iletişim", "bemis bursa", "ev şarj iletişim"],
  alternates: {
    canonical: URL_PATH,
    languages: { tr: URL_PATH, "x-default": URL_PATH },
  },
  openGraph: {
    title: "İletişim | Bemis E-V Charge",
    description:
      "Bemis E-V Charge iletişim: Yeşil Cad. No:31, 16140 Bursa · +90 224 433 02 16 · info@bemisevcharge.com.",
    type: "website",
    url: URL_PATH,
    images: ogImage("Bemis E-V Charge iletişim — Bursa"),
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Bemis E-V Charge",
    description:
      "Bemis E-V Charge iletişim: Yeşil Cad. No:31, 16140 Bursa · +90 224 433 02 16 · info@bemisevcharge.com.",
    images: [OG_URL],
  },
};

// LocalBusiness — page'e özgü inline (seo.ts'te yardımcı yok).
// TODO: geo lat/long + openingHoursSpecification kullanıcı verisiyle eklenecek.
const localBusiness: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE}/iletisim#localbusiness`,
  name: "Bemis E-V Charge",
  url: `${SITE}/iletisim`,
  telephone: "+90 224 433 02 16",
  email: "info@bemisevcharge.com",
  image: OG_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yeşil Cad. No:31",
    addressLocality: "Bursa",
    addressRegion: "Bursa",
    postalCode: "16140",
    addressCountry: "TR",
  },
  parentOrganization: { "@id": `${SITE}#organization` },
};

const contactPage: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "İletişim — Bemis E-V Charge",
  url: `${SITE}/iletisim`,
  inLanguage: "tr-TR",
  isPartOf: { "@id": `${SITE}#website` },
};

export default function IletisimPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "İletişim", url: URL_PATH },
    ]),
    localBusiness,
    contactPage,
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ContactPageClient />
    </>
  );
}
