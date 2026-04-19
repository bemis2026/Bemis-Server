import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../lib/jsonbin";

async function loadContent(binName: string, fallbackPath: string) {
  try {
    return await readBin(binName);
  } catch {}
  try { return JSON.parse(readFileSync(fallbackPath, "utf-8")); } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tr: any = await loadContent("content", path.join(process.cwd(), "data", "content.json"));

  if (!tr) return NextResponse.json({ error: "İçerik yüklenemedi" }, { status: 500 });
  if (lang === "tr") return NextResponse.json(tr);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const en: any = await loadContent("content-en", path.join(process.cwd(), "data", "content-en.json")) ?? {};

  const merged = {
    ...tr,
    hero: {
      ...tr.hero,
      ...(en.hero ?? {}),
      heroBg: tr.hero?.heroBg,
      layout: tr.hero?.layout,
    },
    dna: {
      ...tr.dna,
      ...(en.dna ?? {}),
      factoryImage: tr.dna?.factoryImage,
      factoryVideo: tr.dna?.factoryVideo,
      productionStepImages: tr.dna?.productionStepImages,
    },
    technology: en.technology ? { ...tr.technology, ...en.technology } : tr.technology,
    products:        { ...tr.products,        ...(en.products        ?? {}) },
    dealer:          { ...tr.dealer,          ...(en.dealer          ?? {}) },
    reviews:         { ...tr.reviews,         ...(en.reviews         ?? {}), items: tr.reviews?.items },
    contactSection:  { ...tr.contactSection,  ...(en.contactSection  ?? {}) },
    featuredSection: { ...tr.featuredSection, ...(en.featuredSection ?? {}) },
    navbar: en.navbar
      ? { ...tr.navbar, ...en.navbar, links: en.navbar.links ?? tr.navbar?.links }
      : tr.navbar,
    footer:       { ...tr.footer,       ...(en.footer       ?? {}) },
    categories:   tr.categories,
    logos:        tr.logos,
    sectionBgs:   tr.sectionBgs,
    featured:     tr.featured,
    stats:        tr.stats,
    contact:      tr.contact,
    company:      tr.company,
    social:       tr.social,
    sectionOrder: tr.sectionOrder,
    textStyles:   tr.textStyles,
  };

  return NextResponse.json(merged);
}
