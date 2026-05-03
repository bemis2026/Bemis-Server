import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../lib/jsonbin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripTranslations(obj: any) {
  if (!obj || typeof obj !== "object") return obj;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _translations, ...rest } = obj;
  return rest;
}

async function loadJsonFile(p: string) {
  try { return JSON.parse(readFileSync(p, "utf-8")); } catch { return null; }
}

export async function GET(req: NextRequest) {
  const lang = new URL(req.url).searchParams.get("lang") ?? "tr";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bin: any = null;
  try { bin = await readBin("content"); } catch {}
  if (!bin) bin = await loadJsonFile(path.join(process.cwd(), "data", "content.json"));
  if (!bin) return NextResponse.json({ error: "İçerik yüklenemedi" }, { status: 500 });

  const tr = stripTranslations(bin);

  if (lang === "tr") return NextResponse.json(tr);

  // EN: prefer in-bin translation, fall back to local file, then to TR.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let en: any = bin?._translations?.en ?? null;
  if (!en) en = await loadJsonFile(path.join(process.cwd(), "data", "content-en.json"));
  en = en ?? {};

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

  // Showcase products[]: structurally identical between TR/EN; merge per-index
  // so non-translated fields (image, ctaHref, layout) come from TR.
  const trShowcaseProducts = Array.isArray(tr.productShowcase?.products) ? tr.productShowcase.products : [];
  const enShowcaseProducts = Array.isArray(en.productShowcase?.products) ? en.productShowcase.products : [];
  const mergedShowcaseProducts = trShowcaseProducts.map((p: Record<string, unknown>, i: number) => ({
    ...p,
    ...(enShowcaseProducts[i] ?? {}),
    image: (p as { image?: string }).image,
    images: (p as { images?: string[] }).images,
    ctaHref: (p as { ctaHref?: string }).ctaHref,
    ctaSecondaryHref: (p as { ctaSecondaryHref?: string }).ctaSecondaryHref,
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
    products: {
      ...tr.products,
      ...(en.products ?? {}),
      sliderEnabled: tr.products?.sliderEnabled,
      allProductsDescription: tr.products?.allProductsDescription,
    },
    dealer:          { ...tr.dealer,          ...(en.dealer          ?? {}) },
    reviews: (() => {
      const trItems: Array<Record<string, unknown>> = tr.reviews?.items ?? [];
      const enItems: Array<Record<string, unknown>> = en.reviews?.items ?? [];
      const items = trItems.map((it, i) => ({ ...it, ...(enItems[i] ?? {}) }));
      return { ...tr.reviews, ...(en.reviews ?? {}), items };
    })(),
    contactSection:  { ...tr.contactSection,  ...(en.contactSection  ?? {}) },
    featuredSection: { ...tr.featuredSection, ...(en.featuredSection ?? {}) },
    smartCharger: en.smartCharger
      ? {
          ...tr.smartCharger,
          ...en.smartCharger,
          features: en.smartCharger.features ?? tr.smartCharger?.features,
          mockupPhoneImage: tr.smartCharger?.mockupPhoneImage,
          mockupWebImage: tr.smartCharger?.mockupWebImage,
          ctaHref: tr.smartCharger?.ctaHref,
          appStoreHref: tr.smartCharger?.appStoreHref,
          playStoreHref: tr.smartCharger?.playStoreHref,
        }
      : tr.smartCharger,
    productShowcase: en.productShowcase
      ? {
          ...tr.productShowcase,
          ...en.productShowcase,
          image: tr.productShowcase?.image,
          images: tr.productShowcase?.images,
          ctaHref: tr.productShowcase?.ctaHref,
          ctaSecondaryHref: tr.productShowcase?.ctaSecondaryHref,
          specs: en.productShowcase.specs ?? tr.productShowcase?.specs,
          products: mergedShowcaseProducts.length > 0 ? mergedShowcaseProducts : undefined,
        }
      : tr.productShowcase,
    calculator:    { ...tr.calculator,    ...(en.calculator    ?? {}) },
    navbar: en.navbar
      ? { ...tr.navbar, ...en.navbar, links: (en.navbar.links ?? tr.navbar?.links).map((l: Record<string, unknown>, i: number) => ({
          ...((tr.navbar?.links ?? [])[i] ?? {}),
          ...l,
          href: (tr.navbar?.links ?? [])[i]?.href ?? l.href,
        })) }
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
