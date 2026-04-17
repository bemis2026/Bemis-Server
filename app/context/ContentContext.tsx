"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useLanguage, type Lang } from "./LanguageContext";

export type StatItem = {
  value: number; suffix: string; prefix?: string; label: string; description: string;
};

export type CategoryMeta = {
  name: string; subtitle: string; modelCount: number; badge: string | null; comingSoon: boolean; image?: string; sliderImage?: string;
};

export type FeaturedItem = {
  categoryId: string; productId: string; badge: string; highlight: string; visible: boolean;
};

export type DnaItem = { title: string; desc: string };
export type TechFeature = { title: string; desc: string; accent: string };

export type ReviewItem = {
  platform: string; platformColor: string; rating: number;
  author: string; date: string; product: string; text: string;
};

export type HeroLayout = {
  logo:   { x: number; y: number };
  text:   { x: number; y: number };
  button: { x: number; y: number };
};

export type SiteContent = {
  hero: {
    badge: string; headline1: string; headline2: string; headline3: string;
    subtitle: string; ctaPrimary: string; ctaSecondary: string; heroBg: string;
    layout: HeroLayout;
  };
  stats: StatItem[];
  categories: Record<string, CategoryMeta>;
  featured: FeaturedItem[];
  contact: {
    phone: string; email: string; address: string; addressSub: string;
    workingHours: string; workingDays: string;
  };
  company: {
    foundedYear: string; exportCountries: string; productCount: string; facilitySize: string;
  };
  social: { linkedin: string; instagram: string; twitter: string };
  dna: {
    sectionLabel: string; sectionHeading: string;
    brandHeading: string; brandPara1: string; brandPara2: string;
    quote: string; quoteAttr: string;
    yearLabel: string; yearSub: string;
    highlights: DnaItem[];
    features: DnaItem[];
    factoryImage?: string;
    factoryVideo?: string;
    productionStepImages?: string[];
    ctaLabel: string;
  };
  products: { heading: string; subheading: string; sectionLabel: string; allProductsLabel: string; viewLabel: string };
  dealer: {
    sectionLabel: string; heading: string; description: string;
    applyText: string; statCities: string; statDealers: string;
    findDealerTitle: string; contactBtnLabel: string;
    citiesLabel: string; activeDealersLabel: string;
    mapHint: string; mapTitle: string;
  };
  reviews: {
    heading: string; subheading: string; rating: string; ratingCount: string;
    items: ReviewItem[];
    sectionLabel: string; ratingLabel: string; platformsPrefix: string; ratingCountSuffix: string;
  };
  contactSection: { sectionLabel: string; heading: string; subheading: string };
  featuredSection: { sectionLabel: string; heading: string; subheading: string; ctaLabel: string };
  navbar: { ctaLabel: string; links: { label: string; href: string }[] };
  footer: {
    description: string; followLabel: string; copyright: string;
    rightsLabel: string; tagline: string;
    b2bText: string; b2bLinkText: string; b2bSuffix: string;
  };
  technology: {
    sectionLabel: string;
    heading: string;
    features: TechFeature[];
    certs: string[];
  };
  calculator: {
    sectionLabel: string;
    heading: string;
    subheading: string;
    tabCharge: string;
    tabSavings: string;
    chargeSimLabel: string;
  };
  sectionOrder: string[];
  textStyles: Record<string, { color?: string; fontSize?: string }>;
  sectionBgs: Record<string, string>;
  logos: { dark: string; light: string };
};

const DEFAULT_LAYOUT: HeroLayout = {
  logo:   { x: 4, y: 12 },
  text:   { x: 4, y: 36 },
  button: { x: 4, y: 82 },
};

export const DEFAULT_SECTION_ORDER = [
  "dna", "stats", "products", "featured", "dealer", "reviews", "calculator", "contact"
];

