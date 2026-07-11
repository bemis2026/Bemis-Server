import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { definedTermSchema, breadcrumbSchema, faqSchema, ogImage, OG_URL, SITE_URL } from "../../lib/seo";
import { allTerms, getTerm, TERM_SEE_ALSO, GLOSSARY_UPDATED } from "../../lib/glossary";
import GlossaryClient from "../GlossaryClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return allTerms().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) return { title: "Terim bulunamadı" };
  const canonical = `/sozluk/${t.slug}`;
  // CTR: GSC verisi (2026-07) sözlük terimlerinin "x nedir / x ne demek"
  // sorgularında gösterim alıp tıklanmadığını gösterdi (IP65/IP66 133 gösterim
  // %0, kW/kWh 94, CCS2 59). <title>'a "Nedir?" kalıbı sorgu diliyle birebir
  // eşleşir → SERP başlığı tıklanabilirleşir. SAYFA İÇERİĞİ DEĞİŞMEZ (yalnız meta).
  const metaTitle = /nedir/i.test(t.term) ? t.term : `${t.term} Nedir?`;
  return {
    title: metaTitle,
    description: t.short,
    keywords: t.keywords,
    alternates: { canonical, languages: { tr: canonical, "x-default": canonical } },
    openGraph: { title: metaTitle, description: t.short, type: "article", url: canonical, modifiedTime: GLOSSARY_UPDATED, images: ogImage(t.term) },
    twitter: { card: "summary_large_image", title: metaTitle, description: t.short, images: [OG_URL] },
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) notFound();
  const url = `/sozluk/${t.slug}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Sözlük", url: "/sozluk" },
      { name: t.abbr, url },
    ]),
    definedTermSchema(t, (TERM_SEE_ALSO[t.slug] ?? []).map((s) => `${SITE_URL}/sozluk/${s}`)),
    ...(t.faq && t.faq.length > 0 ? [faqSchema(t.faq)] : []),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <GlossaryClient mode="term" term={t} terms={allTerms()} />
    </>
  );
}
