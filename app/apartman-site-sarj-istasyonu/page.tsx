import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import { ORTAK_ALAN, ORTAK_ALAN_SSS } from "../lib/ortakAlan";
import OrtakAlanClient from "../components/OrtakAlanClient";

// "Apartman / site ortak alan şarj istasyonu" iniş sayfası (2026-09-15).
//
// NEDEN AÇILDI: site ve apartman yönetimleri Google'da "apartman şarj
// istasyonu", "site otoparkı şarj istasyonu", "ortak alan şarj yönetim
// paneli", "ücretsiz şarj yönetim yazılımı" diye arıyor. Bu kesişimi
// hedefleyen İNİŞ SAYFASI yoktu — yalnız bir blog yazısı vardı (bilgi amaçlı),
// wallbox kategorisinin Google'a gösterilen iki alanı ise SADECE "ev tipi"
// diyordu; "apartman", "site", "ortak alan", "yönetim paneli" HİÇ geçmiyordu.
// Oysa ayrıştırıcımız veride kayıtlı: 19 wallbox SKU'sunun 16'sı (tüm
// Charger Plus 2 + Charger Pro 2) `ucretsizPanel` rozeti taşıyor.
//
// ⚠️ TR-ONLY — karşılığı olmayan hreflang Google'da karşılıklılık hatası
//    üretir; yalnız self-canonical verilir (/dc-sarj-kablosu ile aynı karar).

const SLUG = ORTAK_ALAN.slug;

export const metadata: Metadata = {
  title: ORTAK_ALAN.metaTitle,
  description: ORTAK_ALAN.metaDescription,
  alternates: { canonical: `/${SLUG}`, languages: { tr: `/${SLUG}`, "x-default": `/${SLUG}` } },
  keywords: ORTAK_ALAN.keywords,
  openGraph: {
    title: `${ORTAK_ALAN.h1} — Bemis E-V Charge`,
    description: ORTAK_ALAN.metaDescription,
    type: "website",
    url: `/${SLUG}`,
    images: ogImage(`${ORTAK_ALAN.h1} — Bemis E-V Charge`),
  },
  twitter: {
    card: "summary_large_image",
    title: ORTAK_ALAN.metaTitle,
    description: ORTAK_ALAN.metaDescription,
    images: [OG_URL],
  },
};

export default function ApartmanSiteSarjIstasyonuPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "AC Wallbox Şarj İstasyonları", url: "/products/wallbox" },
      { name: ORTAK_ALAN.h1, url: `/${SLUG}` },
    ]),
    serviceSchema({
      name: "Apartman ve Site Ortak Alan Şarj İstasyonu",
      description: ORTAK_ALAN.metaDescription,
      url: `/${SLUG}`,
      areaServed: "Türkiye",
      // ⚠️ Yalnız ürün verisinde KAYITLI olan yetenekler — uydurma yok.
      offerings: [
        "Ortak alan şarj yönetim paneli (Charger Plus 2 ve Charger Pro 2 ile ücretsiz)",
        "RFID kart ile yetkilendirme ve ön ödemeli bakiye",
        "Kişi bazlı kullanım raporlaması",
        "OCPP 1.6 uyumlu AC şarj istasyonu",
        "Dinamik yük dengeleme",
        "3,7 – 22 kW ayarlanabilir güç",
      ],
    }),
    // ⚠️ SSS TEK KAYNAK: görünen akordeon da bu diziden render edilir.
    faqSchema(ORTAK_ALAN_SSS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <OrtakAlanClient />
    </>
  );
}
