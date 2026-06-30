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
import Image from "next/image";
import { ProductGridSkeleton } from "../../components/ProductCardSkeleton";
import { categoryH1 } from "../../lib/seo";

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
  // Karanlık modda kart zemini, sayfa zemininden (#0c0c0e) belirgin ayrışsın diye
  // bir tık daha açık (#1d1d22) + kenarlık azıcık güçlü → kartlar siyah arka planda
  // daha kolay seçilir.
  const surface       = d ? "#1d1d22" : "#ffffff";
  const surfaceBorder = d ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.07)";
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
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="flex items-stretch gap-4 mb-2">
            <div className="flex-shrink-0 rounded-full w-1" style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)" }} />
            <div className="space-y-2 flex-1">
              <div className="h-3 rounded animate-pulse" style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", width: 140 }} />
              <div className="h-6 rounded animate-pulse" style={{ background: d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)", width: 220 }} />
              <div className="h-3 rounded animate-pulse" style={{ background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", width: 320 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 pb-10 w-full">
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  );

  if (!category) return (
    <div style={{ background: bg, minHeight: "100vh", color: textPrimary }} className="flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4" style={{ color: textMuted }}>{lang === "en" ? "Product category not found" : "Ürün kategorisi bulunamadı"}</p>
        <button onClick={() => router.push("/")} className="text-sm font-medium underline" style={{ color: textMuted }}>
          {lang === "en" ? "Back to home" : "Ana sayfaya dön"}
        </button>
      </div>
    </div>
  );

  const Icon = categoryIcons[id] || RiPlugLine;
  const accent = category.accent;
  const categoryDescription = categories?.[id]?.description?.trim() ?? "";
  // Görsel alanı: önce anasayfa kategori görseli (image), yoksa eski
  // descriptionImage. Kullanıcı isteği: kategori sayfasında da anasayfadaki
  // kategori görseli karşılasın (hero arka planı olarak).
  const descImage = categories?.[id]?.image?.trim() || categories?.[id]?.descriptionImage?.trim() || "";
  // Ürün-görselli (şeffaf PNG) kategorilerde hero arka planı BEYAZ olsun
  // (kullanıcı isteği: "ac dc şarj ekipmanları görseli beyaz png").
  const whiteHero = id === "charger-equipment";
  // Kategori görseli tam-genişlik ARKA PLAN hero (sahne fotosu olan kategoriler).
  // whiteHero (charger-equipment, şeffaf ürün PNG'si) bg'ye uymaz → split.
  // Ürün-fotolu (beyaz zemin) kategoriler de split kalır: converters (uzatma
  // kablosu) + accessories (şarj çantası) — düz ürün fotosu tam-bleed'e uymaz.
  // Sahne fotolular (wallbox/portable/cables/v2l-c2l/dc-units) bg-hero olur.
  // Admin "heroStyle" ayarı (categories[id].heroStyle) DAİMA önceliklidir;
  // boşsa aşağıdaki kod varsayılanı kullanılır.
  const productPhotoCategory = id === "converters" || id === "accessories";
  const heroStyleResolved =
    categories?.[id]?.heroStyle ?? (productPhotoCategory ? "split" : "bg");
  const bgHero = !!descImage && !whiteHero && heroStyleResolved !== "split";

  return (
    <div style={{ background: bg, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <EnergyBackground />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Category hero — iki kolon: metin SOLDA, görsel SAĞDA çerçeveli kart
          içinde (contain + padding → kenara yapışmaz, açıklamanın yanında düzgün). */}
      <div className="relative overflow-hidden pt-24 pb-8 px-5 sm:px-6 lg:px-8"
        style={{
          background: d ? `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}10 0%, transparent 70%)` : `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}08 0%, transparent 70%)`,
        }}>
        {bgHero ? (
          /* CABLES: kategori görseli tam-genişlik arka plan; metin sol koyu gradyan üstüne biner. */
          <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <div className="relative overflow-hidden rounded-3xl min-h-[320px] lg:min-h-[420px] flex items-center">
              <Image src={descImage} alt={category.name} fill sizes="(max-width: 1024px) 100vw, 1600px" quality={92} className="object-cover" style={{ objectPosition: "center" }} priority />
              <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(100deg, rgba(8,10,14,0.95) 0%, rgba(8,10,14,0.82) 36%, rgba(8,10,14,0.42) 68%, rgba(8,10,14,0.12) 100%)" }} />
              <div className="absolute left-0 top-0 bottom-0" aria-hidden style={{ width: 4, background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)` }} />
              <div className="relative z-10 px-7 sm:px-10 lg:px-14 py-10 lg:py-12 max-w-2xl">
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
                  className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#8fbcf7" }}>
                  {lang === "en" ? "Product Category" : "Ürün Kategorisi"} · {category.products?.length ?? 0} {lang === "en" ? "Products" : "Ürün"}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {(lang === "tr" && categoryH1(category.id)) || category.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                  className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.72)" }}>
                  {category.tagline}
                </motion.p>
                {categoryDescription && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-sm sm:text-base leading-relaxed whitespace-pre-line mt-4 max-w-xl" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {categoryDescription}
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        ) : (
        <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
          {/* SOL: başlık + açıklama (içerik genişliğinde → görsel açıklamaya yakın durur) */}
          <div className="w-full lg:max-w-2xl min-w-0">
            <div className="flex items-stretch gap-4 mb-2">
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
                  {lang === "en" ? "Product Category" : "Ürün Kategorisi"} · {category.products?.length ?? 0} {lang === "en" ? "Products" : "Ürün"}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: textPrimary }}>
                  {/* TR'de keyword'lü H1 (CATEGORY_SEO.title); yoksa/EN'de CMS adı. CMS verisi değişmez. */}
                  {(lang === "tr" && categoryH1(category.id)) || category.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                  className="text-sm mt-0.5" style={{ color: textMuted }}>
                  {category.tagline}
                </motion.p>
              </div>
            </div>

            {categoryDescription && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-4"
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-2xl" style={{ color: textMuted }}>
                  {categoryDescription}
                </p>
              </motion.div>
            )}
          </div>

          {/* SAĞ: kategori görseli — çerçeveli kart, contain (kırpmaz/yakınlaşmaz) */}
          {descImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full max-w-[300px] mx-auto lg:max-w-[360px] 2xl:max-w-[460px] lg:mx-0 flex-shrink-0"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  // Standart KARE çerçeve — tüm kategorilerde AYNI sabit ölçü.
                  aspectRatio: "1 / 1",
                  background: whiteHero ? "#ffffff" : d ? "#15151b" : "#f1f3f6",
                  border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: d ? "0 10px 40px rgba(0,0,0,0.35)" : "0 10px 36px rgba(0,0,0,0.10)",
                }}
              >
                {/* Sahne/foto görseller kareyi TAM doldurur (object-cover).
                    Ürün-görselli (şeffaf PNG, charger-equipment) beyaz zeminde
                    object-contain ile tam görünür (kırpılmaz). Çerçeve her kategoride aynı. */}
                <Image src={descImage} alt={category.name} fill sizes="(max-width: 1024px) 100vw, 440px" quality={90} className={whiteHero ? "object-contain p-6" : "object-cover"} style={{ objectPosition: "center" }} priority />
              </div>
            </motion.div>
          )}
        </div>
        )}
      </div>

      {/* Product grid — uniform 5-col density across every category so
          a smaller catalog (AC Mobile Chargers, dc-units) renders the
          same compact tile size as a dense category (cables, v2l).
          Empty slots after the last card read as expected catalog
          rhythm, not "broken layout". */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full px-5 sm:px-6 lg:px-8 pb-10">
        {/* 5-sütunlu yoğun grid — her kategori için aynı kart boyutu.
            Az ürünlü kategoriler (AC Mobile Charger gibi) ilk slot'lardan
            soldan başlar, kalan slot'lar boş kalır (CSS grid default).
            Önceki adaptive 3-sütun grid kartları tüm satıra yayıyordu,
            ortalanmış görünüyordu — bu hâl daha tutarlı. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
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
                  // minHeight kaldırıldı — CSS grid satırları zaten en uzun
                  // kartın yüksekliğine kilitleniyor (grid items align stretch
                  // default). Sabit minHeight: 320 az içerikli kartlarda
                  // (AC Mobile gibi) alt taraf boşluğu yaratıyor; /products
                  // sayfasındaki kartlardan görsel olarak farklılaşıyordu.
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
                {/* Product image / icon — height /products listesindeki
                    kartlarla aynı (170px); object-contain ile küçük cihazlar
                    da kartın orta noktasında pürüzsüz oturur. */}
                <div className="relative overflow-hidden" onClick={() => router.push(`/products/${id}/${product.id}`)}
                  style={{ aspectRatio: "1 / 1", background: d ? `linear-gradient(145deg, ${accent}18 0%, transparent 100%), #1c1c1f` : `linear-gradient(145deg, ${accent}14 0%, transparent 100%), #fafafa` }}>
                  {/* TÜM kategoriler KARE (1:1) — foto-uyumu: portable'ın kare fotoları tam dolar,
                      diğer kategorilerin dikey fotoları 170px yatay çerçeveye göre daha büyük/dolu
                      görünür; object-contain ile kırpılmadan oturur. Liste sayfası (ProductsClient) da kare. */}
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
                      {variantCount} {lang === "en" ? "versions" : "versiyon"}
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
                      {group.variants.map(v => v.subtitle).filter(Boolean).join(" · ") || `${variantCount} ${lang === "en" ? "different versions" : "farklı versiyon"}`}
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
                    <span className="text-[10px] font-semibold" style={{ color: accent }}>{lang === "en" ? "Details" : "Detaylar"} →</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SSS — kategori bazlı (CMS'ten). FAQPage JSON-LD sunucu sayfasında. */}
      {(() => {
        const faqList = categories?.[id]?.faq ?? [];
        if (faqList.length === 0) return null;
        return (
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 pb-16 w-full">
            <h2 className="text-2xl font-black mb-5" style={{ color: textPrimary }}>
              {lang === "en" ? "Frequently Asked Questions" : "Sıkça Sorulan Sorular"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
              {faqList.map((f, i) => (
                <div key={i} className="rounded-2xl p-4 sm:p-5" style={{ background: surface, border: `1px solid ${surfaceBorder}` }}>
                  <p className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Push ContactBar to the bottom of the flex column on short
          pages (e.g. a one-row category like dc-units), instead of
          leaving a fat slab of empty wrapper bg below it. */}
      <div style={{ marginTop: "auto" }}>
        <ContactBar />
      </div>
    </div>
  );
}
