// İçeriğin dil-birleştirme mantığı — TEK KAYNAK. Hem /api/content route'u hem
// /en SSR sayfası (Faz A, 2026-07-18) bunu kullanır. Mantık app/api/content/
// route.ts'ten AYNEN taşındı (davranış değişikliği YOK).
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "./jsonbin";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getContentForLang(lang: string): Promise<any | null> {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bin: any = null;
  try { bin = await readBin("content"); } catch {}
  if (!bin) bin = await loadJsonFile(path.join(process.cwd(), "data", "content.json"));
  if (!bin) return null;

  const tr = stripTranslations(bin);

  if (lang === "tr") return tr;

  // Çeviri overlay'i (en/de/es/ar/ru): önce bin içi _translations, sonra
  // paketlenmiş data/content-<lang>.json, yoksa {} (→ tüm alanlar TR'ye düşer).
  // `en` değişken adı geçmişten kalma — aşağıdaki birleştirme dil-bağımsızdır,
  // yalnız overlay kaynağı dile göre seçilir. Bilinmeyen dil → EN'e düşer.
  const overlayLang = ["en", "de", "es", "ar", "ru"].includes(lang) ? lang : "en";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let en: any = bin?._translations?.[overlayLang] ?? null;
  if (!en) en = await loadJsonFile(path.join(process.cwd(), "data", `content-${overlayLang}.json`));
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
      // KADRAJ/DIZILIM ALANLARI = KIMLIK, dile gore DEGISMEZ.
      // Neden: 2026-07-27'de heroBgPos TR'de "75% 77%" -> "75% 32%" duzeltildi
      // ama 5 dilin overlay'inde ESKI deger kaldigi icin yabanci dillerde
      // hero BASKA kadrajla goruntuleniyordu (kullanici bildirdi 2026-07-29).
      // Ayni ders urun merge'inde alinmisti: kimlik alanlari DAIMA TR'den.
      heroBgPos: tr.hero?.heroBgPos,
      heroBgZoom: tr.hero?.heroBgZoom,
      heroBgPosMobile: tr.hero?.heroBgPosMobile,
      heroBgZoomMobile: tr.hero?.heroBgZoomMobile,
      heroImages: tr.hero?.heroImages,
      heroImagesPos: tr.hero?.heroImagesPos,
      heroImagesZoom: tr.hero?.heroImagesZoom,
      heroImagesPosMobile: tr.hero?.heroImagesPosMobile,
      heroImagesZoomMobile: tr.hero?.heroImagesZoomMobile,
    },
    dna: (() => {
      const mergeIndex = (trArr: Array<Record<string, unknown>>, enArr: Array<Record<string, unknown>>) =>
        trArr.map((it, i) => ({ ...it, ...(enArr[i] ?? {}) }));
      const timeline = mergeIndex(tr.dna?.timeline ?? [], en.dna?.timeline ?? []);
      const certifications = mergeIndex(tr.dna?.certifications ?? [], en.dna?.certifications ?? []);
      return {
        ...tr.dna,
        ...(en.dna ?? {}),
        factoryImage: tr.dna?.factoryImage,
        factoryVideo: tr.dna?.factoryVideo,
        productionStepImages: tr.dna?.productionStepImages,
        aboutVideo: tr.dna?.aboutVideo,
        timeline: timeline.length > 0 ? timeline : undefined,
        certifications: certifications.length > 0 ? certifications : undefined,
      };
    })(),
    technology: en.technology ? { ...tr.technology, ...en.technology } : tr.technology,
    products: {
      ...tr.products,
      ...(en.products ?? {}),
      sliderEnabled: tr.products?.sliderEnabled,
      allProductsDescription: tr.products?.allProductsDescription,
    },
    dealer: (() => {
      // Region reps: per-index merge so EN overrides only the translated
      // fields (title) — name / phone / email / whatsapp stay TR-canonical.
      const trReps = tr.dealer?.regionReps ?? [];
      const enReps = en.dealer?.regionReps ?? [];
      const regionReps = trReps.map((r: Record<string, unknown>, i: number) => ({ ...r, ...(enReps[i] ?? {}) }));
      // International dealers: per-id merge so EN overrides countryName /
      // distributorName / address / notes while lat / lng / active stay TR.
      const trIntl = (tr.dealer?.internationalDealers ?? []) as Array<Record<string, unknown>>;
      const enIntl = (en.dealer?.internationalDealers ?? []) as Array<Record<string, unknown>>;
      const enById: Record<string, Record<string, unknown>> = {};
      for (const e of enIntl) if (typeof e?.id === "string") enById[e.id] = e;
      const internationalDealers = trIntl.map((r) => ({ ...r, ...(enById[r.id as string] ?? {}), lat: r.lat, lng: r.lng, active: r.active }));
      // Export contact: shallow merge so EN overrides title/hours but
      // email/phone/whatsapp stay TR-canonical.
      const exportContact = tr.dealer?.exportContact || en.dealer?.exportContact
        ? { ...(tr.dealer?.exportContact ?? {}), ...(en.dealer?.exportContact ?? {}),
            email: tr.dealer?.exportContact?.email,
            phone: tr.dealer?.exportContact?.phone,
            whatsapp: tr.dealer?.exportContact?.whatsapp,
            contactPerson: tr.dealer?.exportContact?.contactPerson }
        : undefined;
      // World section: shallow merge so EN overrides translatable copy;
      // languages array stays canonical (ISO codes don't translate).
      const worldSection = tr.dealer?.worldSection || en.dealer?.worldSection
        ? { ...(tr.dealer?.worldSection ?? {}), ...(en.dealer?.worldSection ?? {}),
            languages: tr.dealer?.worldSection?.languages ?? en.dealer?.worldSection?.languages }
        : undefined;
      return {
        ...tr.dealer,
        ...(en.dealer ?? {}),
        regionReps: regionReps.length > 0 ? regionReps : undefined,
        internationalDealers: internationalDealers.length > 0 ? internationalDealers : undefined,
        exportContact,
        worldSection,
      };
    })(),
    reviews: (() => {
      const trItems: Array<Record<string, unknown>> = tr.reviews?.items ?? [];
      const enItems: Array<Record<string, unknown>> = en.reviews?.items ?? [];
      const items = trItems.map((it, i) => ({ ...it, ...(enItems[i] ?? {}) }));
      return { ...tr.reviews, ...(en.reviews ?? {}), items };
    })(),
    contactSection:  { ...tr.contactSection,  ...(en.contactSection  ?? {}) },
    featuredSection: { ...tr.featuredSection, ...(en.featuredSection ?? {}) },
    // Projeye Özel Üretim kartı: overlay yalnız METİN alanlarını çevirir
    // (eyebrow/title/description/cta etiketleri). Yapısal alanlar TR-kanonik:
    // enabled/categories/swatches/href'ler çevrilmez, TR'den gelir.
    projectSection: (tr.projectSection || en.projectSection)
      ? {
          ...(tr.projectSection ?? {}),
          ...(en.projectSection ?? {}),
          enabled:          tr.projectSection?.enabled,
          categories:       tr.projectSection?.categories,
          swatches:         tr.projectSection?.swatches,
          ctaPrimaryHref:   tr.projectSection?.ctaPrimaryHref,
          ctaSecondaryHref: tr.projectSection?.ctaSecondaryHref,
        }
      : tr.projectSection,
    referenceProjectsSection: (() => {
      const trRP = tr.referenceProjectsSection ?? {};
      const enRP = en.referenceProjectsSection ?? {};
      const trItems = Array.isArray(trRP.items) ? trRP.items : [];
      const enItems = Array.isArray(enRP.items) ? enRP.items : [];
      const items = trItems.map((it: Record<string, unknown>, i: number) => ({
        ...it,
        ...(enItems[i] ?? {}),
        image: it.image,
        id: it.id,
      }));
      return { ...trRP, ...enRP, items };
    })(),
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
    // ⚠️ Sertifika bandı KİMLİK ALANI — belge adları (CE/TÜV/TSE/ISO) her dilde
    // aynı olduğu için DAİMA TR'den gelir, çeviri katmanına hiç girmez.
    statsCertBand: tr.statsCertBand,
    // ⚠️ DIŞ TİCARET İLETİŞİMİ: bu blok YALNIZ yabancı dillerde çalışır
    // (yukarıda `if (lang === "tr") return tr;` ile Türkçe erken döner).
    // Dolayısıyla yabancı ziyaretçi e-posta/telefon/WhatsApp olarak dış ticaret
    // hattını görür; Türkçe tarafta hiçbir şey değişmez.
    contact:      { ...tr.contact, ...(tr.contactExport ?? {}) },
    contactExport: tr.contactExport,
    company:      tr.company,
    social:       tr.social,
    sectionOrder: tr.sectionOrder,
    textStyles:   tr.textStyles,
  };

  return merged;
}
