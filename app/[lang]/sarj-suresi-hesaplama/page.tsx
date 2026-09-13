import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL, SITE_URL, SITE_NAME } from "../../lib/seo";
import HesapClient from "../../sarj-suresi-hesaplama/HesapClient";

/**
 * ŞARJ SÜRESİ HESAPLAMA — ARAPÇA (/ar/sarj-suresi-hesaplama)
 *
 * 📌 NEDEN AÇILDI (2026-09-13, kullanıcı kararı): araç sayfaları dil-hafiftir —
 *    ekranda ağırlıklı olarak SAYI ve birim var, metin az. "كم ساعة يستغرق شحن
 *    السيارة" gibi araç arayan sorgular Körfez'de de aranıyor ve `/ar` giriş
 *    sayfasıyla niyet çakışması yok.
 *
 * ⚠️ BİLEŞEN ORTAK, ÇEVİRİ HAZIR: `HesapClient` zaten `pickText` kullanıyor ve
 *    `Calculator` `useUiStrings()` üzerinden ui.json'dan besleniyor. `/ar/...`
 *    yolunda `forcedLangForPath()` dili "ar"a sabitlediği için sayfa Arapça
 *    render edilir — bileşene DOKUNULMADI (TR sayfası birebir aynı kalır).
 *
 * ⚠️ ROTA KURALI: `app/ar/...` diye STATİK segment AÇMA — dinamik `[lang]`
 *    kolunu gölgeler ve /ar/products'ı kırar (kayıtlı ders). Bu dizine
 *    `layout.tsx` da ekleme.
 * ⚠️ HREFLANG KARŞILIKLI: TR sayfası da `ar` alternatifini verir.
 */

const SLUG = "sarj-suresi-hesaplama";
const TITLE = "حاسبة مدة شحن السيارة الكهربائية";
const DESC =
  "احسب مدة شحن سيارتك الكهربائية: اختر السيارة وقدرة الشحن لترى المدة التقديرية والتكلفة لكل كيلومتر، للشحن المتناوب والسريع مع مراعاة حدّ الشاحن الداخلي.";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "ar" }];
}

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Bemis E-V Charge` },
  description: DESC,
  keywords: [
    "حاسبة مدة الشحن",
    "كم ساعة يستغرق شحن السيارة الكهربائية",
    "مدة شحن السيارة الكهربائية",
    "تكلفة شحن السيارة الكهربائية",
    "حاسبة الشحن المنزلي",
  ],
  alternates: {
    canonical: `/ar/${SLUG}`,
    languages: { tr: `/${SLUG}`, ar: `/ar/${SLUG}`, "x-default": `/${SLUG}` },
  },
  openGraph: {
    title: `${TITLE} — Bemis E-V Charge`,
    description: DESC,
    type: "website",
    url: `/ar/${SLUG}`,
    locale: "ar_AE",
    images: ogImage("Bemis E-V Charge"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_URL] },
};

export default function ArHesaplamaPage() {
  const url = `${SITE_URL}/ar/${SLUG}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "الصفحة الرئيسية", url: "/ar" },
      { name: "حاسبة مدة الشحن", url: `/ar/${SLUG}` },
    ]),
    // ⚠️ `WebApplication` — tarayıcıda çalışan bir ARAÇ olduğunu bildirir.
    // 📌 `offers` FİYATSIZ değil BEDAVA: araç gerçekten ücretsiz → price "0".
    // 📌 `description` sayfada GÖRÜNEN paragrafla aynı bilgiyi verir.
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#webapp`,
      name: TITLE,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "JavaScript",
      inLanguage: "ar",
      isAccessibleForFree: true,
      description:
        "اختر سيارتك وجهاز الشحن لتحسب المدة التقديرية للشحن والتكلفة لكل كيلومتر بحسب سعة البطارية وقدرة الشاحن الداخلي في السيارة ودرجة التيار المختارة.",
      featureList: [
        "سعة البطارية وقدرة الشحن المتناوب الداخلية بحسب طراز السيارة",
        "تقدير مدة الشحن المتناوب والسريع",
        "حساب القدرة بحسب درجة التيار",
        "التكلفة لكل كيلومتر بحسب سعر الكهرباء",
      ],
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
