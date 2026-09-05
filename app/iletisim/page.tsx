import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL, SITE_URL, ORG_GEO, type JsonLdObject } from "../lib/seo";
import ContactPageClient from "./ContactPageClient";

const URL_PATH = "/iletisim";
const SITE = SITE_URL; // https://www.bemisevcharge.com.tr

export const metadata: Metadata = {
  // NOT: layout.tsx başlık şablonu "%s | Bemis E-V Charge" markayı otomatik
  // ekler → başlığa markayı TEKRAR yazma (yoksa "…| Bemis E-V Charge | Bemis
  // E-V Charge" çift-marka olur). openGraph/twitter başlıkları şablonlanmaz,
  // onlarda tam ad kalır.
  title: "İletişim",
  description:
    "Bemis E-V Charge iletişim: Yeşil Cad. No:31, 16140 Bursa. Tel +90 224 433 02 16, e-posta sales@bemis.com.tr. Ürün, bayilik ve teklif talepleri için ulaşın.",
  keywords: ["bemis iletişim", "bemis bursa", "ev şarj iletişim"],
  alternates: {
    canonical: URL_PATH,
    languages: { tr: URL_PATH, "x-default": URL_PATH },
  },
  openGraph: {
    title: "İletişim | Bemis E-V Charge",
    description:
      "Bemis E-V Charge iletişim: Yeşil Cad. No:31, 16140 Bursa · +90 224 433 02 16 · sales@bemis.com.tr.",
    type: "website",
    url: URL_PATH,
    images: ogImage("Bemis E-V Charge iletişim — Bursa"),
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Bemis E-V Charge",
    description:
      "Bemis E-V Charge iletişim: Yeşil Cad. No:31, 16140 Bursa · +90 224 433 02 16 · sales@bemis.com.tr.",
    images: [OG_URL],
  },
};

// LocalBusiness — page'e özgü inline (seo.ts'te yardımcı yok). geo + openingHours
// artık GERÇEK veriyle dolu (geo = ORG_GEO, GBP pin koordinatı; mesai sitede görünür).
const localBusiness: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE}/iletisim#localbusiness`,
  name: "Bemis E-V Charge",
  url: `${SITE}/iletisim`,
  telephone: "+90 224 433 02 16",
  email: "sales@bemis.com.tr",
  image: OG_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yeşil Cad. No:31",
    addressLocality: "Bursa",
    addressRegion: "Bursa",
    postalCode: "16140",
    addressCountry: "TR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:30",
    closes: "18:00",
  },
  geo: { "@type": "GeoCoordinates", latitude: ORG_GEO.lat, longitude: ORG_GEO.lng },
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
