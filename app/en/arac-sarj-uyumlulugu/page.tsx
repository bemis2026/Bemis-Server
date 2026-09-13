import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { faqSchema, breadcrumbSchema, ogImage, OG_URL, SITE_URL } from "../../lib/seo";
import VehicleChargingClient from "../../components/VehicleChargingClient";
import { hreflangKumesi } from "../../[lang]/sarj-suresi-hesaplama/meta";
import { UYUM_ICERIK, UYUM_SSS, UYUM_META } from "../../[lang]/arac-sarj-uyumlulugu/icerik";

/**
 * ARAÇ ŞARJ UYUMLULUĞU — İNGİLİZCE (/en/arac-sarj-uyumlulugu)
 *
 * ⚠️ İngilizce kol `app/en/` altında STATİK bir ağaç (`LOCALE_LANGS` en'i
 *    içermez), bu yüzden ayrı dosya. Metin/şema AYNI kaynaktan gelir
 *    (`[lang]/arac-sarj-uyumlulugu/icerik.ts`) → iki yerde metin tutulmaz.
 * ⚠️ Slug Türkçe kalır (ürün kolunda da öyle) — hreflang kümesi birebir eşlensin.
 */

const SLUG = "arac-sarj-uyumlulugu";
const m = UYUM_META.en;

export const metadata: Metadata = {
  title: { absolute: `${m.title} | Bemis E-V Charge` },
  description: m.desc,
  keywords: m.keywords,
  alternates: { canonical: `/en/${SLUG}`, languages: hreflangKumesi(SLUG) },
  openGraph: {
    title: `${m.title} — Bemis E-V Charge`,
    description: m.desc,
    type: "article",
    url: `/en/${SLUG}`,
    locale: m.ogLocale,
    images: ogImage("Bemis E-V Charge"),
  },
  twitter: { card: "summary_large_image", title: m.title, description: m.desc, images: [OG_URL] },
};

export default function EnAracSarjUyumlulukPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: m.anasayfa, url: "/en/products" },
      { name: m.sayfa, url: `/en/${SLUG}` },
    ]),
    { ...faqSchema(UYUM_SSS.en), "@id": `${SITE_URL}/en/${SLUG}#faq`, inLanguage: "en" },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <VehicleChargingClient icerik={UYUM_ICERIK.en} />
    </>
  );
}
