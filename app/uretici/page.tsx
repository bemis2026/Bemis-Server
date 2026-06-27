import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import UreticiClient from "./UreticiClient";

const FAQ = [
  { q: "Bemis nerede üretim yapıyor?", a: "Bemis, Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² tesisinde, PCB tasarımından gömülü yazılıma ve son teste kadar üretimini kendi bünyesinde yapan yerli bir üreticidir." },
  { q: "Yerli şarj cihazı almak neden avantajlı?", a: "Üreticiden doğrudan tedarik; hızlı teknik destek ve yedek parça, aracı/ithalat marjı olmadan uygun fiyat, ve CE/IP65 gibi sertifikalı yerli mühendislik avantajı sağlar." },
  { q: "Şarj kablolarını da kendiniz mi üretiyorsunuz?", a: "Evet. AC Wallbox ve taşınabilir cihazların yanında Type 2 şarj kabloları, V2L/C2L adaptörler ve aksesuarlar da Bemis tarafından üretilir." },
  { q: "OEM / özel üretim (white-label) yapıyor musunuz?", a: "Evet. Kendi markanızla şarj cihazı, özel etiket ve toplu siparişler için üretim kapasitemizden yararlanabilirsiniz; detaylar için OEM sayfamızla iletişime geçin." },
  { q: "Cihazlar hangi sertifika ve standartlara sahip?", a: "Ürünlerimiz CE, IP65/IP66, IEC 61851, IEC 62196 ve OCPP 1.6J gibi uluslararası standartlara uygun olarak üretilir ve test edilir." },
];

export const metadata: Metadata = {
  title: "Yerli Elektrikli Araç Şarj Üreticisi",
  description:
    "Bemis E-V Charge — Bursa'da kendi tesisinde üreten yerli elektrikli araç şarj cihazı ve şarj kablosu üreticisi. AC Wallbox, taşınabilir şarj, V2L/C2L, OEM üretim. CE, IP65/66, OCPP.",
  alternates: { canonical: "/uretici", languages: { tr: "/uretici", "x-default": "/uretici" } },
  keywords: [
    "yerli ev şarj üreticisi",
    "yerli şarj kablo üreticisi",
    "elektrikli araç şarj cihazı üreticisi",
    "ev şarj cihazı imalatı",
    "OEM şarj cihazı üretimi",
  ],
  openGraph: {
    title: "Yerli EV Şarj Cihazı Üreticisi — Bemis E-V Charge",
    description: "Bursa'da yerli üretim: AC Wallbox, taşınabilir şarj, şarj kabloları, V2L/C2L, OEM. CE & IP65/66 sertifikalı.",
    type: "website",
    url: "/uretici",
    images: ogImage("Bemis E-V Charge — Bursa'da yerli elektrikli araç şarj cihazı üreticisi"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Yerli Elektrikli Araç Şarj Üreticisi",
    description:
      "Bemis E-V Charge — Bursa'da kendi tesisinde üreten yerli elektrikli araç şarj cihazı ve şarj kablosu üreticisi. AC Wallbox, taşınabilir şarj, V2L/C2L, OEM üretim. CE, IP65/66, OCPP.",
    images: [OG_URL],
  },
};

export default function UreticiPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Yerli Üretici", url: "/uretici" },
    ]),
    serviceSchema({
      name: "Elektrikli Araç Şarj Cihazı Üretimi",
      description:
        "Bemis E-V Charge, Bursa'daki tesisinde AC Wallbox, taşınabilir şarj cihazları, Type 2 şarj kabloları, V2L/C2L adaptörler ve OEM/white-label EV şarj ekipmanları üretir.",
      url: "/uretici",
      offerings: [
        "AC Wallbox üretimi",
        "Taşınabilir şarj cihazı üretimi",
        "Type 2 şarj kablosu üretimi",
        "V2L / C2L adaptör üretimi",
        "OEM / White-label üretim",
      ],
    }),
    faqSchema(FAQ),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <UreticiClient faq={FAQ} />
    </>
  );
}
