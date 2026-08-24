"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiSearch, HiChevronDown } from "react-icons/hi";
import { HiSun, HiMoon } from "react-icons/hi2";
import { RiArrowRightLine, RiFileTextLine } from "react-icons/ri";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { byLang, pickText } from "../lib/ui";
import { useContactOverlay } from "../context/ContactOverlayContext";
import E from "./E";
import LanguageSwitcher from "./LanguageSwitcher";
import { scrollToSection } from "../lib/smoothScroll";

const navLinks = [
  { label: "Ana Sayfa",   href: "#hero"             },
  { label: "Hakkımızda",  href: "#dna"              },
  { label: "Ürünler",     href: "#products"         },
  { label: "Bayi Ağı",    href: "#dealer"           },
  { label: "Kurumsal",    href: "#b2bcta"           },
  { label: "Hesaplayıcı", href: "#calculator"       },
  { label: "Dökümanlar",  href: "/documents"        },
  { label: "İletişim",    href: "/iletisim"         },
];

// Tiny brand mark — the actual white Bemis favicon (the same PNG we
// serve as /favicon-white-192.png and use on the dealer-map HQ pin)
// placed inside a rounded-square colour fill. Each Kurumsal sub-page
// uses a different accent colour so the visitor can tell them apart
// at a glance; Hakkımızda's single entry uses the canonical favicon
// red. Using the real logo (not a stand-in "B" letter) keeps the
// brand language consistent.
function BemisMark({ accent, size = 28 }: { accent: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        background: accent,
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon-white-192.png"
        alt=""
        width={size}
        height={size}
        style={{ width: "78%", height: "78%", objectFit: "contain" }}
      />
    </span>
  );
}

// Accents match the destination page's own color palette so the
// dropdown chip and the landing page hero read as the same brand
// surface, not random palette picks. Localized labels keyed by lang
// — falls back to TR when key is missing.
type DropdownItem = {
  label: { tr: string; en: string };
  sub:   { tr: string; en: string };
  href: string;
  accent: string;
  /** ⚠️ SADECE TÜRKÇE menüde göster (2026-08-03).
   *  Bazı sayfalar bilinçli olarak yalnız Türkiye pazarına yazıldı ve içeriği
   *  Türkçe: araç uyumluluk tablosu (Togg/TR tesisatı), şehir iniş sayfaları.
   *  Menü etiketi çevrili olduğu için yabancı ziyaretçi İNGİLİZCE bir maddeye
   *  tıklayıp TÜRKÇE sayfaya düşüyordu. Bu bayrak onu engeller.
   *  📌 Sayfayı gerçekten çevirirsen bu bayrağı KALDIR. */
  trOnly?: boolean;
};

const KURUMSAL_DROPDOWN: DropdownItem[] = [
  {
    label: { tr: "OEM & Üreticiler", en: "OEM & Manufacturers" },
    sub:   { tr: "Teknik portföy ve mühendislik desteği", en: "Technical portfolio & engineering support" },
    href: "/b2b", accent: "#F59E0B",
  },
  {
    label: { tr: "Bayi & Distribütör", en: "Dealer & Distributor" },
    sub:   { tr: "Türkiye bayilik & yurtdışı distribütörlük", en: "Türkiye dealership & international distribution" },
    href: "/bayilik", accent: "#10B981",
  },
  {
    label: { tr: "Şarj Ağı Operatörleri", en: "Charging Network Operators" },
    sub:   { tr: "OCPP ekipman, DLM, uzaktan izleme", en: "OCPP equipment, DLM, remote monitoring" },
    href: "/operator", accent: "#3B82F6",
  },
];

const HAKKIMIZDA_DROPDOWN: DropdownItem[] = [
  {
    label: { tr: "Bemis Dünyası", en: "Bemis World" },
    sub:   { tr: "Tarihçe, marka hikayesi, Bemis grubu", en: "History, brand story, Bemis group" },
    href: "/kurumsal", accent: "#3B82F6",
  },
  {
    label: { tr: "Yerli Üretim", en: "Local Manufacturing" },
    sub:   { tr: "Türkiye'de üretim, üretim süreci, OEM", en: "Made in Türkiye, production, OEM" },
    href: "/uretici", accent: "#DC0E1A",
  },
  {
    label: { tr: "Blog & Haberler", en: "Blog & News" },
    sub:   { tr: "Rehberler, haberler ve fuar paylaşımları", en: "Guides, news & trade-show updates" },
    href: "/blog", accent: "#10B981",
  },
];

// "Rehber" dropdown (eski "Hesaplayıcı" linki) — alt: Hesaplayıcı + Rehberler + SSS.
const REHBER_DROPDOWN: DropdownItem[] = [
  // ⚠️ EN ÜSTTE: arızalı ürünü olan kullanıcı için en acil giriş (denetim 2026-07-26 —
  // menüde destek girişi hiç yoktu). Üst menüye AYRI madde eklemek yerine buraya
  // konuldu: menü çubuğu uzamıyor (RU/DE'de taşma riski yok), "yardım" kümesiyle
  // (hesaplayıcı/rehber/SSS/sözlük) aynı yerde duruyor.
  {
    label: { tr: "Arıza & Garanti", en: "Support & Warranty" },
    sub:   { tr: "Ürününüz çalışmıyorsa buradan başlayın", en: "Start here if your product isn't working" },
    href: "/destek", accent: "#EF4444",
  },
  {
    label: { tr: "Hesaplayıcı", en: "Calculator" },
    sub:   { tr: "Maliyet & şarj süresi hesaplama", en: "Cost & charge-time calculator" },
    href: "#calculator", accent: "#10B981",
  },
  {
    label: { tr: "Rehberler", en: "Guides" },
    sub:   { tr: "EV şarj rehberleri & teknik yazılar", en: "EV charging guides & articles" },
    href: "/blog#rehberler", accent: "#3B82F6",
  },
  {
    label: { tr: "SSS", en: "FAQ" },
    sub:   { tr: "Sıkça sorulan sorular", en: "Frequently asked questions" },
    href: "/blog#sss", accent: "#F59E0B",
  },
  {
    label: { tr: "Sözlük", en: "Glossary" },
    sub:   { tr: "EV şarj terimleri (Type 2, OCPP, V2L…)", en: "EV charging terms" },
    href: "/sozluk", accent: "#8B5CF6",
  },
];

