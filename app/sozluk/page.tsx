import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { definedTermSetSchema, breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import { allTerms } from "../lib/glossary";
import GlossaryClient from "./GlossaryClient";

export const metadata: Metadata = {
  title: "Elektrikli Araç Şarj Terimleri Sözlüğü",
  description:
    "Type 2, CCS2, OCPP, AC/DC, kW–kWh, V2L, yük yönetimi (DLM), IP65/IP66 ve daha fazlası — elektrikli araç şarjındaki terimlerin kısa, net ve doğru açıklamaları.",
  keywords: [
    "ev şarj terimleri", "elektrikli araç şarj sözlüğü", "type 2 nedir", "ccs2 nedir",
    "ocpp nedir", "v2l nedir", "kw kwh farkı", "yük yönetimi nedir", "ip65 ip66 nedir",
  ],
  alternates: { canonical: "/sozluk", languages: { tr: "/sozluk", "x-default": "/sozluk" } },
  openGraph: {
    title: "Elektrikli Araç Şarj Terimleri Sözlüğü — Bemis E-V Charge",
    description: "EV şarjında en çok merak edilen terimlerin (Type 2, CCS2, OCPP, V2L, kW/kWh…) kısa ve net açıklamaları.",
    type: "website",
    url: "/sozluk",
    images: ogImage("Elektrikli araç şarj terimleri sözlüğü — Bemis E-V Charge"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Elektrikli Araç Şarj Terimleri Sözlüğü",
    description:
      "Type 2, CCS2, OCPP, AC/DC, kW–kWh, V2L, yük yönetimi (DLM), IP65/IP66 ve daha fazlası — elektrikli araç şarjındaki terimlerin kısa, net ve doğru açıklamaları.",
    images: [OG_URL],
  },
};

export default function SozlukPage() {
  const terms = allTerms();
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Sözlük", url: "/sozluk" },
    ]),
    definedTermSetSchema(terms),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <GlossaryClient mode="index" terms={terms} />
    </>
  );
}
