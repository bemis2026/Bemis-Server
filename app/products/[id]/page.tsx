"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import ContactBar from "../../components/ContactBar";
import { useState, useEffect } from "react";
import SearchOverlay from "../../components/SearchOverlay";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine,
  RiPlugLine, RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
  RiScalesLine, RiCloseLine, RiCheckLine,
} from "react-icons/ri";
import { HiArrowLeft, HiPhone, HiMail } from "react-icons/hi";

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

// ── Comparison Modal ───────────────────────────────────────────────────────
function CompareModal({
  products, accent, onClose, d, textPrimary, textMuted, textFaint, surface, surfaceBorder,
}: {
  products: ProductEntry[]; accent: string; onClose: () => void;
  d: boolean; textPrimary: string; textMuted: string; textFaint: string;
  surface: string; surfaceBorder: string;
}) {
  // Collect all unique spec labels across all groups
  const allGroups: { group: string; labels: string[] }[] = [];
  const groupMap = new Map<string, Set<string>>();
  products.forEach(p =>
    p.specs?.forEach(sg => {
      if (!groupMap.has(sg.group)) groupMap.set(sg.group, new Set());
      sg.items.forEach(it => groupMap.get(sg.group)!.add(it.label));
    })
  );
  groupMap.forEach((labels, group) => allGroups.push({ group, labels: [...labels] }));

  const getVal = (p: ProductEntry, group: string, label: string) =>
    p.specs?.find(sg => sg.group === group)?.items.find(it => it.label === label)?.value ?? "—";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full sm:max-w-4xl max-h-[90vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: d ? "#131316" : "#ffffff", border: `1px solid ${surfaceBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: surfaceBorder }}>
          <div className="flex items-center gap-2">
            <RiScalesLine style={{ color: accent, fontSize: 18 }} />
            <span className="font-bold text-sm" style={{ color: textPrimary }}>Ürün Karşılaştırma</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold ml-1"
              style={{ background: `${accent}18`, color: accent }}>{products.length} ürün</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: textMuted }}>
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 480 }}>
            {/* Product name row */}
            <thead>
              <tr style={{ borderBottom: `1px solid ${surfaceBorder}` }}>
                <th className="px-4 py-3 text-left w-36 font-medium text-xs"
                  style={{ color: textFaint, background: d ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                  Özellik
                </th>
                {products.map(p => (
                  <th key={p.id} className="px-4 py-3 text-left font-bold text-xs" style={{ color: textPrimary }}>
                    {p.name}
                    {p.subtitle && <div className="font-normal mt-0.5" style={{ color: textFaint, fontSize: "0.68rem" }}>{p.subtitle}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allGroups.map(({ group, labels }) => (
                <>
                  {/* Group header */}
                  <tr key={`g-${group}`}>
                    <td colSpan={products.length + 1} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: accent, background: `${accent}08`, borderBottom: `1px solid ${accent}15` }}>
                      {group}
                    </td>
                  </tr>
                  {labels.map(label => {
                    const vals = products.map(p => getVal(p, group, label));
                    const allSame = vals.every(v => v === vals[0]);
                    return (
                      <tr key={label} style={{ borderBottom: `1px solid ${surfaceBorder}` }}>
                        <td className="px-4 py-2.5 text-xs font-medium" style={{ color: textMuted }}>{label}</td>
                        {products.map((p, pi) => {
                          const val = vals[pi];
                          return (
                            <td key={p.id} className="px-4 py-2.5 text-xs font-semibold"
                              style={{ color: !allSame && val !== "—" ? accent : textPrimary }}>
                              {val === "—"
                                ? <span style={{ color: textFaint }}>—</span>
                                : val.includes("✓") || val === "Var"
                                  ? <RiCheckLine style={{ color: "#10B981", fontSize: 16 }} />
                                  : val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>

          {allGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <RiScalesLine style={{ fontSize: 36, color: textFaint }} />
              <p className="text-sm" style={{ color: textMuted }}>Bu ürünler için teknik özellik verisi henüz girilmemiş.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProductCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen]     = useState(false);
  const [category, setCategory]         = useState<CategoryData | null>(null);
  const [loading, setLoading]           = useState(true);
  const [compareIds, setCompareIds]     = useState<string[]>([]);
  const [showCompare, setShowCompare]   = useState(false);
  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!id) return;
    fetch("/api/products")
      .then(r => r.json())
      .then((data: CategoryData[]) => setCategory(data.find(c => c.id === id) ?? null))
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [id]);

  const bg            = d ? "#0c0c0e" : "#f8f8fb";
  const surface       = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const surfaceBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary   = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted     = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint     = d ? "rgba(240,240,244,0.30)" : "rgba(26,26,46,0.30)";
  const groupHeaderBg = d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  const toggleCompare = (productId: string) => {
    setCompareIds(prev =>
      prev.includes(productId)
        ? prev.filter(x => x !== productId)
        : prev.length >= 3 ? prev : [...prev, productId]
    );
  };

  if (loading) return (
    <div style={{ background: bg, minHeight: "100vh" }} className="flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
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
  const compareProducts = (category.products ?? []).filter(p => compareIds.includes(p.id));

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Category hero */}
      <div className="pt-24 pb-8 px-5 sm:px-6 lg:px-8"
        style={{ background: d ? `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}10 0%, transparent 70%)` : `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}08 0%, transparent 70%)` }}>
        <div className="max-w-7xl mx-auto">
          <motion.button initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
            onClick={() => router.back()} className="flex items-center gap-2 mb-6 group" style={{ color: textMuted }}>
            <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Ürünler</span>
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="flex-shrink-0 flex items-center justify-center rounded-2xl"
              style={{ width: 56, height: 56, background: `${accent}18`, border: `1px solid ${accent}30` }}>
              <Icon style={{ fontSize: 28, color: accent }} />
            </motion.div>
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

          {/* Compare hint */}
          {(category.products?.length ?? 0) > 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-xs mt-4 flex items-center gap-1.5" style={{ color: textFaint }}>
              <RiScalesLine style={{ fontSize: 13, color: accent }} />
              Karşılaştırmak için kartlardaki
              <span className="font-semibold" style={{ color: accent }}>Karşılaştır</span>
              butonunu kullanın (maks. 3 ürün)
            </motion.p>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {(category.products ?? []).map((product, pi) => {
            const inCompare = compareIds.includes(product.id);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: pi * 0.06 }}
                className="group rounded-2xl overflow-hidden transition-all duration-250 flex flex-col"
                style={{
                  background: surface,
                  border: `1px solid ${inCompare ? accent + "50" : surfaceBorder}`,
                  boxShadow: inCompare ? `0 0 0 2px ${accent}25` : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  if (!inCompare) {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}45`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 28px ${accent}12`;
                  }
                }}
                onMouseLeave={e => {
                  if (!inCompare) {
                    (e.currentTarget as HTMLDivElement).style.borderColor = surfaceBorder;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }
                }}
              >
                {/* Product image / icon */}
                <div className="relative overflow-hidden" onClick={() => router.push(`/products/${id}/${product.id}`)}
                  style={{ height: 148, background: d ? `linear-gradient(145deg, ${accent}0a 0%, #111111 100%)` : `linear-gradient(145deg, ${accent}0d 0%, #f4f4f4 100%)` }}>
                  {(product.images?.[0] ?? product.image) ? (
                    <img src={product.images?.[0] ?? product.image} alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
                      style={{ opacity: 0.88 }} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon style={{ fontSize: 44, color: d ? "rgba(255,255,255,0.18)" : `${accent}50`, transition: "transform 0.3s ease" }} />
                    </div>
                  )}
                  {product.badge && (
                    <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
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
                  {product.subtitle && (
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

                {/* Compare toggle */}
                <button
                  onClick={e => { e.stopPropagation(); toggleCompare(product.id); }}
                  className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-semibold transition-all duration-150 border-t"
                  style={{
                    borderColor: inCompare ? `${accent}30` : surfaceBorder,
                    background: inCompare ? `${accent}12` : "transparent",
                    color: inCompare ? accent : textFaint,
                  }}
                >
                  {inCompare
                    ? <><RiCheckLine style={{ fontSize: 12 }} /> Seçildi</>
                    : <><RiScalesLine style={{ fontSize: 12 }} /> Karşılaştır</>
                  }
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Sticky compare bar ── */}
      <AnimatePresence>
        {compareIds.length >= 2 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3"
            style={{ background: d ? "rgba(13,13,15,0.96)" : "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", borderTop: `1px solid ${surfaceBorder}` }}
          >
            <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <RiScalesLine style={{ color: accent, fontSize: 18, flexShrink: 0 }} />
                <div className="flex gap-2 flex-wrap">
                  {compareProducts.map(p => (
                    <span key={p.id} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                      {p.name}
                      <button onClick={() => toggleCompare(p.id)} className="hover:opacity-70">
                        <RiCloseLine style={{ fontSize: 13 }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setCompareIds([])} className="text-xs px-3 py-2 rounded-xl font-medium"
                  style={{ color: textMuted, background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}>
                  Temizle
                </button>
                <button onClick={() => setShowCompare(true)}
                  className="text-xs px-4 py-2 rounded-xl font-bold transition-all"
                  style={{ background: accent, color: "#fff" }}>
                  Karşılaştır ({compareIds.length})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare modal */}
      <AnimatePresence>
        {showCompare && (
          <CompareModal
            products={compareProducts} accent={accent} onClose={() => setShowCompare(false)}
            d={d} textPrimary={textPrimary} textMuted={textMuted} textFaint={textFaint}
            surface={surface} surfaceBorder={surfaceBorder}
          />
        )}
      </AnimatePresence>

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: surface, border: `1px solid ${surfaceBorder}` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
            <HiPhone style={{ color: accent, fontSize: 18 }} />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: textPrimary }}>Teknik Bilgi veya Fiyat Teklifi Alın</h3>
          <p className="text-sm mb-5" style={{ color: textMuted }}>Uzman ekibimiz size en uygun çözümü sunar.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push("/#contact")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: accent, color: "#fff" }}>
              <HiMail size={15} /> İletişime Geç
            </button>
            <button onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: groupHeaderBg, border: `1px solid ${surfaceBorder}`, color: textMuted }}>
              <HiArrowLeft size={15} /> Geri Dön
            </button>
          </div>
        </motion.div>
      </div>

      <ContactBar />
    </div>
  );
}