// Döküman kategorileri (public /documents sayfası ile birebir) — navbar
// "Dökümanlar" dropdown'ında yüklü dökümanlar bu kategoriler altında listelenir.
type NavDoc = { id: string; title: string; category: string; lang?: string; visible?: boolean; coverUrl?: string };
const DOC_CATEGORIES: { id: string; label: { tr: string; en: string }; accent: string }[] = [
  // ⚠️ SIRA KASITLI (2026-08-22, kullanıcı kararı): `loadDocs()` bu dizideki
  //    İLK DOLU kategoriyi otomatik açar → menü açılınca önce KATALOG görünür.
  //    Fiyat listesi eskiden birinciydi ve otomatik açılıyordu; müşteri gözüne
  //    ilk çarpan o oluyordu. Kaldırılmadı, yalnız EN ALTA alındı.
  { id: "catalog",      label: { tr: "Katalog",          en: "Catalog" },            accent: "#3B82F6" },
  { id: "installation", label: { tr: "Kurulum Kılavuzu", en: "Installation Guide" }, accent: "#10B981" },
  { id: "technical",    label: { tr: "Teknik Döküman",   en: "Technical Document" }, accent: "#EF4444" },
  { id: "certificate",  label: { tr: "Sertifikalar",     en: "Certificates" },       accent: "#8B5CF6" },
  { id: "other",        label: { tr: "Diğer",            en: "Other" },              accent: "#6B7280" },
  { id: "price-list",   label: { tr: "Fiyat Listesi",    en: "Price List" },         accent: "#F59E0B" },];

const NAV_STRINGS = {
  urunlerHeading: { tr: "Ürün Kategorileri", en: "Product Categories" },
  urunlerFooter: { tr: "Tüm ürünlere göz at", en: "Browse all products" },
  urunlerFooterMobile: { tr: "→ Tüm ürünlere göz at", en: "→ Browse all products" },
};

// Brand colour per category — used as a tiny accent dot in the navbar
// dropdown and on the category-page header. The previous icon-per-
// category mapping kept colliding with what each icon actually meant
// (cables ≠ flashlight, dc-units ≠ flashlight, charger-equipment ≠ plug,
// …); a coloured bullet reads as a stable visual identifier without
// pretending to symbolise the category.
const CATEGORY_ACCENTS: Record<string, string> = {
  "wallbox":           "#3B82F6",
  "portable":          "#10B981",
  "cables":            "#F59E0B",
  "v2l-c2l":           "#818CF8",
  "converters":        "#06B6D4",
  "charger-equipment": "#64748B",
  "accessories":       "#A855F7",
  "dc-units":          "#F97316",
};

// Dropdown menüsünde kategori başına gösterilecek TEMSİLİ ÜRÜN görseli
// (şeffaf PNG). Kategori atmosfer görseli yerine ürün görseli — küçük
// thumbnail'da daha net okunur. Kullanıcı isteği: "görselleri ürünlerden al".
const CATEGORY_MENU_IMAGE: Record<string, string> = {
  // 2026-08-05: wallbox ESKİ Charger 2 render'ını (hiçbir üründe kullanılmıyordu),
  // portable ise MINI Mobile'ı gösteriyordu → ikisi de yeni amiral görsellere alındı:
  // yeni Charger 2 (karbon yüzey) ve Pro Mobile 2 (11-22 kW).
    // 2026-08-07: kullanici 3 Charger 2 varyantinin da gorselini adminden
  // yeniledi (yeni nesil: cihazda "CHARGER 2", tus "Gucunu Sec / Select
  // Power", logo "bemis E-V CHARGE"). Kategori karti ve bu menu gorseli
  // ONCEKI nesilde (wk5wmt8 — yalnizca "CHARGER") kalmisti.
  "wallbox":           "https://res.cloudinary.com/dmnttjyzm/image/upload/v1786123494/products/lsbwdmmqz2uz4hkx4z4n.png",
  // 2026-08-07: Pro Mobile 2'nin YENİ render'ı (cihaz üstünde "PRO MOBILE 2",
  // tuş "Gücünü Seç / Select Power" = 6 kademe amper). Eskisi "PRO MOBILE" +
  // "16A./32A. · 3 sec press" idi, yani önceki cihaz kuşağını gösteriyordu.
  "portable":          "https://res.cloudinary.com/dmnttjyzm/image/upload/v1786127169/products/y8rcddosrb8tffo1l9aq.png",
  "cables":            "https://res.cloudinary.com/dmnttjyzm/image/upload/v1783074926/products/m4xy2xidais3lsqebpbr.png",
  "v2l-c2l":           "https://res.cloudinary.com/dmnttjyzm/image/upload/v1783074942/products/un6onm3b6kihvwfgbp3w.png",
  "converters":        "https://res.cloudinary.com/dmnttjyzm/image/upload/v1783074998/products/kuxlacga82z0pbt2tqyt.png",
  "charger-equipment": "https://res.cloudinary.com/dmnttjyzm/image/upload/v1783075211/products/slovarwtn9dt80fx55zc.png",
  "accessories":       "https://res.cloudinary.com/dmnttjyzm/image/upload/v1783075098/products/hjtuhulovozll09t9ijg.png",
  // 2026-08-07: BEVDC 40 duvar tipinin yeni render'ı. Eskisi (zcprvbro…)
  // hem duvar hem direk tipinin PAYLAŞTIĞI görseldi; direk tipi onu
  // kullanmaya devam ediyor. ⓘ Görsel çok uzun (1435×3469) ama menü
  // küçük görseli `object-contain` kullandığı için kırpılmaz.
  "dc-units":          "https://res.cloudinary.com/dmnttjyzm/image/upload/v1786127189/products/i3qo3mkpseelmdgb7iiu.png",
};

