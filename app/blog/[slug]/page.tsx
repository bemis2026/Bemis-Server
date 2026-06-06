import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { articleSchema, faqSchema, breadcrumbSchema } from "../../lib/seo";
import { allPosts, getPost } from "../posts";
import BlogShell from "../BlogShell";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonical,
      ...(post.cover && { images: [{ url: post.cover }] }),
    },
    twitter: {
      card: post.cover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(post.cover && { images: [post.cover] }),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const url = `/blog/${post.slug}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url },
    ]),
    articleSchema({
      title: post.title,
      description: post.description,
      url,
      image: post.cover,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
    }),
    ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogShell post={post} />
    </>
  );
}
