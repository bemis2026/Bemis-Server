import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL, SITE_URL, SITE_NAME } from "../../lib/seo";
import { LOCALE_LANGS } from "../../lib/localeProductSeo";
import HesapClient from "../../sarj-suresi-hesaplama/HesapClient";
import { HESAP_META, hreflangKumesi } from "./meta";

/**
 * ŞARJ SÜRESİ HESAPLAMA — DİL KOLLARI (/de /es /ru /nl /ar + ayrıca /en)
 *
 * 📌 NEDEN AÇILDI: 13 Eylül'de önce Arapça için açıldı (Orta Doğu hedefi), aynı
 *    gün kullanıcı *"bunları da sitenin diğer dillerinde uygula"* dedi.
 *
 * ⚠️ BİLEŞENE HİÇ DOKUNULMADI: `HesapClient` `pickText`, `Calculator`
 *    `useUiStrings()` → ui.json kullanıyor ve sözlük 5 dilde TAM. `/de/...`
 *    yolunda `forcedLangForPath()` dili sabitlediği için gövde kendiliğinden o
 *    dilde render edilir. Bu dosya YALNIZ rota + metadata + şema taşır.
 *
 * ⚠️ ROTA KURALI: `app/de/...` gibi STATİK segment AÇMA — aynı seviyedeki
 *    dinamik `[lang]` kolunu gölgeler ve o dilin ürün sayfalarını kırar.
 *    (İngilizce ayrı: `app/en/` zaten statik bir ağaç, orada kendi dosyası var.)
 * ⚠️ Bu dizine `layout.tsx` EKLEME — segment ayarları çocuklara iner.
 * ⚠️ HREFLANG KÜMESİ 7'Lİ VE KARŞILIKLI: TR sayfası da hepsini verir. Eksik/tek
 *    yönlü küme Google'da karşılıklılık hatası üretir (kayıtlı kural).
 */

const SLUG = "sarj-suresi-hesaplama";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALE_LANGS.map((lang) => ({ lang }));
}


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = HESAP_META[lang] ?? HESAP_META.en;
  return {
    title: { absolute: `${m.title} | Bemis E-V Charge` },
    description: m.desc,
    keywords: m.keywords,
    alternates: { canonical: `/${lang}/${SLUG}`, languages: hreflangKumesi(SLUG) },
    openGraph: {
      title: `${m.title} — Bemis E-V Charge`,
      description: m.desc,
      type: "website",
      url: `/${lang}/${SLUG}`,
      locale: m.ogLocale,
      images: ogImage("Bemis E-V Charge"),
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.desc, images: [OG_URL] },
  };
}

export default async function DilHesaplamaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const m = HESAP_META[lang] ?? HESAP_META.en;
  const url = `${SITE_URL}/${lang}/${SLUG}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: m.anasayfa, url: lang === "ar" ? "/ar" : `/${lang}/products` },
      { name: m.sayfa, url: `/${lang}/${SLUG}` },
    ]),
    // ⚠️ `WebApplication` — tarayıcıda çalışan bir ARAÇ olduğunu bildirir.
    // 📌 `offers` FİYATSIZ değil BEDAVA: araç gerçekten ücretsiz → price "0".
    // 📌 `featureList` sayfada GERÇEKTEN bulunan işlevleri sayar.
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
