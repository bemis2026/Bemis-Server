"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";

// Globe is canvas + WebGL, must be SSR-disabled.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Default international markets where Bemis E-V Charge is targeting / has dealer
// presence. Admin can later move this into the editable content bin; for now
// it's hard-coded so the globe renders out-of-the-box.
//
// Coordinates are country centroids (rough — visual placement only).
export type GlobeCountry = {
  code: string;        // ISO-2 (used for caption only)
  name: string;        // localized display name (we use Turkish here for TR site)
  lat: number;
  lng: number;
  group: "balkan" | "mena" | "europe" | "turkic" | "samerica";
};

export const DEFAULT_COUNTRIES: GlobeCountry[] = [
  // Balkans
  { code: "BG", name: "Bulgaristan",        lat: 42.7,  lng: 25.5,  group: "balkan" },
  { code: "RO", name: "Romanya",            lat: 45.9,  lng: 24.9,  group: "balkan" },
  { code: "RS", name: "Sırbistan",          lat: 44.0,  lng: 21.0,  group: "balkan" },
  { code: "MK", name: "Kuzey Makedonya",    lat: 41.6,  lng: 21.7,  group: "balkan" },
  { code: "AL", name: "Arnavutluk",         lat: 41.2,  lng: 20.0,  group: "balkan" },
  { code: "BA", name: "Bosna Hersek",       lat: 43.9,  lng: 17.7,  group: "balkan" },
  { code: "ME", name: "Karadağ",            lat: 42.7,  lng: 19.4,  group: "balkan" },
  { code: "XK", name: "Kosova",             lat: 42.6,  lng: 20.9,  group: "balkan" },
  { code: "GR", name: "Yunanistan",         lat: 39.1,  lng: 21.8,  group: "balkan" },

  // Middle East & North Africa
  { code: "AE", name: "Birleşik Arap Em.",  lat: 23.4,  lng: 53.8,  group: "mena" },
  { code: "SA", name: "Suudi Arabistan",    lat: 23.9,  lng: 45.1,  group: "mena" },
  { code: "QA", name: "Katar",              lat: 25.4,  lng: 51.2,  group: "mena" },
  { code: "KW", name: "Kuveyt",             lat: 29.3,  lng: 47.5,  group: "mena" },
  { code: "OM", name: "Umman",              lat: 21.5,  lng: 55.9,  group: "mena" },
  { code: "BH", name: "Bahreyn",            lat: 26.0,  lng: 50.5,  group: "mena" },
  { code: "IQ", name: "Irak",               lat: 33.2,  lng: 43.7,  group: "mena" },
  { code: "JO", name: "Ürdün",              lat: 30.6,  lng: 36.2,  group: "mena" },
  { code: "LB", name: "Lübnan",             lat: 33.9,  lng: 35.9,  group: "mena" },
  { code: "EG", name: "Mısır",              lat: 26.8,  lng: 30.8,  group: "mena" },
  { code: "LY", name: "Libya",              lat: 26.3,  lng: 17.2,  group: "mena" },
  { code: "TN", name: "Tunus",              lat: 33.9,  lng: 9.5,   group: "mena" },
  { code: "DZ", name: "Cezayir",            lat: 28.0,  lng: 1.6,   group: "mena" },
  { code: "MA", name: "Fas",                lat: 31.8,  lng: -7.1,  group: "mena" },

  // Selected Europe (not Balkan)
  { code: "DE", name: "Almanya",            lat: 51.2,  lng: 10.4,  group: "europe" },
  { code: "NL", name: "Hollanda",           lat: 52.1,  lng: 5.3,   group: "europe" },
  { code: "FR", name: "Fransa",             lat: 46.6,  lng: 2.2,   group: "europe" },
  { code: "IT", name: "İtalya",             lat: 41.9,  lng: 12.6,  group: "europe" },
  { code: "ES", name: "İspanya",            lat: 40.5,  lng: -3.7,  group: "europe" },
  { code: "PL", name: "Polonya",            lat: 51.9,  lng: 19.1,  group: "europe" },

  // Turkic states
  { code: "AZ", name: "Azerbaycan",         lat: 40.1,  lng: 47.6,  group: "turkic" },
  { code: "KZ", name: "Kazakistan",         lat: 48.0,  lng: 66.9,  group: "turkic" },
  { code: "UZ", name: "Özbekistan",         lat: 41.4,  lng: 64.6,  group: "turkic" },
  { code: "TM", name: "Türkmenistan",       lat: 38.9,  lng: 59.6,  group: "turkic" },
  { code: "KG", name: "Kırgızistan",        lat: 41.2,  lng: 74.8,  group: "turkic" },

  // South America
  { code: "BR", name: "Brezilya",           lat: -14.2, lng: -51.9, group: "samerica" },
  { code: "AR", name: "Arjantin",           lat: -38.4, lng: -63.6, group: "samerica" },
  { code: "CL", name: "Şili",               lat: -35.7, lng: -71.5, group: "samerica" },
];

