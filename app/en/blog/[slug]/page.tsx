import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { articleSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../../../lib/seo";
import type { BlogPost } from "../../../blog/posts";
import { dilLinkleriDuzelt, yaziBulDilde, yaziDilleri, yazilarDilde } from "../../../lib/serverBlogLang";
import { BLOG_SEO, blogHreflang } from "../../../lib/blogLangSeo";
import BlogShell from "../../../blog/BlogShell";
import { getProductsForLang } from "../../../lib/serverProductsLang";
import { yaziUrunleri, urunBloguHedefi } from "../../../lib/blogProducts";

// İngilizce rehber sayfası — /en/blog/<slug>.
//
// ⚠️ generateStaticParams YALNIZ TAM çevrilmiş yazıları üretir (`tamCevrildi` kapısı).
// Bayat/eksik çeviride birleştirme sessizce TR'ye düşeceği için o yazıya İngilizce
// adres AÇILMAZ — İngilizce adreste Türkçe gövde yayınlamaktansa 404.

export const dynamicParams = false;
export const revalidate = 86400;

const SEO = BLOG_SEO.en;

function countWords(post: BlogPost): number {
  let text = "";
  for (const b of post.body) {
    if (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "quote") text += " " + b.text;
    else if (b.type === "ul") text += " " + b.items.join(" ");
  }
  if (post.faq) for (const f of post.faq) text += ` ${f.q} ${f.a}`;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function generateStaticParams() {
  return yazilarDilde("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = yaziBulDilde(slug, "en");
  if (!post) return { title: "Not found" };
  const canonical = `/en/blog/${post.slug}`;
  const baslik = post.metaTitle || post.title;
  return {
    title: { absolute: `${baslik} | Bemis E-V Charge` },
    description: post.description,
    // ⚠️ keywords AÇIKÇA verilir: verilmezse Next kök yerleşimin TÜRKÇE listesini miras alır.
    keywords: [post.title, ...SEO.keywords],
    alternates: {
      canonical,
      languages: blogHreflang(`/blog/${post.slug}`, yaziDilleri(post)),
    },
    openGraph: {
      title: post.title, description: post.description, type: "article", url: canonical,
      locale: SEO.ogLocale, siteName: "Bemis E-V Charge",
      images: post.cover ? [{ url: post.cover }] : ogImage(post.title),
    },
    twitter: {
      card: "summary_large_image", title: post.title, description: post.description,
      images: post.cover ? [post.cover] : [OG_URL],
    },
  };
}

export default async function EnBlogYaziPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cevrilmis = yaziBulDilde(slug, "en");
  if (!cevrilmis) notFound();
  const post = dilLinkleriDuzelt(cevrilmis, "en");

  const url = `/en/blog/${post.slug}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: SEO.anaSayfa, url: "/en" },
      { name: SEO.blog, url: "/en/blog" },
      { name: post.title, url },
    ]),
    articleSchema({
      title: post.title,
      description: post.description,
      url,
      image: post.cover,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      wordCount: countWords(post),
      articleSection: post.category,
    }),
    ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
    // ⚠️ howTo TR kaynaktan gelir → İngilizce sayfada Türkçe adım basardı, emit EDİLMEZ.
  ];

  const kategoriler = await getProductsForLang("en");
  const urunler = yaziUrunleri(post, kategoriler);

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Ürünler SUNUCUDAN: ilk HTML'de olmalı (istemciden çekilseydi Google boş görürdü). */}
      <BlogShell post={post} urunler={urunler} urunHedefi={urunBloguHedefi(urunler)} />
    </>
  );
}
