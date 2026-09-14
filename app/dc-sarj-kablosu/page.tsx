import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import { DC_KABLO, DC_KABLO_SSS } from "../lib/dcKablo";
import DcKabloClient from "../components/DcKabloClient";

// "DC şarj kablosu / CCS2 soketi" iniş sayfası (2026-09-14).
//
// NEDEN AÇILDI: saha servisleri ve istasyon üreticileri Google'da "dc şarj
// kablosu", "ccs2 şarj kablosu", "ccs2 soket", "şarj istasyonu kablosu" diye
// arıyor (Google otomatik tamamlamadan ölçüldü). Bu kesişimi hedefleyen sayfa
// YOKTU: 8 CCS2 kablo/soket ürünü 42 ürünlük `charger-equipment` kategorisinin
// içinde gömülüydü ve kategori sayfasının Google'a gösterilen iki alanında
// ("DC" kelimesi) HİÇ geçmiyordu. Ürün sayfaları ise tek tek varyant hedefler.
//
// ⚠️ TR-ONLY — karşılığı olmayan hreflang Google'da karşılıklılık hatası
//    üretir; yalnız self-canonical verilir (şehir sayfalarıyla aynı karar).

const SLUG = DC_KABLO.slug;

export const metadata: Metadata = {
  title: DC_KABLO.metaTitle,
  description: DC_KABLO.metaDescription,
  alternates: { canonical: `/${SLUG}`, languages: { tr: `/${SLUG}`, "x-default": `/${SLUG}` } },
  keywords: DC_KABLO.keywords,
  openGraph: {
    title: `${DC_KABLO.h1} — Bemis E-V Charge`,
    description: DC_KABLO.metaDescription,
    type: "website",
    url: `/${SLUG}`,
    images: ogImage(`${DC_KABLO.h1} — Bemis E-V Charge`),
  },
  twitter: {
    card: "summary_large_image",
    title: DC_KABLO.metaTitle,
    description: DC_KABLO.metaDescription,
    images: [OG_URL],
  },
};

export default function DcSarjKablosuPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Şarj Ünitesi Ekipmanları", url: "/products/charger-equipment" },
      { name: DC_KABLO.h1, url: `/${SLUG}` },
    ]),
    serviceSchema({
      name: "DC Şarj Kablosu ve CCS2 Soketi Üretimi",
      description: DC_KABLO.metaDescription,
      url: `/${SLUG}`,
      areaServed: "Türkiye",
      // ⚠️ Yalnız katalogda KAYITLI olan kademeler/uzunluklar — uydurma yok.
      offerings: [
        "Bir ucu açık CCS2 DC şarj kablosu — 80 A",
        "Bir ucu açık CCS2 DC şarj kablosu — 150 A",
        "Bir ucu açık CCS2 DC şarj kablosu — 250 A",
        "Bir ucu açık CCS2 DC şarj kablosu — 400 A",
        "5 ve 8 metre kablo uzunluğu seçenekleri",
        "OEM tedarik ve yedek parça",
      ],
    }),
    // ⚠️ SSS TEK KAYNAK: görünen bölüm de bu diziden render edilir.
    faqSchema(DC_KABLO_SSS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <DcKabloClient />
    </>
  );
}
