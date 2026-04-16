"use client";

import { useEffect, useState, useRef } from "react";

// ── Field component defined OUTSIDE AdminPage to prevent remount on every render ──
function Field({ label, value, onChange, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; half?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 resize-none" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
      )}
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
  HiOutlineStar,
} from "react-icons/hi";
import { RiImageAddLine } from "react-icons/ri";

type SpecItem = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductEntry = { id: string; name: string; subtitle: string; badge: string | null; description: string; specs: SpecGroup[]; image?: string; images?: string[] };
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

type StatItem = { value: number; suffix: string; prefix?: string; label: string; description: string };
type CategoryMeta = { name: string; subtitle: string; modelCount: number; badge: string | null; comingSoon: boolean; image?: string; sliderImage?: string };
type FeaturedItem = { categoryId: string; productId: string; badge: string; highlight: string; visible: boolean };

type ContentData = {
  hero: {
    badge: string; headline1: string; headline2: string; headline3: string;
    subtitle: string; ctaPrimary: string; ctaSecondary: string; heroBg: string;
    layout: { logo: { x: number; y: number }; text: { x: number; y: number }; button: { x: number; y: number } };
  };
  stats: StatItem[];
  categories: Record<string, CategoryMeta>;
  featured: FeaturedItem[];
  contact: { phone: string; email: string; address: string; addressSub: string; workingHours: string; workingDays: string };
  company: { foundedYear: string; exportCountries: string; productCount: string; facilitySize: string };
  social: { linkedin: string; instagram: string; twitter: string };
  dna: {
    sectionLabel: string; sectionHeading: string; brandHeading: string;
    brandPara1: string; brandPara2: string; quote: string; quoteAttr: string;
    yearLabel: string; yearSub: string;
    highlights: DnaItem[];
    features: DnaItem[];
    factoryImage?: string;
    factoryVideo?: string;
    productionStepImages?: string[];
  };
  products: { heading: string; subheading: string };
  dealer: { sectionLabel: string; heading: string; description: string; applyText: string; statCities: string; statDealers: string };
  reviews: { heading: string; subheading: string; rating: string; ratingCount: string; items: ReviewItem[] };
  contactSection: { sectionLabel: string; heading: string; subheading: string };
  sectionBgs?: Record<string, string>;
  logos?: { dark: string; light: string };
};

type Dealer = { name: string; address: string; phone: string };
type DealersData = Record<string, { dealers: Dealer[] }>;

const CITY_LIST = [
  { id: "istanbul",   label: "İstanbul"   },
  { id: "ankara",     label: "Ankara"     },
  { id: "izmir",      label: "İzmir"      },
  { id: "bursa",      label: "Bursa"      },
  { id: "antalya",    label: "Antalya"    },
  { id: "konya",      label: "Konya"      },
  { id: "adana",      label: "Adana"      },
  { id: "mersin",     label: "Mersin"     },
  { id: "gaziantep",  label: "Gaziantep"  },
  { id: "kayseri",    label: "Kayseri"    },
  { id: "samsun",     label: "Samsun"     },
  { id: "trabzon",    label: "Trabzon"    },
  { id: "erzurum",    label: "Erzurum"    },
  { id: "diyarbakir", label: "Diyarbakır" },
];

type DnaItem  = { title: string; desc: string };
type ReviewItem = { platform: string; platformColor: string; rating: number; author: string; date: string; product: string; text: string };
type HeroLayoutKey = "logo" | "text" | "button";

