import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { blogListingSchema, breadcrumbSchema, ogImage, OG_URL } from "../../lib/seo";
import { yazilarDilde } from "../../lib/serverBlogLang";
import { BLOG_SEO, blogHreflang } from "../../lib/blogLangSeo";
import { LOCALE_LANGS } from "../../lib/localeProductSeo";
import BlogShell from "../../blog/BlogShell";

// Yabancı dil rehber listesi — /de/blog · /es/blog · /ru/blog · /nl/blog · /ar/blog
// (İngilizce AYRI statik ağaçta: app/en/blog — `[lang]` `en` üretmez.)
//
// ⚠️ ÇEVİRİ ZATEN VARDI, EKSİK OLAN ROTAYDI: `data/i18n/blog.json` yazıların 6 dilini
// taşıyordu ama indekslenebilir ADRES yalnız TR ve AR'da vardı — ziyaretçi dili
// değiştirince metin o dilde oluyordu, Google ise yalnız TR/AR adresini görüyordu.
//
// ⚠️ LİSTE YALNIZ TAM ÇEVRİLMİŞ YAZILARI GÖSTERİR (`tamCevrildi` kapısı). Yarım/bayat
// çeviride birleştirme sessizce TR'ye düşer; o yazıya yabancı adres açmak, o adreste
// Türkçe gövde yayınlamak olurdu.
// ⚠️ Bu dizine layout.tsx EKLEME: segment ayarları çocuklara iner, /<lang>/products kolunu etkiler.

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return LOCALE_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = BLOG_SEO[lang];
  if (!seo) return {};
  const canonical = `/${lang}/blog`;
  return {
    title: { absolute: seo.baslik },
    description: seo.aciklama,
    keywords: seo.keywords,
    alternates: {
      canonical,
      // ⚠️ Karşılıklı küme: /blog ve diğer dil kolları da aynı kümeyi basar.
      languages: blogHreflang("/blog", Object.keys(BLOG_SEO)),
    },
    openGraph: {
      title: seo.baslik,
      description: seo.aciklama,
      type: "website",
      url: canonical,
      locale: seo.ogLocale,
      siteName: "Bemis E-V Charge",
      images: ogImage(seo.ogMetin),
    },
    twitter: { card: "summary_large_image", title: seo.baslik, description: seo.aciklama, images: [OG_URL] },
  };
}

export default async function DilBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = BLOG_SEO[lang];
  if (!seo) notFound();

  const yazilar = yazilarDilde(lang);
  const jsonLd = [
    breadcrumbSchema([
      { name: seo.anaSayfa, url: `/${lang}` },
      { name: seo.blog, url: `/${lang}/blog` },
    ]),
    blogListingSchema({
      url: `/${lang}/blog`,
      posts: yazilar.map((p) => ({ title: p.title, url: `/${lang}/blog/${p.slug}`, datePublished: p.datePublished })),
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* sadeceRehber: Haberler (basın) ve SSS sekmeleri yabancı ADRESE sahip değil →
          dil kolunda gizlenir, aksi hâlde buradan TR rotalara sızardı. */}
      <BlogShell posts={yazilar} sadeceRehber />
    </>
  );
}
