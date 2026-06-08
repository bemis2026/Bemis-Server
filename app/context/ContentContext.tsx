"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { useLanguage, type Lang } from "./LanguageContext";

export type StatItem = {
  value: number; suffix: string; prefix?: string; label: string; description: string;
};

export type FaqItem = { q: string; a: string };

export type CategoryMeta = {
  name: string; subtitle: string; modelCount: number; badge: string | null; comingSoon: boolean; image?: string; sliderImage?: string;
  description?: string;
  // Optional category-hero background image. Rendered full-bleed behind
  // the title + `description` on the category page so it greets the
  // visitor on entry. Wide aspect (16:9) and ≥1600px read best.
  descriptionImage?: string;
  // Per-category FAQ — admin caps at 10 entries; public renders a
  // collapsible accordion between the product detail and the "Benzer
  // Ürünler" carousel, plus a FAQPage JSON-LD block for Google rich
  // snippets.
  faq?: FaqItem[];
  // Kategori bazlı kullanma kılavuzları / PDF dokümantasyon — o
  // kategorideki tüm ürünlerin detay sayfasında "Belgeler" sekmesinde
  // ek olarak listelenir.
  manuals?: { id: string; name: string; url: string; size?: string }[];
};


export type FeaturedItem = {
  categoryId: string; productId: string; badge: string; highlight: string; visible: boolean;
};

export type DnaItem = { title: string; desc: string };
export type TimelineItem = { year: string; title: string; desc: string };
export type CertificationItem = { label: string; sub: string };
export type RegionRep = {
  regionId: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  whatsapp?: string;
  // Alt bölge / lokasyon — örn. "Kuzey Marmara", "İstanbul Anadolu",
  // "Bursa". Aynı bölgeye birden fazla temsilci atandığında hangi alt
  // bölgeden sorumlu olduğunu gösterir.
  subregion?: string;
};

// Export-team contact info — surfaced both on the dealer Yurtdışı tab and via
// the footer's "İhracat / Export" link. Lives under dealer.exportContact so
// it travels with the dealer-section content.
export type ExportContact = {
  contactPerson?: string;
  title?: string;        // job title — auto-translated
  email?: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;        // free text — auto-translated
};

// Yurtdışı (international) tab copy — admin-editable so the operator can
// reword the eyebrow, heading and intro paragraph without code changes.
// `languages` is an ordered list of ISO-639-1 / locale codes used to render
// flag pills next to the export contact card.
// Reference / case-study project — image-led card shown on the homepage
// "Referans Projeler" marquee. Title + location render as a caption overlay.
export type ReferenceProject = {
  id: string;
  image: string;
  title?: string;
  location?: string;
  description?: string;
  imagePos?: string; // object-position "x% y%" — adminde tıkla-odakla; public kartta object-cover odak noktası (cihaz yarıda kalmasın)
};


export type WorldSection = {
  sectionLabel: string;
  heading: string;
  introTitle: string;
  introDescription: string;
  languagesNote: string;
  languages: string[];
};

// International distributor — one entry per country. `active: true` means the
// pin is shown on the globe AND the country appears in the left-column list
// when the user opens the Yurtdışı tab. Inactive entries stay in the seed so
// admin can flip them on once a distributor is signed.
export type InternationalDealer = {
  id: string;            // ISO-2 lowercase, used as React key + storage key
  countryCode: string;   // ISO-2 uppercase (display)
  countryName: string;   // localized country name
  lat: number;
  lng: number;
  active: boolean;
  distributorName?: string;
  contactPerson?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  notes?: string;
};
export type TechFeature = { title: string; desc: string; accent: string };
export type SmartChargerFeature = { title: string; desc: string };
export type ShowcaseSpec = { label: string; value: string };

export type ShowcaseProductItem = {
  badge?: string;
  name: string;
  tagline?: string;
  description?: string;
  image?: string;
  specs?: ShowcaseSpec[];
  ctaPrimary?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  // Görsel üstündeki 4 özellik kutucuğu (sol alt). Slot 0..3.
  // Slide-spesifik; boş bırakılırsa global ps.overlayFeatures'a fallback.
  overlayFeatures?: string[];
  // object-position değeri ("50% 50%" formatında) — image kart oranı (3/4)
  // dosyanınkinden farklı olunca cover/cropping yapılır; bu alan hangi
  // noktanın merkezde görüneceğini belirler. Admin'den click-to-focus
  // ile set edilir.
  imagePos?: string;
  // Image zoom (1.0 = ham, 2.0 = %200). transform-origin imagePos'tan
  // gelir, böylece odak noktasını merkez alarak yakınlaşır/uzaklaşır.
  imageZoom?: number;
};