type Tab = "hero" | "stats" | "products" | "contact" | "dealers" | "sections" | "media" | "analytics" | "documents";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("hero");
  const [content, setContent] = useState<ContentData | null>(null);
  const [products, setProducts] = useState<CategoryData[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingProducts, setSavingProducts] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [prodImgLoading, setProdImgLoading] = useState(false);
  const [heroBgLoading, setHeroBgLoading] = useState(false);
  const [factoryImgLoading, setFactoryImgLoading] = useState(false);
  const [factoryVideoLoading, setFactoryVideoLoading] = useState(false);
  const [catImgLoading, setCatImgLoading] = useState<string | null>(null); // catId while uploading
  const [stepImgLoadingIdx, setStepImgLoadingIdx] = useState<number | null>(null);
  const [stepImgTargetIdx, setStepImgTargetIdx] = useState<number>(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const prodImgRef = useRef<HTMLInputElement>(null);
  const heroBgRef = useRef<HTMLInputElement>(null);
  const factoryImgRef = useRef<HTMLInputElement>(null);
  const factoryVideoRef = useRef<HTMLInputElement>(null);
  const catImgRef = useRef<HTMLInputElement>(null);
  const stepImgRef = useRef<HTMLInputElement>(null);
  const [catImgTarget, setCatImgTarget] = useState<string>(""); // catId for pending upload
  const [sectionBgLoading, setSectionBgLoading] = useState<string | null>(null);
  const [sectionBgTarget, setSectionBgTarget] = useState<string>("");
  const sectionBgRef = useRef<HTMLInputElement>(null);
  const [catSliderImgLoading, setCatSliderImgLoading] = useState<string | null>(null);
  const [catSliderImgTarget, setCatSliderImgTarget] = useState<string>("");
  const catSliderImgRef = useRef<HTMLInputElement>(null);
  const [logoLoading, setLogoLoading] = useState<"dark" | "light" | null>(null);
  const logoDarkRef  = useRef<HTMLInputElement>(null);
  const logoLightRef = useRef<HTMLInputElement>(null);

  // Dealer editor state
  const [dealers, setDealers] = useState<DealersData>({});
  const [dealersSaving, setDealersSaving] = useState(false);
  const [selDealerCity, setSelDealerCity] = useState<string>(CITY_LIST[0].id);

  // Hero visual layout editor
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sections accordion state
  const [secOpen, setSecOpen] = useState<Record<string, boolean>>({ dna: true, products: false, dealer: false, reviews: false, contactSec: false });

  // Product editor state
  const [selCat, setSelCat] = useState<string>("");
  const [selProd, setSelProd] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [prodSubTab, setProdSubTab] = useState<"cards" | "specs">("cards");

  // Admin paneli her zaman karanlık temada kalmalı
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", "dark");
    return () => { document.documentElement.setAttribute("data-theme", prev); };
  }, []);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => { if (r.status === 401) { setAuthed(false); return null; } return r.json(); })
      .then((d) => { if (d) { setContent(d); setAuthed(true); } })
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (authed && tab === "products") {
      fetch("/api/admin/products")
        .then((r) => r.json())
        .then((d: CategoryData[]) => { setProducts(d); if (!selCat && d.length > 0) setSelCat(d[0].id); })
        .catch(() => {});
    }
  }, [authed, tab, selCat]);

  useEffect(() => {
    if (authed && tab === "dealers") {
      fetch("/api/admin/dealers")
        .then((r) => r.json())
        .then((d: DealersData) => setDealers(d))
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
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setContent(null);
  };

  const handleSaveContent = async () => {
    if (!content) return;
    setSaving(true);
    const res = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    if (res.ok) showToast("ok", "İçerik kaydedildi.");
    else showToast("err", "Kayıt başarısız.");
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

  // DNA array helpers
  const updateDnaHighlight = (idx: number, field: keyof DnaItem, val: string) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    if (!next.dna.highlights[idx]) return;
    next.dna.highlights[idx][field] = val;
    setContent(next);
  };

  const updateDnaFeature = (idx: number, field: keyof DnaItem, val: string) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    if (!next.dna.features[idx]) return;
    next.dna.features[idx][field] = val;
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
    const res = await fetch("/api/admin/dealers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dealers) });
    if (res.ok) showToast("ok", "Bayiler kaydedildi.");
    else showToast("err", "Kayıt başarısız.");
    setDealersSaving(false);
  };

  const handleSaveProducts = async () => {
    setSavingProducts(true);
    const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(products) });
    if (res.ok) showToast("ok", "Ürün verileri kaydedildi.");
    else showToast("err", "Kayıt başarısız.");
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
      setProducts((prev) => prev.map((cat) => cat.id !== selCat ? cat : {
        ...cat,
        products: cat.products.map((p) => {
          if (p.id !== selProd) return p;
          const existing = p.images ?? (p.image ? [p.image] : []);
          return { ...p, images: [...existing, url], image: existing[0] ?? url };
        }),
      }));
      showToast("ok", "Görsel yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setProdImgLoading(false);
    if (prodImgRef.current) prodImgRef.current.value = "";
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroBgLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "hero");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateContent(["hero", "heroBg"], url);
      showToast("ok", "Arka plan görseli yüklendi.");
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setHeroBgLoading(false);
    if (heroBgRef.current) heroBgRef.current.value = "";
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

  const handleStepImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const idx = stepImgTargetIdx;
    setStepImgLoadingIdx(idx);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "kurumsal");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setContent((prev) => {
        if (!prev) return prev;
        const next = JSON.parse(JSON.stringify(prev)) as ContentData;
        const imgs = [...(next.dna.productionStepImages ?? ["", "", "", "", "", ""])];
        imgs[idx] = url;
        next.dna.productionStepImages = imgs;
        return next;
      });
      showToast("ok", `Adım ${idx + 1} görseli yüklendi.`);
    } else {
      showToast("err", "Yükleme başarısız.");
    }
    setStepImgLoadingIdx(null);
    if (stepImgRef.current) stepImgRef.current.value = "";
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

  const updateContent = (path: string[], value: string | number | null) => {
    if (!content) return;
    const next = JSON.parse(JSON.stringify(content)) as ContentData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = next;
    for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
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
            <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-lg">B</span>
            </div>
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

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "hero",     label: "Ana Sayfa",     icon: HiOutlineHome           },
    { id: "stats",    label: "İstatistikler", icon: HiOutlineChartBar       },
    { id: "sections", label: "Bölümler",      icon: HiOutlineTemplate       },
    { id: "products", label: "Ürünler",       icon: HiOutlineCube           },
    { id: "contact",  label: "İletişim",      icon: HiOutlinePhone          },
    { id: "dealers",  label: "Bayiler",       icon: HiOutlineLocationMarker },
    { id: "media",    label: "Medya",         icon: HiOutlinePhotograph     },
    { id: "documents", label: "Dökümanlar",    icon: HiOutlineDocumentText   },
    { id: "analytics", label: "Analytics",    icon: HiOutlineChartBar       },
  ];

  const handleSaveProductsTab = async () => {
    setSaving(true);
    setSavingProducts(true);
    const [r1, r2] = await Promise.all([
      fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) }),
      fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(products) }),
    ]);
    if (r1.ok && r2.ok) showToast("ok", "Ürünler kaydedildi.");
    else showToast("err", "Kayıt başarısız.");
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
          <div className="w-8 h-8 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <div>
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
        <aside className="w-52 flex-shrink-0 border-r border-white/8 p-4 flex flex-col gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                tab === t.id ? "bg-white/8 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-white/6">
            <button onClick={handleSave} disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#0c0c0e] font-bold py-2.5 rounded-xl text-sm disabled:opacity-60 hover:bg-white/90">
              {isSaving ? <HiOutlineRefresh size={14} className="animate-spin" /> : <HiOutlineSave size={14} />}
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
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
                      <Field label="Başlık Satır 2" value={content.hero.headline2} onChange={(v) => updateContent(["hero", "headline2"], v)} />
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
                      {content.hero.heroBg && (
                        <div className="relative rounded-xl overflow-hidden" style={{ height: 120 }}>
                          <img src={content.hero.heroBg} alt="Hero BG" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-end p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                            <span className="text-[10px] text-white/70 font-mono truncate max-w-full">{content.hero.heroBg}</span>
                          </div>
                        </div>
                      )}
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
                      {content.hero.heroBg && (
                        <button
                          onClick={() => updateContent(["hero", "heroBg"], "")}
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          Görseli kaldır
                        </button>
                      )}
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base font-bold mb-1">Ürünler</h2>
                      <p className="text-xs text-white/35">Kategori kartlarını ve ürün teknik özelliklerini buradan yönetin.</p>
                    </div>
                  </div>

                  {/* Sub-tab switcher */}
                  <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {(["cards", "specs"] as const).map((st) => (
                      <button key={st} onClick={() => setProdSubTab(st)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          background: prodSubTab === st ? "rgba(255,255,255,0.10)" : "transparent",
                          color: prodSubTab === st ? "white" : "rgba(255,255,255,0.40)",
                        }}
                      >
                        {st === "cards" ? "Kategori Kartları" : "Teknik Özellikler"}
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

                                {/* Slider image */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Slider Arka Plan Görseli</label>
                                  {meta.sliderImage && (
                                    <div className="relative rounded-xl overflow-hidden mb-2" style={{ height: 80 }}>
                                      <img src={meta.sliderImage} alt="Slider" className="w-full h-full object-cover" />
                                      <button
                                        onClick={() => updateCatMeta(catId, "sliderImage", "")}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white text-xs"
                                      >✕</button>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => { setCatSliderImgTarget(catId); setTimeout(() => catSliderImgRef.current?.click(), 50); }}
                                      disabled={catSliderImgLoading === catId}
                                      className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
                                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}
                                    >
                                      {catSliderImgLoading === catId ? (
                                        <div className="w-3 h-3 rounded-full border border-white/20 border-t-white/60 animate-spin" />
                                      ) : (
                                        <RiImageAddLine size={13} />
                                      )}
                                      Yükle
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-white/20 mt-1.5">Slider banner arka planına uygulanır. Önerilen: 1200×400 WebP/JPG.</p>
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

                  {/* ── Sub-tab: Teknik Özellikler ── */}
                  {prodSubTab === "specs" && (
                    <>
                      {products.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                          <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          {/* Category selector */}
                          <div className="w-44 flex-shrink-0 space-y-1">
                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-1">Kategori</p>
                            {products.map((cat) => (
                              <button key={cat.id} onClick={() => { setSelCat(cat.id); setSelProd(""); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                  selCat === cat.id ? "bg-white/10 text-white" : "text-white/45 hover:text-white/70 hover:bg-white/5"
                                }`}
                              >
                                {cat.name}
                              </button>
                            ))}
                          </div>

                          {/* Product selector + editor */}
                          <div className="flex-1 min-w-0">
                            {currentCat && (
                              <>
                                {/* Product tabs */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                  {currentCat.products.map((p) => (
                                    <div key={p.id} className="relative group/ptab">
                                      <button onClick={() => setSelProd(p.id)}
                                        className={`px-3 py-1.5 pr-7 rounded-lg text-xs font-medium border transition-all ${
                                          selProd === p.id
                                            ? "border-white/25 bg-white/10 text-white"
                                            : "border-white/8 text-white/40 hover:text-white/70 hover:bg-white/5"
                                        }`}
                                      >
                                        {p.name}
                                      </button>
                                      <button
                                        onClick={() => removeProduct(p.id)}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover/ptab:opacity-100"
                                        title="Ürünü sil"
                                      >
                                        <HiOutlineTrash size={11} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={addProduct}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 transition-all"
                                  >
                                    <HiOutlinePlus size={12} /> Ürün Ekle
                                  </button>
                                </div>

                                {!selProd && (
                                  <div className="text-center py-12 text-white/30 text-sm">
                                    Düzenlemek için yukarıdan bir ürün seçin.
                                  </div>
                                )}

                                {currentProd && (
                                  <div className="space-y-4">
                                    {/* Basic info */}
                                    <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                                      <p className="text-xs font-semibold text-white/50">Genel Bilgiler</p>
                                      <div className="grid grid-cols-2 gap-3">
                                        <Field label="Ürün Adı" value={currentProd.name} onChange={(v) => updateProd("name", v)} />
                                        <Field label="Alt Başlık" value={currentProd.subtitle} onChange={(v) => updateProd("subtitle", v)} />
                                      </div>
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
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── CONTACT ── */}
              {tab === "contact" && (
                <div className="max-w-xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">İletişim Bilgileri</h2>
                    <p className="text-xs text-white/35">İletişim sayfasında ve footer&apos;da görünen bilgiler.</p>
                  </div>
                  <div className="bg-white/3 border border-white/7 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Telefon" value={content.contact.phone} onChange={(v) => updateContent(["contact", "phone"], v)} />
                      <Field label="E-posta" value={content.contact.email} onChange={(v) => updateContent(["contact", "email"], v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Çalışma Günleri" value={content.contact.workingDays} onChange={(v) => updateContent(["contact", "workingDays"], v)} />
                      <Field label="Çalışma Saatleri" value={content.contact.workingHours} onChange={(v) => updateContent(["contact", "workingHours"], v)} />
                    </div>
                    <Field label="Adres (Şehir / Bölge)" value={content.contact.address} onChange={(v) => updateContent(["contact", "address"], v)} />
                    <Field label="Adres Alt Satır" value={content.contact.addressSub} onChange={(v) => updateContent(["contact", "addressSub"], v)} />
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
                    </div>
                  )}
                </div>
              )}

              {/* ── SECTIONS ── */}
              {tab === "sections" && (
                <div className="max-w-2xl space-y-3">
                  <div className="mb-5">
                    <h2 className="text-base font-bold mb-1">Bölüm Metinleri</h2>
                    <p className="text-xs text-white/35">Ana sayfadaki tüm bölümlerin başlık, alt başlık ve açıklama metinleri.</p>
                  </div>

                  {/* ── Öne Çıkan Ürünler ── */}
                  <div className="bg-white/3 border border-white/7 rounded-2xl overflow-hidden mb-1">
                    <div className="px-5 py-3.5 flex items-center gap-3 border-b border-white/6">
                      <HiOutlineStar size={14} className="text-white/50 flex-shrink-0" />
                      <span className="text-sm font-semibold text-white">Öne Çıkan Ürünler (Ana sayfa kartları)</span>
                    </div>
                    <div className="px-5 pb-5 pt-4 space-y-4">
                      <p className="text-xs text-white/30">Hangi ürünlerin öne çıkan bölümünde görüneceğini ve sırasını belirleyin.</p>
                      {content.featured?.map((item: FeaturedItem, fi: number) => {
                        const catOptions = products;
                        const prodOptions = products.find((c: CategoryData) => c.id === item.categoryId)?.products ?? [];
                        return (
                          <div key={fi} className="bg-white/4 border border-white/8 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-white/50">Kart {fi + 1}</span>
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
                    </div>
                  </div>

                  {/* Helper accordion wrapper */}
                  {(
                    [
                      {
                        id: "dna",
                        label: "Kurumsal Bölümü",
                        icon: HiOutlineHome,
                        content: (
                          <div className="space-y-4">
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

                            {/* Production step images */}
                            <div className="pt-2 border-t border-white/6 space-y-3">
                              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Üretim Adımı Görselleri</p>
                              <p className="text-[10px] text-white/25 leading-relaxed">Her adım için yuvarlak alanda görünecek küçük fotoğraf. Önerilen: 1:1 kare, min 128×128px.</p>
                              {["PCB Tasarımı", "Elektronik İmalat", "Yazılım", "Cihaz Tasarımı", "Test & Kalite", "Son Ürün 🇹🇷"].map((label, i) => {
                                const imgSrc = content.dna.productionStepImages?.[i] ?? "";
                                return (
                                  <div key={i} className="flex items-center gap-3 border-t border-white/5 pt-3">
                                    {/* Preview circle */}
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/12" style={{ background: "rgba(255,255,255,0.04)" }}>
                                      {imgSrc ? (
                                        <img src={imgSrc} alt={label} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-white/20 text-lg font-bold">{i + 1}</span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-semibold text-white/50 mb-1.5">{label}</p>
                                      <div className="flex gap-2">
                                        <input
                                          value={imgSrc}
                                          onChange={(e) => {
                                            setContent((prev) => {
                                              if (!prev) return prev;
                                              const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                              const imgs = [...(next.dna.productionStepImages ?? ["", "", "", "", "", ""])];
                                              imgs[i] = e.target.value;
                                              next.dna.productionStepImages = imgs;
                                              return next;
                                            });
                                          }}
                                          placeholder="Görsel URL veya /uploads/..."
                                          className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-white/22"
                                        />
                                        <button
                                          onClick={() => { setStepImgTargetIdx(i); setTimeout(() => stepImgRef.current?.click(), 0); }}
                                          disabled={stepImgLoadingIdx === i}
                                          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
                                        >
                                          {stepImgLoadingIdx === i ? (
                                            <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                                          ) : (
                                            <RiImageAddLine size={13} />
                                          )}
                                        </button>
                                        {imgSrc && (
                                          <button
                                            onClick={() => {
                                              setContent((prev) => {
                                                if (!prev) return prev;
                                                const next = JSON.parse(JSON.stringify(prev)) as ContentData;
                                                const imgs = [...(next.dna.productionStepImages ?? ["", "", "", "", "", ""])];
                                                imgs[i] = "";
                                                next.dna.productionStepImages = imgs;
                                                return next;
                                              });
                                            }}
                                            className="text-xs text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0 px-1"
                                          >✕</button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <input ref={stepImgRef} type="file" accept="image/*" className="hidden" onChange={handleStepImgUpload} />
                            </div>

                            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider pt-2">Öne Çıkan Kartlar (4 adet)</p>
                            {content.dna.highlights.map((h, i) => (
                              <div key={i} className="grid grid-cols-2 gap-3 border-t border-white/6 pt-3">
                                <Field label={`Kart ${i+1} Başlık`} value={h.title} onChange={(v) => updateDnaHighlight(i, "title", v)} />
                                <Field label={`Kart ${i+1} Açıklama`} value={h.desc} onChange={(v) => updateDnaHighlight(i, "desc", v)} />
                              </div>
                            ))}
                            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider pt-2">Teknoloji Kartları (4 adet)</p>
                            {content.dna.features.map((f, i) => (
                              <div key={i} className="border-t border-white/6 pt-3 space-y-2">
                                <Field label={`Özellik ${i+1} Başlık`} value={f.title} onChange={(v) => updateDnaFeature(i, "title", v)} />
                                <Field label={`Özellik ${i+1} Açıklama`} value={f.desc} onChange={(v) => updateDnaFeature(i, "desc", v)} multiline />
                              </div>
                            ))}
                          </div>
                        ),
                      },
                      {
                        id: "products",
                        label: "Ürünler Bölümü",
                        icon: HiOutlineCube,
                        content: (
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Bölüm Başlığı" value={content.products.heading}    onChange={(v) => updateContent(["products","heading"],    v)} />
                            <Field label="Alt Başlık"    value={content.products.subheading} onChange={(v) => updateContent(["products","subheading"], v)} />
                          </div>
                        ),
                      },
                      {
                        id: "dealer",
                        label: "Bayi Ağı Bölümü",
                        icon: HiOutlineLocationMarker,
                        content: (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Bölüm Etiketi"  value={content.dealer.sectionLabel} onChange={(v) => updateContent(["dealer","sectionLabel"], v)} />
                              <Field label="Başlık"         value={content.dealer.heading}      onChange={(v) => updateContent(["dealer","heading"],      v)} />
                            </div>
                            <Field label="Açıklama" value={content.dealer.description} onChange={(v) => updateContent(["dealer","description"], v)} multiline />
                            <Field label="Başvuru Metni" value={content.dealer.applyText}   onChange={(v) => updateContent(["dealer","applyText"],   v)} />
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="İstatistik: İl Sayısı"  value={content.dealer.statCities}  onChange={(v) => updateContent(["dealer","statCities"],  v)} />
                              <Field label="İstatistik: Bayi Sayısı" value={content.dealer.statDealers} onChange={(v) => updateContent(["dealer","statDealers"], v)} />
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: "reviews",
                        label: "Kullanıcı Yorumları",
                        icon: HiOutlineStar,
                        content: (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Başlık"     value={content.reviews.heading}    onChange={(v) => updateContent(["reviews","heading"],    v)} />
                              <Field label="Alt Başlık" value={content.reviews.subheading} onChange={(v) => updateContent(["reviews","subheading"], v)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Ortalama Puan" value={content.reviews.rating}      onChange={(v) => updateContent(["reviews","rating"],      v)} />
                              <Field label="Değerlendirme Sayısı" value={content.reviews.ratingCount} onChange={(v) => updateContent(["reviews","ratingCount"], v)} />
                            </div>
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
                        ),
                      },
                      {
                        id: "contactSec",
                        label: "İletişim Bölümü",
                        icon: HiOutlinePhone,
                        content: (
                          <div className="space-y-3">
                            <Field label="Bölüm Etiketi" value={content.contactSection.sectionLabel} onChange={(v) => updateContent(["contactSection","sectionLabel"], v)} />
                            <Field label="Başlık"        value={content.contactSection.heading}      onChange={(v) => updateContent(["contactSection","heading"],      v)} />
                            <Field label="Alt Açıklama"  value={content.contactSection.subheading}   onChange={(v) => updateContent(["contactSection","subheading"],   v)} multiline />
                          </div>
                        ),
                      },
                    ] as { id: string; label: string; icon: React.ElementType; content: React.ReactNode }[]
                  ).map(({ id, label, icon: Icon, content: inner }) => {
                    const isOpen = secOpen[id] !== false;
                    return (
                      <div key={id} className="bg-white/3 border border-white/7 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setSecOpen((s) => ({ ...s, [id]: !s[id] }))}
                          className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/3 transition-colors"
                        >
                          {isOpen ? <HiOutlineChevronDown size={14} className="text-white/40" /> : <HiOutlineChevronRight size={14} className="text-white/40" />}
                          <Icon size={14} className="text-white/50 flex-shrink-0" />
                          <span className="text-sm font-semibold text-white">{label}</span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 border-t border-white/6">
                            {inner}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── DEALERS ── */}
              {tab === "dealers" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold mb-1">Bayi Yönetimi</h2>
                    <p className="text-xs text-white/35">Şehirlere göre yetkili bayi bilgilerini düzenleyin.</p>
                  </div>

                  <div className="flex gap-4">
                    {/* City list */}
                    <div className="w-44 flex-shrink-0 space-y-1">
                      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-1">Şehir</p>
                      {CITY_LIST.map((city) => {
                        const count = dealers[city.id]?.dealers?.length ?? 0;
                        return (
                          <button key={city.id} onClick={() => setSelDealerCity(city.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                              selDealerCity === city.id ? "bg-white/10 text-white" : "text-white/45 hover:text-white/70 hover:bg-white/5"
                            }`}
                          >
                            <span>{city.label}</span>
                            {count > 0 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.50)" }}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Dealer editor for selected city */}
                    <div className="flex-1 min-w-0">
                      {(() => {
                        const cityLabel = CITY_LIST.find((c) => c.id === selDealerCity)?.label;
                        const cityDealers: Dealer[] = dealers[selDealerCity]?.dealers ?? [];

                        const updateDealer = (idx: number, field: keyof Dealer, val: string) => {
                          setDealers((prev) => {
                            const next = JSON.parse(JSON.stringify(prev)) as DealersData;
                            if (!next[selDealerCity]) next[selDealerCity] = { dealers: [] };
                            next[selDealerCity].dealers[idx] = { ...next[selDealerCity].dealers[idx], [field]: val };
                            return next;
                          });
                        };

                        const addDealer = () => {
                          setDealers((prev) => {
                            const next = JSON.parse(JSON.stringify(prev)) as DealersData;
                            if (!next[selDealerCity]) next[selDealerCity] = { dealers: [] };
                            next[selDealerCity].dealers.push({ name: "Yeni Bayi", address: "", phone: "" });
                            return next;
                          });
                        };

                        const removeDealer = (idx: number) => {
                          setDealers((prev) => {
                            const next = JSON.parse(JSON.stringify(prev)) as DealersData;
                            if (next[selDealerCity]?.dealers) {
                              next[selDealerCity].dealers.splice(idx, 1);
                            }
                            return next;
                          });
                        };

                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-white">{cityLabel} <span className="text-white/30 font-normal">— {cityDealers.length} bayi</span></p>
                              <button onClick={addDealer}
                                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                                <HiOutlinePlus size={12} /> Bayi Ekle
                              </button>
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
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Bayi Adı</label>
                                  <input value={dealer.name} onChange={(e) => updateDealer(idx, "name", e.target.value)}
                                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Adres</label>
                                  <input value={dealer.address} onChange={(e) => updateDealer(idx, "address", e.target.value)}
                                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Telefon</label>
                                  <input value={dealer.phone} onChange={(e) => updateDealer(idx, "phone", e.target.value)}
                                    placeholder="+90 (___) ___ __ __"
                                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ── MEDIA ── */}
              {tab === "media" && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h2 className="text-base font-bold mb-1">Medya Yükleme</h2>
                    <p className="text-xs text-white/35">
                      Görsel yükleyin (JPG, PNG, WebP, SVG). Yüklenen görseller Vercel Blob üzerinde saklanır; size bir URL döner.
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
                      { id: "stats",      label: "İstatistikler" },
                      { id: "dna",        label: "Kurumsal (DNA)" },
                      { id: "products",   label: "Ürün Kataloğu" },
                      { id: "featured",   label: "Öne Çıkan Ürünler" },
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
                              <div className="rounded-xl flex items-center justify-center"
                                style={{ height: 72, background: mode === "dark" ? "#111" : "#f0f0f0", border: "1px dashed rgba(255,255,255,0.12)" }}>
                                <span className="text-[10px] text-white/20">Logo yok</span>
                              </div>
                            )}
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
                          </div>
                        );
                      })}
                    </div>
                    <input ref={logoDarkRef}  type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "dark")} />
                    <input ref={logoLightRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "light")} />
                    <p className="text-[10px] text-white/20 mt-3">Kaydet butonuna basarak değişiklikleri uygulayın.</p>
                  </div>
                </div>
              )}

              {/* ── DOCUMENTS ── */}
              {tab === "documents" && <DocumentsPanel />}

              {/* ── ANALYTICS ── */}
              {tab === "analytics" && <AnalyticsPanel />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Documents Panel Component
// ─────────────────────────────────────────────────────────────────────────────

type DocEntry = {
  id: string; title: string; description: string; category: string;
  url: string; filename: string; size: string; lang: string; date: string; visible: boolean;
};

const DOC_CATEGORIES = [
  { id: "price-list",   label: "Fiyat Listesi" },
  { id: "catalog",      label: "Katalog" },
  { id: "installation", label: "Kurulum Kılavuzu" },
  { id: "certificate",  label: "Sertifikalar" },
  { id: "technical",    label: "Teknik Döküman" },
  { id: "other",        label: "Diğer" },
];

const DOC_LANGS = [
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
];

function DocumentsPanel() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [editDoc, setEditDoc] = useState<DocEntry | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    fetch("/api/admin/documents")
      .then(r => r.json())
      .then(d => setDocs(d.documents ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async (updated: DocEntry[]) => {
    setSaving(true);
    await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documents: updated }),
    });
    setSaving(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "documents");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      const newDoc: DocEntry = {
        id: `doc-${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        description: "",
        category: "other",
        url,
        filename: file.name,
        size: sizeStr,
        lang: "tr",
        date: new Date().toISOString().slice(0, 10),
        visible: true,
      };
      setEditDoc(newDoc);
      setShowModal(true);
    }
    setUploadLoading(false);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  const saveDoc = async (doc: DocEntry) => {
    const exists = docs.find(d => d.id === doc.id);
    const updated = exists ? docs.map(d => d.id === doc.id ? doc : d) : [...docs, doc];
    setDocs(updated);
    await save(updated);
    setShowModal(false);
    setEditDoc(null);
  };

  const deleteDoc = async (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    await save(updated);
  };

  const toggleVisible = async (id: string) => {
    const updated = docs.map(d => d.id === id ? { ...d, visible: !d.visible } : d);
    setDocs(updated);
    await save(updated);
  };

  const CAT_COLORS: Record<string, string> = {
    "price-list": "#F59E0B", "catalog": "#3B82F6", "installation": "#10B981",
    "certificate": "#8B5CF6", "technical": "#EF4444", "other": "#6B7280",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Dökümanlar</h2>
          <p className="text-xs text-white/35 mt-0.5">{docs.length} döküman · <a href="/documents" target="_blank" className="text-blue-400 hover:underline">/documents</a> sayfasında görünür</p>
        </div>
        <button
          onClick={() => uploadRef.current?.click()}
          disabled={uploadLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#3B82F6", color: "#fff", opacity: uploadLoading ? 0.6 : 1 }}
        >
          {uploadLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <RiImageAddLine size={15} />
          )}
          Döküman Yükle
        </button>
        <input ref={uploadRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleUpload} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      )}

      {!loading && docs.length === 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-12 text-center">
          <p className="text-sm text-white/30">Henüz döküman yok. Yukarıdan PDF yükleyin.</p>
        </div>
      )}

      {!loading && docs.length > 0 && (
        <div className="space-y-2">
          {saving && <p className="text-xs text-white/30 text-right">Kaydediliyor…</p>}
          {docs.map((doc) => {
            const accent = CAT_COLORS[doc.category] ?? "#6B7280";
            const catLabel = DOC_CATEGORIES.find(c => c.id === doc.category)?.label ?? "Diğer";
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: doc.visible ? 1 : 0.45,
                }}
              >
                {/* Color dot */}
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: accent }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate max-w-xs">{doc.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                      style={{ background: `${accent}18`, color: accent }}>{catLabel}</span>
                    <span className="text-[10px] text-white/30 font-mono">{doc.lang?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {doc.size && <span className="text-[10px] text-white/25">{doc.size}</span>}
                    {doc.date && <span className="text-[10px] text-white/25">{doc.date}</span>}
                    {doc.description && <span className="text-[10px] text-white/30 truncate max-w-sm">{doc.description}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors text-xs"
                    title="Önizle">↗</a>
                  <button onClick={() => toggleVisible(doc.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors text-xs"
                    title={doc.visible ? "Gizle" : "Göster"}>
                    {doc.visible ? "👁" : "🙈"}
                  </button>
                  <button onClick={() => { setEditDoc({ ...doc }); setShowModal(true); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                    title="Düzenle">
                    <HiOutlineStar size={13} style={{ transform: "none" }} />
                  </button>
                  <button onClick={() => deleteDoc(doc.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/40 hover:text-red-400 transition-colors"
                    title="Sil">
                    <HiOutlineTrash size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      {showModal && editDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setEditDoc(null); } }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a1a1e] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Döküman Bilgileri</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Başlık *</label>
                <input value={editDoc.title}
                  onChange={e => setEditDoc({ ...editDoc, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Açıklama</label>
                <textarea value={editDoc.description}
                  onChange={e => setEditDoc({ ...editDoc, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Kategori</label>
                  <select value={editDoc.category}
                    onChange={e => setEditDoc({ ...editDoc, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22">
                    {DOC_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Dil</label>
                  <select value={editDoc.lang}
                    onChange={e => setEditDoc({ ...editDoc, lang: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22">
                    {DOC_LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Tarih</label>
                  <input type="date" value={editDoc.date}
                    onChange={e => setEditDoc({ ...editDoc, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setEditDoc({ ...editDoc, visible: !editDoc.visible })}
                      className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
                      style={{ background: editDoc.visible ? "#3B82F6" : "rgba(255,255,255,0.10)" }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: editDoc.visible ? "calc(100% - 18px)" : "2px" }} />
                    </div>
                    <span className="text-xs text-white/50">Yayında</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => { setShowModal(false); setEditDoc(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/40 border border-white/8 hover:border-white/15 transition-colors">
                İptal
              </button>
              <button onClick={() => saveDoc(editDoc)} disabled={!editDoc.title}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40"
                style={{ background: "#3B82F6" }}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Panel Component
// ─────────────────────────────────────────────────────────────────────────────

type AnalyticsMetrics = {
  sessions: number; users: number; pageViews: number;
  avgSessionDuration: number; bounceRate: number;
};
type TrendRow  = { date: string; sessions: number; users: number };
type PageRow   = { path: string; views: number; avgTime: number };
type ChannelRow= { channel: string; sessions: number; users: number };
type EventRow  = { name: string; count: number };
type AnalyticsData = {
  metrics: AnalyticsMetrics;
  trend: TrendRow[];
  pages: PageRow[];
  channels: ChannelRow[];
  events: EventRow[];
};

function AnalyticsPanel() {
  const [range, setRange] = useState<"7" | "28" | "90">("28");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/analytics?range=${range}`)
      .then(r => r.json())
      .then((d) => {
        if (d.error === "GA4_NOT_CONFIGURED") { setError("not_configured"); return; }
        if (d.error) { setError("api_error"); return; }
        setData(d);
      })
      .catch(() => setError("api_error"))
      .finally(() => setLoading(false));
  }, [range]);

  const fmtDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return m > 0 ? `${m}d ${s}s` : `${s}s`;
  };

  const fmtDate = (d: string) =>
    `${d.slice(6, 8)}/${d.slice(4, 6)}`;

  const BLUE = "#3B82F6";

  // ── Not configured banner ──────────────────────────────────────────────
  if (error === "not_configured") {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-base font-bold mb-1">Analytics</h2>
          <p className="text-xs text-white/35">Google Analytics 4 verilerini buradan takip edin.</p>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/8 p-6 space-y-4">
          <p className="text-sm font-bold text-amber-400">Kurulum Gerekiyor</p>
          <p className="text-xs text-white/50 leading-relaxed">
            GA4 verilerini görmek için bir <strong className="text-white/70">Google Cloud Service Account</strong> oluşturup aşağıdaki ortam değişkenlerini
            <code className="text-white/60 mx-1 bg-white/8 px-1 rounded">.env.local</code> dosyanıza eklemeniz gerekiyor.
          </p>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-white/60 space-y-1">
            <p><span className="text-blue-400">GA4_PROPERTY_ID</span>=<span className="text-green-400">123456789</span></p>
            <p><span className="text-blue-400">GA4_CLIENT_EMAIL</span>=<span className="text-green-400">hesap@proje.iam.gserviceaccount.com</span></p>
            <p><span className="text-blue-400">GA4_PRIVATE_KEY</span>=<span className="text-green-400">"-----BEGIN PRIVATE KEY-----\n..."</span></p>
          </div>
          <div className="space-y-2 text-xs text-white/40 leading-relaxed">
            <p><span className="text-white/60 font-semibold">Adım 1:</span> Google Cloud Console → IAM → Service Accounts → Yeni hesap oluştur</p>
            <p><span className="text-white/60 font-semibold">Adım 2:</span> Hesaba JSON anahtar oluştur, indiri, içinden değerleri kopyala</p>
            <p><span className="text-white/60 font-semibold">Adım 3:</span> analytics.google.com → Yönetici → Hesap Erişim Yönetimi → Service Account e-postasını <strong className="text-white/60">Görüntüleyici</strong> olarak ekle</p>
            <p><span className="text-white/60 font-semibold">Adım 4:</span> GA4 Property ID: Analytics Yönetici → Mülk Ayrıntıları → Mülk Kimliği (sadece rakamlar)</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + range picker */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Analytics</h2>
          <p className="text-xs text-white/35 mt-0.5">Google Analytics 4 — gerçek zamanlı veriler</p>
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
          {(["7", "28", "90"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: range === r ? BLUE : "transparent", color: range === r ? "#fff" : "rgba(255,255,255,0.40)" }}
            >
              {r === "7" ? "7 gün" : r === "28" ? "28 gün" : "90 gün"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      )}

      {error === "api_error" && !loading && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-5 text-sm text-red-400">
          GA4 API&apos;ye bağlanılamadı. Service account izinlerini ve ortam değişkenlerini kontrol edin.
        </div>
      )}

      {data && !loading && (
        <>
          {/* ── Overview cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: "Kullanıcılar",    value: data.metrics.users.toLocaleString("tr"),       sub: "toplam" },
              { label: "Oturumlar",       value: data.metrics.sessions.toLocaleString("tr"),    sub: "toplam" },
              { label: "Sayfa Görüntülemesi", value: data.metrics.pageViews.toLocaleString("tr"), sub: "toplam" },
              { label: "Ort. Süre",       value: fmtDuration(data.metrics.avgSessionDuration),  sub: "oturum başı" },
              { label: "Hemen Çıkma",     value: `%${(data.metrics.bounceRate * 100).toFixed(1)}`, sub: "oran" },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-2xl font-black text-white">{card.value}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Trend chart ── */}
          {data.trend.length > 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/50 mb-4">Günlük Oturum Trendi</p>
              <TrendChart data={data.trend} fmtDate={fmtDate} color={BLUE} />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            {/* ── Top pages ── */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/50 mb-4">En Çok Ziyaret Edilen Sayfalar</p>
              <div className="space-y-2">
                {data.pages.slice(0, 8).map((page, i) => {
                  const maxViews = data.pages[0]?.views ?? 1;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60 truncate max-w-[200px]">{page.path || "/"}</span>
                        <span className="text-xs font-semibold text-white/80 flex-shrink-0 ml-2">{page.views.toLocaleString("tr")}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(page.views / maxViews) * 100}%`, background: BLUE, opacity: 0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Channels ── */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/50 mb-4">Trafik Kaynakları</p>
              <div className="space-y-2">
                {data.channels.map((ch, i) => {
                  const maxSessions = data.channels[0]?.sessions ?? 1;
                  const colors = [BLUE, "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">{ch.channel || "Diğer"}</span>
                        <span className="text-xs font-semibold text-white/80">{ch.sessions.toLocaleString("tr")}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(ch.sessions / maxSessions) * 100}%`, background: colors[i % colors.length], opacity: 0.75 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Key events ── */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-xs font-bold text-white/50 mb-4">Önemli Etkinlikler</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.events
                .filter(e => !["session_start","first_visit","page_view","user_engagement","scroll"].includes(e.name))
                .slice(0, 8)
                .map((ev, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2.5">
                    <p className="text-[10px] text-white/35 font-mono mb-1 truncate">{ev.name}</p>
                    <p className="text-xl font-black text-white">{ev.count.toLocaleString("tr")}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Sparkline trend chart (SVG) ────────────────────────────────────────────
function TrendChart({ data, fmtDate, color }: { data: TrendRow[]; fmtDate: (d: string) => string; color: string }) {
  const W = 800, H = 140, PAD = 12;
  const maxVal = Math.max(...data.map(d => d.sessions), 1);
  const pts = data.map((d, i) => {
    const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - (d.sessions / maxVal) * (H - PAD * 2);
    return { x, y, d };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0]?.x},${H - PAD} ` + pts.map(p => `L${p.x},${p.y}`).join(" ") + ` L${pts[pts.length-1]?.x},${H - PAD} Z`;

  // Show max ~10 labels to avoid overlap
  const step = Math.ceil(data.length / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={PAD} y1={H - PAD - f * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - f * (H - PAD * 2)}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Area fill */}
      <path d={area} fill="url(#areaGrad)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          {i % step === 0 && (
            <>
              <circle cx={p.x} cy={p.y} r="3" fill={color} />
              <text x={p.x} y={H - 2} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.30)">{fmtDate(p.d.date)}</text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
