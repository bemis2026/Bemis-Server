import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { blogListingSchema } from "../lib/seo";
import { allPosts } from "./posts";
import BlogShell from "./BlogShell";

export const metadata: Metadata = {
  title: "Blog — EV Şarj Rehberleri & Teknik Yazılar",
  description:
    "Elektrikli araç şarjı, V2L, kablo ve adaptör seçimi, kurulum ve yerli üretim üzerine pratik rehberler. Bemis E-V Charge blog.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Bemis E-V Charge Blog",
    description: "EV şarj rehberleri ve teknik yazılar.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = allPosts();
  const jsonLd = blogListingSchema({
    url: "/blog",
    posts: posts.map((p) => ({ title: p.title, url: `/blog/${p.slug}`, datePublished: p.datePublished })),
  });
  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogShell posts={posts} />
    </>
  );
}
