"use client";

import { useEffect, useState, useRef } from "react";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import { uploadImage } from "../../lib/clientImageUpload";
import { groupVariantsByName, findVariantGroup } from "../../lib/productGroups";

// ── Soft validators — return error message or null ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(v: string): string | null {
  if (!v) return null; // empty is not an error (soft)
  return EMAIL_RE.test(v) ? null : "Geçerli bir e-posta girin (örn. info@ornek.com)";
}
// Accepts absolute (http/https/tel/mailto) and site-internal paths starting with /.
export function validateUrl(v: string): string | null {
  if (!v) return null;
  if (v.startsWith("/")) return null;
  if (/^(tel:|mailto:)/i.test(v)) return null;
  try { new URL(v); return null; }
  catch { return "Geçerli bir URL girin (https://... veya /yol)"; }
}

// ── Field component defined OUTSIDE AdminPage to prevent remount on every render ──
function Field({ label, value, onChange, multiline = false, validate, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; half?: boolean;
  validate?: (v: string) => string | null;
  placeholder?: string;
}) {
  const error = validate ? validate(value) : null;
  const borderCls = error ? "border-red-500/50 focus:border-red-400/70" : "border-white/8 focus:border-white/22";
  return (
    <div>
      <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className={`w-full bg-white/5 border ${borderCls} rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none resize-none`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full bg-white/5 border ${borderCls} rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none`} />
      )}
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlinePhone,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineLogout,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineEye,
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineLocationMarker,
  HiOutlineTemplate,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineLightningBolt,
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiDotsVertical,
} from "react-icons/hi";
import { RiImageAddLine } from "react-icons/ri";
import Image from "next/image";
import DocumentsPanel from "./panels/DocumentsPanel";
import ChangelogPanel from "./panels/ChangelogPanel";
import AnalyticsPanel from "./panels/AnalyticsPanel";
import B2BPanel from "./panels/B2BPanel";
import MessagesPanel from "./panels/MessagesPanel";
import {
  TURKEY_CITIES,
  TURKEY_REGIONS,
  CITY_BY_ID,
  REGION_BY_ID,
  compareCityIds,
  getCityLabel,
  getCityRegion,
} from "../../lib/turkeyCities";
import { WORLD_COUNTRIES } from "../../lib/worldCountries";
import { DEALER_TIERS } from "../../lib/dealerTiers";
import { PRODUCT_FEATURES } from "../../lib/productFeatures";
import { PRODUCT_CERTIFICATES } from "../../lib/productCertificates";

type SpecItem = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductDocument = { label: string; url: string };
type BoxContentItem = { name: string; image?: string };
type ProductEntry = { id: string; name: string; code?: string; subtitle: string; badge: string | null; description: string; specs: SpecGroup[]; image?: string; images?: string[]; generalFeatures?: string[]; documents?: ProductDocument[]; features?: string[]; certificates?: string[]; boxContents?: BoxContentItem[]; compatibleVehicles?: string[]; ean?: string; desi?: string };
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

type StatItem = { value: number; suffix: string; prefix?: string; label: string; description: string };
type FaqItem = { q: string; a: string };
type CategoryMeta = { name: string; subtitle: string; modelCount: number; badge: string | null; comingSoon: boolean; image?: string; sliderImage?: string; description?: string; descriptionImage?: string; faq?: FaqItem[]; manuals?: { id: string; name: string; url: string; size?: string }[] };
type FeaturedItem = { categoryId: string; productId: string; badge: string; highlight: string; visible: boolean };
type ContentData = {
  hero: {
    badge: string; headline1: string; headline2: string; headline2Words?: string[]; headline3: string;
    subtitle: string; ctaPrimary: string; ctaSecondary: string; heroBg: string;
    heroBgPos?: string;
    heroImages?: string[];
    layout: { logo: { x: number; y: number }; text: { x: number; y: number }; button: { x: number; y: number } };
  };
  stats: StatItem[];
  categories: Record<string, CategoryMeta>;
  featured: FeaturedItem[];
  contact: { phone: string; email: string; address: string; addressSub: string; workingHours: string; workingDays: string; whatsappPhone?: string; whatsappMessage?: string };
  company: { foundedYear: string; exportCountries: string; productCount: string; facilitySize: string };
  marketing?: { ga4Id?: string; googleAdsId?: string; googleAdsContactLabel?: string; metaPixelId?: string };
  social: {
    linkedin: string; instagram: string; twitter: string; youtube: string; facebook: string;
    recentPosts?: SocialPost[];
  };
  siteVerification?: { google?: string; yandex?: string; bing?: string };
  emailTemplates?: {
    autoReply?: {
      subject?: string; heading?: string; greeting?: string;
      intro1?: string; intro2?: string; quoteHeading?: string;
      footerNote?: string; companyAddress?: string; contactEmail?: string;
    };
  };
  dna: {
    sectionLabel: string; sectionHeading: string; brandHeading: string;
    brandPara1: string; brandPara2: string; quote: string; quoteAttr: string;
    yearLabel: string; yearSub: string; ctaLabel?: string;
    highlights: DnaItem[];
    features: DnaItem[];
    factoryImage?: string;
    factoryVideo?: string;
    productionStepImages?: string[];
    productionStepLabels?: string[];
    productionFinalLabel?: string;
    kurumsalLabels?: {
      productionEyebrow?: string;
      productionHeading?: string;
      productionMadeIn?: string;
      timelineEyebrow?: string;
      timelineHeading?: string;
      valuesEyebrow?: string;
    };
    timeline?: { year: string; title: string; desc: string }[];
    aboutVideo?: string;
    certifications?: { label: string; sub: string }[];
    groupBrandsTitle?: string;
    groupBrandsBody?: string;
    groupBrands?: { name: string; logo: string }[];
  };
  products: { heading: string; subheading: string; sectionLabel?: string; allProductsLabel?: string; viewLabel?: string; sliderEnabled?: boolean; allProductsDescription?: string };
  dealer: {
    sectionLabel: string; heading: string; description: string; applyText?: string;
    statCities: string; statDealers: string;
    findDealerTitle?: string; contactBtnLabel?: string;
    citiesLabel?: string; activeDealersLabel?: string;
    mapHint?: string; mapTitle?: string;
    regionReps?: { regionId: string; name: string; title: string; phone: string; email: string; whatsapp?: string; subregion?: string }[];
    internationalDealers?: {
      id: string; countryCode: string; countryName: string;
      lat: number; lng: number; active: boolean;
      distributorName?: string; contactPerson?: string;
      city?: string; address?: string; phone?: string;
      email?: string; whatsapp?: string; website?: string;
      notes?: string;
    }[];
    exportContact?: {
      contactPerson?: string; title?: string; email?: string;
      phone?: string; whatsapp?: string; hours?: string;
    };
    worldSection?: {
      sectionLabel: string; heading: string;
      introTitle: string; introDescription: string;
      languagesNote: string; languages: string[];
    };
  };
  reviews: {
    heading: string; subheading: string; rating: string; ratingCount: string;
    sectionLabel?: string; ratingLabel?: string; platformsPrefix?: string; ratingCountSuffix?: string;
    items: ReviewItem[];
  };
  contactSection: { sectionLabel: string; heading: string; subheading: string };
  featuredSection?: { sectionLabel: string; heading: string; subheading: string; ctaLabel: string };
  referenceProjectsSection?: {
    sectionLabel: string; heading: string; subheading: string;
    items: { id: string; image: string; title?: string; location?: string; description?: string; imagePos?: string }[];
  };
  calculator?: { sectionLabel: string; heading: string; subheading: string; tabCharge: string; tabSavings: string; chargeSimLabel: string };
  smartCharger?: { sectionLabel: string; heading: string; subheading: string; ocppBadge: string; ctaLabel: string; ctaHref: string; appStoreHref: string; playStoreHref: string; features: { title: string; desc: string }[]; mockupPhoneImage?: string; mockupWebImage?: string };
  productShowcase?: { badge: string; name: string; tagline: string; description: string; image: string; images?: string[]; specs: { label: string; value: string }[]; ctaPrimary: string; ctaHref: string; ctaSecondary: string; ctaSecondaryHref: string; products?: ShowcaseProductItem[]; overlayFeatures?: string[] };
  sectionBgs?: Record<string, string>;
  logos?: { dark: string; light: string };
  ogImage?: string;
  faviconUrl?: string;
  sectionOrder?: string[];
  navbar?: { ctaLabel?: string; b2bPortalUrl?: string; links?: { label: string; href: string }[] };
};

type Dealer = {
  name: string;
  address: string;
  phone: string;
  email?: string;
  contactPerson?: string;
  whatsapp?: string;
  website?: string;
  workingHours?: string;
  mapUrl?: string;
  notes?: string;
  tier?: "standart" | "stratejik" | "partner";
};
type DealersData = Record<string, { dealers: Dealer[] }>;

type DnaItem  = { title: string; desc: string };
type ReviewItem = { platform: string; platformColor: string; rating: number; author: string; date: string; product: string; text: string };
type SocialPost = { id: string; platform: "linkedin" | "instagram" | "youtube" | "facebook"; image: string; caption: string; link: string; date?: string };
type ShowcaseProductItem = {
  badge?: string; name: string; tagline?: string; description?: string;
  image?: string; specs?: { label: string; value: string }[];
  ctaPrimary?: string; ctaHref?: string; ctaSecondary?: string; ctaSecondaryHref?: string;
  overlayFeatures?: string[];
  imagePos?: string;
  imageZoom?: number;
};
type HeroLayoutKey = "logo" | "text" | "button";

type Tab = "hero" | "dna" | "stats" | "products-section" | "smartcharger" | "productshowcase" | "featured" | "refprojects" | "calculator" | "dealer-section" | "reviews" | "contact-section" | "products" | "dealers" | "contact" | "media" | "analytics" | "documents" | "changelog" | "b2b" | "messages";

const ADMIN_DEFAULT_SECTION_ORDER = [
  "dna", "stats", "productshowcase", "smartcharger", "products", "featured", "referenceprojects", "reviews", "dealer", "b2bcta", "calculator"
];

const SECTION_META: Record<string, { tab: Tab; label: string; icon: React.ElementType }> = {
  "dna":            { tab: "dna",             label: "Hakkımızda",     icon: HiOutlineTemplate       },
  "stats":          { tab: "stats",           label: "İstatistikler",  icon: HiOutlineChartBar       },
  "productshowcase":{ tab: "productshowcase", label: "Ürün Vitrini",   icon: HiOutlineStar           },
  "smartcharger":   { tab: "smartcharger",    label: "Akıllı Şarj",    icon: HiOutlineLightningBolt  },
  "products":       { tab: "products",         label: "Ürünler",        icon: HiOutlineCube           },
  "featured":       { tab: "featured",        label: "Öne Çıkanlar",   icon: HiOutlineStar           },
  "referenceprojects": { tab: "refprojects",   label: "Referans Projeler", icon: HiOutlinePhotograph  },
  "reviews":        { tab: "reviews",         label: "Yorumlar & Blog", icon: HiOutlineStar          },
  "dealer":         { tab: "dealers",         label: "Bayi Haritası",  icon: HiOutlineLocationMarker },
  "b2bcta":         { tab: "b2b",             label: "OEM & Kurumsal", icon: HiOutlineOfficeBuilding },
  "calculator":     { tab: "calculator",      label: "Hesaplayıcı",    icon: HiOutlineLightningBolt  },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("hero");
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [b2bSubPage, setB2bSubPage] = useState("/b2b");
  const [content, setContent] = useState<ContentData | null>(null);
  const [products, setProducts] = useState<CategoryData[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingProducts, setSavingProducts] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [prodImgLoading, setProdImgLoading] = useState(false);
  const [editingBcRow, setEditingBcRow] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragTo, setDragTo] = useState<number | null>(null);
  const [heroBgLoading, setHeroBgLoading] = useState(false);
  const [heroImgLoading, setHeroImgLoading] = useState(false);
  const [factoryImgLoading, setFactoryImgLoading] = useState(false);
  const [factoryVideoLoading, setFactoryVideoLoading] = useState(false);
  const [catImgLoading, setCatImgLoading] = useState<string | null>(null); // catId while uploading
  const fileRef = useRef<HTMLInputElement>(null);
  const prodImgRef = useRef<HTMLInputElement>(null);
  const bcImgRef = useRef<HTMLInputElement>(null);
  const heroBgRef = useRef<HTMLInputElement>(null);
  const heroImgRef = useRef<HTMLInputElement>(null);
  const factoryImgRef = useRef<HTMLInputElement>(null);
  const factoryVideoRef = useRef<HTMLInputElement>(null);
  const catImgRef = useRef<HTMLInputElement>(null);
  const [catImgTarget, setCatImgTarget] = useState<string>(""); // catId for pending upload
  const [sectionBgLoading, setSectionBgLoading] = useState<string | null>(null);
  const [sectionBgTarget, setSectionBgTarget] = useState<string>("");
  const sectionBgRef = useRef<HTMLInputElement>(null);
  const [showcaseImgLoading, setShowcaseImgLoading] = useState(false);
  const showcaseImgRef = useRef<HTMLInputElement>(null);
  const [showcaseUrlInput, setShowcaseUrlInput] = useState("");
  const [psItemImgLoadingIdx, setPsItemImgLoadingIdx] = useState<number | null>(null);
  const psItemImgRef = useRef<HTMLInputElement>(null);
  const psItemTargetIdxRef = useRef<number>(0);
  const [mockupImgLoading, setMockupImgLoading] = useState<"phone" | "web" | null>(null);
  const mockupImgRef = useRef<HTMLInputElement>(null);
  const mockupTargetRef = useRef<"phone" | "web">("phone");
  const [catSliderImgLoading, setCatSliderImgLoading] = useState<string | null>(null);
  const [catSliderImgTarget, setCatSliderImgTarget] = useState<string>("");
  const catSliderImgRef = useRef<HTMLInputElement>(null);
  const [catDescImgLoading, setCatDescImgLoading] = useState<string | null>(null);
  const [catDescImgTarget, setCatDescImgTarget] = useState<string>("");
  const catDescImgRef = useRef<HTMLInputElement>(null);
  const [logoLoading, setLogoLoading] = useState<"dark" | "light" | null>(null);
  const logoDarkRef  = useRef<HTMLInputElement>(null);
  const logoLightRef = useRef<HTMLInputElement>(null);
  const [ogImgLoading, setOgImgLoading] = useState(false);
  const ogImgRef = useRef<HTMLInputElement>(null);
  const [faviconLoading, setFaviconLoading] = useState(false);
  const faviconRef = useRef<HTMLInputElement>(null);

  // Contact mail diagnostic state
  type MailStatus = {
    to: string | null;
    resend: { configured: boolean; apiKeySet: boolean; from: string };
    smtp:   { configured: boolean; host: string | null; port: string; user: string | null };
  };
  const [mailStatus, setMailStatus] = useState<MailStatus | null>(null);
  const [mailTesting, setMailTesting] = useState(false);
  const [mailResult, setMailResult] = useState<{ ok: boolean; provider?: string; to?: string | null; error?: string } | null>(null);

  useEffect(() => {
    if (tab !== "contact") return;
    fetch("/api/admin/contact-test").then(r => r.json()).then(setMailStatus).catch(() => {});
  }, [tab]);

  const sendTestMail = async () => {
    setMailTesting(true);
    setMailResult(null);
    try {
      const res = await fetch("/api/admin/contact-test", { method: "POST" });
      const json = await res.json();
      setMailResult(json);
    } catch (e) {
      setMailResult({ ok: false, error: String(e) });
    }
    setMailTesting(false);
  };

  // Dealer editor state
  const [dealers, setDealers] = useState<DealersData>({});
  const [dealersSaving, setDealersSaving] = useState(false);

  // Unsaved-changes tracking. We compare current state against a "clean" snapshot
  // ref. Fetch/save paths update the snapshot so the comparison says "clean";
  // user edits produce a new object reference that differs, flipping dirty=true.
  const [contentDirty, setContentDirty] = useState(false);
  const [productsDirty, setProductsDirty] = useState(false);
  const [dealersDirty, setDealersDirty] = useState(false);
  // Init with the same reference as useState so mount comparison is clean.
  const contentCleanRef = useRef<ContentData | null>(content);
  const productsCleanRef = useRef<CategoryData[]>(products);
  const dealersCleanRef = useRef<DealersData>(dealers);

  useUnsavedChanges(contentDirty || productsDirty || dealersDirty);

  useEffect(() => { setContentDirty(content !== contentCleanRef.current); }, [content]);
  useEffect(() => { setProductsDirty(products !== productsCleanRef.current); }, [products]);
  useEffect(() => { setDealersDirty(dealers !== dealersCleanRef.current); }, [dealers]);
  const [selDealerCity, setSelDealerCity] = useState<string>("istanbul");
  const [addDealerOpen, setAddDealerOpen] = useState(false);
  const [addDealerCityFilter, setAddDealerCityFilter] = useState("");
  type AddDealerForm = {
    city: string; name: string; address: string; phone: string;
    email: string; contactPerson: string; whatsapp: string;
    website: string; workingHours: string; mapUrl: string; notes: string;
    tier: "standart" | "stratejik" | "partner";
  };
  const emptyDealerForm: AddDealerForm = {
    city: "", name: "", address: "", phone: "",
    email: "", contactPerson: "", whatsapp: "",
    website: "", workingHours: "", mapUrl: "", notes: "",
    tier: "standart",
  };
  const [addDealerForm, setAddDealerForm] = useState<AddDealerForm>(emptyDealerForm);
  // International country picker (Yurtdışı Distribütörler editor)
  const [addCountryOpen, setAddCountryOpen] = useState(false);
  const [addCountryFilter, setAddCountryFilter] = useState("");

  // Soft validators — accept empty (field is optional unless marked *).
  const isValidEmail = (v: string) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isValidUrl = (v: string) => {
    const t = v.trim();
    if (t === "") return true;
    try { new URL(t.match(/^https?:\/\//) ? t : `https://${t}`); return true; } catch { return false; }
  };
  // Phones: allow +, digits, spaces, parens, dashes; require at least 7 digits when present.
  const isValidPhone = (v: string) => {
    const t = v.trim();
    if (t === "") return true;
    if (!/^[+\d\s()\-./]+$/.test(t)) return false;
    return (t.match(/\d/g) ?? []).length >= 7;
  };

  // Hero visual layout editor
  const canvasRef = useRef<HTMLDivElement>(null);

  // Hero focal point picker
  const focalRef = useRef<HTMLDivElement>(null);
  const handleFocalMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = focalRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.min(100, Math.max(0, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    updateContent(["hero", "heroBgPos"], `${x}% ${y}%`);
  };

  // Live preview
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeMobileRef = useRef<HTMLIFrameElement>(null);
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const postToPreview = (msg: object) => {
    const target = previewMode === "mobile" ? iframeMobileRef.current : iframeRef.current;
    target?.contentWindow?.postMessage(msg, window.location.origin);
  };

  useEffect(() => {
    if (!showPreview || !content) return;
    if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    previewDebounceRef.current = setTimeout(() => {
      postToPreview({ type: "BEMIS_PREVIEW", content });
    }, 350);
    return () => { if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, showPreview, previewMode]);

  const handleIframeLoad = () => {
    if (content) postToPreview({ type: "BEMIS_PREVIEW", content });
    const anchor = TAB_ANCHOR_MAP[tab];
    if (anchor) {
      setTimeout(() => postToPreview({ type: "BEMIS_PREVIEW_SCROLL", anchor }), 800);
    }
  };

  // Scroll preview to section when tab changes
  useEffect(() => {
    if (!showPreview) return;
    const anchor = TAB_ANCHOR_MAP[tab];
    if (!anchor) return;
    setTimeout(() => postToPreview({ type: "BEMIS_PREVIEW_SCROLL", anchor }), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, showPreview, previewMode]);

  // Sections accordion state
  const [secOpen, setSecOpen] = useState<Record<string, boolean>>({ dna: true, products: false, dealer: false, reviews: false, contactSec: false });

  // Product editor state
  const [selCat, setSelCat] = useState<string>("");
  const [selProd, setSelProd] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [prodSubTab, setProdSubTab] = useState<"cards" | "specs" | "section">("cards");

  // When switching to "section" sub-tab in products, scroll preview to #products on homepage
  useEffect(() => {
    if (!showPreview || tab !== "products") return;
    if (prodSubTab === "section") {
      setTimeout(() => postToPreview({ type: "BEMIS_PREVIEW_SCROLL", anchor: "products" }), 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodSubTab, showPreview]);

  // Admin paneli her zaman karanlık temada kalmalı
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", "dark");
    return () => { document.documentElement.setAttribute("data-theme", prev); };
  }, []);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => { if (r.status === 401) { setAuthed(false); return null; } return r.json(); })
      .then((d) => { if (d) { contentCleanRef.current = d; setContent(d); setAuthed(true); } })
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (authed && tab === "products") {
      fetch("/api/admin/products")
        .then((r) => r.json())
        .then((d: CategoryData[]) => { productsCleanRef.current = d; setProducts(d); if (!selCat && d.length > 0) setSelCat(d[0].id); })
        .catch(() => {});
    }
  }, [authed, tab, selCat]);

  useEffect(() => {
    if (authed && tab === "dealers") {
      fetch("/api/admin/dealers")
        .then((r) => r.json())
        .then((d: DealersData) => { dealersCleanRef.current = d; setDealers(d); })
        .catch(() => {});
    }
  }, [authed, tab]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    // Yield to browser so loading state paints before fetch begins
    await new Promise((r) => setTimeout(r, 0));
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, rememberMe }) });
      if (res.ok) {
        const data = await fetch("/api/admin/content").then((r) => r.json());
        contentCleanRef.current = data;
        setContent(data);
        setAuthed(true);
      } else {
        const { error } = await res.json();
        setLoginError(error || "Giriş başarısız");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if ((contentDirty || productsDirty || dealersDirty) && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Çıkış yapmak istediğinize emin misiniz?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    const emptyProducts: CategoryData[] = [];
    const emptyDealers: DealersData = {};
    contentCleanRef.current = null;
    productsCleanRef.current = emptyProducts;
    dealersCleanRef.current = emptyDealers;
    setContent(null);
    setProducts(emptyProducts);
    setDealers(emptyDealers);
    setContentDirty(false);
    setProductsDirty(false);
    setDealersDirty(false);
  };

  const handleSaveContent = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      if (res.ok) { contentCleanRef.current = content; setContentDirty(false); showToast("ok", "İçerik kaydedildi."); setPreviewKey((k) => k + 1); }
      else showToast("err", "Kayıt başarısız.");
    } catch { showToast("err", "Ağ hatası."); }
    setSaving(false);
  };

  // Hero layout drag handler
  const handleLayoutDrag = (e: React.MouseEvent, key: HeroLayoutKey) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !content) return;
    const onMove = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round(Math.max(0, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100)));
      const y = Math.round(Math.max(0, Math.min(90, ((ev.clientY - rect.top) / rect.height) * 100)));
      setContent((prev) => {
        if (!prev) return prev;
        const next = JSON.parse(JSON.stringify(prev)) as ContentData;
        next.hero.layout[key] = { x, y };
        return next;
      });
    };
    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const resetHeroLayout = () => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    next.hero.layout = { logo: { x: 4, y: 12 }, text: { x: 4, y: 38 }, button: { x: 4, y: 72 } };
    setContent(next);
  };

  // SmartCharger feature helpers
  const updateSmartChargerFeature = (idx: number, field: "title" | "desc", val: string) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    const features = next.smartCharger?.features ?? [];
    if (!features[idx]) return;
    features[idx][field] = val;
    if (!next.smartCharger) next.smartCharger = { sectionLabel: "", heading: "", subheading: "", ocppBadge: "", ctaLabel: "", ctaHref: "", appStoreHref: "", playStoreHref: "", features };
    else next.smartCharger.features = features;
    setContent(next);
  };

  const addSmartChargerFeature = () => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    if (!next.smartCharger) next.smartCharger = { sectionLabel: "", heading: "", subheading: "", ocppBadge: "", ctaLabel: "", ctaHref: "", appStoreHref: "", playStoreHref: "", features: [] };
    next.smartCharger.features = [...(next.smartCharger.features ?? []), { title: "Yeni Özellik", desc: "" }];
    setContent(next);
  };

  const removeSmartChargerFeature = (idx: number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    next.smartCharger!.features = next.smartCharger!.features.filter((_: unknown, i: number) => i !== idx);
    setContent(next);
  };

  // ProductShowcase spec helpers
  const updateShowcaseSpec = (idx: number, field: "label" | "value", val: string) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    if (!next.productShowcase) return;
    next.productShowcase.specs[idx][field] = val;
    setContent(next);
  };
  const addShowcaseSpec = () => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    if (!next.productShowcase) next.productShowcase = { badge: "", name: "", tagline: "", description: "", image: "", specs: [], ctaPrimary: "", ctaHref: "", ctaSecondary: "", ctaSecondaryHref: "" };
    next.productShowcase.specs = [...(next.productShowcase.specs ?? []), { label: "Özellik", value: "" }];
    setContent(next);
  };
  const removeShowcaseSpec = (idx: number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    next.productShowcase!.specs = next.productShowcase!.specs.filter((_: unknown, i: number) => i !== idx);
    setContent(next);
  };

  // Reviews helpers
  const updateReviewItem = (idx: number, field: keyof ReviewItem, val: string | number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (next.reviews.items[idx] as any)[field] = val;
    setContent(next);
  };

  const addReviewItem = () => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    next.reviews.items.push({ platform: "Trendyol", platformColor: "#F27A1A", rating: 5, author: "Yeni Kullanıcı", date: "2025", product: "Ürün Adı", text: "Yorum metni..." });
    setContent(next);
  };

  const removeReviewItem = (idx: number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    next.reviews.items.splice(idx, 1);
    setContent(next);
  };

  const handleSaveDealers = async () => {
    setDealersSaving(true);
    try {
      // Dealer tab edits two stores at once: the dealers bin (city
      // markers) and the content bin's dealer.* block (which now also
      // carries regionReps). Save both in parallel so the operator can
      // edit a city marker, a section text, and a regional rep, then hit
      // a single "Kaydet" — no surprise data loss.
      const dealersReq = fetch("/api/admin/dealers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealers),
      });
      // Only post content when there is something to save; saves an
      // unnecessary translate+write round-trip on tabs where the
      // operator only touched dealers.
      const contentReq = contentDirty && content
        ? fetch("/api/admin/content", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(content),
          })
        : null;

      const [dealersRes, contentRes] = await Promise.all([dealersReq, contentReq]);

      if (dealersRes.ok && (!contentRes || contentRes.ok)) {
        dealersCleanRef.current = dealers;
        setDealersDirty(false);
        if (contentRes && content) {
          contentCleanRef.current = content;
          setContentDirty(false);
        }
        showToast("ok", "Bayiler ve bölge bilgileri kaydedildi.");
        setPreviewKey((k) => k + 1);
      } else {
        showToast("err", "Kayıt başarısız.");
      }
    } catch { showToast("err", "Ağ hatası."); }
    setDealersSaving(false);
  };

  const handleSaveProducts = async () => {
    setSavingProducts(true);
    try {
      const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(products) });
      if (res.ok) { productsCleanRef.current = products; setProductsDirty(false); showToast("ok", "Ürün verileri kaydedildi."); setPreviewKey((k) => k + 1); }
      else showToast("err", "Kayıt başarısız.");
    } catch { showToast("err", "Ağ hatası."); }
    setSavingProducts(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setUploadedFiles((prev) => [url, ...prev]);
      showToast("ok", `Yüklendi: ${url}`);
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setUploadLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleProdImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProdImgLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "products");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setProducts((prev) => {
        const updated = prev.map((cat) => cat.id !== selCat ? cat : {
          ...cat,
          products: cat.products.map((p) => {
            if (p.id !== selProd) return p;
            const existing = p.images ?? (p.image ? [p.image] : []);
            return { ...p, images: [...existing, url], image: existing[0] ?? url };
          }),
        });
        // Auto-save to JSONBin so image persists on refresh
        fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).catch(() => {});
        return updated;
      });
      showToast("ok", "Görsel yüklendi ve kaydedildi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setProdImgLoading(false);
    if (prodImgRef.current) prodImgRef.current.value = "";
  };

  // Upload an image bound to a specific Paket İçeriği row. The row index is
  // captured into editingBcRow before the file picker opens; on change we
  // resolve the URL and write it onto that row's `image` field. Auto-saves
  // to JSONBin so the URL survives a refresh just like main product images.
  const handleBoxContentImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const rowIdx = editingBcRow;
    setEditingBcRow(null);
    if (!file || rowIdx === null) {
      if (bcImgRef.current) bcImgRef.current.value = "";
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "products/box-contents");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json() as { url: string };
      setProducts((prev) => {
        const updated = prev.map((cat) => cat.id !== selCat ? cat : {
          ...cat,
          products: cat.products.map((p) => {
            if (p.id !== selProd) return p;
            const list = Array.isArray(p.boxContents) ? [...p.boxContents] : [];
            while (list.length <= rowIdx) list.push({ name: "" });
            list[rowIdx] = { ...list[rowIdx], image: url };
            return { ...p, boxContents: list };
          }),
        });
        fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).catch(() => {});
        return updated;
      });
      showToast("ok", "Paket içeriği görseli yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    if (bcImgRef.current) bcImgRef.current.value = "";
  };

  const triggerBoxContentImg = (rowIdx: number) => {
    setEditingBcRow(rowIdx);
    setTimeout(() => bcImgRef.current?.click(), 0);
  };

  const updateBoxContentName = (rowIdx: number, name: string) => {
    setProducts((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
      const cat = next.find((c) => c.id === selCat);
      const prod = cat?.products.find((p) => p.id === selProd);
      if (!prod) return prev;
      const list = Array.isArray(prod.boxContents) ? [...prod.boxContents] : [];
      while (list.length <= rowIdx) list.push({ name: "" });
      list[rowIdx] = { ...list[rowIdx], name };
      prod.boxContents = list;
      return next;
    });
  };

  const addBoxContentRow = () => {
    setProducts((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
      const cat = next.find((c) => c.id === selCat);
      const prod = cat?.products.find((p) => p.id === selProd);
      if (!prod) return prev;
      prod.boxContents = [...(prod.boxContents ?? []), { name: "" }];
      return next;
    });
  };

  const removeBoxContentRow = (rowIdx: number) => {
    setProducts((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
      const cat = next.find((c) => c.id === selCat);
      const prod = cat?.products.find((p) => p.id === selProd);
      if (!prod) return prev;
      prod.boxContents = (prod.boxContents ?? []).filter((_, i) => i !== rowIdx);
      return next;
    });
  };

  const moveBoxContentRow = (rowIdx: number, dir: -1 | 1) => {
    setProducts((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
      const cat = next.find((c) => c.id === selCat);
      const prod = cat?.products.find((p) => p.id === selProd);
      if (!prod) return prev;
      const list = [...(prod.boxContents ?? [])];
      const target = rowIdx + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[rowIdx], list[target]] = [list[target], list[rowIdx]];
      prod.boxContents = list;
      return next;
    });
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroBgLoading(true);
    try {
      const { url } = await uploadImage(file, "hero");
      updateContent(["hero", "heroBg"], url);
      showToast("ok", "Arka plan görseli yüklendi.");
    } catch (err) {
      showToast("err", `Yükleme başarısız: ${(err as Error).message}`);
    }
    setHeroBgLoading(false);
    if (heroBgRef.current) heroBgRef.current.value = "";
  };

  // İlave hero görseli yükle → hero.heroImages dizisine ekle (slider).
  const handleHeroImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImgLoading(true);
    try {
      const { url } = await uploadImage(file, "hero");
      updateContent(["hero", "heroImages"], [...(content?.hero?.heroImages ?? []), url]);
      showToast("ok", "İlave hero görseli eklendi.");
    } catch (err) {
      showToast("err", `Yükleme başarısız: ${(err as Error).message}`);
    }
    setHeroImgLoading(false);
    if (heroImgRef.current) heroImgRef.current.value = "";
  };

  const handleFactoryImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFactoryImgLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "kurumsal");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateContent(["dna", "factoryImage"], url);
      showToast("ok", "Fabrika görseli yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setFactoryImgLoading(false);
    if (factoryImgRef.current) factoryImgRef.current.value = "";
  };

  const handleFactoryVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFactoryVideoLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "kurumsal");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateContent(["dna", "factoryVideo"], url);
      showToast("ok", "Fabrika videosu yüklendi.");
    } else {
      showToast("err", "Video yükleme başarısız.");
    }
    setFactoryVideoLoading(false);
    if (factoryVideoRef.current) factoryVideoRef.current.value = "";
  };

  const handleShowcaseImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setShowcaseImgLoading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "vitrin");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = (await res.json()) as { url?: string };
        if (url) uploaded.push(url);
      }
    }
    if (uploaded.length > 0) {
      setContent((prev) => {
        if (!prev) return prev;
        const ps = prev.productShowcase;
        if (!ps) return prev;
        const existing: string[] = (ps.images && ps.images.length > 0)
          ? ps.images
          : (ps.image ? [ps.image] : []);
        return { ...prev, productShowcase: { ...ps, images: [...existing, ...uploaded] } };
      });
      showToast("ok", uploaded.length === 1 ? "Görsel eklendi." : `${uploaded.length} görsel eklendi.`);
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setShowcaseImgLoading(false);
    if (showcaseImgRef.current) showcaseImgRef.current.value = "";
  };

  // Per-showcase-product image upload (one image per product card).
  const handlePsItemImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const idx = psItemTargetIdxRef.current;
    setPsItemImgLoadingIdx(idx);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "vitrin");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = (await res.json()) as { url?: string };
      if (url) {
        setContent((prev) => {
          if (!prev) return prev;
          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
          if (!next.productShowcase) return prev;
          const items = [...(next.productShowcase.products ?? [])];
          if (!items[idx]) return prev;
          items[idx] = { ...items[idx], image: url };
          next.productShowcase.products = items;
          return next;
        });
        showToast("ok", `Ürün ${idx + 1} görseli yüklendi.`);
      }
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setPsItemImgLoadingIdx(null);
    if (psItemImgRef.current) psItemImgRef.current.value = "";
  };

  // Mockup screenshot upload for SmartCharger phone/web frames.
  const handleMockupImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const target = mockupTargetRef.current;
    setMockupImgLoading(target);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "smartcharger");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = (await res.json()) as { url?: string };
      if (url) {
        setContent((prev) => {
          if (!prev) return prev;
          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
          if (!next.smartCharger) {
            next.smartCharger = { sectionLabel: "", heading: "", subheading: "", ocppBadge: "", ctaLabel: "", ctaHref: "", appStoreHref: "", playStoreHref: "", features: [] };
          }
          if (target === "phone") next.smartCharger.mockupPhoneImage = url;
          else next.smartCharger.mockupWebImage = url;
          return next;
        });
        showToast("ok", target === "phone" ? "Telefon mockup görseli yüklendi." : "Web mockup görseli yüklendi.");
      }
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setMockupImgLoading(null);
    if (mockupImgRef.current) mockupImgRef.current.value = "";
  };

  const handleCatImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !catImgTarget) return;
    setCatImgLoading(catImgTarget);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "categories");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateCatMeta(catImgTarget, "image", url);
      showToast("ok", "Görsel yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setCatImgLoading(null);
    setCatImgTarget("");
    if (catImgRef.current) catImgRef.current.value = "";
  };

  const handleCatSliderImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !catSliderImgTarget) return;
    setCatSliderImgLoading(catSliderImgTarget);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "category-sliders");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateCatMeta(catSliderImgTarget, "sliderImage", url);
      showToast("ok", "Slider görseli yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setCatSliderImgLoading(null);
    setCatSliderImgTarget("");
    if (catSliderImgRef.current) catSliderImgRef.current.value = "";
  };

  const handleCatDescImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !catDescImgTarget) return;
    setCatDescImgLoading(catDescImgTarget);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "category-descriptions");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateCatMeta(catDescImgTarget, "descriptionImage", url);
      showToast("ok", "Açıklama görseli yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setCatDescImgLoading(null);
    setCatDescImgTarget("");
    if (catDescImgRef.current) catDescImgRef.current.value = "";
  };

  const handleSectionBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sectionBgTarget) return;
    setSectionBgLoading(sectionBgTarget);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "section-bgs");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setContent((prev) => {
        if (!prev) return prev;
        return { ...prev, sectionBgs: { ...(prev.sectionBgs ?? {}), [sectionBgTarget]: url } };
      });
      showToast("ok", "Arka plan görseli yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setSectionBgLoading(null);
    setSectionBgTarget("");
    if (sectionBgRef.current) sectionBgRef.current.value = "";
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, mode: "dark" | "light") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoLoading(mode);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "logos");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      // Build updated content and auto-save immediately so the logo is live without needing "Kaydet"
      setContent((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, logos: { ...(prev.logos ?? { dark: "", light: "" }), [mode]: url } };
        contentCleanRef.current = updated;
        // Fire-and-forget save
        fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).catch(() => {});
        return updated;
      });
      showToast("ok", `${mode === "dark" ? "Karanlık" : "Aydınlık"} mod logosu yüklendi ve kaydedildi.`);
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setLogoLoading(null);
    const ref = mode === "dark" ? logoDarkRef : logoLightRef;
    if (ref.current) ref.current.value = "";
  };

  const handleOgImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check image dimensions before uploading. Google / Facebook want
    // ≥ 1200×630 for the large-preview card; smaller images are silently
    // ignored or shown as tiny thumbnails.
    const dims = await new Promise<{ w: number; h: number } | null>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });

    if (dims && (dims.w < 1200 || dims.h < 630)) {
      const ok = window.confirm(
        `Bu görsel ${dims.w} × ${dims.h} px boyutunda. Open Graph için önerilen min boyut 1200 × 630 px — ` +
        `daha küçük görseller Google / Facebook arama önizlemelerinde büyük kart olarak gösterilmez.\n\n` +
        `Yine de yüklemek istiyor musunuz?`
      );
      if (!ok) {
        if (ogImgRef.current) ogImgRef.current.value = "";
        return;
      }
    }

    setOgImgLoading(true);
    try {
      const { url } = await uploadImage(file, "og");
      setContent((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ogImage: url };
        contentCleanRef.current = updated;
        fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).catch(() => {});
        return updated;
      });
      // Notify search engines so they re-fetch the OG card.
      fetch("/api/admin/notify-search-engines", { method: "POST" }).catch(() => {});
      showToast("ok", "Open Graph görseli yüklendi ve arama motorlarına bildirildi.");
    } catch (err) {
      showToast("err", `Yükleme başarısız: ${(err as Error).message}`);
    }
    setOgImgLoading(false);
    if (ogImgRef.current) ogImgRef.current.value = "";
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "favicon");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setContent((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, faviconUrl: url };
        contentCleanRef.current = updated;
        fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).catch(() => {});
        return updated;
      });
      showToast("ok", "Favicon yüklendi ve kaydedildi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setFaviconLoading(false);
    if (faviconRef.current) faviconRef.current.value = "";
  };

  const reorderSection = (from: number, to: number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    const order = [...(next.sectionOrder ?? ADMIN_DEFAULT_SECTION_ORDER)];
    const [moved] = order.splice(from, 1);
    order.splice(to, 0, moved);
    next.sectionOrder = order;
    setContent(next);
  };

  const updateContent = (path: string[], value: string | number | null | string[] | SocialPost[]) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = next;
    // Auto-create missing intermediate objects so new sections (calculator, featuredSection…) work
    for (let i = 0; i < path.length - 1; i++) {
      if (node[path[i]] == null) node[path[i]] = {};
      node = node[path[i]];
    }
    node[path[path.length - 1]] = value;
    setContent(next);
  };

  const updateStat = (idx: number, field: string, value: string | number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (next.stats[idx] as any)[field] = value;
    setContent(next);
  };

  // Product editor helpers
  const currentCat = products.find((c) => c.id === selCat);
  const currentProd = currentCat?.products.find((p) => p.id === selProd);

  const updateProd = (field: keyof ProductEntry, value: string | null) => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => p.id !== selProd ? p : { ...p, [field]: value }),
    }));
  };

  const updateSpecValue = (gi: number, ii: number, field: "label" | "value", val: string) => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => {
        if (p.id !== selProd) return p;
        const specs = JSON.parse(JSON.stringify(p.specs)) as SpecGroup[];
        specs[gi].items[ii][field] = val;
        return { ...p, specs };
      }),
    }));
  };

  const addSpecItem = (gi: number) => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => {
        if (p.id !== selProd) return p;
        const specs = JSON.parse(JSON.stringify(p.specs)) as SpecGroup[];
        specs[gi].items.push({ label: "Yeni Özellik", value: "-" });
        return { ...p, specs };
      }),
    }));
  };

  const removeSpecItem = (gi: number, ii: number) => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => {
        if (p.id !== selProd) return p;
        const specs = JSON.parse(JSON.stringify(p.specs)) as SpecGroup[];
        specs[gi].items.splice(ii, 1);
        return { ...p, specs };
      }),
    }));
  };

  const addSpecGroup = () => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => {
        if (p.id !== selProd) return p;
        return { ...p, specs: [...p.specs, { group: "Yeni Grup", items: [{ label: "Özellik", value: "-" }] }] };
      }),
    }));
  };

  const removeSpecGroup = (gi: number) => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => {
        if (p.id !== selProd) return p;
        const specs = JSON.parse(JSON.stringify(p.specs)) as SpecGroup[];
        specs.splice(gi, 1);
        return { ...p, specs };
      }),
    }));
  };

  const addProduct = () => {
    if (!selCat) return;
    const ts = Date.now();
    const newId = `${selCat}-product-${ts}`;
    const newProd: ProductEntry = {
      id: newId,
      name: "Yeni Ürün",
      subtitle: "",
      badge: null,
      description: "",
      specs: [{ group: "Genel", items: [{ label: "Özellik", value: "-" }] }],
    };
    setProducts((prev) => prev.map((cat) =>
      cat.id !== selCat ? cat : { ...cat, products: [...cat.products, newProd] }
    ));
    setSelProd(newId);
  };

  const removeProduct = (prodId: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setProducts((prev) => prev.map((cat) =>
      cat.id !== selCat ? cat : { ...cat, products: cat.products.filter((p) => p.id !== prodId) }
    ));
    if (selProd === prodId) setSelProd("");
  };

  const updateGroupName = (gi: number, name: string) => {
    setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
      ...cat,
      products: cat.products.map((p) => {
        if (p.id !== selProd) return p;
        const specs = JSON.parse(JSON.stringify(p.specs)) as SpecGroup[];
        specs[gi].group = name;
        return { ...p, specs };
      }),
    }));
  };

  const toggleGroup = (key: string) => setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleCat = (key: string) => setExpandedCats((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateCatMeta = (catId: string, field: keyof CategoryMeta, value: string | number | boolean | null) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    if (!next.categories) next.categories = {};
    if (!next.categories[catId]) next.categories[catId] = { name: "", subtitle: "", modelCount: 0, badge: null, comingSoon: false };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (next.categories[catId] as any)[field] = value;
    setContent(next);
  };

  // ── SSS (FAQ) helpers — capped at 10 items per category, surfaced under
  // each category panel as a collapsible editor.
  const FAQ_MAX = 10;
  const ensureCategoryRecord = (next: ContentData, catId: string) => {
    if (!next.categories) next.categories = {};
    if (!next.categories[catId]) next.categories[catId] = { name: "", subtitle: "", modelCount: 0, badge: null, comingSoon: false };
    if (!Array.isArray(next.categories[catId].faq)) next.categories[catId].faq = [];
    return next.categories[catId];
  };

  const addFaqItem = (catId: string) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    const meta = ensureCategoryRecord(next, catId);
    const list = meta.faq ?? [];
    if (list.length >= FAQ_MAX) {
      showToast("err", `En fazla ${FAQ_MAX} soru ekleyebilirsiniz.`);
      return;
    }
    meta.faq = [...list, { q: "", a: "" }];
    setContent(next);
  };

  const updateFaqItem = (catId: string, idx: number, field: "q" | "a", value: string) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    const meta = ensureCategoryRecord(next, catId);
    const list = [...(meta.faq ?? [])];
    if (!list[idx]) return;
    list[idx] = { ...list[idx], [field]: value };
    meta.faq = list;
    setContent(next);
  };

  const removeFaqItem = (catId: string, idx: number) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    const meta = ensureCategoryRecord(next, catId);
    meta.faq = (meta.faq ?? []).filter((_, i) => i !== idx);
    setContent(next);
  };

  const moveFaqItem = (catId: string, idx: number, dir: -1 | 1) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    const meta = ensureCategoryRecord(next, catId);
    const list = [...(meta.faq ?? [])];
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];
    meta.faq = list;
    setContent(next);
  };



  // ── Loading screen ──────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  // ── Login screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Image src="/logo-white.png" alt="Bemis Logo" width={160} height={40} priority className="h-10 w-auto object-contain mx-auto mb-5" />
            <h1 className="text-white font-bold text-xl">Yönetim Paneli</h1>
            <p className="text-white/40 text-sm mt-1">Bemis E-V Charge</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25"
            />
            {loginError && (
              <p className="text-amber-400 text-xs flex items-center gap-1.5">
                <HiOutlineExclamation size={14} /> {loginError}
              </p>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: rememberMe ? "white" : "rgba(255,255,255,0.08)", border: `1px solid ${rememberMe ? "white" : "rgba(255,255,255,0.15)"}` }}
              >
                {rememberMe && <span className="text-[#0c0c0e] text-[10px] font-black">✓</span>}
              </div>
              <span className="text-xs text-white/45">Beni hatırla (30 gün)</span>
            </label>
            <button type="submit" disabled={loginLoading} className="w-full bg-white text-[#0c0c0e] font-bold py-3 rounded-xl text-sm disabled:opacity-50">
              {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!content) return null;

  const TAB_ANCHOR_MAP: Partial<Record<Tab, string>> = {
    "hero": "hero", "dna": "dna", "stats": "stats",
    "products": "products", "products-section": "products", "smartcharger": "smartcharger", "productshowcase": "productshowcase", "featured": "featured",
    "calculator": "calculator",
    "dealer-section": "dealer", "dealers": "dealer",
    "reviews": "reviews", "contact-section": "contact", "contact": "contact",
  };

  // For tabs that represent separate pages, use their own URL in the preview iframe
  const SEPARATE_PAGE_TABS: Partial<Record<Tab, string>> = {
    "b2b": "/b2b",
    "products": "/products",
    "documents": "/documents",
  };
  const previewSrc =
    tab === "b2b" ? b2bSubPage
    : tab === "products" && prodSubTab === "section" ? "/"
    : tab === "products" && selCat && selProd ? `/products/${selCat}/${selProd}`
    : (SEPARATE_PAGE_TABS[tab] ?? "/");

  // Fixed items that belong to "Sayfa Bölümleri" but aren't in sectionOrder
  // (contact renders explicitly below sectionOrder on homepage; documents is a separate /documents page)
  const FIXED_SECTION_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "contact",    label: "İletişim",   icon: HiOutlinePhone          },
    { id: "documents",  label: "Dökümanlar", icon: HiOutlineDocumentText   },
    { id: "messages",   label: "Mesajlar",   icon: HiOutlineMail           },
  ];

  const TAB_GROUPS: { label: string; items: { id: Tab; label: string; icon: React.ElementType }[] }[] = [
    {
      label: "Sistem",
      items: [
        { id: "media",      label: "Medya",      icon: HiOutlinePhotograph      },
        { id: "analytics",  label: "Analytics",  icon: HiOutlineChartBar        },
        { id: "changelog",  label: "Değişiklikler", icon: HiOutlineClipboardList },
      ],
    },
  ];

  const handleSaveProductsTab = async () => {
    setSaving(true);
    setSavingProducts(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) }),
        fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(products) }),
      ]);
      if (r1.ok && r2.ok) { contentCleanRef.current = content; productsCleanRef.current = products; setContentDirty(false); setProductsDirty(false); showToast("ok", "Ürünler kaydedildi."); }
      else showToast("err", "Kayıt başarısız.");
    } catch { showToast("err", "Ağ hatası."); }
    setSaving(false);
    setSavingProducts(false);
  };

  const isProductTab = tab === "products";
  const isDealerTab  = tab === "dealers";
  // hero, stats, sections, contact, media all save via handleSaveContent
  const handleSave = isDealerTab ? handleSaveDealers : isProductTab ? handleSaveProductsTab : handleSaveContent;
  const isSaving   = isDealerTab ? dealersSaving : isProductTab ? (saving || savingProducts) : saving;


  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl ${
              toast.type === "ok" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
            }`}
          >
            {toast.type === "ok" ? <HiOutlineCheck size={14} /> : <HiOutlineExclamation size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-white/8 px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo-white.png" alt="Bemis Logo" width={112} height={28} className="h-7 w-auto object-contain" />
          <div className="border-l border-white/12 pl-3">
            <p className="text-sm font-semibold">Yönetim Paneli</p>
            <p className="text-xs text-white/30">Bemis E-V Charge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-3 py-2 rounded-lg hover:bg-white/5">
            <HiOutlineEye size={14} /> Siteyi Gör
          </a>
          <button
            onClick={() => setShowPreview((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200"
            style={showPreview
              ? { background: "rgba(59,130,246,0.15)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.25)" }
              : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            <HiOutlineEye size={14} /> {showPreview ? "Önizlemeyi Kapat" : "Canlı Önizleme"}
          </button>
          <button
            onClick={() => {
              localStorage.setItem("bemis-edit-mode", "1");
              window.location.href = "/";
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", color: "#fff", border: "none" }}
          >
            <HiOutlineTemplate size={14} /> Görsel Düzenleyici
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-3 py-2 rounded-lg hover:bg-white/5">
            <HiOutlineLogout size={14} /> Çıkış
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 border-r border-white/8 px-3 py-3 flex flex-col gap-0 overflow-y-auto">
          {/* ── Sayfa Bölümleri (draggable) ── */}
          <div className="mb-1">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-2 pt-2 pb-1">Sayfa Bölümleri</p>
            {/* Hero: always first, not draggable */}
            <button onClick={() => setTab("hero")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all duration-200 ${tab === "hero" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4"}`}
            >
              <HiOutlineHome size={13} className="flex-shrink-0" /> Hero
            </button>
            {/* Remaining sections: derived from sectionOrder, draggable.
                Stale bin orders (missing newly-added sections) get the
                missing SECTION_META keys auto-appended so new tabs are
                visible even before the operator drags-and-saves the order. */}
            {(() => {
              const stored = content?.sectionOrder ?? ADMIN_DEFAULT_SECTION_ORDER;
              const known = Object.keys(SECTION_META);
              const missing = known.filter((k) => !stored.includes(k));
              return [...stored, ...missing];
            })().map((id, i) => {
              const meta = SECTION_META[id];
              if (!meta) return null;
              const isActive = tab === meta.tab;
              const isDragging = dragFrom === i;
              const isOver = dragTo === i && dragFrom !== null && dragFrom !== i;
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={() => setDragFrom(i)}
                  onDragOver={(e) => { e.preventDefault(); setDragTo(i); }}
                  onDrop={() => { if (dragFrom !== null && dragFrom !== i) reorderSection(dragFrom, i); setDragFrom(null); setDragTo(null); }}
                  onDragEnd={() => { setDragFrom(null); setDragTo(null); }}
                  className="flex items-center gap-0.5 rounded-lg"
                  style={{
                    opacity: isDragging ? 0.35 : 1,
                    outline: isOver ? "1px solid rgba(255,255,255,0.20)" : "none",
                    transition: "opacity 0.15s",
                  }}
                >
                  <HiDotsVertical size={13} className="flex-shrink-0 cursor-grab text-white/18 hover:text-white/40 transition-colors ml-0.5" />
                  <button
                    onClick={() => setTab(meta.tab)}
                    className={`flex-1 flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-left transition-all duration-200 ${isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4"}`}
                  >
                    <meta.icon size={13} className="flex-shrink-0" /> {meta.label}
                  </button>
                </div>
              );
            })}
            {/* Fixed-position items (not in sectionOrder, not draggable) */}
            {FIXED_SECTION_ITEMS.map((t) => (
              <button key={t.id}
                onClick={() => {
                  setTab(t.id);
                  if (t.id !== "b2b") setB2bSubPage("/b2b");
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all duration-200 ${
                  tab === t.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4"
                }`}
              >
                <t.icon size={13} className="flex-shrink-0" /> {t.label}
              </button>
            ))}
          </div>

          {/* ── Sistem ── */}
          {TAB_GROUPS.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-2 pt-2 pb-1">{group.label}</p>
              {group.items.map((t) => (
                <button key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    if (t.id !== "b2b") setB2bSubPage("/b2b");
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all duration-200 ${
                    tab === t.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4"
                  }`}
                >
                  <t.icon size={13} className="flex-shrink-0" /> {t.label}
                </button>
              ))}
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-white/6">
            <button onClick={handleSave} disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#0c0c0e] font-bold py-2.5 rounded-xl text-sm disabled:opacity-60 hover:bg-white/90 relative">
              {isSaving ? <HiOutlineRefresh size={14} className="animate-spin" /> : <HiOutlineSave size={14} />}
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
              {!isSaving && (contentDirty || productsDirty || dealersDirty) && (
                <span className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-amber-500" title="Kaydedilmemiş değişiklik" />
              )}
            </button>
            <p className="text-[10px] text-white/25 text-center mt-2">
              {isProductTab ? "Kategoriler + spec verisi" : "Site içeriği"} JSON&apos;a yazılır
            </p>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>

              {/* ── HERO ── */}
              {tab === "hero" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Ana Sayfa Hero</h2>
                    <p className="text-xs text-white/35">Ziyaretçinin ilk gördüğü bölüm.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <Field label="Rozet Metni" value={content.hero.badge} onChange={(v) => updateContent(["hero", "badge"], v)} />
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Başlık Satır 1" value={content.hero.headline1} onChange={(v) => updateContent(["hero", "headline1"], v)} />
                      <Field label="Başlık Satır 2 (Sabit Kısım — örn. 'Şarj')" value={content.hero.headline2} onChange={(v) => updateContent(["hero", "headline2"], v)} />
                      <div>
                        <Field
                          label="Satır 2 Dönen Kelimeler (virgülle ayır)"
                          // value/onChange simetrik: hiçbir karakteri (virgül,
                          // boşluk) kaybetmeden round-trip et. Temizlik
                          // (trim + boş eleman silme) Hero render time'ında
                          // RotatingWord öncesinde yapılır.
                          value={(content.hero.headline2Words ?? []).join(",")}
                          onChange={(v) => updateContent(
                            ["hero", "headline2Words"],
                            v.split(","),
                          )}
                          placeholder="Sistemleri, Wallbox Çözümleri, Mobil İstasyonları, OCPP Üretimi"
                        />
                        <p className="text-[10px] text-white/30 mt-1">
                          Bu kelimeler Hero başlığında &quot;Sabit Kısım&quot;ın yanında 2.5sn aralıkla dönerek değişir. Sadece değişmesini istediğin kelimeleri yaz — sabit prefix (örn. &quot;Şarj&quot;) yukarıdaki &quot;Başlık Satır 2&quot; alanından gelir. Boş bırakırsan sadece sabit kısım gösterilir.
                        </p>
                      </div>
                      <Field label="Başlık Satır 3 (soluk)" value={content.hero.headline3} onChange={(v) => updateContent(["hero", "headline3"], v)} />
                    </div>
                    <Field label="Alt Açıklama" value={content.hero.subtitle} onChange={(v) => updateContent(["hero", "subtitle"], v)} multiline />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Birincil Buton" value={content.hero.ctaPrimary} onChange={(v) => updateContent(["hero", "ctaPrimary"], v)} />
                      <Field label="İkincil Buton" value={content.hero.ctaSecondary} onChange={(v) => updateContent(["hero", "ctaSecondary"], v)} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-white/70">Arka Plan Görseli</h3>
                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                      <div className="flex gap-2">
                        <input
                          value={content.hero.heroBg ?? ""}
                          onChange={(e) => updateContent(["hero", "heroBg"], e.target.value)}
                          placeholder="Görsel URL veya /uploads/... yolu"
                          className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                        />
                        <button
                          onClick={() => heroBgRef.current?.click()}
                          disabled={heroBgLoading}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {heroBgLoading ? (
                            <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                          ) : (
                            <RiImageAddLine size={14} />
                          )}
                          Yükle
                        </button>
                        <input ref={heroBgRef} type="file" accept="image/*" className="hidden" onChange={handleHeroBgUpload} />
                      </div>

                      {/* ── Focal Point Picker ── */}
                      {content.hero.heroBg && (() => {
                        const raw = content.hero.heroBgPos ?? "50% 50%";
                        const parts = raw.trim().split(/\s+/);
                        const fx = parseFloat(parts[0]) || 50;
                        const fy = parseFloat(parts[1]) || 50;
                        return (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Odak Noktası — Tıkla veya Sürükle</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-white/30">{fx}% {fy}%</span>
                                <button
                                  onClick={() => updateContent(["hero", "heroBgPos"], "50% 50%")}
                                  className="text-[10px] text-white/25 hover:text-white/55 transition-colors underline underline-offset-2"
                                >Ortala</button>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              {/* Main 16:9 picker */}
                              <div
                                ref={focalRef}
                                className="relative rounded-xl overflow-hidden flex-1 cursor-crosshair select-none"
                                style={{ height: 150 }}
                                onMouseDown={handleFocalMove}
                                onMouseMove={(e) => { if (e.buttons === 1) handleFocalMove(e); }}
                              >
                                <img
                                  src={content.hero.heroBg}
                                  alt=""
                                  className="w-full h-full object-cover pointer-events-none"
                                  style={{ objectPosition: `${fx}% ${fy}%` }}
                                  draggable={false}
                                />
                                {/* Grid lines */}
                                {[33,66].map(p => <div key={`v${p}`} className="absolute inset-y-0 pointer-events-none" style={{ left:`${p}%`, width:1, background:"rgba(255,255,255,0.08)" }} />)}
                                {[33,66].map(p => <div key={`h${p}`} className="absolute inset-x-0 pointer-events-none" style={{ top:`${p}%`, height:1, background:"rgba(255,255,255,0.08)" }} />)}
                                {/* Focal dot */}
                                <div
                                  className="absolute pointer-events-none"
                                  style={{ left:`${fx}%`, top:`${fy}%`, transform:"translate(-50%,-50%)", zIndex:10 }}
                                >
                                  <div style={{ width:20, height:20, borderRadius:"50%", border:"2.5px solid #fff", boxShadow:"0 0 0 1.5px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.6)" }} />
                                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:4, height:4, borderRadius:"50%", background:"#fff" }} />
                                </div>
                                {/* Label */}
                                <div className="absolute bottom-1 left-2 text-[9px] text-white/40 pointer-events-none">Geniş ekran</div>
                              </div>

                              {/* Mobile 9:16 crop preview */}
                              <div className="relative rounded-xl overflow-hidden flex-shrink-0 select-none" style={{ width:60, height:150 }}>
                                <img
                                  src={content.hero.heroBg}
                                  alt=""
                                  className="w-full h-full object-cover pointer-events-none"
                                  style={{ objectPosition: `${fx}% ${fy}%` }}
                                  draggable={false}
                                />
                                <div className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/40 pointer-events-none">Mobil</div>
                              </div>
                            </div>
                            <p className="text-[10px] text-white/20">Sol taraftaki görsele tıklayın veya sürükleyin — odak noktası hemen canlı önizlemede yansır.</p>
                          </div>
                        );
                      })()}

                      {content.hero.heroBg && (
                        <button
                          onClick={() => updateContent(["hero", "heroBg"], "")}
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          Görseli kaldır
                        </button>
                      )}

                      {/* İlave hero görselleri — heroBg ile birlikte 3 sn'de bir otomatik geçer (slider) */}
                      <div className="pt-3 mt-1 border-t border-white/8">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-semibold text-white/45 uppercase tracking-wider">İlave Görseller (slider)</p>
                          <button
                            onClick={() => heroImgRef.current?.click()}
                            disabled={heroImgLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50"
                          >
                            {heroImgLoading ? <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" /> : "+ Görsel ekle"}
                          </button>
                          <input ref={heroImgRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageAdd} />
                        </div>
                        {(content.hero.heroImages ?? []).length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {(content.hero.heroImages ?? []).map((img, i) => (
                              <div key={i} className="relative rounded-lg overflow-hidden group" style={{ aspectRatio: "16 / 10" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  onClick={() => updateContent(["hero", "heroImages"], (content.hero.heroImages ?? []).filter((_, j) => j !== i))}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Kaldır"
                                >×</button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-white/25">Ana görselle birlikte döngüye girecek ek görseller ekleyin (3 sn'de bir otomatik geçer).</p>
                        )}
                      </div>

                      <p className="text-[10px] text-white/25 leading-relaxed">
                        Görsel üzerine karanlık overlay uygulanır — okunaklılık korunur. Önerilen: 1920×1080 veya daha büyük, WebP/JPG.
                      </p>
                    </div>
                  </div>
                  {/* Visual Layout Editor */}
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white/70">Görsel Yerleşim Editörü</h3>
                    <p className="text-xs text-white/35 mb-3">
                      Logo, metin bloğu ve butonu sürükleyerek konumlandırın <span className="text-white/20">(masaüstü görünümü)</span>.
                    </p>
                    {/* Canvas */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ paddingBottom: "56.25%" }}>
                      <div
                        ref={canvasRef}
                        className="absolute inset-0"
                        style={{
                          backgroundImage: content.hero.heroBg ? `url('${content.hero.heroBg}')` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          background: !content.hero.heroBg ? "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)" : undefined,
                        }}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.72)" }} />

                        {/* Draggable chips */}
                        {(
                          [
                            { key: "logo"   as HeroLayoutKey, label: "⬜ Logo + Başlık", color: "rgba(255,255,255,0.90)", bg: "rgba(255,255,255,0.15)", border: "rgba(255,255,255,0.30)" },
                            { key: "button" as HeroLayoutKey, label: "🔘 Buton",        color: "rgba(255,255,255,0.70)", bg: "rgba(255,255,255,0.08)",  border: "rgba(255,255,255,0.16)"  },
                          ]
                        ).map(({ key, label, color, bg, border }) => {
                          const pos = content.hero.layout?.[key] ?? { x: 4, y: 30 };
                          return (
                            <div
                              key={key}
                              onMouseDown={(e) => handleLayoutDrag(e, key)}
                              className="absolute select-none z-10"
                              style={{ left: `${pos.x}%`, top: `${pos.y}%`, cursor: "grab" }}
                            >
                              <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap"
                                style={{ background: bg, color, border: `1px solid ${border}`, boxShadow: `0 2px 8px rgba(0,0,0,0.4)` }}>
                                {label}
                              </div>
                              <div className="text-[8px] text-center mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
                                {pos.x}%, {pos.y}%
                              </div>
                            </div>
                          );
                        })}

                        {/* Grid guide lines */}
                        {[25, 50, 75].map((p) => (
                          <div key={p} className="absolute inset-y-0" style={{ left: `${p}%`, width: 1, background: "rgba(255,255,255,0.04)" }} />
                        ))}
                        {[33, 66].map((p) => (
                          <div key={p} className="absolute inset-x-0" style={{ top: `${p}%`, height: 1, background: "rgba(255,255,255,0.04)" }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-[10px] text-white/20 flex-1">Çip üzerine basılı tutup sürükleyin · Kaydet butonuyla uygulanır</p>
                      <button onClick={resetHeroLayout} className="text-[10px] text-white/25 hover:text-white/55 transition-colors underline underline-offset-2">
                        Sıfırla
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-white/70">Şirket Sayıları (Hakkımızda bölümü)</h3>
                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 grid grid-cols-2 gap-4">
                      <Field label="Kuruluş Yılı" value={content.company.foundedYear} onChange={(v) => updateContent(["company", "foundedYear"], v)} />
                      <Field label="İhracat Ülke Sayısı" value={content.company.exportCountries} onChange={(v) => updateContent(["company", "exportCountries"], v)} />
                      <Field label="Ürün Çeşidi" value={content.company.productCount} onChange={(v) => updateContent(["company", "productCount"], v)} />
                      <Field label="Tesis Büyüklüğü" value={content.company.facilitySize} onChange={(v) => updateContent(["company", "facilitySize"], v)} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STATS ── */}
              {tab === "stats" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">İstatistik Kartları</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki animasyonlu sayı kartları.</p>
                  </div>
                  {content.stats.map((stat, i) => (
                    <div key={i} className="bg-white/3 border border-white/7 rounded-2xl p-5">
                      <p className="text-xs font-semibold text-white/50 mb-3">Kart {i + 1}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Sayı Değeri" value={String(stat.value)} onChange={(v) => updateStat(i, "value", parseInt(v) || 0)} />
                        <Field label="Suffix (+, m² vb.)" value={stat.suffix} onChange={(v) => updateStat(i, "suffix", v)} />
                        <Field label="Prefix (IP, boş bırakın)" value={stat.prefix ?? ""} onChange={(v) => updateStat(i, "prefix", v)} />
                        <Field label="Başlık" value={stat.label} onChange={(v) => updateStat(i, "label", v)} />
                        <div className="col-span-2">
                          <Field label="Alt Açıklama" value={stat.description} onChange={(v) => updateStat(i, "description", v)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── PRODUCTS (merged: category cards + spec editor) ── */}
              {tab === "products" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Ürünler</h2>
                    <p className="text-xs text-white/35">Kategori kartlarını ve ürün detaylarını buradan yönetin.</p>
                  </div>

                  {/* Sub-tab switcher */}
                  <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {(["cards", "specs", "section"] as const).map((st) => (
                      <button key={st} onClick={() => setProdSubTab(st)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          background: prodSubTab === st ? "rgba(255,255,255,0.10)" : "transparent",
                          color: prodSubTab === st ? "white" : "rgba(255,255,255,0.40)",
                        }}
                      >
                        {st === "cards" ? "Kategori Kartları" : st === "specs" ? "Ürün Detayları" : "Ana Sayfa Bölümü"}
                      </button>
                    ))}
                  </div>

                  {/* ── Sub-tab: Kategori Kartları ── */}
                  {prodSubTab === "cards" && content.categories && (
                    <div className="max-w-2xl space-y-3">
                      <p className="text-xs text-white/35">Ana sayfadaki kategori kartlarının metin ve durum bilgilerini düzenleyin.</p>
                      {Object.entries(content.categories).map(([catId, meta]) => {
                        const isOpen = expandedCats[catId] !== false; // default open
                        return (
                          <div key={catId} className="bg-white/3 border border-white/7 rounded-2xl overflow-hidden">
                            <button
                              onClick={() => toggleCat(catId)}
                              className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/3 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {isOpen ? <HiOutlineChevronDown size={14} className="text-white/40" /> : <HiOutlineChevronRight size={14} className="text-white/40" />}
                                <span className="text-sm font-semibold text-white">{meta.name}</span>
                                {meta.badge && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)" }}>
                                    {meta.badge}
                                  </span>
                                )}
                                {meta.comingSoon && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-amber-400/70" style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.20)" }}>
                                    Yakında
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-white/25 font-mono">{catId}</span>
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-5 pt-1 border-t border-white/6 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <Field label="Kategori Adı" value={meta.name} onChange={(v) => updateCatMeta(catId, "name", v)} />
                                  <Field label="Alt Başlık" value={meta.subtitle} onChange={(v) => updateCatMeta(catId, "subtitle", v)} />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <Field label="Model Sayısı" value={String(meta.modelCount)} onChange={(v) => updateCatMeta(catId, "modelCount", parseInt(v) || 0)} />
                                  <Field label="Rozet (boş = yok)" value={meta.badge ?? ""} onChange={(v) => updateCatMeta(catId, "badge", v || null)} />
                                  <div>
                                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Yakında Durum</label>
                                    <button
                                      onClick={() => updateCatMeta(catId, "comingSoon", !meta.comingSoon)}
                                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors"
                                      style={{
                                        background: meta.comingSoon ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
                                        border: meta.comingSoon ? "1px solid rgba(245,158,11,0.30)" : "1px solid rgba(255,255,255,0.08)",
                                        color: meta.comingSoon ? "#FBBF24" : "rgba(255,255,255,0.45)",
                                      }}
                                    >
                                      <span className="text-xs font-medium">{meta.comingSoon ? "Yakında aktif" : "Aktif"}</span>
                                      <span className="text-xs">{meta.comingSoon ? "●" : "○"}</span>
                                    </button>
                                  </div>
                                </div>

                                <Field
                                  label="Kategori Açıklaması"
                                  value={meta.description ?? ""}
                                  onChange={(v) => updateCatMeta(catId, "description", v)}
                                  multiline
                                />
                                <p className="text-[10px] text-white/20 -mt-2">Kategori sayfasının üst kısmında gösterilir. Boş bırakılırsa gizlenir.</p>

                                {/* Category hero background image — public
                                    renders it full-bleed behind the title +
                                    description so it greets the visitor when
                                    the category page opens. */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Hero Arka Plan Görseli</label>
                                  {meta.descriptionImage && (
                                    <div className="relative rounded-xl overflow-hidden mb-2" style={{ height: 80 }}>
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={meta.descriptionImage} alt={meta.name} className="w-full h-full object-cover" />
                                      <button
                                        onClick={() => updateCatMeta(catId, "descriptionImage", "")}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] bg-black/60 text-white/70 hover:text-red-400 transition-colors"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <input
                                      value={meta.descriptionImage ?? ""}
                                      onChange={(e) => updateCatMeta(catId, "descriptionImage", e.target.value || "")}
                                      placeholder="/uploads/category-descriptions/... veya URL"
                                      className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                                    />
                                    <button
                                      onClick={() => { setCatDescImgTarget(catId); setTimeout(() => catDescImgRef.current?.click(), 50); }}
                                      disabled={catDescImgLoading === catId}
                                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                      {catDescImgLoading === catId ? (
                                        <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                      ) : (
                                        <RiImageAddLine size={13} />
                                      )}
                                      Yükle
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-white/20 mt-1.5">Kategori sayfasına girince başlık ve açıklamanın arkasına tam-genişlik arka plan olarak yerleşir. Önerilen: geniş (16:9) WebP/JPG, en az 1600px.</p>
                                </div>

                                {/* Category card image */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Kart Görseli</label>
                                  {meta.image && (
                                    <div className="relative rounded-xl overflow-hidden mb-2" style={{ height: 80 }}>
                                      <img src={meta.image} alt={meta.name} className="w-full h-full object-cover" />
                                      <button
                                        onClick={() => updateCatMeta(catId, "image", "")}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] bg-black/60 text-white/70 hover:text-red-400 transition-colors"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <input
                                      value={meta.image ?? ""}
                                      onChange={(e) => updateCatMeta(catId, "image", e.target.value || "")}
                                      placeholder="/uploads/categories/... veya URL"
                                      className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                                    />
                                    <button
                                      onClick={() => { setCatImgTarget(catId); setTimeout(() => catImgRef.current?.click(), 50); }}
                                      disabled={catImgLoading === catId}
                                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                      {catImgLoading === catId ? (
                                        <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                      ) : (
                                        <RiImageAddLine size={13} />
                                      )}
                                      Yükle
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-white/20 mt-1.5">Ana sayfa kategori kartı arka planına uygulanır. Önerilen: 400×300 WebP/JPG.</p>
                                </div>

                                {/* Slider image — toggleable */}
                                <div className="rounded-xl border border-white/8 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Slider Arka Plan</span>
                                    {meta.sliderImage ? (
                                      <button
                                        onClick={() => updateCatMeta(catId, "sliderImage", "")}
                                        className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                                        style={{ background: "rgba(239,68,68,0.12)", color: "rgba(239,68,68,0.80)", border: "1px solid rgba(239,68,68,0.25)" }}
                                      >
                                        ✕ Kaldır
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-white/25">Yok</span>
                                    )}
                                  </div>
                                  {meta.sliderImage ? (
                                    <div className="flex gap-2 items-center">
                                      <div className="relative rounded-lg overflow-hidden flex-1" style={{ height: 56 }}>
                                        <img src={meta.sliderImage} alt="Slider" className="w-full h-full object-cover" />
                                      </div>
                                      <button
                                        onClick={() => { setCatSliderImgTarget(catId); setTimeout(() => catSliderImgRef.current?.click(), 50); }}
                                        disabled={catSliderImgLoading === catId}
                                        className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg font-medium transition-all border whitespace-nowrap hover:border-white/25 hover:text-white/70 disabled:opacity-50"
                                        style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}
                                      >
                                        {catSliderImgLoading === catId ? <div className="w-3 h-3 rounded-full border border-white/20 border-t-white/60 animate-spin" /> : <RiImageAddLine size={12} />}
                                        Değiştir
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => { setCatSliderImgTarget(catId); setTimeout(() => catSliderImgRef.current?.click(), 50); }}
                                      disabled={catSliderImgLoading === catId}
                                      className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg font-medium transition-all w-full justify-center border border-dashed hover:border-white/25 hover:text-white/70 disabled:opacity-50"
                                      style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.35)" }}
                                    >
                                      {catSliderImgLoading === catId ? <div className="w-3 h-3 rounded-full border border-white/20 border-t-white/60 animate-spin" /> : <RiImageAddLine size={12} />}
                                      Slider Görseli Ekle
                                    </button>
                                  )}
                                  <p className="text-[10px] text-white/20">Önerilen: 1200×400 WebP/JPG. Kaldırınca slider yerine başlık gösterilir.</p>
                                </div>

                                {/* Per-category manuals — PDF kullanma kılavuzları.
                                    Bu kategorideki TÜM ürünlerin detay sayfasında
                                    "Belgeler" sekmesinde listelenir. Cloudinary
                                    direct upload (Vercel 4.5MB limit bypass). */}
                                <div className="rounded-xl border border-white/8 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-[11px] font-semibold text-white/55 uppercase tracking-wider">Kullanma Kılavuzları (PDF)</p>
                                      <p className="text-[10px] text-white/30 mt-0.5">
                                        Bu kategorideki tüm ürün detay sayfalarında &quot;Belgeler&quot; sekmesinde listelenir.
                                        {(meta.manuals ?? []).length > 0 && ` ${(meta.manuals ?? []).length} kılavuz.`}
                                      </p>
                                    </div>
                                    <label className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer">
                                      <HiOutlinePlus size={12} /> PDF Ekle
                                      <input
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          e.currentTarget.value = "";
                                          if (!file) return;
                                          try {
                                            const { uploadDocument } = await import("../../lib/clientDocumentUpload");
                                            const { url } = await uploadDocument(file, "categories");
                                            const sizeKb = Math.round(file.size / 1024);
                                            const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
                                            setContent((prev) => {
                                              if (!prev) return prev;
                                              const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                              if (!next.categories[catId]) return prev;
                                              const list = next.categories[catId].manuals ?? [];
                                              list.push({
                                                id: `manual-${Date.now()}`,
                                                name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
                                                url,
                                                size: sizeStr,
                                              });
                                              next.categories[catId].manuals = list;
                                              return next;
                                            });
                                          } catch (err) {
                                            alert(`Yükleme başarısız: ${(err as Error).message}`);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                  {(meta.manuals ?? []).length === 0 && (
                                    <p className="text-[11px] text-white/25 italic px-1 py-2">Henüz kılavuz eklenmemiş.</p>
                                  )}
                                  {(meta.manuals ?? []).map((manual, idx) => (
                                    <div key={manual.id} className="rounded-lg border border-white/7 p-2.5 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                      <span className="text-[10px] text-white/30 font-mono">#{idx + 1}</span>
                                      <input
                                        value={manual.name}
                                        onChange={(e) => {
                                          setContent((prev) => {
                                            if (!prev) return prev;
                                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                            const list = next.categories[catId]?.manuals;
                                            if (list && list[idx]) list[idx].name = e.target.value;
                                            return next;
                                          });
                                        }}
                                        placeholder="Kılavuz adı"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30"
                                      />
                                      {manual.size && (
                                        <span className="text-[10px] text-white/30 font-mono">{manual.size}</span>
                                      )}
                                      <a
                                        href={manual.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-semibold text-white/45 hover:text-white px-2 py-1 rounded-md border border-white/10 hover:border-white/25 transition-colors"
                                      >
                                        Aç
                                      </a>
                                      <button
                                        onClick={() => {
                                          if (!confirm(`"${manual.name}" silinsin mi?`)) return;
                                          setContent((prev) => {
                                            if (!prev) return prev;
                                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                            const list = next.categories[catId]?.manuals;
                                            if (list) list.splice(idx, 1);
                                            return next;
                                          });
                                        }}
                                        className="text-rose-400/70 hover:text-rose-300 px-1.5 py-0.5"
                                        title="Sil"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                {/* Per-category FAQ — capped at FAQ_MAX entries.
                                    Public site renders these between the
                                    product detail and Benzer Ürünler, plus a
                                    FAQPage JSON-LD for Google rich results. */}
                                <div className="rounded-xl border border-white/8 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-[11px] font-semibold text-white/55 uppercase tracking-wider">Sıkça Sorulan Sorular</p>
                                      <p className="text-[10px] text-white/30 mt-0.5">Ürün detay sayfasında benzer ürünlerin üstünde accordion olarak görünür. {(meta.faq ?? []).length}/{FAQ_MAX}</p>
                                    </div>
                                    <button
                                      onClick={() => addFaqItem(catId)}
                                      disabled={(meta.faq ?? []).length >= FAQ_MAX}
                                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:text-white/50"
                                    >
                                      <HiOutlinePlus size={12} /> Soru Ekle
                                    </button>
                                  </div>
                                  {(meta.faq ?? []).length === 0 && (
                                    <p className="text-[11px] text-white/25 italic px-1 py-2">Henüz soru eklenmemiş.</p>
                                  )}
                                  {(meta.faq ?? []).map((item, idx) => {
                                    const last = (meta.faq ?? []).length - 1;
                                    return (
                                      <div key={idx} className="rounded-lg border border-white/7 p-2.5 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-white/30 font-mono">#{idx + 1}</span>
                                          <input
                                            value={item.q}
                                            onChange={(e) => updateFaqItem(catId, idx, "q", e.target.value)}
                                            placeholder="Soru..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30"
                                          />
                                          <button onClick={() => moveFaqItem(catId, idx, -1)} disabled={idx === 0} className="text-white/40 hover:text-white disabled:opacity-25 px-1 py-0.5" title="Yukarı taşı">▲</button>
                                          <button onClick={() => moveFaqItem(catId, idx, 1)} disabled={idx === last} className="text-white/40 hover:text-white disabled:opacity-25 px-1 py-0.5" title="Aşağı taşı">▼</button>
                                          <button onClick={() => removeFaqItem(catId, idx)} className="text-rose-400/70 hover:text-rose-300 px-1.5 py-0.5" title="Sil">×</button>
                                        </div>
                                        <textarea
                                          value={item.a}
                                          onChange={(e) => updateFaqItem(catId, idx, "a", e.target.value)}
                                          placeholder="Cevap..."
                                          rows={2}
                                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 resize-y"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Hidden file input for category image upload */}
                  <input ref={catImgRef} type="file" accept="image/*" className="hidden" onChange={handleCatImgUpload} />
                  {/* Hidden file input for category slider image upload */}
                  <input ref={catSliderImgRef} type="file" accept="image/*" className="hidden" onChange={handleCatSliderImgUpload} />
                  {/* Hidden file input for the description-side image */}
                  <input ref={catDescImgRef} type="file" accept="image/*" className="hidden" onChange={handleCatDescImgUpload} />

                  {/* ── Sub-tab: Ürün Detayları ── */}
                  {prodSubTab === "specs" && (
                    <>
                      <p className="text-xs text-white/35">Ürün bilgilerini, görsellerini ve teknik özelliklerini düzenleyin.</p>

                      {products.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                          <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Category selector — horizontal chips */}
                          <div className="flex flex-wrap gap-2">
                            {products.map((cat) => {
                              const isActive = selCat === cat.id;
                              return (
                                <button key={cat.id} onClick={() => { setSelCat(cat.id); setSelProd(""); }}
                                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                                  style={{
                                    background: isActive ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.05)",
                                    border: `1px solid ${isActive ? "rgba(59,130,246,0.40)" : "rgba(255,255,255,0.08)"}`,
                                    color: isActive ? "#93C5FD" : "rgba(255,255,255,0.45)",
                                  }}
                                >
                                  {cat.name}
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                    style={{ background: isActive ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.08)", color: isActive ? "#93C5FD" : "rgba(255,255,255,0.30)" }}>
                                    {cat.products.length}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Product list — cards grid (variants of the same
                              name collapse into one card; the version
                              switcher lives inside the editor area). */}
                          {currentCat && (
                            <>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {groupVariantsByName(currentCat.products).map((group) => {
                                  const p = group.primary;
                                  const variantCount = group.variants.length;
                                  // Card highlights when *any* variant in the
                                  // family is the active selection.
                                  const isActive = group.variants.some((v) => v.id === selProd);
                                  return (
                                    <div key={group.key} className="relative group/ptab">
                                      <button
                                        onClick={() => {
                                          // Clicking a multi-variant card jumps
                                          // to the family's primary by default;
                                          // the version switcher then lets the
                                          // operator pick the one they want.
                                          setSelProd(isActive ? selProd : p.id);
                                        }}
                                        className="w-full text-left"
                                        style={{
                                          background: isActive ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)",
                                          border: `1px solid ${isActive ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
                                          borderRadius: 14, padding: "10px 12px",
                                        }}
                                      >
                                        {variantCount > 1 ? (
                                          <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mb-1.5"
                                            style={{ background: "rgba(59,130,246,0.20)", color: "#93C5FD" }}>
                                            {variantCount} VERSİYON
                                          </span>
                                        ) : p.badge && (
                                          <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mb-1.5"
                                            style={{ background: "rgba(59,130,246,0.20)", color: "#93C5FD" }}>
                                            {p.badge}
                                          </span>
                                        )}
                                        <p className="text-xs font-bold text-white leading-snug">{p.name}</p>
                                        {variantCount > 1 ? (
                                          <p className="text-[10px] text-white/40 mt-0.5 leading-snug">
                                            {group.variants.map(v => v.subtitle).filter(Boolean).join(" · ") || `${variantCount} versiyon`}
                                          </p>
                                        ) : p.subtitle && (
                                          <p className="text-[10px] text-white/40 mt-0.5 leading-snug">{p.subtitle}</p>
                                        )}
                                        {variantCount === 1 && p.code && (
                                          <p className="text-[9px] font-mono text-white/22 mt-1">{p.code}</p>
                                        )}
                                        {p.image && (
                                          <div className="mt-2 rounded-lg overflow-hidden" style={{ height: 48 }}>
                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                      </button>
                                      {/* Delete button — for multi-variant cards
                                          we deliberately suppress it: the
                                          version switcher inside the editor
                                          handles per-variant deletion (so the
                                          operator can't accidentally drop the
                                          whole family with one click). */}
                                      {variantCount === 1 && (
                                        <button
                                          onClick={() => removeProduct(p.id)}
                                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover/ptab:opacity-100"
                                          title="Ürünü sil"
                                        >
                                          <HiOutlineTrash size={10} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                                {/* Add product card */}
                                <button
                                  onClick={addProduct}
                                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all"
                                  style={{ border: "1px dashed rgba(255,255,255,0.15)", minHeight: 72, color: "rgba(255,255,255,0.30)" }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.30)"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.30)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
                                >
                                  <HiOutlinePlus size={16} />
                                  <span className="text-[10px] font-semibold">Ürün Ekle</span>
                                </button>
                              </div>

                              {!selProd && (
                                <div className="text-center py-8 text-white/25 text-xs">
                                  Düzenlemek için yukarıdan bir ürün seçin.
                                </div>
                              )}

                                {currentProd && (
                                  <div className="space-y-4">
                                    {/* ── Variant switcher (only when this
                                         product is part of a multi-variant
                                         family) ── */}
                                    {(() => {
                                      const info = currentCat ? findVariantGroup(currentCat.products, currentProd.id) : null;
                                      if (!info || info.group.variants.length < 2) return null;
                                      const family = info.group;
                                      return (
                                        <div className="bg-white/3 border border-white/7 rounded-2xl p-3">
                                          <div className="flex items-center justify-between mb-2 px-1">
                                            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                                              {family.variants.length} Versiyon · Düzenlemek için seç
                                            </p>
                                            <button
                                              onClick={() => {
                                                if (!currentCat) return;
                                                const ts = Date.now();
                                                const newId = `${currentCat.id}-${family.key.replace(/[^a-z0-9]+/gi, "-")}-v${ts}`;
                                                const cloneFrom = currentProd;
                                                const newProd: ProductEntry = {
                                                  id: newId,
                                                  name: cloneFrom.name,
                                                  subtitle: "Yeni Versiyon",
                                                  badge: null,
                                                  description: "",
                                                  specs: [{ group: "Genel", items: [{ label: "Özellik", value: "-" }] }],
                                                };
                                                setProducts((prev) => prev.map((cat) =>
                                                  cat.id !== currentCat.id ? cat : { ...cat, products: [...cat.products, newProd] }
                                                ));
                                                setSelProd(newId);
                                              }}
                                              className="flex items-center gap-1 text-[10px] font-medium text-white/45 hover:text-white/80 transition-colors px-2 py-1 rounded-lg border border-white/10 hover:border-white/25"
                                              title={`"${family.primary.name}" için yeni versiyon ekle`}
                                            >
                                              <HiOutlinePlus size={10} /> Yeni Versiyon
                                            </button>
                                          </div>
                                          <div className="flex flex-wrap gap-1.5">
                                            {family.variants.map((v) => {
                                              const isActive = v.id === currentProd.id;
                                              return (
                                                <div key={v.id} className="relative group/vtab">
                                                  <button
                                                    onClick={() => setSelProd(v.id)}
                                                    className="text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
                                                    style={{
                                                      background: isActive ? "rgba(59,130,246,0.20)" : "rgba(255,255,255,0.04)",
                                                      border: `1px solid ${isActive ? "rgba(59,130,246,0.50)" : "rgba(255,255,255,0.08)"}`,
                                                      color: isActive ? "#93C5FD" : "rgba(255,255,255,0.65)",
                                                      paddingRight: 28,
                                                    }}
                                                  >
                                                    <span className="block">{v.subtitle || v.code || "Standart"}</span>
                                                    {v.code && v.subtitle && (
                                                      <span
                                                        className="block text-[9px] font-mono mt-0.5"
                                                        style={{ color: isActive ? "rgba(147,197,253,0.65)" : "rgba(255,255,255,0.30)" }}
                                                      >
                                                        {v.code}
                                                      </span>
                                                    )}
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (!confirm(`"${v.subtitle || v.code || v.name}" versiyonunu silmek istediğinize emin misiniz?`)) return;
                                                      // After deleting, jump to the
                                                      // first remaining variant of
                                                      // the family so the editor
                                                      // doesn't go blank.
                                                      const remaining = family.variants.filter((x) => x.id !== v.id);
                                                      if (remaining.length > 0 && v.id === currentProd.id) {
                                                        setSelProd(remaining[0].id);
                                                      }
                                                      removeProduct(v.id);
                                                    }}
                                                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover/vtab:opacity-100"
                                                    title="Bu versiyonu sil"
                                                  >
                                                    <HiOutlineTrash size={9} />
                                                  </button>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* ── Product card preview ── */}
                                    <div className="bg-white/3 border border-white/7 rounded-2xl p-4">
                                      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-3">Ürün Kartı Önizleme</p>
                                      <div className="flex gap-4 items-start">
                                        {/* Thumbnail */}
                                        <div
                                          className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                                          style={{ width: 96, height: 96, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                                        >
                                          {(() => {
                                            const imgs = currentProd.images ?? (currentProd.image ? [currentProd.image] : []);
                                            return imgs[0]
                                              ? <img src={imgs[0]} alt={currentProd.name} className="w-full h-full object-cover" />
                                              : <HiOutlineCube size={28} style={{ color: "rgba(255,255,255,0.15)" }} />;
                                          })()}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                          {currentProd.badge && (
                                            <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
                                              style={{ background: `${currentCat?.accent ?? "#3B82F6"}18`, color: currentCat?.accent ?? "#3B82F6", border: `1px solid ${currentCat?.accent ?? "#3B82F6"}30` }}>
                                              {currentProd.badge}
                                            </span>
                                          )}
                                          <p className="text-sm font-bold text-white leading-tight truncate">{currentProd.name || <span className="text-white/25 italic">Ürün Adı</span>}</p>
                                          {currentProd.code && (
                                            <span className="text-[9px] font-mono text-white/40 bg-white/6 px-1.5 py-0.5 rounded mt-0.5 inline-block">{currentProd.code}</span>
                                          )}
                                          {currentProd.subtitle && (
                                            <p className="text-[11px] mt-0.5 truncate" style={{ color: currentCat?.accent ?? "#3B82F6" }}>{currentProd.subtitle}</p>
                                          )}
                                          {currentProd.description && (
                                            <p className="text-[10px] text-white/35 mt-1 line-clamp-2 leading-relaxed">{currentProd.description}</p>
                                          )}
                                          {/* First spec group preview */}
                                          {currentProd.specs?.[0]?.items?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                              {currentProd.specs[0].items.slice(0, 3).map((item, i) => (
                                                <span key={i} className="text-[9px] px-2 py-0.5 rounded-lg font-medium"
                                                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.50)" }}>
                                                  {item.label}: {item.value}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Basic info */}
                                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                                      <p className="text-xs font-semibold text-white/50">Genel Bilgiler</p>
                                      <div className="grid grid-cols-2 gap-3">
                                        <Field label="Ürün Adı" value={currentProd.name} onChange={(v) => updateProd("name", v)} />
                                        <Field label="Ürün Kodu" value={currentProd.code ?? ""} onChange={(v) => updateProd("code", v || undefined as unknown as null)} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <Field label="EAN / Barkod (pazaryeri)" value={currentProd.ean ?? ""} onChange={(v) => updateProd("ean", (v || undefined) as unknown as null)} />
                                        <Field label="Desi (kargo)" value={currentProd.desi ?? ""} onChange={(v) => updateProd("desi", (v || undefined) as unknown as null)} />
                                      </div>
                                      <Field label="Alt Başlık" value={currentProd.subtitle} onChange={(v) => updateProd("subtitle", v)} />
                                      <Field label="Rozet (boş bırakın = yok)" value={currentProd.badge ?? ""} onChange={(v) => updateProd("badge", v || null)} />
                                      <Field label="Açıklama" value={currentProd.description} onChange={(v) => updateProd("description", v)} multiline />
                                      {/* Product images */}
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider">Ürün Görselleri</label>
                                          <span className="text-[10px] text-white/25">{(currentProd.images ?? (currentProd.image ? [currentProd.image] : [])).length} görsel</span>
                                        </div>
                                        {/* Thumbnail grid */}
                                        {(() => {
                                          const imgs = currentProd.images ?? (currentProd.image ? [currentProd.image] : []);
                                          return (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                              {imgs.map((url, idx) => (
                                                <div key={idx} className="relative group/img rounded-xl overflow-hidden flex-shrink-0" style={{ width: 80, height: 64 }}>
                                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors" />
                                                  <button
                                                    onClick={() => {
                                                      const next = imgs.filter((_, i) => i !== idx);
                                                      setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
                                                        ...cat,
                                                        products: cat.products.map((p) => p.id !== selProd ? p : {
                                                          ...p, images: next, image: next[0] ?? undefined,
                                                        }),
                                                      }));
                                                    }}
                                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white/70 hover:text-red-400 flex items-center justify-center text-[10px] opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                  >✕</button>
                                                  {idx === 0 && (
                                                    <div className="absolute bottom-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white/60">Ana</div>
                                                  )}
                                                </div>
                                              ))}
                                              {/* Add button */}
                                              <button
                                                onClick={() => prodImgRef.current?.click()}
                                                disabled={prodImgLoading}
                                                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 text-white/35 hover:border-white/40 hover:text-white/60 transition-colors disabled:opacity-50 flex-shrink-0 gap-1"
                                                style={{ width: 80, height: 64 }}
                                              >
                                                {prodImgLoading ? (
                                                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                                ) : (
                                                  <>
                                                    <RiImageAddLine size={16} />
                                                    <span className="text-[9px] font-medium">Ekle</span>
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          );
                                        })()}
                                        <p className="text-[10px] text-white/20">İlk görsel ürün listelerinde ana görsel olarak kullanılır. Önerilen: 800×600 WebP/JPG.</p>
                                        <input ref={prodImgRef} type="file" accept="image/*" className="hidden" onChange={handleProdImgUpload} />
                                      </div>
                                    </div>

                                    {/* Feature toggles — shown as small icon
                                        badges on product cards. Selected ids
                                        live in `product.features[]`. */}
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-xs font-semibold text-white/50 mb-1">Ürün Özellikleri</p>
                                          <p className="text-[10px] text-white/30">Ürün kartlarında küçük ikon olarak gösterilir. OCPP ve Mobil Uygulama seçilirse karta browser/telefon mockup'ı eklenir.</p>
                                        </div>
                                        {/* "Varyantlara Uygula" — bu ürünün
                                            features seçimini SADECE aynı isimli
                                            (variant grubu) diğer ürünlere
                                            kopyalar. Başka kategoriler veya
                                            farklı isimli ürünler etkilenmez.
                                            Ürün-bazlı tek tıklama: aynı
                                            ailedeki tüm modellerin teknik
                                            özellikleri zaten aynı, admin'de
                                            tek tek seçmeye gerek yok. */}
                                        {(() => {
                                          const cat = products.find((c) => c.id === selCat);
                                          if (!cat || !currentProd) return null;
                                          const family = (cat.products ?? []).filter((p) => p.name === currentProd.name && p.id !== currentProd.id);
                                          if (family.length === 0) return null;
                                          return (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (!window.confirm(`"${currentProd.name}" ailesindeki ${family.length} diğer varyanta bu özelliklerin AYNISI uygulanacak. Devam edilsin mi?`)) return;
                                                setProducts((prev) => {
                                                  const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
                                                  const c = next.find((x) => x.id === selCat);
                                                  const src = c?.products.find((p) => p.id === selProd);
                                                  if (!c || !src) return prev;
                                                  const srcFeatures = [...(src.features ?? [])];
                                                  c.products.forEach((p) => {
                                                    if (p.name === src.name && p.id !== src.id) {
                                                      p.features = [...srcFeatures];
                                                    }
                                                  });
                                                  return next;
                                                });
                                                showToast("ok", `${family.length} varyanta özellikler uygulandı.`);
                                              }}
                                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all hover:scale-[1.02] flex-shrink-0"
                                              style={{
                                                background: "rgba(59,130,246,0.15)",
                                                border: "1px solid rgba(59,130,246,0.45)",
                                                color: "#93C5FD",
                                              }}
                                              title={`Bu ürünün özelliklerini "${currentProd.name}" ailesindeki ${family.length} varyanta kopyala`}
                                            >
                                              ⤴ {family.length} varyanta uygula
                                            </button>
                                          );
                                        })()}
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                        {PRODUCT_FEATURES.map((f) => {
                                          const enabled = (currentProd.features ?? []).includes(f.id);
                                          return (
                                            <label
                                              key={f.id}
                                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                                              style={{
                                                background: enabled ? `${f.accent}1f` : "rgba(255,255,255,0.03)",
                                                border: enabled ? `1px solid ${f.accent}66` : "1px solid rgba(255,255,255,0.06)",
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => {
                                                  setProducts((prev) => {
                                                    const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
                                                    const cat = next.find((c) => c.id === selCat);
                                                    const prod = cat?.products.find((p) => p.id === selProd);
                                                    if (!prod) return prev;
                                                    const cur = new Set(prod.features ?? []);
                                                    if (e.target.checked) cur.add(f.id); else cur.delete(f.id);
                                                    prod.features = Array.from(cur);
                                                    return next;
                                                  });
                                                }}
                                                className="accent-blue-500"
                                              />
                                              <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: f.accent }} />
                                              <span className="text-[11px] font-semibold" style={{ color: enabled ? "#ffffff" : "rgba(255,255,255,0.55)" }}>{f.label}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Certifications — IP ratings deliberately
                                        not here; they belong in the Çevresel
                                        spec group as a technical attribute. */}
                                    <div className="space-y-2">
                                      <div>
                                        <p className="text-xs font-semibold text-white/50 mb-1">Sertifikalar</p>
                                        <p className="text-[10px] text-white/30">Ürün açıklamasının altında küçük marka rozetleri olarak görünür. Sadece ürünün gerçekten sahip olduğu sertifikaları işaretle.</p>
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                        {PRODUCT_CERTIFICATES.map((c) => {
                                          const enabled = (currentProd.certificates ?? []).includes(c.id);
                                          return (
                                            <label
                                              key={c.id}
                                              title={c.fullLabel}
                                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                                              style={{
                                                background: enabled ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.03)",
                                                border: enabled ? "1px solid rgba(59,130,246,0.55)" : "1px solid rgba(255,255,255,0.06)",
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={enabled}
                                                onChange={(e) => {
                                                  setProducts((prev) => {
                                                    const next = JSON.parse(JSON.stringify(prev)) as CategoryData[];
                                                    const cat = next.find((cc) => cc.id === selCat);
                                                    const prod = cat?.products.find((p) => p.id === selProd);
                                                    if (!prod) return prev;
                                                    const cur = new Set(prod.certificates ?? []);
                                                    if (e.target.checked) cur.add(c.id); else cur.delete(c.id);
                                                    prod.certificates = Array.from(cur);
                                                    return next;
                                                  });
                                                }}
                                                className="accent-blue-500"
                                              />
                                              <span
                                                className="inline-flex items-center justify-center rounded-sm flex-shrink-0 text-[10px] font-bold tracking-wider bg-white text-slate-900"
                                                style={{ minWidth: 38, height: 18, padding: "0 6px" }}
                                              >
                                                {c.label}
                                              </span>
                                              <span className="text-[11px] font-semibold" style={{ color: enabled ? "#ffffff" : "rgba(255,255,255,0.55)" }}>{c.fullLabel}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Box contents — what the customer
                                        actually finds inside the box (cable
                                        bag, extra adapter, etc). Admin edits
                                        an ordered list; public renders it as
                                        a strip beneath the main gallery. */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-xs font-semibold text-white/50 mb-1">Paket İçeriği</p>
                                          <p className="text-[10px] text-white/30">Kutudan çıkanlar — adlandır, görsel ekle. Galerinin altında ürün sayfasında görünür.</p>
                                        </div>
                                        <button
                                          onClick={addBoxContentRow}
                                          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20"
                                        >
                                          <HiOutlinePlus size={12} /> Satır Ekle
                                        </button>
                                      </div>
                                      {(currentProd.boxContents ?? []).length === 0 && (
                                        <p className="text-[11px] text-white/25 italic px-1 py-2">Henüz içerik eklenmemiş.</p>
                                      )}
                                      {(currentProd.boxContents ?? []).map((row, ri) => {
                                        const last = (currentProd.boxContents ?? []).length - 1;
                                        return (
                                          <div key={ri} className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/3 border border-white/7">
                                            <button
                                              onClick={() => triggerBoxContentImg(ri)}
                                              className="w-12 h-12 flex-shrink-0 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden"
                                              title="Görsel yükle"
                                            >
                                              {row.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={row.image} alt="" className="w-full h-full object-contain p-1" />
                                              ) : (
                                                <HiOutlinePlus size={16} className="text-white/40" />
                                              )}
                                            </button>
                                            <input
                                              value={row.name}
                                              onChange={(e) => updateBoxContentName(ri, e.target.value)}
                                              placeholder="Örn: Taşıma Çantası"
                                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30"
                                            />
                                            <button
                                              onClick={() => moveBoxContentRow(ri, -1)}
                                              disabled={ri === 0}
                                              className="text-white/40 hover:text-white disabled:opacity-25 disabled:hover:text-white/40 px-1.5 py-1"
                                              title="Yukarı taşı"
                                            >
                                              ▲
                                            </button>
                                            <button
                                              onClick={() => moveBoxContentRow(ri, 1)}
                                              disabled={ri === last}
                                              className="text-white/40 hover:text-white disabled:opacity-25 disabled:hover:text-white/40 px-1.5 py-1"
                                              title="Aşağı taşı"
                                            >
                                              ▼
                                            </button>
                                            <button
                                              onClick={() => removeBoxContentRow(ri)}
                                              className="text-rose-400/70 hover:text-rose-300 px-2 py-1"
                                              title="Sil"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        );
                                      })}
                                      <input ref={bcImgRef} type="file" accept="image/*" className="hidden" onChange={handleBoxContentImgUpload} />
                                    </div>

                                    {/* Spec groups */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-white/50">Teknik Özellikler</p>
                                        <button onClick={addSpecGroup}
                                          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20">
                                          <HiOutlinePlus size={12} /> Grup Ekle
                                        </button>
                                      </div>

                                      {currentProd.specs.map((group, gi) => {
                                        const gkey = `${selCat}-${selProd}-${gi}`;
                                        const expanded = expandedGroups[gkey] !== false;
                                        const isPrice = /fiyat|price/i.test(group.group);
                                        return (
                                          <div key={gi} className="bg-white/3 border border-white/7 rounded-2xl overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                                              <button onClick={() => toggleGroup(gkey)} className="text-white/40 hover:text-white/60">
                                                {expanded ? <HiOutlineChevronDown size={14} /> : <HiOutlineChevronRight size={14} />}
                                              </button>
                                              <input
                                                value={group.group}
                                                onChange={(e) => updateGroupName(gi, e.target.value)}
                                                className="flex-1 bg-transparent text-sm font-semibold text-white focus:outline-none"
                                              />
                                              {isPrice && (
                                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "rgba(147,197,253,0.80)" }}>KDV Hariç</span>
                                              )}
                                              <button onClick={() => removeSpecGroup(gi)} className="text-white/25 hover:text-red-400 p-1">
                                                <HiOutlineTrash size={13} />
                                              </button>
                                            </div>

                                            {expanded && (
                                              <div className="p-3 space-y-2">
                                                {group.items.map((item, ii) => (
                                                  <div key={ii} className="flex items-center gap-2">
                                                    <input
                                                      value={item.label}
                                                      onChange={(e) => updateSpecValue(gi, ii, "label", e.target.value)}
                                                      placeholder="Özellik adı"
                                                      className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/20"
                                                    />
                                                    <span className="text-white/20 text-xs">:</span>
                                                    <input
                                                      value={item.value}
                                                      onChange={(e) => updateSpecValue(gi, ii, "value", e.target.value)}
                                                      placeholder="Değer"
                                                      className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/20"
                                                    />
                                                    <button onClick={() => removeSpecItem(gi, ii)} className="text-white/20 hover:text-red-400 p-1 flex-shrink-0">
                                                      <HiOutlineTrash size={12} />
                                                    </button>
                                                  </div>
                                                ))}
                                                <button onClick={() => addSpecItem(gi)}
                                                  className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 mt-1 px-2 py-1">
                                                  <HiOutlinePlus size={11} /> Satır ekle
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Eski "Genel Özellikler" madde listesi
                                        kaldırıldı — özellikler artık üst
                                        bölümdeki kutucuk grid'inden seçilir
                                        ve aynı ürün karta + detay sayfasının
                                        Genel Özellikler sekmesine yansır. */}

                                    {/* ── Dökümanlar (PDF / dış link) ── */}
                                    {(() => {
                                      const docs = currentProd.documents ?? [];
                                      const updateAll = (next: ProductDocument[]) => {
                                        setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
                                          ...cat,
                                          products: cat.products.map((p) => p.id !== selProd ? p : { ...p, documents: next }),
                                        }));
                                      };
                                      return (
                                        <div className="space-y-3 pt-4 border-t border-white/6">
                                          <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-white/50">Dökümanlar</p>
                                            <button
                                              onClick={() => updateAll([...docs, { label: "", url: "" }])}
                                              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20"
                                            >
                                              <HiOutlinePlus size={12} /> Belge Ekle
                                            </button>
                                          </div>
                                          <p className="text-[10px] text-white/30">
                                            PDF, datasheet veya dış link. URL alanına PDF yüklemek için "Yükle" butonunu kullanabilirsiniz (Cloudinary üzerinden).
                                          </p>
                                          {docs.length === 0 ? (
                                            <p className="text-[11px] text-white/25 italic text-center py-2">
                                              Henüz belge eklenmemiş.
                                            </p>
                                          ) : (
                                            <div className="space-y-2">
                                              {docs.map((doc, i) => (
                                                <div key={i} className="rounded-xl border border-white/7 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                                  <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-bold text-white/30">#{i + 1}</span>
                                                    <button
                                                      onClick={() => updateAll(docs.filter((_, k) => k !== i))}
                                                      className="text-[10px] text-red-400/50 hover:text-red-400 transition-colors"
                                                    >
                                                      Sil
                                                    </button>
                                                  </div>
                                                  <input
                                                    value={doc.label}
                                                    onChange={(e) => {
                                                      const next = [...docs];
                                                      next[i] = { ...next[i], label: e.target.value };
                                                      updateAll(next);
                                                    }}
                                                    placeholder="Belge adı (örn. Datasheet)"
                                                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/20"
                                                  />
                                                  <div className="flex items-center gap-2">
                                                    <input
                                                      value={doc.url}
                                                      onChange={(e) => {
                                                        const next = [...docs];
                                                        next[i] = { ...next[i], url: e.target.value };
                                                        updateAll(next);
                                                      }}
                                                      placeholder="https://… veya PDF URL"
                                                      className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-white/20"
                                                    />
                                                    <label className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors cursor-pointer flex-shrink-0">
                                                      <RiImageAddLine size={13} />
                                                      <span>Yükle</span>
                                                      <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                          const file = e.target.files?.[0];
                                                          if (!file) return;
                                                          const fd = new FormData();
                                                          fd.append("file", file);
                                                          fd.append("folder", "product-docs");
                                                          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                                                          if (res.ok) {
                                                            const { url } = await res.json();
                                                            const next = [...docs];
                                                            next[i] = { ...next[i], url, label: next[i].label || file.name.replace(/\.[^.]+$/, "") };
                                                            updateAll(next);
                                                            showToast("ok", "Belge yüklendi.");
                                                          } else {
                                                            const err = await res.json().catch(() => ({}));
                                                            showToast("err", `Yükleme başarısız: ${err.error ?? res.status}`);
                                                          }
                                                          if (e.target) e.target.value = "";
                                                        }}
                                                      />
                                                    </label>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}
                              </>
                            )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Sub-tab: Bölüm Metinleri ── */}
                  {prodSubTab === "section" && (
                    <div className="max-w-2xl space-y-5">
                      <p className="text-xs text-white/35">Ana sayfadaki ürünler bölümünün başlık ve buton metinlerini düzenleyin.</p>

                      {/* Slider göster/gizle */}
                      <div className="bg-white/3 border border-white/7 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">Slider Göster</p>
                            <p className="text-[11px] text-white/35 mt-0.5">Kapalıyken kategori banner'ı yerine başlık gösterilir.</p>
                          </div>
                          <button
                            onClick={async () => {
                              const next = JSON.parse(JSON.stringify(content)) as ContentData;
                              const isCurrentlyOn = next.products.sliderEnabled !== false;
                              next.products.sliderEnabled = !isCurrentlyOn;
                              setContent(next);
                              await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                              setPreviewKey((k) => k + 1);
                            }}
                            className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                            style={{ background: content.products.sliderEnabled !== false ? "#3B82F6" : "rgba(255,255,255,0.12)" }}
                          >
                            <span
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                              style={{ left: content.products.sliderEnabled !== false ? "22px" : "2px" }}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Bölüm Etiketi" value={content.products.sectionLabel ?? ""} onChange={(v) => updateContent(["products","sectionLabel"], v)} />
                          <Field label="Bölüm Başlığı" value={content.products.heading}             onChange={(v) => updateContent(["products","heading"],      v)} />
                        </div>
                        <Field label="Alt Başlık" value={content.products.subheading} onChange={(v) => updateContent(["products","subheading"], v)} />
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Tüm Ürünler Butonu" value={content.products.allProductsLabel ?? ""} onChange={(v) => updateContent(["products","allProductsLabel"], v)} />
                          <Field label="İncele Butonu"       value={content.products.viewLabel ?? ""}       onChange={(v) => updateContent(["products","viewLabel"],       v)} />
                        </div>
                      </div>

                      <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-2">
                        <p className="text-xs font-semibold text-white/50">Tüm Ürünler Sayfası</p>
                        <Field
                          label="Sayfa Açıklaması"
                          value={content.products.allProductsDescription ?? ""}
                          onChange={(v) => updateContent(["products","allProductsDescription"], v)}
                          multiline
                        />
                        <p className="text-[10px] text-white/20">/products sayfasının üst kısmında gösterilir. Boş bırakılırsa gizlenir.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── CONTACT ── */}
              {tab === "contact" && (
                <div className="max-w-xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">İletişim</h2>
                    <p className="text-xs text-white/35">İletişim bilgileri ve ana sayfadaki iletişim bölümünün metinleri.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <p className="text-xs font-semibold text-white/50">Ana Sayfa Bölüm Başlıkları</p>
                    <Field label="Bölüm Etiketi" value={content.contactSection.sectionLabel} onChange={(v) => updateContent(["contactSection","sectionLabel"], v)} />
                    <Field label="Başlık"        value={content.contactSection.heading}      onChange={(v) => updateContent(["contactSection","heading"],      v)} />
                    <Field label="Alt Açıklama"  value={content.contactSection.subheading}   onChange={(v) => updateContent(["contactSection","subheading"],   v)} multiline />
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Telefon" value={content.contact.phone} onChange={(v) => updateContent(["contact", "phone"], v)} />
                      <Field label="E-posta" value={content.contact.email} onChange={(v) => updateContent(["contact", "email"], v)} validate={validateEmail} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Çalışma Günleri" value={content.contact.workingDays} onChange={(v) => updateContent(["contact", "workingDays"], v)} />
                      <Field label="Çalışma Saatleri" value={content.contact.workingHours} onChange={(v) => updateContent(["contact", "workingHours"], v)} />
                    </div>
                    <Field label="Adres (Şehir / Bölge)" value={content.contact.address} onChange={(v) => updateContent(["contact", "address"], v)} />
                    <Field label="Adres Alt Satır" value={content.contact.addressSub} onChange={(v) => updateContent(["contact", "addressSub"], v)} />
                  </div>

                  {/* B2B Portal kısayolu */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-0.5">B2B Portal Linki</p>
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        Navbar&apos;da &quot;Bize Ulaşın&quot; tuşunun yanında küçük bir &quot;B2B&quot; pill olarak gözükür. Bayilerimiz tek tıkla B2B portala ulaşır. URL boş bırakılırsa pill hiç render edilmez.
                      </p>
                    </div>
                    <Field
                      label="B2B Portal URL"
                      value={content.navbar?.b2bPortalUrl ?? ""}
                      onChange={(v) => updateContent(["navbar", "b2bPortalUrl"], v)}
                      placeholder="https://b2b.bemisevcharge.com.tr"
                    />
                  </div>

                  {/* WhatsApp ayarları */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-0.5">WhatsApp Butonu (sağ alt köşe)</p>
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        Sayfaya gelen ziyaretçiler tek tıkla WhatsApp&apos;tan yazışabilir. Telefon boş bırakılırsa yukarıdaki ana telefon kullanılır — WhatsApp Business kayıtlı bir cep numarası önerilir.
                      </p>
                    </div>
                    <Field label="WhatsApp Numarası (boşsa ana telefon kullanılır)"
                      value={content.contact.whatsappPhone ?? ""}
                      onChange={(v) => updateContent(["contact", "whatsappPhone"], v)}
                      placeholder="+90 5XX XXX XX XX" />
                    <Field label="Hazır Mesaj Metni (kullanıcı butona basınca otomatik dolu gelir)"
                      value={content.contact.whatsappMessage ?? ""}
                      onChange={(v) => updateContent(["contact", "whatsappMessage"], v)}
                      placeholder="Merhaba, Bemis E-V Charge ürünleri hakkında bilgi almak istiyorum."
                      multiline />
                  </div>
                  {content.social && (
                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                      <p className="text-xs font-semibold text-white/50 mb-1">Sosyal Medya Bağlantıları</p>
                      <p className="text-[11px] text-white/30 -mt-2">Boş bırakılan ikonlar gizlenir. Tam URL girin (https://...)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white/40">in</span>
                        </div>
                        <input value={content.social?.linkedin ?? ""} onChange={(e) => updateContent(["social", "linkedin"], e.target.value)}
                          placeholder="https://linkedin.com/company/..."
                          className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white/40">ig</span>
                        </div>
                        <input value={content.social?.instagram ?? ""} onChange={(e) => updateContent(["social", "instagram"], e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white/40">yt</span>
                        </div>
                        <input value={content.social?.youtube ?? ""} onChange={(e) => updateContent(["social", "youtube"], e.target.value)}
                          placeholder="https://youtube.com/@bemisevcharge"
                          className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white/40">fb</span>
                        </div>
                        <input value={content.social?.facebook ?? ""} onChange={(e) => updateContent(["social", "facebook"], e.target.value)}
                          placeholder="https://facebook.com/bemisevcharge"
                          className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                      </div>

                    </div>
                  )}

                  {/* Arama motoru sahiplik doğrulama — Search Console,
                      Yandex Webmaster, Bing Webmaster Tools verification
                      token'larını <head> içine meta etiketi olarak gömüyoruz. */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/60">Arama Motoru Sahiplik Doğrulama</p>
                      <p className="text-[11px] text-white/30 leading-snug mt-0.5">
                        Her platform &quot;HTML etiketi&quot; doğrulama yöntemiyle bir token verir; sadece <strong>content=&quot;...&quot;</strong> içindeki değeri yapıştırın (tırnak yok, tam etiket yok). Boş bırakılan platform gizlenir.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white/40">G</span>
                      </div>
                      <input
                        value={content.siteVerification?.google ?? ""}
                        onChange={(e) => updateContent(["siteVerification", "google"], e.target.value)}
                        placeholder="google-site-verification token'ı"
                        className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white/40">Y</span>
                      </div>
                      <input
                        value={content.siteVerification?.yandex ?? ""}
                        onChange={(e) => updateContent(["siteVerification", "yandex"], e.target.value)}
                        placeholder="yandex-verification token'ı"
                        className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white/40">B</span>
                      </div>
                      <input
                        value={content.siteVerification?.bing ?? ""}
                        onChange={(e) => updateContent(["siteVerification", "bing"], e.target.value)}
                        placeholder="msvalidate.01 token'ı"
                        className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 font-mono"
                      />
                    </div>
                  </div>

                  {/* Otomatik Cevap Maili — form dolduran kullanıcıya
                      gönderilen "mesajınız alındı" mailinin metinleri.
                      Boş bırakılan alan koddaki varsayılana düşer.
                      Değişkenler: {name}, {topicLabel}, {formKind},
                      {contactEmail} — gönderim sırasında yerine geçer. */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-white/60">Otomatik Cevap Maili Şablonu</p>
                      <p className="text-[11px] text-white/30 leading-snug mt-0.5">
                        Form dolduran kullanıcıya gönderilen &quot;Mesajınız alındı&quot; mailinin metinleri. Boş alanlar varsayılana düşer. Cümle içinde
                        <code className="px-1 mx-0.5 text-white/55 bg-white/8 rounded">{"{name}"}</code>,
                        <code className="px-1 mx-0.5 text-white/55 bg-white/8 rounded">{"{topicLabel}"}</code>,
                        <code className="px-1 mx-0.5 text-white/55 bg-white/8 rounded">{"{formKind}"}</code>,
                        <code className="px-1 mx-0.5 text-white/55 bg-white/8 rounded">{"{contactEmail}"}</code>
                        yazarsan otomatik yerine konur.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field
                        label="Mail Konusu (Subject)"
                        value={content.emailTemplates?.autoReply?.subject ?? ""}
                        onChange={(v) => updateContent(["emailTemplates", "autoReply", "subject"], v)}
                        placeholder="Mesajınız alındı — Bemis E-V Charge"
                      />
                      <Field
                        label="Üst Başlık"
                        value={content.emailTemplates?.autoReply?.heading ?? ""}
                        onChange={(v) => updateContent(["emailTemplates", "autoReply", "heading"], v)}
                        placeholder="Mesajınızı aldık 👋"
                      />
                    </div>
                    <Field
                      label="Karşılama (greeting)"
                      value={content.emailTemplates?.autoReply?.greeting ?? ""}
                      onChange={(v) => updateContent(["emailTemplates", "autoReply", "greeting"], v)}
                      placeholder="Merhaba {name},"
                    />
                    <Field
                      label="1. Paragraf"
                      value={content.emailTemplates?.autoReply?.intro1 ?? ""}
                      onChange={(v) => updateContent(["emailTemplates", "autoReply", "intro1"], v)}
                      placeholder='"{topicLabel}" konulu mesajınız ekibimize ulaştı. En kısa sürede dönüş yapacağız — genellikle iş günleri içinde 24 saat içinde yanıt veriyoruz.'
                      multiline
                    />
                    <Field
                      label="2. Paragraf"
                      value={content.emailTemplates?.autoReply?.intro2 ?? ""}
                      onChange={(v) => updateContent(["emailTemplates", "autoReply", "intro2"], v)}
                      placeholder="Acil bir durum varsa bize doğrudan telefondan da ulaşabilirsiniz."
                      multiline
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field
                        label="Mesaj Alıntı Başlığı"
                        value={content.emailTemplates?.autoReply?.quoteHeading ?? ""}
                        onChange={(v) => updateContent(["emailTemplates", "autoReply", "quoteHeading"], v)}
                        placeholder="Bize Gönderdiğiniz Mesaj"
                      />
                      <Field
                        label="Şirket Adresi"
                        value={content.emailTemplates?.autoReply?.companyAddress ?? ""}
                        onChange={(v) => updateContent(["emailTemplates", "autoReply", "companyAddress"], v)}
                        placeholder="Bursa, Türkiye"
                      />
                    </div>
                    <Field
                      label="İletişim E-postası (alt-bilgi)"
                      value={content.emailTemplates?.autoReply?.contactEmail ?? ""}
                      onChange={(v) => updateContent(["emailTemplates", "autoReply", "contactEmail"], v)}
                      placeholder="info@bemisevcharge.com"
                    />
                    <Field
                      label="Alt Bilgi Notu"
                      value={content.emailTemplates?.autoReply?.footerNote ?? ""}
                      onChange={(v) => updateContent(["emailTemplates", "autoReply", "footerNote"], v)}
                      placeholder="Bu mesaj otomatik gönderilmiştir. Cevap atmanız gerekmiyor — ekibimize ulaşmak için {contactEmail} kullanın."
                      multiline
                    />
                  </div>

                  {/* Reklam & Pixel Yönetimi — operatörün Google Ads
                      conversion ID + Meta Pixel ID'sini admin'den
                      değiştirebileceği basit form. Boş kalan alan o
                      kanal için tracking'i kapatır. */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-0.5">Reklam & Pixel Yönetimi</p>
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        Google Ads conversion ve Meta (Facebook) Pixel ID&apos;leri. Boş bırakılan kanal için tracking kapanır. Çerez onayı (Tümünü Kabul Et) gerekir — KVKK/GDPR uyumlu.
                      </p>
                    </div>
                    <Field
                      label="GA4 Measurement ID"
                      value={content.marketing?.ga4Id ?? ""}
                      onChange={(v) => updateContent(["marketing","ga4Id"], v)}
                      placeholder="G-XXXXXXXXXX (boş bırakılırsa varsayılan kullanılır)"
                    />
                    <Field
                      label="Google Ads Conversion ID"
                      value={content.marketing?.googleAdsId ?? ""}
                      onChange={(v) => updateContent(["marketing","googleAdsId"], v)}
                      placeholder="AW-XXXXXXXXX"
                    />
                    <Field
                      label="Google Ads — Form Conversion Label"
                      value={content.marketing?.googleAdsContactLabel ?? ""}
                      onChange={(v) => updateContent(["marketing","googleAdsContactLabel"], v)}
                      placeholder="abcDEFghIJklmnOPq (Google Ads conversion etiketi)"
                    />
                    <Field
                      label="Meta Pixel ID"
                      value={content.marketing?.metaPixelId ?? ""}
                      onChange={(v) => updateContent(["marketing","metaPixelId"], v)}
                      placeholder="123456789012345 (sayısal)"
                    />
                    <p className="text-[10px] text-white/25 leading-relaxed">
                      Form gönderildiğinde otomatik tetiklenen event&apos;ler: <code className="text-white/40">contact_form_submit</code>, <code className="text-white/40">dealer_apply_submit</code> (GA4), <code className="text-white/40">conversion → AW-X/Y</code> (Ads), <code className="text-white/40">Lead</code> (Meta).
                    </p>
                  </div>

                  {/* Mail sistemi diagnostiği */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-0.5">Mail Sistemi Durumu</p>
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        Contact ve B2B form başvuruları bu sağlayıcılar üzerinden gönderiliyor. Test butonu gerçek bir e-posta gönderir — alıcı kutusuna düşmesi gönderim akışının çalıştığını kanıtlar.
                      </p>
                    </div>

                    {mailStatus && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-xl px-3 py-2.5"
                          style={{
                            background: mailStatus.resend.configured ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${mailStatus.resend.configured ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`,
                          }}>
                          <div>
                            <p className="text-xs font-semibold text-white/70">Resend</p>
                            <p className="text-[11px] text-white/40">
                              {mailStatus.resend.configured ? `Yapılandırılmış · ${mailStatus.resend.from}` : "Yapılandırılmamış (RESEND_API_KEY veya CONTACT_TO_EMAIL eksik)"}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: mailStatus.resend.configured ? "#10B981" : "rgba(255,255,255,0.30)" }}>
                            {mailStatus.resend.configured ? "✓ Hazır" : "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl px-3 py-2.5"
                          style={{
                            background: mailStatus.smtp.configured ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${mailStatus.smtp.configured ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.08)"}`,
                          }}>
                          <div>
                            <p className="text-xs font-semibold text-white/70">SMTP (yedek)</p>
                            <p className="text-[11px] text-white/40">
                              {mailStatus.smtp.configured ? `${mailStatus.smtp.host}:${mailStatus.smtp.port} · ${mailStatus.smtp.user}` : "Yapılandırılmamış"}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: mailStatus.smtp.configured ? "#3B82F6" : "rgba(255,255,255,0.30)" }}>
                            {mailStatus.smtp.configured ? "✓ Hazır" : "—"}
                          </span>
                        </div>

                        <p className="text-[11px] text-white/35 mt-2">
                          Alıcı: <span className="text-white/55 font-mono">{mailStatus.to ?? "tanımsız"}</span>
                        </p>
                      </div>
                    )}

                    {!mailStatus?.resend.configured && !mailStatus?.smtp.configured && mailStatus && (
                      <div className="rounded-xl p-3 text-[11px] leading-relaxed"
                        style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)", color: "#FCD34D" }}>
                        ⚠️ Hiçbir sağlayıcı yapılandırılmamış — formdan gelen mesajlar Vercel Blob&apos;a yedekleniyor ama e-posta olarak ulaşmıyor. Vercel → Settings → Environment Variables&apos;dan <span className="font-mono">RESEND_API_KEY</span> + <span className="font-mono">CONTACT_TO_EMAIL</span> ekleyin.
                      </div>
                    )}

                    <button
                      onClick={sendTestMail}
                      disabled={mailTesting || !(mailStatus?.resend.configured || mailStatus?.smtp.configured)}
                      className="w-full text-xs font-semibold rounded-xl px-4 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.30)", color: "#93C5FD" }}>
                      {mailTesting ? "Gönderiliyor…" : "Test e-postası gönder"}
                    </button>

                    {mailResult && (
                      <div className="rounded-xl p-3 text-[11px] leading-relaxed"
                        style={{
                          background: mailResult.ok ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
                          border: `1px solid ${mailResult.ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                          color: mailResult.ok ? "#34D399" : "#FCA5A5",
                        }}>
                        {mailResult.ok ? (
                          <>✅ Test e-postası <span className="font-bold">{mailResult.provider}</span> üzerinden <span className="font-mono">{mailResult.to}</span> adresine gönderildi. Birkaç dakika içinde gelen kutusuna düşer (spam klasörüne de bak).</>
                        ) : (
                          <>❌ Gönderim başarısız: {mailResult.error}</>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ── SECTIONS ── */}
              {/* ── FEATURED ── */}
              {tab === "featured" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Öne Çıkan Ürünler</h2>
                    <p className="text-xs text-white/35">Ana sayfada öne çıkan ürün kartlarını düzenleyin.</p>
                  </div>
                  {/* Section header texts */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Bölüm Başlıkları</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bölüm Etiketi"  value={content.featuredSection?.sectionLabel ?? "Öne Çıkan Ürünler"}     onChange={(v) => updateContent(["featuredSection","sectionLabel"], v)} />
                      <Field label="CTA Butonu"     value={content.featuredSection?.ctaLabel     ?? "Ürünü İncele"}          onChange={(v) => updateContent(["featuredSection","ctaLabel"],     v)} />
                    </div>
                    <Field label="Başlık"     value={content.featuredSection?.heading    ?? "En Çok Tercih Edilenler"}       onChange={(v) => updateContent(["featuredSection","heading"],    v)} />
                    <Field label="Alt Başlık" value={content.featuredSection?.subheading ?? "Müşterilerimizin güvendiği, en çok sipariş verilen ürünlerimiz"} onChange={(v) => updateContent(["featuredSection","subheading"], v)} multiline />
                  </div>
                  <div className="space-y-4">
                      <p className="text-xs text-white/30">Hangi ürünlerin öne çıkan bölümünde görüneceğini ve sırasını belirleyin.</p>
                      {content.featured?.map((item: FeaturedItem, fi: number) => {
                        const catOptions = products;
                        const prodOptions = products.find((c: CategoryData) => c.id === item.categoryId)?.products ?? [];
                        return (
                          <div key={fi} className="bg-white/4 border border-white/8 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-white/50">Kart {fi + 1}</span>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <span className="text-xs text-white/40">Görünür</span>
                                  <div
                                    onClick={() => {
                                      const next = JSON.parse(JSON.stringify(content)) as ContentData;
                                      next.featured[fi].visible = !next.featured[fi].visible;
                                      setContent(next);
                                    }}
                                    className="w-9 h-5 rounded-full relative cursor-pointer transition-colors"
                                    style={{ background: item.visible ? "#3B82F6" : "rgba(255,255,255,0.12)" }}
                                  >
                                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all"
                                      style={{ left: item.visible ? "calc(100% - 18px)" : "2px" }} />
                                  </div>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!confirm(`"Kart ${fi + 1}" silinsin mi?`)) return;
                                    const next = JSON.parse(JSON.stringify(content)) as ContentData;
                                    next.featured.splice(fi, 1);
                                    setContent(next);
                                  }}
                                  className="text-[11px] font-semibold text-red-300/80 hover:text-red-200 px-2 py-1 rounded-md hover:bg-red-500/10 transition-colors"
                                  aria-label={`Kart ${fi + 1} sil`}
                                >
                                  Sil
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Kategori</label>
                                <select
                                  value={item.categoryId}
                                  onChange={(e) => {
                                    const next = JSON.parse(JSON.stringify(content)) as ContentData;
                                    next.featured[fi].categoryId = e.target.value;
                                    next.featured[fi].productId = products.find((c: CategoryData) => c.id === e.target.value)?.products[0]?.id ?? "";
                                    setContent(next);
                                  }}
                                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                                >
                                  {catOptions.map((c: CategoryData) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Ürün</label>
                                <select
                                  value={item.productId}
                                  onChange={(e) => {
                                    const next = JSON.parse(JSON.stringify(content)) as ContentData;
                                    next.featured[fi].productId = e.target.value;
                                    setContent(next);
                                  }}
                                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                                >
                                  {prodOptions.map((p: ProductEntry) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <Field label="Kart Rozeti (ör: En Çok Tercih Edilen)" value={item.badge} onChange={(v) => {
                              const next = JSON.parse(JSON.stringify(content)) as ContentData;
                              next.featured[fi].badge = v;
                              setContent(next);
                            }} />
                            <Field label="Kısa Açıklama (highlight)" value={item.highlight} onChange={(v) => {
                              const next = JSON.parse(JSON.stringify(content)) as ContentData;
                              next.featured[fi].highlight = v;
                              setContent(next);
                            }} multiline />
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          const next = JSON.parse(JSON.stringify(content)) as ContentData;
                          const firstCat = products[0];
                          const firstProd = firstCat?.products?.[0];
                          next.featured = [
                            ...(next.featured ?? []),
                            {
                              categoryId: firstCat?.id ?? "",
                              productId: firstProd?.id ?? "",
                              badge: "Yeni",
                              highlight: "",
                              visible: true,
                            },
                          ];
                          setContent(next);
                        }}
                        className="w-full border-2 border-dashed border-white/15 hover:border-blue-400/40 hover:bg-blue-500/5 rounded-xl py-4 text-sm font-semibold text-white/50 hover:text-blue-300 transition-all"
                      >
                        + Yeni Ürün Ekle
                      </button>
                  </div>
                </div>
              )}

              {/* ── REFERANS PROJELER ── */}
              {tab === "refprojects" && (() => {
                const rp = content.referenceProjectsSection ?? {
                  sectionLabel: "Referans Projeler",
                  heading: "Sahada Bemis E-V Charge",
                  subheading: "AVM, otopark, otel ve kurumsal kampüslerde devreye aldığımız uygulamalardan kareler.",
                  items: [],
                };
                const updateRPField = (field: "sectionLabel" | "heading" | "subheading", value: string) => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                    next.referenceProjectsSection = { ...rp, [field]: value };
                    return next;
                  });
                };
                const updateItem = (idx: number, field: string, value: string) => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                    const items = [...(next.referenceProjectsSection?.items ?? [])];
                    items[idx] = { ...items[idx], [field]: value };
                    next.referenceProjectsSection = { ...rp, items };
                    return next;
                  });
                };
                const addItem = () => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                    const items = [...(next.referenceProjectsSection?.items ?? [])];
                    items.push({ id: `proj-${Date.now()}`, image: "", title: "", location: "", description: "" });
                    next.referenceProjectsSection = { ...rp, items };
                    return next;
                  });
                };
                const removeItem = (idx: number) => {
                  if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                    const items = [...(next.referenceProjectsSection?.items ?? [])];
                    items.splice(idx, 1);
                    next.referenceProjectsSection = { ...rp, items };
                    return next;
                  });
                };
                const moveItem = (idx: number, dir: -1 | 1) => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                    const items = [...(next.referenceProjectsSection?.items ?? [])];
                    const newIdx = idx + dir;
                    if (newIdx < 0 || newIdx >= items.length) return prev;
                    [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
                    next.referenceProjectsSection = { ...rp, items };
                    return next;
                  });
                };
                return (
                  <div className="max-w-2xl space-y-5">
                    <div>
                      <h2 className="text-base font-bold mb-1">Referans Projeler</h2>
                      <p className="text-xs text-white/35">Anasayfada kayan bant olarak gösterilen uygulama görselleri (AVM, otopark, otel kurulumları, vb.).</p>
                    </div>
                    {/* Section heading texts */}
                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Bölüm Başlıkları</p>
                      <Field label="Bölüm Etiketi" value={rp.sectionLabel} onChange={(v) => updateRPField("sectionLabel", v)} />
                      <Field label="Başlık"        value={rp.heading}      onChange={(v) => updateRPField("heading", v)} />
                      <Field label="Alt Başlık"    value={rp.subheading}   onChange={(v) => updateRPField("subheading", v)} multiline />
                    </div>
                    {/* Items */}
                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Proje Kartları</p>
                          <p className="text-[10px] text-white/30">Sıra önemli — kayan bantta soldan sağa bu sırayla gözükür.</p>
                        </div>
                        <button
                          onClick={addItem}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                          style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.45)", color: "#93C5FD" }}
                        >
                          <HiOutlinePlus size={13} /> Proje Ekle
                        </button>
                      </div>
                      {rp.items.length === 0 ? (
                        <p className="text-xs text-white/35 px-1 py-3">Henüz proje yok. Yukarıdan ekleyin.</p>
                      ) : (
                        <div className="space-y-2">
                          {rp.items.map((item, idx) => (
                            <div key={item.id} className="rounded-xl border border-white/7 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.image} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                                ) : (
                                  <div className="w-16 h-12 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                                    <HiOutlinePhotograph size={18} className="text-white/30" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white/85 truncate">{item.title || `Proje ${idx + 1}`}</p>
                                  <p className="text-[11px] text-white/40 truncate">{item.location || "—"}</p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => moveItem(idx, -1)}
                                    disabled={idx === 0}
                                    className="text-white/40 hover:text-white text-xs px-1.5 py-1 rounded disabled:opacity-30"
                                    title="Yukarı"
                                  >▲</button>
                                  <button
                                    onClick={() => moveItem(idx, 1)}
                                    disabled={idx === rp.items.length - 1}
                                    className="text-white/40 hover:text-white text-xs px-1.5 py-1 rounded disabled:opacity-30"
                                    title="Aşağı"
                                  >▼</button>
                                  <button
                                    onClick={() => removeItem(idx)}
                                    className="text-red-300 hover:text-red-200 text-xs px-1.5 py-1 rounded"
                                    title="Sil"
                                  ><HiOutlineTrash size={13} /></button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Field label="Başlık" value={item.title ?? ""} onChange={(v) => updateItem(idx, "title", v)} placeholder="Şişli AVM AC İstasyon" />
                                <Field label="Lokasyon" value={item.location ?? ""} onChange={(v) => updateItem(idx, "location", v)} placeholder="İstanbul" />
                              </div>
                              <Field label="Açıklama" value={item.description ?? ""} onChange={(v) => updateItem(idx, "description", v)} multiline />
                              <div>
                                <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Görsel</label>
                                <div className="flex items-stretch gap-2">
                                  <label
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg cursor-pointer text-xs font-semibold transition-colors"
                                    style={{
                                      background: "rgba(59,130,246,0.12)",
                                      border: "1px dashed rgba(59,130,246,0.40)",
                                      color: "#93C5FD",
                                      padding: "10px 12px",
                                    }}
                                  >
                                    <RiImageAddLine size={14} />
                                    {item.image ? "Görseli Değiştir" : "Görsel Yükle"}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                          const { url } = await uploadImage(file, "referans-projeler");
                                          updateItem(idx, "image", url);
                                          showToast("ok", "Görsel yüklendi.");
                                        } catch (err) {
                                          showToast("err", `Yükleme başarısız: ${(err as Error).message}`);
                                        }
                                        e.target.value = "";
                                      }}
                                    />
                                  </label>
                                  {item.image && (
                                    <button
                                      onClick={() => updateItem(idx, "image", "")}
                                      className="text-xs font-semibold px-3 rounded-lg"
                                      style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)", color: "#FCA5A5" }}
                                      title="Görseli kaldır"
                                    >
                                      <HiOutlineTrash size={13} />
                                    </button>
                                  )}
                                </div>
                                {item.image && (
                                  <p className="text-[10px] text-white/30 mt-1 truncate font-mono" title={item.image}>{item.image}</p>
                                )}
                                {/* Odak noktası — kart önizleme. Public kartla AYNI oran (≈3:2)
                                    + object-cover + başlık gradyanı (WYSIWYG). Görseldeki bir
                                    noktaya tıkla → o nokta kartta merkezlenir, cihaz yarıda
                                    kalmaz. Crosshair seçili odağı gösterir; "Ortala" sıfırlar. */}
                                {item.image && (() => {
                                  const posStr = item.imagePos || "50% 50%";
                                  const [px, py] = posStr.split(" ").map((s) => parseFloat(s) || 50);
                                  const onFocusClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                    updateItem(idx, "imagePos", `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
                                  };
                                  return (
                                    <div className="mt-3">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Odak Noktası — Kart Önizleme</p>
                                        {posStr !== "50% 50%" && (
                                          <button
                                            type="button"
                                            onClick={() => updateItem(idx, "imagePos", "50% 50%")}
                                            className="text-[10px] text-white/40 hover:text-white/75 transition-colors"
                                          >
                                            Ortala ↺
                                          </button>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-white/30 mb-2">Cihaz yarıda kalıyorsa, görselde görünmesini istediğin noktaya tıkla — kart o noktaya odaklanır.</p>
                                      <div
                                        className="relative rounded-xl overflow-hidden border cursor-crosshair mx-auto select-none"
                                        style={{ aspectRatio: "380 / 260", maxWidth: 320, borderColor: "rgba(255,255,255,0.12)" }}
                                        onClick={onFocusClick}
                                        title="Odak noktası seçmek için tıkla"
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={item.image}
                                          alt={`Proje ${idx + 1} odak önizleme`}
                                          className="absolute inset-0 w-full h-full object-cover"
                                          style={{ objectPosition: posStr }}
                                          draggable={false}
                                        />
                                        {/* Public karttaki başlık gradyanı — gerçek sonuç görünür */}
                                        {(item.title || item.location) && (
                                          <div
                                            className="absolute inset-x-0 bottom-0 px-3 pt-8 pb-2 pointer-events-none"
                                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)" }}
                                          >
                                            {item.title && <p className="text-xs font-bold text-white leading-tight">{item.title}</p>}
                                            {item.location && <p className="text-[10px] text-white/80 leading-tight">{item.location}</p>}
                                          </div>
                                        )}
                                        {/* Odak crosshair */}
                                        <div className="absolute pointer-events-none" style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-50%, -50%)" }}>
                                          <div className="w-4 h-4 rounded-full border-2 border-white" style={{ boxShadow: "0 0 0 2px #3B82F6, 0 0 10px rgba(0,0,0,0.65)" }} />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ── DNA / KURUMSAL ── */}
              {tab === "dna" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Hakkımızda Bölümü</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki Hakkımızda bölümü içerikleri.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Bölüm Etiketi"   value={content.dna.sectionLabel}   onChange={(v) => updateContent(["dna","sectionLabel"],   v)} />
                              <Field label="Bölüm Başlığı"   value={content.dna.sectionHeading} onChange={(v) => updateContent(["dna","sectionHeading"], v)} />
                            </div>
                            <Field label="Marka Başlığı (\\n ile satır kır)" value={content.dna.brandHeading} onChange={(v) => updateContent(["dna","brandHeading"], v)} multiline />
                            <Field label="1. Paragraf" value={content.dna.brandPara1} onChange={(v) => updateContent(["dna","brandPara1"], v)} multiline />
                            <Field label="2. Paragraf" value={content.dna.brandPara2} onChange={(v) => updateContent(["dna","brandPara2"], v)} multiline />
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Alıntı Metni"    value={content.dna.quote}     onChange={(v) => updateContent(["dna","quote"],     v)} />
                              <Field label="Alıntı Kaynağı"  value={content.dna.quoteAttr} onChange={(v) => updateContent(["dna","quoteAttr"], v)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Yıl Etiketi"  value={content.dna.yearLabel} onChange={(v) => updateContent(["dna","yearLabel"], v)} />
                              <Field label="Yıl Alt Metni" value={content.dna.yearSub}   onChange={(v) => updateContent(["dna","yearSub"],   v)} />
                            </div>
                            <Field label="CTA Butonu Metni (ör: Bemis Dünyasını Keşfet)" value={content.dna.ctaLabel ?? ""} onChange={(v) => updateContent(["dna","ctaLabel"], v)} />

                            {/* Bemis Group brands — surfaced beside the
                                factory video. Title + body + 3 logo slots. */}
                            <div className="pt-3 border-t border-white/6 space-y-3">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Bemis Grup Markaları (videonun yanında gösterilir)</p>
                              <Field label="Başlık" value={content.dna.groupBrandsTitle ?? ""} onChange={(v) => updateContent(["dna","groupBrandsTitle"], v)} placeholder="Bemis Grup Markaları" />
                              <Field label="Açıklama" value={content.dna.groupBrandsBody ?? ""} onChange={(v) => updateContent(["dna","groupBrandsBody"], v)} multiline placeholder="Bemis Teknik Elektrik A.Ş. çatısı altında..." />
                              {(() => {
                                const brands = content.dna.groupBrands ?? [
                                  { name: "Bemis", logo: "" },
                                  { name: "Bemis E-V Charge", logo: "" },
                                  { name: "BYES", logo: "" },
                                ];
                                const updateBrand = (i: number, field: "name" | "logo", value: string) => {
                                  setContent((prev) => {
                                    if (!prev) return prev;
                                    const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                    const arr = [...(next.dna.groupBrands ?? brands)];
                                    arr[i] = { ...arr[i], [field]: value };
                                    next.dna.groupBrands = arr;
                                    return next;
                                  });
                                };
                                return (
                                  <div className="space-y-2">
                                    {brands.map((b, i) => (
                                      <div key={i} className="grid grid-cols-[1fr_auto] gap-2 items-center rounded-lg p-2.5"
                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <Field label={`Marka ${i + 1} Adı`} value={b.name} onChange={(v) => updateBrand(i, "name", v)} />
                                        <div className="flex items-center gap-2">
                                          {b.logo ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={b.logo} alt="" className="h-8 max-w-[100px] object-contain rounded" style={{ background: "rgba(255,255,255,0.85)", padding: "3px 6px" }} />
                                          ) : (
                                            <div className="h-8 w-12 rounded flex items-center justify-center text-[10px] text-white/30" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.10)" }}>—</div>
                                          )}
                                          <label
                                            className="text-[11px] font-semibold px-2.5 py-2 rounded-lg cursor-pointer flex items-center gap-1"
                                            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.40)", color: "#93C5FD" }}
                                          >
                                            <RiImageAddLine size={12} /> {b.logo ? "Değiştir" : "Logo"}
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                  const { url } = await uploadImage(file, "brand-logos");
                                                  updateBrand(i, "logo", url);
                                                  showToast("ok", "Logo yüklendi.");
                                                } catch (err) {
                                                  showToast("err", `Yükleme başarısız: ${(err as Error).message}`);
                                                }
                                                e.target.value = "";
                                              }}
                                            />
                                          </label>
                                          {b.logo && (
                                            <button
                                              onClick={() => updateBrand(i, "logo", "")}
                                              className="text-xs px-2 py-1.5 rounded"
                                              style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)", color: "#FCA5A5" }}
                                            ><HiOutlineTrash size={11} /></button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                            {/* Factory image upload */}
                            <div className="pt-2 border-t border-white/6 space-y-2">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Fabrika Fotoğrafı</p>
                              {content.dna.factoryImage && (
                                <div className="relative rounded-xl overflow-hidden" style={{ height: 100 }}>
                                  <img src={content.dna.factoryImage} alt="Fabrika" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 flex items-end p-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                                    <span className="text-[10px] text-white/70 font-mono truncate max-w-full">{content.dna.factoryImage}</span>
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <input
                                  value={content.dna.factoryImage ?? ""}
                                  onChange={(e) => updateContent(["dna", "factoryImage"], e.target.value)}
                                  placeholder="Görsel URL veya /uploads/... yolu"
                                  className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                                />
                                <button
                                  onClick={() => factoryImgRef.current?.click()}
                                  disabled={factoryImgLoading}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50"
                                >
                                  {factoryImgLoading ? (
                                    <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                  ) : (
                                    <RiImageAddLine size={14} />
                                  )}
                                  Yükle
                                </button>
                                <input ref={factoryImgRef} type="file" accept="image/*" className="hidden" onChange={handleFactoryImgUpload} />
                              </div>
                              {content.dna.factoryImage && (
                                <button
                                  onClick={() => updateContent(["dna", "factoryImage"], "")}
                                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                                >
                                  Görseli kaldır
                                </button>
                              )}
                              <p className="text-[10px] text-white/25 leading-relaxed">
                                Video yüklenirse fotoğrafa göre önceliklidir. Önerilen: 16:9 oran, WebP/JPG.
                              </p>
                            </div>

                            {/* Factory video upload */}
                            <div className="pt-2 border-t border-white/6 space-y-2">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Fabrika Tanıtım Videosu</p>
                              {content.dna.factoryVideo && (
                                <div className="relative rounded-xl overflow-hidden" style={{ height: 100 }}>
                                  <video src={content.dna.factoryVideo} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 flex items-end p-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                                    <span className="text-[10px] text-white/70 font-mono truncate max-w-full">{content.dna.factoryVideo}</span>
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <input
                                  value={content.dna.factoryVideo ?? ""}
                                  onChange={(e) => updateContent(["dna", "factoryVideo"], e.target.value)}
                                  placeholder="Video URL veya /kurumsal/... yolu"
                                  className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22"
                                />
                                <button
                                  onClick={() => factoryVideoRef.current?.click()}
                                  disabled={factoryVideoLoading}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50"
                                >
                                  {factoryVideoLoading ? (
                                    <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                  ) : (
                                    <RiImageAddLine size={14} />
                                  )}
                                  Yükle
                                </button>
                                <input ref={factoryVideoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleFactoryVideoUpload} />
                              </div>
                              {content.dna.factoryVideo && (
                                <button
                                  onClick={() => updateContent(["dna", "factoryVideo"], "")}
                                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                                >
                                  Videoyu kaldır
                                </button>
                              )}
                              <p className="text-[10px] text-white/25 leading-relaxed">
                                MP4, WebM, MOV desteklenir. Video yüklenince fotoğrafa göre önceliklidir; otomatik, sessiz, döngüsel oynar.
                              </p>
                            </div>

                            {/* Kurumsal section labels — yalnızca Tarihçe
                                (timeline) bölümü /kurumsal'da kaldı; Üretim
                                Süreci + Değerler bölümleri kaldırıldı. */}
                            <div className="pt-3 border-t border-white/6 space-y-3">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">/kurumsal Tarihçe Etiketleri</p>
                              <p className="text-[10px] text-white/25 leading-relaxed">Tarihçe bölümünün eyebrow/başlık metinleri. Boş bırakılırsa varsayılan kullanılır.</p>
                              <div className="grid grid-cols-2 gap-2.5">
                                <Field label="Tarihçe · Eyebrow" value={content.dna.kurumsalLabels?.timelineEyebrow ?? ""} onChange={(v) => updateContent(["dna","kurumsalLabels","timelineEyebrow"], v)} placeholder="Tarihçe" />
                                <Field label="Tarihçe · Başlık" value={content.dna.kurumsalLabels?.timelineHeading ?? ""} onChange={(v) => updateContent(["dna","kurumsalLabels","timelineHeading"], v)} placeholder="Bemis Yolculuğu" />
                              </div>
                            </div>

                            {/* ── Tarihçe (Timeline) ── */}
                            <div className="pt-4 border-t border-white/6 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Tarihçe</p>
                                <button
                                  onClick={() => {
                                    setContent((prev) => {
                                      if (!prev) return prev;
                                      const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                      const arr = [...(next.dna.timeline ?? [])];
                                      arr.push({ year: "", title: "", desc: "" });
                                      next.dna.timeline = arr;
                                      return next;
                                    });
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/80 transition-colors"
                                >
                                  + Ekle
                                </button>
                              </div>
                              {(content.dna.timeline ?? []).map((it, i) => (
                                <div key={i} className="rounded-xl border border-white/7 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-white/30">#{i + 1}</span>
                                    <button
                                      onClick={() => {
                                        setContent((prev) => {
                                          if (!prev) return prev;
                                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                          next.dna.timeline = (next.dna.timeline ?? []).filter((_, k) => k !== i);
                                          return next;
                                        });
                                      }}
                                      className="text-[10px] text-red-400/50 hover:text-red-400 transition-colors"
                                    >
                                      Sil
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-[80px_1fr] gap-2">
                                    <Field
                                      label="Yıl"
                                      value={it.year}
                                      onChange={(v) => {
                                        setContent((prev) => {
                                          if (!prev) return prev;
                                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                          const arr = [...(next.dna.timeline ?? [])];
                                          arr[i] = { ...arr[i], year: v };
                                          next.dna.timeline = arr;
                                          return next;
                                        });
                                      }}
                                    />
                                    <Field
                                      label="Başlık"
                                      value={it.title}
                                      onChange={(v) => {
                                        setContent((prev) => {
                                          if (!prev) return prev;
                                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                          const arr = [...(next.dna.timeline ?? [])];
                                          arr[i] = { ...arr[i], title: v };
                                          next.dna.timeline = arr;
                                          return next;
                                        });
                                      }}
                                    />
                                  </div>
                                  <Field
                                    label="Açıklama"
                                    value={it.desc}
                                    onChange={(v) => {
                                      setContent((prev) => {
                                        if (!prev) return prev;
                                        const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                        const arr = [...(next.dna.timeline ?? [])];
                                        arr[i] = { ...arr[i], desc: v };
                                        next.dna.timeline = arr;
                                        return next;
                                      });
                                    }}
                                    multiline
                                  />
                                </div>
                              ))}
                              {(content.dna.timeline ?? []).length === 0 && (
                                <p className="text-[10px] text-white/30 text-center py-2">
                                  Henüz tarihçe maddesi yok. Boş bırakırsanız varsayılan 5 madde gösterilir.
                                </p>
                              )}
                            </div>

                            {/* ── Hakkımızda Videosu (YouTube) ── */}
                            <div className="pt-4 border-t border-white/6 space-y-2">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Hakkımızda Videosu</p>
                              <p className="text-[10px] text-white/35">
                                YouTube linkini yapıştırın — tarihçe ve üretim sürecinin üstünde geniş bir video kartı olarak gösterilir.
                                Desteklenen formatlar: <span className="text-white/55">youtu.be/XXX</span>, <span className="text-white/55">youtube.com/watch?v=XXX</span>, <span className="text-white/55">youtube.com/embed/XXX</span> veya 11 karakterli ID.
                              </p>
                              <Field
                                label="YouTube URL"
                                value={content.dna.aboutVideo ?? ""}
                                onChange={(v) => updateContent(["dna", "aboutVideo"], v)}
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            </div>

                  </div>
                </div>
              )}

              {/* ── SMART CHARGER SECTION ── */}
              {tab === "smartcharger" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Akıllı Şarj Bölümü</h2>
                    <p className="text-xs text-white/35">Charger serisi mobil uygulama ve OCPP tanıtım bölümü metinleri.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bölüm Etiketi (eyebrow)" value={content.smartCharger?.sectionLabel ?? ""} onChange={(v) => updateContent(["smartCharger","sectionLabel"], v)} />
                      <Field label="OCPP Rozet Metni"        value={content.smartCharger?.ocppBadge ?? ""} onChange={(v) => updateContent(["smartCharger","ocppBadge"], v)} />
                    </div>
                    <Field label="Ana Başlık (\\n ile satır kır)" value={content.smartCharger?.heading ?? ""} onChange={(v) => updateContent(["smartCharger","heading"], v)} multiline />
                    <Field label="Açıklama Paragrafı" value={content.smartCharger?.subheading ?? ""} onChange={(v) => updateContent(["smartCharger","subheading"], v)} multiline />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="CTA Buton Metni" value={content.smartCharger?.ctaLabel ?? ""} onChange={(v) => updateContent(["smartCharger","ctaLabel"], v)} />
                      <Field label="CTA Buton Linki" value={content.smartCharger?.ctaHref ?? ""} onChange={(v) => updateContent(["smartCharger","ctaHref"], v)} validate={validateUrl} />
                    </div>
                    <div className="pt-3 border-t border-white/6 space-y-2">
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Mağaza Linkleri</p>
                      <Field label="App Store Linki" value={content.smartCharger?.appStoreHref ?? ""} onChange={(v) => updateContent(["smartCharger","appStoreHref"], v)} validate={validateUrl} />
                      <Field label="Google Play Linki" value={content.smartCharger?.playStoreHref ?? ""} onChange={(v) => updateContent(["smartCharger","playStoreHref"], v)} validate={validateUrl} />
                    </div>

                    {/* Mockup screenshots — phone + web */}
                    <div className="pt-3 border-t border-white/6 space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Mockup Ekran Görselleri</p>
                        <p className="text-[10px] text-white/35 mt-1">Telefon ve web çerçevelerinin içine yüklediğiniz ekran görüntüsü gösterilir. Boş bırakılırsa varsayılan demo arayüz görünür.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: "phone" as const, label: "Telefon Ekranı", url: content.smartCharger?.mockupPhoneImage, ratio: "9/19", helper: "Mobil uygulama görüntüsü" },
                          { key: "web"   as const, label: "Web Paneli",     url: content.smartCharger?.mockupWebImage,   ratio: "16/10", helper: "Tarayıcı görüntüsü" },
                        ].map(({ key, label, url, ratio, helper }) => (
                          <div key={key} className="space-y-2">
                            <label
                              className="relative rounded-xl overflow-hidden border-2 border-dashed cursor-pointer flex items-center justify-center block"
                              style={{
                                aspectRatio: ratio,
                                borderColor: url ? "rgba(255,255,255,0.10)" : "rgba(59,130,246,0.32)",
                                background: url ? "transparent" : "rgba(59,130,246,0.06)",
                                color: "#93C5FD",
                              }}
                            >
                              {url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={url} alt={label} className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <div className="text-center px-2">
                                  {mockupImgLoading === key ? (
                                    <div className="w-5 h-5 mx-auto rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                  ) : (
                                    <RiImageAddLine size={20} className="mx-auto" />
                                  )}
                                  <p className="text-[10px] mt-1 font-semibold">Görsel Yükle</p>
                                  <p className="text-[9px] text-white/40 mt-0.5">{helper}</p>
                                </div>
                              )}
                              {url && (
                                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
                                  <span className="text-[10px] text-white font-bold">Değiştir</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onClick={() => { mockupTargetRef.current = key; }}
                                onChange={(e) => { mockupTargetRef.current = key; handleMockupImgUpload(e); }}
                                disabled={mockupImgLoading !== null}
                              />
                            </label>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-white/50">{label}</span>
                              {url && (
                                <button
                                  onClick={() => updateContent(["smartCharger", key === "phone" ? "mockupPhoneImage" : "mockupWebImage"], "")}
                                  className="text-[10px] text-red-400/60 hover:text-red-300"
                                >
                                  Kaldır
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <input
                        ref={mockupImgRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMockupImgUpload}
                        disabled={mockupImgLoading !== null}
                      />
                    </div>

                    {/* Features */}
                    <div className="pt-3 border-t border-white/6 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Özellik Kartları</p>
                        <button onClick={addSmartChargerFeature}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/80 transition-colors">
                          + Ekle
                        </button>
                      </div>
                      {(content.smartCharger?.features ?? []).map((f, i) => (
                        <div key={i} className="rounded-xl border border-white/7 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-white/30">#{i + 1}</span>
                            <button onClick={() => removeSmartChargerFeature(i)} className="text-[10px] text-red-400/50 hover:text-red-400 transition-colors">Sil</button>
                          </div>
                          <Field label="Başlık" value={f.title} onChange={(v) => updateSmartChargerFeature(i, "title", v)} />
                          <Field label="Açıklama" value={f.desc} onChange={(v) => updateSmartChargerFeature(i, "desc", v)} multiline />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRODUCT SHOWCASE SECTION ── */}
              {tab === "productshowcase" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Ürün Vitrini</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki öne çıkan ürün tanıtım bölümü (AC Wallbox Smart Charger Pro 2).</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Rozet Metni (eyebrow)" value={content.productShowcase?.badge ?? ""} onChange={(v) => updateContent(["productShowcase","badge"], v)} />
                      <Field label="Tagline (mavi alt başlık)" value={content.productShowcase?.tagline ?? ""} onChange={(v) => updateContent(["productShowcase","tagline"], v)} />
                    </div>
                    <Field label="Ürün Adı" value={content.productShowcase?.name ?? ""} onChange={(v) => updateContent(["productShowcase","name"], v)} />
                    <Field label="Açıklama Paragrafı" value={content.productShowcase?.description ?? ""} onChange={(v) => updateContent(["productShowcase","description"], v)} multiline />

                    {/* Overlay feature badges — appear on top of the product image */}
                    <div className="pt-2 border-t border-white/6 space-y-2">
                      <div>
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Görsel Üzerindeki Rozetler</p>
                        <p className="text-[10px] text-white/35 mt-0.5">Sol-alttaki 4 küçük rozetin metni. Boş bırakırsanız varsayılan değer kullanılır.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map((i) => {
                          const fb = ["IP 65", "Planlı Şarj", "Ortak Kullanım", "Mobil Uygulama"][i];
                          return (
                            <Field
                              key={i}
                              label={`Rozet ${i + 1}`}
                              value={(content.productShowcase?.overlayFeatures ?? [])[i] ?? ""}
                              onChange={(v) => {
                                setContent((prev) => {
                                  if (!prev?.productShowcase) return prev;
                                  const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                  const arr = [...(next.productShowcase!.overlayFeatures ?? ["", "", "", ""])];
                                  while (arr.length < 4) arr.push("");
                                  arr[i] = v;
                                  next.productShowcase!.overlayFeatures = arr;
                                  return next;
                                });
                              }}
                              placeholder={fb}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Product gallery — multi-image with reorder/delete */}
                    {(() => {
                      const ps = content.productShowcase;
                      const images: string[] = (ps?.images && ps.images.length > 0)
                        ? ps.images
                        : (ps?.image ? [ps.image] : []);
                      const setImages = (next: string[]) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const cur = prev.productShowcase;
                          if (!cur) return prev;
                          return { ...prev, productShowcase: { ...cur, images: next } };
                        });
                      };
                      const moveImage = (i: number, dir: -1 | 1) => {
                        const j = i + dir;
                        if (j < 0 || j >= images.length) return;
                        const next = [...images];
                        [next[i], next[j]] = [next[j], next[i]];
                        setImages(next);
                      };
                      const removeImage = (i: number) => setImages(images.filter((_, k) => k !== i));
                      const addUrl = () => {
                        const v = showcaseUrlInput.trim();
                        if (!v) return;
                        setImages([...images, v]);
                        setShowcaseUrlInput("");
                      };

                      return (
                        <div className="pt-2 border-t border-white/6 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Ürün Galerisi</p>
                            <span className="text-[10px] text-white/30">{images.length} görsel · sürükleyerek/oklarla sırala</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {images.map((url, i) => (
                              <div
                                key={`${i}-${url}`}
                                className="relative group rounded-xl overflow-hidden border border-white/8"
                                style={{ aspectRatio: "3/4", background: "rgba(255,255,255,0.04)" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Görsel ${i + 1}`} className="w-full h-full object-cover" />
                                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: "rgba(0,0,0,0.7)" }}>
                                  #{i + 1}
                                </span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => moveImage(i, -1)}
                                      disabled={i === 0}
                                      className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs disabled:opacity-30"
                                      style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
                                      title="Sola taşı"
                                    >
                                      ←
                                    </button>
                                    <button
                                      onClick={() => moveImage(i, +1)}
                                      disabled={i === images.length - 1}
                                      className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs disabled:opacity-30"
                                      style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
                                      title="Sağa taşı"
                                    >
                                      →
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => removeImage(i)}
                                    className="text-[11px] font-bold text-red-300 hover:text-red-200 px-2.5 py-1 rounded-md"
                                    style={{ background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.38)" }}
                                  >
                                    Sil
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Upload tile */}
                            <label
                              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
                              style={{
                                aspectRatio: "3/4",
                                borderColor: "rgba(59,130,246,0.32)",
                                background: "rgba(59,130,246,0.06)",
                                color: "#93C5FD",
                              }}
                            >
                              {showcaseImgLoading ? (
                                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                              ) : (
                                <RiImageAddLine size={22} />
                              )}
                              <span className="text-[11px] font-semibold text-center px-2">
                                {showcaseImgLoading ? "Yükleniyor…" : (images.length === 0 ? "İlk Görseli Yükle" : "Görsel Ekle")}
                              </span>
                              <span className="text-[9px] text-white/30">Çoklu seçim</span>
                              <input
                                ref={showcaseImgRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleShowcaseImgUpload}
                                disabled={showcaseImgLoading}
                              />
                            </label>
                          </div>

                          {/* URL ile ekleme */}
                          <div className="flex gap-2">
                            <input
                              value={showcaseUrlInput}
                              onChange={(e) => setShowcaseUrlInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
                              placeholder="URL ile ekle (https://…)"
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
                            />
                            <button
                              onClick={addUrl}
                              disabled={!showcaseUrlInput.trim()}
                              className="px-4 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-40"
                              style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.36)", color: "#93C5FD" }}
                            >
                              Ekle
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CTA buttons */}
                    <div className="pt-2 border-t border-white/6 space-y-3">
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Butonlar</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Birincil Buton Metni" value={content.productShowcase?.ctaPrimary ?? ""} onChange={(v) => updateContent(["productShowcase","ctaPrimary"], v)} />
                        <Field label="Birincil Buton Linki" value={content.productShowcase?.ctaHref ?? ""} onChange={(v) => updateContent(["productShowcase","ctaHref"], v)} validate={validateUrl} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="İkincil Buton Metni" value={content.productShowcase?.ctaSecondary ?? ""} onChange={(v) => updateContent(["productShowcase","ctaSecondary"], v)} />
                        <Field label="İkincil Buton Linki" value={content.productShowcase?.ctaSecondaryHref ?? ""} onChange={(v) => updateContent(["productShowcase","ctaSecondaryHref"], v)} validate={validateUrl} />
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="pt-2 border-t border-white/6 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Teknik Özellik Kartları</p>
                        <button onClick={addShowcaseSpec}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/80 transition-colors">
                          + Ekle
                        </button>
                      </div>
                      {(content.productShowcase?.specs ?? []).map((s, i) => (
                        <div key={i} className="rounded-xl border border-white/7 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-white/30">#{i + 1}</span>
                            <button onClick={() => removeShowcaseSpec(i)} className="text-[10px] text-red-400/50 hover:text-red-400 transition-colors">Sil</button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="Etiket" value={s.label} onChange={(v) => updateShowcaseSpec(i, "label", v)} />
                            <Field label="Değer" value={s.value} onChange={(v) => updateShowcaseSpec(i, "value", v)} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Showcase products[] — per-image text + image ── */}
                    <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                      <div>
                        <p className="text-sm font-bold text-white">Çoklu Ürün Vitrini</p>
                        <p className="text-[11px] text-white/40 mt-1">
                          Her görsel ayrı bir ürün — kaydırınca metin de değişir. Boş bırakırsanız yukarıdaki tek ürün gösterilir.
                        </p>
                      </div>

                      {(() => {
                        const items = content.productShowcase?.products ?? [];
                        const update = (idx: number, field: keyof ShowcaseProductItem, val: string) => {
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            const list = [...(next.productShowcase!.products ?? [])];
                            list[idx] = { ...list[idx], [field]: val } as ShowcaseProductItem;
                            next.productShowcase!.products = list;
                            return next;
                          });
                        };
                        const updateSpec = (itemIdx: number, specIdx: number, field: "label" | "value", val: string) => {
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            const list = [...(next.productShowcase!.products ?? [])];
                            const specs = [...(list[itemIdx].specs ?? [])];
                            specs[specIdx] = { ...specs[specIdx], [field]: val };
                            list[itemIdx] = { ...list[itemIdx], specs };
                            next.productShowcase!.products = list;
                            return next;
                          });
                        };
                        const addSpec = (itemIdx: number) => {
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            const list = [...(next.productShowcase!.products ?? [])];
                            const specs = [...(list[itemIdx].specs ?? []), { label: "Özellik", value: "" }];
                            list[itemIdx] = { ...list[itemIdx], specs };
                            next.productShowcase!.products = list;
                            return next;
                          });
                        };
                        const removeSpec = (itemIdx: number, specIdx: number) => {
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            const list = [...(next.productShowcase!.products ?? [])];
                            const specs = (list[itemIdx].specs ?? []).filter((_, k) => k !== specIdx);
                            list[itemIdx] = { ...list[itemIdx], specs };
                            next.productShowcase!.products = list;
                            return next;
                          });
                        };
                        const move = (idx: number, dir: -1 | 1) => {
                          const j = idx + dir;
                          if (j < 0 || j >= items.length) return;
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            const list = [...(next.productShowcase!.products ?? [])];
                            [list[idx], list[j]] = [list[j], list[idx]];
                            next.productShowcase!.products = list;
                            return next;
                          });
                        };
                        const remove = (idx: number) => {
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            next.productShowcase!.products = (next.productShowcase!.products ?? []).filter((_, k) => k !== idx);
                            return next;
                          });
                        };
                        const add = () => {
                          setContent((prev) => {
                            if (!prev?.productShowcase) return prev;
                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                            next.productShowcase!.products = [...(next.productShowcase!.products ?? []), {
                              badge: "", name: "Yeni Ürün", tagline: "", description: "", image: "",
                              specs: [], ctaPrimary: "Ürünü İncele", ctaHref: "/products",
                            }];
                            return next;
                          });
                        };
                        return (
                          <>
                            {items.map((it, i) => (
                              <div key={i} className="rounded-2xl border border-white/10 p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-white/40">Ürün #{i + 1}</span>
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => move(i, -1)} disabled={i === 0}
                                      className="w-7 h-7 rounded-lg text-xs text-white/60 border border-white/10 hover:border-white/25 disabled:opacity-30">↑</button>
                                    <button onClick={() => move(i, +1)} disabled={i === items.length - 1}
                                      className="w-7 h-7 rounded-lg text-xs text-white/60 border border-white/10 hover:border-white/25 disabled:opacity-30">↓</button>
                                    <button onClick={() => remove(i)}
                                      className="px-2 h-7 rounded-lg text-[10px] font-bold text-red-300 border border-red-400/30 hover:border-red-400/60">Sil</button>
                                  </div>
                                </div>

                                {/* Web + Mobil canlı önizleme. Image yüklü iken
                                    her iki mockup'a tıklayarak odak noktası
                                    (imagePos) seçilir, crosshair pozisyonu
                                    günceller, public sayfada objectPosition'a
                                    yansır. Image yok ise tıklama upload eder. */}
                                <div>
                                  <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Görsel Önizleme — Web + Mobil</p>
                                  <p className="text-[10px] text-white/30 mb-2">{it.image ? "Görseldeki bir noktaya tıkla → odak (focal point) o noktaya kayar." : "Görsel yüklemek için aşağıdaki kutuya tıkla."}</p>
                                  <div className="grid grid-cols-[3fr_2fr_5fr] gap-3 items-start">
                                    {/* WEB MOCKUP — 3/4 aspect (public site card oranı) */}
                                    {(() => {
                                      const posStr = it.imagePos || "50% 50%";
                                      const [px, py] = posStr.split(" ").map(s => parseFloat(s) || 50);
                                      const zoom = Math.max(1, Math.min(2, (it as ShowcaseProductItem).imageZoom ?? 1));
                                      const onTileClick = (e: React.MouseEvent<HTMLLabelElement>) => {
                                        if (!it.image) return; // label default → file input açılır
                                        e.preventDefault();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                        update(i, "imagePos", `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
                                      };
                                      return (
                                        <label
                                          className="relative rounded-xl overflow-hidden border-2 border-dashed cursor-crosshair flex items-center justify-center group"
                                          style={{
                                            aspectRatio: "3/4",
                                            borderColor: it.image ? "rgba(255,255,255,0.10)" : "rgba(59,130,246,0.32)",
                                            background: it.image ? "transparent" : "rgba(59,130,246,0.06)",
                                            color: "#93C5FD",
                                          }}
                                          onClick={onTileClick}
                                        >
                                          {it.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                              src={it.image}
                                              alt={`Ürün ${i + 1} — web önizleme`}
                                              className="absolute inset-0 w-full h-full object-cover"
                                              style={{
                                                objectPosition: posStr,
                                                transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                                                transformOrigin: posStr,
                                              }}
                                              draggable={false}
                                            />
                                          ) : (
                                            <div className="text-center px-2">
                                              {psItemImgLoadingIdx === i ? (
                                                <div className="w-5 h-5 mx-auto rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                              ) : (
                                                <RiImageAddLine size={22} className="mx-auto" />
                                              )}
                                              <p className="text-[10px] mt-1 font-semibold">Görsel Yükle</p>
                                            </div>
                                          )}
                                          {/* Focus crosshair */}
                                          {it.image && (
                                            <div className="absolute pointer-events-none" style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-50%, -50%)" }}>
                                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white" style={{ boxShadow: "0 0 0 2px #3B82F6, 0 0 10px rgba(0,0,0,0.6)" }} />
                                            </div>
                                          )}
                                          {/* Web etiketi sol üst */}
                                          {it.image && (
                                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                                              style={{ background: "rgba(8,12,24,0.85)", color: "#93C5FD" }}>
                                              WEB
                                            </div>
                                          )}
                                          {/* Mockup — name kutusu sağ üst */}
                                          {it.image && (it.name || it.badge) && (
                                            <div className="absolute top-1.5 right-1.5 max-w-[60%]">
                                              <div className="inline-flex flex-col items-end text-right px-1.5 py-0.5 rounded"
                                                style={{ background: "rgba(6,10,22,0.92)", border: "1px solid rgba(255,255,255,0.14)" }}>
                                                {it.badge && <span className="text-[5px] font-bold uppercase tracking-widest" style={{ color: "#93C5FD" }}>{it.badge}</span>}
                                                <span className="text-[7px] font-black text-white leading-tight">{it.name}</span>
                                              </div>
                                            </div>
                                          )}
                                          {/* Mockup — 4 feature badge sol alt */}
                                          {it.image && (it.overlayFeatures ?? []).filter(Boolean).length > 0 && (
                                            <div className="absolute bottom-1.5 left-1.5 grid grid-cols-2 gap-0.5 max-w-[70%]">
                                              {(it.overlayFeatures ?? []).slice(0, 4).map((f, fi) => f?.trim() && (
                                                <div key={fi} className="px-1 py-0.5 rounded text-[6px] font-bold text-white leading-tight"
                                                  style={{ background: "rgba(8,12,24,0.92)", border: "1px solid rgba(59,130,246,0.4)" }}>
                                                  {f}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onClick={() => { psItemTargetIdxRef.current = i; }}
                                            onChange={(e) => { psItemTargetIdxRef.current = i; handlePsItemImgUpload(e); }}
                                            disabled={psItemImgLoadingIdx !== null}
                                          />
                                        </label>
                                      );
                                    })()}

                                    {/* MOBİL MOCKUP — 9/16 aspect (telefon ekranı oranı), upload yok, sadece görsel önizleme + click-to-focus */}
                                    {(() => {
                                      const posStr = it.imagePos || "50% 50%";
                                      const [px, py] = posStr.split(" ").map(s => parseFloat(s) || 50);
                                      const zoomM = Math.max(1, Math.min(2, (it as ShowcaseProductItem).imageZoom ?? 1));
                                      const onMobileClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                        if (!it.image) return;
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                        update(i, "imagePos", `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
                                      };
                                      return (
                                        <div
                                          className="relative rounded-xl overflow-hidden border"
                                          style={{
                                            aspectRatio: "9/16",
                                            borderColor: "rgba(255,255,255,0.10)",
                                            background: "rgba(255,255,255,0.03)",
                                            cursor: it.image ? "crosshair" : "default",
                                          }}
                                          onClick={onMobileClick}
                                        >
                                          {it.image ? (
                                            <>
                                              {/* eslint-disable-next-line @next/next/no-img-element */}
                                              <img
                                                src={it.image}
                                                alt={`Ürün ${i + 1} — mobil önizleme`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                style={{
                                                  objectPosition: posStr,
                                                  transform: zoomM !== 1 ? `scale(${zoomM})` : undefined,
                                                  transformOrigin: posStr,
                                                }}
                                                draggable={false}
                                              />
                                              {/* Focus crosshair */}
                                              <div className="absolute pointer-events-none" style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-50%, -50%)" }}>
                                                <div className="w-3 h-3 rounded-full border-2 border-white" style={{ boxShadow: "0 0 0 2px #3B82F6, 0 0 10px rgba(0,0,0,0.6)" }} />
                                              </div>
                                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider"
                                                style={{ background: "rgba(8,12,24,0.85)", color: "#FBBF24" }}>
                                                MOBİL
                                              </div>
                                              {/* Mockup — name kutusu sağ üst (küçük) */}
                                              {(it.name || it.badge) && (
                                                <div className="absolute top-1.5 right-1.5 max-w-[55%]">
                                                  <div className="inline-flex flex-col items-end text-right px-1 py-0.5 rounded"
                                                    style={{ background: "rgba(6,10,22,0.92)", border: "1px solid rgba(255,255,255,0.14)" }}>
                                                    {it.badge && <span className="text-[4px] font-bold uppercase tracking-wider" style={{ color: "#93C5FD" }}>{it.badge}</span>}
                                                    <span className="text-[6px] font-black text-white leading-tight">{it.name}</span>
                                                  </div>
                                                </div>
                                              )}
                                              {/* Mockup — feature badges sol alt */}
                                              {(it.overlayFeatures ?? []).filter(Boolean).length > 0 && (
                                                <div className="absolute bottom-1 left-1 grid grid-cols-2 gap-0.5 max-w-[80%]">
                                                  {(it.overlayFeatures ?? []).slice(0, 4).map((f, fi) => f?.trim() && (
                                                    <div key={fi} className="px-0.5 py-0.5 rounded text-[5px] font-bold text-white leading-tight"
                                                      style={{ background: "rgba(8,12,24,0.92)", border: "1px solid rgba(59,130,246,0.4)" }}>
                                                      {f}
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-center px-2">
                                              <p className="text-[9px] text-white/30">Önce görsel yükle</p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}

                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <Field label="Rozet" value={it.badge ?? ""} onChange={(v) => update(i, "badge", v)} />
                                        <Field label="Tagline" value={it.tagline ?? ""} onChange={(v) => update(i, "tagline", v)} />
                                      </div>
                                      <Field label="Ürün Adı" value={it.name} onChange={(v) => update(i, "name", v)} />
                                      <Field label="Açıklama" value={it.description ?? ""} onChange={(v) => update(i, "description", v)} multiline />
                                      {/* Odak noktası + Zoom kontrolleri */}
                                      {it.image && (
                                        <div className="space-y-1.5 pt-1">
                                          <div className="flex items-center justify-between text-[10px] text-white/40 px-1">
                                            <span>Odak: <span className="font-mono text-white/70">{it.imagePos || "50% 50%"}</span></span>
                                            <button
                                              type="button"
                                              onClick={() => update(i, "imagePos", "50% 50%")}
                                              className="text-blue-300 hover:text-blue-200 font-semibold"
                                            >
                                              Ortaya al
                                            </button>
                                          </div>
                                          {/* Zoom satırı: − slider + */}
                                          {(() => {
                                            const curZoom = Math.max(1, Math.min(2, (it as ShowcaseProductItem).imageZoom ?? 1));
                                            const setZoom = (z: number) => {
                                              const clamped = Math.max(1, Math.min(2, +z.toFixed(2)));
                                              setContent((prev) => {
                                                if (!prev?.productShowcase) return prev;
                                                const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                                const list = [...(next.productShowcase!.products ?? [])];
                                                list[i] = { ...list[i], imageZoom: clamped };
                                                next.productShowcase!.products = list;
                                                return next;
                                              });
                                            };
                                            return (
                                              <div className="flex items-center gap-2 px-1">
                                                <span className="text-[10px] text-white/40 flex-shrink-0">Zoom</span>
                                                <button
                                                  type="button"
                                                  onClick={() => setZoom(curZoom - 0.1)}
                                                  disabled={curZoom <= 1.01}
                                                  className="w-6 h-6 rounded-md border border-white/15 text-white/70 hover:border-white/40 hover:text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                                  title="Uzaklaş"
                                                >
                                                  −
                                                </button>
                                                <input
                                                  type="range"
                                                  min={1}
                                                  max={2}
                                                  step={0.05}
                                                  value={curZoom}
                                                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                                                  className="flex-1 accent-blue-500"
                                                  style={{ height: 4 }}
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => setZoom(curZoom + 0.1)}
                                                  disabled={curZoom >= 1.99}
                                                  className="w-6 h-6 rounded-md border border-white/15 text-white/70 hover:border-white/40 hover:text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                                  title="Yakınlaş"
                                                >
                                                  +
                                                </button>
                                                <span className="text-[10px] text-white/70 font-mono w-10 text-right">{curZoom.toFixed(2)}×</span>
                                                {curZoom !== 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => setZoom(1)}
                                                    className="text-[10px] text-blue-300 hover:text-blue-200 font-semibold"
                                                    title="Zoom'u sıfırla"
                                                  >
                                                    1×
                                                  </button>
                                                )}
                                              </div>
                                            );
                                          })()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Görsel Üstü 4 Özellik Kutucuğu — slide-spesifik */}
                                <div className="pt-2 border-t border-white/8 space-y-2">
                                  <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Görsel Üstü Özellik Kutucukları (4 slot)</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">Görselin sol alt köşesinde 2×2 grid olarak gözükür. Boş bırakırsanız ana ürünün overlayFeatures&apos;ı kullanılır.</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[0, 1, 2, 3].map((slot) => (
                                      <Field
                                        key={slot}
                                        label={`${slot + 1}. Kutu`}
                                        value={(it.overlayFeatures ?? [])[slot] ?? ""}
                                        onChange={(v) => {
                                          setContent((prev) => {
                                            if (!prev?.productShowcase) return prev;
                                            const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                            const list = [...(next.productShowcase!.products ?? [])];
                                            const ov = [...((list[i] as ShowcaseProductItem).overlayFeatures ?? [])];
                                            // Slot'u uzat, eksik index'leri boş bırak
                                            while (ov.length <= slot) ov.push("");
                                            ov[slot] = v;
                                            list[i] = { ...list[i], overlayFeatures: ov };
                                            next.productShowcase!.products = list;
                                            return next;
                                          });
                                        }}
                                        placeholder={slot === 0 ? "ör. IP 65" : slot === 1 ? "ör. Planlı Şarj" : slot === 2 ? "ör. Ortak Kullanım" : "ör. Mobil Uygulama"}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* CTA */}
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Buton Metni" value={it.ctaPrimary ?? ""} onChange={(v) => update(i, "ctaPrimary", v)} />
                                  <Field label="Buton Linki" value={it.ctaHref ?? ""} onChange={(v) => update(i, "ctaHref", v)} validate={validateUrl} />
                                </div>

                                {/* Specs */}
                                <div className="pt-2 border-t border-white/8 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Teknik Özellikler</span>
                                    <button onClick={() => addSpec(i)} className="text-[10px] text-white/50 hover:text-white px-2 py-0.5 rounded border border-white/15">+ Ekle</button>
                                  </div>
                                  {(it.specs ?? []).map((s, si) => (
                                    <div key={si} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                                      <Field label={`Etiket ${si + 1}`} value={s.label} onChange={(v) => updateSpec(i, si, "label", v)} />
                                      <Field label="Değer" value={s.value} onChange={(v) => updateSpec(i, si, "value", v)} />
                                      <button onClick={() => removeSpec(i, si)} className="h-9 px-2 text-[10px] text-red-400/70 hover:text-red-300">Sil</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <button onClick={add}
                              className="w-full px-4 py-3 rounded-xl text-sm font-bold border-2 border-dashed transition-colors"
                              style={{ borderColor: "rgba(59,130,246,0.32)", background: "rgba(59,130,246,0.05)", color: "#93C5FD" }}>
                              + Yeni Ürün Ekle
                            </button>

                            <input
                              ref={psItemImgRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePsItemImgUpload}
                              disabled={psItemImgLoadingIdx !== null}
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ── REVIEWS ── */}
              {tab === "reviews" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Kullanıcı Yorumları & Blog</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki birleşik bölüm: yorum kartları + sosyal medya + son blog yazıları (blog yazıları otomatik eklenir). Aşağıdaki başlık/etiket bu birleşik bölümü temsil eder.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bölüm Etiketi" value={content.reviews.sectionLabel ?? ""} onChange={(v) => updateContent(["reviews","sectionLabel"], v)} />
                      <Field label="Başlık"        value={content.reviews.heading}             onChange={(v) => updateContent(["reviews","heading"],      v)} />
                    </div>
                    <Field label="Alt Başlık" value={content.reviews.subheading} onChange={(v) => updateContent(["reviews","subheading"], v)} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Ortalama Puan" value={content.reviews.rating}      onChange={(v) => updateContent(["reviews","rating"],      v)} />
                      <Field label="Değerlendirme Sayısı" value={content.reviews.ratingCount} onChange={(v) => updateContent(["reviews","ratingCount"], v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Puan Etiketi (örn: ortalama puan)"       value={content.reviews.ratingLabel ?? ""}        onChange={(v) => updateContent(["reviews","ratingLabel"],       v)} />
                      <Field label="Değerlendirme Sayı Soneki (örn: değerlendirme)" value={content.reviews.ratingCountSuffix ?? ""} onChange={(v) => updateContent(["reviews","ratingCountSuffix"], v)} />
                    </div>
                    <Field label="Platform Ön Eki (örn: Trendyol ve HepsiBurada'da)" value={content.reviews.platformsPrefix ?? ""} onChange={(v) => updateContent(["reviews","platformsPrefix"], v)} />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Yorumlar ({content.reviews.items.length})</p>
                      <button onClick={addReviewItem} className="flex items-center gap-1 text-xs text-white/35 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                        <HiOutlinePlus size={11} /> Yorum Ekle
                      </button>
                    </div>
                    {content.reviews.items.map((r, i) => (
                      <div key={i} className="bg-white/2 border border-white/6 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">Yorum {i+1}</p>
                          <button onClick={() => removeReviewItem(i)} className="text-white/20 hover:text-red-400 transition-colors">
                            <HiOutlineTrash size={12} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="Platform"  value={r.platform}  onChange={(v) => updateReviewItem(i, "platform", v)} />
                          <Field label="Platform Rengi (#hex)" value={r.platformColor} onChange={(v) => updateReviewItem(i, "platformColor", v)} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Field label="Yazar"   value={r.author}  onChange={(v) => updateReviewItem(i, "author",  v)} />
                          <Field label="Tarih"   value={r.date}    onChange={(v) => updateReviewItem(i, "date",    v)} />
                          <Field label="Ürün"    value={r.product} onChange={(v) => updateReviewItem(i, "product", v)} />
                        </div>
                        <Field label="Yorum Metni" value={r.text} onChange={(v) => updateReviewItem(i, "text", v)} multiline />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CONTACT SECTION ── */}
              {/* ── CALCULATOR ── */}
              {tab === "calculator" && (
                <div className="max-w-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Hesaplayıcı Bölümü</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki şarj süresi ve tasarruf hesaplayıcısının metinleri.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Başlıklar</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bölüm Etiketi (rozet)"  value={content.calculator?.sectionLabel   ?? "Hesaplayıcı"}       onChange={(v) => updateContent(["calculator","sectionLabel"],   v)} />
                      <Field label="Animasyon Alt Yazısı"   value={content.calculator?.chargeSimLabel ?? "Şarj Simülasyonu"}  onChange={(v) => updateContent(["calculator","chargeSimLabel"], v)} />
                    </div>
                    <Field label="Ana Başlık" value={content.calculator?.heading    ?? "Şarj Süresi Hesaplayıcı"}                                                                       onChange={(v) => updateContent(["calculator","heading"],    v)} />
                    <Field label="Alt Başlık" value={content.calculator?.subheading ?? "Araç seçin veya manuel değer girin — şarj sürenizi ve yakıt tasarrufunuzu hesaplayın"} onChange={(v) => updateContent(["calculator","subheading"], v)} multiline />
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider pt-2">Sekme Etiketleri</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Şarj Süresi Sekmesi"      value={content.calculator?.tabCharge  ?? "Şarj Süresi"}       onChange={(v) => updateContent(["calculator","tabCharge"],  v)} />
                      <Field label="Tasarruf Analizi Sekmesi" value={content.calculator?.tabSavings ?? "Tasarruf Analizi"}  onChange={(v) => updateContent(["calculator","tabSavings"], v)} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── DEALERS ── */}
              {tab === "dealers" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Bayi Haritası</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki bayi ağı bölümünün metinleri ve şehirlere göre yetkili bayi bilgileri.</p>
                  </div>

                  {/* Bayi Ağı — homepage section text */}
                  <div className="max-w-3xl bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Ana Sayfa Metinleri</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bölüm Etiketi"  value={content.dealer.sectionLabel} onChange={(v) => updateContent(["dealer","sectionLabel"], v)} />
                      <Field label="Başlık"         value={content.dealer.heading}      onChange={(v) => updateContent(["dealer","heading"],      v)} />
                    </div>
                    <Field label="Açıklama" value={content.dealer.description} onChange={(v) => updateContent(["dealer","description"], v)} multiline />
                    <Field label="Başvuru Metni (alt kısım)" value={content.dealer.applyText ?? ""} onChange={(v) => updateContent(["dealer","applyText"], v)} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="İl Sayısı (örn: 81)"   value={content.dealer.statCities}  onChange={(v) => updateContent(["dealer","statCities"],  v)} />
                      <Field label="Bayi Sayısı (örn: 500+)" value={content.dealer.statDealers} onChange={(v) => updateContent(["dealer","statDealers"], v)} />
                    </div>
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider pt-1">Etiketler</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="İl Sayısı Etiketi (örn: İlde Bayi)"    value={content.dealer.citiesLabel ?? ""}       onChange={(v) => updateContent(["dealer","citiesLabel"],       v)} />
                      <Field label="Bayi Sayısı Etiketi (örn: Aktif Bayi)" value={content.dealer.activeDealersLabel ?? ""} onChange={(v) => updateContent(["dealer","activeDealersLabel"], v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bayi Bul Başlığı"       value={content.dealer.findDealerTitle ?? ""} onChange={(v) => updateContent(["dealer","findDealerTitle"], v)} />
                      <Field label="İletişim Butonu Metni"  value={content.dealer.contactBtnLabel ?? ""} onChange={(v) => updateContent(["dealer","contactBtnLabel"], v)} />
                    </div>
                    <Field label="Harita İpucu (kullanıcıya gösterilen yardım metni)" value={content.dealer.mapHint ?? ""} onChange={(v) => updateContent(["dealer","mapHint"], v)} />
                    <Field label="Harita Başlığı" value={content.dealer.mapTitle ?? ""} onChange={(v) => updateContent(["dealer","mapTitle"], v)} />
                  </div>

                  {/* ── Bemis Bölge Temsilcileri ──
                      Per-region rep cards. The map popup shows whichever
                      rows have at least name/phone/email filled in; empty
                      rows stay hidden on the public site. */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Bemis Bölge Temsilcileri</p>
                      <p className="text-xs text-white/35">
                        Haritada bir bölgeye gelindiğinde, o bölgenin Bemis temsilcisi bayi listesinin üstünde özel bir kartta gösterilir.
                        Boş bırakılan satırlar haritada gözükmez.
                      </p>
                    </div>

                    {(() => {
                      const REGION_LABELS: { id: string; label: string }[] = [
                        { id: "merkez",     label: "Bursa Merkez (Genel Merkez)" },
                        { id: "marmara",    label: "Marmara" },
                        { id: "ege",        label: "Ege" },
                        { id: "akdeniz",    label: "Akdeniz" },
                        { id: "ic_anadolu", label: "İç Anadolu" },
                        { id: "karadeniz",  label: "Karadeniz" },
                        { id: "dogu",       label: "Doğu Anadolu" },
                        { id: "guneydogu",  label: "Güneydoğu Anadolu" },
                      ];

                      // Her temsilci array içindeki global index'iyle update/delete edilir.
                      // Aynı bölgeye birden fazla temsilci eklenebilir; her temsilci
                      // bağımsız bir kayıt. Önceki "findIndex(regionId)" mantığı ilk
                      // eşleşeni güncellediği için 2.-3. temsilci kaydedilemiyordu.
                      const updateRepAt = (globalIdx: number, field: "name" | "title" | "phone" | "email" | "whatsapp" | "subregion", value: string) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          const arr = [...(next.dealer.regionReps ?? [])];
                          if (arr[globalIdx]) {
                            arr[globalIdx] = { ...arr[globalIdx], [field]: value };
                            next.dealer.regionReps = arr;
                          }
                          return next;
                        });
                      };

                      const removeRepAt = (globalIdx: number) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          const arr = [...(next.dealer.regionReps ?? [])];
                          arr.splice(globalIdx, 1);
                          next.dealer.regionReps = arr;
                          return next;
                        });
                      };

                      const addRep = (regionId: string, regionLabel: string) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          const arr = [...(next.dealer.regionReps ?? [])];
                          arr.push({
                            regionId,
                            name: "",
                            title: `${regionLabel} Bölge Temsilcisi`,
                            phone: "",
                            email: "",
                            whatsapp: "",
                            subregion: "",
                          });
                          next.dealer.regionReps = arr;
                          return next;
                        });
                      };

                      return REGION_LABELS.map((region) => {
                        const allReps = content.dealer.regionReps ?? [];
                        const regionReps = allReps
                          .map((r, i) => ({ rep: r, globalIdx: i }))
                          .filter((x) => x.rep.regionId === region.id);

                        return (
                          <div key={region.id} className="rounded-xl border border-white/7 p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-white/55 uppercase tracking-wider">{region.label}</span>
                              {regionReps.length > 0 && (
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.18)", color: "#93C5FD" }}>
                                  {regionReps.length} temsilci
                                </span>
                              )}
                            </div>

                            {regionReps.length === 0 && (
                              <p className="text-[11px] text-white/30 italic py-1">Bu bölgede henüz temsilci yok.</p>
                            )}

                            {regionReps.map(({ rep, globalIdx }, localIdx) => (
                              <div key={globalIdx} className="rounded-lg border border-white/5 p-2.5 space-y-2" style={{ background: "rgba(255,255,255,0.025)" }}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Temsilci {localIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm("Bu temsilciyi silmek istediğine emin misin?")) removeRepAt(globalIdx);
                                    }}
                                    className="text-[10px] font-semibold text-red-300/80 hover:text-red-200 px-2 py-0.5 rounded hover:bg-red-500/10 transition-colors"
                                  >
                                    Sil
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Ad Soyad" value={rep.name ?? ""} onChange={(v) => updateRepAt(globalIdx, "name", v)} />
                                  <Field label="Ünvan" value={rep.title ?? ""} onChange={(v) => updateRepAt(globalIdx, "title", v)} placeholder={`${region.label} Bölge Temsilcisi`} />
                                </div>
                                <Field
                                  label="Alt Bölge / Lokasyon (opsiyonel)"
                                  value={rep.subregion ?? ""}
                                  onChange={(v) => updateRepAt(globalIdx, "subregion", v)}
                                  placeholder="örn. Kuzey Marmara · İstanbul Anadolu · Bursa"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Telefon" value={rep.phone ?? ""} onChange={(v) => updateRepAt(globalIdx, "phone", v)} placeholder="+90 ..." />
                                  <Field label="E-Posta" value={rep.email ?? ""} onChange={(v) => updateRepAt(globalIdx, "email", v)} validate={validateEmail} />
                                </div>
                                <Field label="WhatsApp (opsiyonel)" value={rep.whatsapp ?? ""} onChange={(v) => updateRepAt(globalIdx, "whatsapp", v)} placeholder="+90 ..." />
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => addRep(region.id, region.label)}
                              className="w-full border border-dashed border-white/15 hover:border-blue-400/40 hover:bg-blue-500/5 rounded-lg py-2 text-[11px] font-semibold text-white/45 hover:text-blue-300 transition-all"
                            >
                              + Bu Bölgeye Temsilci Ekle
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* ── Yurtdışı Bölüm Metinleri ──
                      Heading + intro paragraph + multilingual support note
                      shown when the visitor opens the Yurtdışı tab. All fields
                      auto-translate to EN on save. */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Yurtdışı Bölüm Metinleri</p>
                      <p className="text-xs text-white/35">Yurtdışı sekmesi açıldığında gösterilen başlık, açıklama ve dil desteği yazıları.</p>
                    </div>
                    {(() => {
                      const ws = content.dealer.worldSection ?? {
                        sectionLabel: "", heading: "",
                        introTitle: "", introDescription: "",
                        languagesNote: "", languages: [] as string[],
                      };
                      const updateWS = (field: string, value: string | string[]) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          next.dealer.worldSection = {
                            ...(next.dealer.worldSection ?? {
                              sectionLabel: "", heading: "",
                              introTitle: "", introDescription: "",
                              languagesNote: "", languages: [],
                            }),
                            [field]: value,
                          };
                          return next;
                        });
                      };
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="Üst Etiket" value={ws.sectionLabel} onChange={(v) => updateWS("sectionLabel", v)} placeholder="Küresel Distribütör Ağı" />
                            <Field label="Başlık" value={ws.heading} onChange={(v) => updateWS("heading", v)} placeholder="Dünyaya Açılan Bemis" />
                          </div>
                          <Field label="Sol Kart Başlığı" value={ws.introTitle} onChange={(v) => updateWS("introTitle", v)} placeholder="Bursa'dan Dünyaya" />
                          <Field label="Sol Kart Açıklaması" value={ws.introDescription} onChange={(v) => updateWS("introDescription", v)} placeholder="Bursa merkezli üretim tesisimizden..." />
                          <Field label="Çok Dilli Personel Notu" value={ws.languagesNote} onChange={(v) => updateWS("languagesNote", v)} placeholder="Kurumsal müşterilerimize yerel dilde..." />
                          <div>
                            <Field
                              label="Diller (ISO kodları, virgülle ayır)"
                              value={(ws.languages ?? []).join(", ")}
                              onChange={(v) => updateWS("languages", v.split(",").map(s => s.trim().toLowerCase()).filter(Boolean))}
                              placeholder="tr, en, ru, es, ar"
                            />
                            <p className="text-[10px] text-white/30 mt-1">
                              Desteklenen kodlar (bayrak otomatik): tr, en, ru, es, ar, de, fr, it, pt, zh, fa, az. Listede olmayan kodlar 🌐 ile gösterilir.
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* ── İhracat İletişim Bilgileri ──
                      Surfaced on /dealer (Yurtdışı tab) AND linked from the
                      footer "İhracat / Export" link. Empty fields are hidden. */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">İhracat Departmanı İletişim</p>
                      <p className="text-xs text-white/35">Yurtdışı haritası açıldığında ve footer&apos;daki &quot;İhracat / Export&quot; tıklandığında bu kart gösterilir.</p>
                    </div>
                    {(() => {
                      const ec = content.dealer.exportContact ?? {};
                      const updateExport = (field: string, value: string) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          next.dealer.exportContact = { ...(next.dealer.exportContact ?? {}), [field]: value };
                          return next;
                        });
                      };
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="İletişim Kişisi" value={ec.contactPerson ?? ""} onChange={(v) => updateExport("contactPerson", v)} />
                            <Field label="Ünvan / Pozisyon" value={ec.title ?? ""} onChange={(v) => updateExport("title", v)} placeholder="Bemis İhracat Departmanı" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="E-Posta" value={ec.email ?? ""} onChange={(v) => updateExport("email", v)} validate={validateEmail} placeholder="export@bemis.com.tr" />
                            <Field label="Telefon" value={ec.phone ?? ""} onChange={(v) => updateExport("phone", v)} placeholder="+90 ..." />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="WhatsApp" value={ec.whatsapp ?? ""} onChange={(v) => updateExport("whatsapp", v)} placeholder="+90 ..." />
                            <Field label="Çalışma Saatleri" value={ec.hours ?? ""} onChange={(v) => updateExport("hours", v)} placeholder="Hafta içi 08:30–18:00" />
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* ── Yurtdışı Distribütörler ──
                      Editable list of international markets — `active` toggles
                      whether a country shows up as a globe pin + side-list
                      entry on /dealer (Yurtdışı tab). */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Yurtdışı Distribütörler</p>
                        <p className="text-xs text-white/35">Aktif olanlar 3D dünya haritasında pin + sol listede gösterilir. Boş bırakılan alanlar gizlenir.</p>
                      </div>
                      <button
                        onClick={() => {
                          setAddCountryFilter("");
                          setAddCountryOpen(true);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all flex-shrink-0"
                        style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.45)", color: "#93C5FD" }}
                      >
                        <HiOutlinePlus size={13} /> Ülke Ekle
                      </button>
                    </div>

                    {(() => {
                      const list = content.dealer.internationalDealers ?? [];
                      if (list.length === 0) {
                        return <p className="text-xs text-white/35 px-1 py-3">Henüz ülke yok. Yukarıdan ekleyin.</p>;
                      }

                      const updateIntl = (id: string, field: string, value: string | number | boolean) => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          const arr = [...(next.dealer.internationalDealers ?? [])];
                          const idx = arr.findIndex((c) => c.id === id);
                          if (idx < 0) return prev;
                          arr[idx] = { ...arr[idx], [field]: value };
                          next.dealer.internationalDealers = arr;
                          return next;
                        });
                      };

                      const removeIntl = (id: string) => {
                        if (!window.confirm("Bu ülkeyi silmek istediğinize emin misiniz?")) return;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                          next.dealer.internationalDealers = (next.dealer.internationalDealers ?? []).filter((c) => c.id !== id);
                          return next;
                        });
                      };

                      // Sort: active first, then by name
                      const sorted = [...list].sort((a, b) => {
                        if (a.active !== b.active) return a.active ? -1 : 1;
                        return a.countryName.localeCompare(b.countryName, "tr");
                      });

                      return (
                        <div className="space-y-2">
                          {sorted.map((c) => (
                            <details
                              key={c.id}
                              className="rounded-xl border border-white/7 group"
                              style={{ background: c.active ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)" }}
                            >
                              <summary className="cursor-pointer list-none px-3 py-2 flex items-center gap-3 select-none">
                                <span
                                  className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded"
                                  style={{ background: "rgba(59,130,246,0.20)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.30)" }}
                                >
                                  {c.countryCode}
                                </span>
                                <span className="text-sm font-semibold text-white/85 flex-1">{c.countryName}</span>
                                {c.distributorName && (
                                  <span className="text-[10px] text-white/45 truncate max-w-[200px]">{c.distributorName}</span>
                                )}
                                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={!!c.active}
                                    onChange={(e) => updateIntl(c.id, "active", e.target.checked)}
                                    className="accent-blue-500"
                                  />
                                  <span style={{ color: c.active ? "#93C5FD" : "rgba(255,255,255,0.35)" }}>{c.active ? "Aktif" : "Pasif"}</span>
                                </label>
                                <span className="text-white/30 text-xs ml-1 group-open:rotate-180 transition-transform">▾</span>
                              </summary>
                              <div className="px-3 pb-3 pt-1 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Ülke Adı" value={c.countryName} onChange={(v) => updateIntl(c.id, "countryName", v)} />
                                  <Field label="ISO-2 Kod" value={c.countryCode} onChange={(v) => updateIntl(c.id, "countryCode", v.toUpperCase().slice(0, 2))} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Distribütör Adı" value={c.distributorName ?? ""} onChange={(v) => updateIntl(c.id, "distributorName", v)} />
                                  <Field label="İletişim Kişisi" value={c.contactPerson ?? ""} onChange={(v) => updateIntl(c.id, "contactPerson", v)} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Şehir" value={c.city ?? ""} onChange={(v) => updateIntl(c.id, "city", v)} />
                                  <Field label="Adres" value={c.address ?? ""} onChange={(v) => updateIntl(c.id, "address", v)} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Telefon" value={c.phone ?? ""} onChange={(v) => updateIntl(c.id, "phone", v)} placeholder="+49 ..." />
                                  <Field label="WhatsApp" value={c.whatsapp ?? ""} onChange={(v) => updateIntl(c.id, "whatsapp", v)} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="E-Posta" value={c.email ?? ""} onChange={(v) => updateIntl(c.id, "email", v)} validate={validateEmail} />
                                  <Field label="Web Sitesi" value={c.website ?? ""} onChange={(v) => updateIntl(c.id, "website", v)} placeholder="https://..." />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Enlem (lat)" value={String(c.lat)} onChange={(v) => updateIntl(c.id, "lat", Number(v) || 0)} />
                                  <Field label="Boylam (lng)" value={String(c.lng)} onChange={(v) => updateIntl(c.id, "lng", Number(v) || 0)} />
                                </div>
                                <Field label="Notlar" value={c.notes ?? ""} onChange={(v) => updateIntl(c.id, "notes", v)} />
                                <div className="pt-1">
                                  <button
                                    onClick={() => removeIntl(c.id)}
                                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                                    style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)", color: "#FCA5A5" }}
                                  >
                                    <HiOutlineTrash size={11} className="inline mr-1" /> Sil
                                  </button>
                                </div>
                              </div>
                            </details>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">Bayi Listesi</p>
                      <p className="text-xs text-white/35">Bayi eklerken şehir otomatik olarak doğru bölgeye yerleştirilir.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {Object.keys(dealers).length > 0 && (
                        <button
                          onClick={async () => {
                            const total = Object.values(dealers).reduce((acc, c) => acc + (c.dealers?.length ?? 0), 0);
                            if (!window.confirm(`TÜM bayiler silinecek (${total} bayi, ${Object.keys(dealers).length} şehir) ve hemen kaydedilecek. Devam edilsin mi?`)) return;
                            setDealers({});
                            setDealersSaving(true);
                            try {
                              const res = await fetch("/api/admin/dealers", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({}),
                              });
                              if (res.ok) {
                                dealersCleanRef.current = {};
                                setDealersDirty(false);
                                showToast("ok", "Tüm bayiler temizlendi.");
                                setPreviewKey((k) => k + 1);
                              } else {
                                showToast("err", "Silme başarısız.");
                              }
                            } catch {
                              showToast("err", "Ağ hatası.");
                            }
                            setDealersSaving(false);
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                          style={{
                            background: "rgba(239,68,68,0.10)",
                            border: "1px solid rgba(239,68,68,0.32)",
                            color: "#FCA5A5",
                          }}
                          title="Tüm bayileri sil ve hemen kaydet (demo verileri temizlemek için)"
                        >
                          <HiOutlineTrash size={13} /> Tümünü Temizle
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const defaultCity = dealers[selDealerCity] ? selDealerCity : (Object.keys(dealers)[0] ?? "");
                          setAddDealerForm({ ...emptyDealerForm, city: defaultCity });
                          setAddDealerCityFilter("");
                          setAddDealerOpen(true);
                        }}
                        className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                        style={{
                          background: "#3B82F6",
                          border: "1px solid rgba(59,130,246,0.55)",
                          color: "#fff",
                        }}
                        title="Yeni bayi ekle"
                      >
                        <HiOutlinePlus size={16} /> Bayi Ekle
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {/* City list */}
                    <div className="w-52 flex-shrink-0 space-y-1">
                      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-1">Şehirler</p>

                      {(() => {
                        const presentCityIds = Object.keys(dealers).slice().sort(compareCityIds);
                        const grouped: Record<string, string[]> = {};
                        for (const cid of presentCityIds) {
                          const r = getCityRegion(cid) ?? "_other";
                          (grouped[r] ||= []).push(cid);
                        }
                        const regionOrder = [...TURKEY_REGIONS.map((r) => r.id), "_other"];

                        if (presentCityIds.length === 0) {
                          return (
                            <p className="text-[11px] text-white/30 px-1 py-2">Henüz bayi eklenmedi.</p>
                          );
                        }

                        return regionOrder.map((rid) => {
                          const cids = grouped[rid];
                          if (!cids || cids.length === 0) return null;
                          const regionLabel = REGION_BY_ID[rid]?.label ?? "Diğer";
                          return (
                            <div key={rid} className="pt-2 first:pt-0">
                              <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.14em] px-2 mb-1">{regionLabel}</p>
                              {cids.map((cid) => {
                                const count = dealers[cid]?.dealers?.length ?? 0;
                                return (
                                  <button key={cid} onClick={() => setSelDealerCity(cid)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                                      selDealerCity === cid ? "bg-white/10 text-white" : "text-white/45 hover:text-white/70 hover:bg-white/5"
                                    }`}
                                  >
                                    <span>{getCityLabel(cid)}</span>
                                    {count > 0 && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.50)" }}>
                                        {count}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Dealer editor for selected city */}
                    <div className="flex-1 min-w-0">
                      {(() => {
                        const cityLabel = getCityLabel(selDealerCity);
                        const regionId = getCityRegion(selDealerCity);
                        const regionLabel = regionId ? REGION_BY_ID[regionId]?.label : null;
                        const cityDealers: Dealer[] = dealers[selDealerCity]?.dealers ?? [];
                        const cityExists = !!dealers[selDealerCity];

                        const updateDealer = (idx: number, field: keyof Dealer, val: string) => {
                          setDealers((prev) => {
                            const next = JSON.parse(JSON.stringify(prev)) as DealersData;
                            if (!next[selDealerCity]) next[selDealerCity] = { dealers: [] };
                            next[selDealerCity].dealers[idx] = { ...next[selDealerCity].dealers[idx], [field]: val };
                            return next;
                          });
                        };

                        const removeDealer = (idx: number) => {
                          setDealers((prev) => {
                            const next = JSON.parse(JSON.stringify(prev)) as DealersData;
                            if (next[selDealerCity]?.dealers) {
                              next[selDealerCity].dealers.splice(idx, 1);
                            }
                            // If the city has no more dealers, drop the city too so
                            // empty cities don't linger in the sidebar / on the map.
                            if (next[selDealerCity]?.dealers?.length === 0) {
                              delete next[selDealerCity];
                            }
                            return next;
                          });
                        };

                        if (!cityExists) {
                          return (
                            <div className="text-center py-12 text-white/30 text-sm border border-dashed border-white/10 rounded-2xl">
                              Henüz bayi yok. Üstteki <span className="text-white/55 font-semibold">Bayi Ekle</span> butonu ile bayi ekleyin — şehir otomatik olarak doğru bölgeye yerleşir.
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white">{cityLabel} <span className="text-white/30 font-normal">— {cityDealers.length} bayi</span></p>
                                {regionLabel && (
                                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.14)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.28)" }}>
                                    {regionLabel}
                                  </span>
                                )}
                              </div>
                            </div>

                            {cityDealers.length === 0 && (
                              <div className="text-center py-10 text-white/25 text-sm border border-dashed border-white/10 rounded-2xl">
                                Bu şehirde henüz bayi yok
                              </div>
                            )}

                            {cityDealers.map((dealer, idx) => (
                              <div key={idx} className="bg-white/3 border border-white/7 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Bayi {idx + 1}</p>
                                  <button onClick={() => removeDealer(idx)} className="text-white/20 hover:text-red-400 transition-colors">
                                    <HiOutlineTrash size={13} />
                                  </button>
                                </div>

                                {/* Bayi Statüsü — Charge Bayi / Charge + Bayi / Charge Pro Bayi
                                    3-button picker. "Bayi Ekle" modal'ındaki picker'ın
                                    inline kompakt versiyonu — kartın üstünde tier'ı
                                    her zaman görünür yapar ve tek tıklamayla değiştirir. */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Bayi Statüsü</label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {DEALER_TIERS.map((tier) => {
                                      const currentTier = dealer.tier ?? "standart";
                                      const selected = currentTier === tier.id;
                                      return (
                                        <button
                                          key={tier.id}
                                          type="button"
                                          onClick={() => updateDealer(idx, "tier", tier.id)}
                                          className="relative rounded-lg px-2.5 py-2 text-left transition-all"
                                          style={{
                                            background: selected ? `${tier.color}22` : "rgba(255,255,255,0.04)",
                                            border: selected ? `1px solid ${tier.color}88` : "1px solid rgba(255,255,255,0.08)",
                                            boxShadow: selected ? `0 0 0 1px ${tier.color}55` : "none",
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span
                                              className="inline-block rounded-full flex-shrink-0"
                                              style={{
                                                width: 10, height: 10,
                                                background: tier.color,
                                                boxShadow: `0 0 0 1.5px rgba(255,255,255,0.85), 0 0 0 2.5px ${tier.color}55`,
                                              }}
                                            />
                                            <span className="text-[11px] font-bold leading-tight" style={{ color: selected ? "#ffffff" : "rgba(255,255,255,0.70)" }}>
                                              {tier.label}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Bayi Adı</label>
                                    <input value={dealer.name} onChange={(e) => updateDealer(idx, "name", e.target.value)}
                                      className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Yetkili Kişi</label>
                                    <input value={dealer.contactPerson ?? ""} onChange={(e) => updateDealer(idx, "contactPerson", e.target.value)}
                                      placeholder="Ad Soyad"
                                      className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                  </div>
                                  {(() => {
                                    const inlineCls = (ok: boolean) =>
                                      `w-full bg-white/5 border rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none ${ok ? "border-white/8 focus:border-white/22" : "border-red-400/55"}`;
                                    const phoneOk = isValidPhone(dealer.phone);
                                    const emailOk = isValidEmail(dealer.email ?? "");
                                    const waOk    = isValidPhone(dealer.whatsapp ?? "");
                                    const webOk   = isValidUrl(dealer.website ?? "");
                                    return (
                                      <>
                                        <div>
                                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Telefon</label>
                                          <input value={dealer.phone} onChange={(e) => updateDealer(idx, "phone", e.target.value)}
                                            placeholder="+90 (___) ___ __ __"
                                            className={inlineCls(phoneOk)} />
                                        </div>
                                        <div>
                                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">E-posta</label>
                                          <input type="email" value={dealer.email ?? ""} onChange={(e) => updateDealer(idx, "email", e.target.value)}
                                            placeholder="bayi@ornek.com"
                                            className={inlineCls(emailOk)} />
                                        </div>
                                        <div>
                                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">WhatsApp</label>
                                          <input value={dealer.whatsapp ?? ""} onChange={(e) => updateDealer(idx, "whatsapp", e.target.value)}
                                            placeholder="+90 (___) ___ __ __"
                                            className={inlineCls(waOk)} />
                                        </div>
                                        <div>
                                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Web Sitesi</label>
                                          <input type="url" value={dealer.website ?? ""} onChange={(e) => updateDealer(idx, "website", e.target.value)}
                                            placeholder="https://"
                                            className={inlineCls(webOk)} />
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Adres</label>
                                  <input value={dealer.address} onChange={(e) => updateDealer(idx, "address", e.target.value)}
                                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Harita Bağlantısı</label>
                                    <input type="url" value={dealer.mapUrl ?? ""} onChange={(e) => updateDealer(idx, "mapUrl", e.target.value)}
                                      placeholder="https://maps.google.com/…"
                                      className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Çalışma Saatleri</label>
                                    <input value={dealer.workingHours ?? ""} onChange={(e) => updateDealer(idx, "workingHours", e.target.value)}
                                      placeholder="Pzt–Cmt 09:00–18:00"
                                      className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Notlar</label>
                                  <textarea value={dealer.notes ?? ""} onChange={(e) => updateDealer(idx, "notes", e.target.value)}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 resize-none" />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Add Country Modal — searchable picker for the global
                      country list. Only countries NOT already in the editor
                      list show up; selecting one adds it with active=true. */}
                  {addCountryOpen && (() => {
                    const existing = new Set(
                      (content.dealer.internationalDealers ?? []).map(c => c.countryCode.toUpperCase())
                    );
                    const q = addCountryFilter.trim().toLocaleLowerCase("tr");
                    const filtered = WORLD_COUNTRIES
                      .filter(c => !existing.has(c.code))
                      .filter(c => !q || c.name.toLocaleLowerCase("tr").includes(q) || c.code.toLowerCase().includes(q));
                    return (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
                        onClick={(e) => { if (e.target === e.currentTarget) setAddCountryOpen(false); }}
                      >
                        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a1a1e] p-6 space-y-4 max-h-[80vh] flex flex-col">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-white">Ülke Ekle</p>
                              <p className="text-[11px] text-white/40 mt-0.5">Listeden seçilen ülke aktif olarak eklenir; sonra detayları düzenleyebilirsiniz.</p>
                            </div>
                            <button
                              onClick={() => setAddCountryOpen(false)}
                              className="text-white/40 hover:text-white text-xl leading-none"
                              aria-label="Kapat"
                            >×</button>
                          </div>

                          <input
                            type="text"
                            value={addCountryFilter}
                            onChange={(e) => setAddCountryFilter(e.target.value)}
                            placeholder="Ülke ara… (isim veya ISO-2 kod)"
                            autoFocus
                            className="w-full rounded-xl px-3 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50"
                          />

                          <div className="flex-1 overflow-y-auto rounded-xl border border-white/8 bg-white/3 p-1.5 space-y-0.5 min-h-[200px]">
                            {filtered.length === 0 ? (
                              <p className="text-[11px] text-white/30 px-3 py-3 text-center">
                                {addCountryFilter ? "Eşleşen ülke yok." : "Tüm ülkeler zaten eklenmiş."}
                              </p>
                            ) : (
                              filtered.map(c => (
                                <button
                                  key={c.code}
                                  onClick={() => {
                                    setContent(prev => {
                                      if (!prev) return prev;
                                      const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                      const arr = next.dealer.internationalDealers ?? [];
                                      arr.push({
                                        id: c.code.toLowerCase(),
                                        countryCode: c.code,
                                        countryName: c.name,
                                        lat: c.lat,
                                        lng: c.lng,
                                        active: true,
                                      });
                                      next.dealer.internationalDealers = arr;
                                      return next;
                                    });
                                    setAddCountryOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-blue-500/15"
                                >
                                  <span
                                    className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                                    style={{ background: "rgba(59,130,246,0.20)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.30)" }}
                                  >
                                    {c.code}
                                  </span>
                                  <span className="text-sm text-white/80 flex-1">{c.name}</span>
                                  <span className="text-[10px] text-white/30">{c.lat.toFixed(1)}, {c.lng.toFixed(1)}</span>
                                </button>
                              ))
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <p className="text-[10px] text-white/30">{filtered.length} ülke gösteriliyor</p>
                            <button
                              onClick={() => setAddCountryOpen(false)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                            >
                              Kapat
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Add Dealer Modal */}
                  {addDealerOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
                      onClick={(e) => { if (e.target === e.currentTarget) setAddDealerOpen(false); }}
                    >
                      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a1a1e] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div>
                          <h3 className="text-base font-bold text-white">Yeni Bayi Ekle</h3>
                          <p className="text-[11px] text-white/40 mt-0.5">Şehir seçimi otomatik olarak doğru coğrafi bölgeye yerleştirilir.</p>
                        </div>

                        {/* City picker */}
                        <div>
                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Şehir *</label>
                          <input
                            value={addDealerCityFilter}
                            onChange={(e) => setAddDealerCityFilter(e.target.value)}
                            placeholder="Şehir ara… (ör. İzmir)"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25 mb-2"
                          />
                          <div className="max-h-56 overflow-y-auto rounded-xl border border-white/8 bg-white/3 p-1.5 space-y-1">
                            {(() => {
                              const q = addDealerCityFilter.trim().toLocaleLowerCase("tr");
                              const filtered = q
                                ? TURKEY_CITIES.filter((c) => c.label.toLocaleLowerCase("tr").includes(q) || c.id.includes(q))
                                : TURKEY_CITIES;
                              if (filtered.length === 0) {
                                return <p className="text-[11px] text-white/30 px-2 py-2">Eşleşen şehir yok.</p>;
                              }
                              const byRegion: Record<string, typeof TURKEY_CITIES> = {};
                              for (const c of filtered) (byRegion[c.region] ||= []).push(c);
                              return TURKEY_REGIONS.map((r) => {
                                const list = byRegion[r.id];
                                if (!list || list.length === 0) return null;
                                return (
                                  <div key={r.id} className="pt-1 first:pt-0">
                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.14em] px-2 pb-1">{r.label}</p>
                                    <div className="grid grid-cols-2 gap-1">
                                      {list.map((c) => {
                                        const selected = addDealerForm.city === c.id;
                                        const exists = !!dealers[c.id];
                                        return (
                                          <button
                                            key={c.id}
                                            onClick={() => setAddDealerForm((f) => ({ ...f, city: c.id }))}
                                            className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors flex items-center justify-between ${
                                              selected
                                                ? "bg-blue-500/25 text-white border border-blue-400/50"
                                                : "text-white/60 hover:text-white hover:bg-white/8 border border-transparent"
                                            }`}
                                          >
                                            <span>{c.label}</span>
                                            {exists && <span className="text-[8px] text-white/30">●</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                          {addDealerForm.city && (
                            <p className="text-[11px] text-white/45 mt-1.5">
                              Seçilen: <span className="text-white font-semibold">{getCityLabel(addDealerForm.city)}</span>
                              {" · "}
                              <span className="text-blue-300">{REGION_BY_ID[getCityRegion(addDealerForm.city) ?? ""]?.label ?? "—"}</span>
                              {!dealers[addDealerForm.city] && <span className="text-amber-300/70"> · listede yeni oluşturulacak</span>}
                            </p>
                          )}
                        </div>

                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.14em] pt-2">Bayi Statüsü</p>
                        <div className="grid grid-cols-3 gap-2">
                          {DEALER_TIERS.map((tier) => {
                            const selected = addDealerForm.tier === tier.id;
                            return (
                              <button
                                key={tier.id}
                                onClick={() => setAddDealerForm((f) => ({ ...f, tier: tier.id }))}
                                className="relative rounded-xl px-3 py-2.5 text-left transition-all"
                                style={{
                                  background: selected ? `${tier.color}22` : "rgba(255,255,255,0.04)",
                                  border: selected ? `1px solid ${tier.color}88` : "1px solid rgba(255,255,255,0.08)",
                                  boxShadow: selected ? `0 0 0 1px ${tier.color}55, 0 4px 12px ${tier.color}22` : "none",
                                }}
                              >
                                <span
                                  className="inline-flex items-center justify-center rounded-full mb-1.5"
                                  style={{
                                    width: 22, height: 22,
                                    background: tier.color,
                                    border: "1.5px solid rgba(255,255,255,0.85)",
                                    boxShadow: `0 0 0 1px ${tier.color}55`,
                                  }}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src="/icon" alt="" width={18} height={18} style={{ objectFit: "contain", padding: 2 }} />
                                </span>
                                <p className="text-[12px] font-bold leading-tight" style={{ color: selected ? "#ffffff" : "rgba(255,255,255,0.75)" }}>
                                  {tier.label}
                                </p>
                                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: selected ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)" }}>
                                  {tier.sub}
                                </p>
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.14em] pt-2">Temel Bilgiler</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Bayi Adı *</label>
                            <input
                              value={addDealerForm.name}
                              onChange={(e) => setAddDealerForm((f) => ({ ...f, name: e.target.value }))}
                              placeholder="Bemis Yetkili Bayi …"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Yetkili Kişi</label>
                            <input
                              value={addDealerForm.contactPerson}
                              onChange={(e) => setAddDealerForm((f) => ({ ...f, contactPerson: e.target.value }))}
                              placeholder="Ad Soyad"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
                            />
                          </div>
                        </div>

                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.14em] pt-2">İletişim</p>
                        <div className="grid grid-cols-2 gap-3">
                          {(() => {
                            const phoneOk = isValidPhone(addDealerForm.phone);
                            const emailOk = isValidEmail(addDealerForm.email);
                            const waOk    = isValidPhone(addDealerForm.whatsapp);
                            const webOk   = isValidUrl(addDealerForm.website);
                            const errCls = "border-red-400/55";
                            const baseCls = "w-full bg-white/5 border rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none";
                            return (
                              <>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Telefon</label>
                                  <input
                                    value={addDealerForm.phone}
                                    onChange={(e) => setAddDealerForm((f) => ({ ...f, phone: e.target.value }))}
                                    placeholder="+90 (___) ___ __ __"
                                    className={`${baseCls} ${phoneOk ? "border-white/10 focus:border-white/25" : errCls}`}
                                  />
                                  {!phoneOk && <p className="text-[11px] text-red-400/80 mt-1">Geçerli bir telefon girin (en az 7 rakam).</p>}
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">E-posta</label>
                                  <input
                                    type="email"
                                    value={addDealerForm.email}
                                    onChange={(e) => setAddDealerForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="bayi@ornek.com"
                                    className={`${baseCls} ${emailOk ? "border-white/10 focus:border-white/25" : errCls}`}
                                  />
                                  {!emailOk && <p className="text-[11px] text-red-400/80 mt-1">Geçerli bir e-posta adresi girin.</p>}
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">WhatsApp</label>
                                  <input
                                    value={addDealerForm.whatsapp}
                                    onChange={(e) => setAddDealerForm((f) => ({ ...f, whatsapp: e.target.value }))}
                                    placeholder="+90 (___) ___ __ __"
                                    className={`${baseCls} ${waOk ? "border-white/10 focus:border-white/25" : errCls}`}
                                  />
                                  {!waOk && <p className="text-[11px] text-red-400/80 mt-1">Geçerli bir telefon girin.</p>}
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Web Sitesi</label>
                                  <input
                                    type="url"
                                    value={addDealerForm.website}
                                    onChange={(e) => setAddDealerForm((f) => ({ ...f, website: e.target.value }))}
                                    placeholder="https://"
                                    className={`${baseCls} ${webOk ? "border-white/10 focus:border-white/25" : errCls}`}
                                  />
                                  {!webOk && <p className="text-[11px] text-red-400/80 mt-1">Geçerli bir URL girin (https://…).</p>}
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.14em] pt-2">Konum & Saatler</p>
                        <div>
                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Adres</label>
                          <input
                            value={addDealerForm.address}
                            onChange={(e) => setAddDealerForm((f) => ({ ...f, address: e.target.value }))}
                            placeholder="İlçe / Mahalle, Şehir"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Harita Bağlantısı (Google Maps)</label>
                          <input
                            type="url"
                            value={addDealerForm.mapUrl}
                            onChange={(e) => setAddDealerForm((f) => ({ ...f, mapUrl: e.target.value }))}
                            placeholder="https://maps.google.com/…"
                            className={`w-full bg-white/5 border rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none ${
                              isValidUrl(addDealerForm.mapUrl) ? "border-white/10 focus:border-white/25" : "border-red-400/55"
                            }`}
                          />
                          {!isValidUrl(addDealerForm.mapUrl) && (
                            <p className="text-[11px] text-red-400/80 mt-1">Geçerli bir URL girin.</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Çalışma Saatleri</label>
                          <input
                            value={addDealerForm.workingHours}
                            onChange={(e) => setAddDealerForm((f) => ({ ...f, workingHours: e.target.value }))}
                            placeholder="Pzt–Cmt 09:00–18:00"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Notlar</label>
                          <textarea
                            value={addDealerForm.notes}
                            onChange={(e) => setAddDealerForm((f) => ({ ...f, notes: e.target.value }))}
                            placeholder="Sadece kurumsal randevu, vb."
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/25 resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setAddDealerOpen(false)}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/40 border border-white/8 hover:border-white/15 transition-colors"
                          >
                            İptal
                          </button>
                          <button
                            onClick={() => {
                              const f = addDealerForm;
                              if (!f.city || !f.name.trim()) return;
                              const trim = (s: string) => s.trim();
                              const optional = (s: string) => {
                                const v = trim(s);
                                return v ? v : undefined;
                              };
                              const newDealer: Dealer = {
                                name: trim(f.name),
                                address: trim(f.address),
                                phone: trim(f.phone),
                                email: optional(f.email),
                                contactPerson: optional(f.contactPerson),
                                whatsapp: optional(f.whatsapp),
                                website: optional(f.website),
                                workingHours: optional(f.workingHours),
                                mapUrl: optional(f.mapUrl),
                                notes: optional(f.notes),
                                tier: f.tier,
                              };
                              setDealers((prev) => {
                                const next = JSON.parse(JSON.stringify(prev)) as DealersData;
                                if (!next[f.city]) next[f.city] = { dealers: [] };
                                next[f.city].dealers.push(newDealer);
                                return next;
                              });
                              setSelDealerCity(f.city);
                              setAddDealerOpen(false);
                              setAddDealerForm(emptyDealerForm);
                              setAddDealerCityFilter("");
                            }}
                            disabled={
                              !addDealerForm.city ||
                              !addDealerForm.name.trim() ||
                              !isValidEmail(addDealerForm.email) ||
                              !isValidPhone(addDealerForm.phone) ||
                              !isValidPhone(addDealerForm.whatsapp) ||
                              !isValidUrl(addDealerForm.website) ||
                              !isValidUrl(addDealerForm.mapUrl)
                            }
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40"
                            style={{ background: "#3B82F6" }}
                          >
                            Bayiyi Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── MEDIA ── */}
              {tab === "media" && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h2 className="text-base font-bold mb-1">Genel Görsel Yükleme</h2>
                    <p className="text-xs text-white/35">
                      Herhangi bir görsel yükleyin — size bir URL döner. Bu alanın siteyle <span className="text-white/55 font-semibold">doğrudan bağlantısı yoktur</span>; elde ettiğiniz URL'yi başka alanlara (ürün görseli, içerik metni, vb.) yapıştırabilirsiniz.
                    </p>
                  </div>

                  <div
                    className="border-2 border-dashed border-white/12 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/25 transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploadLoading ? (
                      <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                    ) : (
                      <RiImageAddLine size={28} className="text-white/25" />
                    )}
                    <p className="text-sm text-white/40">{uploadLoading ? "Yükleniyor..." : "Görsel seç veya buraya tıkla"}</p>
                    <p className="text-xs text-white/20">JPG · PNG · WebP · SVG · Maks. 10 MB</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-white/40 mb-3">Bu oturumda yüklenenler</p>
                      <div className="space-y-2">
                        {uploadedFiles.map((url, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
                            <span className="text-xs text-white/60 font-mono truncate max-w-xs">{url}</span>
                            <button onClick={() => navigator.clipboard.writeText(url)} className="text-xs text-white/35 hover:text-white/60 ml-3 flex-shrink-0">
                              Kopyala
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Background Images */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-1">Bölüm Arka Planları</p>
                      <p className="text-xs text-white/30 leading-relaxed">Her ana sayfa bölümüne ayrı arka plan görseli yükleyin. Görsel üzerine yarı şeffaf bir katman eklenir.</p>
                    </div>
                    {[
                      { id: "stats",           label: "İstatistikler" },
                      { id: "dna",             label: "Hakkımızda" },
                      { id: "productshowcase", label: "Ürün Vitrini" },
                      { id: "smartcharger",    label: "Akıllı Şarj" },
                      { id: "products",        label: "Ürün Kataloğu" },
                      { id: "featured",        label: "Öne Çıkan Ürünler" },
                      { id: "referenceProjects", label: "Referans Projeler" },
                      { id: "dealer",     label: "Bayi Ağı" },
                      { id: "reviews",    label: "Kullanıcı Yorumları" },
                      { id: "calculator", label: "Şarj Hesaplayıcı" },
                      { id: "contact",    label: "Bize Ulaşın" },
                    ].map(({ id, label }) => {
                      const currentUrl = content?.sectionBgs?.[id] ?? "";
                      const isLoading = sectionBgLoading === id;
                      return (
                        <div key={id} className="flex items-center gap-3 py-2 border-t border-white/6 first:border-0 first:pt-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/70">{label}</p>
                            {currentUrl ? (
                              <p className="text-xs text-white/30 font-mono truncate mt-0.5">{currentUrl}</p>
                            ) : (
                              <p className="text-xs text-white/20 mt-0.5">Görsel yok</p>
                            )}
                          </div>
                          {currentUrl && (
                            <button
                              onClick={() => setContent((prev) => prev ? { ...prev, sectionBgs: { ...(prev.sectionBgs ?? {}), [id]: "" } } : prev)}
                              className="text-xs text-red-400/60 hover:text-red-400 flex-shrink-0"
                            >
                              Kaldır
                            </button>
                          )}
                          <button
                            onClick={() => { setSectionBgTarget(id); sectionBgRef.current?.click(); }}
                            className="text-xs bg-white/8 hover:bg-white/14 border border-white/10 rounded-lg px-3 py-1.5 text-white/60 hover:text-white flex-shrink-0 transition-colors"
                          >
                            {isLoading ? "Yükleniyor..." : currentUrl ? "Değiştir" : "Yükle"}
                          </button>
                        </div>
                      );
                    })}
                    <input ref={sectionBgRef} type="file" accept="image/*" className="hidden" onChange={handleSectionBgUpload} />
                  </div>

                  {/* ── Logo Yönetimi ── */}
                  <div>
                    <h3 className="text-sm font-bold mb-0.5">Logo Yönetimi</h3>
                    <p className="text-xs text-white/35 mb-4">Karanlık ve aydınlık mod için ayrı logo yükleyin. Şeffaf arka planlı PNG önerilir.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {(["dark", "light"] as const).map((mode) => {
                        const label    = mode === "dark" ? "Karanlık Mod" : "Aydınlık Mod";
                        const hint     = mode === "dark" ? "Beyaz / açık renkli logo" : "Siyah / koyu renkli logo";
                        const current  = content?.logos?.[mode] ?? "";
                        const isLoading= logoLoading === mode;
                        const ref      = mode === "dark" ? logoDarkRef : logoLightRef;
                        return (
                          <div key={mode} className="rounded-2xl border border-white/8 bg-white/3 p-4 flex flex-col gap-3">
                            <div>
                              <p className="text-xs font-bold text-white/60">{label}</p>
                              <p className="text-[10px] text-white/25 mt-0.5">{hint}</p>
                            </div>
                            {current ? (
                              <div className="relative rounded-xl overflow-hidden flex items-center justify-center"
                                style={{ height: 72, background: mode === "dark" ? "#111" : "#f0f0f0" }}>
                                <img src={current} alt={label} className="max-h-full max-w-full object-contain p-2" />
                                <button
                                  onClick={() => setContent((prev) => prev ? { ...prev, logos: { ...(prev.logos ?? { dark: "", light: "" }), [mode]: "" } } : prev)}
                                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white text-[10px]"
                                >✕</button>
                              </div>
                            ) : (
                              <div className="rounded-xl flex items-center justify-center relative"
                                style={{ height: 72, background: mode === "dark" ? "#111" : "#f0f0f0", border: "1px dashed rgba(255,255,255,0.12)" }}>
                                <img src="/logo-white.png" alt={`${label} (varsayılan)`} className="max-h-full max-w-full object-contain p-2"
                                  style={{ opacity: 0.55, filter: mode === "light" ? "brightness(0)" : undefined }} />
                                <span className="absolute bottom-1 right-1.5 text-[9px] text-white/30 bg-black/40 px-1.5 py-0.5 rounded">varsayılan</span>
                              </div>
                            )}
                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => ref.current?.click()}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all"
                                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.60)", opacity: isLoading ? 0.6 : 1 }}
                              >
                                {isLoading
                                  ? <div className="w-3 h-3 rounded-full border border-white/20 border-t-white/60 animate-spin" />
                                  : <RiImageAddLine size={13} />}
                                {current ? "Değiştir" : "Yükle"}
                              </button>
                              {!current && (
                                <button
                                  onClick={() => setContent(prev => {
                                    if (!prev) return prev;
                                    const updated = {
                                      ...prev,
                                      logos: { ...(prev.logos ?? { dark: "", light: "" }), [mode]: "/logo-white.png" },
                                    };
                                    contentCleanRef.current = updated;
                                    fetch("/api/admin/content", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify(updated),
                                    }).catch(() => {});
                                    return updated;
                                  })}
                                  className="text-[11px] text-blue-300/70 hover:text-blue-300 transition-colors py-1"
                                >
                                  Varsayılanı kullan
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <input ref={logoDarkRef}  type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "dark")} />
                    <input ref={logoLightRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "light")} />
                  </div>

                  {/* ── Favicon ── */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-0.5">Favicon — Google Arama ve Tarayıcı İkonu</p>
                      <p className="text-xs text-white/30 leading-relaxed">
                        Google arama sonuçlarında site adının yanında gösterilen küçük ikon ve tarayıcı sekmesindeki simge.
                        Önerilen: <span className="text-white/50">512 × 512 px PNG</span> — kare, şeffaf arka planlı, net kenarlı.
                      </p>
                      <p className="text-[11px] text-amber-400/50 leading-relaxed mt-1.5">
                        Not: Google yeni faviconu algılamak için birkaç gün – birkaç hafta süreyle sitenizi yeniden tarayabilir.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Square preview */}
                      <div
                        className="w-16 h-16 rounded-xl border-2 flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors"
                        style={{ borderColor: content?.faviconUrl ? "rgba(59,130,246,0.40)" : "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}
                      >
                        {content?.faviconUrl ? (
                          <img src={content.faviconUrl} alt="favicon" className="w-full h-full object-contain p-1" />
                        ) : (
                          faviconLoading
                            ? <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                            : <RiImageAddLine size={22} className="text-white/20" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <button
                          onClick={() => faviconRef.current?.click()}
                          disabled={faviconLoading}
                          className="w-full text-xs bg-white/8 hover:bg-white/14 border border-white/10 rounded-xl px-4 py-2.5 text-white/60 hover:text-white transition-colors font-medium disabled:opacity-50"
                        >
                          {faviconLoading ? "Yükleniyor…" : content?.faviconUrl ? "Değiştir" : "PNG / ICO Yükle"}
                        </button>
                        {(content?.logos?.dark || content?.logos?.light) && content?.faviconUrl !== (content?.logos?.dark || content?.logos?.light) && (
                          <button
                            onClick={() => setContent(prev => {
                              if (!prev) return prev;
                              const src = prev.logos?.dark || prev.logos?.light || "";
                              if (!src) return prev;
                              const updated = { ...prev, faviconUrl: src };
                              contentCleanRef.current = updated;
                              fetch("/api/admin/content", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(updated),
                              }).catch(() => {});
                              return updated;
                            })}
                            className="w-full text-xs bg-blue-500/12 hover:bg-blue-500/20 border border-blue-500/25 text-blue-300 rounded-xl px-4 py-2 transition-colors font-medium"
                          >
                            Yüklü logoyu favicon olarak kullan
                          </button>
                        )}
                        {content?.faviconUrl && (
                          <button
                            onClick={() => setContent(prev => prev ? { ...prev, faviconUrl: "" } : prev)}
                            className="w-full text-xs text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            Kaldır
                          </button>
                        )}
                      </div>
                    </div>
                    <input ref={faviconRef} type="file" accept="image/png,image/x-icon,image/ico,.ico,.png" className="hidden" onChange={handleFaviconUpload} />
                  </div>

                  {/* ── Open Graph Image ── */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-0.5">Open Graph Görseli</p>
                      <p className="text-xs text-white/30 leading-relaxed">
                        Siteniz sosyal medyada (WhatsApp, Twitter, LinkedIn vb.) paylaşıldığında çıkan kapak görseli.
                        Önerilen boyut: <span className="text-white/50">1200 × 630 px</span> · JPG veya PNG.
                      </p>
                    </div>

                    {content?.ogImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/8" style={{ aspectRatio: "1200/630" }}>
                        <img src={content.ogImage} alt="OG" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => ogImgRef.current?.click()}
                            className="text-xs bg-white/90 text-black font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Değiştir
                          </button>
                          <button
                            onClick={() => setContent(prev => prev ? { ...prev, ogImage: "" } : prev)}
                            className="text-xs bg-red-500/80 text-white font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/20 transition-colors"
                        style={{ aspectRatio: "1200/630" }}
                        onClick={() => ogImgRef.current?.click()}
                      >
                        {ogImgLoading
                          ? <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                          : <RiImageAddLine size={28} className="text-white/20" />
                        }
                        <p className="text-xs text-white/30">{ogImgLoading ? "Yükleniyor…" : "1200 × 630 px · JPG / PNG"}</p>
                      </div>
                    )}
                    <input ref={ogImgRef} type="file" accept="image/*" className="hidden" onChange={handleOgImgUpload} />
                  </div>
                </div>
              )}

              {/* ── DOCUMENTS ── */}
              {tab === "documents" && <DocumentsPanel />}

              {/* ── MESSAGES ── */}
              {tab === "messages" && <MessagesPanel />}

              {/* ── ANALYTICS ── */}
              {tab === "analytics" && <AnalyticsPanel />}

              {/* ── CHANGELOG ── */}
              {tab === "changelog" && <ChangelogPanel />}

              {/* ── B2B / OEM ── */}
              {tab === "b2b" && <B2BPanel onSaved={() => { setShowPreview(true); setPreviewKey(k => k + 1); }} postToPreview={postToPreview} onSubTabChange={(page) => { setB2bSubPage(page); setShowPreview(true); setPreviewKey(k => k + 1); }} />}

            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── Live Preview Panel ── */}
        <AnimatePresence>
          {showPreview && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 460, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-shrink-0 border-l border-white/8 flex flex-col overflow-hidden"
              style={{ background: "#0a0a0c" }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/8 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white/60">Canlı Önizleme</span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Desktop / Mobile toggle */}
                  <div className="flex items-center rounded-lg overflow-hidden mr-1" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className="px-2.5 py-1 text-[10px] font-bold transition-colors flex items-center gap-1"
                      style={{
                        background: previewMode === "desktop" ? "rgba(59,130,246,0.20)" : "transparent",
                        color: previewMode === "desktop" ? "#60A5FA" : "rgba(255,255,255,0.30)",
                      }}
                      title="Masaüstü önizleme"
                    >
                      🖥 Masaüstü
                    </button>
                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className="px-2.5 py-1 text-[10px] font-bold transition-colors flex items-center gap-1"
                      style={{
                        background: previewMode === "mobile" ? "rgba(59,130,246,0.20)" : "transparent",
                        color: previewMode === "mobile" ? "#60A5FA" : "rgba(255,255,255,0.30)",
                      }}
                      title="Mobil önizleme"
                    >
                      📱 Mobil
                    </button>
                  </div>
                  <button
                    onClick={() => setPreviewKey((k) => k + 1)}
                    className="text-white/30 hover:text-white/60 w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 transition-colors"
                    title="Yenile"
                  >
                    <HiOutlineRefresh size={11} />
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-white/25 hover:text-white/55 w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-xs"
                  >✕</button>
                </div>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-hidden p-3 flex flex-col">
                {previewMode === "desktop" ? (
                  /* ── Desktop: browser chrome + scaled iframe ── */
                  <div
                    className="w-full h-full rounded-xl overflow-hidden flex flex-col"
                    style={{ border: "1px solid rgba(255,255,255,0.10)", background: "#111" }}
                  >
                    {/* Browser address bar */}
                    <div className="flex-shrink-0 flex items-center gap-2 px-3"
                      style={{ height: 30, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />)}
                      </div>
                      <div className="flex-1 flex items-center justify-center rounded"
                        style={{ height: 18, background: "rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.30)" }}>bemisevcharge.com.tr</span>
                      </div>
                    </div>
                    {/* iframe viewport — 1024×768 scaled to fit 436px panel width */}
                    <div className="flex-1 overflow-hidden relative">
                      <iframe ref={iframeRef} key={`desktop-${previewKey}-${tab}`} src={previewSrc} title="Masaüstü Önizleme"
                        onLoad={handleIframeLoad}
                        style={{ position: "absolute", top: 0, left: 0, width: 1024, height: 768, border: "none",
                          transformOrigin: "top left", transform: "scale(0.426)", pointerEvents: "auto" }} />
                    </div>
                  </div>
                ) : (
                  /* ── Mobile: phone chrome + scaled iframe ── */
                  /* iPhone 14: 390×844 logical px. Scale to fit panel width (240px). */
                  (() => {
                    const PHONE_W = 228;
                    const PHONE_H = Math.round(PHONE_W * (844 / 390)); // ≈ 494
                    const SCALE   = PHONE_W / 390;
                    return (
                      <div className="flex-1 flex items-start justify-center overflow-y-auto pt-2 pb-2">
                        {/* Phone frame — fixed aspect ratio */}
                        <div className="relative flex-shrink-0" style={{ width: PHONE_W, height: PHONE_H }}>
                          {/* Phone outline */}
                          <div className="absolute inset-0 rounded-[26px] pointer-events-none z-10"
                            style={{ border: "2px solid rgba(255,255,255,0.18)", boxShadow: "0 0 0 5px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.55)" }} />
                          {/* Dynamic island / notch */}
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 rounded-full"
                            style={{ width: 52, height: 11, background: "#060608" }} />
                          {/* Home indicator */}
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 rounded-full"
                            style={{ width: 44, height: 3, background: "rgba(255,255,255,0.22)" }} />
                          {/* Screen area */}
                          <div className="absolute inset-0 rounded-[24px] overflow-hidden" style={{ background: "#000" }}>
                            <iframe
                              ref={iframeMobileRef}
                              key={`mobile-${previewKey}-${tab}`}
                              src={previewSrc}
                              title="Mobil Önizleme"
                              onLoad={handleIframeLoad}
                              style={{
                                position: "absolute", top: 0, left: 0,
                                width: 390,
                                height: 844,
                                border: "none",
                                transformOrigin: "top left",
                                transform: `scale(${SCALE})`,
                                pointerEvents: "auto",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-4 py-1.5 border-t border-white/6 text-center">
                <p className="text-[9px] text-white/15">
                  {previewMode === "desktop" ? "1024px masaüstü görünümü" : "390px mobil görünümü (iPhone 14)"} · Kayıt sonrası otomatik güncellenir
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