export type ReviewItem = {
  platform: string; platformColor: string; rating: number;
  author: string; date: string; product: string; text: string;
};

export type SocialPost = {
  /** Stable id for list editing in the admin panel. */
  id: string;
  /** Which channel this post belongs to. Renders alongside the matching
   *  brand-coloured tile in the Reviews block. */
  platform: "linkedin" | "instagram" | "youtube" | "facebook";
  /** Post thumbnail (ImgBB or Cloudinary URL — same upload pipeline as
   *  product photos). */
  image: string;
  /** Plain-text caption — 1-2 sentences fits the card; longer captions
   *  get line-clamped. */
  caption: string;
  /** Public URL to the post on the original platform. Click target. */
  link: string;
  /** Human label like "2 hafta önce" or "12 May 2026". Admin-curated;
   *  we don't parse dates from the source platform. */
  date?: string;
};

export type HeroLayout = {
  logo:   { x: number; y: number };
  text:   { x: number; y: number };
  button: { x: number; y: number };
};

/** Third-party tracking IDs that the operator can rotate from the
 *  admin panel without redeploys. Empty string = disabled. */
export type MarketingConfig = {
  /** GA4 measurement ID, e.g. "G-XXXXXXXXXX". Falls back to the
   *  legacy hardcoded ID in GoogleAnalytics.tsx when blank. */
  ga4Id?: string;
  /** Google Ads conversion / remarketing tag — "AW-XXXXXXXXX". */
  googleAdsId?: string;
  /** Conversion label for the form-submit conversion. Used as
   *  `AW-XXX/{label}` in send_to. */
  googleAdsContactLabel?: string;
  /** Meta (Facebook) Pixel numeric ID. */
  metaPixelId?: string;
};

