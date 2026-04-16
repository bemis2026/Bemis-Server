"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import Navbar from "../../../components/Navbar";
import ContactBar from "../../../components/ContactBar";
import SearchOverlay from "../../../components/SearchOverlay";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine,
  RiPlugLine, RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
} from "react-icons/ri";
import { HiMail, HiPhone, HiArrowRight, HiDownload } from "react-icons/hi";
import { trackEvent } from "../../../components/GoogleAnalytics";

type SpecItem  = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductEntry = {
  id: string; name: string; subtitle: string; badge: string | null;
  description: string; specs: SpecGroup[]; image?: string; images?: string[]; pdf?: string;
};
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox: RiChargingPile2Line, portable: RiBatteryChargeLine,
  cables: RiFlashlightLine, "v2l-c2l": RiCarLine,
  converters: RiToolsLine, "charger-equipment": RiToolsFill,
  accessories: RiPlugLine, "dc-units": RiGasStationLine,
};

export default function ProductDetailPage() {
  const params    = useParams();
  const router    = useRouter();
  const { theme } = useTheme();
  const d         = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory]     = useState<CategoryData | null>(null);
  const [product,  setProduct]      = useState<ProductEntry | null>(null);
  const [loading,  setLoading]      = useState(true);
  const [activeImg, setActiveImg]   = useState(0);
  const [allCategories, setAllCategories] = useState<CategoryData[]>([]);

  const categoryId = typeof params.id        === "string" ? params.id        : "";
  const productId  = typeof params.productId === "string" ? params.productId : "";

  useEffect(() => {
    if (!categoryId || !productId) return;
    fetch("/api/products")
      .then(r => r.json())
      .then((data: CategoryData[]) => {
        const cat  = data.find(c => c.id === categoryId) ?? null;
        const prod = cat?.products.find(p => p.id === productId) ?? null;
        setCategory(cat);
        setProduct(prod);
        setAllCategories(data);
        if (prod && cat) {
          trackEvent("view_item", {
            item_id: prod.id,
            item_name: prod.name,
            item_category: cat.name,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId, productId]);

  const bg           = d ? "#0c0c0e" : "#f8f8fb";
  const surface      = d ? "#141416" : "#ffffff";
  const border       = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider      = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const groupHdr     = d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
  const textPrimary  = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted    = d ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.52)";
  const textFaint    = d ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)";
  const accent       = category?.accent ?? "#3B82F6";
  const Icon         = categoryIcons[categoryId] ?? RiChargingPile2Line;

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />



      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-10">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accent}50`, borderTopColor: "transparent" }} />
          </div>
        )}

        {!loading && !product && (
          <div className="text-center py-32">
            <p className="text-lg font-bold mb-2" style={{ color: textPrimary }}>Ürün bulunamadı</p>
            <button onClick={() => router.push("/products")} className="text-sm underline" style={{ color: accent }}>
              Tüm ürünlere dön
            </button>
          </div>
        )}

        {!loading && product && category && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                style={{ width: 56, height: 56, background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon style={{ fontSize: 26, color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black" style={{ color: textPrimary }}>
                    {product.name}
                  </h1>
                  {product.badge && (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                {product.subtitle && (
                  <p className="text-sm" style={{ color: textFaint }}>{product.subtitle}</p>
                )}
                <p className="text-xs mt-1 font-medium" style={{ color: accent }}>{category.name}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">

              {/* Left — image gallery + description */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {/* Image gallery */}
                {(() => {
                  const imgs = product.images ?? (product.image ? [product.image] : []);
                  const clampedIdx = Math.min(activeImg, imgs.length - 1);
                  if (imgs.length === 0) return (
                    <div
                      className="rounded-2xl flex items-center justify-center"
                      style={{
                        height: 220,
                        background: d
                          ? `linear-gradient(145deg, ${accent}14 0%, #111 100%)`
                          : `linear-gradient(145deg, ${accent}10 0%, #f4f4f4 100%)`,
                        border: `1px solid ${accent}22`,
                      }}
                    >
                      <Icon style={{ fontSize: 64, color: accent, opacity: 0.35 }} />
                    </div>
                  );
                  return (
                    <div className="flex flex-col gap-2">
                      {/* Main image */}
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: `1px solid ${border}`, background: surface }}
                      >
                        <img
                          key={clampedIdx}
                          src={imgs[clampedIdx]}
                          alt={`${product.name} ${clampedIdx + 1}`}
                          className="w-full object-cover transition-opacity duration-200"
                          style={{ maxHeight: 280, minHeight: 180 }}
                        />
                      </div>
                      {/* Thumbnails (only when 2+ images) */}
                      {imgs.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-0.5">
                          {imgs.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImg(i)}
                              className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150"
                              style={{
                                width: 60, height: 48,
                                border: i === clampedIdx
                                  ? `2px solid ${accent}`
                                  : `2px solid ${border}`,
                                opacity: i === clampedIdx ? 1 : 0.55,
                              }}
                            >
                              <img src={src} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Description */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: accent }}>
                    Ürün Hakkında
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                    {product.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => router.push("/#contact")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: accent, color: "#fff" }}
                  >
                    <HiMail size={15} /> Fiyat Teklifi Al
                  </button>
                  <button
                    onClick={() => router.push("/#contact")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                  >
                    <HiPhone size={14} /> Teknik Destek
                  </button>
                  {product.pdf && (
                    <a
                      href={product.pdf}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textMuted, border: `1px solid ${border}` }}
                    >
                      <HiDownload size={14} /> PDF Katalog İndir
                    </a>
                  )}
                </div>
              </div>

              {/* Right — specs */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <h2 className="text-base font-bold" style={{ color: textPrimary }}>Teknik Özellikler</h2>
                {product.specs.map((group, gi) => (
                  <motion.div
                    key={gi}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: gi * 0.07 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${border}` }}
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-2"
                      style={{ background: groupHdr, borderBottom: `1px solid ${divider}` }}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent }} />
                      <span className="text-xs font-bold" style={{ color: textPrimary }}>{group.group}</span>
                    </div>
                    {group.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="px-4 py-3 flex items-center justify-between gap-4"
                        style={{ borderBottom: ii < group.items.length - 1 ? `1px solid ${divider}` : "none" }}
                      >
                        <span className="text-sm" style={{ color: textFaint }}>{item.label}</span>
                        <span className="text-sm font-semibold text-right" style={{ color: textMuted }}>{item.value}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </div>

      {/* ── Recommended products ── */}
      {!loading && product && category && (() => {
        // Same-category products (excluding current), then fill with other categories
        const sameCat = (category.products ?? []).filter(p => p.id !== productId);
        const otherCatProducts: Array<{ cat: CategoryData; prod: ProductEntry }> = [];
        for (const c of allCategories) {
          if (c.id === categoryId) continue;
          for (const p of c.products ?? []) otherCatProducts.push({ cat: c, prod: p });
        }
        const recommended: Array<{ cat: CategoryData; prod: ProductEntry }> = [
          ...sameCat.slice(0, 4).map(p => ({ cat: category, prod: p })),
          ...otherCatProducts.slice(0, Math.max(0, 4 - sameCat.length)),
        ].slice(0, 4);
        if (recommended.length === 0) return null;
        return (
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: textPrimary }}>Önerilen Diğer Ürünler</h2>
              <button
                onClick={() => router.push(`/products/${categoryId}`)}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: accent }}
              >
                Tümünü Gör <HiArrowRight size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recommended.map(({ cat, prod }, i) => {
                const CatIcon = categoryIcons[cat.id] ?? RiPlugLine;
                const imgs = prod.images ?? (prod.image ? [prod.image] : []);
                return (
                  <motion.div
                    key={`${cat.id}-${prod.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    onClick={() => router.push(`/products/${cat.id}/${prod.id}`)}
                    className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
                    style={{ background: surface, border: `1px solid ${border}` }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.accent}50`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${cat.accent}14`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = border;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: 110,
                        background: d
                          ? `linear-gradient(145deg, ${cat.accent}0e 0%, #111 100%)`
                          : `linear-gradient(145deg, ${cat.accent}0d 0%, #f4f4f4 100%)`,
                      }}
                    >
                      {imgs[0] ? (
                        <img
                          src={imgs[0]}
                          alt={prod.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{ opacity: 0.88 }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CatIcon style={{ fontSize: 36, color: d ? "rgba(255,255,255,0.15)" : `${cat.accent}45` }} />
                        </div>
                      )}
                      {prod.badge && (
                        <div
                          className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${cat.accent}22`, border: `1px solid ${cat.accent}40`, color: d ? "rgba(255,255,255,0.75)" : cat.accent }}
                        >
                          {prod.badge}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: d ? "linear-gradient(to top, rgba(20,20,22,0.9) 0%, transparent 100%)" : "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)" }} />
                    </div>
                    {/* Info */}
                    <div className="px-3 py-2.5">
                      <p className="text-[11px] font-bold leading-tight mb-0.5 line-clamp-2" style={{ color: textPrimary }}>{prod.name}</p>
                      <p className="text-[10px]" style={{ color: cat.accent }}>{cat.name}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <ContactBar />
    </div>
  );
}
