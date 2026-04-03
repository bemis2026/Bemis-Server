"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RiFlashlightLine, RiLeafLine, RiCalculatorLine, RiCarLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";

// ── EV model database ────────────────────────────────────────────────────────

interface EvModel {
  brand: string;
  model: string;
  battery: number;   // usable kWh
  maxAcKw: number;   // max AC charging power
  maxDcKw: number;   // max DC charging power
  consumption: number; // avg kWh/100km
}

const EV_MODELS: EvModel[] = [
  // Togg
  { brand: "Togg", model: "T10X Standart Range",     battery: 52.4,  maxAcKw: 11, maxDcKw: 150, consumption: 17 },
  { brand: "Togg", model: "T10X Long Range",          battery: 88.5,  maxAcKw: 22, maxDcKw: 200, consumption: 18 },
  // Tesla
  { brand: "Tesla", model: "Model 3 Standart Range",  battery: 60,    maxAcKw: 11, maxDcKw: 170, consumption: 14 },
  { brand: "Tesla", model: "Model 3 Long Range",       battery: 82,    maxAcKw: 11, maxDcKw: 250, consumption: 15 },
  { brand: "Tesla", model: "Model Y Long Range",       battery: 82,    maxAcKw: 11, maxDcKw: 250, consumption: 16 },
  // Hyundai
  { brand: "Hyundai", model: "Ioniq 5 58 kWh",        battery: 58,    maxAcKw: 11, maxDcKw: 220, consumption: 17 },
  { brand: "Hyundai", model: "Ioniq 5 77.4 kWh",      battery: 77.4,  maxAcKw: 11, maxDcKw: 230, consumption: 17 },
  { brand: "Hyundai", model: "Ioniq 6 77.4 kWh",      battery: 77.4,  maxAcKw: 11, maxDcKw: 230, consumption: 15 },
  // Kia
  { brand: "Kia",     model: "EV6 58 kWh",             battery: 58,    maxAcKw: 11, maxDcKw: 185, consumption: 17 },
  { brand: "Kia",     model: "EV6 77.4 kWh",           battery: 77.4,  maxAcKw: 11, maxDcKw: 233, consumption: 17 },
  { brand: "Kia",     model: "EV9 76.1 kWh",           battery: 76.1,  maxAcKw: 11, maxDcKw: 233, consumption: 20 },
  { brand: "Kia",     model: "EV9 99.8 kWh",           battery: 99.8,  maxAcKw: 11, maxDcKw: 233, consumption: 21 },
  // BMW
  { brand: "BMW",     model: "iX3 80 kWh",             battery: 80,    maxAcKw: 11, maxDcKw: 150, consumption: 18 },
  { brand: "BMW",     model: "i4 eDrive40",             battery: 83.9,  maxAcKw: 11, maxDcKw: 200, consumption: 16 },
  { brand: "BMW",     model: "iX xDrive50",             battery: 105.2, maxAcKw: 11, maxDcKw: 200, consumption: 21 },
  // Mercedes
  { brand: "Mercedes", model: "EQA 250",               battery: 66.5,  maxAcKw: 11, maxDcKw: 100, consumption: 18 },
  { brand: "Mercedes", model: "EQB 300",               battery: 66.5,  maxAcKw: 11, maxDcKw: 100, consumption: 19 },
  { brand: "Mercedes", model: "EQC 400",               battery: 80,    maxAcKw: 11, maxDcKw: 110, consumption: 21 },
  { brand: "Mercedes", model: "EQE 350",               battery: 90.6,  maxAcKw: 22, maxDcKw: 170, consumption: 18 },
  { brand: "Mercedes", model: "EQS 450+",              battery: 107.8, maxAcKw: 22, maxDcKw: 200, consumption: 19 },
  // Volkswagen
  { brand: "Volkswagen", model: "ID.3 58 kWh",        battery: 58,    maxAcKw: 11, maxDcKw: 100, consumption: 15 },
  { brand: "Volkswagen", model: "ID.3 77 kWh",        battery: 77,    maxAcKw: 11, maxDcKw: 170, consumption: 15 },
  { brand: "Volkswagen", model: "ID.4 52 kWh",        battery: 52,    maxAcKw: 11, maxDcKw: 100, consumption: 17 },
  { brand: "Volkswagen", model: "ID.4 77 kWh",        battery: 77,    maxAcKw: 11, maxDcKw: 135, consumption: 17 },
  { brand: "Volkswagen", model: "ID.7 77 kWh",        battery: 77,    maxAcKw: 11, maxDcKw: 170, consumption: 16 },
  // Audi
  { brand: "Audi",    model: "Q4 e-tron 82 kWh",      battery: 82,    maxAcKw: 11, maxDcKw: 125, consumption: 18 },
  { brand: "Audi",    model: "e-tron 55 95 kWh",       battery: 95,    maxAcKw: 11, maxDcKw: 150, consumption: 24 },
  // Porsche
  { brand: "Porsche", model: "Taycan 79.2 kWh",       battery: 79.2,  maxAcKw: 11, maxDcKw: 270, consumption: 20 },
  { brand: "Porsche", model: "Taycan 4S 93.4 kWh",    battery: 93.4,  maxAcKw: 22, maxDcKw: 270, consumption: 22 },
  // Volvo
  { brand: "Volvo",   model: "XC40 Recharge 82 kWh",  battery: 82,    maxAcKw: 11, maxDcKw: 150, consumption: 20 },
  { brand: "Volvo",   model: "C40 Recharge 82 kWh",   battery: 82,    maxAcKw: 11, maxDcKw: 150, consumption: 19 },
  // Renault
  { brand: "Renault", model: "Megane E-Tech 60 kWh",  battery: 60,    maxAcKw: 22, maxDcKw: 130, consumption: 15 },
  { brand: "Renault", model: "Zoe 52 kWh",             battery: 52,    maxAcKw: 22, maxDcKw: 50,  consumption: 17 },
  // Peugeot
  { brand: "Peugeot", model: "e-208 50 kWh",          battery: 50,    maxAcKw: 11, maxDcKw: 100, consumption: 15 },
  { brand: "Peugeot", model: "e-2008 50 kWh",         battery: 50,    maxAcKw: 11, maxDcKw: 100, consumption: 16 },
  // Opel
  { brand: "Opel",    model: "Astra Electric 54 kWh", battery: 54,    maxAcKw: 11, maxDcKw: 100, consumption: 15 },
  { brand: "Opel",    model: "Mokka-e 50 kWh",        battery: 50,    maxAcKw: 11, maxDcKw: 100, consumption: 16 },
  // Fiat
  { brand: "Fiat",    model: "500e 42 kWh",            battery: 42,    maxAcKw: 11, maxDcKw: 85,  consumption: 14 },
  // Jeep
  { brand: "Jeep",    model: "Avenger 54 kWh",         battery: 54,    maxAcKw: 11, maxDcKw: 100, consumption: 16 },
  // BYD
  { brand: "BYD",     model: "Atto 3 60 kWh",          battery: 60.48, maxAcKw: 7.4, maxDcKw: 80, consumption: 18 },
  { brand: "BYD",     model: "Han 85 kWh",              battery: 85.44, maxAcKw: 7.4, maxDcKw: 120, consumption: 19 },
  // Nissan
  { brand: "Nissan",  model: "Leaf 40 kWh",             battery: 40,    maxAcKw: 6.6, maxDcKw: 50, consumption: 18 },
  { brand: "Nissan",  model: "Leaf 62 kWh",             battery: 62,    maxAcKw: 6.6, maxDcKw: 50, consumption: 18 },
  // Mini
  { brand: "Mini",    model: "Electric 32.6 kWh",       battery: 32.6,  maxAcKw: 11, maxDcKw: 50, consumption: 16 },
  // Honda
  { brand: "Honda",   model: "e 35.5 kWh",              battery: 35.5,  maxAcKw: 7.4, maxDcKw: 50, consumption: 17 },
];