export type SiteContent = {
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    /** Optional rotating words shown in place of headline2 every 2.5s. */
    headline2Words?: string[];
    headline3: string;
    subtitle: string; ctaPrimary: string; ctaSecondary: string; heroBg: string;
    heroBgPos?: string;
    /** Ek hero arka plan görselleri — heroBg ile birlikte 3 sn'de bir otomatik geçer (slider). */
    heroImages?: string[];
    layout: HeroLayout;
  };
  stats: StatItem[];
  categories: Record<string, CategoryMeta>;
  featured: FeaturedItem[];
  contact: {
    phone: string; email: string; address: string; addressSub: string;
    workingHours: string; workingDays: string;
    whatsappPhone?: string; whatsappMessage?: string;
  };
  company: {
    foundedYear: string; exportCountries: string; productCount: string; facilitySize: string;
  };
  marketing?: MarketingConfig;
  social: {
    linkedin: string;
    instagram: string;
    twitter: string;
    youtube: string;
    facebook: string;
    /** Operator-curated "latest post" cards shown beside the reviews
     *  block. There is no official public feed API for LinkedIn and
     *  Instagram's Graph API requires a Meta business token — so we
     *  pin a snapshot of the most recent post per platform that the
     *  admin updates from the panel. */
    recentPosts?: SocialPost[];
  };
  /** Search engine site-verification tokens. Each one rendered as a
   *  `<meta name="…" content="…">` in <head> when present. Operators
   *  paste the exact token Google / Yandex / Bing gives them — no
   *  protocol, no quotes. Empty strings are skipped. */
  siteVerification?: {
    google?: string;
    yandex?: string;
    bing?: string;
  };
  /** Operator-editable email copy. Each field is optional — falls back
   *  to the hardcoded default in lib/email.ts when empty. Variables in
   *  curly braces are substituted at send time:
   *    {name}        — form filler's name
   *    {topicLabel}  — "Bayilik Başvurusu" / "Ürün Bilgisi" vb.
   *    {formKind}    — "İletişim formu" / "Bayi başvurusu" vb.
   */
  emailTemplates?: {
    autoReply?: {
      subject?: string;       // Mail konusu — "Mesajınız alındı — Bemis E-V Charge"
      heading?: string;       // Üst başlık — "Mesajınızı aldık 👋"
      greeting?: string;      // Karşılama satırı — "Merhaba {name},"
      intro1?: string;        // 1. paragraf — "{topicLabel} konulu mesajınız..."
      intro2?: string;        // 2. paragraf — "Acil bir durum varsa..."
      quoteHeading?: string;  // Mesaj alıntı başlığı — "Bize Gönderdiğiniz Mesaj"
      footerNote?: string;    // Alt not — "Bu mesaj otomatik gönderilmiştir..."
      companyAddress?: string;// "Bursa, Türkiye"
      contactEmail?: string;  // İletişim mail'i — "info@bemisevcharge.com"
    };
  };
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
    /** Editable labels for the 5 production steps + the "Son Ürün"
     *  final card. Index 0-4 match the icons rendered in /kurumsal;
     *  index 5 is the final-step label. */
    productionStepLabels?: string[];
    productionFinalLabel?: string;
    /** Section eyebrows + headings for /kurumsal sub-blocks so the
     *  operator can localize/rewrite without touching code. */
    kurumsalLabels?: {
      productionEyebrow?: string;
      productionHeading?: string;
      productionMadeIn?: string;
      timelineEyebrow?: string;
      timelineHeading?: string;
      valuesEyebrow?: string;
    };
    timeline?: TimelineItem[];
    aboutVideo?: string;
    certifications?: CertificationItem[];
    ctaLabel: string;
    /** Bemis Group brands shown beside the factory video — heading +
     *  paragraph + 3 logo slots (Bemis / Bemis E-V Charge / BYES). */
    groupBrandsTitle?: string;
    groupBrandsBody?: string;
    groupBrands?: { name: string; logo: string }[];
  };
  products: { heading: string; subheading: string; sectionLabel: string; allProductsLabel: string; viewLabel: string; sliderEnabled: boolean; allProductsDescription: string };
  dealer: {
    sectionLabel: string; heading: string; description: string;
    applyText: string; statCities: string; statDealers: string;
    findDealerTitle: string; contactBtnLabel: string;
    citiesLabel: string; activeDealersLabel: string;
    mapHint: string; mapTitle: string;
    regionReps?: RegionRep[];
    internationalDealers?: InternationalDealer[];
    exportContact?: ExportContact;
    worldSection?: WorldSection;
  };
  reviews: {
    heading: string; subheading: string; rating: string; ratingCount: string;
    items: ReviewItem[];
    sectionLabel: string; ratingLabel: string; platformsPrefix: string; ratingCountSuffix: string;
  };
  contactSection: { sectionLabel: string; heading: string; subheading: string };
  featuredSection: { sectionLabel: string; heading: string; subheading: string; ctaLabel: string };
  referenceProjectsSection: {
    sectionLabel: string;
    heading: string;
    subheading: string;
    items: ReferenceProject[];
  };
  navbar: { ctaLabel: string; links: { label: string; href: string }[]; b2bPortalUrl?: string };
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
  smartCharger: {
    sectionLabel: string;
    heading: string;
    subheading: string;
    ocppBadge: string;
    ctaLabel: string;
    ctaHref: string;
    appStoreHref: string;
    playStoreHref: string;
    features: SmartChargerFeature[];
    /** Optional screenshot to overlay inside the phone mockup frame. */
    mockupPhoneImage?: string;
    /** Optional screenshot to overlay inside the web (browser) mockup frame. */
    mockupWebImage?: string;
  };
  productShowcase: {
    badge: string;
    name: string;
    tagline: string;
    description: string;
    /** Legacy single image — kept for backwards compatibility. images[] is preferred. */
    image: string;
    images?: string[];
    specs: ShowcaseSpec[];
    ctaPrimary: string;
    ctaHref: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
    /** When set, each entry is a distinct product — swipe changes image + text together. */
    products?: ShowcaseProductItem[];
    /** Four labels overlaid on the bottom-left of the showcase image (e.g. "IP 65", "Planlı Şarj"). */
    overlayFeatures?: string[];
  };
  sectionOrder: string[];
  textStyles: Record<string, { color?: string; fontSize?: string }>;
  sectionBgs: Record<string, string>;
  logos: { dark: string; light: string };
  ogImage: string;
  faviconUrl: string;
};

const DEFAULT_LAYOUT: HeroLayout = {
  logo:   { x: 4, y: 12 },
  text:   { x: 4, y: 36 },
  button: { x: 4, y: 82 },
};

export const DEFAULT_SECTION_ORDER = [
  "dna", "stats", "productshowcase", "smartcharger", "products", "featured", "referenceprojects", "reviews", "dealer", "b2bcta", "calculator"
];

function migrateSectionOrder(order: string[]): string[] {
  // Drop legacy "gallery" entry from any saved bin order — the section
  // was retired and shouldn't surface on stale CMS data.
  const known = ["dna","stats","productshowcase","smartcharger","products","featured","referenceprojects","reviews","dealer","calculator","b2bcta"];
  const filtered = order.filter(s => known.includes(s));
  const missing = known.filter(s => !filtered.includes(s));
  return [...filtered, ...missing];
}

