import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { faqSchema, breadcrumbSchema, ogImage, OG_URL, SITE_URL } from "../../lib/seo";
import { LOCALE_LANGS } from "../../lib/localeProductSeo";
import VehicleChargingClient from "../../components/VehicleChargingClient";
import { hreflangKumesi } from "../sarj-suresi-hesaplama/meta";
import { UYUM_ICERIK, UYUM_SSS, UYUM_META } from "./icerik";

/**
 * ARAÇ ŞARJ UYUMLULUĞU — DİL KOLLARI (/de /es /ru /nl /ar + ayrıca /en)
 *
 * 📌 13 Eylül'de önce Arapça açıldı (Orta Doğu hedefi), aynı gün kullanıcı
 *    *"bunları da sitenin diğer dillerinde uygula"* dedi → 5 dil daha.
 *
 * ⚠️ TR SAYFASI ETKİLENMEZ: `VehicleChargingClient` prop almazsa kendi Türkçe
 *    varsayılanını basar. Bu rota her dile kendi `icerik`ini geçer.
 * ⚠️ SSS TEK KAYNAK: görünen liste ve FAQPage şeması `UYUM_SSS`'ten okur —
 *    ayrı yazılsa zamanla ayrışır (Google: şemadaki içerik sayfada görünmeli).
 * ⚠️ ROTA KURALI: `app/de/...` gibi STATİK segment AÇMA — dinamik `[lang]`
 *    kolunu gölgeler. Bu dizine `layout.tsx` da ekleme.
 * ⚠️ HREFLANG 7'Lİ VE KARŞILIKLI (tr + en + 5 dil + x-default).
 */

const SLUG = "arac-sarj-uyumlulugu";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALE_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = UYUM_META[lang] ?? UYUM_META.en;
  return {
    title: { absolute: `${m.title} | Bemis E-V Charge` },
    description: m.desc,
    keywords: m.keywords,
    alternates: { canonical: `/${lang}/${SLUG}`, languages: hreflangKumesi(SLUG) },
    openGraph: {
      title: `${m.title} — Bemis E-V Charge`,
      description: m.desc,
      type: "article",
      url: `/${lang}/${SLUG}`,
      locale: m.ogLocale,
      images: ogImage("Bemis E-V Charge"),
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.desc, images: [OG_URL] },
  };
}

export default async function DilAracSarjUyumlulukPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const m = UYUM_META[lang] ?? UYUM_META.en;
  const icerik = UYUM_ICERIK[lang] ?? UYUM_ICERIK.en;
  const sss = UYUM_SSS[lang] ?? UYUM_SSS.en;
  const jsonLd = [
    breadcrumbSchema([
      { name: m.anasayfa, url: lang === "ar" ? "/ar" : `/${lang}/products` },
      { name: m.sayfa, url: `/${lang}/${SLUG}` },
    ]),
    { ...faqSchema(sss), "@id": `${SITE_URL}/${lang}/${SLUG}#faq`, inLanguage: m.inLanguage },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <VehicleChargingClient icerik={icerik} />
    </>
  );
}