const defaultContent: SiteContent = {
  hero: {
    badge: "Yerli Üretim · Bursa · 1994",
    headline1: "Türkiye'nin", headline2: "Şarj Sistemleri", headline3: "Üreticisi",
    subtitle: "Evinizden iş yerinize, otopark çözümlerinden sahaya kadar — IP65 sertifikalı AC şarj üniteleri, kablolar ve aksesuarlarla elektrikli araç deneyimini kolaylaştırıyoruz.",
    ctaPrimary: "Ürün Kataloğu", ctaSecondary: "Bayi Bul", heroBg: "",
    layout: DEFAULT_LAYOUT,
  },
  stats: [
    { value: 30,   suffix: "+", label: "Yıl Deneyim",   description: "1994'ten bu yana"        },
    { value: 6000, suffix: "+", label: "Ürün Çeşidi",   description: "Geniş ürün yelpazesi"    },
    { value: 60,   suffix: "+", label: "Ülke İhracat",  description: "Global pazar erişimi"    },
    { value: 65, prefix: "IP", suffix: "", label: "Koruma Sınıfı", description: "Uluslararası standartlar" },
  ],
  categories: {
    "wallbox":           { name: "AC Wallbox",               subtitle: "Duvar Tipi Şarj İstasyonu",                             modelCount: 3, badge: "En Çok Satan", comingSoon: false },
    "portable":          { name: "AC Mobile Chargers",       subtitle: "Taşınabilir Şarj Cihazları",                            modelCount: 2, badge: "Yeni",         comingSoon: false },
    "cables":            { name: "AC Şarj Kabloları",        subtitle: "Type 2 · Mod 2 & Mod 3",                                modelCount: 4, badge: null,           comingSoon: false },
    "v2l-c2l":           { name: "V2L / C2L Adaptörler",     subtitle: "Vehicle-to-Load & Charger-to-Load",                     modelCount: 3, badge: "İnovatif",     comingSoon: false },
    "converters":        { name: "Uzatma & Kombinasyon",     subtitle: "Uzatma Kabloları, Dönüştürücüler & Kombinasyon Kutuları",modelCount: 4, badge: null,           comingSoon: false },
    "charger-equipment": { name: "Şarj Ünitesi Ekipmanları", subtitle: "Type 2 Soket, Holster & Montaj Ekipmanları",            modelCount: 5, badge: null,           comingSoon: false },
    "accessories":       { name: "Aksesuarlar",              subtitle: "V2L/C2L, Montaj & Diğer",                               modelCount: 4, badge: null,           comingSoon: false },
    "dc-units":          { name: "DC Şarj Üniteleri",        subtitle: "Hızlı DC Şarj İstasyonları",                            modelCount: 0, badge: "Yakında",      comingSoon: true  },
  },
  featured: [
    { categoryId: "wallbox",  productId: "wallbox-22kw", badge: "En Çok Tercih Edilen", highlight: "22 kW · IP65 · OCPP 2.0 · Dinamik yük dengeleme.",        visible: true },
    { categoryId: "portable", productId: "portable-7kw", badge: "Plug & Play",          highlight: "6A–32A ayarlanabilir. Kurulum gerektirmez.",                visible: true },
    { categoryId: "cables",   productId: "dc-cable",     badge: "Profesyonel DC",       highlight: "350 kW · CCS2 · CHAdeMO · Aktif su soğutmalı 500A model.", visible: true },
  ],
  contact: {
    phone: "+90 (224) 000 00 00", email: "info@bemisevcharge.com",
    address: "Bursa Organize Sanayi Bölgesi", addressSub: "Nilüfer / Bursa, Türkiye",
    workingHours: "08:30 — 17:30", workingDays: "Pazartesi — Cuma",
  },
  company: {
    foundedYear: "1994", exportCountries: "60+", productCount: "6000+", facilitySize: "11.000 m²",
  },
  social: { linkedin: "", instagram: "", twitter: "" },
  dna: {
    sectionLabel: "Kurumsal",
    sectionHeading: "Üretimden yazılıma — her şey bizden",
    brandHeading: "Bemis kalitesiyle\nYerli EV şarj çözümleri",
    brandPara1: "1994 yılında Bursa'da kurulan Bemis Teknik Elektrik A.Ş., üç dekadı aşan tecrübesiyle Türkiye'nin önde gelen elektrik ekipmanları üreticilerinden biri haline geldi. Bemis E-V Charge, bu köklü altyapının üzerine inşa edilmiş EV şarj alt markamızdır.",
    brandPara2: "Bursa OSB'deki tesisimizde elektronik kart tasarımından yazılıma, kablo üretiminden son montaja kadar her aşamayı kendimiz gerçekleştiriyoruz. 60'ı aşkın ülkeye ihraç ettiğimiz ürünler, yerli mühendisliğin küresel arenada nasıl yarışabileceğini kanıtlıyor.",
    ctaLabel: "Bemis Dünyasını Keşfet",
    quote: "Kalite, saygının ifadesidir.",
    quoteAttr: "Bemis E-V Charge Ekibi · Bursa OSB, Türkiye",
    yearLabel: "1994",
    yearSub: "Bursa · Türkiye · Yerli Üretim",
    highlights: [
      { title: "30+ Yıl Deneyim",    desc: "1994'ten bu yana kesintisiz üretim kalitesi."      },
      { title: "Sertifikalı Kalite",  desc: "CE, IP65 ve uluslararası EV şarj standartları."    },
      { title: "60+ Ülke İhracatı",   desc: "Türk mühendisliğini dünyaya taşıyoruz."            },
      { title: "Temiz Mobilite",      desc: "Sürdürülebilir geleceğe katkı, her şarjda."        },
    ],
    features: [
      { title: "Akıllı Şarj Yönetimi",   desc: "OCPP 1.6 / 2.0 protokolü, dinamik yük dengeleme ve bulut tabanlı uzaktan yönetim."                                },
      { title: "Yerli Üretim Kalitesi",   desc: "Bursa OSB tesisimizde IP65, CE ve ISO 9001 standartlarında üretim. Yazılımdan elektroniğe tam yerli."              },
      { title: "Evrensel Uyumluluk",      desc: "Type 2, CCS, CHAdeMO — tüm EV markalarıyla uyumlu, IEC 61851 & IEC 62196 sertifikalı."                            },
      { title: "Sürdürülebilir Tasarım",  desc: "-40°C / +55°C çalışma aralığı, 100.000+ saat ömür. Uzun ömürlü, az atık."                                        },
    ],
  },
  products: {
    heading: "EV Şarj Çözümleri",
    subheading: "İhtiyacınıza uygun şarj çözümünü keşfedin",
    sectionLabel: "Ürün Kataloğu",
    allProductsLabel: "Tüm Ürünler",
    viewLabel: "İncele",
  },
  dealer: {
    sectionLabel: "Yetkili Satış Ağı",
    heading: "Türkiye'nin Her Yerinde",
    description: "Türkiye genelinde yetkili bayilerimizi haritadan seçin veya iletişime geçin.",
    applyText: "Bayi ağımıza katılmak ister misiniz?",
    statCities: "81",
    statDealers: "500+",
    findDealerTitle: "Bayi Bul",
    contactBtnLabel: "İletişime Geç",
    citiesLabel: "İlde Bayi",
    activeDealersLabel: "Aktif Bayi",
    mapHint: "Haritada bir bölgeye tıklayın veya üzerine gelin",
    mapTitle: "Türkiye Yetkili Bayi Haritası",
  },
  reviews: {
    sectionLabel: "Kullanıcı Yorumları",
    heading: "Kullanıcılar Ne Diyor?",
    subheading: "Trendyol ve HepsiBurada'dan gerçek kullanıcı deneyimleri",
    ratingLabel: "ortalama puan",
    platformsPrefix: "Trendyol ve HepsiBurada'da",
    ratingCountSuffix: "değerlendirme",
    rating: "4.9",
    ratingCount: "500+",
    items: [
      { platform: "Trendyol",    platformColor: "#F27A1A", rating: 5, author: "Mehmet K.", date: "Mart 2025",    product: "AC Wallbox 7kW",            text: "3 aydır kullanıyorum, montajı çok kolay oldu. Günlük kullanımda sıfır sorun. Türk malı kalitesini hissediyorsunuz, yapım kalitesi çok iyi. Kesinlikle tavsiye ederim." },
      { platform: "HepsiBurada", platformColor: "#FF6000", rating: 5, author: "Ayşe T.",   date: "Şubat 2025",  product: "Type 2 AC Şarj Kablosu 7m", text: "Kablo kalitesi gerçekten mükemmel. Type 2 konnektör araçla mükemmel uyum sağladı, fişleme ve çıkarma çok akıcı. 7 metrelik uzunluk garaj kullanımında ideal." },
      { platform: "Trendyol",    platformColor: "#F27A1A", rating: 5, author: "Serkan D.", date: "Ocak 2025",   product: "Taşınabilir Şarj Cihazı",   text: "Tatil seyahatlerinde büyük kolaylık. Standart prize takıp şarj başlıyor. Seyahatte yanımdan hiç ayırmıyorum, acil durumlarda da kullanıyorum. Çok pratik!" },
      { platform: "HepsiBurada", platformColor: "#FF6000", rating: 5, author: "Emre Y.",   date: "Ocak 2025",   product: "AC Wallbox 22kW",            text: "İş yerimizin açık otoparkında kullanıyoruz. IP65 koruma yağmurda bile mükemmel çalışıyor. Bir kış geçirdik hiçbir sorun yaşamadık. Yerli üretim güven veriyor." },
      { platform: "Trendyol",    platformColor: "#F27A1A", rating: 5, author: "Özlem B.",  date: "Aralık 2024", product: "V2L Adaptör",                text: "Kamp seyahatinde araçtan güç almak müthiş. Adaptör kaliteli ve güvenli çalışıyor. Laptop, ışıklar, hatta küçük ısıtıcıyı çalıştırabildim. Çok markalı uyumluluk harika." },
      { platform: "HepsiBurada", platformColor: "#FF6000", rating: 5, author: "Can M.",    date: "Kasım 2024",  product: "DC Hızlı Şarj Kablosu",     text: "CCS bağlantısı mükemmel çalışıyor. Kablo esnek, kıvırma ve açmada zorlanmıyor. Bağlantı kalitesi üstün, yüksek akımda da ısınma yok. Piyasadaki en iyi seçenek." },
    ],
  },
  contactSection: {
    sectionLabel: "İletişim",
    heading: "Bize Ulaşın",
    subheading: "Ürünlerimiz, bayilik başvurusu, kurumsal satış veya iş ortaklıkları hakkında bizimle iletişime geçin.",
  },
  featuredSection: {
    sectionLabel: "Öne Çıkan Ürünler",
    heading: "En Çok Tercih Edilenler",
    subheading: "Müşterilerimizin güvendiği, en çok sipariş verilen ürünlerimiz",
    ctaLabel: "Ürünü İncele",
  },
  navbar: {
    ctaLabel: "Bize Ulaşın",
    links: [
      { label: "Ana Sayfa",   href: "#hero"       },
      { label: "Kurumsal",    href: "#dna"        },
      { label: "Ürünler",     href: "#products"   },
      { label: "Hesaplayıcı", href: "#calculator" },
      { label: "Bayi Ağı",    href: "#dealer"     },
      { label: "İletişim",    href: "#contact"    },
    ],
  },
  footer: {
    description: "Bemis Teknik Elektrik A.Ş. bünyesindeki EV şarj ekipmanları markamız. 1994'ten bu yana Türkiye'den dünyaya kaliteli elektrik ekipmanı.",
    followLabel: "Bizi takip edin:",
    copyright: "© 2026 Bemis Teknik Elektrik A.Ş.",
    rightsLabel: "Tüm hakları saklıdır.",
    tagline: "Yerli Üretim, Küresel Kalite",
    b2bText: "Üreticiler ve OEM çözümleri için",
    b2bLinkText: "profesyonel ürün sayfamızı",
    b2bSuffix: "ziyaret edin.",
  },
  technology: {
    sectionLabel: "Neden Bemis?",
    heading: "Üretimden yazılıma — her şey yerli",
    features: [
      { title: "Akıllı Şarj Yönetimi",  desc: "OCPP 1.6 / 2.0 protokolü, dinamik yük dengeleme ve bulut tabanlı uzaktan yönetim.", accent: "#3B82F6" },
      { title: "Yerli Üretim Kalitesi",  desc: "Bursa OSB tesisimizde IP65, CE ve ISO 9001 standartlarında üretim. Yazılımdan elektroniğe tam yerli.", accent: "#10B981" },
      { title: "Evrensel Uyumluluk",     desc: "Type 2, CCS, CHAdeMO — tüm EV markalarıyla uyumlu, IEC 61851 & IEC 62196 sertifikalı.", accent: "#F59E0B" },
      { title: "Sürdürülebilir Tasarım", desc: "-40°C / +55°C çalışma aralığı, 100.000+ saat ömür. Uzun ömürlü, az atık.", accent: "#818CF8" },
    ],
    certs: ["CE", "IP65", "IEC 61851", "IEC 62196", "OCPP 2.0", "ISO 9001", "TSE"],
  },
  calculator: {
    sectionLabel: "Hesaplayıcı",
    heading: "Şarj Süresi Hesaplayıcı",
    subheading: "Araç seçin veya manuel değer girin — şarj sürenizi ve yakıt tasarrufunuzu hesaplayın",
    tabCharge: "Şarj Süresi",
    tabSavings: "Tasarruf Analizi",
    chargeSimLabel: "Şarj Simülasyonu",
  },
  sectionOrder: DEFAULT_SECTION_ORDER,
  textStyles: {},
  sectionBgs: {},
  logos: { dark: "", light: "" },
};

