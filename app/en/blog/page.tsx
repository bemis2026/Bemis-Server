import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { blogListingSchema, breadcrumbSchema, ogImage, OG_URL } from "../../lib/seo";
import { yazilarDilde } from "../../lib/serverBlogLang";
import { BLOG_SEO, blogHreflang } from "../../lib/blogLangSeo";
import BlogShell from "../../blog/BlogShell";

// İngilizce rehber listesi — /en/blog.
//
// ⚠️ NEDEN `app/[lang]` DEĞİL DE AYRI DOSYA: `app/en/` STATİK bir ağaçtır (ürün
// sayfaları orada) ve `[lang]` generateStaticParams `en` ÜRETMEZ. Aynı seviyede
// statik `en` segmenti açmak dinamik `[lang]` kolunu gölgeler (kayıtlı ders).
// ⚠️ Metin/şema TEK KAYNAKTAN (`blogLangSeo.ts` + `serverBlogLang.ts`) okunur —
// iki yerde metin tutulmaz, ayrışamaz.

export const revalidate = 86400;

const SEO = BLOG_SEO.en;

export const metadata: Metadata = {
  title: { absolute: SEO.baslik },
  description: SEO.aciklama,
  keywords: SEO.keywords,
  alternates: {
    canonical: "/en/blog",
    languages: blogHreflang("/blog", Object.keys(BLOG_SEO)),
  },
  openGraph: {
    title: SEO.baslik,
    description: SEO.aciklama,
    type: "website",
    url: "/en/blog",
    locale: SEO.ogLocale,
    siteName: "Bemis E-V Charge",
    images: ogImage(SEO.ogMetin),
  },
  twitter: { card: "summary_large_image", title: SEO.baslik, description: SEO.aciklama, images: [OG_URL] },
};

export default function EnBlogPage() {
  const yazilar = yazilarDilde("en");
  const jsonLd = [
    breadcrumbSchema([
      { name: SEO.anaSayfa, url: "/en" },
      { name: SEO.blog, url: "/en/blog" },
    ]),
    blogListingSchema({
      url: "/en/blog",
      posts: yazilar.map((p) => ({ title: p.title, url: `/en/blog/${p.slug}`, datePublished: p.datePublished })),
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* sadeceRehber: Haberler (basın) ve SSS sekmelerinin İngilizce ADRESİ yok →
          gizlenir, aksi hâlde buradan TR rotalara sızardı. */}
      <BlogShell posts={yazilar} sadeceRehber />
    </>
  );
}
