// Blog yazılarının ÇEVİRİLERİ — kaynak (TR) posts.ts'te kalır; çeviriler dile göre
// `data/i18n/blog.json`'da tutulur. trBlogPost(post, lang) çeviriyi TR yapının ÜSTÜNE
// bindirir: YAPISAL alanlar (href, SVG, slug, tarih, bölüm tipi) HER ZAMAN TR kaynaktan
// gelir — yalnız METİN çevrilir. Çevirisi olmayan yazı/alan otomatik TR'ye düşer.
//
// Yapı: BLOG_I18N[dil][slug] = { title?, metaTitle?, description?, excerpt?, category?,
//   body?[ (tipe göre metin alanları) ], faq?[{q,a}], related?[{label}] }
// body dizisi TR body ile 1:1 hizalı olmalı (aynı uzunluk/sıra); değilse o yazı TR kalır.

import type { BlogPost, BlogSection } from "../blog/posts";

type SectionT = {
  text?: string;
  items?: string[];
  label?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
  alt?: string;
};
export type BlogTranslation = {
  title?: string;
  metaTitle?: string;
  description?: string;
  excerpt?: string;
  category?: string;
  body?: SectionT[];
  faq?: { q: string; a: string }[];
  related?: { label?: string }[];
};

// ⚠️ blog.json (1.5 MB — 30 yazının 5 dildeki TÜM çevirisi, ~344 KB transfer) artık
// STATİK import DEĞİL: TR/EN çoğunluğu bu dosyayı hiç indirmesin diye YALNIZ yabancı dil
// (de/es/ar/ru) seçilince tembel yüklenir. Yüklenene kadar trBlogPost TR döner (güvenli).
let BLOG_I18N: Record<string, Record<string, BlogTranslation>> | null = null;
let loadPromise: Promise<void> | null = null;

/** blog.json'u bir kez dinamik yükler (tekrar çağrı aynı promise'i döndürür). */
export function loadBlogI18n(): Promise<void> {
  if (BLOG_I18N) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = import("../../data/i18n/blog.json")
      .then((m) => { BLOG_I18N = ((m as { default?: unknown }).default ?? m) as Record<string, Record<string, BlogTranslation>>; })
      .catch(() => { loadPromise = null; }); // hata olursa tekrar denenebilir; TR gösterilir
  }
  return loadPromise;
}

// Bir bölümün metnini çeviriyle değiştir; tip/href/svg TR kaynaktan korunur.
function mergeSection(src: BlogSection, t: SectionT | undefined): BlogSection {
  if (!t) return src;
  switch (src.type) {
    case "p":
    case "h2":
    case "h3":
    case "quote":
      return { ...src, text: typeof t.text === "string" && t.text ? t.text : src.text };
    case "ul":
      return { ...src, items: Array.isArray(t.items) && t.items.length === src.items.length ? t.items : src.items };
    case "cta":
      return { ...src, text: t.text ?? src.text, label: t.label ?? src.label }; // href TR'den
    case "table":
      return {
        ...src,
        caption: t.caption ?? src.caption,
        headers: Array.isArray(t.headers) && t.headers.length === src.headers.length ? t.headers : src.headers,
        rows: Array.isArray(t.rows) && t.rows.length === src.rows.length ? t.rows : src.rows,
      };
    case "figure":
      return { ...src, alt: t.alt ?? src.alt, caption: t.caption ?? src.caption }; // svg TR'den
    default:
      return src;
  }
}

/** Bir blog yazısını aktif dile çevir (TR yapının üstüne bindirir, yoksa TR döner). */
export function trBlogPost(post: BlogPost, lang: string): BlogPost {
  if (lang === "tr") return post;
  // Henüz yüklenmemişse (veya bu yazının çevirisi yoksa) TR döner — güvenli düşüş.
  const t = BLOG_I18N?.[lang]?.[post.slug];
  if (!t) return post;

  const body =
    Array.isArray(t.body) && t.body.length === post.body.length
      ? post.body.map((s, i) => mergeSection(s, t.body![i]))
      : post.body;

  const related =
    post.related && Array.isArray(t.related) && t.related.length === post.related.length
      ? post.related.map((r, i) => ({ ...r, label: t.related![i]?.label ?? r.label }))
      : post.related;

  const faq =
    post.faq && Array.isArray(t.faq) && t.faq.length === post.faq.length ? t.faq : post.faq;

  return {
    ...post,
    title: t.title ?? post.title,
    metaTitle: t.metaTitle ?? post.metaTitle,
    description: t.description ?? post.description,
    excerpt: t.excerpt ?? post.excerpt,
    category: t.category ?? post.category,
    body,
    related,
    faq,
  };
}
