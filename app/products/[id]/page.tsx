"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import ContactBar from "../../components/ContactBar";
import { useState, useEffect } from "react";
import SearchOverlay from "../../components/SearchOverlay";
import {
  RiChargingPile2Line,
  RiBatteryChargeLine,
  RiFlashlightLine,
  RiPlugLine,
  RiCarLine,
  RiToolsLine,
  RiToolsFill,
  RiGasStationLine,
} from "react-icons/ri";
import { HiArrowLeft, HiPhone, HiMail } from "react-icons/hi";

type SpecItem = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductEntry = {
  id: string; name: string; subtitle: string; badge: string | null;
  description: string; specs: SpecGroup[]; image?: string;
};
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox: RiChargingPile2Line,
  portable: RiBatteryChargeLine,
  cables: RiFlashlightLine,
  "v2l-c2l": RiCarLine,
  converters: RiToolsLine,
  "charger-equipment": RiToolsFill,
  accessories: RiPlugLine,
  "dc-units": RiGasStationLine,
};

export default function ProductCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!id) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: CategoryData[]) => {
        const found = data.find((c) => c.id === id);
        setCategory(found ?? null);
      })
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [id]);

  const bg           = d ? "#0c0c0e" : "#f8f8fb";
  const surface      = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const surfaceBorder= d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary  = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted    = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint    = d ? "rgba(240,240,244,0.30)" : "rgba(26,26,46,0.30)";
  const divider      = d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const groupHeaderBg= d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ background: bg, minHeight: "100vh", color: textPrimary }} className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: textMuted }}>Ürün kategorisi bulunamadı</p>
          <button onClick={() => router.push("/")} className="text-sm font-medium underline" style={{ color: textMuted }}>
            Ana sayfaya dön
          </button>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[id] || RiPlugLine;

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Category hero ── */}
      <div
        className="pt-24 pb-8 px-5 sm:px-6 lg:px-8"
        style={{
          background: d
            ? `radial-gradient(ellipse 70% 60% at 50% 0%, ${category.accent}10 0%, transparent 70%)`
            : `radial-gradient(ellipse 70% 60% at 50% 0%, ${category.accent}08 0%, transparent 70%)`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 group"
            style={{ color: textMuted }}
          >
            <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Ürünler</span>
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-shrink-0 flex items-center justify-center rounded-2xl"
              style={{ width: 56, height: 56, background: `${category.accent}18`, border: `1px solid ${category.accent}30` }}
            >
              <Icon style={{ fontSize: 28, color: category.accent }} />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: category.accent }}
              >
                Ürün Kategorisi · {category.products?.length ?? 0} Ürün
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: textPrimary }}
              >
                {category.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="text-sm mt-0.5"
                style={{ color: textMuted }}
              >
                {category.tagline}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product thumbnail grid ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {(category.products ?? []).map((product, pi) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: pi * 0.06 }}
              onClick={() => router.push(`/products/${id}/${product.id}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-250"
              style={{ background: surface, border: `1px solid ${surfaceBorder}` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${category.accent}45`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 28px ${category.accent}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = surfaceBorder;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Product image / icon area */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: 148,
                  background: d
                    ? `linear-gradient(145deg, ${category.accent}0a 0%, #111111 100%)`
                    : `linear-gradient(145deg, ${category.accent}0d 0%, #f4f4f4 100%)`,
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
                    style={{ opacity: 0.88 }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      style={{
                        fontSize: 44,
                        color: d ? "rgba(255,255,255,0.18)" : `${category.accent}50`,
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                )}

                {/* Badge */}
                {product.badge && (
                  <div
                    className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${category.accent}22`,
                      border: `1px solid ${category.accent}40`,
                      color: d ? "rgba(255,255,255,0.75)" : category.accent,
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Bottom gradient */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-10"
                  style={{
                    background: d
                      ? "linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 100%)"
                      : "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Info area */}
              <div className="px-3 py-3">
                <p className="font-bold text-xs leading-tight mb-0.5" style={{ color: textPrimary }}>
                  {product.name}
                </p>
                {product.subtitle && (
                  <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>
                    {product.subtitle}
                  </p>
                )}

                {/* 2 key specs */}
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
                    className="text-[10px] font-semibold"
                    style={{ color: category.accent }}
                  >
                    Detaylar →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Contact CTA ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: surface, border: `1px solid ${surfaceBorder}` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${category.accent}18`, border: `1px solid ${category.accent}30` }}
          >
            <HiPhone style={{ color: category.accent, fontSize: 18 }} />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: textPrimary }}>Teknik Bilgi veya Fiyat Teklifi Alın</h3>
          <p className="text-sm mb-5" style={{ color: textMuted }}>Uzman ekibimiz size en uygun çözümü sunar.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/#contact")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: category.accent, color: "#fff" }}
            >
              <HiMail size={15} /> İletişime Geç
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: groupHeaderBg, border: `1px solid ${surfaceBorder}`, color: textMuted }}
            >
              <HiArrowLeft size={15} /> Geri Dön
            </button>
          </div>
        </motion.div>
      </div>

      <ContactBar />
    </div>
  );
}