// ── path helpers ──────────────────────────────────────────────────────────────

function setByPath(obj: any, path: string, value: string): any {
  const keys = path.split(".");
  if (keys.length === 1) return { ...obj, [keys[0]]: value };
  const key = keys[0];
  if (Array.isArray(obj[key])) {
    const idx = parseInt(keys[1]);
    const subRest = keys.slice(2).join(".");
    const newArr = [...obj[key]];
    newArr[idx] = subRest ? setByPath(newArr[idx], subRest, value) : value;
    return { ...obj, [key]: newArr };
  }
  return { ...obj, [key]: setByPath(obj[key] ?? {}, keys.slice(1).join("."), value) };
}

export function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((cur, key) => {
    if (cur == null) return undefined;
    if (Array.isArray(cur)) return cur[parseInt(key)];
    return cur[key];
  }, obj);
}

// ── history state ─────────────────────────────────────────────────────────────

type HistoryState = {
  past: SiteContent[];
  present: SiteContent;
  future: SiteContent[];
};

// ── context type ──────────────────────────────────────────────────────────────

type ContentContextType = SiteContent & {
  refreshContent: () => void;
  liveUpdate: (path: string, value: string) => void;
  saveContent: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reorderSections: (from: number, to: number) => void;
  updateTextStyle: (field: string, prop: "color" | "fontSize", value: string) => void;
  lang: Lang;
  contentLoading: boolean;
};

