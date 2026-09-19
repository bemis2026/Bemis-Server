import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { articleSchema, faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../../../lib/seo";
import type { BlogPost } from "../../../blog/posts";
import { dilLinkleriDuzelt, yaziBulDilde, yaziDilleri, yazilarDilde } from "../../../lib/serverBlogLang";
import { BLOG_SEO, blogHreflang } from "../../../lib/blogLangSeo";
import { LOCALE_LANGS } from "../../../lib/localeProductSeo";
import BlogShell from "../../../blog/BlogShell";
import { getProductsForLang } from "../../../lib/serverProductsLang";
import { yaziUrunleri, urunBloguHedefi } from "../../../lib/blogProducts";

// Yabancı dil rehber sayfası — /<lang>/blog/<slug> (de · es · ru · nl · ar).
// İngilizce AYRI statik ağaçta: app/en/blog/[slug].
//
// ⚠️ generateStaticParams YALNIZ TAM çevrilmiş yazıları üretir (`tamCevrildi` kapısı,
// serverBlogLang.ts). Bayat/eksik çeviride birleştirme sessizce TR'ye düşeceği için
// o yazıya o dilde adres AÇILMAZ — yabancı adreste Türkçe gövde yayınlamaktansa 404.

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
  return LOCALE_LANGS.flatMap((lang) => yazilarDilde(lang).map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const seo = BLOG_SEO[lang];
  if (!seo) return {};
  const post = yaziBulDilde(slug, lang);
  if (!post) return { title: "404" };
  const canonical = `/${lang}/blog/${post.slug}`;
  const baslik = post.metaTitle || post.title;
  return {
    title: { absolute: `${baslik} | Bemis E-V Charge` },
    description: post.description,
    // ⚠️ keywords AÇIKÇA verilir: verilmezse Next KÖK YERLEŞİMİN TÜRKÇE listesini
    //    miras alır (ölçüldü). Yazının kendi keywords'ü TR kaynakta kalır → o dilin
    //    taban listesi + yazının o dildeki başlığı kullanılır.
    keywords: [post.title, ...seo.keywords],
    alternates: {
      canonical,
      // ⚠️ Karşılıklı küme: TR yazı sayfası da aynı dilleri verir; küme TEK
      //    fonksiyondan üretilir ki iki taraf ayrışamasın.
      languages: blogHreflang(`/blog/${post.slug}`, yaziDilleri(post)),
    },
    openGraph: {
      title: post.title, description: post.description, type: "article", url: canonical,
      locale: seo.ogLocale, siteName: "Bemis E-V Charge",
      images: post.cover ? [{ url: post.cover }] : ogImage(post.title),
    },
    twitter: {
      card: "summary_large_image", title: post.title, description: post.description,
      images: post.cover ? [post.cover] : [OG_URL],
    },
  };
}

export default async function DilBlogYaziPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const seo = BLOG_SEO[lang];
  if (!seo) notFound();
  const cevrilmis = yaziBulDilde(slug, lang);
  if (!cevrilmis) notFound();
  // İç linkleri o dilin koluna taşı (related + gövde içindeki CTA'lar).
  const post = dilLinkleriDuzelt(cevrilmis, lang);

  const url = `/${lang}/blog/${post.slug}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: seo.anaSayfa, url: `/${lang}` },
      { name: seo.blog, url: `/${lang}/blog` },
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
      // ⓘ keywords TR kaynakta kaldığı için şemaya verilmiyor (yabancı sayfada TR kelime olmaz).
      articleSection: post.category,
    }),
    ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
    // ⚠️ howTo TR kaynaktan gelir (çeviri kümesinde YOK) → yabancı sayfada Türkçe adım
    //    basardı; bu yüzden dil kolunda HowTo şeması emit EDİLMEZ.
  ];

  const kategoriler = await getProductsForLang(lang);
  const urunler = yaziUrunleri(post, kategoriler);

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Ürünler SUNUCUDAN: ilk HTML'de olmalı (istemciden çekilseydi Google boş görürdü). */}
      <BlogShell post={post} urunler={urunler} urunHedefi={urunBloguHedefi(urunler)} />
    </>
  );
}
