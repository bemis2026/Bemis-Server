"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { HiArrowRight, HiPhone, HiLocationMarker, HiMail, HiUser, HiClock, HiExternalLink } from "react-icons/hi";
import { RiMapPin2Line, RiWhatsappLine, RiGlobalLine, RiAwardLine, RiCustomerService2Line } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import E from "./E";
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

export default function DealerNetwork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { dealer: dealerSection, sectionBgs, logos } = useContent();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [dealers, setDealers] = useState<DealersData>({});
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // Tabs: yurtici = Turkey SVG map, yurtdisi = 3D globe with international markets.
  const [viewMode, setViewMode] = useState<"yurtici" | "yurtdisi">("yurtici");
  // 3D globe vs flat 2D map — only relevant on the "Dünya" view. Default
  // to 3D so first impression stays the dramatic globe; user can flip
  // for a quick equirectangular reference view.
  const [worldRender, setWorldRender] = useState<"3d" | "2d">("3d");
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

  // Bayiler yüklendiğinde, eğer kullanıcı hiçbir region seçmemişse,
  // ilk bayisi olan region'ı otomatik olarak seç → bayi listesi
  // ilk açılışta hemen görünür (önceden boş bir map duruyordu, kullanıcı
  // pin'e tıklamadan bayiler gizli kalıyordu).
  useEffect(() => {
    if (selectedCity || hoveredCity) return;
    const dealerCities = Object.keys(dealers);
    if (dealerCities.length === 0) return;
    for (const region of REGIONS) {
      const hasDealers = dealerCities.some(
        (cid) => CITY_BY_ID[cid]?.region === region.id && (dealers[cid]?.dealers?.length ?? 0) > 0,
      );
      if (hasDealers) {
        setSelectedCity(region.id);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealers]);

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

  const activeCity = hoveredCity || selectedCity;
  // Resolve from REGIONS first, then fall back to the BURSA_HQ virtual region
  // so the "merkez" pin can drive the rep card without owning any dealer cities.
  const activeRegion =
    REGIONS.find((r) => r.id === activeCity) ??
    (activeCity === BURSA_HQ.id ? BURSA_HQ : undefined);
  const activeRegionCities = activeRegion ? (citiesByRegion[activeRegion.id] ?? []) : [];
  const activeDealers = activeRegionCities.flatMap((cityId) => dealers[cityId]?.dealers ?? []);
  const activeCityLabel = activeRegion?.label;
  // Bemis regional rep matched on regionId. Only render the card when at
  // least the rep's name or phone is set — empty default reps stay hidden.
  const activeRep = activeRegion
    ? (dealerSection.regionReps ?? []).find((r) => r.regionId === activeRegion.id)
    : undefined;
  const hasActiveRep = !!activeRep && (
    (activeRep.name && activeRep.name.trim().length > 0) ||
    (activeRep.phone && activeRep.phone.trim().length > 0) ||
    (activeRep.email && activeRep.email.trim().length > 0)
  );

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
            style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}35`, color: d ? "#93C5FD" : BLUE }}
          >
            {viewMode === "yurtdisi"
              ? (dealerSection.worldSection?.sectionLabel ?? "Küresel Distribütör Ağı")
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
              ? (dealerSection.worldSection?.heading ?? "Dünyaya Açılan Bemis")
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
                  ? (dealerSection.worldSection?.introTitle ?? "Bursa'dan Dünyaya")
                  : <E field="dealer.findDealerTitle">{dealerSection.findDealerTitle}</E>}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)" }}>
                {viewMode === "yurtdisi"
                  ? (dealerSection.worldSection?.introDescription ?? "")
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
                      İhracat Departmanı
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
                      href={`https://wa.me/${dealerSection.exportContact.whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, "")}`}
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
                      İhracat iletişim bilgileri henüz eklenmedi.
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
                        Çok Dilli Yetkili Personel
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
                      {dealerSection.worldSection?.languagesNote && (
                        <p className="text-[11px] leading-relaxed" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.58)" }}>
                          {dealerSection.worldSection.languagesNote}
                        </p>
                      )}
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
                  title="Haritadaki bölgeleri vurgular"
                >
                  Bayi Bul
                  <HiArrowRight />
                </button>
              )}
            </div>

            {/* Stats — counts swap with viewMode (cities↔countries) */}
            <div className="grid grid-cols-2 gap-2.5">
              {(viewMode === "yurtdisi"
                ? [
                    { value: String(sortedIntl.length),                 label: "Aktif Ülke" },
                    { value: String(new Set(sortedIntl.map(c => {
                        // Bucket continent by lng band — rough but useful as a stat
                        if (c.lng > -25 && c.lng < 60 && c.lat > 30) return "EU";
                        if (c.lng >= 25 && c.lng < 75 && c.lat <= 30) return "ME";
                        if (c.lng < -25) return "AM";
                        if (c.lng >= 75) return "AS";
                        return "AF";
                      })).size),                                          label: "Kıta" },
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
                        <a href={`https://wa.me/${phoneDigits(dealer.whatsapp).replace(/^\+/, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1 transition-colors hover:underline" style={{ color: muted }}>
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
                      {dealer.mapUrl && (
                        <a href={dealer.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 mt-1.5 transition-colors hover:underline" style={{ color: d ? "#93C5FD" : BLUE }}>
                          <HiExternalLink className="flex-shrink-0" />
                          Haritada Aç
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
                  <p className="font-semibold text-sm" style={{ color: d ? "#ffffff" : "#111111" }}>Distribütör Ülkeler</p>
                  <span className="text-xs ml-auto" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>{sortedIntl.length} ülke</span>
                </div>

                {sortedIntl.length === 0 ? (
                  <p className="text-xs text-center py-5 px-4" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)" }}>
                    Aktif uluslararası distribütör henüz tanımlanmadı.
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
                        <a href={`https://wa.me/${selectedIntl.whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 hover:underline" style={{ color: d ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}>
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
                          Bu ülke için detay henüz eklenmedi.
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
                const label = m === "yurtici" ? "Türkiye" : "Dünya";
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
                <img
                  src="/images/turkey-map.png"
                  alt="Türkiye Haritası"
                  className="w-full block"
                  style={{
                    filter: d ? "invert(1) brightness(0.92)" : "brightness(0.55) sepia(0.2)",
                    opacity: 0.90,
                  }}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
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
                        onPointerEnter={(e) => handleCityEnter(region, e)}
                        onPointerLeave={(e) => handleCityLeave(e)}
                        onClick={(e) => handleCityClick(region, e as unknown as React.MouseEvent)}
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
                          {region.label}
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
                    onPointerEnter={(e) => handleCityEnter(BURSA_HQ as typeof REGIONS[number], e)}
                    onPointerLeave={(e) => handleCityLeave(e)}
                    onClick={(e) => handleCityClick(BURSA_HQ as typeof REGIONS[number], e as unknown as React.MouseEvent)}
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
                    <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Identity */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className="inline-flex items-center justify-center rounded-full overflow-hidden"
                          style={{
                            width: 38, height: 38,
                            // Brand red — matches /icon's generated fallback so a
                            // white-on-transparent favicon stays visible.
                            background: "#E11D48",
                            border: "1px solid rgba(225,29,72,0.55)",
                            boxShadow: "0 0 0 2px rgba(225,29,72,0.20), 0 4px 10px rgba(225,29,72,0.20)",
                          }}
                        >
                          {/* Use the same /icon route the browser uses for the URL
                              favicon — guarantees both match pixel-for-pixel. */}
                          <img
                            src="/favicon-white-192.png"
                            alt="Bemis E-V Charge"
                            width={32}
                            height={32}
                            className="object-contain"
                            style={{ padding: 3 }}
                          />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: d ? "#93C5FD" : BLUE }}>
                            Bemis Yetkilisi
                          </p>
                          <p className="text-sm font-semibold leading-tight mt-0.5" style={{ color: d ? "#ffffff" : "#111111" }}>
                            {activeRep?.name || activeCityLabel}
                          </p>
                          <p className="text-xs" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
                            {activeRep?.title || `${activeCityLabel} Bölge Temsilcisi`}
                          </p>
                        </div>
                      </div>

                      {/* Divider — vertical on desktop, horizontal on mobile */}
                      <div
                        className="hidden sm:block w-px self-stretch"
                        style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)" }}
                      />

                      {/* Contact rows — phone + email only (no WhatsApp).
                          When neither is filled, show a soft placeholder so
                          the card layout stays the same across regions. */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 flex-wrap">
                        {activeRep?.phone && (
                          <a
                            href={`tel:${activeRep.phone.replace(/[^\d+]/g, "")}`}
                            className="text-sm flex items-center gap-2 transition-colors hover:underline"
                            style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                          >
                            <HiPhone className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                            {activeRep.phone}
                          </a>
                        )}
                        {activeRep?.email && (
                          <a
                            href={`mailto:${activeRep.email}`}
                            className="text-sm flex items-center gap-2 transition-colors hover:underline"
                            style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                          >
                            <HiMail className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                            {activeRep.email}
                          </a>
                        )}
                        {!activeRep?.phone && !activeRep?.email && (
                          <p className="text-xs italic" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)" }}>
                            İletişim bilgileri için aşağıdaki forma yazabilirsiniz.
                          </p>
                        )}
                      </div>
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
