"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { HiArrowRight, HiPhone, HiLocationMarker, HiMail, HiUser, HiClock, HiExternalLink } from "react-icons/hi";
import { RiStoreLine, RiMapPin2Line, RiWhatsappLine, RiGlobalLine, RiAwardLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import E from "./E";
import { CITY_BY_ID } from "../../lib/turkeyCities";
import InternationalGlobe from "./InternationalGlobe";

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
  // Selected international country (yurtdisi mode) — drives the side card +
  // the globe's pointOfView fly-to.
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
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
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}35`, color: d ? "#93C5FD" : BLUE }}
          >
            <E field="dealer.sectionLabel" tag="span">{dealerSection.sectionLabel}</E>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black"
            style={{ color: d ? "#ffffff" : "#111111" }}
          >
            <E field="dealer.heading">{dealerSection.heading}</E>
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
            {/* Bayi Bul */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: `linear-gradient(135deg, ${BLUE}12 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${BLUE}28`,
              }}
            >
              <RiStoreLine style={{ color: d ? "#93C5FD" : BLUE, fontSize: 20, marginBottom: 12 }} />
              <h3 className="font-bold text-base mb-1.5" style={{ color: d ? "#ffffff" : "#111111" }}><E field="dealer.findDealerTitle">{dealerSection.findDealerTitle}</E></h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)" }}>
                <E field="dealer.description" tag="span">{dealerSection.description}</E>
              </p>
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all duration-200"
                style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
              >
                <E field="dealer.contactBtnLabel" tag="span">{dealerSection.contactBtnLabel}</E>
                <HiArrowRight />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { value: dealerSection.statCities,  label: dealerSection.citiesLabel   },
                { value: dealerSection.statDealers, label: dealerSection.activeDealersLabel },
              ].map((item, i) => (
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
                className="rounded-2xl p-4 space-y-3"
                style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <RiMapPin2Line style={{ color: d ? "#93C5FD" : BLUE, fontSize: 14 }} />
                  <p className="font-semibold text-sm" style={{ color: d ? "#ffffff" : "#111111" }}>{activeCityLabel}</p>
                  <span className="text-xs" style={{ color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.40)" }}>· {activeDealers.length} bayi</span>
                </div>
                {activeDealers.map((dealer, i) => {
                  const muted = d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.55)";
                  const phoneDigits = (s: string) => s.replace(/[^\d+]/g, "");
                  return (
                    <div key={i} className="pt-3 first:pt-0" style={{ borderTop: i > 0 ? `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` : "none" }}>
                      <p className="text-sm font-semibold" style={{ color: d ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.80)" }}>{dealer.name}</p>
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
                          <span
                            className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded"
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
            {/* View tabs — Yurtiçi (Turkey map) / Yurtdışı (3D globe) */}
            <div
              className="flex rounded-xl p-1 mb-3 max-w-xs"
              style={{
                background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${BLUE}22`,
              }}
            >
              {(["yurtici", "yurtdisi"] as const).map((m) => {
                const active = viewMode === m;
                const label = m === "yurtici" ? "Yurtiçi" : "Yurtdışı";
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
                <InternationalGlobe
                  dark={d}
                  countries={dealerSection.internationalDealers ?? []}
                  selectedId={selectedCountry}
                  onSelect={(id) => setSelectedCountry(id)}
                />
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
                        {/* Label */}
                        <text
                          x={region.cx} y={region.cy + 60}
                          textAnchor="middle"
                          fontSize="26"
                          fill={isActive ? (d ? "#93C5FD" : "#1D4ED8") : hasDealers ? `${BLUE}ee` : d ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.55)"}
                          fontFamily="inherit"
                          fontWeight={isActive ? "800" : "700"}
                          style={{ transition: "fill 0.2s", pointerEvents: "none", userSelect: "none" }}
                        >
                          {region.label}
                        </text>
                      </motion.g>
                    );
                  })}

                  {/* Bursa HQ pin — sits on top of Marmara as a distinct red
                      headquarters marker. Hover/click loads the "merkez"
                      regional rep, independent of the Marmara dealer list. */}
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
                    {/* Pulse */}
                    <motion.circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={28}
                      fill="none"
                      stroke={`${HQ_RED}88`}
                      strokeWidth="2"
                      animate={{ r: [22, 50], opacity: [0.85, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                    {/* Outer ring */}
                    <circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={20}
                      fill={`${HQ_RED}26`}
                      stroke={HQ_RED}
                      strokeWidth="2.5"
                    />
                    {/* Solid red dot */}
                    <circle
                      cx={BURSA_HQ.cx} cy={BURSA_HQ.cy}
                      r={11}
                      fill={HQ_RED}
                    />
                    {/* HQ glyph (small star) */}
                    <text
                      x={BURSA_HQ.cx} y={BURSA_HQ.cy + 5}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="900"
                      fill="#ffffff"
                      style={{ pointerEvents: "none", userSelect: "none", fontFamily: "inherit" }}
                    >★</text>
                    {/* Label — placed BELOW the pin so it doesn't collide
                        with Marmara's region label which sits just above. */}
                    <text
                      x={BURSA_HQ.cx} y={BURSA_HQ.cy + 38}
                      textAnchor="middle"
                      fontSize="20"
                      fontWeight="800"
                      fill={HQ_RED}
                      style={{ pointerEvents: "none", userSelect: "none", fontFamily: "inherit" }}
                    >MERKEZ</text>
                  </motion.g>
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
                AnimatePresence + height/opacity drives a smooth open
                when a region with a filled rep gets hovered/selected;
                collapses back when the user moves off. */}
            <AnimatePresence initial={false}>
              {activeCity && hasActiveRep && activeRep && (
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
                            width: 36, height: 36,
                            background: "#ffffff",
                            border: `1px solid ${BLUE}55`,
                            boxShadow: `0 0 0 2px ${BLUE}18`,
                          }}
                        >
                          {/* Use the same /icon route the browser uses for the URL
                              favicon — guarantees both match pixel-for-pixel. */}
                          <img
                            src="/icon"
                            alt="Bemis E-V Charge"
                            width={28}
                            height={28}
                            className="object-contain"
                            style={{ padding: 2 }}
                          />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: d ? "#93C5FD" : BLUE }}>
                            Bemis Yetkilisi
                          </p>
                          <p className="text-sm font-semibold leading-tight mt-0.5" style={{ color: d ? "#ffffff" : "#111111" }}>
                            {activeRep.name || activeCityLabel}
                          </p>
                          <p className="text-xs" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
                            {activeRep.title || `${activeCityLabel} Bölge Temsilcisi`}
                          </p>
                        </div>
                      </div>

                      {/* Divider — vertical on desktop, horizontal on mobile */}
                      <div
                        className="hidden sm:block w-px self-stretch"
                        style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)" }}
                      />

                      {/* Contact rows — phone + email only (no WhatsApp) */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 flex-wrap">
                        {activeRep.phone && (
                          <a
                            href={`tel:${activeRep.phone.replace(/[^\d+]/g, "")}`}
                            className="text-sm flex items-center gap-2 transition-colors hover:underline"
                            style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                          >
                            <HiPhone className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                            {activeRep.phone}
                          </a>
                        )}
                        {activeRep.email && (
                          <a
                            href={`mailto:${activeRep.email}`}
                            className="text-sm flex items-center gap-2 transition-colors hover:underline"
                            style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}
                          >
                            <HiMail className="flex-shrink-0" size={14} style={{ color: d ? "#93C5FD" : BLUE }} />
                            {activeRep.email}
                          </a>
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
