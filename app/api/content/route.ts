import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { readFileSync } from "fs";
import path from "path";

async function loadBlob(blobKey: string, fallbackPath: string) {
  try {
    const { blobs } = await list({ prefix: blobKey });
    const blob = blobs.find((b) => b.pathname === blobKey);
    if (blob) {
      const res = await fetch(blob.url, { cache: "no-store" });
      return await res.json();
    }
  } catch {}
  try { return JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  const tr = await loadBlob(
    "data/content.json",
    path.join(process.cwd(), "data", "content.json")
  );

  if (!tr) return NextResponse.json({ error: "İçerik yüklenemedi" }, { status: 500 });
  if (lang === "tr") return NextResponse.json(tr);

  // EN: TR as base (media/structural), EN overrides text fields only
  const en = await loadBlob(
    "data/content-en.json",
    path.join(process.cwd(), "data", "content-en.json")
  ) ?? {};

  const merged = {
    ...tr,
    // Text-only overrides from EN:
    hero: {
      ...tr.hero,
      ...(en.hero ?? {}),
      // Media stays TR:
      heroBg: tr.hero?.heroBg,
      layout: tr.hero?.layout,
    },
    dna: {
      ...tr.dna,
      ...(en.dna ?? {}),
      // Media stays TR:
      factoryImage: tr.dna?.factoryImage,
      factoryVideo: tr.dna?.factoryVideo,
      productionStepImages: tr.dna?.productionStepImages,
    },
    technology: en.technology
      ? { ...tr.technology, ...en.technology }
      : tr.technology,
    products:       { ...tr.products,       ...(en.products       ?? {}) },
    dealer:         { ...tr.dealer,         ...(en.dealer         ?? {}) },
    reviews:        { ...tr.reviews,        ...(en.reviews        ?? {}), items: tr.reviews?.items },
    contactSection: { ...tr.contactSection, ...(en.contactSection ?? {}) },
    featuredSection:{ ...tr.featuredSection,...(en.featuredSection ?? {}) },
    navbar: en.navbar
      ? { ...tr.navbar, ...en.navbar, links: en.navbar.links ?? tr.navbar?.links }
      : tr.navbar,
    footer: { ...tr.footer, ...(en.footer ?? {}) },
    // These always stay TR (media / structural / non-translatable):
    categories:  tr.categories,
    logos:       tr.logos,
    sectionBgs:  tr.sectionBgs,
    featured:    tr.featured,
    stats:       tr.stats,
    contact:     tr.contact,
    company:     tr.company,
    social:      tr.social,
    sectionOrder:tr.sectionOrder,
    textStyles:  tr.textStyles,
  };

  return NextResponse.json(merged);
}
