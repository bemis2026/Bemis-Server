"use client";

import { useEffect, useRef, useState } from "react";
import type { InternationalDealer } from "../context/ContentContext";

// 2D world map using a real atlas (Wikipedia world-map.svg, Robinson
// projection, 950×620 viewBox). We render the SVG as an inline <image>
// so we can overlay pins as native <circle> elements in the same
// coordinate system, then apply Robinson projection math to place
// each dealer country at its real geographic position.

const BURSA = { lat: 40.18, lng: 29.06 };
const BLUE = "#3B82F6";
const RED = "#EF4444";

// Robinson projection scale tables at 5° latitude steps (0–90°).
// L = horizontal length factor; D = vertical position factor.
// Source: standard Robinson projection coefficients (NGS).
const ROB_L = [
  1.0000, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216,
  0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322,
];
const ROB_D = [
  0.0000, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958,
  0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1.0000,
];

// SVG dimensions and calibration. The Wikipedia map crops slightly at
// the poles and has a small vertical padding, so we squeeze the
// natural Robinson y range into a slightly narrower band inside the
// 620px viewBox height.
const MAP_W = 950;
const MAP_H = 620;
const Y_CENTER = 305;          // equator's pixel y on this SVG
const Y_HALF_RANGE = 245;      // pole-to-equator distance in pixels (empirical)
const X_HALF_RANGE = 475;      // ±180° from center

function robinsonProject(lat: number, lng: number) {
  const absLat = Math.min(90, Math.abs(lat));
  const i = Math.min(17, Math.floor(absLat / 5));
  const r = (absLat - i * 5) / 5;
  const L = ROB_L[i] * (1 - r) + ROB_L[i + 1] * r;
  const D = ROB_D[i] * (1 - r) + ROB_D[i + 1] * r;
  // Horizontal: meridian spacing follows L; longitude scales linearly.
  const x = MAP_W / 2 + (L * lng / 180) * X_HALF_RANGE;
  // Vertical: parallel spacing follows D; sign flipped for SVG (Y down).
  const y = Y_CENTER - D * Y_HALF_RANGE * (lat >= 0 ? 1 : -1);
  return { x, y };
}

type Props = {
  dark: boolean;
  countries: InternationalDealer[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export default function InternationalMap2D({ dark, countries, selectedId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<InternationalDealer | null>(null);
  const [size, setSize] = useState({ w: 800, h: 522 });

  const activeCountries = countries.filter(c => c.active);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        // Maintain the SVG's natural 950:620 ratio.
        const h = Math.round(Math.min(w * (MAP_H / MAP_W), 560));
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

  const bursa = robinsonProject(BURSA.lat, BURSA.lng);

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
        className="pointer-events-none absolute inset-0 rounded-2xl z-10"
        style={{
          boxShadow: dark
            ? "inset 0 0 80px rgba(8,12,22,0.55), inset 0 0 0 1px rgba(59,130,246,0.18)"
            : "inset 0 0 80px rgba(255,255,255,0.55), inset 0 0 0 1px rgba(59,130,246,0.18)",
        }}
      />

      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="arc2dGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.55" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0.08" />
          </linearGradient>
          {/* Filter that recolors the SVG world map: dark mode tints
              countries blue-grey on a near-black background, light
              mode keeps them in a soft blue-grey on the page bg. */}
          <filter id="mapTintDark" x="0" y="0" width="100%" height="100%">
            <feColorMatrix
              type="matrix"
              values="
                0.32 0.32 0.32 0 0
                0.40 0.40 0.40 0 0
                0.55 0.55 0.55 0 0
                0    0    0    1 0
              "
            />
          </filter>
          <filter id="mapTintLight" x="0" y="0" width="100%" height="100%">
            <feColorMatrix
              type="matrix"
              values="
                0.82 0.82 0.82 0 0
                0.86 0.86 0.86 0 0
                0.94 0.94 0.94 0 0
                0    0    0    1 0
              "
            />
          </filter>
        </defs>

        {/* Real world atlas SVG, embedded as <image>. Filter recolors
            it to match the panel theme. */}
        <image
          href="/images/world-map.svg"
          x="0"
          y="0"
          width={MAP_W}
          height={MAP_H}
          preserveAspectRatio="xMidYMid meet"
          filter={`url(#${dark ? "mapTintDark" : "mapTintLight"})`}
          opacity={dark ? 0.95 : 1}
        />

        {/* Arcs from Bursa to each active country */}
        <g>
          {activeCountries.map((c, i) => {
            const p = robinsonProject(c.lat, c.lng);
            const mx = (bursa.x + p.x) / 2;
            const my = (bursa.y + p.y) / 2;
            const dist = Math.hypot(p.x - bursa.x, p.y - bursa.y);
            const lift = Math.min(70, dist * 0.18);
            return (
              <path
                key={`arc-${i}`}
                d={`M ${bursa.x} ${bursa.y} Q ${mx} ${my - lift} ${p.x} ${p.y}`}
                stroke="url(#arc2dGradient)"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Country pins — single clean blue dot with a soft pulse ring. */}
        <g>
          {activeCountries.map((c, i) => {
            const p = robinsonProject(c.lat, c.lng);
            const isSel = selectedId === c.id;
            return (
              <g
                key={`pin-${i}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(prev => prev?.id === c.id ? null : prev)}
                onClick={() => onSelect?.(c.id)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel ? 11 : 8}
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="1"
                  opacity="0.45"
                >
                  <animate attributeName="r" values={`${isSel ? 10 : 8};${isSel ? 18 : 14};${isSel ? 10 : 8}`} dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel ? 4 : 3.2}
                  fill={BLUE}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </g>

        {/* Bursa MERKEZ marker — red with logo-bearing badge */}
        <g style={{ pointerEvents: "none" }}>
          <circle cx={bursa.x} cy={bursa.y} r="12" fill="none" stroke={RED} strokeWidth="1.4" opacity="0.45">
            <animate attributeName="r" values="11;22;11" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx={bursa.x} cy={bursa.y} r="5.5" fill={RED} stroke="#ffffff" strokeWidth="1.5" />
          <text
            x={bursa.x}
            y={bursa.y - 11}
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
          className="pointer-events-none absolute rounded-xl px-3 py-2 text-sm font-semibold backdrop-blur z-20"
          style={{
            left: "var(--mx, 12px)",
            top: "var(--my, 12px)",
            transform: "translate(18px, 18px)",
            background: dark ? "rgba(8,12,22,0.85)" : "rgba(255,255,255,0.96)",
            border: `1px solid ${BLUE}55`,
            color: dark ? "#cfe1ff" : "#1D4ED8",
            boxShadow: `0 8px 24px ${BLUE}33`,
          }}
        >
          <div className="text-[10px] tracking-[0.18em] uppercase opacity-70">{hovered.countryCode}</div>
          <div>{hovered.countryName}</div>
        </div>
      )}

      {/* Top-right active country count badge */}
      <div
        className="absolute top-3 right-3 flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur z-10"
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
        className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full px-3 py-1.5 backdrop-blur z-10"
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

      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
        <span className="text-[9px] tracking-widest uppercase" style={{ color: `${BLUE}aa` }}>
          Bemis E-V Charge
        </span>
      </div>
    </div>
  );
}
