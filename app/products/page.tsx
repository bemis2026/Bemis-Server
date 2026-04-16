"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent, type CategoryMeta } from "../context/ContentContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
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
      style={{ height: "clamp(160px, 22vw, 240px)" }}
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
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 36, height: 36, background: `${cat.accent}20`, border: `1px solid ${cat.accent}35` }}
              >
                <Icon style={{ fontSize: 18, color: cat.accent }} />
              </div>
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

export default function AllProductsPage() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const router = useRouter();
  const { categories: catMeta, logos } = useContent();
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/products")
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
  }, [catMeta]);

  const bg           = d ? "linear-gradient(180deg, #0c0c0e 0%, #0f0f11 100%)" : "#f8f8fb";
  const surface      = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const surfaceBorder= d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary  = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted    = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,26,0.50)";
  const textFaint    = d ? "rgba(240,240,244,0.30)" : "rgba(26,26,26,0.30)";
  const filterBase   = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const filterBorder = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";

  const filteredCategories = activeFilter === "all"
    ? categories
    : categories.filter((c) => c.id === activeFilter);

  const totalProducts = categories.reduce((sum, c) => sum + (c.products?.length ?? 0), 0);

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Page header ── */}
      <div className="pt-28 pb-6 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push("/#products")}
            className="flex items-center gap-2 mb-6 group"
            style={{ color: textMuted }}
          >
            <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Ana Sayfa</span>
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 mb-2"
              >
                <Image src={d ? (logos?.dark || "/logo-white.png") : (logos?.light || "/logo-black.png")} alt="Bemis E-V Charge" width={160} height={48}
                  className="h-9 w-auto object-contain"
                  style={{ filter: d ? "none" : "invert(1)" }}
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black"
                style={{ color: textPrimary }}
              >
                Tüm Ürünler
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
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <FilterChip
              label="Tümü"
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              d={d} filterBase={filterBase} filterBorder={filterBorder}
              textMuted={textMuted} textPrimary={textPrimary}
            />
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id] || RiPlugLine;
              return (
                <FilterChip
                  key={cat.id}
                  label={cat.name}
                  icon={Icon}
                  active={activeFilter === cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  d={d} filterBase={filterBase} filterBorder={filterBorder}
                  textMuted={textMuted} textPrimary={textPrimary}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Products list ── */}
      <div className="px-5 sm:px-6 lg:px-8 pb-20 pt-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
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
                  const Icon = categoryIcons[cat.id] || RiPlugLine;
                  return (
                    <div key={cat.id}>
                      {/* Category header */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center rounded-xl flex-shrink-0"
                            style={{ width: 40, height: 40, background: `${cat.accent}16`, border: `1px solid ${cat.accent}28` }}
                          >
                            <Icon style={{ fontSize: 20, color: cat.accent }} />
                          </div>
                          <div>
                            <h2 className="text-base font-bold" style={{ color: textPrimary }}>{cat.name}</h2>
                            <p className="text-xs" style={{ color: textMuted }}>{cat.tagline}</p>
                          </div>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {(cat.products ?? []).map((product, pi) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: pi * 0.05 }}
                            onClick={() => router.push(`/products/${cat.id}/${product.id}`)}
                            className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-200"
                            style={{ background: surface, border: `1px solid ${surfaceBorder}` }}
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
                                height: 140,
                                background: d
                                  ? `linear-gradient(145deg, ${cat.accent}0a 0%, #111111 100%)`
                                  : `linear-gradient(145deg, ${cat.accent}0d 0%, #f4f4f4 100%)`,
                              }}
                            >
                              {(product.images?.[0] ?? product.image) ? (
                                <img
                                  src={product.images?.[0] ?? product.image}
                                  alt={product.name}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
                                  style={{ opacity: 0.88 }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Icon
                                    style={{
                                      fontSize: 42,
                                      color: d ? "rgba(255,255,255,0.15)" : `${cat.accent}45`,
                                    }}
                                  />
                                </div>
                              )}

                              {/* Badge */}
                              {product.badge && (
                                <div
                                  className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    background: `${cat.accent}22`,
                                    border: `1px solid ${cat.accent}40`,
                                    color: d ? "rgba(255,255,255,0.80)" : cat.accent,
                                  }}
                                >
                                  {product.badge}
                                </div>
                              )}

                              {/* Bottom fade */}
                              <div
                                className="absolute bottom-0 left-0 right-0 h-10"
                                style={{
                                  background: d
                                    ? "linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 100%)"
                                    : "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)",
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="px-3 py-3">
                              <p className="font-bold text-xs leading-tight mb-0.5" style={{ color: textPrimary }}>
                                {product.name}
                              </p>
                              {product.subtitle && (
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
                        ))}
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

      <ContactBar />
    </div>
  );
}

// ── FilterChip ────────────────────────────────────────────────────────────────

function FilterChip({
  label, icon: Icon, active, onClick, d, filterBase, filterBorder, textMuted, textPrimary,
}: {
  label: string; icon?: React.ElementType; active: boolean; onClick: () => void;
  d: boolean; filterBase: string; filterBorder: string; textMuted: string; textPrimary: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-200 flex-shrink-0"
      style={{
        background: active ? (d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)") : filterBase,
        border: active
          ? (d ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.22)")
          : `1px solid ${filterBorder}`,
        color: active ? textPrimary : textMuted,
      }}
    >
      {Icon && <Icon style={{ fontSize: 13 }} />}
      {label}
    </button>
  );
}
