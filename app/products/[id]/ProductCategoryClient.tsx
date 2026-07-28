"use client";
import { pickText } from "../../lib/ui";
import CustomProductionSection from "../../components/CustomProductionSection";
import { accentInk } from "../../lib/accentInk";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
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
  RiRulerLine,
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
/**
 * Kategori banner açıklaması — HER EKRANDA (mobil + masaüstü) 2 satıra kırpılır +
 * "Devamını oku" ile açılır. ⚠️ Tam metin DAİMA DOM'da (line-clamp yalnız görsel
 * kırpma) → Google metni tam görür, SEO kaybı YOK. Açıklamalar 247-730 karakter
 * olduğu için masaüstünde de banner'ı bozacak kadar uzundu; teaser + genişletme
 * ile her yerde sade kalır. (Önce yalnız mobilde kırpılıyordu; kullanıcı masaüstünde
 * de görüntünün bozulduğunu bildirdi → kırpma tüm ekranlara alındı.)
 */
function ExpandableDescription({ text, colorStyle, maxWidthClass, buttonColor }: {
  text: string;
  colorStyle: React.CSSProperties;
  maxWidthClass: string;
  buttonColor: string;
}) {
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      // Buton, metin gerçekten 2 satırı aşıyorsa görünür (mobil + masaüstü).
      // Overflow'u yalnız KAPALIYKEN ölç (açıkken clamp yok → yanlış ölçüm olmasın).
      if (expanded) return;
      setOverflowing(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text, expanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className={`mt-4 ${maxWidthClass}`}
    >
      <p
        ref={ref}
        className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${expanded ? "" : "line-clamp-2"}`}
        style={colorStyle}
      >
        {text}
      </p>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: buttonColor }}
          aria-expanded={expanded}
        >
          {expanded ? pickText(lang, "Daha az", "Show less") : pickText(lang, "Devamını oku", "Read more")}
        </button>
      )}
    </motion.div>
  );
}

export default function ProductCategoryPage({ initialCategory = null, titleOverride }: { initialCategory?: CategoryData | null; titleOverride?: string }) {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { categories, projectSection } = useContent();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen]     = useState(false);
  const [category, setCategory]         = useState<CategoryData | null>(initialCategory);
  const [loading, setLoading]           = useState(initialCategory === null);
  const id = typeof params.id === "string" ? params.id : "";
  // ⚠️ Bu bileşen HEM /products/[id] HEM /en/products/[id] altında çalışır.
  // /en'deyken ürün linkleri de /en kalmalı — yoksa İngilizce ziyaretçi tek
  // tıkta Türkçe ürün sayfasına düşüyordu (dil zinciri kopuyordu).
  const pathname = usePathname();
  const base = pathname?.startsWith("/en/") ? "/en/products" : "/products";
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

  const bg            = d ? "#131318" : "#f8f8fb";
  // Solid surface in dark mode so the new background streaks behind
  // the wrapper don't bleed through every listing card.
  // Karanlık modda kart zemini, sayfa zemininden (#131318) belirgin ayrışsın diye
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
        <p className="text-lg mb-4" style={{ color: textMuted }}>{pickText(lang, "Ürün kategorisi bulunamadı", "Product category not found")}</p>
        <button onClick={() => router.push("/")} className="text-sm font-medium underline" style={{ color: textMuted }}>
          {pickText(lang, "Ana sayfaya dön", "Back to home")}
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
  // VARSAYILAN split (yan-yana) kalan kategoriler:
  //  - converters (uzatma kablosu) + accessories (şarj çantası): düz ÜRÜN
  //    fotosu, beyaz zemin — tam-bleed arka plana uymaz.
  //  - wallbox: sahne fotosu ama ÖZNESİ (duvar cihazı) fotoğrafın SOLUNDA;
  //    sol-hizalı metin gradyanı onu örtüyor → çerçeveli görsel daha net.
  // bg-hero olanlar: portable / cables / v2l-c2l / dc-units (öznesi merkez-sağ).
  // Admin "heroStyle" ayarı (categories[id].heroStyle) DAİMA önceliklidir;
  // boşsa aşağıdaki kod varsayılanı kullanılır.
  const splitByDefault =
    id === "converters" || id === "accessories" || id === "wallbox";
  const heroStyleResolved =
    categories?.[id]?.heroStyle ?? (splitByDefault ? "split" : "bg");
  const bgHero = !!descImage && !whiteHero && heroStyleResolved !== "split";
  // bg-hero fotosunun ODAK NOKTASI (object-position). Geniş-kısa hero'da
  // object-cover üst/altı kırpar → dikey odak (Y) hangi yatay şeridin
  // görüneceğini belirler. Dikey fotolu kategoriler (wallbox/portable/cables)
  // için ÖZNE (cihaz/konnektör) görünsün diye Y elle ayarlandı; yataylar
  // (dc-units/v2l-c2l) hafif. Admin descImagePos verirse o önceliklidir.
  const CATEGORY_HERO_FOCUS: Record<string, string> = {
    wallbox: "50% 30%",
    portable: "50% 38%",
    cables: "50% 40%",
    "dc-units": "50% 42%",
    "v2l-c2l": "60% 50%",
  };
  const heroFocus =
    categories?.[id]?.descImagePos?.trim() || CATEGORY_HERO_FOCUS[id] || "center";

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
            {/* Metin DİKEY ALTA hizalı — görselin alt kenarına yakın otursun
                (kullanıcı: "başlık/açıklamayı hero görselin altına yakın, ortada değil"). */}
            <div className="relative overflow-hidden rounded-3xl min-h-[320px] lg:min-h-[420px] flex items-end">
              <Image src={descImage} alt={category.name} fill sizes="(max-width: 1024px) 100vw, 1600px" quality={95} className="object-cover" style={{ objectPosition: heroFocus }} priority />
              {/* Perde (scrim). ⚠️ Gradyan globals.css'te `.cat-hero-scrim` içinde:
                  MOBİLDE daha şeffaf. Neden: masaüstünde metin geniş alana yayıldığı
                  için soldan sağa koyu perde gerekli; mobilde ise kart darken metin
                  perdenin üstünü kaplıyor ve FOTOĞRAF neredeyse hiç görünmüyordu.
                  Mobil gradyan yön değiştirir (üstten alta) ve alfaları düşüktür —
                  metnin oturduğu alt bölge yine yeterince koyu kalır. */}
              <div className="absolute inset-0 cat-hero-scrim" aria-hidden />
              <div className="absolute left-0 top-0 bottom-0" aria-hidden style={{ width: 4, background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)` }} />
              {/* data-keep-white: bu blok KOYU foto + koyu gradyan üstünde durur;
                  aydınlık modda globals.css'teki ".text-white → #111" kuralı H1'i
                  okunmaz hale getiriyordu (koyu zeminde koyu yazı). Kapsayıcıya
                  konunca içerideki beyazlar her iki temada da beyaz kalır. */}
              <div data-keep-white="true" className="cat-hero-text relative z-10 px-7 sm:px-10 lg:px-14 py-10 lg:py-12 max-w-2xl">
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
                  className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#8fbcf7" }}>
                  {pickText(lang, "Ürün Kategorisi", "Product Category")} · {category.products?.length ?? 0} {pickText(lang, "Ürün", "Products")}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {titleOverride || (lang === "tr" && categoryH1(category.id)) || category.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                  className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.72)" }}>
                  {category.tagline}
                </motion.p>
                {categoryDescription && (
                  <ExpandableDescription
                    text={categoryDescription}
                    colorStyle={{ color: "rgba(255,255,255,0.85)" }}
                    maxWidthClass="max-w-xl"
                    buttonColor="rgba(255,255,255,0.92)"
                  />
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
                  className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: accentInk(accent, d) }}>
                  {pickText(lang, "Ürün Kategorisi", "Product Category")} · {category.products?.length ?? 0} {pickText(lang, "Ürün", "Products")}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: textPrimary }}>
                  {/* TR'de keyword'lü H1 (CATEGORY_SEO.title); yoksa/EN'de CMS adı. CMS verisi değişmez. */}
                  {titleOverride || (lang === "tr" && categoryH1(category.id)) || category.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                  className="text-sm mt-0.5" style={{ color: textMuted }}>
                  {category.tagline}
                </motion.p>
              </div>
            </div>

            {categoryDescription && (
              <ExpandableDescription
                text={categoryDescription}
                colorStyle={{ color: textMuted }}
                maxWidthClass="max-w-2xl"
                buttonColor={accent}
              />
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
                <div className="relative overflow-hidden" onClick={() => router.push(`${base}/${id}/${product.id}`)}
                  style={{ aspectRatio: "1 / 1", background: d ? `linear-gradient(150deg, ${accent}16 0%, transparent 55%), #dbdee3` : `linear-gradient(150deg, ${accent}0f 0%, transparent 55%), #f3f4f6` }}>
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
                      style={{ background: accent, border: `1px solid ${accent}`, color: "#ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", textShadow: "0 1px 2px rgba(0,0,0,0.28)" }}>
                      {variantCount} {pickText(lang, "versiyon", "versions")}
                    </div>
                  ) : product.badge && (
                    <div className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: accent, border: `1px solid ${accent}`, color: "#ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", textShadow: "0 1px 2px rgba(0,0,0,0.28)" }}>
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-10"
                    style={{ background: d ? "linear-gradient(to top, rgba(219,222,227,0.92) 0%, transparent 100%)" : "linear-gradient(to top, rgba(243,244,246,0.92) 0%, transparent 100%)" }} />
                </div>

                {/* Info */}
                <div className="px-3 py-3 flex flex-col flex-1" onClick={() => router.push(`${base}/${id}/${product.id}`)}>
                  {/* ⚠️ BAŞLIK GERÇEK LİNK (2026-07-28 denetimi): kart tıklaması `router.push`
                      ile çalışıyordu, yani sayfada ürün detayına giden TEK BİR `<a href>` yoktu.
                      Sonuç: Google ürün sayfalarını yalnız sitemap'ten buluyordu — kategoriden
                      ürüne iç link akışı ve ÇAPA METNİ (ürün adı) hiç oluşmuyordu; kullanıcı da
                      kartı yeni sekmede açamıyordu. Aynı ders footer'da alınmıştı (button→a).
                      ⚠️ Kartın TAMAMINI <a> ile sarma: içinde varyant butonları var → geçersiz
                      HTML. Yalnız başlık link; kartın kendi onClick'i aynen duruyor.
                      `stopPropagation` çift gezinmeyi önler. Görünüm birebir aynı. */}
                  <Link
                    href={`${base}/${id}/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-xs leading-tight mb-0.5 block"
                    style={{ color: textPrimary }}
                  >
                    {product.name}
                  </Link>
                  {variantCount > 1 ? (
                    /* Varyantlar TIKLANABİLİR (2026-07-25): aynı adlı modeller tek kartta
                       gruplanıyor (ör. 3 Otomatlı IP44 Kombinasyon) — eskiden varyantlar
                       yalnız düz metin listesiydi, tek tek modele gidilemiyordu. Artık her
                       varyant kendi ürün sayfasına gider; kart tıklaması ana modele gider. */
                    <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>
                      {group.variants.filter(v => v.subtitle).map((v, vi, arr) => (
                        <span key={v.id}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); router.push(`${base}/${id}/${v.id}`); }}
                            className="cursor-pointer underline decoration-dotted underline-offset-2 transition-colors hover:opacity-100 active:opacity-70"
                            style={{ color: "inherit" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accentInk(accent, d); }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "inherit"; }}
                            aria-label={`${product.name} — ${v.subtitle}`}
                          >
                            {v.subtitle}
                          </button>
                          {vi < arr.length - 1 && " · "}
                        </span>
                      ))}
                      {group.variants.filter(v => v.subtitle).length === 0 &&
                        `${variantCount} ${pickText(lang, "farklı versiyon", "different versions")}`}
                    </p>
                  ) : product.subtitle && (
                    <p className="text-[10px] leading-snug mb-2" style={{ color: textFaint }}>{product.subtitle}</p>
                  )}
                  {id === "cables" ? (() => {
                    // Kablo kartlarında EN ÖNEMLİ ayrım kW (güç); yanında kablo
                    // kesiti (çap). specs içinden etikete göre bul, kesiti kısalt.
                    const findSpec = (rx: RegExp): string | null => {
                      for (const g of product.specs ?? []) {
                        const it = (g.items ?? []).find((i) => rx.test(i.label));
                        if (it) return it.value;
                      }
                      return null;
                    };
                    const power = findSpec(/güç|power/i);
                    const kesitRaw = findSpec(/kesit|cross|section/i);
                    const kesit = kesitRaw
                      ? (kesitRaw.match(/\d+\s*[×x]\s*[\d.,]+\s*mm²?/i)?.[0]?.replace(/\s+/g, "") ?? kesitRaw.split("+")[0].trim())
                      : null;
                    if (!power && !kesit) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {power && (
                          <span className="text-[11px] font-extrabold px-2 py-[3px] rounded-md leading-none"
                            style={{ background: accent, color: "#ffffff" }}>
                            {power}
                          </span>
                        )}
                        {kesit && (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold px-1.5 py-[3px] rounded-md leading-none"
                            style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textMuted }}>
                            <RiRulerLine size={11} style={{ opacity: 0.75 }} />
                            {kesit}
                          </span>
                        )}
                      </div>
                    );
                  })() : product.specs?.[0]?.items?.length > 0 && (
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
                    <span className="text-[10px] font-semibold" style={{ color: accentInk(accent, d) }}>{pickText(lang, "Detaylar", "Details")} →</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Projeye özel üretim tanıtım kartı — yalnız seçili kategorilerde (admin:
          content.projectSection.categories, varsayılan wallbox + cables). Ürünler↔SSS arası.
          Paylaşılan CustomProductionSection (/uretici OEM sayfasıyla AYNI tasarım dili). */}
      {(() => {
        const ps = projectSection;
        if (!ps?.enabled || !Array.isArray(ps.categories) || !ps.categories.includes(id)) return null;
        return (
          <CustomProductionSection
            eyebrow={ps.eyebrow}
            title={ps.title}
            description={ps.description}
            swatches={ps.swatches}
            accent={accent}
            ctaPrimaryLabel={ps.ctaPrimaryLabel}
            ctaPrimaryHref={ps.ctaPrimaryHref || "/iletisim"}
            ctaSecondaryLabel={ps.ctaSecondaryLabel}
            ctaSecondaryHref={ps.ctaSecondaryHref || "/#dealer"}
            outerClassName="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 pb-14 w-full"
          />
        );
      })()}

      {/* SSS — kategori bazlı (CMS'ten). FAQPage JSON-LD sunucu sayfasında. */}
      {(() => {
        const faqList = categories?.[id]?.faq ?? [];
        if (faqList.length === 0) return null;
        return (
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 pb-16 w-full">
            <h2 className="text-2xl font-black mb-5" style={{ color: textPrimary }}>
              {pickText(lang, "Sıkça Sorulan Sorular", "Frequently Asked Questions")}
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

      {/* İlgili Rehberler — kategori→blog çapraz-link (topikal otorite +
          AI Bakışı/GEO kaynak-seçilme sinyali). Yalnız TR; eşleşen kategoride. */}
      {(() => {
        if (lang === "en") return null;
        const GUIDES: Record<string, { label: string; href: string }[]> = {
          cables: [
            { label: "Şarj kablosu kaç metre, kaç amper olmalı?", href: "/blog/elektrikli-arac-sarj-kablosu-kac-metre-kac-amper" },
            { label: "Şarj kablosu dışarıda/yağmurda kullanılır mı?", href: "/blog/elektrikli-arac-sarj-kablosu-disarida-yagmurda-kullanilir-mi" },
            { label: "EV şarj kablosu seçimi (Type 2)", href: "/blog/ev-sarj-kablosu-secimi-type-2" },
          ],
          wallbox: [
            { label: "Ev şarj ünitesi mi, taşınabilir cihaz mı?", href: "/blog/ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi" },
            { label: "EV için şarj cihazı nasıl seçilir?", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
            { label: "Apartmana / siteye şarj istasyonu kurulumu", href: "/blog/apartmana-sarj-istasyonu-kurulumu" },
          ],
          portable: [
            { label: "Ev şarj ünitesi mi, taşınabilir cihaz mı?", href: "/blog/ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi" },
            { label: "Şarj kablosu kaç metre, kaç amper olmalı?", href: "/blog/elektrikli-arac-sarj-kablosu-kac-metre-kac-amper" },
          ],
          "dc-units": [
            { label: "AC ve DC şarj farkı nedir?", href: "/blog/ac-dc-sarj-farki" },
            { label: "Şarj istasyonu nasıl çalışır?", href: "/blog/elektrikli-arac-sarj-istasyonu-nasil-calisir" },
          ],
          "v2l-c2l": [
            { label: "IONIQ 5 V2L nasıl kullanılır?", href: "/blog/ioniq-5-v2l-nasil-kullanilir" },
            { label: "Togg V2L: araçtan elektrik", href: "/blog/togg-v2l-aractan-elektrik" },
          ],
        };
        const guides = GUIDES[id];
        if (!guides || guides.length === 0) return null;
        return (
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 pb-16 w-full">
            <h2 className="text-2xl font-black mb-5" style={{ color: textPrimary }}>İlgili Rehberler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
              {guides.map((g) => (
                <a key={g.href} href={g.href} className="rounded-2xl p-4 flex items-center gap-3 transition-transform hover:-translate-y-0.5" style={{ background: surface, border: `1px solid ${surfaceBorder}` }}>
                  <span className="text-sm font-semibold leading-snug" style={{ color: textPrimary }}>{g.label}</span>
                  <span className="ml-auto text-lg flex-shrink-0" style={{ color: accentInk(accent, d) }}>→</span>
                </a>
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