// Group brands for the select optgroup
const EV_BRANDS = [...new Set(EV_MODELS.map((m) => m.brand))].sort();

// ── Power options ────────────────────────────────────────────────────────────

const AC_POWER_OPTIONS = [
  { label: "2.3 kW", value: 2.3 },
  { label: "3.7 kW", value: 3.7 },
  { label: "7.4 kW", value: 7.4 },
  { label: "11 kW",  value: 11  },
  { label: "22 kW",  value: 22  },
];

const DC_POWER_OPTIONS = [
  { label: "50 kW",  value: 50  },
  { label: "100 kW", value: 100 },
  { label: "150 kW", value: 150 },
  { label: "175 kW", value: 175 },
  { label: "250 kW", value: 250 },
  { label: "350 kW", value: 350 },
];

function bestAcPower(maxAcKw: number): number {
  const valid = AC_POWER_OPTIONS.filter((p) => p.value <= maxAcKw + 0.01);
  return valid.length > 0 ? valid[valid.length - 1].value : 2.3;
}
function bestDcPower(maxDcKw: number): number {
  const valid = DC_POWER_OPTIONS.filter((p) => p.value <= maxDcKw + 0.01);
  return valid.length > 0 ? valid[valid.length - 1].value : 50;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sliderStyle(value: number, min: number, max: number, accent: string): React.CSSProperties {
  const fill = ((value - min) / (max - min)) * 100;
  return { "--slider-accent": accent, "--slider-fill": `${fill}%` } as React.CSSProperties;
}

function fmt(n: number) { return Math.round(n).toLocaleString("tr-TR"); }

// ── Slider sub-component ─────────────────────────────────────────────────────

interface SliderProps {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; accent: string;
  textMuted: string; textPrimary: string;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}

function Slider({ label, value, min, max, step = 1, unit = "", accent, textMuted, textPrimary, onChange, formatValue }: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${value.toLocaleString("tr-TR")}${unit}`;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: textMuted }}>{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>{displayValue}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-slider w-full" style={sliderStyle(value, min, max, accent)} />
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: textMuted }}>{min.toLocaleString("tr-TR")}{unit}</span>
        <span className="text-xs" style={{ color: textMuted }}>{max.toLocaleString("tr-TR")}{unit}</span>
      </div>
    </div>
  );
}

// ── Turkish electricity tariff presets ───────────────────────────────────────
// Sources: TEDAŞ 2024 mesken tarifesi, ortalama kamuya açık AC/DC istasyon fiyatları

const TARIFF_PRESETS = [
  { id: "home",   label: "Ev Elektrigi (TEDAŞ)",         value: 5.5,  desc: "~5-6 ₺/kWh · Mesken tarifesi" },
  { id: "ac",     label: "AC Kamu İstasyonu",             value: 10.0, desc: "~9-11 ₺/kWh · Kamuya açık" },
  { id: "dc-std", label: "DC Hızlı Şarj",                 value: 14.5, desc: "~13-16 ₺/kWh · CCS2/CHAdeMO" },
  { id: "night",  label: "Gece Tarifesi (TEDAŞ)",         value: 3.8,  desc: "~3-4 ₺/kWh · 22:00–06:00" },
];

// ── Tachometer needle sub-component ──────────────────────────────────────────

function TachometerNeedle({ d, blue, mirror = false }: { d: boolean; blue: string; mirror?: boolean }) {
  const CX = 24, CY = 24, R = 18;
  const pt = (deg: number, r: number): [number, number] => {
    const rad = deg * Math.PI / 180;
    return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)];
  };
  const arc = (d1: number, d2: number, r: number) => {
    const [x1, y1] = pt(d1, r);
    const [x2, y2] = pt(d2, r);
    const span = ((d2 - d1) + 360) % 360;
    return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const TICK_ANGLES = [225, 247.5, 270, 292.5, 315, 337.5, 0, 22.5, 45, 67.5, 90, 112.5, 135];
  const MAJOR_AT = new Set([225, 270, 315, 0, 45, 90, 135]);
  const needleAnim = mirror
    ? [55, -50, 30, -45, 10, -55, 0]
    : [-55, 50, -30, 45, -10, 55, 0];
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" className="flex-shrink-0">
      <circle cx={CX} cy={CY} r={R + 5} fill="none"
        stroke={d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"} strokeWidth="1" />
      <path d={arc(225, 135, R)} fill="none"
        stroke={d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)"} strokeWidth="5.5" />
      <path d={arc(225, 315, R)} fill="none" stroke="#22C55E" strokeWidth="3.5" opacity="0.75" />
      <path d={arc(315, 45, R)} fill="none" stroke="#F59E0B" strokeWidth="3.5" opacity="0.75" />
      <path d={arc(45, 135, R)} fill="none" stroke="#EF4444" strokeWidth="3.5" opacity="0.75" />
      {TICK_ANGLES.map((angle) => {
        const major = MAJOR_AT.has(angle);
        const [ox, oy] = pt(angle, R - 0.5);
        const [ix, iy] = pt(angle, major ? R - 5 : R - 3);
        return (
          <line key={angle}
            x1={ox.toFixed(2)} y1={oy.toFixed(2)} x2={ix.toFixed(2)} y2={iy.toFixed(2)}
            stroke={d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.28)"}
            strokeWidth={major ? "1.5" : "0.8"} strokeLinecap="round" />
        );
      })}
      <motion.g
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        animate={{ rotate: needleAnim }}
        transition={{ duration: 4.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: mirror ? 0.35 : 0 }}
      >
        <path d={`M${CX - 1} ${CY + 5} L${CX} ${CY - 13} L${CX + 1} ${CY + 5} L${CX} ${CY + 7} Z`}
          fill="rgba(0,0,0,0.30)" transform="translate(0.8,0.8)" />
        <path d={`M${CX - 1.3} ${CY + 5} L${CX} ${CY - 14} L${CX + 1.3} ${CY + 5} L${CX} ${CY + 7} Z`}
          fill={d ? "#dde8ff" : "#f2f2f8"} />
        <line x1={CX} y1={CY - 14} x2={CX} y2={CY - 3}
          stroke={blue} strokeWidth="1.3" strokeLinecap="round" />
      </motion.g>
      <circle cx={CX} cy={CY} r={5.5}
        fill={d ? "#1c1c28" : "#e4e4ec"}
        stroke={blue} strokeWidth="1.8" />
      <circle cx={CX} cy={CY} r={2.5} fill={blue} />
    </svg>
  );
}

// ── Battery charging animation sub-component ─────────────────────────────────

function BatteryCharging({ d, blue }: { d: boolean; blue: string }) {
  return (
    <svg width="30" height="16" viewBox="0 0 30 16" className="flex-shrink-0">
      <rect x="1" y="1" width="23" height="14" rx="3"
        fill="none" stroke={d ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)"} strokeWidth="1.4" />
      <rect x="24.5" y="5.5" width="3" height="5" rx="1"
        fill={d ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"} />
      <motion.rect x="2.5" y="2.5" height="11" rx="1.5"
        fill={blue} opacity="0.82"
        animate={{ width: [0, 20, 20, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.55, 0.75, 1], ease: "easeOut" }}
      />
      <path d="M 13 4 L 11 8.5 L 13 8.5 L 11 12 L 15.5 7 L 13.5 7 Z"
        fill="white" opacity="0.88" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Calculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const d = theme === "dark";

  const [activeTab, setActiveTab] = useState<"charge" | "savings">("charge");
  const [chargeMode, setChargeMode] = useState<"ac" | "dc">("ac");

  // Car selector
  const [selectedCar, setSelectedCar] = useState<string>("");

  // Tab 1 — Şarj Süresi
  const [batteryCapacity, setBatteryCapacity] = useState(77);
  const [currentSoc, setCurrentSoc]           = useState(20);
  const [targetSoc, setTargetSoc]             = useState(80);
  const [chargerPower, setChargerPower]       = useState(11);
  const [dcPower, setDcPower]                 = useState(150);
  const [carConsumption, setCarConsumption]   = useState(18); // kWh/100km
  const [chargeElecPrice, setChargeElecPrice] = useState(4.5); // ₺/kWh for tab1

  // Tab 2 — Tasarruf Analizi
  const [annualKm, setAnnualKm]                 = useState(20000);
  const [evConsumption, setEvConsumption]       = useState(18);
  const [electricityPrice, setElectricityPrice] = useState(4.5);
  const [fuelConsumption, setFuelConsumption]   = useState(8);
  const [fuelPrice, setFuelPrice]               = useState(43);

  // ── Theme ────────────────────────────────────────────────────────────────
  const sectionBg   = d ? "linear-gradient(180deg, #232323 0%, #1a1a1a 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)";
  const surface     = d ? "#1e1e1e" : "#ffffff";
  const border      = d ? "#2a2a2a" : "#e0e0e0";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted   = d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)";
  const tabActiveBg = d ? "#2a2a2a" : "#ffffff";
  const tabContBg   = d ? "#161616" : "#e8e8e8";
  const inputBg     = d ? "#242424" : "#f4f4f4";
  const inputBorder = d ? "#303030" : "#e0e0e0";
  const BLUE        = "#3B82F6";
  const GREEN       = "#10B981";
  const ORANGE      = "#F97316";

  // Apply car data when car is selected
  const handleCarSelect = (val: string) => {
    setSelectedCar(val);
    if (!val) return;
    const car = EV_MODELS.find((m) => `${m.brand}|${m.model}` === val);
    if (!car) return;
    setBatteryCapacity(car.battery);
    setCarConsumption(car.consumption);
    const bestAc = bestAcPower(car.maxAcKw);
    setChargerPower(bestAc);
    const bestDc = bestDcPower(car.maxDcKw);
    setDcPower(bestDc);
  };

  const selectedCarData = EV_MODELS.find((m) => `${m.brand}|${m.model}` === selectedCar);

  // ── Charge time calculations ─────────────────────────────────────────────
  const chargeCalc = useMemo(() => {
    const socDelta     = Math.max(targetSoc - currentSoc, 0) / 100;
    const energyNeeded = batteryCapacity * socDelta;
    const eff          = chargeMode === "ac" ? 0.90 : 0.92;
    const effectivePow = chargeMode === "ac"
      ? (selectedCarData ? Math.min(chargerPower, selectedCarData.maxAcKw) : chargerPower)
      : (selectedCarData ? Math.min(dcPower, selectedCarData.maxDcKw) : dcPower);
    const timeHours    = energyNeeded / (effectivePow * eff);
    const hours        = Math.floor(timeHours);
    const minutes      = Math.round((timeHours - hours) * 60);
    const addedKm      = Math.round((energyNeeded * eff) / (carConsumption / 100));
    const chargeCost   = energyNeeded * chargeElecPrice;
    return { energyNeeded, hours, minutes, addedKm, effectivePow, chargeCost };
  }, [batteryCapacity, currentSoc, targetSoc, chargerPower, dcPower, chargeMode, selectedCarData, carConsumption, chargeElecPrice]);

  // ── Savings calculations ─────────────────────────────────────────────────
  const savingsCalc = useMemo(() => {
    const annualEvKwh    = (annualKm / 100) * evConsumption;
    const annualEvCost   = annualEvKwh * electricityPrice;
    const annualFuelL    = (annualKm / 100) * fuelConsumption;
    const annualFuelCost = annualFuelL * fuelPrice;
    const annualSavings  = annualFuelCost - annualEvCost;
    const monthlySavings = annualSavings / 12;
    const co2SavedKg     = annualFuelL * 2.31;
    return { annualEvCost, annualFuelCost, annualSavings, monthlySavings, co2SavedKg };
  }, [annualKm, evConsumption, electricityPrice, fuelConsumption, fuelPrice]);

  // ── SOC guard ────────────────────────────────────────────────────────────
  const handleCurrentSoc = (v: number) => { setCurrentSoc(v); if (v >= targetSoc) setTargetSoc(Math.min(v + 5, 100)); };
  const handleTargetSoc  = (v: number) => { setTargetSoc(v);  if (v <= currentSoc) setCurrentSoc(Math.max(v - 5, 0)); };

  const accentColor = chargeMode === "ac" ? BLUE : ORANGE;

  // ── SVG Gauge helpers ─────────────────────────────────────────────────────
  const GCX = 100, GCY = 105, GR = 72;
  const GArcStart = 135, GArcTotal = 270;
  function gPolToCart(angleDeg: number) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: GCX + GR * Math.cos(rad), y: GCY + GR * Math.sin(rad) };
  }
  function gArcPath(fromSoc: number, toSoc: number) {
    if (fromSoc >= toSoc) return "";
    const a1 = GArcStart + (fromSoc / 100) * GArcTotal;
    const a2 = GArcStart + (toSoc / 100) * GArcTotal;
    const p1 = gPolToCart(a1);
    const p2 = gPolToCart(a2);
    const large = (a2 - a1) > 180 ? 1 : 0;
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${GR} ${GR} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  const bgArcPath      = gArcPath(0, 99.9);
  const filledArcPath  = gArcPath(currentSoc, targetSoc);
  const currentArcPath = gArcPath(0, currentSoc);

  // Savings bar widths
  const maxCost = Math.max(savingsCalc.annualEvCost, savingsCalc.annualFuelCost, 1);
  const evBarW   = (savingsCalc.annualEvCost   / maxCost) * 100;
  const fuelBarW = (savingsCalc.annualFuelCost / maxCost) * 100;

  return (
    <section id="calculator" style={{ background: sectionBg }} className="relative py-8 lg:py-12 overflow-hidden">
      {/* ── Decorative background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-30%", left: "-15%", width: "55%", height: "90%",
          background: `radial-gradient(ellipse, ${BLUE}16 0%, transparent 65%)`,
        }} />
        <div style={{
          position: "absolute", bottom: "-30%", right: "-10%", width: "55%", height: "90%",
          background: `radial-gradient(ellipse, ${ORANGE}12 0%, transparent 65%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, ${d ? "rgba(255,255,255,0.030)" : "rgba(0,0,0,0.025)"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }} />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-3"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            Hesaplayıcı
          </motion.span>

          {/* Heading + animated needle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.08 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            {/* Animated ibra — left */}
            <TachometerNeedle d={d} blue={BLUE} />

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black" style={{ color: textPrimary }}>
              Şarj Süresi Hesaplayıcı
            </h2>

            {/* Animated ibra — right (mirror) */}
            <TachometerNeedle d={d} blue={BLUE} mirror />
          </motion.div>

          {/* Battery charging animation */}
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.14 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <BatteryCharging d={d} blue={BLUE} />
            <span className="text-[11px] tracking-widest uppercase font-semibold" style={{ color: d ? `${BLUE}80` : `${BLUE}99` }}>
              Şarj Simülasyonu
            </span>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-16 mb-2.5"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${BLUE} 50%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm" style={{ color: textMuted }}
          >
            Araç seçin veya manuel değer girin — şarj sürenizi ve yakıt tasarrufunuzu hesaplayın
          </motion.p>
        </div>

        {/* ── Tab switcher ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.28 }}
          className="flex rounded-xl p-1 mb-5 max-w-xs mx-auto"
          style={{ background: tabContBg, border: `1px solid ${border}` }}
        >
          {(["charge", "savings"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab ? tabActiveBg : "transparent",
                color: activeTab === tab ? textPrimary : textMuted,
                boxShadow: activeTab === tab && d ? "0 1px 6px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {tab === "charge" ? "Şarj Süresi" : "Tasarruf Analizi"}
            </button>
          ))}
        </motion.div>

        {/* ── 2-Column main layout ── */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">

          {/* ───────────── LEFT — Controls ───────────── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 }}
            className="h-full"
          >
            <AnimatePresence mode="wait">
              {activeTab === "charge" ? (
                <motion.div
                  key="charge-inputs"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl overflow-hidden h-full"
                  style={{ background: surface, border: `1px solid ${border}`, boxShadow: d ? "none" : "0 4px 32px rgba(0,0,0,0.08)" }}
                >
                  <div className="p-3 sm:p-4">

                    {/* Car selector */}
                    <div className="mb-4">
                      <label className="text-sm font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: textMuted }}>
                        <RiCarLine style={{ fontSize: 12 }} /> Araç Modeli (isteğe bağlı)
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCar}
                          onChange={(e) => handleCarSelect(e.target.value)}
                          className="w-full rounded-xl px-3 py-2 text-xs appearance-none cursor-pointer focus:outline-none transition-colors pr-8"
                          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: selectedCar ? textPrimary : textMuted }}
                        >
                          <option value="">— Manuel gir —</option>
                          {EV_BRANDS.map((brand) => (
                            <optgroup key={brand} label={brand}>
                              {EV_MODELS.filter((m) => m.brand === brand).map((m) => (
                                <option key={`${m.brand}|${m.model}`} value={`${m.brand}|${m.model}`}>{m.model}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: textMuted }}>▾</div>
                      </div>
                      {selectedCarData && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}25` }}>Batarya: {selectedCarData.battery} kWh</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}25` }}>AC maks: {selectedCarData.maxAcKw} kW</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${ORANGE}15`, color: ORANGE, border: `1px solid ${ORANGE}25` }}>DC maks: {selectedCarData.maxDcKw} kW</span>
                        </div>
                      )}
                    </div>

                    {/* AC / DC toggle */}
                    <div className="flex rounded-xl p-1 mb-4" style={{ background: d ? "#111111" : "#e8e8e8", border: `1px solid ${border}` }}>
                      {(["ac", "dc"] as const).map((mode) => (
                        <button key={mode} onClick={() => setChargeMode(mode)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                          style={{
                            background: chargeMode === mode ? (mode === "ac" ? BLUE : ORANGE) : "transparent",
                            color: chargeMode === mode ? "#fff" : textMuted,
                          }}
                        >
                          {mode === "ac" ? "AC Şarj" : "DC Hızlı Şarj"}
                        </button>
                      ))}
                    </div>

                    {/* Battery */}
                    {selectedCarData ? (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium" style={{ color: textMuted }}>Batarya Kapasitesi</span>
                        </div>
                        <div className="rounded-xl px-3 py-2.5 flex items-center justify-between"
                          style={{ background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${accentColor}30` }}>
                          <span className="text-xl font-black" style={{ color: accentColor }}>{selectedCarData.battery} kWh</span>
                          <span className="text-xs font-medium" style={{ color: textMuted }}>🔒 araç verisi</span>
                        </div>
                      </div>
                    ) : (
                      <Slider label="Batarya Kapasitesi" value={batteryCapacity} min={20} max={150} unit=" kWh"
                        accent={accentColor} textMuted={textMuted} textPrimary={textPrimary} onChange={setBatteryCapacity} />
                    )}

                    <Slider label="Mevcut Doluluk" value={currentSoc} min={0} max={99} unit="%"
                      accent={accentColor} textMuted={textMuted} textPrimary={textPrimary} onChange={handleCurrentSoc} />
                    <Slider label="Hedef Doluluk" value={targetSoc} min={1} max={100} unit="%"
                      accent={accentColor} textMuted={textMuted} textPrimary={textPrimary} onChange={handleTargetSoc} />

                    {/* Power selector */}
                    <AnimatePresence mode="wait">
                      <motion.div key={chargeMode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                        <p className="text-sm font-medium mb-2" style={{ color: textMuted }}>
                          {chargeMode === "ac" ? "AC Şarj Gücü" : "DC İstasyon Gücü"}
                          {selectedCarData && (
                            <span style={{ color: accentColor }}> · Araç maks: {chargeMode === "ac" ? selectedCarData.maxAcKw : selectedCarData.maxDcKw} kW</span>
                          )}
                        </p>
                        <div className={`grid gap-1 ${chargeMode === "ac" ? "grid-cols-5" : "grid-cols-3"}`}>
                          {(chargeMode === "ac" ? AC_POWER_OPTIONS : DC_POWER_OPTIONS).map((opt) => {
                            const isDisabled = selectedCarData
                              ? (chargeMode === "ac" ? opt.value > selectedCarData.maxAcKw : opt.value > selectedCarData.maxDcKw)
                              : false;
                            const isActive = chargeMode === "ac" ? chargerPower === opt.value : dcPower === opt.value;
                            return (
                              <button key={opt.value}
                                onClick={() => { if (!isDisabled) { chargeMode === "ac" ? setChargerPower(opt.value) : setDcPower(opt.value); } }}
                                disabled={isDisabled}
                                className="py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                                style={{
                                  background: isActive ? accentColor : (d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                                  color: isActive ? "#fff" : isDisabled ? (d ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)") : textMuted,
                                  border: isActive ? `1px solid ${accentColor}` : `1px solid ${border}`,
                                  opacity: isDisabled ? 0.4 : 1,
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                }}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                  </div>
                </motion.div>
              ) : (
                /* Savings inputs */
                <motion.div
                  key="savings-inputs"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl overflow-hidden h-full"
                  style={{ background: surface, border: `1px solid ${border}`, boxShadow: d ? "none" : "0 4px 32px rgba(0,0,0,0.08)" }}
                >
                  <div className="p-4 sm:p-5">
                    <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: textMuted }}>Kullanım Bilgileri</p>
                    <Slider label="Yıllık Sürüş Mesafesi" value={annualKm} min={5000} max={80000} step={1000} unit=" km"
                      accent={GREEN} textMuted={textMuted} textPrimary={textPrimary} onChange={setAnnualKm}
                      formatValue={(v) => `${v.toLocaleString("tr-TR")} km`} />
                    <Slider label="EV Tüketimi" value={evConsumption} min={12} max={30} step={0.5} unit=" kWh/100km"
                      accent={GREEN} textMuted={textMuted} textPrimary={textPrimary} onChange={setEvConsumption} />
                    <Slider label="Elektrik Fiyatı" value={electricityPrice} min={1} max={10} step={0.1} unit=" ₺/kWh"
                      accent={GREEN} textMuted={textMuted} textPrimary={textPrimary} onChange={setElectricityPrice} />
                    <Slider label="Araç Yakıt Tüketimi" value={fuelConsumption} min={4} max={20} step={0.5} unit=" L/100km"
                      accent={GREEN} textMuted={textMuted} textPrimary={textPrimary} onChange={setFuelConsumption} />
                    <Slider label="Akaryakıt Fiyatı" value={fuelPrice} min={20} max={70} step={0.5} unit=" ₺/L"
                      accent={GREEN} textMuted={textMuted} textPrimary={textPrimary} onChange={setFuelPrice} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ───────────── RIGHT — Visual Result ───────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.42 }}
            className="h-full"
          >
            <AnimatePresence mode="wait">
              {activeTab === "charge" ? (
                <motion.div
                  key="charge-visual"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden h-full"
                  style={{
                    background: d
                      ? "linear-gradient(145deg, #0c1422 0%, #0f1929 50%, #0a1018 100%)"
                      : "linear-gradient(145deg, #e8f0fe 0%, #f0f4ff 60%, #eaf0ff 100%)",
                    border: `1px solid ${accentColor}30`,
                    boxShadow: `0 0 48px ${accentColor}12, 0 4px 24px rgba(0,0,0,0.15)`,
                  }}
                >
                  {/* Top badge */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accentColor }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                        {chargeMode === "ac" ? "AC Şarj" : "DC Hızlı Şarj"} · {chargeCalc.effectivePow} kW
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                      %{currentSoc} → %{targetSoc}
                    </span>
                  </div>

                  {/* SVG Gauge */}
                  <div className="flex justify-center py-2">
                    <motion.div
                      key={`${currentSoc}-${targetSoc}-${chargeMode}`}
                      initial={{ scale: 0.92, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.45, type: "spring", stiffness: 180, damping: 18 }}
                    >
                      <svg viewBox="0 0 200 215" width={174} height={174} style={{ overflow: "visible" }}>
                        {/* Outer glow ring */}
                        <circle cx={GCX} cy={GCY} r={GR + 11} fill="none"
                          stroke={accentColor} strokeWidth="1" strokeOpacity="0.08" />

                        {/* Background arc */}
                        {bgArcPath && (
                          <path d={bgArcPath} fill="none"
                            stroke={d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)"}
                            strokeWidth="10" strokeLinecap="round" />
                        )}

                        {/* Current SOC fill (dim) */}
                        {currentArcPath && currentSoc > 0 && (
                          <path d={currentArcPath} fill="none"
                            stroke={accentColor} strokeWidth="10" strokeLinecap="round"
                            strokeOpacity="0.28" />
                        )}

                        {/* Charge range arc (bright) */}
                        {filledArcPath && (
                          <motion.path
                            d={filledArcPath} fill="none"
                            stroke={accentColor} strokeWidth="10" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        )}

                        {/* Glow effect on filled arc */}
                        {filledArcPath && (
                          <path d={filledArcPath} fill="none"
                            stroke={accentColor} strokeWidth="20" strokeLinecap="round"
                            strokeOpacity="0.12" />
                        )}

                        {/* Center — time display */}
                        <motion.text x={GCX} y={GCY - 12}
                          textAnchor="middle" dominantBaseline="middle"
                          fontSize="30" fontWeight="900" fontFamily="inherit"
                          fill={d ? "#ffffff" : "#111111"}
                          key={`${chargeCalc.hours}-${chargeCalc.minutes}`}
                        >
                          {chargeCalc.hours > 0 ? `${chargeCalc.hours}s` : ""}
                          {chargeCalc.minutes > 0 ? `${chargeCalc.minutes}d` : (chargeCalc.hours === 0 ? "—" : "")}
                        </motion.text>
                        <text x={GCX} y={GCY + 18}
                          textAnchor="middle" fontSize="9" fontFamily="inherit"
                          fill={d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)"}
                          fontWeight="600" letterSpacing="2">
                          TAHMİNİ SÜRE
                        </text>

                        {/* SOC labels */}
                        {[0, 25, 50, 75, 100].map((soc) => {
                          const a = GArcStart + (soc / 100) * GArcTotal;
                          const pr = GR + 20;
                          const rad = (a - 90) * Math.PI / 180;
                          const lx = GCX + pr * Math.cos(rad);
                          const ly = GCY + pr * Math.sin(rad);
                          return (
                            <text key={soc} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                              fontSize="9" fontFamily="inherit" fontWeight="700"
                              fill={d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)"}>
                              {soc}%
                            </text>
                          );
                        })}
                      </svg>
                    </motion.div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 px-4 pb-3">
                    {[
                      { label: "Enerji", value: `${chargeCalc.energyNeeded.toFixed(1)} kWh`, color: accentColor },
                      { label: "Eklenecek Menzil", value: `${chargeCalc.addedKm.toLocaleString("tr-TR")} km`, color: d ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.70)" },
                      { label: "Verimlilik", value: chargeMode === "ac" ? "%90" : "%92", color: GREEN },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-xl py-2 px-1.5 text-center"
                        style={{ background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: d ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)" }}>
                        <p className="text-xs mb-0.5" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)" }}>{stat.label}</p>
                        <p className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Cost box */}
                  <div className="mx-4 mb-3 rounded-xl px-3.5 py-2.5 flex items-center justify-between"
                    style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}28` }}>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>Elektrik Maliyeti</p>
                      <p className="text-xs mt-0.5" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)" }}>
                        {chargeCalc.energyNeeded.toFixed(1)} kWh × {chargeElecPrice.toFixed(2)} ₺/kWh
                      </p>
                    </div>
                    <p className="text-xl font-black" style={{ color: GREEN }}>{chargeCalc.chargeCost.toFixed(2)} ₺</p>
                  </div>

                  {/* Tariff selector */}
                  <div className="mx-4 mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: d ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.30)" }}>
                      Elektrik Tarifesi
                    </p>
                    <div className="grid grid-cols-2 gap-1 mb-2.5">
                      {TARIFF_PRESETS.map((t) => {
                        const isActive = chargeElecPrice === t.value;
                        return (
                          <button key={t.id} onClick={() => setChargeElecPrice(t.value)}
                            className="rounded-lg px-2 py-1.5 text-left transition-all duration-150"
                            style={{
                              background: isActive ? `${GREEN}18` : (d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                              border: isActive ? `1px solid ${GREEN}40` : `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                            }}
                          >
                            <span className="text-xs font-bold block leading-tight" style={{ color: isActive ? GREEN : d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{t.label}</span>
                            <span className="text-[11px] block leading-tight mt-0.5" style={{ color: isActive ? GREEN : d ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)" }}>{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                    <input type="range" min={1} max={20} step={0.1} value={chargeElecPrice}
                      onChange={(e) => setChargeElecPrice(Number(e.target.value))}
                      className="calc-slider w-full" style={sliderStyle(chargeElecPrice, 1, 20, GREEN)} />
                    <div className="flex justify-between mt-1">
                      <span className="text-[11px]" style={{ color: d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)" }}>1 ₺/kWh</span>
                      <span className="text-[11px]" style={{ color: d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)" }}>20 ₺/kWh</span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {selectedCarData && chargeMode === "dc" && dcPower > selectedCarData.maxDcKw && (
                    <p className="text-xs pb-4 text-center" style={{ color: ORANGE }}>⚡ {selectedCarData.maxDcKw} kW&apos;e kısıtlandı</p>
                  )}
                  {selectedCarData && chargeMode === "ac" && chargerPower > selectedCarData.maxAcKw && (
                    <p className="text-xs pb-4 text-center" style={{ color: BLUE }}>Araç {selectedCarData.maxAcKw} kW&apos;e kısıtlandı</p>
                  )}
                </motion.div>
              ) : (
                /* Savings visual */
                <motion.div
                  key="savings-visual"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden h-full"
                  style={{
                    background: d
                      ? "linear-gradient(145deg, #071a0f 0%, #0a1f12 50%, #061508 100%)"
                      : "linear-gradient(145deg, #e8faf2 0%, #f0faf5 60%, #eafaf2 100%)",
                    border: `1px solid ${GREEN}30`,
                    boxShadow: `0 0 48px ${GREEN}10, 0 4px 24px rgba(0,0,0,0.15)`,
                  }}
                >
                  {/* Header */}
                  <div className="text-center pt-8 pb-4 px-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                      style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30` }}>
                      <RiLeafLine style={{ fontSize: 28, color: GREEN }} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)" }}>
                      Yıllık Yakıt Tasarrufu
                    </p>
                    <motion.p
                      key={fmt(savingsCalc.annualSavings)}
                      initial={{ scale: 0.88, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                      className="text-5xl font-black"
                      style={{ color: savingsCalc.annualSavings > 0 ? GREEN : "#F59E0B" }}
                    >
                      {savingsCalc.annualSavings > 0
                        ? `${fmt(savingsCalc.annualSavings)} ₺`
                        : `−${fmt(Math.abs(savingsCalc.annualSavings))} ₺`}
                    </motion.p>
                    <p className="text-xs mt-1" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)" }}>yakıt vs. elektrik farkı</p>
                  </div>

                  {/* Comparison bars */}
                  <div className="px-6 pb-5 space-y-3">
                    {[
                      { label: "EV Maliyeti", value: savingsCalc.annualEvCost, barW: evBarW, color: BLUE },
                      { label: "Yakıt Maliyeti", value: savingsCalc.annualFuelCost, barW: fuelBarW, color: "#F59E0B" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-semibold" style={{ color: d ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{item.label}</span>
                          <span className="text-sm font-black tabular-nums" style={{ color: item.color }}>{fmt(item.value)} ₺</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.barW}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom stats */}
                  <div className="grid grid-cols-2 gap-3 px-5 pb-5">
                    {[
                      { label: "Aylık Tasarruf", value: `${fmt(savingsCalc.monthlySavings)} ₺`, color: GREEN },
                      { label: "CO₂ Tasarrufu", value: `${(savingsCalc.co2SavedKg / 1000).toFixed(2)} ton/yıl`, color: GREEN },
                    ].map((item, i) => (
                      <div key={i} className="rounded-xl py-3 px-3 text-center"
                        style={{ background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: d ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)" }}>
                        <p className="text-xs mb-1" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)" }}>{item.label}</p>
                        <p className="text-sm font-black" style={{ color: item.color }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* EV vs Fuel annual comparison */}
                  <div className="mx-5 mb-5 rounded-xl grid grid-cols-2 overflow-hidden"
                    style={{ border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                    <div className="px-4 py-3.5 text-center" style={{ borderRight: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)" }}>
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: d ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.40)" }}>EV / yıl</p>
                      <p className="text-base font-black" style={{ color: BLUE }}>{fmt(savingsCalc.annualEvCost)} ₺</p>
                    </div>
                    <div className="px-4 py-3.5 text-center" style={{ background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)" }}>
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: d ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.40)" }}>Yakıt / yıl</p>
                      <p className="text-base font-black" style={{ color: "#F59E0B" }}>{fmt(savingsCalc.annualFuelCost)} ₺</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>{/* end 2-col grid */}

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-xs mt-6" style={{ color: textMuted }}>
          Hesaplamalar tahmini değerlerdir. Gerçek sonuçlar araç modeli, kullanım alışkanlıkları ve güncel tarife fiyatlarına göre farklılık gösterebilir.
        </motion.p>
      </div>
    </section>
  );
}
