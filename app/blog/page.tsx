import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { blogListingSchema, ogImage, OG_URL } from "../lib/seo";
import { allPosts } from "./posts";
import BlogShell from "./BlogShell";

export const metadata: Metadata = {
  title: "EV Şarj Rehberleri & Teknik Yazılar",
  description:
    "Elektrikli araç şarjı, V2L, kablo ve adaptör seçimi, kurulum ve yerli üretim üzerine pratik rehberler. Bemis E-V Charge blog.",
  alternates: { canonical: "/blog", languages: { tr: "/blog", "x-default": "/blog" } },
  openGraph: {
    title: "Bemis E-V Charge Blog",
    description: "EV şarj rehberleri ve teknik yazılar.",
    type: "website",
    url: "/blog",
    images: ogImage("Bemis E-V Charge Blog — elektrikli araç şarj rehberleri ve teknik yazılar"),
  },
  twitter: {
    card: "summary_large_image",
    title: "EV Şarj Rehberleri & Teknik Yazılar",
    description:
      "Elektrikli araç şarjı, V2L, kablo ve adaptör seçimi, kurulum ve yerli üretim üzerine pratik rehberler. Bemis E-V Charge blog.",
    images: [OG_URL],
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
