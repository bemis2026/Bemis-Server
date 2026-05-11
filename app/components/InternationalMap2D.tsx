"use client";

import { useEffect, useRef, useState } from "react";
import type { InternationalDealer } from "../context/ContentContext";

// Equirectangular projection — we keep the visual flat and conceptual
// rather than rendering raster continent outlines. Pins land at their
// real lat/lng, the prime meridian + equator are drawn as reference
// lines, and a stylized continent silhouette sits behind everything as
// a soft watermark. The user just wanted a 2D alternative to the 3D
// globe — not a fully-featured GIS view.

const BURSA = { lat: 40.18, lng: 29.06 };
const BLUE = "#3B82F6";
const RED = "#EF4444";

type Props = {
  dark: boolean;
  countries: InternationalDealer[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

// Simplified continent silhouettes — hand-drawn approximations sized to
// the 1000×500 equirectangular viewBox. Not geographically accurate;
// purely a backdrop so the pins don't float on an empty rectangle.
// Coordinates are roughly:
//   x = (lng + 180) / 360 * 1000
//   y = (90 - lat) / 180 * 500
const CONTINENTS: string[] = [
  // North America
  "M 90 100 Q 130 80 180 90 L 240 100 Q 280 110 290 140 L 280 180 Q 250 220 220 240 L 180 260 L 140 250 L 110 220 L 90 180 Q 75 150 90 100 Z",
  // South America
  "M 260 280 Q 290 270 310 290 L 320 340 Q 315 390 295 420 L 275 440 L 260 420 L 250 380 Q 245 330 260 280 Z",
  // Europe
  "M 480 110 Q 510 100 540 110 L 560 130 L 555 160 L 530 170 L 500 165 L 485 145 Z",
  // Africa
  "M 490 200 Q 520 195 555 210 L 580 250 L 575 310 L 555 360 L 530 380 L 510 370 L 495 340 L 485 290 L 480 240 Q 480 215 490 200 Z",
  // Asia
  "M 580 95 Q 650 85 720 95 L 800 105 L 850 120 L 870 150 L 860 180 L 840 200 L 800 210 L 750 215 L 700 210 L 650 195 L 610 175 L 590 145 Q 575 120 580 95 Z",
  // India
  "M 680 200 L 705 200 L 710 240 L 695 270 L 680 250 Z",
  // SE Asia / Indonesia
  "M 770 230 L 820 235 L 850 250 L 845 270 L 810 275 L 780 265 L 770 245 Z",
  // Australia
  "M 800 340 Q 840 330 880 340 L 895 365 L 880 390 L 840 395 L 805 385 L 790 365 Z",
  // Greenland
  "M 330 60 Q 360 55 390 65 L 400 90 L 380 105 L 350 100 L 330 85 Z",
];

export default function InternationalMap2D({ dark, countries, selectedId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<InternationalDealer | null>(null);
  const [size, setSize] = useState({ w: 800, h: 400 });

  const activeCountries = countries.filter(c => c.active);

  // Project lat/lng → SVG viewBox coordinates (1000 × 500 equirectangular).
  const project = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  });

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = Math.round(Math.min(w * 0.5, 480));
        setSize({ w, h });
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Cursor tracking for the hover tooltip — mirror of the 3D component.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const handler = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      wrap.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      wrap.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    wrap.addEventListener("pointermove", handler);
    return () => wrap.removeEventListener("pointermove", handler);
  }, []);

  const bursa = project(BURSA.lat, BURSA.lng);

  const continentFill = dark ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.13)";
  const continentStroke = dark ? "rgba(59,130,246,0.22)" : "rgba(59,130,246,0.28)";
  const gridStroke = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
  const axisStroke = dark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.20)";

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      onPointerLeave={() => setHovered(null)}
      style={{
        minHeight: 320,
        height: size.h,
        background: dark
          ? "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.10) 0%, transparent 65%)"
          : "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.06) 0%, transparent 65%)",
      }}
    >
      {/* Inner shadow border — same as 3D wrapper */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: dark
            ? "inset 0 0 80px rgba(8,12,22,0.55), inset 0 0 0 1px rgba(59,130,246,0.18)"
            : "inset 0 0 80px rgba(255,255,255,0.55), inset 0 0 0 1px rgba(59,130,246,0.18)",
        }}
      />

      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill={gridStroke} />
          </pattern>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.55" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0.08" />
          </linearGradient>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Dot grid background */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#dotgrid)" />

        {/* Equator + Prime Meridian reference lines */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke={axisStroke} strokeWidth="0.5" strokeDasharray="3 4" />
        <line x1="500" y1="0" x2="500" y2="500" stroke={axisStroke} strokeWidth="0.5" strokeDasharray="3 4" />

        {/* Continent silhouettes — soft tinted blobs as the visual backdrop */}
        <g>
          {CONTINENTS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={continentFill}
              stroke={continentStroke}
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Arcs from Bursa to each active country */}
        <g>
          {activeCountries.map((c, i) => {
            const p = project(c.lat, c.lng);
            // Quadratic curve with the control point lifted above the
            // midpoint — small but visible arc, not a straight line.
            const mx = (bursa.x + p.x) / 2;
            const my = (bursa.y + p.y) / 2;
            const dist = Math.hypot(p.x - bursa.x, p.y - bursa.y);
            const lift = Math.min(60, dist * 0.18);
            return (
              <path
                key={`arc-${i}`}
                d={`M ${bursa.x} ${bursa.y} Q ${mx} ${my - lift} ${p.x} ${p.y}`}
                stroke="url(#arcGradient)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Country pins */}
        <g>
          {activeCountries.map((c, i) => {
            const p = project(c.lat, c.lng);
            const isSel = selectedId === c.id;
            return (
              <g
                key={`pin-${i}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(prev => prev?.id === c.id ? null : prev)}
                onClick={() => onSelect?.(c.id)}
              >
                {/* Pulse ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel ? 11 : 9}
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="1"
                  opacity="0.45"
                >
                  <animate attributeName="r" values={`${isSel ? 11 : 9};${isSel ? 18 : 15};${isSel ? 11 : 9}`} dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" repeatCount="indefinite" />
                </circle>
                {/* Halo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel ? 6.5 : 5.5}
                  fill="#ffffff"
                  stroke={BLUE}
                  strokeWidth="1.4"
                />
                {/* Inner dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel ? 3.4 : 2.8}
                  fill={BLUE}
                />
              </g>
            );
          })}
        </g>

        {/* Bursa MERKEZ marker */}
        <g style={{ pointerEvents: "none" }}>
          <circle cx={bursa.x} cy={bursa.y} r="11" fill="none" stroke={RED} strokeWidth="1.4" opacity="0.45">
            <animate attributeName="r" values="11;22;11" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx={bursa.x} cy={bursa.y} r="6" fill={RED} stroke="#ffffff" strokeWidth="1.8" />
          <text
            x={bursa.x}
            y={bursa.y - 12}
            fontSize="9"
            fontWeight="800"
            fill={dark ? "#fecaca" : "#B91C1C"}
            textAnchor="middle"
            style={{ letterSpacing: "0.1em" }}
          >
            MERKEZ
          </text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute rounded-xl px-3 py-2 text-sm font-semibold backdrop-blur"
          style={{
            left: "var(--mx, 12px)",
            top: "var(--my, 12px)",
            transform: "translate(18px, 18px)",
            background: dark ? "rgba(8,12,22,0.85)" : "rgba(255,255,255,0.96)",
            border: `1px solid ${BLUE}55`,
            color: dark ? "#cfe1ff" : "#1D4ED8",
            boxShadow: `0 8px 24px ${BLUE}33`,
            zIndex: 20,
          }}
        >
          <div className="text-[10px] tracking-[0.18em] uppercase opacity-70">{hovered.countryCode}</div>
          <div>{hovered.countryName}</div>
        </div>
      )}

      {/* Top-right active country count badge */}
      <div
        className="absolute top-3 right-3 flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur"
        style={{
          background: dark ? "rgba(8,12,22,0.65)" : "rgba(255,255,255,0.85)",
          border: `1px solid ${BLUE}45`,
          boxShadow: `0 4px 14px ${BLUE}22`,
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: BLUE, boxShadow: `0 0 8px ${BLUE}` }}
        />
        <span
          className="text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ color: dark ? "#cfe1ff" : "#1D4ED8" }}
        >
          {activeCountries.length} Ülke · Aktif Ağ
        </span>
      </div>

      {/* Bottom-left legend */}
      <div
        className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full px-3 py-1.5 backdrop-blur"
        style={{
          background: dark ? "rgba(8,12,22,0.65)" : "rgba(255,255,255,0.85)",
          border: `1px solid ${BLUE}30`,
        }}
      >
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: RED, boxShadow: `0 0 6px ${RED}` }} />
          <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: dark ? "#fecaca" : "#B91C1C" }}>
            MERKEZ TR
          </span>
        </span>
        <span className="w-px h-3" style={{ background: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)" }} />
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: BLUE, boxShadow: `0 0 6px ${BLUE}` }} />
          <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: dark ? "#cfe1ff" : "#1D4ED8" }}>
            Distribütör
          </span>
        </span>
      </div>

      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
        <span className="text-[9px] tracking-widest uppercase" style={{ color: `${BLUE}aa` }}>
          Bemis E-V Charge
        </span>
      </div>
    </div>
  );
}
