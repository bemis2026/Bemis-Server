"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { findVariantGroup } from "../../../../lib/productGroups";
import Navbar from "../../../components/Navbar";
import ContactBar from "../../../components/ContactBar";
import SearchOverlay from "../../../components/SearchOverlay";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine,
  RiPlugLine, RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
  RiArrowLeftLine, RiArrowRightSLine, RiCheckLine,
  RiFileTextLine, RiFilePdfLine, RiExternalLinkLine,
} from "react-icons/ri";
import { HiMail, HiDownload, HiArrowRight } from "react-icons/hi";
import { trackEvent } from "../../../components/GoogleAnalytics";
import Image from "next/image";

type SpecItem  = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductDocument = { label: string; url: string };
type ProductEntry = {
  id: string; name: string; code?: string; subtitle: string; badge: string | null;
  description: string; specs: SpecGroup[]; image?: string; images?: string[]; pdf?: string;
  generalFeatures?: string[];
  documents?: ProductDocument[];
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
  const { lang } = useLanguage();
  const d         = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory]     = useState<CategoryData | null>(null);
  const [product,  setProduct]      = useState<ProductEntry | null>(null);
  const [loading,  setLoading]      = useState(true);
  const [activeImg, setActiveImg]   = useState(0);
  const [allCategories, setAllCategories] = useState<CategoryData[]>([]);
  const [activeTab, setActiveTab]   = useState<"specs" | "general" | "documents">("specs");

  const categoryId = typeof params.id        === "string" ? params.id        : "";
  const productId  = typeof params.productId === "string" ? params.productId : "";

  useEffect(() => {
    if (!categoryId || !productId) return;
    fetch(`/api/products?lang=${lang}`)
      .then(r => r.json())
      .then((data: CategoryData[]) => {
        const cat  = data.find(c => c.id === categoryId) ?? null;
        const prod = cat?.products.find(p => p.id === productId) ?? null;
        setCategory(cat);
        setProduct(prod);
        setActiveImg(0);
        setAllCategories(data);
        if (prod && cat) trackEvent("view_item", { item_id: prod.id, item_name: prod.name, item_category: cat.name });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId, productId, lang]);

  const bg          = d ? "#0c0c0e" : "#f2f3f7";
  const surface     = d ? "#141416" : "#ffffff";
  const surfaceAlt  = d ? "#111113" : "#f8f8fb";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const divider     = d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const textPrimary = d ? "#f0f0f4" : "#111827";
  const textMuted   = d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
  const textFaint   = d ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.30)";
  const accent      = category?.accent ?? "#3B82F6";
  const Icon        = categoryIcons[categoryId] ?? RiChargingPile2Line;

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${accent}50`, borderTopColor: "transparent" }} />
          </div>
        )}

        {/* Not found */}
        {!loading && !product && (
          <div className="text-center py-32">
            <p className="text-lg font-bold mb-2" style={{ color: textPrimary }}>Ürün bulunamadı</p>
            <button onClick={() => router.push("/products")} className="text-sm underline" style={{ color: accent }}>
              Tüm ürünlere dön
            </button>
          </div>
        )}

        {!loading && product && category && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

            {/* ── Breadcrumb ── */}
            <nav className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: textFaint }}>
              <button onClick={() => router.push("/products")} className="hover:underline transition-colors" style={{ color: textFaint }}>
                Ürünler
              </button>
              <RiArrowRightSLine size={13} />
              <button onClick={() => router.push(`/products/${categoryId}`)} className="hover:underline" style={{ color: textFaint }}>
                {category.name}
              </button>
              <RiArrowRightSLine size={13} />
              <span style={{ color: textMuted }}>{product.name}</span>
            </nav>

            {/* ── Main content grid ── */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">

              {/* ── Left col: gallery + CTA ── */}
              <div className="lg:col-span-2">
                {(() => {
                  const imgs = product.images ?? (product.image ? [product.image] : []);
                  const clamped = Math.min(activeImg, imgs.length - 1);

                  return (
                    <div className="flex flex-col gap-3">
                      {/* Main frame — fixed square */}
                      <div
                        className="relative rounded-2xl overflow-hidden w-full"
                        style={{
                          aspectRatio: "1/1",
                          background: d
                            ? `linear-gradient(145deg, ${accent}10 0%, #0e0e12 100%)`
                            : `linear-gradient(145deg, ${accent}0c 0%, #eef0f5 100%)`,
                          border: `1px solid ${border}`,
                          boxShadow: d
                            ? `0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`
                            : `0 8px 32px rgba(0,0,0,0.08)`,
                        }}
                      >
                        {imgs.length > 0 ? (
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={clamped}
                              className="absolute inset-0"
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.02 }}
                              transition={{ duration: 0.22 }}
                            >
                              <Image
                                src={imgs[clamped]}
                                alt={`${product.name} ${clamped + 1}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-contain p-4"
                                priority
                              />
                            </motion.div>
                          </AnimatePresence>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon style={{ fontSize: 72, color: `${accent}30` }} />
                          </div>
                        )}

                        {/* Image counter badge */}
                        {imgs.length > 1 && (
                          <div
                            className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg"
                            style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}
                          >
                            {clamped + 1} / {imgs.length}
                          </div>
                        )}

                        {/* Arrow nav for 2+ images */}
                        {imgs.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImg((clamped - 1 + imgs.length) % imgs.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "#fff" }}
                            >
                              <RiArrowLeftLine size={14} />
                            </button>
                            <button
                              onClick={() => setActiveImg((clamped + 1) % imgs.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "#fff" }}
                            >
                              <RiArrowRightSLine size={14} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail strip */}
                      {imgs.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-0.5">
                          {imgs.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImg(i)}
                              className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150"
                              style={{
                                width: 56, height: 56,
                                border: i === clamped ? `2px solid ${accent}` : `2px solid ${border}`,
                                opacity: i === clamped ? 1 : 0.5,
                                background: surfaceAlt,
                              }}
                            >
                              <Image src={src} alt="" width={56} height={56} className="w-full h-full object-contain p-1" />
                            </button>
                          ))}
                        </div>
                      )}
                      {/* ── CTA below gallery ── */}
                      <button
                        onClick={() => router.push("/#contact")}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "#fff", boxShadow: `0 4px 16px ${accent}35` }}
                      >
                        <HiMail size={15} /> Teklif Al
                      </button>
                      {product.pdf && (
                        <a
                          href={product.pdf} download target="_blank" rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                          style={{ background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: textMuted, border: `1px solid ${border}` }}
                        >
                          <HiDownload size={14} /> PDF Katalog İndir
                        </a>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* ── Right col: info + specs ── */}
              <div className="lg:col-span-3 flex flex-col gap-5">

                {/* Variant selector — shown only when this product is one of
                    several same-name variants (e.g. Charger 2 Kablolu /
                    Charger 2 Fişli). Each tab is a real link to the
                    sibling's URL so SEO and back-button stay correct. */}
                {(() => {
                  const variantInfo = findVariantGroup(category.products ?? [], productId);
                  if (!variantInfo || variantInfo.group.variants.length < 2) return null;
                  return (
                    <div
                      className="rounded-2xl p-3"
                      style={{ background: surface, border: `1px solid ${border}` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: textFaint }}>
                        Versiyon Seçin
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {variantInfo.group.variants.map((v) => {
                          const isActive = v.id === productId;
                          return (
                            <button
                              key={v.id}
                              onClick={() => router.push(`/products/${categoryId}/${v.id}`)}
                              className="text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
                              style={{
                                background: isActive ? accent : (d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                                border: `1px solid ${isActive ? accent : border}`,
                                color: isActive ? "#fff" : textPrimary,
                                cursor: isActive ? "default" : "pointer",
                              }}
                            >
                              <span className="block">{v.subtitle || v.code || "Standart"}</span>
                              {v.code && v.subtitle && (
                                <span
                                  className="block text-[9px] font-mono mt-0.5"
                                  style={{ color: isActive ? "rgba(255,255,255,0.75)" : textFaint }}
                                >
                                  {v.code}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Product header card */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: surface,
                    border: `1px solid ${border}`,
                    boxShadow: d ? "0 4px 20px rgba(0,0,0,0.25)" : "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Category + icon row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 32, height: 32, background: `${accent}18`, border: `1px solid ${accent}28` }}
                    >
                      <Icon style={{ fontSize: 16, color: accent }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: accent }}>{category.name}</span>
                    {product.code && (
                      <span
                        className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-lg"
                        style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textFaint, border: `1px solid ${border}` }}
                      >
                        {product.code}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-1.5" style={{ color: textPrimary }}>
                    {product.name}
                  </h1>

                  {/* Badge + subtitle */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {product.badge && (
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}
                      >
                        {product.badge}
                      </span>
                    )}
                    {product.subtitle && (
                      <span className="text-sm" style={{ color: textMuted }}>{product.subtitle}</span>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Specs / General Features / Documents — tabbed card */}
                {(() => {
                  const hasSpecs    = product.specs.length > 0;
                  const generalList = (product.generalFeatures ?? []).filter((s) => s && s.trim().length > 0);
                  const docList     = (product.documents ?? []).filter((d) => d && d.url && d.url.trim().length > 0);
                  const hasGeneral  = generalList.length > 0;
                  const hasDocs     = docList.length > 0;
                  if (!hasSpecs && !hasGeneral && !hasDocs) return null;

                  // Resolve which tab is actually shown — fall back if the
                  // saved activeTab no longer has content (e.g. the operator
                  // just removed all general features).
                  let resolvedTab: "specs" | "general" | "documents" = activeTab;
                  if (resolvedTab === "specs" && !hasSpecs)        resolvedTab = hasGeneral ? "general" : "documents";
                  if (resolvedTab === "general" && !hasGeneral)    resolvedTab = hasSpecs ? "specs" : "documents";
                  if (resolvedTab === "documents" && !hasDocs)     resolvedTab = hasSpecs ? "specs" : "general";

                  const tabs: { id: "specs" | "general" | "documents"; label: string; visible: boolean }[] = [
                    { id: "specs",     label: "Teknik Özellikler", visible: hasSpecs },
                    { id: "general",   label: "Genel Özellikler",  visible: hasGeneral },
                    { id: "documents", label: "Dökümanlar",        visible: hasDocs },
                  ];
                  const visibleTabs = tabs.filter((t) => t.visible);

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ border: `1px solid ${border}`, background: surface }}
                    >
                      {/* Tab switcher */}
                      <div
                        className="flex"
                        style={{ borderBottom: `1px solid ${divider}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)" }}
                      >
                        {visibleTabs.map((t) => {
                          const isActive = resolvedTab === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setActiveTab(t.id)}
                              className="flex-1 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
                              style={{
                                color: isActive ? accent : textFaint,
                                background: isActive
                                  ? (d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)")
                                  : "transparent",
                                borderBottom: isActive ? `2px solid ${accent}` : "2px solid transparent",
                                marginBottom: -1,
                              }}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Specs tab */}
                      {resolvedTab === "specs" && product.specs.flatMap((group, gi) => {
                        const isPrice = group.group.toLowerCase().includes("fiyat");
                        return [
                          product.specs.length > 1 ? (
                            <div
                              key={`g${gi}`}
                              className="px-4 py-1.5 flex items-center gap-1.5"
                              style={{ background: isPrice ? `${accent}0c` : d ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.018)", borderTop: gi > 0 ? `1px solid ${divider}` : "none" }}
                            >
                              <div className="w-1 h-1 rounded-full" style={{ background: isPrice ? accent : `${accent}60` }} />
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isPrice ? accent : textFaint }}>{group.group}</span>
                              {isPrice && (
                                <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${accent}15`, color: `${accent}cc` }}>KDV Hariç</span>
                              )}
                            </div>
                          ) : null,
                          ...group.items.map((item, ii) => (
                            <div
                              key={`g${gi}i${ii}`}
                              className="px-4 py-1.5 flex items-center justify-between gap-3"
                              style={{ borderTop: `1px solid ${divider}` }}
                            >
                              <span className="text-xs" style={{ color: textFaint, flexShrink: 0 }}>{item.label}</span>
                              <span className="text-xs font-semibold text-right inline-flex items-baseline gap-1.5" style={{ color: isPrice ? accent : textMuted }}>
                                {item.value}
                                {isPrice && (
                                  <span className="text-[10px] font-medium" style={{ color: `${accent}99` }}>+ KDV</span>
                                )}
                              </span>
                            </div>
                          )),
                        ];
                      })}

                      {/* General features tab */}
                      {resolvedTab === "general" && (
                        <div className="p-4 space-y-2">
                          {generalList.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div
                                className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                                style={{ width: 16, height: 16, background: `${accent}18`, border: `1px solid ${accent}30` }}
                              >
                                <RiCheckLine size={10} style={{ color: accent }} />
                              </div>
                              <span className="text-sm leading-relaxed" style={{ color: textMuted }}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Documents tab */}
                      {resolvedTab === "documents" && (
                        <div className="p-3 space-y-2">
                          {docList.map((doc, i) => {
                            const lower = doc.url.toLowerCase();
                            const isPdf = lower.endsWith(".pdf");
                            const isExternal = /^https?:\/\//.test(doc.url);
                            const Ico = isPdf ? RiFilePdfLine : RiFileTextLine;
                            return (
                              <a
                                key={i}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={isPdf || !isExternal}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors"
                                style={{
                                  background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
                                  border: `1px solid ${border}`,
                                }}
                              >
                                <div
                                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                                  style={{ width: 36, height: 36, background: `${accent}15`, border: `1px solid ${accent}25`, color: accent }}
                                >
                                  <Ico size={18} />
                                </div>
                                <span className="flex-1 text-sm font-semibold truncate" style={{ color: textPrimary }}>{doc.label || "İndir"}</span>
                                {isPdf
                                  ? <HiDownload size={16} className="flex-shrink-0 transition-transform group-hover:translate-y-0.5" style={{ color: textFaint }} />
                                  : <RiExternalLinkLine size={16} className="flex-shrink-0" style={{ color: textFaint }} />
                                }
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })()}

              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Recommended products ── */}
      {!loading && product && category && (() => {
        const sameCat = (category.products ?? []).filter(p => p.id !== productId);
        const otherCatProds: Array<{ cat: CategoryData; prod: ProductEntry }> = [];
        for (const c of allCategories) {
          if (c.id === categoryId) continue;
          for (const p of c.products ?? []) otherCatProds.push({ cat: c, prod: p });
        }
        const recommended = [
          ...sameCat.slice(0, 4).map(p => ({ cat: category, prod: p })),
          ...otherCatProds.slice(0, Math.max(0, 4 - sameCat.length)),
        ].slice(0, 4);
        if (recommended.length === 0) return null;
        return (
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold" style={{ color: theme === "dark" ? "#f0f0f4" : "#111827" }}>Benzer Ürünler</h2>
              <button
                onClick={() => router.push(`/products/${categoryId}`)}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: category.accent }}
              >
                Tümünü Gör <HiArrowRight size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recommended.map(({ cat, prod }, i) => {
                const CatIcon = categoryIcons[cat.id] ?? RiPlugLine;
                const imgs = prod.images ?? (prod.image ? [prod.image] : []);
                const sd = theme === "dark";
                return (
                  <motion.div
                    key={`${cat.id}-${prod.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    onClick={() => router.push(`/products/${cat.id}/${prod.id}`)}
                    className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
                    style={{ background: sd ? "#141416" : "#ffffff", border: `1px solid ${sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.accent}50`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${cat.accent}14`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Fixed square image */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: "1/1",
                        background: sd
                          ? `linear-gradient(145deg, ${cat.accent}0d 0%, #111 100%)`
                          : `linear-gradient(145deg, ${cat.accent}0c 0%, #f0f0f5 100%)`,
                      }}
                    >
                      {imgs[0] ? (
                        <img
                          src={imgs[0]} alt={prod.name}
                          className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CatIcon style={{ fontSize: 32, color: sd ? "rgba(255,255,255,0.13)" : `${cat.accent}40` }} />
                        </div>
                      )}
                      {prod.badge && (
                        <div
                          className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${cat.accent}22`, border: `1px solid ${cat.accent}40`, color: sd ? "rgba(255,255,255,0.75)" : cat.accent }}
                        >
                          {prod.badge}
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="text-[11px] font-bold leading-tight mb-0.5 line-clamp-2" style={{ color: sd ? "#f0f0f4" : "#111827" }}>{prod.name}</p>
                      <p className="text-[10px] truncate" style={{ color: cat.accent }}>{cat.name}</p>
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