const defaultContent: SiteContent = {
  hero: {
    badge: "Yerli Üretim · Bursa · 1994",
    headline1: "Türkiye'nin",
    headline2: "Şarj Sistemleri",
    // Empty by default — admin fills the comma-separated list to enable the
    // rotating-word animation. Below the threshold of 2 words the Hero
    // renders the static `headline2` instead.
    headline2Words: [],
    headline3: "Üreticisi",
    subtitle: "Evinizden iş yerinize, otopark çözümlerinden sahaya kadar — IP65 sertifikalı AC şarj üniteleri, kablolar ve aksesuarlarla elektrikli araç deneyimini kolaylaştırıyoruz.",
    ctaPrimary: "Ürün Kataloğu", ctaSecondary: "Bayi Bul", heroBg: "", heroBgPos: "75% 50%", heroImages: [],
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
    whatsappPhone: "", whatsappMessage: "Merhaba, Bemis E-V Charge ürünleri hakkında bilgi almak istiyorum.",
  },
  company: {
    foundedYear: "1994", exportCountries: "60+", productCount: "6000+", facilitySize: "11.000 m²",
  },
  marketing: { ga4Id: "", googleAdsId: "", googleAdsContactLabel: "", metaPixelId: "" },
  social: { linkedin: "", instagram: "", twitter: "", youtube: "", facebook: "", recentPosts: [] },
  siteVerification: { google: "", yandex: "", bing: "" },
  emailTemplates: {
    autoReply: {
      subject: "Başvurunuz alındı — Bemis E-V Charge",
      heading: "Başvurunuz alındı",
      greeting: "Sayın {name},",
      intro1: "\"{topicLabel}\" konulu başvurunuz tarafımıza ulaşmıştır.",
      intro2: "İlgili birimimiz başvurunuzu inceleyerek iş günleri içerisinde — genellikle 24 saat içinde — sizinle iletişime geçecektir.",
      quoteHeading: "Tarafımıza İlettiğiniz Mesaj",
      footerNote: "Bu otomatik bir bilgilendirme e-postasıdır. Ek bilgi paylaşmak isterseniz {contactEmail} adresine yazabilirsiniz.",
      companyAddress: "Bursa, Türkiye",
      contactEmail: "info@bemisevcharge.com",
    },
  },
  dna: {
    sectionLabel: "Hakkımızda",
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
    timeline: [
      { year: "1994", title: "Kuruluş",       desc: "Bursa'da Bemis Teknik Elektrik A.Ş. kuruldu." },
      { year: "2000", title: "İhracat",       desc: "Ürünler ilk kez uluslararası pazarlara çıktı." },
      { year: "2010", title: "Büyüme",        desc: "Bursa OSB'de 11.000 m² modern tesis açıldı." },
      { year: "2020", title: "EV Dönüşümü",   desc: "Bemis E-V Charge markasıyla EV şarj pazarına girildi." },
      { year: "2024", title: "Bugün",         desc: "60+ ülkeye ihracat, 6000+ ürün çeşidi." },
    ],
    aboutVideo: "",
    certifications: [
      { label: "CE",        sub: "Avrupa Uygunluk"        },
      { label: "IP65",      sub: "Toz & Su Koruması"      },
      { label: "IEC 61851", sub: "EV Şarj Sistemi Std."   },
      { label: "IEC 62196", sub: "EV Konektör Std."        },
      { label: "OCPP 2.0",  sub: "Açık Şarj Protokolü"   },
      { label: "ISO 9001",  sub: "Kalite Yönetim Sistemi" },
      { label: "TSE",       sub: "Türk Standartları"       },
    ],
    groupBrandsTitle: "Bemis Grup Markaları",
    groupBrandsBody: "Bemis Teknik Elektrik A.Ş. çatısı altında üç markamızla — Bemis, Bemis E-V Charge ve BYES — elektrik altyapısı, EV şarj çözümleri ve enerji yönetimi alanlarında Türkiye'den dünyaya hizmet veriyoruz.",
    groupBrands: [
      { name: "Bemis",            logo: "" },
      { name: "Bemis E-V Charge", logo: "" },
      { name: "BYES",             logo: "" },
    ],
    productionStepLabels: [
      "PCB Tasarımı",
      "Elektronik İmalat",
      "Yazılım",
      "Cihaz Tasarımı",
      "Test & Kalite",
    ],
    productionFinalLabel: "Son Ürün",
    kurumsalLabels: {
      productionEyebrow: "Üretim Süreci",
      productionHeading: "Tasarımdan Son Ürüne",
      productionMadeIn: "🇹🇷 Yerli Üretim",
      timelineEyebrow: "Tarihçe",
      timelineHeading: "Bemis Yolculuğu",
      valuesEyebrow: "Değerlerimiz, Teknoloji & Sertifikalar",
    },
  },
  products: {
    heading: "EV Şarj Çözümleri",
    subheading: "İhtiyacınıza uygun şarj çözümünü keşfedin",
    sectionLabel: "Ürün Kataloğu",
    allProductsLabel: "Tüm Ürünler",
    viewLabel: "İncele",
    sliderEnabled: true,
    allProductsDescription: "",
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
    regionReps: [
      { regionId: "merkez",     name: "", title: "Bursa Genel Merkez Satış",        phone: "", email: "" },
      { regionId: "marmara",    name: "", title: "Marmara Bölge Temsilcisi",         phone: "", email: "" },
      { regionId: "ege",        name: "", title: "Ege Bölge Temsilcisi",             phone: "", email: "" },
      { regionId: "akdeniz",    name: "", title: "Akdeniz Bölge Temsilcisi",         phone: "", email: "" },
      { regionId: "ic_anadolu", name: "", title: "İç Anadolu Bölge Temsilcisi",      phone: "", email: "" },
      { regionId: "karadeniz",  name: "", title: "Karadeniz Bölge Temsilcisi",       phone: "", email: "" },
      { regionId: "dogu",       name: "", title: "Doğu Anadolu Bölge Temsilcisi",    phone: "", email: "" },
      { regionId: "guneydogu",  name: "", title: "Güneydoğu Anadolu Bölge Temsilcisi", phone: "", email: "" },
    ],
    // Seed list of target / partner countries. `active: false` keeps them out
    // of the globe + list until admin flips them on. Coordinates are country
    // centroids (rough — visual placement only).
    internationalDealers: [
      // Balkans — capital-area centroids (visually align with country mass)
      { id: "bg", countryCode: "BG", countryName: "Bulgaristan",         lat: 42.73,  lng: 25.49,  active: false },
      { id: "ro", countryCode: "RO", countryName: "Romanya",             lat: 45.94,  lng: 24.97,  active: false },
      { id: "rs", countryCode: "RS", countryName: "Sırbistan",           lat: 44.02,  lng: 21.01,  active: false },
      { id: "mk", countryCode: "MK", countryName: "Kuzey Makedonya",     lat: 41.61,  lng: 21.75,  active: false },
      { id: "al", countryCode: "AL", countryName: "Arnavutluk",          lat: 41.15,  lng: 20.17,  active: false },
      { id: "ba", countryCode: "BA", countryName: "Bosna Hersek",        lat: 43.92,  lng: 17.68,  active: false },
      { id: "me", countryCode: "ME", countryName: "Karadağ",             lat: 42.71,  lng: 19.37,  active: false },
      { id: "xk", countryCode: "XK", countryName: "Kosova",              lat: 42.60,  lng: 20.90,  active: false },
      { id: "gr", countryCode: "GR", countryName: "Yunanistan",          lat: 39.07,  lng: 22.95,  active: false },
      // Middle East & North Africa
      { id: "ae", countryCode: "AE", countryName: "Birleşik Arap Em.",   lat: 23.42,  lng: 53.85,  active: false },
      { id: "sa", countryCode: "SA", countryName: "Suudi Arabistan",     lat: 23.89,  lng: 45.08,  active: false },
      { id: "qa", countryCode: "QA", countryName: "Katar",               lat: 25.35,  lng: 51.18,  active: false },
      { id: "kw", countryCode: "KW", countryName: "Kuveyt",              lat: 29.31,  lng: 47.48,  active: false },
      { id: "om", countryCode: "OM", countryName: "Umman",               lat: 21.47,  lng: 55.97,  active: false },
      { id: "bh", countryCode: "BH", countryName: "Bahreyn",             lat: 26.07,  lng: 50.55,  active: false },
      { id: "iq", countryCode: "IQ", countryName: "Irak",                lat: 33.22,  lng: 43.68,  active: false },
      { id: "jo", countryCode: "JO", countryName: "Ürdün",               lat: 30.59,  lng: 36.24,  active: false },
      { id: "lb", countryCode: "LB", countryName: "Lübnan",              lat: 33.85,  lng: 35.86,  active: false },
      { id: "eg", countryCode: "EG", countryName: "Mısır",               lat: 26.82,  lng: 30.80,  active: false },
      { id: "ly", countryCode: "LY", countryName: "Libya",               lat: 26.34,  lng: 17.23,  active: false },
      { id: "tn", countryCode: "TN", countryName: "Tunus",               lat: 33.89,  lng: 9.54,   active: false },
      { id: "dz", countryCode: "DZ", countryName: "Cezayir",             lat: 28.03,  lng: 1.66,   active: false },
      { id: "ma", countryCode: "MA", countryName: "Fas",                 lat: 31.79,  lng: -7.09,  active: false },
      // Selected Europe
      { id: "de", countryCode: "DE", countryName: "Almanya",             lat: 51.17,  lng: 10.45,  active: false },
      { id: "nl", countryCode: "NL", countryName: "Hollanda",            lat: 52.13,  lng: 5.29,   active: false },
      { id: "fr", countryCode: "FR", countryName: "Fransa",              lat: 46.23,  lng: 2.21,   active: false },
      { id: "it", countryCode: "IT", countryName: "İtalya",              lat: 41.87,  lng: 12.57,  active: false },
      { id: "es", countryCode: "ES", countryName: "İspanya",             lat: 40.46,  lng: -3.75,  active: false },
      { id: "pl", countryCode: "PL", countryName: "Polonya",             lat: 51.92,  lng: 19.15,  active: false },
      // Turkic states
      { id: "az", countryCode: "AZ", countryName: "Azerbaycan",          lat: 40.14,  lng: 47.58,  active: false },
      { id: "kz", countryCode: "KZ", countryName: "Kazakistan",          lat: 48.02,  lng: 66.92,  active: false },
      { id: "uz", countryCode: "UZ", countryName: "Özbekistan",          lat: 41.38,  lng: 64.59,  active: false },
      { id: "tm", countryCode: "TM", countryName: "Türkmenistan",        lat: 38.97,  lng: 59.56,  active: false },
      { id: "kg", countryCode: "KG", countryName: "Kırgızistan",         lat: 41.20,  lng: 74.77,  active: false },
      // South America
      { id: "br", countryCode: "BR", countryName: "Brezilya",            lat: -14.24, lng: -51.93, active: false },
      { id: "ar", countryCode: "AR", countryName: "Arjantin",            lat: -38.42, lng: -63.62, active: false },
      { id: "cl", countryCode: "CL", countryName: "Şili",                lat: -35.68, lng: -71.54, active: false },
    ],
    exportContact: {
      contactPerson: "",
      title: "Bemis İhracat Departmanı",
      email: "",
      phone: "",
      whatsapp: "",
      hours: "",
    },
    worldSection: {
      sectionLabel: "Küresel Distribütör Ağı",
      heading: "Dünyaya Açılan Bemis",
      introTitle: "Bursa'dan Dünyaya",
      introDescription:
        "Bursa merkezli üretim tesisimizden Avrupa, Balkanlar, Orta Doğu, Türk dünyası, Kuzey Afrika ve Amerika'ya uzanan distribütör ağımızla EV şarj çözümlerini globalde sunuyoruz.",
      languagesNote: "Kurumsal müşterilerimize yerel dilde satış ve teknik destek sunan çok dilli yetkili personel hizmetimiz mevcuttur.",
      languages: ["tr", "en", "ru", "es", "ar"],
    },
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
  referenceProjectsSection: {
    sectionLabel: "Referans Projeler",
    heading: "Sahada Bemis E-V Charge",
    subheading: "AVM, otopark, otel ve kurumsal kampüslerde devreye aldığımız uygulamalardan kareler.",
    items: [],
  },
  navbar: {
    ctaLabel: "Bize Ulaşın",
    b2bPortalUrl: "",
    links: [
      { label: "Ana Sayfa",   href: "#hero"              },
      { label: "Hakkımızda",  href: "#dna"               },
      { label: "Ürünler",     href: "#products"          },
      { label: "Dökümanlar",  href: "/documents"         },
      { label: "Bayi Ağı",    href: "#dealer"            },
      { label: "Hesaplayıcı", href: "#calculator"        },
      { label: "Kurumsal",    href: "/b2b"               },
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
  smartCharger: {
    sectionLabel: "Akıllı Şarj Teknolojisi",
    heading: "Mobil Uygulama ile\nHer Yerden Yönetin",
    subheading: "Charger serisi şarj ünitelerimiz OCPP protokolü sayesinde site, AVM ve otopark gibi ortak kullanım alanlarında ağ operatörlerine sorunsuz entegre olur. Gerçek zamanlı izleme, uzaktan kontrol ve enerji optimizasyonu tek platformda.",
    ocppBadge: "OCPP 1.6 / 2.0.1 Uyumlu",
    ctaLabel: "Web Bemis Charge Hub İncele",
    ctaHref: "/products/charger-equipment",
    appStoreHref: "",
    playStoreHref: "",
    features: [
      { title: "Uzaktan İzleme & Kontrol", desc: "Şarj ünitelerini gerçek zamanlı takip edin, başlatın veya durdurun. Anlık durum bildirimleri alın." },
      { title: "Ortak Alan Optimizasyonu", desc: "Çok kullanıcılı erişim, dinamik yük dengeleme ve ödeme sistemi entegrasyonu ile tam yönetim. Standart OCPP protokolü ile tüm ağ operatörleri ve back-end platformlarıyla uyumlu çalışır." },
    ],
  },
  productShowcase: {
    badge: "Amiral Gemisi Ürün",
    name: "AC Wallbox Smart Charger Pro 2",
    tagline: "Akıllı şarjın yeni standardı",
    description: "Konut ve iş yeri uygulamaları için geliştirilmiş, OCPP destekli 7,4 kW akıllı AC şarj istasyonu. Mobil uygulama entegrasyonu, dinamik yük yönetimi ve IP65 korumasıyla ev ile kamusal alanlarda kesintisiz performans.",
    image: "/products/1775067096437-WhatsApp_Image_2026-03-29_at_01.55.05__2_.jpeg",
    specs: [
      { label: "Güç Çıkışı", value: "7,4 kW" },
      { label: "Koruma Sınıfı", value: "IP65 · IK10" },
      { label: "Bağlantı", value: "OCPP 1.6 / 2.0.1" },
      { label: "Konnektör", value: "Type 2 (IEC 62196)" },
      { label: "Sıcaklık", value: "-40°C / +55°C" },
      { label: "Garanti", value: "2 Yıl" },
    ],
    ctaPrimary: "Ürünü İncele",
    ctaHref: "/products/wallbox",
    ctaSecondary: "Teklif Al",
    ctaSecondaryHref: "/contact",
    overlayFeatures: ["IP 65", "Planlı Şarj", "Ortak Kullanım", "Mobil Uygulama"],
  },
  sectionOrder: DEFAULT_SECTION_ORDER,
  textStyles: {},
  sectionBgs: {},
  logos: { dark: "", light: "" },
  ogImage: "",
  faviconUrl: "",
};

// ── content merge ─────────────────────────────────────────────────────────────
// Merges raw fetched content (from /api/content or server-side readBin) with
// defaultContent so every nested field is guaranteed to exist. Used by both the
// initial server-rendered hydration and runtime client refetches.
// `lang` is retained for signature compatibility with existing callers; the
// navbar migration no longer injects a localized link (see navbar block below).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeContent(data: any, lang: Lang = "tr"): SiteContent {
  void lang;
  const safe = (data ?? {}) as Record<string, unknown> & { [k: string]: any };
  return {
    ...defaultContent,
    ...safe,
    hero: { ...defaultContent.hero, ...safe.hero, layout: { ...DEFAULT_LAYOUT, ...(safe.hero?.layout ?? {}) } },
    dna:     { ...defaultContent.dna,     ...safe.dna     },
    reviews: { ...defaultContent.reviews, ...safe.reviews, items: safe.reviews?.items ?? defaultContent.reviews.items },
    products: { ...defaultContent.products, ...safe.products },
    dealer:  { ...defaultContent.dealer,  ...safe.dealer  },
    contactSection: { ...defaultContent.contactSection, ...safe.contactSection },
    sectionOrder: migrateSectionOrder(safe.sectionOrder ?? DEFAULT_SECTION_ORDER),
    textStyles: safe.textStyles ?? {},
    sectionBgs: safe.sectionBgs ?? {},
    logos: { dark: safe.logos?.dark ?? "", light: safe.logos?.light ?? "" },
    ogImage: safe.ogImage ?? "",
    faviconUrl: safe.faviconUrl ?? "",
    featuredSection: { ...defaultContent.featuredSection, ...safe.featuredSection },
    referenceProjectsSection: {
      ...defaultContent.referenceProjectsSection,
      ...(safe.referenceProjectsSection ?? {}),
      items: Array.isArray(safe.referenceProjectsSection?.items)
        ? safe.referenceProjectsSection.items
        : defaultContent.referenceProjectsSection.items,
    },
    calculator: { ...defaultContent.calculator, ...safe.calculator },
    navbar: (() => {
      // Menu rules:
      //  1. Drop legacy "#contact / İletişim" — the "Bize Ulaşın" CTA in
      //     the navbar already covers contact (the section itself stays
      //     editable in admin).
      //  2. Drop "Projeler / #referenceprojects" — removed from the menu by
      //     request. The section itself still renders on the homepage; only
      //     the nav shortcut is gone. We filter it out here (not just from
      //     defaultContent) because the stored bin may still carry the link.
      //  3. Sort anchor links to match the homepage sectionOrder so the
      //     menu reads top-to-bottom in the same flow as the page.
      //     Non-anchor links (/documents, /b2b) keep their relative spot
      //     and drop to the end.
      type LinkItem = { label?: string; href?: string };
      const DROP_HREFS = new Set(["#contact", "#referenceprojects"]);
      const baseLinks: LinkItem[] = safe.navbar?.links ?? defaultContent.navbar.links;
      const cleaned = baseLinks.filter((l) => !DROP_HREFS.has(l?.href ?? ""));

      const order = migrateSectionOrder(safe.sectionOrder ?? DEFAULT_SECTION_ORDER);
      const sectionIdx = (href?: string) => {
        if (!href || !href.startsWith("#")) return Number.POSITIVE_INFINITY;
        const id = href.slice(1).toLowerCase();
        if (id === "hero") return -1; // always first
        const i = order.indexOf(id);
        return i >= 0 ? i : Number.POSITIVE_INFINITY;
      };
      const links = [...cleaned].sort((a, b) => sectionIdx(a.href) - sectionIdx(b.href));
      return { ...defaultContent.navbar, ...safe.navbar, links };
    })(),
    footer: { ...defaultContent.footer, ...safe.footer },
    technology: {
      ...defaultContent.technology,
      ...safe.technology,
      features: safe.technology?.features ?? defaultContent.technology.features,
      certs:    safe.technology?.certs    ?? defaultContent.technology.certs,
    },
    smartCharger: {
      ...defaultContent.smartCharger,
      ...safe.smartCharger,
      features: (() => {
        const fs = safe.smartCharger?.features ?? defaultContent.smartCharger.features;
        if (fs.length === 3 && fs[2]?.title?.includes("OCPP")) {
          return [fs[0], { ...fs[1], desc: fs[1].desc + (fs[1].desc.endsWith(".") ? " " : ". ") + fs[2].desc }];
        }
        return fs;
      })(),
      ctaLabel: (safe.smartCharger?.ctaLabel && safe.smartCharger.ctaLabel !== "Charger Serisini İncele")
        ? safe.smartCharger.ctaLabel
        : defaultContent.smartCharger.ctaLabel,
    },
    productShowcase: {
      ...defaultContent.productShowcase,
      ...safe.productShowcase,
      specs: safe.productShowcase?.specs ?? defaultContent.productShowcase.specs,
      products: safe.productShowcase?.products,
      overlayFeatures: safe.productShowcase?.overlayFeatures ?? defaultContent.productShowcase.overlayFeatures,
    },
  };
}

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
  contentError: string | null;
  dismissContentError: () => void;
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
  contentError: null,
  dismissContentError: () => {},
});

