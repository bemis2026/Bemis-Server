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

  // Merge categories per-key so EN can override only name/subtitle while TR
  // keeps modelCount/badge/comingSoon/image (visual + model-count fields).
  const mergedCategories: Record<string, unknown> = { ...(tr.categories ?? {}) };
  if (en.categories && typeof en.categories === "object") {
    for (const key of Object.keys(en.categories)) {
      mergedCategories[key] = { ...(tr.categories?.[key] ?? {}), ...en.categories[key] };
    }
  }

  // Merge stats by index. EN provides translated label/description; numeric
  // value/prefix/suffix come from TR.
  const mergedStats = (tr.stats ?? []).map((s: Record<string, unknown>, i: number) => ({
    ...s,
    ...((en.stats ?? [])[i] ?? {}),
  }));

  // Featured highlights: keep TR data (categoryId/productId/visible) and let
  // EN override badge + highlight copy.
  const mergedFeatured = (tr.featured ?? []).map((f: Record<string, unknown>, i: number) => ({
    ...f,
    ...((en.featured ?? [])[i] ?? {}),
  }));

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
    smartCharger: en.smartCharger
      ? { ...tr.smartCharger, ...en.smartCharger, features: en.smartCharger.features ?? tr.smartCharger?.features }
      : tr.smartCharger,
    productShowcase: en.productShowcase
      ? { ...tr.productShowcase, ...en.productShowcase, image: tr.productShowcase?.image, specs: en.productShowcase.specs ?? tr.productShowcase?.specs }
      : tr.productShowcase,
    calculator:    { ...tr.calculator,    ...(en.calculator    ?? {}) },
    navbar: en.navbar
      ? { ...tr.navbar, ...en.navbar, links: en.navbar.links ?? tr.navbar?.links }
      : tr.navbar,
    footer:       { ...tr.footer,       ...(en.footer       ?? {}) },
    categories:   mergedCategories,
    logos:        tr.logos,
    sectionBgs:   tr.sectionBgs,
    featured:     mergedFeatured,
    stats:        mergedStats,
    contact:      tr.contact,
    company:      tr.company,
    social:       tr.social,
    sectionOrder: tr.sectionOrder,
    textStyles:   tr.textStyles,
  };

  return NextResponse.json(merged);
}
