"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { HiArrowRight, HiPhone, HiLocationMarker } from "react-icons/hi";
import { RiStoreLine, RiMapPin2Line } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import E from "./E";

const BLUE = "#3B82F6";

type Dealer = { name: string; address: string; phone: string };
type DealersData = Record<string, { dealers: Dealer[] }>;

// Region centers calibrated to the 1327×621 Turkey map image (7 coğrafi bölge)
const REGIONS = [
  { id: "marmara",    label: "Marmara",          cx: 222,  cy: 170, highlight: true,  cities: ["istanbul", "bursa"] },
  { id: "ege",        label: "Ege",               cx: 148,  cy: 355, highlight: false, cities: ["izmir"] },
  { id: "akdeniz",    label: "Akdeniz",           cx: 500,  cy: 488, highlight: false, cities: ["antalya", "mersin", "adana"] },
  { id: "ic_anadolu", label: "İç Anadolu",        cx: 555,  cy: 295, highlight: false, cities: ["ankara", "konya", "kayseri"] },
  { id: "karadeniz",  label: "Karadeniz",         cx: 740,  cy: 108, highlight: false, cities: ["samsun", "trabzon"] },
  { id: "dogu",       label: "Doğu Anadolu",      cx: 1048, cy: 258, highlight: false, cities: ["erzurum"] },
  { id: "guneydogu",  label: "Güneydoğu",         cx: 895,  cy: 435, highlight: false, cities: ["gaziantep", "diyarbakir"] },
];

export default function DealerNetwork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { dealer: dealerSection, sectionBgs } = useContent();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [dealers, setDealers] = useState<DealersData>({});
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch("/api/dealers")
      .then((r) => r.json())
      .then((d) => setDealers(d))
      .catch(() => {});
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const activeCity = hoveredCity || selectedCity;
  const activeRegion = REGIONS.find((r) => r.id === activeCity);
  const activeDealers = activeRegion
    ? activeRegion.cities.flatMap((cityId) => dealers[cityId]?.dealers ?? [])
    : [];
  const activeCityLabel = activeRegion?.label;

  const handleCityEnter = (region: typeof REGIONS[0]) => {
    setHoveredCity(region.id);
  };

  const handleCityLeave = () => {
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
      style={{ background: d ? "linear-gradient(180deg, #1a1a1a 0%, #141414 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)" }}
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
            className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}35`, color: d ? "#93C5FD" : BLUE }}
          >
            <E field="dealer.sectionLabel" tag="span">{dealerSection.sectionLabel}</E>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black"
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
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
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


            {/* Active city dealer list */}
            {activeCity && activeDealers.length > 0 && (
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
                {activeDealers.map((dealer, i) => (
                  <div key={i} className="pt-3 first:pt-0" style={{ borderTop: i > 0 ? `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` : "none" }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: d ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.80)" }}>{dealer.name}</p>
                    <p className="text-sm flex items-start gap-1 mb-1" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.55)" }}>
                      <HiLocationMarker className="flex-shrink-0 mt-0.5" />
                      {dealer.address}
                    </p>
                    {dealer.phone && (
                      <a href={`tel:${dealer.phone.replace(/[^\d+]/g, "")}`} className="text-sm flex items-center gap-1 transition-colors" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.55)" }}>
                        <HiPhone className="flex-shrink-0" />
                        {dealer.phone}
                      </a>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {!activeCity && (
              <p className="text-xs text-center py-2" style={{ color: d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.35)" }}>
                <E field="dealer.mapHint" tag="span">{dealerSection.mapHint}</E>
              </p>
            )}
          </motion.div>

          {/* Right — Interactive Turkey Map */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
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
                    src={d ? "/logo-white.png" : "/logo-black.png"}
                    alt="Bemis E-V Charge"
                    style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.85 }}
                    draggable={false}
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
                    const hasDealers = region.cities.some((cid) => (dealers[cid]?.dealers?.length ?? 0) > 0);
                    const isActive = activeCity === region.id;
                    const isHighlight = region.highlight;

                    return (
                      <motion.g
                        key={region.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => handleCityEnter(region)}
                        onMouseLeave={handleCityLeave}
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
                </svg>
              </div>

              <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
                <span className="text-[9px] tracking-widest uppercase" style={{ color: `${BLUE}70` }}>
                  <E field="dealer.mapTitle" tag="span">{dealerSection.mapTitle}</E>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
