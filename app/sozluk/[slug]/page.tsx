import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { definedTermSchema, breadcrumbSchema, ogImage, OG_URL } from "../../lib/seo";
import { allTerms, getTerm } from "../../lib/glossary";
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
  return {
    title: t.term,
    description: t.short,
    keywords: t.keywords,
    alternates: { canonical, languages: { tr: canonical, "x-default": canonical } },
    openGraph: { title: t.term, description: t.short, type: "article", url: canonical, images: ogImage(t.term) },
    twitter: { card: "summary_large_image", title: t.term, description: t.short, images: [OG_URL] },
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
    definedTermSchema(t),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <GlossaryClient mode="term" term={t} terms={allTerms()} />
    </>
  );
}