interface NavbarProps {
  onSearchOpen: () => void;
}

// Döküman listesi oturum boyunca TEK KEZ çekilir (6,8 KB). Modül seviyesinde
// durduğu için sayfa geçişlerinde Navbar yeniden kurulsa da istek tekrarlanmaz.
let docsCache: NavDoc[] | null = null;
let docsPromise: Promise<NavDoc[]> | null = null;
function fetchDocsOnce(): Promise<NavDoc[]> {
  if (docsCache) return Promise.resolve(docsCache);
  if (!docsPromise) {
    docsPromise = fetch("/api/documents")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { docsCache = Array.isArray(d) ? d : []; return docsCache; })
      .catch(() => { docsPromise = null; return []; });
  }
  return docsPromise;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileKurumsalOpen, setMobileKurumsalOpen] = useState(false);
  const [mobileUrunlerOpen, setMobileUrunlerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"kurumsal" | "urunler" | "hakkimizda" | "rehber" | "dokumanlar" | null>(null);
  const [mobileHakkimizdaOpen, setMobileHakkimizdaOpen] = useState(false);
  const [mobileRehberOpen, setMobileRehberOpen] = useState(false);
  const [mobileDokumanlarOpen, setMobileDokumanlarOpen] = useState(false);
  const kurumsalRef = useRef<HTMLDivElement>(null);
  const urunlerRef = useRef<HTMLDivElement>(null);
  const hakkimizdaRef = useRef<HTMLDivElement>(null);
  const rehberRef = useRef<HTMLDivElement>(null);
  const dokumanlarRef = useRef<HTMLDivElement>(null);
  // Dökümanlar dropdown verisi. ⚠️ 2026-07-28: menü "yükleniyor" diye bekletiyordu.
  // İki sebep vardı: (a) `cache:"no-store"` her açılışta TAM istek attırıyordu,
  // (b) Navbar her sayfa geçişinde yeniden kurulduğu için state sıfırlanıyor ve
  // döküman listesi baştan çekiliyordu. Çözüm: MODÜL seviyesinde oturum önbelleği
  // (aşağıdaki docsCache/docsPromise) + boşta ön-yükleme → menü anında açılır.
  const [docs, setDocs] = useState<NavDoc[] | null>(null);
  const [openDocCat, setOpenDocCat] = useState<string | null>(null);
  const docsLoadingRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const { navbar: navbarContent, logos, categories } = useContent();
  const { lang } = useLanguage();
  const { openContact } = useContactOverlay();
  const activeNavLinks = navbarContent?.links?.length ? navbarContent.links : navLinks;
  const logoSrc = logos?.dark || "/logo-white.png";
  const router = useRouter();
  const pathname = usePathname();

  // Ana sayfada en tepede navbar şeffaf ve KOYU hero görselinin üstünde
  // durur → bu durumda (açık modda) ön plan, karanlık moddaki gibi BEYAZ
  // olmalı. Kaydırınca beyaz arka plan gelince tekrar KOYU ön plana döner.
  // Diğer sayfalarda tepe zaten açık olduğundan dokunulmuyor (siyah kalır).
  const lightTop = pathname === "/" && !isDark && !scrolled;

  const logoFilter = (isDark || lightTop) ? undefined : "brightness(0)";
  const navWordClass = isDark
    ? "text-white/80 hover:text-white"
    : lightTop ? "text-white/90 hover:text-white" : "text-black/85 hover:text-black";
  const navUnderlineClass = (isDark || lightTop) ? "bg-white/50" : "bg-black/50";
  const iconBtnClass = isDark
    ? "text-white/50 hover:text-white hover:bg-white/6"
    : lightTop ? "text-white/80 hover:text-white hover:bg-white/10" : "text-black/50 hover:text-black hover:bg-black/5";
  const mobileIconClass = isDark ? "text-white/70" : lightTop ? "text-white/90" : "text-black";
  const langBorder = isDark
    ? "1px solid rgba(255,255,255,0.10)"
    : lightTop ? "1px solid rgba(255,255,255,0.30)" : "1px solid rgba(0,0,0,0.12)";
  const langActiveBg = isDark
    ? "rgba(255,255,255,0.12)" : lightTop ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.08)";
  const langActiveColor = (isDark || lightTop) ? "#ffffff" : "#111111";
  const langIdleColor = isDark
    ? "rgba(255,255,255,0.35)" : lightTop ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.35)";
  // 6-dil seçici açılır panel renkleri (okunur solid zemin, tema-uyumlu)
  const langPanelBg = isDark ? "#16171c" : "#ffffff";
  const langPanelBorder = isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)";
  const langPanelText = isDark ? "#e8e8ea" : "#1a1a1a";
  const b2bColor       = isDark ? "rgba(255,255,255,0.65)" : lightTop ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.70)";
  const b2bBorderColor = isDark ? "rgba(255,255,255,0.18)" : lightTop ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.18)";
  const b2bBg          = isDark ? "rgba(255,255,255,0.05)" : lightTop ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.03)";
  const b2bHoverColor  = isDark ? "#ffffff" : lightTop ? "#ffffff" : "#3B82F6";
  const b2bHoverBorder = isDark ? "rgba(96,165,250,0.55)" : lightTop ? "rgba(255,255,255,0.65)" : "rgba(59,130,246,0.55)";

  const categoryList = categories
    ? Object.entries(categories as Record<string, { name: string; subtitle?: string; image?: string }>).map(([key, val]) => ({
        key,
        name: val.name,
        subtitle: val.subtitle ?? "",
        image: CATEGORY_MENU_IMAGE[key] || val.image?.trim() || "",
        href: `/products/${key}`,
        accent: CATEGORY_ACCENTS[key] ?? "#3B82F6",
      }))
    : [];

  useEffect(() => {
    // Passive listener so wheel/touch scrolling never blocks on this
    // handler; rAF coalesces bursts so setScrolled only fires when the
    // 40-px threshold is crossed, not on every scroll tick.
    let raf = 0;
    let last = false;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > 40;
        if (next !== last) {
          last = next;
          setScrolled(next);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (raf) cancelAnimationFrame(raf);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSearchOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!href.startsWith("#")) {
      router.push(href);
    } else if (pathname !== "/") {
      router.push("/" + href);
    } else {
      const target = document.querySelector(href) as HTMLElement | null;
      if (!target) return;
      // ⚠️⚠️ 2026-07-29 — BURASI `scrollIntoView({block:"center"})` İDİ, İKİ AYRI
      // KUSURU VARDI (kullanıcı: "Bayi Ağı'na basınca haritaya götürmüyor"):
      // (1) ÇERÇEVELEME: "center" bölümün geometrik ortasını ekranın ortasına
      //     hizalar. Bayi Ağı bölümü ölçüldü = 1149px; ortalayınca bölümün 574px
      //     içine, yani başlığın ve haritanın ALTINDAKİ bayi listesine düşüyordu.
      // (2) HAREKETLİ HEDEF: tarayıcının smooth kaydırması hedefi tek seferde
      //     hesaplar; aradaki `content-visibility:auto` bölümler kaydırma sürerken
      //     gerçek yüksekliklerine açıldığı için o hedef bayatlıyordu. Bu kusur
      //     Hero'nun CTA'sında zaten teşhis edilip çözülmüştü ama menü tarafına
      //     hiç uygulanmamıştı.
      // İkisi de app/lib/smoothScroll.ts içindeki ORTAK yardımcıda çözülüyor.
      scrollToSection(target);
    }
  };

  // Dökümanları yalnız dropdown ilk açıldığında çek (navbar her sayfada olduğu
  // için mount'ta gereksiz istek olmasın). /api/documents = yayındaki dökümanlar.
  const loadDocs = () => {
    if (docs !== null || docsLoadingRef.current) return;
    docsLoadingRef.current = true;
    fetchDocsOnce().then((arr) => {
      setDocs(arr);
      // İlk dolu kategoriyi otomatik aç → dropdown açılınca boş görünmesin.
      const first = DOC_CATEGORIES.find((c) => arr.some((x) => x?.category === c.id));
      if (first) setOpenDocCat(first.id);
    });
  };

  // ⚠️ Boşta ÖN-YÜKLEME: kullanıcı menüye gelmeden, tarayıcı boştayken listeyi çek.
  // Modül önbelleği sayesinde oturumda tek istek olur; menü anında açılır.
  // (Kritik yükü etkilememesi için requestIdleCallback / 2 sn geri düşüş.)
  useEffect(() => {
    let iptal = false;
    const cek = () => { if (!iptal) fetchDocsOnce(); };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(cek, { timeout: 3000 });
      return () => { iptal = true; (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(id); };
    }
    const t = setTimeout(cek, 2000);
    return () => { iptal = true; clearTimeout(t); };
  }, []);

  const openDropdown = (which: "kurumsal" | "urunler" | "hakkimizda" | "rehber" | "dokumanlar") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (which === "dokumanlar") loadDocs();
    setActiveDropdown(which);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const isKurumsal = (link: { label: string; href: string }) =>
    link.label === "Kurumsal" || link.href === "#b2bcta" || link.href === "/b2b";

  const isUrunler = (link: { label: string; href: string }) =>
    link.label === "Ürünler" || link.href === "#products";

  const isHakkimizda = (link: { label: string; href: string }) =>
    link.label === "Hakkımızda" || link.href === "#dna";

  // "Hesaplayıcı" linki artık "Rehber" dropdown'ı (Hesaplayıcı + Rehberler + SSS).
  const isRehber = (link: { label: string; href: string }) =>
    link.href === "#calculator" || link.label === "Rehber" || link.label === "Guide";

  const isDokumanlar = (link: { label: string; href: string }) =>
    link.href === "/documents" || link.label === "Dökümanlar" || link.label === "Documents";

  // Yüklü dökümanları kategoriye göre grupla (boş kategoriler menüde gizlenir).
  const docCategories = DOC_CATEGORIES
    .map((c) => ({ ...c, items: (docs ?? []).filter((d) => d?.category === c.id) }))
    .filter((c) => c.items.length > 0);

  const dropdownBase = {
    background: isDark ? "rgba(12,13,18,0.97)" : "rgba(255,255,255,0.98)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
    boxShadow: isDark
      ? "0 20px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
      : "0 16px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
    backdropFilter: "blur(20px)",
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-[#0A0A0A]/97 backdrop-blur-xl border-b border-white/8 shadow-xl"
            : "bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* gap-3: gruplar (logo/menü/sağ) daralınca bile ASLA bitişemez — genişken
            justify-between zaten daha fazla boşluk dağıttığı için görünüm değişmez. */}
        <div className="flex items-center justify-between gap-3 h-16">

          {/* Logo */}
          {/* ⚠️ shrink-0 (v4 adı) — eski `flex-shrink-0` Tailwind v4'te YOK (ölü sınıf);
              koruma sessizce düşünce dar masaüstünde (1024-1200) flex logoyu 79px'e
              eziyordu ("menü logonun üstüne biniyor" şikayeti, 2026-07-18). Logo lg
              aralığında h-11 kompakt, ≥xl bugünkü h-14 (görünüm ≥1280'de DEĞİŞMEZ). */}
          <button className="shrink-0 focus:outline-none" onClick={() => handleNavClick("#hero")} aria-label={pickText(lang, "Ana sayfa", "Home")}>
            <Image src={logoSrc} alt="Bemis E-V Charge" width={200} height={64} quality={90}
              className="h-11 sm:h-14 lg:h-11 xl:h-14 w-auto object-contain block" style={{ filter: logoFilter }} priority />
          </button>

          {/* Desktop Nav — gap lg aralığında sıkı (2.5), ≥xl bugünkü 6 (değişmez) */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-6">
            {activeNavLinks.map((link, idx) => {
              const isK = isKurumsal(link);
              const isU = isUrunler(link);
              const isH = isHakkimizda(link);
              const isR = isRehber(link);
              const isD = isDokumanlar(link);
              const hasDropdown = isK || isU || isH || isR || isD;
              const dropdownKey: "kurumsal" | "urunler" | "hakkimizda" | "rehber" | "dokumanlar" =
                isK ? "kurumsal" : isU ? "urunler" : isH ? "hakkimizda" : isD ? "dokumanlar" : "rehber";
              const isOpen = activeDropdown === dropdownKey;

              return (
                <div key={link.href + idx} className="relative"
                  ref={isK ? kurumsalRef : isU ? urunlerRef : isH ? hakkimizdaRef : isR ? rehberRef : isD ? dokumanlarRef : undefined}
                  onMouseEnter={hasDropdown ? () => openDropdown(dropdownKey) : undefined}
                  onMouseLeave={hasDropdown ? scheduleClose : undefined}
                >
                  <button
                    onClick={() => handleNavClick(isK ? "#b2bcta" : isR ? "/blog#rehberler" : link.href)}
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 relative group ${navWordClass}`}
                  >
                    <E field={`navbar.links.${idx}.label`} tag="span">{link.label}</E>
                    {hasDropdown && <HiChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />}
                    <span className={`absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${navUnderlineClass}`} />
                  </button>

                  {/* Kurumsal Dropdown */}
                  {isK && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          onMouseEnter={() => openDropdown("kurumsal")}
                          onMouseLeave={scheduleClose}
                          className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
                          style={{ width: 300, ...dropdownBase }}
                        >
                          <div className="p-1.5 space-y-0.5">
                            {KURUMSAL_DROPDOWN.map((item) => (
                              <button
                                key={item.href}
                                onClick={() => { setActiveDropdown(null); router.push(item.href); }}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150"
                                style={{ background: "transparent" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              >
                                <div className="flex-shrink-0">
                                  <BemisMark accent={item.accent} size={36} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold leading-tight" style={{ color: isDark ? "#f0f0f4" : "#1a1a1a" }}>{byLang(item.label, lang)}</p>
                                  <p className="text-[11px] mt-0.5 leading-tight" style={{ color: isDark ? "rgba(240,240,244,0.45)" : "rgba(26,26,26,0.45)" }}>{byLang(item.sub, lang)}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Hakkımızda Dropdown */}
                  {isH && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          onMouseEnter={() => openDropdown("hakkimizda")}
                          onMouseLeave={scheduleClose}
                          className="absolute left-0 top-full mt-2 rounded-2xl overflow-hidden"
                          style={{ width: 300, ...dropdownBase }}
                        >
                          <div className="p-1.5 space-y-0.5">
                            {HAKKIMIZDA_DROPDOWN.map((item) => (
                              <button
                                key={item.href}
                                onClick={() => { setActiveDropdown(null); router.push(item.href); }}
                                className="flex items-start justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                style={{ background: "transparent" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold leading-tight" style={{ color: isDark ? "#f0f0f4" : "#1a1a1a" }}>{byLang(item.label, lang)}</p>
                                  <p className="text-xs leading-snug mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>{byLang(item.sub, lang)}</p>
                                </div>
                                <RiArrowRightLine size={14} style={{ color: item.accent, opacity: 0.5, marginTop: 8 }} />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Ürünler Dropdown */}
                  {isU && categoryList.length > 0 && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          onMouseEnter={() => openDropdown("urunler")}
                          onMouseLeave={scheduleClose}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-2xl overflow-hidden"
                          style={{ width: 520, ...dropdownBase }}
                        >
                          {/* Header */}
                          <div className="px-4 pt-3.5 pb-2.5" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)" }}>
                              {byLang(NAV_STRINGS.urunlerHeading, lang)}
                            </p>
                          </div>
                          {/* 2-col grid */}
                          <div className="p-2 grid grid-cols-2 gap-0.5">
                            {categoryList.map((cat) => (
                              <button
                                key={cat.key}
                                onClick={() => { setActiveDropdown(null); router.push(cat.href); }}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                style={{ background: "transparent" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              >
                                {cat.image ? (
                                  /* ⚠️ 2026-07-29: burada HAM <img src={cat.image}> vardı → 56x44'lük
                                     kutuya ORİJİNAL dosya iniyordu. Ölçüm: 8 thumbnail = 16,3 MB
                                     (tek görsel 3,7 MB / 22 sn; 4000x4000 PNG'ler ana iş parçacığında
                                     çözülünce menü kasıyordu). next/image ile optimizer w=112 AVIF/WebP
                                     üretir → ~300x küçülme. ⚠️ quality next.config'deki izinli
                                     listeden olmalı (75/88/90/95). */
                                  <Image
                                    src={cat.image}
                                    alt=""
                                    width={112}
                                    height={88}
                                    quality={75}
                                    loading="lazy"
                                    className="w-14 h-11 rounded-lg object-contain flex-shrink-0 p-1"
                                    style={{ border: `1px solid rgba(0,0,0,0.10)`, background: "#e8eaee" }}
                                  />
                                ) : (
                                  <span
                                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${cat.accent}1a`, border: `1px solid ${cat.accent}33` }}
                                    aria-hidden
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.accent, boxShadow: `0 0 6px ${cat.accent}66` }} />
                                  </span>
                                )}
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold leading-tight truncate" style={{ color: isDark ? "#f0f0f4" : "#1a1a1a" }}>{cat.name}</p>
                                  {cat.subtitle && <p className="text-[10px] leading-tight truncate mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)" }}>{cat.subtitle}</p>}
                                </div>
                              </button>
                            ))}
                          </div>
                          {/* Footer — "Tüm ürünlere göz at": eskiden %30-35 opak gri (okunmuyordu);
                              artık mavi aksan + kalın + hafif zemin ile belirgin bir aksiyon (mobil ile tutarlı). */}
                          <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}>
                            <button
                              onClick={() => { setActiveDropdown(null); router.push("/products"); }}
                              className="w-full px-4 py-3 flex items-center justify-between text-[13px] font-bold transition-colors"
                              style={{ color: isDark ? "#93C5FD" : "#2563EB", background: isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.05)" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "#BFDBFE" : "#1D4ED8"; (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.10)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "#93C5FD" : "#2563EB"; (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.05)"; }}
                            >
                              <span>{byLang(NAV_STRINGS.urunlerFooter, lang)}</span>
                              <RiArrowRightLine size={14} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Rehber Dropdown (Hesaplayıcı + Rehberler + SSS) */}
                  {isR && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          onMouseEnter={() => openDropdown("rehber")}
                          onMouseLeave={scheduleClose}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-2xl overflow-hidden"
                          style={{ width: 300, ...dropdownBase }}
                        >
                          <div className="p-1.5 space-y-0.5">
                            {REHBER_DROPDOWN.filter(i => !i.trOnly || lang === "tr").map((item) => (
                              <button
                                key={item.href}
                                onClick={() => { setActiveDropdown(null); handleNavClick(item.href); }}
                                className="flex items-start justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                style={{ background: "transparent" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold leading-tight" style={{ color: isDark ? "#f0f0f4" : "#1a1a1a" }}>{byLang(item.label, lang)}</p>
                                  <p className="text-xs leading-snug mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>{byLang(item.sub, lang)}</p>
                                </div>
                                <RiArrowRightLine size={14} style={{ color: item.accent, opacity: 0.5, marginTop: 8 }} />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Dökümanlar Dropdown — yüklü dökümanlar kategori bazlı listelenir;
                      kategoriye tıkla → içindeki dökümanlar açılır → tıkla → /documents/[id]. */}
                  {isD && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          onMouseEnter={() => openDropdown("dokumanlar")}
                          onMouseLeave={scheduleClose}
                          className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
                          style={{ width: 340, ...dropdownBase }}
                        >
                          <div className="p-1.5 max-h-[68vh] overflow-y-auto">
                            {docs === null ? (
                              <p className="px-3 py-4 text-xs" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>{pickText(lang, "Yükleniyor…", "Loading…")}</p>
                            ) : docCategories.length === 0 ? (
                              <p className="px-3 py-4 text-xs" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>{pickText(lang, "Henüz döküman yok.", "No documents yet.")}</p>
                            ) : docCategories.map((cat) => {
                              const exp = openDocCat === cat.id;
                              return (
                                <div key={cat.id}>
                                  <button
                                    onClick={() => setOpenDocCat(exp ? null : cat.id)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                    style={{ background: "transparent" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                  >
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.accent, boxShadow: `0 0 6px ${cat.accent}66` }} aria-hidden />
                                    <span className="flex-1 text-sm font-semibold leading-tight" style={{ color: isDark ? "#f0f0f4" : "#1a1a1a" }}>{byLang(cat.label, lang)}</span>
                                    <span className="text-[11px] tabular-nums" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)" }}>{cat.items.length}</span>
                                    <HiChevronDown size={13} className={`transition-transform duration-200 ${exp ? "rotate-180" : ""}`} style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)" }} />
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {exp && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="overflow-hidden pl-4 pr-1 pb-1 space-y-0.5"
                                      >
                                        {cat.items.map((doc) => (
                                          <button
                                            key={doc.id}
                                            onClick={() => { setActiveDropdown(null); router.push(`/documents/${encodeURIComponent(doc.id)}`); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150"
                                            style={{ background: "transparent" }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                          >
                                            {doc.coverUrl ? (
                                              <>
                                                {/* Dökümanın kendi kapak görseli (ikon yerine) */}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <Image src={doc.coverUrl} alt="" width={64} height={80} quality={75} loading="lazy" className="w-8 h-10 rounded-md object-cover object-top flex-shrink-0" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }} />
                                              </>
                                            ) : (
                                              <span className="w-8 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${cat.accent}14`, border: `1px solid ${cat.accent}30` }}>
                                                <RiFileTextLine size={15} style={{ color: cat.accent, opacity: 0.85 }} />
                                              </span>
                                            )}
                                            <span className="flex-1 text-xs leading-snug truncate" style={{ color: isDark ? "rgba(240,240,244,0.78)" : "rgba(26,26,26,0.78)" }}>{doc.title}</span>
                                            {doc.lang && <span className="text-[9px] font-bold uppercase tracking-wide flex-shrink-0" style={{ color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)" }}>{doc.lang}</span>}
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                          {/* Footer: Tüm Dökümanlar sayfası */}
                          <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                            <button
                              onClick={() => { setActiveDropdown(null); router.push("/documents"); }}
                              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold transition-colors"
                              style={{ color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.60)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)"; }}
                            >
                              <span>{pickText(lang, "Tüm Dökümanlar", "All Documents")}</span>
                              <RiArrowRightLine size={13} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button onClick={onSearchOpen} aria-label={pickText(lang, "Site içinde ara", "Search the site")} className={`tap-44 p-2 rounded-lg transition-colors ${iconBtnClass}`}>
              <HiSearch size={18} />
            </button>
            <button onClick={toggle} aria-label={isDark ? pickText(lang, "Aydınlık moda geç", "Switch to light mode") : pickText(lang, "Karanlık moda geç", "Switch to dark mode")} className={`tap-44 p-2 rounded-lg transition-colors ${iconBtnClass}`}>
              {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>
            {/* "Bize Ulaşın" lg aralığında kompakt (px-3/13px), ≥xl bugünkü boy (değişmez) —
                kullanıcı: "daraltınca büyük kalıyor" (2026-07-18) */}
            <button
              onClick={() => { setMobileOpen(false); openContact(); }}
              className="ml-0.5 xl:ml-1 px-3 xl:px-4 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-200 text-white hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{
                // Light mode'da daha açık mavi gradient — beyaz yazıyla kontrast korunur.
                background: isDark
                  ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                  : "linear-gradient(135deg, #60A5FA, #3B82F6)",
                boxShadow: isDark ? "0 4px 14px rgba(59,130,246,0.35)" : "0 4px 14px rgba(96,165,250,0.45)",
              }}
            >
              <E field="navbar.ctaLabel" tag="span">{navbarContent?.ctaLabel ?? "Bize Ulaşın"}</E>
            </button>
            {/* Dil seçici — kullanıcı isteği: "Bize Ulaşın" ile B2B arasında. */}
            <LanguageSwitcher
              border={langBorder} activeBg={langActiveBg} activeColor={langActiveColor} idleColor={langIdleColor}
              panelBg={langPanelBg} panelBorder={langPanelBorder} panelText={langPanelText}
            />
            {/* B2B Portal kısayolu — sadece admin'den URL girilmişse görünür.
                "Bize Ulaşın" CTA'sının hemen sağında, küçük + diskret bir
                pill. Yeni sekmede açılır. Aramaya değil "ürünleri görenler
                buradan giriyor" hissi vermesin diye CTA-gradient'siz, light
                bordürlü tasarım. */}
            {navbarContent?.b2bPortalUrl?.trim() && (
              <a
                href={navbarContent.b2bPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="B2B Portal"
                title="B2B Portal"
                className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-[0.10em] uppercase transition-colors leading-none"
                style={{
                  color: b2bColor,
                  border: `1px solid ${b2bBorderColor}`,
                  background: b2bBg,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = b2bHoverColor;
                  (e.currentTarget as HTMLElement).style.borderColor = b2bHoverBorder;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = b2bColor;
                  (e.currentTarget as HTMLElement).style.borderColor = b2bBorderColor;
                }}
              >
                B2B
              </a>
            )}
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-1">
            <LanguageSwitcher compact
              border={langBorder} activeBg={langActiveBg} activeColor={langActiveColor} idleColor={langIdleColor}
              panelBg={langPanelBg} panelBorder={langPanelBorder} panelText={langPanelText}
            />
            <button onClick={onSearchOpen} aria-label={pickText(lang, "Site içinde ara", "Search the site")} className={`tap-44 p-2 rounded-lg ${mobileIconClass}`}><HiSearch size={17} /></button>
            <button onClick={toggle} aria-label={isDark ? pickText(lang, "Aydınlık moda geç", "Switch to light mode") : pickText(lang, "Karanlık moda geç", "Switch to dark mode")} className={`tap-44 p-2 rounded-lg ${mobileIconClass}`}>{isDark ? <HiSun size={17} /> : <HiMoon size={17} />}</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? pickText(lang, "Menüyü kapat", "Close menu") : pickText(lang, "Menüyü aç", "Open menu")} aria-expanded={mobileOpen} className={`tap-44 p-2 ${mobileIconClass}`}>
              {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className={`lg:hidden border-t ${isDark ? "bg-[#181818] border-white/8" : "bg-white border-black/8"}`}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {activeNavLinks.map((link, i) => {
                const isK = isKurumsal(link);
                const isU = isUrunler(link);
                const isH = isHakkimizda(link);
                const isR = isRehber(link);
                const isD = isDokumanlar(link);
                return (
                  <div key={link.href + i}>
                    <motion.button
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => {
                        if (isK) setMobileKurumsalOpen(v => !v);
                        else if (isU) setMobileUrunlerOpen(v => !v);
                        else if (isH) setMobileHakkimizdaOpen(v => !v);
                        else if (isR) setMobileRehberOpen(v => !v);
                        else if (isD) { loadDocs(); setMobileDokumanlarOpen(v => !v); }
                        else handleNavClick(link.href);
                      }}
                      className={`w-full flex items-center justify-between text-base font-medium py-3 text-left border-b transition-colors ${
                        isDark ? "text-white/60 hover:text-white border-white/6" : "text-black/60 hover:text-black border-black/6"
                      }`}
                    >
                      <E field={`navbar.links.${i}.label`} tag="span">{link.label}</E>
                      {(isK || isU || isH || isR || isD) && (
                        <HiChevronDown size={16} className={`transition-transform ${
                          (isK && mobileKurumsalOpen) ||
                          (isU && mobileUrunlerOpen) ||
                          (isH && mobileHakkimizdaOpen) ||
                          (isR && mobileRehberOpen) ||
                          (isD && mobileDokumanlarOpen) ? "rotate-180" : ""
                        }`} />
                      )}
                    </motion.button>

                    {/* Mobile Hakkımızda sub-links */}
                    {isH && mobileHakkimizdaOpen && (
                      <div className="py-2 space-y-1 pl-2">
                        {HAKKIMIZDA_DROPDOWN.map(item => (
                          <button key={item.href} onClick={() => { setMobileOpen(false); router.push(item.href); }}
                            className={`block w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`}>
                            {byLang(item.label, lang)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Mobile Rehber sub-links */}
                    {isR && mobileRehberOpen && (
                      <div className="py-2 space-y-1 pl-2">
                        {REHBER_DROPDOWN.filter(i => !i.trOnly || lang === "tr").map(item => (
                          <button key={item.href} onClick={() => { setMobileOpen(false); handleNavClick(item.href); }}
                            className={`block w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`}>
                            {byLang(item.label, lang)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Mobile Kurumsal sub-links */}
                    {isK && mobileKurumsalOpen && (
                      <div className="py-2 space-y-1 pl-2">
                        {KURUMSAL_DROPDOWN.map(item => (
                          <button key={item.href} onClick={() => { setMobileOpen(false); router.push(item.href); }}
                            className={`flex items-center gap-2 w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`}>
                            <BemisMark accent={item.accent} size={20} />
                            {byLang(item.label, lang)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Mobile Ürünler sub-links */}
                    {isU && mobileUrunlerOpen && (
                      <div className="py-2 space-y-0.5 pl-2">
                        {categoryList.map(cat => (
                          <button key={cat.key} onClick={() => { setMobileOpen(false); router.push(cat.href); }}
                            className={`flex items-center gap-2.5 w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.accent, boxShadow: `0 0 6px ${cat.accent}66` }} aria-hidden />
                            {cat.name}
                          </button>
                        ))}
                        <button onClick={() => { setMobileOpen(false); router.push("/products"); }}
                          className={`block w-full text-left text-sm py-2 px-3 rounded-lg font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                          {byLang(NAV_STRINGS.urunlerFooterMobile, lang)}
                        </button>
                      </div>
                    )}

                    {/* Mobile Dökümanlar sub-links — kategori → dökümanlar */}
                    {isD && mobileDokumanlarOpen && (
                      <div className="py-2 space-y-1 pl-2">
                        {docs === null ? (
                          <p className="text-xs px-3 py-2" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>{pickText(lang, "Yükleniyor…", "Loading…")}</p>
                        ) : docCategories.length === 0 ? (
                          <p className="text-xs px-3 py-2" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>{pickText(lang, "Henüz döküman yok.", "No documents yet.")}</p>
                        ) : docCategories.map((cat) => {
                          const exp = openDocCat === cat.id;
                          return (
                            <div key={cat.id}>
                              <button
                                onClick={() => setOpenDocCat(exp ? null : cat.id)}
                                className={`flex items-center gap-2 w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black"}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.accent }} aria-hidden />
                                <span className="flex-1 font-medium">{byLang(cat.label, lang)}</span>
                                <span className="text-[11px] opacity-50">{cat.items.length}</span>
                                <HiChevronDown size={14} className={`transition-transform ${exp ? "rotate-180" : ""}`} />
                              </button>
                              {exp && (
                                <div className="pl-4 space-y-0.5 pb-1">
                                  {cat.items.map((doc) => (
                                    <button
                                      key={doc.id}
                                      onClick={() => { setMobileOpen(false); router.push(`/documents/${encodeURIComponent(doc.id)}`); }}
                                      className={`flex items-center gap-2 w-full text-left text-xs py-2 px-3 rounded-lg ${isDark ? "text-white/55 hover:text-white" : "text-black/55 hover:text-black"}`}
                                    >
                                      {doc.coverUrl ? (
                                        <>
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <Image src={doc.coverUrl} alt="" width={56} height={72} quality={75} loading="lazy" className="w-7 h-9 rounded-md object-cover object-top flex-shrink-0" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}` }} />
                                        </>
                                      ) : (
                                        <span className="w-7 h-9 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${cat.accent}14`, border: `1px solid ${cat.accent}30` }}>
                                          <RiFileTextLine size={13} style={{ color: cat.accent }} />
                                        </span>
                                      )}
                                      <span className="flex-1 truncate">{doc.title}</span>
                                      {doc.lang && <span className="text-[9px] uppercase opacity-50">{doc.lang}</span>}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <button onClick={() => { setMobileOpen(false); router.push("/documents"); }}
                          className={`block w-full text-left text-sm py-2 px-3 rounded-lg font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                          {pickText(lang, "→ Tüm Dökümanlar", "→ All Documents")}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => { setMobileOpen(false); openContact(); }}
                className="mt-3 font-semibold py-3 rounded-lg text-sm text-white"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                    : "linear-gradient(135deg, #60A5FA, #3B82F6)",
                }}
              >
                <E field="navbar.ctaLabel" tag="span">{navbarContent?.ctaLabel ?? "Bize Ulaşın"}</E>
              </button>
              {/* Mobile B2B Portal kısayolu — sadece admin'den URL doluysa.
                  Desktop pill ile aynı diskret stil, drawer'ın altında ortalı
                  küçük bir pill (full-width değil) — primary CTA'yı bastırmasın. */}
              {navbarContent?.b2bPortalUrl?.trim() && (
                <div className="mt-2 flex justify-center">
                  <a
                    href={navbarContent.b2bPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.10em] uppercase transition-colors leading-none"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.75)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}`,
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                    }}
                  >
                    B2B Portal
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