// Bemis HQ — drawn as the centerpiece pin so the globe always tells the
// "from Bursa to the world" story.
const BURSA = { lat: 40.18, lng: 29.06, name: "Bursa Merkez (HQ)" };

const BLUE = "#3B82F6";
const RED = "#EF4444";

type Props = {
  /** Site theme — pulled from useTheme by parent. */
  dark: boolean;
};

export default function InternationalGlobe({ dark }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 600, h: 480 });
  const [hovered, setHovered] = useState<GlobeCountry | null>(null);

  // Track wrapper size so the globe canvas stays responsive to layout changes.
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        // Maintain a friendly aspect ratio — a touch shorter than square so it
        // visually balances the Turkey map's 1327×621 ratio in the same column.
        const h = Math.round(Math.min(w * 0.78, 560));
        setSize({ w, h });
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Slow auto-rotate; user mouse interaction pauses it via globe controls.
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as unknown as { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.55;
      controls.enableZoom = false;
    }
    // Initial framing — point at Anatolia so Turkey + neighboring markets
    // are immediately visible.
    g.pointOfView({ lat: 32, lng: 35, altitude: 2.2 }, 0);
  }, [size.w]);

  // Build labels — Bursa pin plus all the country pins.
  const labels = [
    { ...BURSA, color: RED, size: 1.4, isHQ: true as const },
    ...DEFAULT_COUNTRIES.map(c => ({ ...c, color: BLUE, size: 0.9, isHQ: false as const })),
  ];

  // Arc lines from Bursa to every country — gives the globe its "exporting
  // from Turkey" visual identity.
  const arcs = DEFAULT_COUNTRIES.map(c => ({
    startLat: BURSA.lat,
    startLng: BURSA.lng,
    endLat: c.lat,
    endLng: c.lng,
    color: [`${BLUE}cc`, `${BLUE}33`],
  }));

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ minHeight: 380, height: size.h }}
    >
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        // High-contrast night map for dark theme; soft daytime for light theme.
        globeImageUrl={
          dark
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor={BLUE}
        atmosphereAltitude={0.18}
        showGraticules={false}
        // Country pins
        labelsData={labels}
        labelLat={(d: object) => (d as { lat: number }).lat}
        labelLng={(d: object) => (d as { lng: number }).lng}
        labelText={(d: object) => (d as { name: string }).name}
        labelSize={(d: object) => (d as { size: number }).size}
        labelDotRadius={(d: object) => (d as { isHQ: boolean }).isHQ ? 0.7 : 0.4}
        labelColor={(d: object) => (d as { color: string }).color}
        labelResolution={3}
        labelAltitude={0.01}
        onLabelHover={(d: object | null) => {
          if (!d) return setHovered(null);
          if ((d as { isHQ?: boolean }).isHQ) return setHovered(null);
          setHovered(d as GlobeCountry);
        }}
        // Arcs from Bursa to each market
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcAltitudeAutoScale={0.3}
        arcStroke={0.4}
        arcDashLength={0.45}
        arcDashGap={0.18}
        arcDashAnimateTime={2800}
      />

      {/* Hover caption */}
      {hovered && (
        <div
          className="pointer-events-none absolute top-3 left-3 rounded-xl px-3 py-2 text-sm font-semibold backdrop-blur"
          style={{
            background: dark ? "rgba(8,12,22,0.78)" : "rgba(255,255,255,0.92)",
            border: `1px solid ${BLUE}45`,
            color: dark ? "#cfe1ff" : "#1D4ED8",
            boxShadow: `0 8px 24px ${BLUE}22`,
          }}
        >
          <div className="text-[10px] tracking-[0.18em] uppercase opacity-70">{hovered.code}</div>
          <div>{hovered.name}</div>
        </div>
      )}

      {/* Footer caption */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
        <span className="text-[9px] tracking-widest uppercase" style={{ color: `${BLUE}90` }}>
          Bemis E-V Charge · Yurtdışı Ağı
        </span>
      </div>
    </div>
  );
}
