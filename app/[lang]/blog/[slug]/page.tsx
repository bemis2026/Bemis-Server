import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { articleSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../../../lib/seo";
import type { BlogPost } from "../../../blog/posts";
import { arLinkleriDuzelt, yaziBulDilde, yazilarDilde } from "../../../lib/serverBlogLang";
import BlogShell from "../../../blog/BlogShell";
import { AR_ANAHTAR_KELIMELER } from "../../arIcerik";

// Arapça rehber sayfası — /ar/blog/<slug>.
//
// ⚠️ generateStaticParams YALNIZ TAM çevrilmiş yazıları üretir (`tamCevrildi` kapısı,
// serverBlogLang.ts). Bayat/eksik çeviride birleştirme sessizce TR'ye düşeceği için
// o yazıya Arapça adres AÇILMAZ — Arapça adreste Türkçe gövde yayınlamaktansa 404.
// Bugün 37 yazının 23'ü bu kapıdan geçiyor.

export const dynamicParams = false;
export const revalidate = 86400;

// JSON-LD wordCount için gövde + SSS metnindeki yaklaşık kelime sayısı.
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
  return yazilarDilde("ar").map((p) => ({ lang: "ar", slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (lang !== "ar") return {};
  const post = yaziBulDilde(slug, "ar");
  if (!post) return { title: "غير موجود" };
  const canonical = `/ar/blog/${post.slug}`;
  const baslik = post.metaTitle || post.title;
  return {
    title: { absolute: `${baslik} | Bemis E-V Charge` },
    description: post.description,
    // ⚠️ keywords AÇIKÇA verilir: verilmezse Next KÖK YERLEŞİMİN TÜRKÇE listesini
    //    miras alır (ölçüldü). Yazının kendi keywords'ü TR kaynakta kalır → Arapça taban + başlık.
    keywords: [post.title, ...AR_ANAHTAR_KELIMELER],
    alternates: {
      canonical,
      // ⚠️ Karşılıklı: TR yazı sayfası da (yalnız çevirisi tamsa) ar girişini verir.
      languages: { tr: `/blog/${post.slug}`, ar: canonical, "x-default": `/blog/${post.slug}` },
    },
    openGraph: {
      title: post.title, description: post.description, type: "article", url: canonical,
      locale: "ar_AE", siteName: "Bemis E-V Charge",
      images: post.cover ? [{ url: post.cover }] : ogImage(post.title),
    },
    twitter: {
      card: "summary_large_image", title: post.title, description: post.description,
      images: post.cover ? [post.cover] : [OG_URL],
    },
  };
}

export default async function ArapcaBlogYaziPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (lang !== "ar") notFound();
  const cevrilmis = yaziBulDilde(slug, "ar");
  if (!cevrilmis) notFound();
  // İç linkleri Arapça kola taşı (related + gövde içindeki CTA'lar).
  const post = arLinkleriDuzelt(cevrilmis);

  const url = `/ar/blog/${post.slug}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "الرئيسية", url: "/" },
      { name: "المدوّنة", url: "/ar/blog" },
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
      // ⓘ keywords TR kaynakta kaldığı için şemaya da verilmiyor (Arapça sayfada TR kelime olmaz).
      articleSection: post.category,
    }),
    ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
    // ⚠️ howTo TR kaynaktan gelir (çeviri kümesinde YOK) → Arapça sayfada Türkçe adım
    //    basardı; bu yüzden Arapça kolda HowTo şeması emit EDİLMEZ.
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogShell post={post} />
    </>
  );
}
