"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiArrowRight, HiPhone, HiLocationMarker, HiMail, HiUser, HiClock, HiExternalLink, HiX } from "react-icons/hi";
import { RiMapPin2Line, RiWhatsappLine, RiGlobalLine, RiAwardLine, RiCustomerService2Line, RiArrowDownSLine, RiCheckLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import E from "./E";
import Image from "next/image";
import { CITY_BY_ID } from "../../lib/turkeyCities";
import { tierColor, tierLabel } from "../../lib/dealerTiers";
import InternationalGlobe from "./InternationalGlobe";
import InternationalMap2D from "./InternationalMap2D";

const BLUE = "#3B82F6";

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

// "Haritada Aç" must always open a MAP. `mapUrl` is trusted only when it
// actually points at a mapping service; when it's empty — or a website was
// mistakenly pasted into that field (which is what was happening) — we fall
// back to a Google Maps search built from the dealer's name + address, so
// the button never lands on the dealer's website.
const MAP_DOMAINS =
  /(?:google\.[a-z.]+\/maps|maps\.google|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|openstreetmap\.org|yandex\.[a-z.]+\/maps)/i;
function dealerMapHref(dealer: { name?: string; address?: string; mapUrl?: string }): string {
  const u = dealer.mapUrl?.trim();
  if (u && MAP_DOMAINS.test(u)) return u;
  const q = encodeURIComponent([dealer.name, dealer.address].filter(Boolean).join(" ").trim());
  return q ? `https://www.google.com/maps/search/?api=1&query=${q}` : (u || "#");
}

// Region centers calibrated to the 1327×621 Turkey map image (7 coğrafi bölge).
// City→region membership comes from lib/turkeyCities so adding a city in admin
// auto-places it in the right region without code changes.
const REGIONS = [
  { id: "marmara",    label: "Marmara",          cx: 222,  cy: 170, highlight: true  },
  { id: "ege",        label: "Ege",               cx: 148,  cy: 355, highlight: false },
  { id: "akdeniz",    label: "Akdeniz",           cx: 500,  cy: 488, highlight: false },
  { id: "ic_anadolu", label: "İç Anadolu",        cx: 555,  cy: 295, highlight: false },
  { id: "karadeniz",  label: "Karadeniz",         cx: 740,  cy: 108, highlight: false },
  { id: "dogu",       label: "Doğu Anadolu",      cx: 1048, cy: 258, highlight: false },
  { id: "guneydogu",  label: "Güneydoğu",         cx: 895,  cy: 435, highlight: false },
];

// Bursa HQ — drawn as a separate red pin on top of the Marmara region marker.
// Treated as its own selectable region (`merkez`) so the rep card can show a
// dedicated Bursa-headquarters contact, independent of the Marmara region.
const BURSA_HQ = { id: "merkez", label: "Bursa Merkez", cx: 270, cy: 272 };
const HQ_RED = "#EF4444";

// Bölge adlarının İngilizce karşılıkları — pickText bunları EN'de doğrudan,
// de/es/ar/ru'da ui.json sözlüğü üzerinden çevirir (TR görünüm değişmez).
const REGION_EN: Record<string, string> = {
  marmara: "Marmara",
  ege: "Aegean",
  akdeniz: "Mediterranean",
  ic_anadolu: "Central Anatolia",
  karadeniz: "Black Sea",
  dogu: "Eastern Anatolia",
  guneydogu: "Southeast Anatolia",
  merkez: "Bursa HQ",
};

// Language → ISO-3166 country code + native label lookup. `cc` drives the
// flagcdn.com PNG so flags render the same across Windows / Mac / Linux
// (Windows doesn't ship colour emoji flags out of the box).
const LANG_META: Record<string, { cc: string; label: string }> = {
  tr: { cc: "tr", label: "Türkçe" },
  en: { cc: "gb", label: "English" },
  ru: { cc: "ru", label: "Русский" },
  es: { cc: "es", label: "Español" },
  ar: { cc: "sa", label: "العربية" },
  de: { cc: "de", label: "Deutsch" },
  fr: { cc: "fr", label: "Français" },
  it: { cc: "it", label: "Italiano" },
  pt: { cc: "pt", label: "Português" },
  zh: { cc: "cn", label: "中文" },
  fa: { cc: "ir", label: "فارسی" },
  az: { cc: "az", label: "Azərbaycan" },
};

// wa.me ULUSLARARASI format ister: "0 533 140 13 64" gibi yerel yazim
// wa.me/05331401364 uretir ve BAGLANTI CALISMAZ. Bu yardimci bastaki 0'i
// ulke koduna cevirir. (2026-07-29: temsilcilerin WhatsApp'i telefonlarindan
// dolduruldu, telefonlar yerel formatta kayitli.)
const waNumber = (s: string) => {
  const d = (s || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (d.startsWith("90")) return d;
  if (d.startsWith("0")) return "90" + d.slice(1);
  // Ulke kodu ve bastaki 0 olmadan girilmis TR cep numarasi (5xx, 10 hane)
  if (d.length === 10 && d.startsWith("5")) return "90" + d;
  return d;
};

export default function DealerNetwork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { dealer: dealerSection, sectionBgs, logos } = useContent();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  // Kısa çeviri yardımcıları: L(tr,en) chrome dizeleri; regionLabel bölge adları.
  const L = (tr: string, en: string) => pickText(lang, tr, en);
  const regionLabel = (r: { id: string; label: string }) => L(r.label, REGION_EN[r.id] ?? r.label);
  const d = theme === "dark";
  const [dealers, setDealers] = useState<DealersData>({});
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // Liste içinde şehir bazlı filtre — bölge birden fazla şehir içeriyorsa
  // kullanıcı yalnızca bir şehre odaklanabilir. Bölge değişince reset.
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  // Modern bölge seçici (native <select> yerine tasarım odaklı özel dropdown).
  // ⚠️ Açılır liste PORTAL ile <body>'ye taşınır: bu bölüm SectionWrapper'ın
  // `contain: layout style paint`'i içinde; absolute/fixed dropdown o kutuya
  // KIRPILIYORDU ("liste tam görünmüyor, alt bölümün altında kalıyor"). Portal
  // containment'tan kaçar; konum trigger rect'inden hesaplanıp scroll/resize'da
  // güncellenir.
  const [regionOpen, setRegionOpen] = useState(false);
  const regionMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuNodeRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  useEffect(() => {
    if (!regionOpen) return;
    // Dış tık: tetikleyici sarmalayıcı VEYA portal düğümü içindeyse kapatma
    // (portal <body>'de olduğu için regionMenuRef onu içermez).
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (regionMenuRef.current?.contains(t) || menuNodeRef.current?.contains(t)) return;
      setRegionOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setRegionOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [regionOpen]);
  // Portal konumu: trigger'ın altına yerleş; scroll/resize'da yeniden hesapla;
  // trigger ekrandan çıkarsa listeyi kapat (havada asılı kalmasın).
  useEffect(() => {
    if (!regionOpen) return;
    const place = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) { setRegionOpen(false); return; }
      setMenuPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => { window.removeEventListener("scroll", place, true); window.removeEventListener("resize", place); };
  }, [regionOpen]);
  // Tabs: yurtici = Turkey SVG map, yurtdisi = 3D globe with international markets.
  const [viewMode, setViewMode] = useState<"yurtici" | "yurtdisi">("yurtici");
  // 3D globe vs flat 2D map — only relevant on the "Dünya" view. Default
  // to 3D so first impression stays the dramatic globe; user can flip
  // for a quick equirectangular reference view.
  const [worldRender, setWorldRender] = useState<"3d" | "2d">("3d");
  // ⚡ Mobil performans: 3D globe = react-globe.gl (three.js + WebGL) çok ağır
  // (büyük JS + 4K doku + WebGL render). Mobilde "Dünya" görünümü VARSAYILAN
  // olarak hafif 2D haritaya düşer → three.js/doku İNMEZ, ana-iş parçacığı
  // rahatlar. Kullanıcı isterse toggle ile 3D'ye geçebilir. Masaüstü aynen 3D.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches) {
      setWorldRender("2d");
    }
  }, []);
  // Selected international country (yurtdisi mode) — drives the side card +
  // the globe's pointOfView fly-to.
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // Counter that bumps each time "Bayi Bul" is clicked — drives a one-shot
  // pulse on every region marker so the visitor learns the map is clickable.
  const [hintBeacon, setHintBeacon] = useState(0);
  // Two consecutive Bayi Bul clicks (within 1.2s) → show a fake cursor
  // tap-animation on the Ege pin so the visitor sees an explicit demo.
  const [cursorBeacon, setCursorBeacon] = useState(0);
  const clickCountRef = useRef(0);
  const clickResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Clear cross-tab leftover state so a Marmara hover from yurtiçi doesn't
  // keep the rep card open under the globe and vice-versa.
  useEffect(() => {
    if (viewMode === "yurtdisi") {
      setHoveredCity(null);
      setSelectedCity(null);
    } else {
      setSelectedCountry(null);
    }
  }, [viewMode]);

  // Hash deep-link: when the footer's "İhracat / Export" link sets
  // location.hash to "#dealer-export", auto-switch to the Yurtdışı tab so
  // the export contact card renders immediately, then scroll into view.
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash !== "#dealer-export") return;
      setViewMode("yurtdisi");
      // Defer to next paint so the yurtdışı layout is in the DOM.
      setTimeout(() => {
        document.getElementById("dealer-export")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Yabancı dilde ilk görünüm DÜNYA olmalı (kullanıcı isteği, 2026-08-07):
  // yabancı ziyaretçi için anlamlı yüzey Türkiye bayi listesi değil,
  // uluslararası distribütör ağı. Türkçe'de yurt içi varsayılan KALIR.
  //
  // ⚠️ `useState` başlangıç değeri YETMEZ: dil localStorage'dan okunuyor,
  //    yani ilk render'da "tr" gelip hidrasyondan sonra gerçek dile
  //    dönüyor. Bu yüzden `lang` değişimini izleyen bir effect gerekiyor.
  // ⚠️ Kullanıcı sekmeyi elle değiştirdiyse ezilmez — effect yalnız `lang`
  //    dizesi DEĞİŞİNCE çalışır. #dealer-export derin bağlantısı da
  //    korunur (yukarıdaki effect ile çakışmasın).
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#dealer-export") return;
    setViewMode(lang === "tr" ? "yurtici" : "yurtdisi");
  }, [lang]);

  // International distributors come from the editable content bin. Filter
  // active rows + sort by countryName for a stable, alphabetical side list.
  const internationalDealers = (dealerSection.internationalDealers ?? []).filter(c => c.active);
  const sortedIntl = [...internationalDealers].sort((a, b) =>
    a.countryName.localeCompare(b.countryName, "tr")
  );
  const selectedIntl = selectedCountry
    ? internationalDealers.find(c => c.id === selectedCountry)
    : null;

  useEffect(() => {
    fetch("/api/dealers")
      .then((r) => r.json())
      .then((d) => setDealers(d))
      .catch(() => {});
  }, []);

  // Başlangıçta HİÇBİR bölge seçili DEĞİL (kullanıcı isteği) — eski otomatik
  // "ilk bayili bölgeyi seç" davranışı kaldırıldı. Kullanıcı aşağıdaki
  // "Bölge seçin" dropdown'ından (her zaman görünür) veya haritadan seçer.
  // Dropdown seçenekleri için: en az bir bayisi olan bölgeler.
  // ⚠️ BURSA_HQ ("merkez") listeye DAHİL: 2026-07-29'da Bursa ve Eskişehir bu
  // bölgeye bağlandı, artık kendi bayileri var → dropdown'da da görünmeli.
  // Genel müdürlük olduğu için en başta listelenir.
  const regionsWithDealers = [BURSA_HQ as typeof REGIONS[number], ...REGIONS].filter((region) =>
    Object.keys(dealers).some(
      (cid) => CITY_BY_ID[cid]?.region === region.id && (dealers[cid]?.dealers?.length ?? 0) > 0,
    ),
  );

  // Bölge SEÇİMİ (tıklama) değişince şehir filtresi sıfırlanır. Hover
  // tetiklemez — yoksa kullanıcı şehir filtresi seçmişken mouse başka
  // bölgenin üstünden geçtiğinde filtre kayboluyordu.
  useEffect(() => {
    setCityFilter(null);
  }, [selectedCity]);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Yurtiçi "Bayi Bul" handler — scrolls the dealer section into view AND
  // bumps the hint counter so every region marker pulses once. Visitors who
  // miss the map's affordance learn it's clickable. A second click within
  // 1.2s plays a more explicit cursor-tap demo on the Ege pin.
  const findDealerHint = () => {
    document.querySelector("#dealer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setHintBeacon((n) => n + 1);
    clickCountRef.current += 1;
    if (clickResetRef.current) clearTimeout(clickResetRef.current);
    clickResetRef.current = setTimeout(() => { clickCountRef.current = 0; }, 1200);
    if (clickCountRef.current >= 2) {
      setCursorBeacon((n) => n + 1);
      clickCountRef.current = 0;
    }
  };

  // Group cities present in dealers data by region (via TURKEY_CITIES map).
  // Cities with unknown region are ignored on the map but stay in admin data.
  const citiesByRegion: Record<string, string[]> = {};
  for (const cityId of Object.keys(dealers)) {
    const r = CITY_BY_ID[cityId]?.region;
    if (r) (citiesByRegion[r] ||= []).push(cityId);
  }

  // Liste yalnızca tıkladığı bölgeye bağlı — başka bölge pin'inin üstünden
  // mouse geçmek listeyi değiştirmesin. hoveredCity state'i sadece haritada
  // görsel highlight (pin parıltısı) için kullanılır, dealer listesini
  // etkilemez.
  const activeCity = selectedCity;
  // Resolve from REGIONS first, then fall back to the BURSA_HQ virtual region
  // so the "merkez" pin can drive the rep card without owning any dealer cities.
  const activeRegion =
    REGIONS.find((r) => r.id === activeCity) ??
    (activeCity === BURSA_HQ.id ? BURSA_HQ : undefined);
  const activeRegionCities = activeRegion ? (citiesByRegion[activeRegion.id] ?? []) : [];
  // Bölgenin tüm bayilerini şehir etiketiyle birlikte topla; sonra cityFilter
  // varsa o şehre süz. Liste görünümünde her kart artık hangi şehirden olduğunu
  // taşır (ileride göstermek istenirse hazır).
  const allRegionDealers = activeRegionCities.flatMap((cityId) =>
    (dealers[cityId]?.dealers ?? []).map((dealer) => ({
      ...dealer,
      _cityId: cityId,
      _cityLabel: CITY_BY_ID[cityId]?.label ?? cityId,
    })),
  );
  const activeDealers = cityFilter
    ? allRegionDealers.filter((d) => d._cityId === cityFilter)
    : allRegionDealers;
  const activeCityLabel = activeRegion ? regionLabel(activeRegion) : undefined;
  // Bemis regional reps matched on regionId — birden fazla temsilci olabilir.
  // Sadece en az bir alan dolu olan rep'ler render edilir; boş kayıtlar gizli.
  const activeReps = activeRegion
    ? (dealerSection.regionReps ?? []).filter((r) =>
        r.regionId === activeRegion.id &&
        ((r.name && r.name.trim().length > 0) ||
         (r.phone && r.phone.trim().length > 0) ||
         (r.email && r.email.trim().length > 0))
      )
    : [];
  const hasActiveRep = activeReps.length > 0;
  // Geriye dönük uyumluluk: card üst kısmında tekil isim/ünvan placeholder.
  const activeRep = activeReps[0];

  // Touch devices synthesize mouseenter/mouseleave around tap, which would
  // flicker hoveredCity on/off. Gate hover state on real pointing devices.
  const handleCityEnter = (region: typeof REGIONS[0], e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    setHoveredCity(region.id);
  };

  const handleCityLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    setHoveredCity(null);
  };

  const handleCityClick = (region: typeof REGIONS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCity(selectedCity === region.id ? null : region.id);
  };

  const sectionBgUrl = sectionBgs?.["dealer"] ?? "";

  return (
    <section
      id="dealer"
      className="relative py-8 lg:py-12 overflow-hidden"
      style={{ background: d ? "linear-gradient(155deg, #111116 0%, #0d0d11 60%, #101013 100%)" : "linear-gradient(155deg, #f3f4f8 0%, #f7f8fb 60%, #f5f6fa 100%)" }}
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-7">
          <motion.span
            key={`label-${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: d ? `${BLUE}18` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`, color: d ? "#93C5FD" : BLUE }}
          >
            {viewMode === "yurtdisi"
              ? (dealerSection.worldSection?.sectionLabel ?? L("Küresel Distribütör Ağı", "Global Distributor Network"))
              : <E field="dealer.sectionLabel" tag="span">{dealerSection.sectionLabel}</E>}
          </motion.span>
          <motion.h2
            key={`heading-${viewMode}`}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black"
            style={{ color: d ? "#ffffff" : "#111111" }}
          >
            {viewMode === "yurtdisi"
              ? (dealerSection.worldSection?.heading ?? L("Dünyaya Açılan Bemis", "Bemis Across the World"))
              : <E field="dealer.heading">{dealerSection.heading}</E>}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="h-px w-24 origin-left mt-3"
            style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-3"
          >
            {/* Intro card — content swaps based on viewMode */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: `linear-gradient(135deg, ${BLUE}12 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${BLUE}28`,
              }}
            >
              <h3 className="font-bold text-base mb-1.5" style={{ color: d ? "#ffffff" : "#111111" }}>
                {viewMode === "yurtdisi"
                  ? (dealerSection.worldSection?.introTitle ?? L("Bursa'dan Dünyaya", "From Bursa to the World"))
                  : <E field="dealer.findDealerTitle">{dealerSection.findDealerTitle}</E>}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)" }}>
                {viewMode === "yurtdisi"
                  ? (dealerSection.worldSection?.introDescription
                      ?? L("Bursa merkezli üretim tesisimizden Avrupa, Balkanlar, Orta Doğu, Türk dünyası, Kuzey Afrika ve Amerika'ya uzanan distribütör ağımızla EV şarj çözümlerini globalde sunuyoruz.",
                           "From our production facility in Bursa we deliver EV charging solutions worldwide, through a distributor network reaching Europe, the Balkans, the Middle East, the Turkic world, North Africa and the Americas."))
                  : <E field="dealer.description" tag="span">{dealerSection.description}</E>}
              </p>
              {viewMode === "yurtdisi" ? (
                /* Direct export-team contact card — replaces the scroll-to-form
                   button so visitors get the email/phone immediately. Linked
                   from the footer "İhracat / Export" link via #dealer-export. */
                <div
                  id="dealer-export"
                  className="rounded-xl p-3 space-y-2"
                  style={{
                    background: d ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.65)",
                    border: `1px solid ${BLUE}35`,
                    boxShadow: `inset 0 0 0 1px ${BLUE}12`,
                  }}
                >
                  <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: `1px solid ${BLUE}25` }}>
                    <RiCustomerService2Line style={{ color: d ? "#93C5FD" : BLUE, fontSize: 14 }} />
                    <p className="text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: d ? "#93C5FD" : BLUE }}>
                      {L("İhracat Departmanı", "Export Department")}
                    </p>
                  </div>
                  {dealerSection.exportContact?.title && (
                    <p className="text-xs" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
                      {dealerSection.exportContact.title}
                    </p>
                  )}
                  {dealerSection.exportContact?.email && (
                    <a
                      href={`mailto:${dealerSection.exportContact.email}`}
                      className="text-sm flex items-center gap-2 transition-colors hover:underline"
                      style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                    >
                      <HiMail className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                      {dealerSection.exportContact.email}
                    </a>
                  )}
                  {dealerSection.exportContact?.phone && (
                    <a
                      href={`tel:${dealerSection.exportContact.phone.replace(/[^\d+]/g, "")}`}
                      className="text-sm flex items-center gap-2 transition-colors hover:underline"
                      style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                    >
                      <HiPhone className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                      {dealerSection.exportContact.phone}
                    </a>
                  )}
                  {dealerSection.exportContact?.whatsapp && (
                    <a
                      href={`https://wa.me/${waNumber(dealerSection.exportContact.whatsapp)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm flex items-center gap-2 transition-colors hover:underline"
                      style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                    >
                      <RiWhatsappLine className="flex-shrink-0" size={14} style={{ color: "#25D366" }} />
                      {dealerSection.exportContact.whatsapp}
                    </a>
                  )}
                  {dealerSection.exportContact?.hours && (
                    <p className="text-[11px] flex items-center gap-1.5 italic" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>
                      <HiClock className="flex-shrink-0" size={11} />
                      {dealerSection.exportContact.hours}
                    </p>
                  )}
                  {!dealerSection.exportContact?.email && !dealerSection.exportContact?.phone && !dealerSection.exportContact?.whatsapp && (
                    <p className="text-xs italic" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)" }}>
                      {L("İhracat iletişim bilgileri henüz eklenmedi.", "Export contact details have not been added yet.")}
                    </p>
                  )}

                  {/* Multilingual support badge — corporate message for B2B
                      buyers reassuring them they can be served in their own
                      language. Languages list comes from CMS. */}
                  {(dealerSection.worldSection?.languages?.length ?? 0) > 0 && (
                    <div
                      className="mt-1 pt-2.5"
                      style={{ borderTop: `1px solid ${BLUE}25` }}
                    >
                      <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1.5" style={{ color: d ? "#93C5FD" : BLUE }}>
                        {L("Çok Dilli Yetkili Personel", "Multilingual Support Team")}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(dealerSection.worldSection?.languages ?? []).map((code) => {
                          const meta = LANG_META[code.toLowerCase()];
                          return (
                            <span
                              key={code}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold pl-1 pr-2 py-0.5 rounded-full"
                              style={{
                                background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                border: `1px solid ${BLUE}30`,
                                color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.78)",
                              }}
                              title={meta?.label ?? code.toUpperCase()}
                            >
                              {meta ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={`https://flagcdn.com/w40/${meta.cc}.png`}
                                  srcSet={`https://flagcdn.com/w80/${meta.cc}.png 2x`}
                                  alt=""
                                  width={18}
                                  height={13}
                                  className="rounded-[2px]"
                                  style={{ objectFit: "cover", boxShadow: "0 0 0 1px rgba(0,0,0,0.18)" }}
                                  loading="lazy"
                                />
                              ) : (
                                <span style={{ fontSize: 12, lineHeight: 1 }}>🌐</span>
                              )}
                              {meta?.label ?? code.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.58)" }}>
                        {dealerSection.worldSection?.languagesNote
                          ?? L("Kurumsal müşterilerimize yerel dilde satış ve teknik destek sunan çok dilli yetkili personel hizmetimiz mevcuttur.",
                               "Our multilingual team provides corporate customers with sales and technical support in their own language.")}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={findDealerHint}
                  className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all duration-200"
                  style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
                  title={L("Haritadaki bölgeleri vurgular", "Highlights regions on the map")}
                >
                  {L("Bayi Bul", "Find a Dealer")}
                  <HiArrowRight />
                </button>
              )}
            </div>

            {/* Stats — counts swap with viewMode (cities↔countries) */}
            <div className="grid grid-cols-2 gap-2.5">
              {(viewMode === "yurtdisi"
                ? [
                    { value: String(sortedIntl.length),                 label: L("Aktif Ülke", "Active Countries") },
                    { value: String(new Set(sortedIntl.map(c => {
                        // Bucket continent by lng band — rough but useful as a stat
                        if (c.lng > -25 && c.lng < 60 && c.lat > 30) return "EU";
                        if (c.lng >= 25 && c.lng < 75 && c.lat <= 30) return "ME";
                        if (c.lng < -25) return "AM";
                        if (c.lng >= 75) return "AS";
                        return "AF";
                      })).size),                                          label: L("Kıta", "Continents") },
                  ]
                : [
                    { value: dealerSection.statCities,  label: dealerSection.citiesLabel   },
                    { value: dealerSection.statDealers, label: dealerSection.activeDealersLabel },
                  ]
              ).map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center"
                  style={{ background: `${BLUE}0e`, border: `1px solid ${BLUE}22` }}
                >
                  <p className="text-2xl font-black" style={{ color: d ? "#93C5FD" : "#1D4ED8" }}>{item.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)" }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* Bölge seçici — modern ÖZEL dropdown (native <select> yerine).
                Harita pinine tıklamaya gerek yok; tasarım odaklı açılır liste:
                pin ikonu + bayi sayısı rozeti + aktif/hover durumları. */}
            {viewMode === "yurtici" && regionsWithDealers.length > 0 && (() => {
              const regionCount = (rid: string) => Object.keys(dealers).reduce(
                (n, cid) => (CITY_BY_ID[cid]?.region === rid ? n + (dealers[cid]?.dealers?.length ?? 0) : n),
                0,
              );
              const activeRegion = regionsWithDealers.find((r) => r.id === selectedCity);
              return (
                <div
                  ref={regionMenuRef}
                  className="relative flex flex-col gap-1.5 rounded-xl px-3.5 py-3"
                  style={{ background: `${BLUE}0c`, border: `1px solid ${BLUE}22` }}
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: d ? "#93C5FD" : BLUE }}>
                    <RiMapPin2Line style={{ fontSize: 14 }} />
                    {L("Bölgenizi seçin — size en yakın yetkili bayileri görün", "Select your region — see the authorised dealers nearest you")}
                  </span>

                  {/* Tetikleyici buton */}
                  <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setRegionOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={regionOpen}
                    className="group w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: d ? "rgba(255,255,255,0.06)" : "#ffffff",
                      border: `1px solid ${regionOpen ? BLUE : d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
                      color: activeRegion ? (d ? "#ffffff" : "#111111") : (d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)"),
                      boxShadow: regionOpen ? `0 0 0 3px ${BLUE}22` : "none",
                    }}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0" style={{ background: `${BLUE}18`, color: d ? "#93C5FD" : BLUE }}>
                      <RiMapPin2Line style={{ fontSize: 13 }} />
                    </span>
                    <span className="flex-1 text-left truncate">
                      {activeRegion ? regionLabel(activeRegion) : L("Bölge seçin…", "Select region…")}
                    </span>
                    {activeRegion && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${BLUE}1a`, color: d ? "#93C5FD" : BLUE }}>
                        {regionCount(activeRegion.id)} {L("bayi", "dealers")}
                      </span>
                    )}
                    <RiArrowDownSLine className="flex-shrink-0 transition-transform duration-200" style={{ fontSize: 18, color: d ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", transform: regionOpen ? "rotate(180deg)" : "none" }} />
                  </button>

                  {/* Açılır liste — AnimatePresence KULLANMADAN koşullu mount:
                      DealerNetwork sık yeniden render olduğu için AnimatePresence
                      çıkış-animasyonlu düğümü opacity:0'da DOM'da bırakıyordu
                      (görünmez ama tıklamayı yutan katman = bug). Koşullu mount
                      kapanınca ANINDA unmount eder; giriş animasyonu korunur. */}
                  {regionOpen && menuPos && typeof document !== "undefined" && createPortal(
                      <motion.div
                        ref={menuNodeRef}
                        role="listbox"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-xl overflow-hidden p-1.5"
                        style={{
                          position: "fixed",
                          top: menuPos.top, left: menuPos.left, width: menuPos.width,
                          zIndex: 9999,
                          background: d ? "#1a1a22" : "#ffffff",
                          border: `1px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
                          boxShadow: d ? "0 12px 36px rgba(0,0,0,0.55)" : "0 12px 36px rgba(0,0,0,0.14)",
                          maxHeight: 288, overflowY: "auto",
                        }}
                      >
                        {/* Temizle satırı — bir bölge seçiliyse */}
                        {activeRegion && (
                          <button
                            type="button"
                            onClick={() => { setSelectedCity(null); setCityFilter(null); setRegionOpen(false); }}
                            className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors mb-0.5"
                            style={{ color: d ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span className="flex items-center justify-center w-6 h-6 flex-shrink-0"><HiX style={{ fontSize: 13 }} /></span>
                            {L("Seçimi temizle (tüm bölgeler)", "Clear selection (all regions)")}
                          </button>
                        )}
                        {regionsWithDealers.map((r) => {
                          const count = regionCount(r.id);
                          const isActive = r.id === selectedCity;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              onClick={() => { setSelectedCity(isActive ? null : r.id); setCityFilter(null); setRegionOpen(false); }}
                              className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-semibold transition-colors text-left"
                              style={{ background: isActive ? `${BLUE}14` : "transparent", color: d ? "#ffffff" : "#111111" }}
                              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.035)"; }}
                              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                            >
                              <span className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0" style={{ background: isActive ? BLUE : `${BLUE}14`, color: isActive ? "#ffffff" : (d ? "#93C5FD" : BLUE) }}>
                                <RiMapPin2Line style={{ fontSize: 13 }} />
                              </span>
                              <span className="flex-1 truncate">{regionLabel(r)}</span>
                              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", color: d ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)" }}>
                                {count} {L("bayi", "dealers")}
                              </span>
                              {isActive && <RiCheckLine className="flex-shrink-0" style={{ fontSize: 16, color: d ? "#93C5FD" : BLUE }} />}
                            </button>
                          );
                        })}
                      </motion.div>,
                      document.body
                  )}
                </div>
              );
            })()}

            {/* The Bemis-rep card used to live above the dealer list here.
                Moved out under the map (right column) so it doesn't push
                the dealer list down when a region is hovered/selected. */}

            {/* Active city dealer list (yurtiçi only) */}
            {viewMode === "yurtici" && activeCity && activeDealers.length > 0 && (
              <motion.div
                key={activeCity}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4"
                style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <RiMapPin2Line style={{ color: d ? "#93C5FD" : BLUE, fontSize: 14 }} />
                  <p className="font-semibold text-sm" style={{ color: d ? "#ffffff" : "#111111" }}>{activeCityLabel}</p>
                  <span className="text-xs" style={{ color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.40)" }}>· {activeDealers.length} bayi</span>

                  <div className="flex-1" />

                  {/* Şehir filtresi — bölgede birden fazla şehir varsa görünür.
                      Native <select> ile küçük bir dropdown; Tümü + bölge
                      şehirleri. */}
                  {activeRegionCities.length > 1 && (
                    <select
                      value={cityFilter ?? ""}
                      onChange={(e) => setCityFilter(e.target.value || null)}
                      aria-label={L("Şehir filtresi", "City filter")}
                      className="text-xs font-semibold rounded-md px-2 py-1 cursor-pointer focus:outline-none transition-colors"
                      style={{
                        background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
                        color: d ? "#ffffff" : "#111111",
                      }}
                    >
                      <option value="">{L("Tüm şehirler", "All cities")}</option>
                      {activeRegionCities.map((cid) => (
                        <option key={cid} value={cid}>
                          {CITY_BY_ID[cid]?.label ?? cid}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Listeyi kapat */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity(null);
                      setHoveredCity(null);
                      setCityFilter(null);
                    }}
                    aria-label="Listeyi kapat"
                    className="flex items-center justify-center rounded-md transition-colors"
                    style={{
                      width: 24,
                      height: 24,
                      background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                      border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
                      color: d ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                    }}
                  >
                    <HiX size={14} />
                  </button>
                </div>
                {/* Scrollable kart konteyneri — sayfa aşağı doğru aşırı
                    uzamasın diye max-height + overflow-y. Header sabit
                    kalır, sadece kart listesi içeride scroll olur. Sağa
                    küçük bir padding ile scrollbar kart içeriğine
                    yapışmasın. */}
                <div
                  className="space-y-3 overflow-y-auto pr-1 -mr-1"
                  style={{ maxHeight: "min(60vh, 520px)" }}
                >
                {activeDealers.map((dealer, i) => {
                  const muted = d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.55)";
                  const phoneDigits = (s: string) => s.replace(/[^\d+]/g, "");
                  const tColor = tierColor(dealer.tier);
                  const tLabel = tierLabel(dealer.tier);
                  return (
                    <div key={i} className="pt-3 first:pt-0" style={{ borderTop: i > 0 ? `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` : "none" }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        {/* Tier badge — colored brand-mark circle communicates
                            dealer status (Standart / Stratejik / Çözüm Ortağı) */}
                        <span
                          className="inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
                          style={{
                            width: 22, height: 22,
                            background: tColor,
                            border: "1.5px solid rgba(255,255,255,0.9)",
                            boxShadow: `0 0 0 1px ${tColor}66, 0 2px 5px ${tColor}40`,
                          }}
                          title={tLabel}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/favicon-white-192.png" alt="" width={18} height={18} style={{ objectFit: "contain", padding: 2 }} />
                        </span>
                        <p className="text-sm font-semibold flex-1" style={{ color: d ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.80)" }}>{dealer.name}</p>
                      </div>
                      <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: tColor }}>
                        {tLabel}
                      </p>
                      {dealer.contactPerson && (
                        <p className="text-xs flex items-center gap-1 mb-1" style={{ color: muted }}>
                          <HiUser className="flex-shrink-0" />
                          {dealer.contactPerson}
                        </p>
                      )}
                      {dealer.address && (
                        <p className="text-sm flex items-start gap-1 mb-1 mt-1" style={{ color: muted }}>
                          <HiLocationMarker className="flex-shrink-0 mt-0.5" />
                          {dealer.address}
                        </p>
                      )}
                      {dealer.workingHours && (
                        <p className="text-xs flex items-center gap-1 mb-1" style={{ color: muted }}>
                          <HiClock className="flex-shrink-0" />
                          {dealer.workingHours}
                        </p>
                      )}
                      {dealer.phone && (
                        <a href={`tel:${phoneDigits(dealer.phone)}`} className="text-sm flex items-center gap-1 transition-colors hover:underline" style={{ color: muted }}>
                          <HiPhone className="flex-shrink-0" />
                          {dealer.phone}
                        </a>
                      )}
                      {dealer.whatsapp && (
                        <a href={`https://wa.me/${waNumber(dealer.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1 transition-colors hover:underline" style={{ color: muted }}>
                          <RiWhatsappLine className="flex-shrink-0" />
                          {dealer.whatsapp}
                        </a>
                      )}
                      {dealer.email && (
                        <a href={`mailto:${dealer.email}`} className="text-sm flex items-center gap-1 transition-colors hover:underline" style={{ color: muted }}>
                          <HiMail className="flex-shrink-0" />
                          {dealer.email}
                        </a>
                      )}
                      {dealer.website && (
                        <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1 transition-colors hover:underline" style={{ color: muted }}>
                          <RiGlobalLine className="flex-shrink-0" />
                          <span className="truncate">{dealer.website.replace(/^https?:\/\//, "")}</span>
                        </a>
                      )}
                      {(dealer.mapUrl || dealer.address) && (
                        <a href={dealerMapHref(dealer)} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 mt-1.5 transition-colors hover:underline" style={{ color: d ? "#93C5FD" : BLUE }}>
                          <HiExternalLink className="flex-shrink-0" />
                          {L("Haritada Aç", "Open in Maps")}
                        </a>
                      )}
                      {dealer.notes && (
                        <p className="text-xs mt-1.5 italic" style={{ color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.40)" }}>
                          {dealer.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
                </div>
              </motion.div>
            )}

            {viewMode === "yurtici" && !activeCity && (
              <p className="text-xs text-center py-2" style={{ color: d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.35)" }}>
                <E field="dealer.mapHint" tag="span">{dealerSection.mapHint}</E>
              </p>
            )}

            {/* International distributors list (yurtdışı only) */}
            {viewMode === "yurtdisi" && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30` }}
              >
                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${BLUE}20` }}>
                  <RiGlobalLine style={{ color: d ? "#93C5FD" : BLUE, fontSize: 14 }} />
                  <p className="font-semibold text-sm" style={{ color: d ? "#ffffff" : "#111111" }}>{L("Distribütör Ülkeler", "Distributor Countries")}</p>
                  <span className="text-xs ml-auto" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>{sortedIntl.length} {L("ülke", "countries")}</span>
                </div>

                {sortedIntl.length === 0 ? (
                  <p className="text-xs text-center py-5 px-4" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>
                    {L("Aktif uluslararası distribütör henüz tanımlanmadı.", "No active international distributors have been added yet.")}
                  </p>
                ) : (
                  <div className="max-h-[260px] overflow-y-auto">
                    {sortedIntl.map((c) => {
                      const isSelected = selectedCountry === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCountry(isSelected ? null : c.id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                          style={{
                            background: isSelected ? (d ? `${BLUE}25` : `${BLUE}15`) : "transparent",
                            borderTop: `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                          }}
                          onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
                          onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                        >
                          {/* Country flag — flagcdn.com cross-platform PNG so
                              Windows shows real flags instead of CC letters. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://flagcdn.com/w40/${c.countryCode.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w80/${c.countryCode.toLowerCase()}.png 2x`}
                            alt={c.countryName}
                            width={24}
                            height={18}
                            className="rounded-sm flex-shrink-0"
                            style={{ objectFit: "cover", boxShadow: "0 0 0 1px rgba(0,0,0,0.18)" }}
                            loading="lazy"
                          />
                          <span
                            className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: `${BLUE}22`, color: d ? "#cfe1ff" : "#1D4ED8", border: `1px solid ${BLUE}30` }}
                          >
                            {c.countryCode}
                          </span>
                          <span className="text-sm font-semibold flex-1" style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}>
                            {c.countryName}
                          </span>
                          {c.distributorName && (
                            <span className="text-xs truncate max-w-[120px]" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>
                              {c.distributorName}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Selected country detail card */}
                {selectedIntl && (
                  <motion.div
                    key={`intl-${selectedIntl.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                    style={{ borderTop: `1px solid ${BLUE}30` }}
                  >
                    <div className="p-4 space-y-2">
                      {selectedIntl.distributorName && (
                        <p className="text-sm font-semibold" style={{ color: d ? "#ffffff" : "#111111" }}>
                          {selectedIntl.distributorName}
                        </p>
                      )}
                      {selectedIntl.contactPerson && (
                        <p className="text-xs flex items-center gap-1.5" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.60)" }}>
                          <HiUser className="flex-shrink-0" />{selectedIntl.contactPerson}
                        </p>
                      )}
                      {(selectedIntl.city || selectedIntl.address) && (
                        <p className="text-xs flex items-start gap-1.5" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.60)" }}>
                          <HiLocationMarker className="flex-shrink-0 mt-0.5" />
                          <span>{[selectedIntl.city, selectedIntl.address].filter(Boolean).join(" · ")}</span>
                        </p>
                      )}
                      {selectedIntl.phone && (
                        <a href={`tel:${selectedIntl.phone.replace(/[^\d+]/g, "")}`} className="text-xs flex items-center gap-1.5 hover:underline" style={{ color: d ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
                          <HiPhone className="flex-shrink-0" />{selectedIntl.phone}
                        </a>
                      )}
                      {selectedIntl.whatsapp && (
                        <a href={`https://wa.me/${waNumber(selectedIntl.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 hover:underline" style={{ color: d ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
                          <RiWhatsappLine className="flex-shrink-0" />{selectedIntl.whatsapp}
                        </a>
                      )}
                      {selectedIntl.email && (
                        <a href={`mailto:${selectedIntl.email}`} className="text-xs flex items-center gap-1.5 hover:underline" style={{ color: d ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
                          <HiMail className="flex-shrink-0" />{selectedIntl.email}
                        </a>
                      )}
                      {selectedIntl.website && (
                        <a href={selectedIntl.website} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 hover:underline" style={{ color: d ? "#93C5FD" : BLUE }}>
                          <RiGlobalLine className="flex-shrink-0" />
                          <span className="truncate">{selectedIntl.website.replace(/^https?:\/\//, "")}</span>
                        </a>
                      )}
                      {selectedIntl.notes && (
                        <p className="text-xs italic" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>
                          {selectedIntl.notes}
                        </p>
                      )}
                      {!selectedIntl.distributorName && !selectedIntl.email && !selectedIntl.phone && (
                        <p className="text-xs italic" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)" }}>
                          {L("Bu ülke için detay henüz eklenmedi.", "No details have been added for this country yet.")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right — Interactive Turkey Map / 3D World Globe */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            {/* View tabs — Türkiye (Turkey map) / Dünya (3D globe) */}
            <div
              className="flex rounded-xl p-1 mb-3 max-w-xs"
              style={{
                background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${BLUE}22`,
              }}
            >
              {(["yurtici", "yurtdisi"] as const).map((m) => {
                const active = viewMode === m;
                const label = m === "yurtici" ? "Türkiye" : L("Dünya", "World");
                return (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                    style={{
                      background: active ? (d ? `${BLUE}28` : `${BLUE}18`) : "transparent",
                      color: active ? (d ? "#cfe1ff" : "#1D4ED8") : (d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)"),
                      border: active ? `1px solid ${BLUE}55` : "1px solid transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {viewMode === "yurtdisi" ? (
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: d
                    ? "linear-gradient(155deg, #050a14 0%, #070d18 100%)"
                    : "linear-gradient(155deg, #e2eaf5 0%, #ecf2fa 100%)",
                  border: `1px solid ${BLUE}22`,
                }}
              >
                {worldRender === "3d" ? (
                  <InternationalGlobe
                    dark={d}
                    countries={dealerSection.internationalDealers ?? []}
                    selectedId={selectedCountry}
                    onSelect={(id) => setSelectedCountry(id)}
                  />
                ) : (
                  <InternationalMap2D
                    dark={d}
                    countries={dealerSection.internationalDealers ?? []}
                    selectedId={selectedCountry}
                    onSelect={(id) => setSelectedCountry(id)}
                  />
                )}

                {/* 3D ↔ 2D toggle — sits top-left so it doesn't collide
                    with the country-count badge at top-right. */}
                <div
                  className="absolute top-3 left-3 flex p-1 rounded-full backdrop-blur z-20"
                  style={{
                    background: d ? "rgba(8,12,22,0.65)" : "rgba(255,255,255,0.85)",
                    border: `1px solid ${BLUE}45`,
                    boxShadow: `0 4px 14px ${BLUE}22`,
                  }}
                >
                  {(["3d", "2d"] as const).map((mode) => {
                    const active = worldRender === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setWorldRender(mode)}
                        className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase transition-all"
                        style={{
                          background: active ? BLUE : "transparent",
                          color: active ? "#ffffff" : (d ? "rgba(207,225,255,0.65)" : "rgba(29,78,216,0.65)"),
                          boxShadow: active ? `0 2px 8px ${BLUE}55` : "none",
                        }}
                      >
                        {mode.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
            <div
              className="relative rounded-2xl overflow-hidden select-none"
              style={{
                background: d ? "linear-gradient(155deg, #060d18 0%, #080f1c 100%)" : "linear-gradient(155deg, #dde8f5 0%, #e4edf8 100%)",
                border: `1px solid ${BLUE}22`,
              }}
              onClick={() => setSelectedCity(null)}
            >
              {/* Dot grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, ${BLUE}14 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Turkey PNG map image */}
              <div className="relative w-full">
                <Image
                  src="/images/turkey-map.png"
                  alt={L("Türkiye Haritası", "Türkiye map")}
                  width={1327}
                  height={621}
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="w-full h-auto block"
                  style={{
                    filter: d ? "invert(1) brightness(0.92)" : "brightness(0.55) sepia(0.2)",
                    opacity: 0.90,
                  }}
                  draggable={false}
                  loading="lazy"
                />

                {/* Logo overlay — covers original top-right PNG logo */}
                <div
                  className="absolute top-0 right-0 flex items-center justify-end pointer-events-none"
                  style={{
                    width: "26%",
                    height: "17%",
                    background: d ? "linear-gradient(155deg, #060d18 0%, #080f1c 100%)" : "linear-gradient(155deg, #dde8f5 0%, #e4edf8 100%)",
                    padding: "8px 14px",
                  }}
                >
                  <img
                    src={logos?.dark || "/logo-white.png"}
                    alt="Bemis E-V Charge"
                    style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.85, filter: d ? undefined : "brightness(0)" }}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* City markers SVG overlay — same aspect ratio as image (1327×621) */}
                <svg
                  ref={svgRef}
                  viewBox="0 0 1327 621"
                  className="absolute inset-0 w-full h-full"
                  style={{ display: "block" }}
                >
                  {REGIONS.map((region, i) => {
                    const regionCities = citiesByRegion[region.id] ?? [];
                    const hasDealers = regionCities.some((cid) => (dealers[cid]?.dealers?.length ?? 0) > 0);
                    const isActive = activeCity === region.id;
                    const isHighlight = region.highlight;

                    return (
                      <motion.g
                        key={region.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                        style={{ cursor: "pointer" }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${regionLabel(region)}`}
                        onPointerEnter={(e) => handleCityEnter(region, e)}
                        onPointerLeave={(e) => handleCityLeave(e)}
                        onClick={(e) => handleCityClick(region, e as unknown as React.MouseEvent)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCityClick(region, e as unknown as React.MouseEvent); } }}
                      >
                        {/* Invisible mobile-friendly tap target. The
                            visible pin is ~31px radius in viewBox units,
                            which shrinks to a few real pixels on phones.
                            This 60-radius transparent disc keeps the hit
                            area finger-sized regardless of viewport scale. */}
                        <circle
                          cx={region.cx} cy={region.cy}
                          r={60}
                          fill="transparent"
                          style={{ pointerEvents: "all" }}
                        />
                        {/* One-shot hint ring — re-mounts each time the user
                            clicks "Bayi Bul" so every region briefly pulses,
                            cueing visitors that the markers are clickable. */}
                        {hintBeacon > 0 && (
                          <motion.circle
                            key={`hint-${hintBeacon}-${region.id}`}
                            cx={region.cx} cy={region.cy}
                            r={28}
                            fill="none"
                            stroke={BLUE}
                            strokeWidth="3"
                            initial={{ r: 28, opacity: 0.95 }}
                            animate={{ r: 90, opacity: 0 }}
                            transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.08 }}
                          />
                        )}
                        {/* Pulse ring */}
                        {(isHighlight || isActive) && (
                          <motion.circle
                            cx={region.cx} cy={region.cy}
                            r={isActive ? 54 : 42}
                            fill="none"
                            stroke={isActive ? `${BLUE}88` : `${BLUE}55`}
                            strokeWidth="2"
                            animate={{ r: [isActive ? 42 : 32, isActive ? 74 : 62], opacity: [0.75, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity }}
                          />
                        )}
                        {/* Outer ring */}
                        <circle
                          cx={region.cx} cy={region.cy}
                          r={isActive ? 40 : isHighlight ? 35 : 31}
                          fill={isActive ? `${BLUE}26` : hasDealers ? `${BLUE}1a` : d ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)"}
                          stroke={isActive ? `${BLUE}ee` : hasDealers ? `${BLUE}cc` : d ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.30)"}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        {/* Inner dot */}
                        <circle
                          cx={region.cx} cy={region.cy}
                          r={isActive ? 20 : isHighlight ? 17 : 15}
                          fill={isActive ? BLUE : hasDealers ? `${BLUE}ff` : d ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.35)"}
                          style={{ transition: "r 0.2s, fill 0.2s" }}
                        />
                        {/* Label — always white with a soft dark shadow so it
                            stays legible on both dark and light map themes. */}
                        <text
                          x={region.cx} y={region.cy + 60}
                          textAnchor="middle"
                          fontSize="26"
                          fill="#ffffff"
                          fontFamily="inherit"
                          fontWeight={isActive ? "800" : "700"}
                          style={{
                            pointerEvents: "none",
                            userSelect: "none",
                            paintOrder: "stroke",
                            stroke: "rgba(0,0,0,0.55)",
                            strokeWidth: 4,
                            strokeLinejoin: "round",
                          }}
                        >
                          {regionLabel(region)}
                        </text>
                      </motion.g>
                    );
                  })}

                  {/* Bursa HQ pin — sits on top of Marmara as a distinct red
                      headquarters marker. Hover/click loads the "merkez"
                      regional rep, independent of the Marmara dealer list. */}
                  {(() => {
                    const isMerkezActive = activeCity === BURSA_HQ.id;
                    const outerR = isMerkezActive ? 26 : 20;
                    const dotR = isMerkezActive ? 18 : 14;
                    const logoSize = isMerkezActive ? 28 : 22;
                    return (
                  <motion.g
                    key="bursa-hq"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.95 }}
                    style={{ cursor: "pointer" }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${regionLabel(BURSA_HQ)} — ${L("bayileri göster", "show dealers")}`}
                    onPointerEnter={(e) => handleCityEnter(BURSA_HQ as typeof REGIONS[number], e)}
                    onPointerLeave={(e) => handleCityLeave(e)}
                    onClick={(e) => handleCityClick(BURSA_HQ as typeof REGIONS[number], e as unknown as React.MouseEvent)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCityClick(BURSA_HQ as typeof REGIONS[number], e as unknown as React.MouseEvent); } }}
                  >
                    {/* Invisible mobile-friendly tap target — same
                        finger-sized disc treatment as the region markers. */}
                    <circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={60}
                      fill="transparent"
                      style={{ pointerEvents: "all" }}
                    />
                    {/* Hint pulse — same one-shot beacon as region markers */}
                    {hintBeacon > 0 && (
                      <motion.circle
                        key={`hint-${hintBeacon}-merkez`}
                        cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                        r={20}
                        fill="none"
                        stroke={HQ_RED}
                        strokeWidth="3"
                        initial={{ r: 20, opacity: 1 }}
                        animate={{ r: 75, opacity: 0 }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                      />
                    )}
                    {/* Pulse — bigger + brighter when active, mirroring the
                        other region markers' hover behaviour. */}
                    <motion.circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={isMerkezActive ? 40 : 28}
                      fill="none"
                      stroke={isMerkezActive ? `${HQ_RED}cc` : `${HQ_RED}88`}
                      strokeWidth={isMerkezActive ? 3 : 2}
                      animate={{
                        r: [isMerkezActive ? 30 : 22, isMerkezActive ? 60 : 50],
                        opacity: [isMerkezActive ? 0.95 : 0.85, 0],
                      }}
                      transition={{ duration: isMerkezActive ? 1.8 : 2.2, repeat: Infinity }}
                    />
                    {/* Outer ring */}
                    <circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={outerR}
                      fill={isMerkezActive ? `${HQ_RED}3a` : `${HQ_RED}26`}
                      stroke={HQ_RED}
                      strokeWidth={isMerkezActive ? 3.5 : 2.5}
                      style={{ transition: "r 0.2s, stroke-width 0.2s, fill 0.2s" }}
                    />
                    {/* Solid red dot — backdrop for the white-on-transparent
                        favicon sourced from /icon (same image as browser tab). */}
                    <circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={dotR}
                      fill={HQ_RED}
                      style={{ transition: "r 0.2s" }}
                    />
                    {/* Brand mark (favicon) clipped to the dot */}
                    <defs>
                      <clipPath id="merkez-logo-clip">
                        <circle cx={BURSA_HQ.cx} cy={BURSA_HQ.cy} r={dotR - 1} />
                      </clipPath>
                    </defs>
                    <image
                      href="/favicon-white-192.png"
                      x={BURSA_HQ.cx - logoSize / 2}
                      y={BURSA_HQ.cy - logoSize / 2}
                      width={logoSize}
                      height={logoSize}
                      clipPath="url(#merkez-logo-clip)"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ pointerEvents: "none", transition: "x 0.2s, y 0.2s, width 0.2s, height 0.2s" }}
                    />
                    {/* Label — placed BELOW the pin so it doesn't collide
                        with Marmara's region label which sits just above. */}
                    <text
                      x={BURSA_HQ.cx} y={BURSA_HQ.cy + (isMerkezActive ? 44 : 38)}
                      textAnchor="middle"
                      fontSize={isMerkezActive ? 24 : 20}
                      fontWeight={isMerkezActive ? 900 : 800}
                      fill={HQ_RED}
                      style={{ pointerEvents: "none", userSelect: "none", fontFamily: "inherit", transition: "y 0.2s, font-size 0.2s" }}
                    >MERKEZ</text>
                  </motion.g>
                    );
                  })()}

                  {/* Demo cursor — fades in above-right of Ege pin, glides to
                      the pin centre, "taps" with a ripple, then fades out.
                      Triggered when the visitor double-presses Bayi Bul. */}
                  {cursorBeacon > 0 && (() => {
                    const ege = REGIONS.find(r => r.id === "ege")!;
                    return (
                      <motion.g
                        key={`ege-cursor-${cursorBeacon}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 1, 0] }}
                        transition={{ duration: 2.6, times: [0, 0.18, 0.6, 0.85, 1] }}
                        style={{ pointerEvents: "none" }}
                      >
                        {/* Click ripple at the pin centre */}
                        <motion.circle
                          cx={ege.cx} cy={ege.cy}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth={2.5}
                          initial={{ r: 22, opacity: 0 }}
                          animate={{ r: [22, 80], opacity: [0, 0.95, 0] }}
                          transition={{ duration: 0.85, delay: 1.05, times: [0, 0.15, 1] }}
                        />
                        {/* Glide the cursor from offset to the pin tip */}
                        <motion.g
                          initial={{ x: ege.cx + 60, y: ege.cy - 60 }}
                          animate={{ x: [ege.cx + 60, ege.cx, ege.cx], y: [ege.cy - 60, ege.cy, ege.cy] }}
                          transition={{ duration: 2.6, times: [0, 0.45, 1], ease: "easeOut" }}
                        >
                          {/* Mouse arrow — tip at (0,0), drop-shadow for legibility */}
                          <motion.g
                            animate={{ scale: [1, 1, 0.82, 1, 1] }}
                            transition={{ duration: 2.6, times: [0, 0.45, 0.55, 0.7, 1] }}
                            style={{ transformOrigin: "0px 0px" }}
                          >
                            <path
                              d="M0,0 L0,32 L9,24 L14,36 L19,34 L14,22 L24,22 Z"
                              fill="#ffffff"
                              stroke="#0b0f1a"
                              strokeWidth={2}
                              strokeLinejoin="round"
                              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.55))" }}
                            />
                          </motion.g>
                        </motion.g>
                      </motion.g>
                    );
                  })()}
                </svg>
              </div>

              <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
                <span className="text-[9px] tracking-widest uppercase" style={{ color: `${BLUE}70` }}>
                  <E field="dealer.mapTitle" tag="span">{dealerSection.mapTitle}</E>
                </span>
              </div>
            </div>
            )}

            {/* Bemis regional rep card — sits directly under the map.
                AnimatePresence + height/opacity drives a smooth open for
                EVERY hovered/selected region (not just rep-filled ones).
                Empty fields hide gracefully so the layout stays consistent.
                Suppressed in yurtdisi mode — international tab has its
                own side card. */}
            <AnimatePresence initial={false}>
              {viewMode === "yurtici" && activeCity && activeRegion && (
                <motion.div
                  key={`rep-under-map-${activeCity}`}
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="overflow-hidden mt-3"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: d
                        ? `linear-gradient(135deg, ${BLUE}1F 0%, ${BLUE}10 100%)`
                        : `linear-gradient(135deg, ${BLUE}14 0%, ${BLUE}08 100%)`,
                      border: `1px solid ${BLUE}45`,
                      boxShadow: `0 0 0 1px ${BLUE}15, 0 6px 22px ${BLUE}25`,
                    }}
                  >
                    {/* Tek bölgeye birden fazla temsilci atanabiliyor; her
                        temsilci için ayrı satır. Tek temsilcisi olanlar eskisi
                        gibi tek satır olarak render olur. */}
                    <div className="px-5 py-4 flex flex-col divide-y" style={{ borderColor: "transparent" }}>
                      {activeReps.map((rep, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                          style={{
                            // Her rep aynı min yükseklikte — bazı rep'lerde
                            // whatsapp / subregion / uzun title olsa da diğerleri
                            // kompakt kalsa da kart tutarlı görünür.
                            minHeight: 96,
                            paddingTop: i === 0 ? 0 : 14,
                            paddingBottom: i === activeReps.length - 1 ? 0 : 14,
                            borderTop: i > 0 ? `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}` : "none",
                          }}
                        >
                          {/* Identity — sabit genişlik, sabit 4 satır slot
                              (eyebrow, ad, ünvan, alt bölge). Eksik alanlarda
                              da yer rezerve edilir → her rep aynı boyut. */}
                          <div className="flex items-center gap-3 flex-shrink-0 sm:w-[280px]">
                            <span
                              className="inline-flex items-center justify-center rounded-full overflow-hidden"
                              style={{
                                width: 38, height: 38,
                                background: "#E11D48",
                                border: "1px solid rgba(225,29,72,0.55)",
                                boxShadow: "0 0 0 2px rgba(225,29,72,0.20), 0 4px 10px rgba(225,29,72,0.20)",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/favicon-white-192.png"
                                alt="Bemis E-V Charge"
                                width={32}
                                height={32}
                                className="object-contain"
                                style={{ padding: 3 }}
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold tracking-[0.18em] uppercase leading-tight" style={{ color: d ? "#93C5FD" : BLUE }}>
                                Bemis Yetkilisi
                              </p>
                              <p className="text-sm font-semibold leading-tight mt-1" style={{ color: d ? "#ffffff" : "#111111" }}>
                                {(rep.name || activeCityLabel || "").trim()}
                              </p>
                              <p className="text-xs leading-tight mt-0.5" style={{ color: d ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.60)" }}>
                                {(rep.title || `${activeCityLabel ?? ""} ${L("Bölge Temsilcisi", "Regional Representative")}`).trim()}
                              </p>
                              {/* Subregion slot — boş ise görünmez ama 16px
                                  yer kaplar → her rep'in identity bloğu 4
                                  satırlık eşit yüksekliği korur. */}
                              <p
                                className="text-[11px] font-medium leading-tight mt-0.5 inline-flex items-center gap-1"
                                style={{
                                  color: d ? "#93C5FD" : BLUE,
                                  minHeight: 16,
                                  visibility: rep.subregion && rep.subregion.trim().length > 0 ? "visible" : "hidden",
                                }}
                              >
                                <HiLocationMarker size={11} className="flex-shrink-0" />
                                {rep.subregion?.trim() || "—"}
                              </p>
                            </div>
                          </div>

                          {/* Vertical divider — desktop only, between identity and contact */}
                          <div
                            className="hidden sm:block w-px self-stretch"
                            style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)" }}
                          />

                          {/* Contact rows — sabit dizilim: phone, email,
                              whatsapp her zaman aynı sıra. Eksik field için
                              yer ayrılır (visibility hidden) → her rep'in
                              contact bloğu aynı yükseklikte. flex-col ile
                              satırlar alt alta sabit. */}
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <a
                              href={rep.phone ? `tel:${rep.phone.replace(/[^\d+]/g, "")}` : undefined}
                              className="text-sm flex items-center gap-2 transition-colors hover:underline"
                              style={{
                                color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)",
                                visibility: rep.phone ? "visible" : "hidden",
                                minHeight: 20,
                              }}
                            >
                              <HiPhone className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                              {rep.phone || "—"}
                            </a>
                            <a
                              href={rep.email ? `mailto:${rep.email}` : undefined}
                              className="text-sm flex items-center gap-2 transition-colors hover:underline"
                              style={{
                                color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)",
                                visibility: rep.email ? "visible" : "hidden",
                                minHeight: 20,
                              }}
                            >
                              <HiMail className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                              {rep.email || "—"}
                            </a>
                            <a
                              href={rep.whatsapp ? `https://wa.me/${waNumber(rep.whatsapp)}` : undefined}
                              target={rep.whatsapp ? "_blank" : undefined}
                              rel={rep.whatsapp ? "noopener noreferrer" : undefined}
                              className="text-sm flex items-center gap-2 transition-colors hover:underline"
                              style={{
                                color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)",
                                visibility: rep.whatsapp ? "visible" : "hidden",
                                minHeight: 20,
                              }}
                            >
                              <RiWhatsappLine className="flex-shrink-0" size={14} style={{ color: d ? "#86EFAC" : "#22C55E" }} />
                              {rep.whatsapp || "—"}
                            </a>
                            {!rep.phone && !rep.email && !rep.whatsapp && (
                              <p className="text-xs italic absolute" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>
                                {L("İletişim bilgileri için aşağıdaki forma yazabilirsiniz.", "You can use the form below to request contact details.")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
