"use client";
import { pickText } from "../../../lib/ui";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { MouseEvent as RMouseEvent, PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useContent } from "../../../context/ContentContext";
import { formatPrice } from "../../../../lib/formatPrice";
import { findVariantGroup } from "../../../../lib/productGroups";
import JsonLd from "../../../components/JsonLd";
import EnergyBackground from "../../../components/EnergyBackground";
import Navbar from "../../../components/Navbar";
import ContactBar from "../../../components/ContactBar";
import SearchOverlay from "../../../components/SearchOverlay";
import DealerPickerModal from "../../../components/DealerPickerModal";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine,
  RiPlugLine, RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
  RiArrowLeftLine, RiArrowRightSLine, RiCheckLine,
  RiFileTextLine, RiFilePdfLine, RiExternalLinkLine,
  RiCloudLine, RiSmartphoneLine, RiWifiLine, RiBankCardLine, RiTv2Line,
  RiShieldCheckLine, RiBarChart2Line, RiCalendarCheckLine, RiTeamLine,
  RiLightbulbLine, RiAddLine, RiMapPin2Line, RiVerifiedBadgeFill,
  RiStarFill,
} from "react-icons/ri";
import { featureById } from "../../../../lib/productFeatures";
import { certificateById } from "../../../../lib/productCertificates";

// Anasayfa SmartCharger ile AYNI mağaza ikonları (App Store / Google Play).
function AppleIcon({ size = 16 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>);
}
function GooglePlayIcon({ size = 16 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.35.2.74.24 1.12.14L15.5 12 12 8.5 3.18 23.76zm17.46-11.16c-.38-.22-3.98-2.28-6.44-3.68L10.5 12l3.7 3.7c2.46-1.4 6.06-3.46 6.44-3.68.54-.32.86-.9.86-1.51-.01-.62-.33-1.19-.86-1.51zM2.3.24C2.1.44 2 .73 2 1.06v21.87c0 .34.1.63.3.83L2.44 24l12.22-12.22L2.44.1 2.3.24zm8.2 11.76L2.44 0l-.14.14C2.1.34 2 .63 2 .96v.1L10.5 12z" /></svg>);
}

const DETAIL_FEATURE_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  RiCloudLine, RiSmartphoneLine, RiWifiLine, RiBankCardLine, RiTv2Line,
  RiShieldCheckLine, RiBarChart2Line, RiPlugLine, RiFlashlightLine,
  RiCalendarCheckLine, RiTeamLine, RiLightbulbLine,
};
import { HiDownload } from "react-icons/hi";
import { trackEvent } from "../../../components/GoogleAnalytics";
import Image from "next/image";

type SpecItem  = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductDocument = { label: string; url: string };
type BoxContentItem = { name: string; image?: string };
type ProductEntry = {
  id: string; name: string; code?: string; subtitle: string; badge: string | null;
  description: string; specs: SpecGroup[]; image?: string; images?: string[]; pdf?: string;
  generalFeatures?: string[];
  documents?: ProductDocument[];
  features?: string[];
  certificates?: string[];
  boxContents?: BoxContentItem[];
  compatibleVehicles?: string[];
};
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox: RiChargingPile2Line, portable: RiBatteryChargeLine,
  cables: RiFlashlightLine, "v2l-c2l": RiCarLine,
  converters: RiToolsLine, "charger-equipment": RiToolsFill,
  accessories: RiPlugLine, "dc-units": RiGasStationLine,
};

// Single-source brand blue for the unified Genel Özellikler palette so the
// per-category accent (orange for DC, green for portable, etc.) doesn't
// bleed into the feature cards. Matches Tailwind's blue-500.
const BRAND_BLUE = "#3B82F6";

// A spec group is treated as a price block whenever the operator's
// group name reads "fiyat" (TR) or "price" (EN auto-translation).
// We pull these out of the technical specs tab and render them in
// the Genel Özellikler tab regardless of language.
function isPriceGroup(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.includes("fiyat") || lower.includes("price");
}

// Teknik çizim haritası (ürün kodu → self-host yol). Galeri + lightbox ortak kullanır.
const TECH_DRAWINGS: Record<string, string> = {
  "BEV-1011-0005": "/teknik-cizim/BEV-1011-0005.jpg",
  "BEV-1011-0105": "/teknik-cizim/BEV-1011-0105.jpg",
  "BEV-2012-0000": "/teknik-cizim/BEV-2012-0000.jpg",
  "BEV-3011-0005": "/teknik-cizim/BEV-3011-0005.jpg",
  "BEV-3012-0000": "/teknik-cizim/BEV-3012-0000.jpg",
  "BEV-3011-1005": "/teknik-cizim/BEV-3011-1005.jpg",
  "BEV-3012-1000": "/teknik-cizim/BEV-3012-1000.jpg",
};

// Görsel lightbox — tıkla→tam ekran büyük popup; görsele tıkla yakınlaş (2.4x), sürükle
// gezin, ok tuşları/yan oklarla gezinme, Esc/dış tık/✕ ile kapat. createPortal ile body'ye
// taşınır (framer-motion transform'larından kaçmak için şart). Mouse+dokunmatik tek
// handler seti (Pointer Events API).
function ImageLightbox({ images, index, setIndex, onClose, productName }: {
  images: string[]; index: number; setIndex: (i: number) => void; onClose: () => void; productName: string;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ sx: number; sy: number; bx: number; by: number } | null>(null);
  const moved = useRef(false);
  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const go = (dir: number) => setIndex((index + dir + images.length) % images.length);

  useEffect(() => { reset(); }, [index]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prevOv = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOv; };
  });

  const toggleZoom = (e: RMouseEvent) => {
    if (moved.current) { moved.current = false; return; }
    if (scale > 1) { reset(); return; }
    const s = 2.4, cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    setScale(s);
    setPos({ x: -(e.clientX - cx) * (s - 1), y: -(e.clientY - cy) * (s - 1) });
  };
  const onDown = (e: RPointerEvent) => {
    if (scale <= 1) return;
    drag.current = { sx: e.clientX, sy: e.clientY, bx: pos.x, by: pos.y };
    moved.current = false;
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
  };
  const onMove = (e: RPointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.sx, dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.current = true;
    setPos({ x: drag.current.bx + dx, y: drag.current.by + dy });
  };
  const onUp = () => { drag.current = null; };

  if (typeof document === "undefined" || !images.length) return null;
  const ctrl = "absolute z-10 flex items-center justify-center text-white rounded-full";
  const ctrlBg = { background: "rgba(255,255,255,0.14)", backdropFilter: "blur(6px)" };

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: "rgba(0,0,0,0.95)" }} onClick={onClose}>
      <button onClick={onClose} aria-label="Kapat" className={`${ctrl} top-4 right-4 w-10 h-10 text-lg`} style={ctrlBg}>✕</button>
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/75 text-sm font-medium tabular-nums">{index + 1} / {images.length}</div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[index]} alt={productName} draggable={false}
        onClick={(e) => { e.stopPropagation(); toggleZoom(e); }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        className="max-w-[92vw] max-h-[86vh] object-contain select-none touch-none"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, cursor: scale > 1 ? "grab" : "zoom-in", transition: drag.current ? "none" : "transform 0.22s ease", willChange: "transform" }} />
      {images.length > 1 && (<>
        <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Önceki" className={`${ctrl} left-3 top-1/2 -translate-y-1/2 w-11 h-11 text-2xl`} style={ctrlBg}>‹</button>
        <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Sonraki" className={`${ctrl} right-3 top-1/2 -translate-y-1/2 w-11 h-11 text-2xl`} style={ctrlBg}>›</button>
      </>)}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/55 text-xs text-center px-4">
        {scale > 1 ? "Sürükleyerek gezin · görsele tıkla: uzaklaş" : "Yakınlaştırmak için görsele tıkla"}
      </div>
    </motion.div>,
    document.body
  );
}

