import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import SocialWallPageClient from "../components/SocialWallPageClient";

// Kullanıcı paylaşımları sayfası. İçerik Instagram'da barındırılır; burada
// yalnız kapak + açıklama vardır ve gömme ziyaretçi tıklayınca yüklenir.
// ⚠️ Bölüm CMS'ten (socialWallSection) gelir; operatör admin'den ekler.

const SLUG = "musteri-videolari";
const TITLE = "Müşteri Videoları ve Paylaşımları";
const DESC =
  "Bemis E-V Charge kullanan sürücülerin ve yetkili bayilerimizin şarj istasyonu kurulum ve kullanım paylaşımları.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `/${SLUG}`, languages: { tr: `/${SLUG}`, "x-default": `/${SLUG}` } },
  keywords: [
    "bemis müşteri videoları",
    "elektrikli araç şarj istasyonu kurulum videosu",
    "wallbox kurulum videosu",
    "bemis e-v charge kullanıcı yorumları",
  ],
  openGraph: {
    title: `${TITLE} — Bemis E-V Charge`,
    description: DESC,
    type: "website",
    url: `/${SLUG}`,
    images: ogImage("Müşteri Videoları — Bemis E-V Charge"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_URL] },
};

export default function MusteriVideolariPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Müşteri Videoları", url: `/${SLUG}` },
    ]),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <SocialWallPageClient />
    </>
  );
}
