import type { Metadata } from "next";
import LocalizedHomePage from "../components/LocalizedHomePage";
import { HOME_HREFLANG, HOME_SEO } from "../lib/homeSeo";
import { ogImage, OG_URL } from "../lib/seo";

// İngilizce ANASAYFA — /en.
//
// ⚠️ 2026-09-18: Açılmadan önce /en 404 veriyordu; İngilizce kolun kökü yoktu
// (yalnız /en/products… vardı). Gövde app/components/LocalizedHomePage'ten gelir
// → /de /es /ru /nl ile AYNI bileşen, ayrışma yok.
//
// ⚠️ NEDEN app/[lang] DEĞİL: `app/en/` zaten STATİK bir ağaç (ürün sayfaları
// orada) ve statik segment dinamik `[lang]`i gölgeler. Bu yüzden /en'in kökü
// burada olmak ZORUNDA.
//
// ⚠️ /export İLE İLİŞKİSİ: /export ayrı bir sayfa olarak KALIYOR (ihracat/OEM
// masası + teklif formu, reklam iniş sayfası). Artık anasayfa hreflang kümesinin
// üyesi DEĞİL — İngilizce anasayfa bu sayfadır; iki sayfa aynı `en` etiketini
// iddia ederse Google küme çakışması görür.
export const revalidate = 86400;

const S = HOME_SEO.en;

export const metadata: Metadata = {
  title: { absolute: S.title },
  description: S.description,
  keywords: S.keywords,
  alternates: { canonical: "/en", languages: HOME_HREFLANG },
  openGraph: {
    title: S.title,
    description: S.description,
    type: "website",
    url: "/en",
    locale: S.ogLocale,
    siteName: "Bemis E-V Charge",
    images: ogImage(S.title),
  },
  twitter: { card: "summary_large_image", title: S.title, description: S.description, images: [OG_URL] },
};

export default function EnglishHomePage() {
  return <LocalizedHomePage lang="en" />;
}
