import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { blogListingSchema, breadcrumbSchema, ogImage, OG_URL } from "../../lib/seo";
import { yazilarDilde } from "../../lib/serverBlogLang";
import BlogShell from "../../blog/BlogShell";

// Arapça rehber listesi — /ar/blog.
//
// ⚠️ ÇEVİRİ ZATEN VARDI, EKSİK OLAN ROTAYDI: `data/i18n/blog.json` yazıların Arapçasını
// aylardır taşıyordu ama indekslenebilir Arapça bir ADRES yoktu — ziyaretçi dili
// değiştirince metin Arapça oluyordu, Google ise yalnız TR adresi görüyordu.
//
// ⚠️ LİSTE YALNIZ TAM ÇEVRİLMİŞ YAZILARI GÖSTERİR (`tamCevrildi` kapısı). Yarım/bayat
// çeviride birleştirme sessizce TR'ye düşer; o yazıya Arapça adres açmak, Arapça
// adreste Türkçe gövde yayınlamak olurdu.
// ⚠️ Bu dizine layout.tsx EKLEME: segment ayarları çocuklara iner, /ar/products kolunu etkiler.

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return [{ lang: "ar" }];
}

const BASLIK = "أدلة شحن السيارات الكهربائية ومقالات تقنية | Bemis E-V Charge";
const ACIKLAMA =
  "أدلة عملية حول شحن السيارات الكهربائية: اختيار الكابل والمحوّل، التركيب، V2L، إدارة الأحمال والمزيد — من مدوّنة Bemis E-V Charge.";

// ⚠️ Karşılıklı küme: /blog de ar girişini verir (app/blog/page.tsx).
const HREFLANG = { tr: "/blog", ar: "/ar/blog", "x-default": "/blog" } as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== "ar") return {};
  return {
    title: { absolute: BASLIK },
    description: ACIKLAMA,
    alternates: { canonical: "/ar/blog", languages: HREFLANG },
    openGraph: {
      title: BASLIK, description: ACIKLAMA, type: "website",
      url: "/ar/blog", locale: "ar_AE", siteName: "Bemis E-V Charge",
      images: ogImage("Bemis E-V Charge — أدلة شحن السيارات الكهربائية"),
    },
    twitter: { card: "summary_large_image", title: BASLIK, description: ACIKLAMA, images: [OG_URL] },
  };
}

export default async function ArapcaBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ar") notFound();

  const yazilar = yazilarDilde("ar");
  const jsonLd = [
    breadcrumbSchema([
      { name: "الرئيسية", url: "/" },
      { name: "المدوّنة", url: "/ar/blog" },
    ]),
    blogListingSchema({
      url: "/ar/blog",
      posts: yazilar.map((p) => ({ title: p.title, url: `/ar/blog/${p.slug}`, datePublished: p.datePublished })),
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* sadeceRehber: Haberler (basın) ve SSS sekmeleri Arapça ADRESE sahip değil →
          Arapça kolda gizlenir, aksi hâlde buradan TR rotalara sızardı. */}
      <BlogShell posts={yazilar} sadeceRehber />
    </>
  );
}