export function useContent() { return useContext(ContentContext); }

// ── provider ──────────────────────────────────────────────────────────────────

export function ContentProvider({ children, initialContent }: { children: ReactNode; initialContent?: unknown }) {
  const { lang } = useLanguage();
  const [hist, setHist] = useState<HistoryState>(() => ({
    past: [],
    present: initialContent ? mergeContent(initialContent, lang) : defaultContent,
    future: [],
  }));
  const [refreshKey, setRefreshKey] = useState(0);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  const content = hist.present;

  const refreshContent = useCallback(() => {
    setContentError(null);
    setRefreshKey(k => k + 1);
  }, []);

  const dismissContentError = useCallback(() => setContentError(null), []);

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
      setHist({ past: [], present: mergeContent(e.data.content, lang), future: [] });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [lang]);

  useEffect(() => {
    const controller = new AbortController();
    setContentLoading(true);
    fetch(`/api/content?lang=${lang}`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setHist({ past: [], present: mergeContent(data, lang), future: [] });
        setContentError(null);
      })
      .catch(err => {
        if (err?.name === "AbortError") return;
        console.error("content fetch error:", err);
        setContentError("İçerik yüklenemedi. İnternet bağlantınızı kontrol edin.");
      })
      .finally(() => setContentLoading(false));
    return () => controller.abort();
  }, [refreshKey, lang]);

  const canUndo = hist.past.length > 0;
  const canRedo = hist.future.length > 0;

  const value = useMemo(() => ({
    ...content,
    refreshContent,
    liveUpdate,
    saveContent,
    undo,
    redo,
    canUndo,
    canRedo,
    reorderSections,
    updateTextStyle,
    lang,
    contentLoading,
    contentError,
    dismissContentError,
  }), [
    content, refreshContent, liveUpdate, saveContent, undo, redo,
    canUndo, canRedo, reorderSections, updateTextStyle, lang,
    contentLoading, contentError, dismissContentError,
  ]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}