const ContentContext = createContext<ContentContextType>({
  ...defaultContent,
  refreshContent: () => {},
  liveUpdate: () => {},
  saveContent: async () => {},
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
  reorderSections: () => {},
  updateTextStyle: () => {},
  lang: "tr",
  contentLoading: false,
});

export function useContent() { return useContext(ContentContext); }

// ── provider ──────────────────────────────────────────────────────────────────

export function ContentProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [hist, setHist] = useState<HistoryState>({
    past: [], present: defaultContent, future: [],
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [contentLoading, setContentLoading] = useState(false);

  const content = hist.present;

  const refreshContent = useCallback(() => setRefreshKey(k => k + 1), []);

  const liveUpdate = useCallback((path: string, value: string) => {
    setHist(h => ({
      past: [...h.past.slice(-49), h.present],
      present: setByPath(h.present, path, value) as SiteContent,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHist(h => {
      if (h.past.length === 0) return h;
      return {
        past: h.past.slice(0, -1),
        present: h.past[h.past.length - 1],
        future: [h.present, ...h.future.slice(0, 49)],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHist(h => {
      if (h.future.length === 0) return h;
      return {
        past: [...h.past.slice(-49), h.present],
        present: h.future[0],
        future: h.future.slice(1),
      };
    });
  }, []);

  const updateTextStyle = useCallback((field: string, prop: "color" | "fontSize", value: string) => {
    setHist(h => {
      const styles = h.present.textStyles ?? {};
      const fieldStyle = styles[field] ?? {};
      const updated = { ...fieldStyle, [prop]: value || undefined };
      return {
        past: [...h.past.slice(-49), h.present],
        present: { ...h.present, textStyles: { ...styles, [field]: updated } },
        future: [],
      };
    });
  }, []);

  const reorderSections = useCallback((from: number, to: number) => {
    setHist(h => {
      const order = [...h.present.sectionOrder];
      const [moved] = order.splice(from, 1);
      order.splice(to, 0, moved);
      return {
        past: [...h.past.slice(-49), h.present],
        present: { ...h.present, sectionOrder: order },
        future: [],
      };
    });
  }, []);

  const saveContent = useCallback(async () => {
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hist.present),
    });
  }, [hist.present]);

  // ── Admin preview: receive postMessage from parent admin panel ──────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      // Scroll to section
      if (e.data?.type === "BEMIS_PREVIEW_SCROLL" && e.data?.anchor) {
        const el = document.getElementById(e.data.anchor as string);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (e.data?.type !== "BEMIS_PREVIEW" || !e.data?.content) return;
      const data = e.data.content;
      const loaded: SiteContent = {
        ...defaultContent, ...data,
        hero: { ...defaultContent.hero, ...data.hero, layout: { ...DEFAULT_LAYOUT, ...(data.hero?.layout ?? {}) } },
        dna:     { ...defaultContent.dna,     ...data.dna     },
        reviews: { ...defaultContent.reviews, ...data.reviews, items: data.reviews?.items ?? defaultContent.reviews.items },
        products: { ...defaultContent.products, ...data.products },
        dealer:  { ...defaultContent.dealer,  ...data.dealer  },
        contactSection: { ...defaultContent.contactSection, ...data.contactSection },
        sectionOrder: data.sectionOrder ?? DEFAULT_SECTION_ORDER,
        textStyles: data.textStyles ?? {},
        sectionBgs: data.sectionBgs ?? {},
        logos: { dark: data.logos?.dark ?? "", light: data.logos?.light ?? "" },
        featuredSection: { ...defaultContent.featuredSection, ...data.featuredSection },
        calculator: { ...defaultContent.calculator, ...data.calculator },
        navbar: { ...defaultContent.navbar, ...data.navbar, links: data.navbar?.links ?? defaultContent.navbar.links },
        footer: { ...defaultContent.footer, ...data.footer },
        technology: { ...defaultContent.technology, ...data.technology, features: data.technology?.features ?? defaultContent.technology.features, certs: data.technology?.certs ?? defaultContent.technology.certs },
      };
      setHist({ past: [], present: loaded, future: [] });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    setContentLoading(true);
    fetch(`/api/content?lang=${lang}`)
      .then(r => r.json())
      .then(data => {
        const loaded: SiteContent = {
          ...defaultContent,
          ...data,
          hero: { ...defaultContent.hero, ...data.hero, layout: { ...DEFAULT_LAYOUT, ...(data.hero?.layout ?? {}) } },
          dna:     { ...defaultContent.dna,     ...data.dna     },
          reviews: { ...defaultContent.reviews, ...data.reviews, items: data.reviews?.items ?? defaultContent.reviews.items },
          products: { ...defaultContent.products, ...data.products },
          dealer:  { ...defaultContent.dealer,  ...data.dealer  },
          contactSection: { ...defaultContent.contactSection, ...data.contactSection },
          sectionOrder: data.sectionOrder ?? DEFAULT_SECTION_ORDER,
          textStyles: data.textStyles ?? {},
          sectionBgs: data.sectionBgs ?? {},
          logos: { dark: data.logos?.dark ?? "", light: data.logos?.light ?? "" },
          featuredSection: { ...defaultContent.featuredSection, ...data.featuredSection },
          calculator: { ...defaultContent.calculator, ...data.calculator },
          navbar: { ...defaultContent.navbar, ...data.navbar, links: data.navbar?.links ?? defaultContent.navbar.links },
          footer: { ...defaultContent.footer, ...data.footer },
          technology: {
            ...defaultContent.technology,
            ...data.technology,
            features: data.technology?.features ?? defaultContent.technology.features,
            certs:    data.technology?.certs    ?? defaultContent.technology.certs,
          },
        };
        setHist({ past: [], present: loaded, future: [] });
      })
      .catch(() => {})
      .finally(() => setContentLoading(false));
  }, [refreshKey, lang]);

  return (
    <ContentContext.Provider value={{
      ...content,
      refreshContent,
      liveUpdate,
      saveContent,
      undo,
      redo,
      canUndo: hist.past.length > 0,
      canRedo: hist.future.length > 0,
      reorderSections,
      updateTextStyle,
      lang,
      contentLoading,
    }}>
      {children}
    </ContentContext.Provider>
  );
}
