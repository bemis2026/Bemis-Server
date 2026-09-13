import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { faqSchema, breadcrumbSchema, ogImage, OG_URL, SITE_URL } from "../../lib/seo";
import VehicleChargingClient from "../../components/VehicleChargingClient";
import { AR_ICERIK, AR_SSS } from "./arIcerik";

/**
 * ARAÇ ŞARJ UYUMLULUĞU — ARAPÇA (/ar/arac-sarj-uyumlulugu)
 *
 * 📌 NEDEN AÇILDI (2026-09-13, kullanıcı kararı): Orta Doğu kapsam denetiminde
 *    çıktı — dile duyarsız her iş Arapça kola geçmişti (25/25) ama TR'de olup
 *    Arapçada olmayan 14 yüzey vardı. Bunların 4'ü 10 Eylül'de kullanıcı kararıyla
 *    KAPALI; bu sayfa ise o karardan SONRA değerlendirilmemiş bir ARAÇ sayfası:
 *    tablo/sayı ağırlıklı, uzun metin az, `/ar` giriş sayfasıyla niyet çakışması
 *    yok ("arabama hangi kablo uyar" ≠ "üretici kimdir").
 *
 * ⚠️ ROTA KURALI: bu dosya `app/[lang]/` altındadır. `app/ar/...` diye STATİK bir
 *    segment AÇMA — aynı seviyedeki dinamik `[lang]` kolunu gölgeler ve
 *    /ar/products altındaki 159 sayfayı kırar (kayıtlı ders).
 * ⚠️ Bu dizine `layout.tsx` EKLEME — segment ayarları çocuklara iner.
 *
 * ⚠️ HREFLANG KARŞILIKLI: TR sayfası da `ar` alternatifini verir. Tek yönlü küme
 *    Google'da karşılıklılık hatası üretir (kayıtlı kural).
 */

const SLUG = "arac-sarj-uyumlulugu";
const TITLE = "أي شاحن وأي كابل يناسب سيارتك؟";
const DESC =
  "توافق الشحن المتناوب لسيارات Togg وIONIQ 5 وTesla وBYD وMG وRenault: نوع المقبس وقدرة الشاحن الداخلي، وأي جهاز وكابل يناسب تمديدات منزلك.";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "ar" }];
}

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Bemis E-V Charge` },
  description: DESC,
  keywords: [
    "شاحن السيارة الكهربائية",
    "كابل شحن Type 2",
    "قدرة الشاحن الداخلي",
    "شاحن Togg",
    "شاحن IONIQ 5",
    "أي شاحن يناسب سيارتي",
    "محطة شحن منزلية",
  ],
  alternates: {
    canonical: `/ar/${SLUG}`,
    languages: { tr: `/${SLUG}`, ar: `/ar/${SLUG}`, "x-default": `/${SLUG}` },
  },
  openGraph: {
    title: `${TITLE} — Bemis E-V Charge`,
    description: DESC,
    type: "article",
    url: `/ar/${SLUG}`,
    locale: "ar_AE",
    images: ogImage("Bemis E-V Charge"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_URL] },
};

export default function ArAracSarjUyumlulukPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "الصفحة الرئيسية", url: "/ar" },
      { name: "توافق شحن المركبات", url: `/ar/${SLUG}` },
    ]),
    // ⚠️ FAQPage metni sayfada GÖRÜNEN ile BİREBİR aynı — ikisi de AR_SSS'ten
    //    gelir (tek kaynak). Ayrı yazılsa zamanla ayrışır ve Google'ın
    //    "şemadaki içerik sayfada görünür olmalı" kuralı sessizce ihlal edilir.
    { ...faqSchema(AR_SSS), "@id": `${SITE_URL}/ar/${SLUG}#faq`, inLanguage: "ar" },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <VehicleChargingClient icerik={AR_ICERIK} />
    </>
  );
}
