"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { HiArrowRight, HiPhone, HiLocationMarker } from "react-icons/hi";
import { RiStoreLine, RiFileAddLine, RiMapPin2Line } from "react-icons/ri";
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
  const { dealer: dealerSection } = useContent();
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

  return (
    <section
      id="dealer"
      className="py-8 lg:py-12 overflow-hidden"
      style={{ background: d ? "linear-gradient(180deg, #1a1a1a 0%, #141414 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)" }}
    >
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}35`, color: "#93C5FD" }}
          >
            <E field="dealer.sectionLabel" tag="span">{dealerSection.sectionLabel}</E>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white"
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
              <RiStoreLine style={{ color: "#93C5FD", fontSize: 20, marginBottom: 12 }} />
              <h3 className="text-white font-bold text-base mb-1.5">Bayi Bul</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-4">
                <E field="dealer.description" tag="span">{dealerSection.description}</E>
              </p>
              <button
                onClick={scrollToContact}
                className="btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
              >
                <span>İletişime Geç</span>
                <HiArrowRight />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { value: dealerSection.statCities,  label: "İlde Bayi"   },
                { value: dealerSection.statDealers, label: "Aktif Bayi" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center"
                  style={{ background: `${BLUE}0e`, border: `1px solid ${BLUE}22` }}
                >
                  <p className="text-2xl font-black" style={{ color: "#93C5FD" }}>{item.value}</p>
                  <p className="text-white/35 text-xs mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Bayi Başvurusu */}
            <div className="bg-white/2 border border-white/6 rounded-xl px-4 py-3 flex items-center gap-3">
              <RiFileAddLine className="text-white/25 text-base flex-shrink-0" />
              <p className="text-white/50 text-xs font-medium leading-snug flex-1 min-w-0">
                <E field="dealer.applyText" tag="span">{dealerSection.applyText}</E>
              </p>
              <button
                onClick={scrollToContact}
                className="text-xs text-white/35 hover:text-white/60 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Başvur
              </button>
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
                  <RiMapPin2Line style={{ color: "#93C5FD", fontSize: 14 }} />
                  <p className="text-white font-semibold text-sm">{activeCityLabel}</p>
                  <span className="text-white/30 text-xs">· {activeDealers.length} bayi</span>
                </div>
                {activeDealers.map((d, i) => (
                  <div key={i} className="border-t border-white/6 pt-3 first:border-0 first:pt-0">
                    <p className="text-white/80 text-xs font-semibold mb-1">{d.name}</p>
                    <p className="text-white/40 text-xs flex items-start gap-1 mb-1">
                      <HiLocationMarker className="flex-shrink-0 mt-0.5" />
                      {d.address}
                    </p>
                    {d.phone && (
                      <a href={`tel:${d.phone.replace(/[^\d+]/g, "")}`} className="text-white/40 text-xs flex items-center gap-1 hover:text-white/70 transition-colors">
                        <HiPhone className="flex-shrink-0" />
                        {d.phone}
                      </a>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {!activeCity && (
              <p className="text-white/20 text-xs text-center py-2">
                Haritada bir bölgeye tıklayın veya üzerine gelin
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
                            r={isActive ? 42 : 32}
                            fill="none"
                            stroke={isActive ? `${BLUE}88` : `${BLUE}55`}
                            strokeWidth="2"
                            animate={{ r: [isActive ? 32 : 24, isActive ? 62 : 50], opacity: [0.75, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity }}
                          />
                        )}
                        {/* Outer ring */}
                        <circle
                          cx={region.cx} cy={region.cy}
                          r={isActive ? 30 : isHighlight ? 26 : 23}
                          fill={isActive ? `${BLUE}26` : hasDealers ? `${BLUE}1a` : "rgba(255,255,255,0.09)"}
                          stroke={isActive ? `${BLUE}ee` : hasDealers ? `${BLUE}cc` : "rgba(255,255,255,0.48)"}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        {/* Inner dot */}
                        <circle
                          cx={region.cx} cy={region.cy}
                          r={isActive ? 15 : isHighlight ? 13 : 11}
                          fill={isActive ? BLUE : hasDealers ? `${BLUE}ff` : "rgba(255,255,255,0.65)"}
                          style={{ transition: "r 0.2s, fill 0.2s" }}
                        />
                        {/* Label */}
                        <text
                          x={region.cx} y={region.cy + 48}
                          textAnchor="middle"
                          fontSize="20"
                          fill={isActive ? "#93C5FD" : hasDealers ? `${BLUE}ee` : "rgba(255,255,255,0.78)"}
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
                  Türkiye Yetkili Bayi Haritası
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