// Gerçek pazaryeri yorumu (server page.tsx reviewsForProduct ile eşleştirip
// geçer; yalnız gerçek yorumu olan üründe dolu gelir).
type ProductReview = {
  platform?: string; platformColor?: string; rating: number;
  author: string; date?: string; text: string; product?: string;
};

export default function ProductDetailPage({
  initialCategory = null,
  initialProduct = null,
  initialAllCategories = [],
  productReviews = [],
}: {
  initialCategory?: CategoryData | null;
  initialProduct?: ProductEntry | null;
  initialAllCategories?: CategoryData[];
  productReviews?: ProductReview[];
}) {
  const params    = useParams();
  const router    = useRouter();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { currency, tryPerEur } = useCurrency();
  const { categories: catMeta, smartCharger } = useContent();
  // Warranty / certification copy is fixed company policy — same line for
  // every product, no admin knob.
  const WARRANTY_DURATION = pickText(lang, "2 Yıl Üretici Garantisi", "2-Year Manufacturer Warranty");
  // CE certification kept in the Belgeler tab via certificates list —
  // no longer rendered as a standalone chip alongside warranty.
  const d         = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory]     = useState<CategoryData | null>(initialCategory);
  const [product,  setProduct]      = useState<ProductEntry | null>(initialProduct);
  const [loading,  setLoading]      = useState(initialProduct === null);
  const [activeImg, setActiveImg]   = useState(0);
  const [dealerOpen, setDealerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Galeri görselleri (ürün foto + varsa teknik çizim) — galeri ve lightbox ortak kullanır.
  const galleryImages: string[] = (() => {
    if (!product) return [];
    const base = product.images ?? (product.image ? [product.image] : []);
    const td = product.code ? TECH_DRAWINGS[product.code.trim()] : undefined;
    return td && !base.includes(td) ? [...base, td] : base;
  })();
  const [allCategories, setAllCategories] = useState<CategoryData[]>(initialAllCategories);
  // Global documents (admin → Dökümanlar tab) — her ürün için Belgeler
  // sekmesinde 'linkedProductCategories' içinde aktif kategorinin id'si varsa
  // listelenir. Kategori bazlı tek-yükleme yerine bağlama mantığı.
  const [globalDocs, setGlobalDocs] = useState<Array<{
    title?: string; url: string; size?: string; visible?: boolean;
    linkedProductCategories?: string[];
  }>>([]);
  const [activeTab, setActiveTab]   = useState<"specs" | "general" | "documents">("general");
  // FAQ artık accordion değil — kartlar her zaman cevap görünür halde.
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isFirstMount = useRef(true);

  const categoryId = typeof params.id        === "string" ? params.id        : "";
  const productId  = typeof params.productId === "string" ? params.productId : "";

  // Global documents bin (admin Dökümanlar tab) — bu kategoriye bağlı
  // olanları ürün detayında listelemek için bir kez çek. Lang değişince
  // yenilenmesine gerek yok; başlık/dil filtreleri client-side.
  useEffect(() => {
    fetch("/api/documents")
      .then(r => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data?.documents ?? []);
        if (Array.isArray(arr)) setGlobalDocs(arr);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!categoryId || !productId) return;
    if (isFirstMount.current && lang === "tr" && initialProduct && initialCategory) {
      isFirstMount.current = false;
      trackEvent("view_item", { item_id: initialProduct.id, item_name: initialProduct.name, item_category: initialCategory.name });
      return;
    }
    isFirstMount.current = false;
    setLoading(true);
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
  }, [categoryId, productId, lang, initialCategory, initialProduct]);

  const bg          = d ? "#131318" : "#f2f3f7";
  const surface     = d ? "#1c1c22" : "#ffffff";
  const surfaceAlt  = d ? "#111113" : "#f8f8fb";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const divider     = d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const textPrimary = d ? "#f0f0f4" : "#111827";
  const textMuted   = d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
  const textFaint   = d ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.30)";
  const accent      = category?.accent ?? "#3B82F6";
  const Icon        = categoryIcons[categoryId] ?? RiChargingPile2Line;

  return (
    <div style={{ background: bg, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <EnergyBackground />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <DealerPickerModal open={dealerOpen} onClose={() => setDealerOpen(false)} productName={initialProduct?.name} />
      {lightboxOpen && galleryImages.length > 0 && (
        <ImageLightbox
          images={galleryImages}
          index={Math.min(activeImg, Math.max(0, galleryImages.length - 1))}
          setIndex={setActiveImg}
          onClose={() => setLightboxOpen(false)}
          productName={product?.name ?? ""}
        />
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-16">

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
            <p className="text-lg font-bold mb-2" style={{ color: textPrimary }}>{pickText(lang, "Ürün bulunamadı", "Product not found")}</p>
            <button onClick={() => router.push("/products")} className="text-sm underline" style={{ color: accent }}>
              {pickText(lang, "Tüm ürünlere dön", "Back to all products")}
            </button>
          </div>
        )}

        {!loading && product && category && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

            {/* ── Breadcrumb ── */}
            <nav className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: textFaint }}>
              <button onClick={() => router.push("/products")} className="hover:underline transition-colors" style={{ color: textFaint }}>
                {pickText(lang, "Ürünler", "Products")}
              </button>
              <RiArrowRightSLine size={13} />
              <button onClick={() => router.push(`/products/${categoryId}`)} className="hover:underline" style={{ color: textFaint }}>
                {category.name}
              </button>
              <RiArrowRightSLine size={13} />
              <span style={{ color: textMuted }}>{product.name}</span>
            </nav>

            {/* ── Main content grid ── */}
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* ── Left col: gallery + CTA — bumped from 2/5 → 6/12 so the
                   product image lands ~15% wider in the viewport. ── */}
              <div className="lg:col-span-6">
                {(() => {
                  // imgs (ürün foto + varsa teknik çizim) bileşen gövdesinde galleryImages olarak hesaplanır.
                  const imgs = galleryImages;
                  const clamped = Math.min(activeImg, imgs.length - 1);

                  return (
                    <div className="flex flex-col gap-3">
                      {/* Main frame — fixed square. Solid surface bg (no
                          accent-tinted gradient) so background streaks
                          can't bleed through. */}
                      <div
                        className="relative rounded-2xl overflow-hidden w-full"
                        style={{
                          aspectRatio: "1/1",
                          // İki katmanlı arka plan: ALT katman OPAQUE
                          // solid renk (energy-streak çizgileri arkadan
                          // sızmasın diye), ÜST katman accent gradient
                          // tinted overlay. Multiple-background CSS
                          // syntax: ilk değer üstte render olur.
                          // /products kartlarıyla UYUMLU görsel-alan zemini:
                          // eskiden light #fafafa (aşırı parlak) + dark #1c1c1f (koyu,
                          // kartlar açıkken tutarsız) idi → kartların reçetesi (açık
                          // zemin + hafif accent tint) her modda birebir kullanıldı.
                          background: d
                            ? `linear-gradient(145deg, ${accent}16 0%, transparent 55%), #dbdee3`
                            : `linear-gradient(145deg, ${accent}0f 0%, transparent 55%), #f3f4f6`,
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
                                onClick={() => setLightboxOpen(true)}
                                className={`object-contain cursor-zoom-in ${imgs[clamped]?.startsWith("/teknik-cizim/") ? "p-1" : "p-4"}`}
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

                        {/* Variant selector overlay — top-right of the
                            gallery image. Floating chip stack, backdrop
                            blur, accent fill in the active chip. */}
                        {(() => {
                          const variantInfo = findVariantGroup(category.products ?? [], productId);
                          if (!variantInfo || variantInfo.group.variants.length < 2) return null;
                          return (
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 max-w-[60%]">
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                                style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                              >
                                {pickText(lang, "Versiyon", "Version")}
                              </span>
                              <div className="flex flex-col items-end gap-1">
                                {variantInfo.group.variants.map((v) => {
                                  const isActive = v.id === productId;
                                  return (
                                    <button
                                      key={v.id}
                                      onClick={() => router.push(`/products/${categoryId}/${v.id}`)}
                                      className="text-right px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 backdrop-blur-sm"
                                      style={{
                                        background: isActive ? accent : "rgba(0,0,0,0.55)",
                                        border: `1px solid ${isActive ? accent : "rgba(255,255,255,0.12)"}`,
                                        color: "#ffffff",
                                        cursor: isActive ? "default" : "pointer",
                                      }}
                                    >
                                      <span className="block leading-tight">{v.subtitle || v.code || (pickText(lang, "Standart", "Standard"))}</span>
                                      {(() => {
                                        // IP sınıfını üründen türet (ör. "Otomatlı IP44 Kombinasyon" → "IP44").
                                        // IP44/IP66 gibi aynı subtitle'a sahip varyantlar çipte ayırt edilsin.
                                        const ip = v.name?.match(/\bIP\s?\d{2}\b/i)?.[0]?.replace(/\s/g, "").toUpperCase();
                                        return ip ? (
                                          <span className="inline-block text-[9px] font-bold mt-0.5 px-1 py-px rounded" style={{ background: "rgba(255,255,255,0.18)" }}>
                                            {ip}
                                          </span>
                                        ) : null;
                                      })()}
                                      {v.code && v.subtitle && (
                                        <span className="block text-[9px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
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
                              <Image src={src} alt={`${product.name} küçük görsel ${i + 1}`} width={56} height={56} className="w-full h-full object-contain p-1" />
                            </button>
                          ))}
                        </div>
                      )}
                      {product.pdf && (
                        <a
                          href={product.pdf} download target="_blank" rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                          style={{ background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: textMuted, border: `1px solid ${border}` }}
                        >
                          <HiDownload size={14} /> {pickText(lang, "PDF Katalog İndir", "Download PDF Catalog")}
                        </a>
                      )}
                    </div>
                  );
                })()}

                {/* Paket İçeriği — what's actually in the box. Sits right
                    under the gallery so the layout stays self-contained on
                    the left column. Each item is a small white tile with
                    the product image and a name caption. */}
                {product.boxContents && product.boxContents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="mt-5"
                  >
                    <h3 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: textFaint }}>
                      {pickText(lang, "Paket İçeriği", "What's in the Box")}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.boxContents.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl overflow-hidden flex flex-col"
                          style={{
                            background: d ? "#1c1c22" : "#ffffff",
                            border: `1px solid ${border}`,
                          }}
                        >
                          <div
                            className="relative"
                            style={{
                              aspectRatio: "1/1",
                              background: d ? "#0e0e12" : "#f8f8fb",
                            }}
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name || ""}
                                fill
                                sizes="(max-width: 640px) 50vw, 200px"
                                className="object-contain p-3"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center" style={{ color: textFaint }}>
                                <span className="text-[10px] uppercase tracking-wider">{pickText(lang, "görsel yok", "no image")}</span>
                              </div>
                            )}
                          </div>
                          {item.name && (
                            <div className="px-3 py-2 border-t" style={{ borderColor: divider }}>
                              <p className="text-xs font-semibold leading-tight" style={{ color: textPrimary }}>
                                {item.name}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ── Right col: info + specs ── */}
              <div className="lg:col-span-6 flex flex-col gap-5">

                {/* Product header card */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: surface,
                    border: `1px solid ${border}`,
                    boxShadow: d ? "0 4px 20px rgba(0,0,0,0.25)" : "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Category label + product code — no category icon
                      anymore; the title was reading too crowded with it. */}
                  <div className="flex items-center gap-2 mb-3">
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

                  {/* Compatible vehicles — V2L variants where the
                      product is built around a specific car brand pin
                      pattern. We surface the brand list as labeled
                      chips so it doesn't get lost in the subtitle. */}
                  {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: textFaint }}>
                        {pickText(lang, "Uyumlu Araçlar", "Compatible Vehicles")}
                      </span>
                      {product.compatibleVehicles.map((brand) => (
                        <span
                          key={brand}
                          className="inline-flex items-center text-xs font-bold rounded-md"
                          style={{
                            padding: "4px 10px",
                            background: d ? "#1c1c22" : "#ffffff",
                            border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                            color: d ? "rgba(255,255,255,0.85)" : "#1a1a2e",
                          }}
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description + warranty chip — gruplanmış. Chip
                      description'ın hemen altında, paragraf bitince
                      tek satır boşlukta belirir. Parent space-y
                      ayrımı yerine inline gap kullanıyoruz ki garanti
                      açıklamadan kopuk hissettirmesin. */}
                  {product.description && (
                    <p className="text-sm leading-relaxed mb-2.5" style={{ color: textMuted }}>
                      {product.description}
                    </p>
                  )}
                  {/* Garanti rozeti (sol) + Bayi Bul (sağ, kompakt pill).
                      "Teklif Al" (WhatsApp → doğrudan Bemis) bayilerin talebiyle
                      kaldırıldı; müşteri artık ürün için bayiye yönlendirilir. */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold"
                      style={{
                        background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.08)",
                        border: `1px solid ${BRAND_BLUE}28`,
                        color: d ? "#dbeafe" : "#1e3a8a",
                      }}
                    >
                      <RiShieldCheckLine size={14} style={{ color: BRAND_BLUE }} />
                      {WARRANTY_DURATION}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDealerOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all hover:opacity-80"
                      style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textPrimary, border: `1px solid ${border}` }}
                    >
                      <RiMapPin2Line size={14} /> {pickText(lang, "Bayi Bul", "Dealers")}
                    </button>
                  </div>

                  {/* Quality / conformity certs as plain text chips — the
                      DIY brand SVGs read cleaner as letterforms than as
                      tiny logos. IP ratings stay in the Çevresel spec
                      group; they're a technical attribute, not a cert. */}
                  {product.certificates && product.certificates.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {product.certificates.map((cid) => {
                        const c = certificateById(cid);
                        if (!c) return null;
                        return (
                          <span
                            key={cid}
                            title={`${c.fullLabel} — onaylı belge`}
                            className="inline-flex items-center gap-1 rounded-md text-[11px] font-bold tracking-wider"
                            style={{
                              padding: "5px 9px 5px 7px",
                              background: d ? "#1c1c22" : "#ffffff",
                              border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                              color: d ? "rgba(255,255,255,0.85)" : "#1a1a2e",
                            }}
                          >
                            <RiVerifiedBadgeFill size={13} style={{ color: d ? "#4ade80" : "#16a34a", flexShrink: 0 }} aria-hidden />
                            {c.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Variant selector kart-altı kaldırıldı — overlay
                    versiyonu (gallery image sağ üst köşesi) tek
                    görünen variant switcher artık. */}

                {/* Specs / General Features / Documents — tabbed card.
                    "Genel Özellikler" sekmesi artık ürünün checkbox-seçilmiş
                    feature listesini (PRODUCT_FEATURES eşleşmesiyle) gösterir;
                    eski madde-listesi alanı (generalFeatures) artistik desteği
                    için fallback olarak kalır ama yeni kayıtlarda kullanılmaz. */}
                {(() => {
                  const nonPriceSpecs = product.specs.filter(g => !isPriceGroup(g.group));
                  const priceRowsCount = product.specs
                    .filter(g => isPriceGroup(g.group))
                    .reduce((sum, g) => sum + g.items.length, 0);
                  const hasSpecs    = nonPriceSpecs.length > 0;
                  const featureList = (product.features ?? []).map(featureById).filter(Boolean) as NonNullable<ReturnType<typeof featureById>>[];
                  const generalList = (product.generalFeatures ?? []).filter((s) => s && s.trim().length > 0);
                  const productDocs = (product.documents ?? []).filter((doc) => doc && doc.url && doc.url.trim().length > 0);
                  // Kategori bazlı kılavuzlar — admin'de kategori meta'sına
                  // yüklenir, o kategorideki tüm ürünlerin Belgeler sekmesinde
                  // ek olarak listelenir. Product-spesifik doküman'larla
                  // birleştirilir; aynı URL varsa duplicate edilmez.
                  const catManualsRaw = (category ? catMeta?.[category.id]?.manuals : undefined) ?? [];
                  // ProductDocument shape: { label, url, size?, kind? } — kategori
                  // manual'larını da bu şekilde normalize ediyoruz ki Belgeler
                  // sekmesi tek tip listede render etsin.
                  const catManuals = catManualsRaw
                    .filter((m) => m && m.url && m.url.trim().length > 0)
                    .map((m) => ({ label: m.name, url: m.url, size: m.size }));
                  // Linked global documents — /api/documents'ten gelen, bu
                  // ürün kategorisine bağlı (`linkedProductCategories` içinde
                  // category.id var) ve görünür olanlar.
                  const linkedDocs = (globalDocs ?? [])
                    .filter((doc) => doc && doc.url && doc.url.trim().length > 0)
                    .filter((doc) => doc.visible !== false)
                    .filter((doc) => Array.isArray(doc.linkedProductCategories) && category && doc.linkedProductCategories.includes(category.id))
                    .map((doc) => ({ label: doc.title || (pickText(lang, "Belge", "Document")), url: doc.url, size: doc.size }));

                  const seenUrls = new Set(productDocs.map((d) => d.url));
                  const mergedManuals = catManuals.filter((m) => !seenUrls.has(m.url));
                  mergedManuals.forEach((m) => seenUrls.add(m.url));
                  const mergedLinked = linkedDocs.filter((l) => !seenUrls.has(l.url));
                  const docList = [...productDocs, ...mergedManuals, ...mergedLinked];
                  const hasGeneral  = featureList.length > 0 || generalList.length > 0 || priceRowsCount > 0;
                  const hasDocs     = docList.length > 0;
                  if (!hasSpecs && !hasGeneral && !hasDocs) return null;

                  // Resolve which tab is actually shown — fall back if the
                  // saved activeTab no longer has content (e.g. the operator
                  // just removed all general features).
                  let resolvedTab: "specs" | "general" | "documents" = activeTab;
                  if (resolvedTab === "general" && !hasGeneral)    resolvedTab = hasSpecs ? "specs" : "documents";
                  if (resolvedTab === "specs" && !hasSpecs)        resolvedTab = hasGeneral ? "general" : "documents";
                  if (resolvedTab === "documents" && !hasDocs)     resolvedTab = hasGeneral ? "general" : "specs";

                  const tabs: { id: "specs" | "general" | "documents"; label: string; visible: boolean }[] = [
                    { id: "general",   label: pickText(lang, "Genel Özellikler", "Overview"),       visible: hasGeneral },
                    { id: "specs",     label: pickText(lang, "Teknik Özellikler", "Specifications"), visible: hasSpecs },
                    { id: "documents", label: pickText(lang, "Dökümanlar", "Documents"),             visible: hasDocs },
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

                      {/* Specs tab — price groups are filtered out and
                          rendered inside the Genel Özellikler tab instead
                          (price isn't a technical spec; it deserves to
                          live next to the human-readable feature list). */}
                      {resolvedTab === "specs" && product.specs
                        .filter(g => !isPriceGroup(g.group))
                        .flatMap((group, gi) => [
                          product.specs.filter(g => !isPriceGroup(g.group)).length > 1 ? (
                            <div
                              key={`g${gi}`}
                              className="px-4 py-1.5 flex items-center gap-1.5"
                              style={{ background: d ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.018)", borderTop: gi > 0 ? `1px solid ${divider}` : "none" }}
                            >
                              <div className="w-1 h-1 rounded-full" style={{ background: `${accent}60` }} />
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: textFaint }}>{group.group}</span>
                            </div>
                          ) : null,
                          ...group.items.map((item, ii) => (
                            <div
                              key={`g${gi}i${ii}`}
                              className="px-4 py-1.5 flex items-center justify-between gap-3"
                              style={{ borderTop: `1px solid ${divider}` }}
                            >
                              <span className="text-xs" style={{ color: textFaint, flexShrink: 0 }}>{item.label}</span>
                              <span className="text-xs font-semibold text-right" style={{ color: textMuted }}>
                                {item.value}
                              </span>
                            </div>
                          )),
                        ])}

                      {/* General features tab — unified white-card / brand-blue
                          palette regardless of category accent (the colorful
                          per-feature accents made the section look noisy and
                          fought with light-mode contrast). Each card has a
                          1px brand-blue rail on the left, a tinted icon
                          chip, and a theme-aware label/background. */}
                      {resolvedTab === "general" && (
                        <div className="p-4 space-y-3">
                          {/* Fiyat rows pulled from any spec group whose
                              name contains "fiyat". Stored values are
                              EUR; we convert to TRY when the active
                              language is TR. NOTE: order swapped — feature
                              chips render first (icon grid), price block
                              shows up underneath so the visitor reads what
                              the product does before the cost. */}
                          {featureList.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {featureList.map((f) => {
                                const Icon = DETAIL_FEATURE_ICONS[f.icon];
                                // İkon mavi (brand BLUE), metin nötr
                                // (beyaz / siyah). Kart yüzeyi neutral —
                                // accent rail yok, accent background yok,
                                // sadece icon'da brand vurgusu.
                                const cardBg     = d ? "#1c1c22" : "#ffffff";
                                const cardBorder = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
                                const cardShadow = d ? "none" : "0 1px 2px rgba(0,0,0,0.04)";
                                const iconBg     = d ? `${BRAND_BLUE}1a` : `${BRAND_BLUE}10`;
                                const iconBorder = `${BRAND_BLUE}30`;
                                return (
                                  <div
                                    key={f.id}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                                    style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
                                  >
                                    <span
                                      className="inline-flex items-center justify-center rounded-lg flex-shrink-0"
                                      style={{ width: 30, height: 30, background: iconBg, border: `1px solid ${iconBorder}` }}
                                    >
                                      {Icon && <Icon size={16} style={{ color: BRAND_BLUE }} />}
                                    </span>
                                    <span className="text-sm font-semibold" style={{ color: textPrimary }}>{f.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {(() => {
                            const priceGroups = product.specs.filter(g => isPriceGroup(g.group));
                            const priceRows = priceGroups.flatMap(g => g.items);
                            if (priceRows.length === 0) return null;
                            return (
                              <div
                                className="rounded-xl overflow-hidden"
                                style={{
                                  background: d ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)",
                                  border: `1px solid ${BRAND_BLUE}26`,
                                }}
                              >
                                <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${BRAND_BLUE}1f`, background: `${BRAND_BLUE}0c` }}>
                                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: BRAND_BLUE }}>{pickText(lang, "Fiyat Listesi", "Price List")}</span>
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${BRAND_BLUE}15`, color: BRAND_BLUE }}>{pickText(lang, "KDV Hariç", "Excl. Tax")}</span>
                                </div>
                                {priceRows.map((row, i) => {
                                  // TR dilinde iki para birimi yan yana
                                  // (TRY ana, EUR ikincil). EN dilinde sadece
                                  // EUR. Sayı parse edilemiyorsa formatPrice
                                  // raw string'i aynen döndürür → ikincil
                                  // tutar gizlenir, sadece label görünür.
                                  const tryText = formatPrice(row.value, "TRY", tryPerEur);
                                  const eurText = formatPrice(row.value, "EUR", tryPerEur);
                                  const hasNumeric = /\d/.test(row.value);
                                  return (
                                    <div
                                      key={i}
                                      className="px-4 py-2 flex items-center justify-between gap-3"
                                      style={{ borderTop: i > 0 ? `1px solid ${BRAND_BLUE}1a` : "none" }}
                                    >
                                      <span className="text-xs" style={{ color: textMuted }}>{/liste/i.test(row.label) ? (pickText(lang, "Fiyat", "Price")) : row.label}</span>
                                      <span className="text-sm font-bold text-right inline-flex items-baseline gap-1.5 flex-wrap justify-end" style={{ color: BRAND_BLUE }}>
                                        {currency === "TRY" && hasNumeric ? (
                                          <>
                                            <span>{tryText}</span>
                                            <span className="text-[11px] font-semibold opacity-60">· {eurText}</span>
                                          </>
                                        ) : (
                                          <span>{currency === "TRY" ? tryText : eurText}</span>
                                        )}
                                        <span className="text-[10px] font-medium opacity-70">{pickText(lang, "+ KDV", "+ Tax")}</span>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                          {/* Yeni features[] ikon-grid'i varsa eski generalFeatures
                              madde-listesini gizle (çift gösterim olmasın). */}
                          {featureList.length === 0 && generalList.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {generalList.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                  <div
                                    className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                                    style={{ width: 16, height: 16, background: `${BRAND_BLUE}18`, border: `1px solid ${BRAND_BLUE}30` }}
                                  >
                                    <RiCheckLine size={10} style={{ color: BRAND_BLUE }} />
                                  </div>
                                  <span className="text-sm leading-relaxed" style={{ color: textMuted }}>{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
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
                                  background: d ? "#1c1c22" : "#f8f8fb",
                                  border: `1px solid ${border}`,
                                }}
                              >
                                <div
                                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                                  style={{ width: 36, height: 36, background: `${accent}15`, border: `1px solid ${accent}25`, color: accent }}
                                >
                                  <Ico size={18} />
                                </div>
                                <span className="flex-1 text-sm font-semibold truncate" style={{ color: textPrimary }}>{doc.label || (pickText(lang, "İndir", "Download"))}</span>
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

                {/* Warranty + CE band moved: warranty is now a chip
                    under the description (top of the right column);
                    CE certification already lives in the Belgeler tab
                    via the certificates list, no need to repeat it. */}

              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Akıllı Yönetim tanıtımı (ÖNİZLEME İSKELETİ) — yalnız "Mobil Uygulama"
          (app) veya "OCPP" (ocpp) özellikli akıllı şarj cihazlarında görünür.
          Cihaz mockup'ları CSS yer-tutucudur; GERÇEK ekran görüntüleri +
          uygulama/web panel bağlantıları KULLANICIDAN gelince doldurulacak. ── */}
      {!loading && product && (() => {
        const feats = product.features ?? [];
        const hasApp = feats.includes("app");
        const hasOcpp = feats.includes("ocpp");
        if (!hasApp && !hasOcpp) return null;
        const sd = theme === "dark";
        const cardBg = sd ? "rgba(255,255,255,0.04)" : "#ffffff";
        const txt = sd ? "#f0f0f4" : "#111827";
        const muted = sd ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.55)";
        const PURPLE = "#8B5CF6";
        return (
          <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
            <div
              className="rounded-3xl p-6 sm:p-8 lg:p-10"
              style={{
                background: sd
                  ? `linear-gradient(135deg, ${BRAND_BLUE}1a 0%, ${PURPLE}12 100%)`
                  : `linear-gradient(135deg, ${BRAND_BLUE}0d 0%, ${PURPLE}0a 100%)`,
                border: `1px solid ${sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                {/* SOL: metin + butonlar */}
                <div>
                  <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                    style={{ background: `${BRAND_BLUE}18`, color: sd ? "#93C5FD" : BRAND_BLUE, border: `1px solid ${BRAND_BLUE}30` }}>
                    {pickText(lang, "Akıllı Yönetim", "Smart Management")}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: txt }}>
                    {pickText(lang, "Cihazınızı her yerden yönetin", "Manage your charger from anywhere")}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed mb-5 max-w-md" style={{ color: muted }}>
                    {lang === "en"
                      ? "Real-time monitoring, scheduled charging, user authorization, RFID and reporting — via the Bemis E-V Charge mobile app and web panel."
                      : "Mobil uygulama ve web panel ile anlık izleme, planlı şarj, kullanıcı yetkilendirme, RFID ve raporlama — akıllı Bemis E-V Charge cihazlarında."}
                  </p>
                  {/* Mağaza + web panel butonları — anasayfa SmartCharger ile AYNI linkler. */}
                  <div className="flex flex-wrap gap-2.5">
                    <a href={smartCharger?.appStoreHref || "#"} target={smartCharger?.appStoreHref ? "_blank" : undefined} rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all hover:opacity-85"
                      style={{ background: sd ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: txt, border: `1px solid ${sd ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}` }}>
                      <AppleIcon size={18} />
                      <span className="text-left leading-none"><span className="block text-[9px] mb-0.5" style={{ color: muted }}>{pickText(lang, "İndir", "Download on")}</span><span className="block text-xs font-bold">App Store</span></span>
                    </a>
                    <a href={smartCharger?.playStoreHref || "#"} target={smartCharger?.playStoreHref ? "_blank" : undefined} rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all hover:opacity-85"
                      style={{ background: sd ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: txt, border: `1px solid ${sd ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}` }}>
                      <span style={{ color: "#4CAF50" }}><GooglePlayIcon size={17} /></span>
                      <span className="text-left leading-none"><span className="block text-[9px] mb-0.5" style={{ color: muted }}>{pickText(lang, "İndir", "Get it on")}</span><span className="block text-xs font-bold">Google Play</span></span>
                    </a>
                    {smartCharger?.ctaHref && /^https?:\/\//.test(smartCharger.ctaHref) && (
                      <a href={smartCharger.ctaHref} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: BRAND_BLUE }}>
                        {/* B logosu — Bemis portalı olduğu anlaşılsın */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/favicon-white-192.png" alt="Bemis" className="w-4 h-4 object-contain" /> Web Panel
                      </a>
                    )}
                  </div>
                </div>

                {/* SAĞ: cihaz mockup'ları (CSS yer-tutucu — web panel + mobil HER ZAMAN) */}
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  {/* Web panel (tarayıcı) */}
                  <div className="flex-1 max-w-[290px] rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${sd ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`, boxShadow: "0 16px 40px rgba(0,0,0,0.20)" }}>
                    <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: sd ? "rgba(255,255,255,0.06)" : "#eef0f3" }}>
                      {["#ef4444", "#f59e0b", "#22c55e"].map((cc) => <span key={cc} className="w-2 h-2 rounded-full" style={{ background: cc }} />)}
                      <div className="ml-2 flex-1 h-3 rounded-full" style={{ background: sd ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)" }} />
                    </div>
                    {smartCharger?.mockupWebImage ? (
                      <div style={{ aspectRatio: "16 / 11" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={smartCharger.mockupWebImage} alt="Bemis E-V Charge web paneli" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>
                    ) : (
                      <div className="p-2.5" style={{ aspectRatio: "16 / 11", background: `linear-gradient(150deg, ${PURPLE}, ${BRAND_BLUE})` }}>
                        <div className="flex gap-2 h-full">
                          <div className="w-1/4 rounded-lg p-1.5 flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.12)" }}>
                            {[0, 1, 2, 3].map((i) => <div key={i} className="rounded h-1.5" style={{ background: "rgba(255,255,255,0.5)", width: i === 0 ? "100%" : "70%" }} />)}
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                            <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="rounded h-7" style={{ background: "rgba(255,255,255,0.22)" }} />)}</div>
                            <div className="flex-1 rounded-lg p-2 flex items-end gap-1" style={{ background: "rgba(255,255,255,0.14)" }}>
                              {[40, 65, 50, 80, 55, 72].map((h, i) => <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: "rgba(255,255,255,0.6)" }} />)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Mobil uygulama (telefon) */}
                  <div className="relative flex-shrink-0" style={{ width: 116 }}>
                    <div className="rounded-[1.7rem] p-1.5" style={{ background: sd ? "#0a0a0c" : "#1a1a1a", boxShadow: "0 18px 44px rgba(0,0,0,0.30)" }}>
                      <div className="rounded-[1.3rem] overflow-hidden" style={{ aspectRatio: "9 / 19", background: `linear-gradient(165deg, ${BRAND_BLUE}, ${PURPLE})` }}>
                        {smartCharger?.mockupPhoneImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={smartCharger.mockupPhoneImage} alt="Bemis E-V Charge mobil uygulama" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                          <>
                            <div className="flex justify-between items-center px-3 pt-2">
                              <span className="text-[7px] font-semibold text-white/85">9:41</span>
                              <div className="flex gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="w-1 h-1 rounded-full bg-white/70" />)}</div>
                            </div>
                            <div className="px-3 pt-2 text-white">
                              <div className="text-[8px] font-bold tracking-wide">Bemis E-V Charge</div>
                              <div className="mx-auto mt-2 rounded-full flex items-center justify-center" style={{ width: 50, height: 50, border: "4px solid rgba(255,255,255,0.35)", borderTopColor: "rgba(255,255,255,0.92)" }}>
                                <span className="text-[9px] font-black">7,4</span>
                              </div>
                              <div className="text-[7px] text-center mt-1 text-white/80">Şarj oluyor…</div>
                              <div className="mt-2 space-y-1">{[0, 1].map((i) => <div key={i} className="rounded h-2.5" style={{ background: "rgba(255,255,255,0.2)" }} />)}</div>
                              <div className="mt-2 rounded-lg h-6" style={{ background: "rgba(255,255,255,0.28)" }} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── GERÇEK Müşteri Yorumları — yalnız gerçek pazaryeri yorumu eşleşen
          üründe görünür (server reviewsForProduct → productReviews prop).
          Google kuralı: yıldız şeması ancak yorumlar SAYFADA görünürse
          meşru → şema page.tsx'te, görünür blok burada. ── */}
      {!loading && product && productReviews.length > 0 && (() => {
        const sd = theme === "dark";
        const avg = productReviews.reduce((s, r) => s + Math.max(1, Math.min(5, r.rating)), 0) / productReviews.length;
        return (
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-bold" style={{ color: sd ? "#f0f0f4" : "#111827" }}>
                {pickText(lang, "Müşteri Yorumları", "Customer Reviews")}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-sm font-black tabular-nums" style={{ color: sd ? "#f0f0f4" : "#111827" }}>
                <RiStarFill style={{ color: "#F59E0B", fontSize: 16 }} />
                {avg.toFixed(1)}
                <span className="text-xs font-semibold" style={{ color: sd ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)" }}>
                  · {productReviews.length} {pickText(lang, "değerlendirme", "reviews")}
                </span>
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {productReviews.map((r, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 sm:px-5 py-4 flex flex-col gap-2"
                  style={{
                    background: sd ? "#1c1c22" : "#ffffff",
                    border: `1px solid ${sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex gap-0.5">
                      {Array.from({ length: Math.max(1, Math.min(5, r.rating)) }).map((_, s) => (
                        <RiStarFill key={s} style={{ color: "#F59E0B", fontSize: 13 }} />
                      ))}
                    </span>
                    {r.platform && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${r.platformColor ?? "#FF6000"}14`, color: r.platformColor ?? "#FF6000", border: `1px solid ${r.platformColor ?? "#FF6000"}28` }}>
                        {r.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: sd ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.62)" }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-auto pt-1">
                    <span className="text-xs font-semibold" style={{ color: sd ? "#f0f0f4" : "#111827" }}>{r.author}</span>
                    {r.date && <span className="text-[11px] ml-auto" style={{ color: sd ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.38)" }}>{r.date}</span>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-2.5" style={{ color: sd ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              {pickText(lang, "Yorumlar, ürünün pazaryeri sayfalarındaki gerçek müşteri değerlendirmelerinden alınmıştır.", "Reviews are taken from real customer evaluations on the product's marketplace listings.")}
            </p>
          </div>
        );
      })()}

      {/* ── Sıkça Sorulan Sorular (per-category accordion). max-w
          bumped to 7xl so the section width matches the rest of the
          page rail instead of looking like a narrower side-strip. ── */}
      {!loading && product && category && (() => {
        const faq = (catMeta?.[categoryId]?.faq ?? []).filter((f) => f && f.q && f.a);
        if (faq.length === 0) return null;
        const sd = theme === "dark";
        return (
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
            {/* Google rich-snippet payload — only emitted when there's
                actual content, so empty categories don't pollute SERP. */}
            <JsonLd data={[{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }]} />
            <h2 className="text-base font-bold mb-4" style={{ color: sd ? "#f0f0f4" : "#111827" }}>{pickText(lang, "Sıkça Sorulan Sorular", "Frequently Asked Questions")}</h2>
            {/* SSS — accordion yok, kartlar her zaman 'açık' state'te:
                soru + cevap birlikte görünür. Kart yatay olarak tam
                w-full genişlikte (max-w-7xl parent). Her kart aynı
                visual ağırlığa sahip, kapalı/açık ayrımı yok. */}
            <div className="space-y-2">
              {faq.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl w-full block px-4 sm:px-6 py-5"
                  style={{
                    background: sd ? "#1c1c22" : "#ffffff",
                    border: `1px solid ${sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                  }}
                >
                  <div className="flex items-start gap-3 mb-2.5">
                    <span
                      className="inline-flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                      style={{ width: 28, height: 28, background: `${BRAND_BLUE}14`, border: `1px solid ${BRAND_BLUE}30`, color: BRAND_BLUE }}
                    >
                      <RiAddLine size={14} style={{ transform: "rotate(45deg)" }} />
                    </span>
                    <p className="flex-1 text-sm sm:text-base font-semibold leading-snug" style={{ color: sd ? "#f0f0f4" : "#111827" }}>
                      {item.q}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line pl-[40px]" style={{ color: sd ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)" }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

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
        // Pull more candidates so a horizontal carousel feels populated:
        // up to 8 same-category siblings, then top up from other categories
        // to a max of 12 cards. Plenty to swipe through, never enough to
        // make the bin/page heavy.
        const carousel = [
          ...sameCat.slice(0, 8).map(p => ({ cat: category, prod: p })),
          ...otherCatProds.slice(0, Math.max(0, 12 - sameCat.length)),
        ].slice(0, 12);
        if (carousel.length === 0) return null;
        const scrollCarousel = (dir: "left" | "right") => {
          const el = carouselRef.current;
          if (!el) return;
          const delta = Math.max(240, el.clientWidth * 0.7) * (dir === "left" ? -1 : 1);
          el.scrollBy({ left: delta, behavior: "smooth" });
        };
        return (
          <div className="pb-20">
            <div className="max-w-7xl mx-auto mb-4 px-5 sm:px-6 lg:px-8">
              <h2 className="text-base font-bold" style={{ color: theme === "dark" ? "#f0f0f4" : "#111827" }}>{pickText(lang, "Benzer Ürünler", "Related Products")}</h2>
            </div>
            {/* Carousel runs edge-to-edge so it never visually clips at
                the 7xl rail on wide monitors. snap-proximity (not
                snap-mandatory) keeps scroll-left feeling as natural as
                scroll-right — mandatory was forcing a one-direction
                anchor on trackpads. Side arrows replace the old
                "Tümünü Gör" button — quicker swipe-by-click on desktop,
                hidden on small screens where touch-scroll is natural. */}
            <div className="relative">
              <button
                aria-label="Sola kaydır"
                onClick={() => scrollCarousel("left")}
                className="hidden sm:flex absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-105"
                style={{
                  background: theme === "dark" ? "rgba(20,20,22,0.85)" : "rgba(255,255,255,0.95)",
                  border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                  color: category.accent,
                  backdropFilter: "blur(8px)",
                  boxShadow: theme === "dark" ? "0 4px 16px rgba(0,0,0,0.45)" : "0 4px 18px rgba(0,0,0,0.10)",
                }}
              >
                <RiArrowLeftLine size={18} />
              </button>
              <button
                aria-label="Sağa kaydır"
                onClick={() => scrollCarousel("right")}
                className="hidden sm:flex absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-105"
                style={{
                  background: theme === "dark" ? "rgba(20,20,22,0.85)" : "rgba(255,255,255,0.95)",
                  border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                  color: category.accent,
                  backdropFilter: "blur(8px)",
                  boxShadow: theme === "dark" ? "0 4px 16px rgba(0,0,0,0.45)" : "0 4px 18px rgba(0,0,0,0.10)",
                }}
              >
                <RiArrowRightSLine size={18} />
              </button>
            <div
              ref={carouselRef}
              tabIndex={0} role="region" aria-label="Benzer ürünler — yatay kaydırılabilir liste" className="flex gap-3 overflow-x-auto snap-x snap-proximity scrollbar-hide pl-5 sm:pl-6 lg:pl-8 pr-5 sm:pr-6 lg:pr-8"
              style={{ scrollPaddingLeft: "1.25rem", scrollPaddingRight: "1.25rem", WebkitOverflowScrolling: "touch" }}
            >
              {carousel.map(({ cat, prod }, i) => {
                const CatIcon = categoryIcons[cat.id] ?? RiPlugLine;
                const imgs = prod.images ?? (prod.image ? [prod.image] : []);
                const sd = theme === "dark";
                return (
                  <motion.div
                    key={`${cat.id}-${prod.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.05 }}
                    onClick={() => router.push(`/products/${cat.id}/${prod.id}`)}
                    className="snap-start shrink-0 w-44 sm:w-52 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
                    style={{ background: sd ? "#1c1c22" : "#ffffff", border: `1px solid ${sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.accent}50`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${cat.accent}14`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = sd ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Fixed square image. Padding dropped from p-3 → p-1
                        so the product fills the tile edge-to-edge; the
                        gradient background still shows through wherever
                        the source image is itself padded. */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: "1/1",
                        // Benzer Ürünler görsel-alanı — /products kartlarıyla uyumlu
                        // (aşırı parlak #fafafa / koyu #1c1c1f yerine açık zemin).
                        background: sd
                          ? `linear-gradient(145deg, ${cat.accent}16 0%, transparent 55%), #dbdee3`
                          : `linear-gradient(145deg, ${cat.accent}0f 0%, transparent 55%), #f3f4f6`,
                      }}
                    >
                      {imgs[0] ? (
                        <Image
                          src={imgs[0]} alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          quality={88}
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
                      {(() => {
                        // Ürünleri ayrıştıran kısa spec satırı: güç (kW) + alt başlık
                        // (örn. kablo uzunluğu "5m Kablolu"). Aynı isimli varyantlar
                        // (3m/5m/7m kablolar) böylece kartta ayırt edilir.
                        let kw = "";
                        for (const g of prod.specs ?? []) {
                          for (const it of g.items ?? []) {
                            if (it?.value && /\bkW\b/i.test(it.value)) { kw = it.value.trim(); break; }
                          }
                          if (kw) break;
                        }
                        const parts: string[] = [];
                        if (kw) parts.push(kw);
                        if (prod.subtitle?.trim()) parts.push(prod.subtitle.trim());
                        const line = parts.join(" · ");
                        return (
                          <>
                            <p className="text-[10px] font-semibold truncate" style={{ color: cat.accent }}>{line || cat.name}</p>
                            {line && <p className="text-[9px] truncate mt-0.5" style={{ color: sd ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.40)" }}>{cat.name}</p>}
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            </div>
          </div>
        );
      })()}

      <div style={{ marginTop: "auto" }}>
        <ContactBar />
      </div>
    </div>
  );
}
