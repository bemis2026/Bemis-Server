"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine, RiPlugLine,
  RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
} from "react-icons/ri";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import Image from "next/image";

type SpecItem   = { label: string; value: string };
type SpecGroup  = { group: string; items: SpecItem[] };
type ProductEntry = { id: string; name: string; subtitle: string; badge: string | null; description: string; specs: SpecGroup[] };
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox:            RiChargingPile2Line,
  portable:           RiBatteryChargeLine,
  cables:             RiFlashlightLine,
  "v2l-c2l":          RiCarLine,
  converters:         RiToolsLine,
  "charger-equipment":RiToolsFill,
  accessories:        RiPlugLine,
  "dc-units":         RiGasStationLine,
};

export default function AllProductsPage() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: CategoryData[]) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      <div className="pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push("/#products")}
            className="flex items-center gap-2 mb-8 group"
            style={{ color: textMuted }}
          >
            <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Ana Sayfa</span>
          </motion.button>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 mb-3"
              >
                <Image src="/logo-white.png" alt="Bemis E-V Charge" width={160} height={48}
                  className="h-10 w-auto object-contain"
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
                className="text-base mt-2"
                style={{ color: textMuted }}
              >
                {loading ? "Yükleniyor…" : `${categories.length} kategori · ${totalProducts} ürün`}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="sticky top-16 z-30 px-5 sm:px-6 lg:px-8 pb-4"
        style={{ background: d ? "rgba(12,12,14,0.92)" : "rgba(248,248,251,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <FilterChip
              label="Tümü"
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              d={d}
              filterBase={filterBase}
              filterBorder={filterBorder}
              textMuted={textMuted}
              textPrimary={textPrimary}
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
                  d={d}
                  filterBase={filterBase}
                  filterBorder={filterBorder}
                  textMuted={textMuted}
                  textPrimary={textPrimary}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Products list ── */}
      <div className="px-5 sm:px-6 lg:px-8 pb-20">
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
                className="space-y-16"
              >
                {filteredCategories.map((cat) => {
                  const Icon = categoryIcons[cat.id] || RiPlugLine;
                  return (
                    <div key={cat.id}>
                      {/* Category header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center rounded-xl flex-shrink-0"
                            style={{ width: 40, height: 40, background: `${cat.accent}16`, border: `1px solid ${cat.accent}28` }}
                          >
                            <Icon style={{ fontSize: 20, color: cat.accent }} />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold" style={{ color: textPrimary }}>{cat.name}</h2>
                            <p className="text-xs" style={{ color: textMuted }}>{cat.tagline}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/products/${cat.id}`)}
                          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                          style={{
                            background: `${cat.accent}10`,
                            border: `1px solid ${cat.accent}25`,
                            color: cat.accent,
                          }}
                        >
                          Kategoriye Git <HiArrowRight />
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="mb-6" style={{ height: 1, background: surfaceBorder }} />

                      {/* Product cards */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(cat.products ?? []).map((product, pi) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: pi * 0.06 }}
                            onClick={() => router.push(`/products/${cat.id}`)}
                            className="rounded-2xl p-5 cursor-pointer transition-all duration-200 group"
                            style={{
                              background: surface,
                              border: `1px solid ${surfaceBorder}`,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.accent}40`;
                              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 32px ${cat.accent}10`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLDivElement).style.borderColor = surfaceBorder;
                              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                            }}
                          >
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm leading-tight" style={{ color: textPrimary }}>
                                  {product.name}
                                </p>
                                {product.subtitle && (
                                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>{product.subtitle}</p>
                                )}
                              </div>
                              {product.badge && (
                                <span
                                  className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    background: `${cat.accent}14`,
                                    border: `1px solid ${cat.accent}28`,
                                    color: cat.accent,
                                  }}
                                >
                                  {product.badge}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: textFaint }}>
                              {product.description}
                            </p>

                            {/* Key specs (first group, first 3 items) */}
                            {product.specs?.[0]?.items?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {product.specs[0].items.slice(0, 3).map((spec, si) => (
                                  <span
                                    key={si}
                                    className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                                    style={{
                                      background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                      border: d ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)",
                                      color: textMuted,
                                    }}
                                  >
                                    {spec.label}: {spec.value}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3"
                              style={{ borderTop: `1px solid ${surfaceBorder}` }}>
                              <span className="text-[10px] font-semibold" style={{ color: textFaint }}>
                                {cat.name}
                              </span>
                              <span
                                className="flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-0.5"
                                style={{ color: cat.accent }}
                              >
                                İncele <HiArrowRight size={12} />
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Mobile "go to category" */}
                      <button
                        onClick={() => router.push(`/products/${cat.id}`)}
                        className="sm:hidden mt-4 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg"
                        style={{
                          background: `${cat.accent}10`,
                          border: `1px solid ${cat.accent}25`,
                          color: cat.accent,
                        }}
                      >
                        {cat.name} — Tümünü Gör <HiArrowRight />
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

function FilterChip({
  label, icon: Icon, active, onClick, d, filterBase, filterBorder, textMuted, textPrimary,
}: {
  label: string;
  icon?: React.ElementType;
  active: boolean;
  onClick: () => void;
  d: boolean;
  filterBase: string;
  filterBorder: string;
  textMuted: string;
  textPrimary: string;
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
