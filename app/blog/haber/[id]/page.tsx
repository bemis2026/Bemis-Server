import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../../lib/seo";
import { allPress, getPress } from "../../press";
import BlogShell from "../../BlogShell";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPress().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getPress(id);
  if (!item) return { title: "Haber bulunamadı" };
  const canonical = `/blog/haber/${item.id}`;
  const description = item.summary;
  return {
    title: `${item.title} — ${item.source}`,
    description,
    alternates: { canonical },
    openGraph: { title: item.title, description, type: "article", url: canonical },
    twitter: { card: "summary", title: item.title, description },
  };
}

export default async function PressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getPress(id);
  if (!item) notFound();
  const url = `/blog/haber/${item.id}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: item.title, url },
    ]),
    // Tarihli haberlerde Article şeması ekle; tarihsizlerde (uydurma tarih
    // koymamak için) yalnızca breadcrumb yeterli.
    ...(item.date
      ? [articleSchema({ title: item.title, description: item.summary, url, datePublished: item.date })]
      : []),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogShell pressItem={item} />
    </>
  );
}
