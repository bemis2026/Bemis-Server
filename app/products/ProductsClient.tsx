"use client";
import { pickText } from "../lib/ui";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent, type CategoryMeta } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { groupVariantsByName } from "../../lib/productGroups";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import EnergyBackground from "../components/EnergyBackground";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine, RiPlugLine,
  RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
} from "react-icons/ri";
import { HiArrowLeft, HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Image from "next/image";

type SpecItem    = { label: string; value: string };
type SpecGroup   = { group: string; items: SpecItem[] };
type ProductEntry = { id: string; name: string; subtitle: string; badge: string | null; description: string; specs: SpecGroup[]; image?: string; images?: string[] };
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[]; sliderImage?: string };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox:             RiChargingPile2Line,
  portable:            RiBatteryChargeLine,
  cables:              RiFlashlightLine,
  "v2l-c2l":           RiCarLine,
  converters:          RiToolsLine,
  "charger-equipment": RiToolsFill,
  accessories:         RiPlugLine,
  "dc-units":          RiGasStationLine,
};

// ── Banner Slider ─────────────────────────────────────────────────────────────

function BannerSlider({ categories, d }: { categories: CategoryData[]; d: boolean }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = categories.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || total === 0) return;
    intervalRef.current = setInterval(next, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, next, total]);

  if (total === 0) return null;

  const cat = categories[current];
  const Icon = categoryIcons[cat.id] || RiPlugLine;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ height: "clamp(190px, 26vw, 300px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center px-8 sm:px-12 cursor-pointer overflow-hidden"
          style={{
            background: d
              ? `linear-gradient(135deg, ${cat.accent}22 0%, #0f0f12 55%, ${cat.accent}08 100%)`
              : `linear-gradient(135deg, ${cat.accent}18 0%, #f0f0f4 55%, ${cat.accent}06 100%)`,
          }}
          onClick={() => router.push(`/products/${cat.id}`)}
        >
          {/* Slider background image */}
          {cat.sliderImage && (
            <>
              <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${cat.sliderImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.75)" }} />
            </>
          )}
          {/* Left: text */}
          <div className="flex-1 min-w-0 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: `${cat.accent}14`, border: `1px solid ${cat.accent}28`, color: cat.accent }}
              >
                {cat.products?.length ?? 0} Ürün
              </span>
            </div>

            <h2
              className="font-black leading-tight mb-1 truncate"
              style={{
                fontSize: "clamp(1.25rem, 3.5vw, 2.2rem)",
                color: d ? "#f0f0f4" : "#1a1a1a",
              }}
            >
              {cat.name}
            </h2>
            <p
              className="text-sm leading-snug line-clamp-2 mb-4 max-w-md"
              style={{ color: d ? "rgba(240,240,244,0.50)" : "rgba(26,26,26,0.50)" }}
            >
              {cat.tagline}
            </p>

            <button
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:gap-2.5"
              style={{ background: cat.accent, color: "#fff" }}
            >
              Kategoriye Git <HiArrowRight size={13} />
            </button>
          </div>

          {/* Right: decorative glow */}
          <div
            className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at right center, ${cat.accent}25 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-10"
            style={{ fontSize: "clamp(80px, 14vw, 160px)", fontWeight: 900, color: cat.accent, lineHeight: 1 }}
          >
            <Icon style={{ fontSize: "clamp(80px, 14vw, 160px)", color: cat.accent, opacity: 0.15 }} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)", backdropFilter: "blur(8px)" }}
      >
        <HiChevronLeft size={16} style={{ color: d ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.70)" }} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)", backdropFilter: "blur(8px)" }}
      >
        <HiChevronRight size={16} style={{ color: d ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.70)" }} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? cat.accent : (d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)"),
            }}
          />
        ))}
      </div>

      {/* Border overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
      />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AllProductsPage({ initialCategories = [] }: { initialCategories?: CategoryData[] }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const router = useRouter();
  const { categories: catMeta, logos, products: productsContent } = useContent();
  const { lang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [loading, setLoading] = useState(initialCategories.length === 0);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const isFirstMount = useRef(true);

  useEffect(() => {
    // First render with TR + SSR data: skip the refetch (data is already there).
    // Re-merge sliderImage from catMeta in case context hydrated after initial state.
    if (isFirstMount.current && lang === "tr" && initialCategories.length > 0) {
      isFirstMount.current = false;
      setCategories(initialCategories.map((c) => ({ ...c, sliderImage: catMeta[c.id]?.sliderImage })));
      return;
    }
    isFirstMount.current = false;
    setLoading(true);
    fetch(`/api/products?lang=${lang}`)
      .then((r) => r.json())
      .then((data: CategoryData[]) => {
        const merged = data.map((cat) => ({
          ...cat,
          sliderImage: catMeta[cat.id]?.sliderImage,
        }));
        setCategories(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [catMeta, lang, initialCategories]);

  const bg           = d ? "linear-gradient(180deg, #0c0c0e 0%, #0f0f11 100%)" : "#f8f8fb";
  const surface      = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const surfaceBorder= d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary  = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted    = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,26,0.50)";
  // Ürün kartı alt-başlık + spec metni. %30 opak açık/beyaz kartta okunmuyordu
  // (kullanıcı geri bildirimi) → %55'e çıkarıldı: isimden (100%) hâlâ açık ama
  // net okunur; her iki modda geçerli.
  const textFaint    = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,26,0.55)";
  const filterBase   = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const filterBorder = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";

  const filteredCategories = activeFilter === "all"
    ? categories
    : categories.filter((c) => c.id === activeFilter);

  const totalProducts = categories.reduce((sum, c) => sum + (c.products?.length ?? 0), 0);

  return (
    <div style={{ background: bg, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <EnergyBackground />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Page header ── */}
      <div className="pt-28 pb-6 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black"
                style={{ color: textPrimary }}
              >
                {/* Keyword'lü + iki dilli H1 (eskiden sabit "Tüm Ürünler"). Ana ürün
                    sayfası "elektrikli araç şarj ürünleri" head-term'ünü hedefler. */}
                {pickText(lang, "Elektrikli Araç Şarj Ürünleri", "EV Charging Products")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm mt-1"
                style={{ color: textMuted }}
              >
                {loading ? "Yükleniyor…" : `${categories.length} kategori · ${totalProducts} ürün`}
              </motion.p>
              {productsContent?.allProductsDescription?.trim() && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-sm sm:text-base leading-relaxed mt-4 max-w-3xl whitespace-pre-line"
                  style={{ color: textMuted }}
                >
                  {productsContent.allProductsDescription}
                </motion.p>
              )}
            </div>
          </div>

          {/* ── Banner Slider ── */}
          {!loading && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <BannerSlider categories={categories} d={d} />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div
        className="sticky top-16 z-30 px-5 sm:px-6 lg:px-8 py-3"
        style={{ background: d ? "rgba(12,12,14,0.92)" : "rgba(248,248,251,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${surfaceBorder}` }}
      >
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <FilterChip
              label="Tümü"
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              count={categories.reduce((sum, c) => sum + (c.products?.length ?? 0), 0)}
              d={d} filterBase={filterBase} filterBorder={filterBorder}
              textMuted={textMuted} textPrimary={textPrimary}
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.name}
                accentDot={cat.accent}
                active={activeFilter === cat.id}
                onClick={() => setActiveFilter(cat.id)}
                count={cat.products?.length ?? 0}
                d={d} filterBase={filterBase} filterBorder={filterBorder}
                textMuted={textMuted} textPrimary={textPrimary}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Products list ── */}
      <div className="px-5 sm:px-6 lg:px-8 pb-20 pt-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          {loading ? (
            <ProductGridSkeleton count={15} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-14"
              >
                {filteredCategories.map((cat) => {
                  // Per-card fallback when a product has no image — picks
                  // an icon out of categoryIcons. Section header no longer
                  // displays this; only the missing-image placeholder.
                  const Icon = categoryIcons[cat.id] || RiPlugLine;
                  return (
                    <div key={cat.id}>
                      {/* Category header */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-base font-bold" style={{ color: textPrimary }}>{cat.name}</h2>
                          <p className="text-xs" style={{ color: textMuted }}>{cat.tagline}</p>
                        </div>
                        <button
                          onClick={() => router.push(`/products/${cat.id}`)}
                          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                          style={{ background: `${cat.accent}10`, border: `1px solid ${cat.accent}25`, color: cat.accent }}
                        >
                          Kategoriye Git <HiArrowRight size={12} />
                        </button>
                      </div>

                      <div className="mb-5" style={{ height: 1, background: surfaceBorder }} />

                      {/* Product cards — image grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                        {groupVariantsByName(cat.products ?? []).map((group, pi) => {
                          const product = group.primary;
                          const variantCount = group.variants.length;
                          return (
                          <motion.div
                            key={group.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: pi * 0.05 }}
                            onClick={() => router.push(`/products/${cat.id}/${product.id}`)}
                            className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-200"
                            style={{
                              // Frosted glass: kart yarı saydam görünür ama
                              // backdrop-filter ile arkadaki energy streak'ler
                              // blurlanıp gizlenir — saydam ama arka plan
                              // görünmüyor.
                              background: d ? "rgba(20,20,22,0.55)" : "rgba(255,255,255,0.55)",
                              backdropFilter: "blur(18px) saturate(140%)",
                              WebkitBackdropFilter: "blur(18px) saturate(140%)",
                              border: `1px solid ${surfaceBorder}`,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.accent}45`;
                              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 28px ${cat.accent}12`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLDivElement).style.borderColor = surfaceBorder;
                              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                            }}
                          >
                            {/* Image area */}
                            <div
                              className="relative overflow-hidden"
                              style={{
                                aspectRatio: "1 / 1",
                                background: d ? `linear-gradient(150deg, ${cat.accent}16 0%, transparent 55%), #dbdee3` : `linear-gradient(150deg, ${cat.accent}0f 0%, transparent 55%), #f3f4f6`,
                              }}
                            >
                              {(product.images?.[0] ?? product.image) ? (
                                <Image
                                  src={(product.images?.[0] ?? product.image) as string}
                                  alt={product.name}
                                  fill
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                                  className="object-contain p-1 transition-transform duration-350"
                                  loading="lazy"
                                  quality={88}
                                />
                              ) : (
                                // Larger discus + icon for the no-image
                                // fallback so a missing product photo
                                // still fills the card the way an actual
                                // photo would.
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div
                                    className="rounded-full flex items-center justify-center"
                                    style={{
                                      width: 86, height: 86,
                                      background: `radial-gradient(circle at 50% 40%, ${cat.accent}22 0%, transparent 70%)`,
                                      border: `1px solid ${cat.accent}33`,
                                    }}
                                  >
                                    <Icon style={{ fontSize: 44, color: d ? `${cat.accent}99` : cat.accent, opacity: 0.75 }} />
                                  </div>
                                </div>
                              )}

                              {variantCount > 1 ? (
                                <div
                                  className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    background: `${cat.accent}22`,
                                    border: `1px solid ${cat.accent}40`,
                                    color: cat.accent,
                                  }}
                                >
                                  {variantCount} versiyon
                                </div>
                              ) : product.badge && (
                                <div
                                  className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    background: `${cat.accent}22`,
                                    border: `1px solid ${cat.accent}40`,
                                    color: cat.accent,
                                  }}
                                >
                                  {product.badge}
                                </div>
                              )}

                              {/* Bottom fade */}
                              <div
                                className="absolute bottom-0 left-0 right-0 h-10"
                                style={{
                                  background: d ? "linear-gradient(to top, rgba(219,222,227,0.92) 0%, transparent 100%)" : "linear-gradient(to top, rgba(243,244,246,0.92) 0%, transparent 100%)",
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="px-3 py-3">
                              <p className="font-bold text-xs leading-tight mb-0.5" style={{ color: textPrimary }}>
                                {product.name}
                              </p>
                              {variantCount > 1 ? (
                                <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>
                                  {group.variants.map(v => v.subtitle).filter(Boolean).join(" · ") || `${variantCount} farklı versiyon`}
                                </p>
                              ) : product.subtitle && (
                                <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>
                                  {product.subtitle}
                                </p>
                              )}

                              {/* Key specs */}
                              {product.specs?.[0]?.items?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {product.specs[0].items.slice(0, 2).map((s, si) => (
                                    <span
                                      key={si}
                                      className="text-[9px] px-1.5 py-0.5 rounded-md font-medium"
                                      style={{
                                        background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                                        color: textFaint,
                                      }}
                                    >
                                      {s.value}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-end">
                                <span
                                  className="text-[10px] font-semibold transition-transform duration-200 group-hover:translate-x-0.5"
                                  style={{ color: cat.accent }}
                                >
                                  Detaylar →
                                </span>
                              </div>
                            </div>
                          </motion.div>
                          );
                        })}
                      </div>

                      {/* Mobile category link */}
                      <button
                        onClick={() => router.push(`/products/${cat.id}`)}
                        className="sm:hidden mt-4 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg"
                        style={{ background: `${cat.accent}10`, border: `1px solid ${cat.accent}25`, color: cat.accent }}
                      >
                        {cat.name} — Tümünü Gör <HiArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <ContactBar />
      </div>
    </div>
  );
}

// ── FilterChip ────────────────────────────────────────────────────────────────

function FilterChip({
  label, accentDot, active, onClick, count, d, filterBase, filterBorder, textMuted, textPrimary,
}: {
  label: string; accentDot?: string; active: boolean; onClick: () => void; count?: number;
  d: boolean; filterBase: string; filterBorder: string; textMuted: string; textPrimary: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-200 flex-shrink-0"
      style={{
        background: active ? (d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)") : filterBase,
        border: active
          ? (d ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.22)")
          : `1px solid ${filterBorder}`,
        color: active ? textPrimary : textMuted,
      }}
    >
      {accentDot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: accentDot, boxShadow: `0 0 6px ${accentDot}66` }}
          aria-hidden
        />
      )}
      {label}
      {typeof count === "number" && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
          style={{
            background: active ? (d ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.10)") : (d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"),
            color: active ? textPrimary : textMuted,
            minWidth: 18, textAlign: "center",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
