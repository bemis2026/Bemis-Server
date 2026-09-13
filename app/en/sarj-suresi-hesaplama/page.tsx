import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL, SITE_URL, SITE_NAME } from "../../lib/seo";
import HesapClient from "../../sarj-suresi-hesaplama/HesapClient";
import { HESAP_META, hreflangKumesi, type HesapMeta } from "../../[lang]/sarj-suresi-hesaplama/meta";

/**
 * ŞARJ SÜRESİ HESAPLAMA — İNGİLİZCE (/en/sarj-suresi-hesaplama)
 *
 * ⚠️ NEDEN AYRI DOSYA: İngilizce kol `app/en/` altında STATİK bir ağaç
 *    (`app/en/products/...`), `app/[lang]` kolunda DEĞİL. `LOCALE_LANGS` en'i
 *    içermez; bu yüzden İngilizce sürüm burada kendi dosyasıyla yaşar.
 *    Metin ve şema aynı kaynaktan (`[lang]/sarj-suresi-hesaplama/meta.ts`) gelir
 *    → iki yerde ayrı metin tutulmaz, zamanla ayrışmaz.
 *
 * ⚠️ Slug TÜRKÇE bırakıldı (`/en/sarj-suresi-hesaplama`) — ürün kolunda da öyle
 *    (`/en/products/...`): dil kolları AYNI slug'ı paylaşır, hreflang kümesi
 *    böylece birebir eşlenir. Slug'ı dile çevirmek kümeyi karmaşıklaştırır.
 */

const SLUG = "sarj-suresi-hesaplama";
const m: HesapMeta = HESAP_META.en;

export const metadata: Metadata = {
  title: { absolute: `${m.title} | Bemis E-V Charge` },
  description: m.desc,
  keywords: m.keywords,
  alternates: { canonical: `/en/${SLUG}`, languages: hreflangKumesi(SLUG) },
  openGraph: {
    title: `${m.title} — Bemis E-V Charge`,
    description: m.desc,
    type: "website",
    url: `/en/${SLUG}`,
    locale: m.ogLocale,
    images: ogImage("Bemis E-V Charge"),
  },
  twitter: { card: "summary_large_image", title: m.title, description: m.desc, images: [OG_URL] },
};

export default function EnHesaplamaPage() {
  const url = `${SITE_URL}/en/${SLUG}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: m.anasayfa, url: "/en/products" },
      { name: m.sayfa, url: `/en/${SLUG}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#webapp`,
      name: m.semaAd,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "JavaScript",
      inLanguage: m.inLanguage,
      isAccessibleForFree: true,
      description: m.semaAciklama,
      featureList: m.ozellikler,
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      publisher: { "@id": `${SITE_URL}#organization` },
      provider: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}#organization` },
    },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <HesapClient />
    </>
  );
}
