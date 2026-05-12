"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useContent } from "../../context/ContentContext";
import { useLanguage } from "../../context/LanguageContext";
import { groupVariantsByName } from "../../../lib/productGroups";
import Navbar from "../../components/Navbar";
import ContactBar from "../../components/ContactBar";
import EnergyBackground from "../../components/EnergyBackground";
import { useState, useEffect, useRef } from "react";
import SearchOverlay from "../../components/SearchOverlay";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine,
  RiPlugLine, RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";
import Image from "next/image";
import { ProductGridSkeleton } from "../../components/ProductCardSkeleton";

type SpecItem   = { label: string; value: string };
type SpecGroup  = { group: string; items: SpecItem[] };
type ProductEntry = {
  id: string; name: string; subtitle: string; badge: string | null;
  description: string; specs: SpecGroup[]; image?: string; images?: string[];
};
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox: RiChargingPile2Line, portable: RiBatteryChargeLine,
  cables: RiFlashlightLine, "v2l-c2l": RiCarLine,
  converters: RiToolsLine, "charger-equipment": RiToolsFill,
  accessories: RiPlugLine, "dc-units": RiGasStationLine,
};

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProductCategoryPage({ initialCategory = null }: { initialCategory?: CategoryData | null }) {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { categories } = useContent();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen]     = useState(false);
  const [category, setCategory]         = useState<CategoryData | null>(initialCategory);
  const [loading, setLoading]           = useState(initialCategory === null);
  const id = typeof params.id === "string" ? params.id : "";
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!id) return;
    if (isFirstMount.current && lang === "tr" && initialCategory) {
      isFirstMount.current = false;
      return;
    }
    isFirstMount.current = false;
    setLoading(true);
    fetch(`/api/products?lang=${lang}`)
      .then(r => r.json())
      .then((data: CategoryData[]) => setCategory(data.find(c => c.id === id) ?? null))
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [id, lang, initialCategory]);

  const bg            = d ? "#0c0c0e" : "#f8f8fb";
  // Solid surface in dark mode so the new background streaks behind
  // the wrapper don't bleed through every listing card.
  const surface       = d ? "#141416" : "#ffffff";
  const surfaceBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary   = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted     = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint     = d ? "rgba(240,240,244,0.30)" : "rgba(26,26,46,0.30)";
  const groupHeaderBg = d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  if (loading) return (
    <div style={{ background: bg, minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <EnergyBackground />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Mirror the real category page chrome (hero strip + grid)
          but with placeholder geometry so the content swap doesn't
          cause a layout shift when data lands. */}
      <div className="pt-24 pb-8 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-stretch gap-4 mb-2">
            <div className="flex-shrink-0 rounded-full w-1" style={{ background: "rgba(255,255,255,0.10)" }} />
            <div className="space-y-2 flex-1">
              <div className="h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)", width: 140 }} />
              <div className="h-6 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)", width: 220 }} />
              <div className="h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)", width: 320 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10 w-full">
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  );

  if (!category) return (
    <div style={{ background: bg, minHeight: "100vh", color: textPrimary }} className="flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4" style={{ color: textMuted }}>Ürün kategorisi bulunamadı</p>
        <button onClick={() => router.push("/")} className="text-sm font-medium underline" style={{ color: textMuted }}>
          Ana sayfaya dön
        </button>
      </div>
    </div>
  );

  const Icon = categoryIcons[id] || RiPlugLine;
  const accent = category.accent;
  const categoryDescription = categories?.[id]?.description?.trim() ?? "";

  return (
    <div style={{ background: bg, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <EnergyBackground />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Category hero */}
      <div className="pt-24 pb-8 px-5 sm:px-6 lg:px-8"
        style={{ background: d ? `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}10 0%, transparent 70%)` : `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}08 0%, transparent 70%)` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-stretch gap-4 mb-2">
            {/* Accent stripe — replaces the per-category icon block.
                The icons that lived here used to clash with the actual
                category meaning (e.g. flashlight on a cables page);
                a tall colour stripe keeps the visual rhythm without
                pretending to symbolise the category. */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="flex-shrink-0 rounded-full origin-top"
              style={{ width: 4, background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)` }}
              aria-hidden
            />
            <div>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
                className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: accent }}>
                Ürün Kategorisi · {category.products?.length ?? 0} Ürün
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl font-bold" style={{ color: textPrimary }}>
                {category.name}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                className="text-sm mt-0.5" style={{ color: textMuted }}>
                {category.tagline}
              </motion.p>
            </div>
          </div>

          {(() => {
            // Description + side image — when an image is uploaded for
            // the category, the hero gets a 2-column flow on lg+ so the
            // empty space next to short description copy gets filled.
            // No image → text alone, capped to 3xl as before.
            const descImage = categories?.[id]?.descriptionImage?.trim() ?? "";
            if (!categoryDescription && !descImage) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-4 grid gap-5 items-center"
                style={{ gridTemplateColumns: descImage ? "minmax(0, 3fr) minmax(0, 2fr)" : "1fr" }}
              >
                {categoryDescription && (
                  <p
                    className="text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-3xl"
                    style={{ color: textMuted }}
                  >
                    {categoryDescription}
                  </p>
                )}
                {descImage && (
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{ aspectRatio: "4/3", border: `1px solid ${surfaceBorder}` }}
                  >
                    <Image
                      src={descImage}
                      alt={category.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </motion.div>
            );
          })()}

        </div>
      </div>

      {/* Product grid — uniform 5-col density across every category so
          a smaller catalog (AC Mobile Chargers, dc-units) renders the
          same compact tile size as a dense category (cables, v2l).
          Empty slots after the last card read as expected catalog
          rhythm, not "broken layout". */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {groupVariantsByName(category.products ?? []).map((group, pi) => {
            const product = group.primary;
            const variantCount = group.variants.length;
            return (
              <motion.div key={group.key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: pi * 0.06 }}
                className="group rounded-2xl overflow-hidden transition-all duration-250 flex flex-col"
                style={{
                  background: surface,
                  border: `1px solid ${surfaceBorder}`,
                  cursor: "pointer",
                  // Pin a minimum card height so categories with short
                  // single-variant subtitles (portable: "Tek Fazlı ·
                  // 2,3 - 3,7 kW") still render at the same vertical
                  // size as categories with longer joined-variant
                  // subtitles (wallbox: "5m. Kablolu · Pano Prizli").
                  // Otherwise the grid lays them out at different
                  // heights across categories and the operator reads
                  // it as "AC Mobile cards look different".
                  minHeight: 320,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}45`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 28px ${accent}12`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = surfaceBorder;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Product image / icon */}
                <div className="relative overflow-hidden" onClick={() => router.push(`/products/${id}/${product.id}`)}
                  style={{ height: 180, background: d ? `linear-gradient(145deg, ${accent}18 0%, transparent 100%), #1c1c1f` : `linear-gradient(145deg, ${accent}14 0%, transparent 100%), #fafafa` }}>
                  {(product.images?.[0] ?? product.image) ? (
                    <Image src={(product.images?.[0] ?? product.image) as string} alt={product.name}
                      fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                      className="object-contain p-1 transition-transform duration-350 group-hover:scale-105"
                      loading="lazy" quality={88} />
                  ) : (
                    // No-image fallback fills the frame the way an actual
                    // product photo does — large icon centered inside an
                    // accented disc — so a product that's missing an
                    // upload doesn't look "broken / smaller" next to its
                    // image-filled siblings.
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: 110, height: 110,
                          background: `radial-gradient(circle at 50% 40%, ${accent}22 0%, transparent 70%)`,
                          border: `1px solid ${accent}33`,
                        }}
                      >
                        <Icon style={{ fontSize: 56, color: d ? `${accent}99` : accent, opacity: 0.75 }} />
                      </div>
                    </div>
                  )}
                  {variantCount > 1 ? (
                    <div className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${accent}22`, border: `1px solid ${accent}40`, color: d ? "rgba(255,255,255,0.85)" : accent }}>
                      {variantCount} versiyon
                    </div>
                  ) : product.badge && (
                    <div className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${accent}22`, border: `1px solid ${accent}40`, color: d ? "rgba(255,255,255,0.75)" : accent }}>
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-10"
                    style={{ background: d ? "linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 100%)" : "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)" }} />
                </div>

                {/* Info */}
                <div className="px-3 py-3 flex flex-col flex-1" onClick={() => router.push(`/products/${id}/${product.id}`)}>
                  <p className="font-bold text-xs leading-tight mb-0.5" style={{ color: textPrimary }}>{product.name}</p>
                  {variantCount > 1 ? (
                    <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>
                      {group.variants.map(v => v.subtitle).filter(Boolean).join(" · ") || `${variantCount} farklı versiyon`}
                    </p>
                  ) : product.subtitle && (
                    <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>{product.subtitle}</p>
                  )}
                  {product.specs?.[0]?.items?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.specs[0].items.slice(0, 2).map((s, si) => (
                        <span key={si} className="text-[9px] px-1.5 py-0.5 rounded-md font-medium"
                          style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textFaint }}>
                          {s.value}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-end mt-auto">
                    <span className="text-[10px] font-semibold" style={{ color: accent }}>Detaylar →</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Push ContactBar to the bottom of the flex column on short
          pages (e.g. a one-row category like dc-units), instead of
          leaving a fat slab of empty wrapper bg below it. */}
      <div style={{ marginTop: "auto" }}>
        <ContactBar />
      </div>
    </div>
  );
}
