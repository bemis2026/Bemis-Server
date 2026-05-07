"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import type { InternationalDealer } from "../context/ContentContext";

// Globe is canvas + WebGL, must be SSR-disabled.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Bemis HQ — drawn as the centerpiece pin so the globe always tells the
// "from Bursa to the world" story.
const BURSA = { lat: 40.18, lng: 29.06, name: "MERKEZ TR" };

const BLUE = "#3B82F6";
const RED = "#EF4444";

type Props = {
  dark: boolean;
  /** Active distributor countries — only `active: true` rows render as pins. */
  countries: InternationalDealer[];
  /** Optional: countryId currently selected in the side list (zooms in). */
  selectedId?: string | null;
  /** Notify parent when user clicks a country pin. */
  onSelect?: (id: string) => void;
};

export default function InternationalGlobe({ dark, countries, selectedId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 600, h: 480 });
  const [hovered, setHovered] = useState<InternationalDealer | null>(null);

  const activeCountries = countries.filter(c => c.active);

  // Track wrapper size so the globe canvas stays responsive to layout changes.
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = Math.round(Math.min(w * 0.78, 560));
        setSize({ w, h });
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Initial framing — point at Bursa so the HQ pin is the focal point on first
  // render. Auto-rotate kicks in afterwards, paused by user interaction.
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as unknown as { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
    }
    // Crank the renderer up to the device's native pixel ratio so the texture
    // looks crisp on retina/HiDPI displays (default behaviour caps it at 1).
    const renderer = g.renderer() as unknown as {
      setPixelRatio?: (r: number) => void;
      capabilities?: { getMaxAnisotropy?: () => number };
    } | undefined;
    if (renderer?.setPixelRatio) {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2.5) : 2;
      renderer.setPixelRatio(dpr);
    }
    g.pointOfView({ lat: BURSA.lat, lng: BURSA.lng, altitude: 1.55 }, 0);
  }, [size.w]);

  // Fly to a country when the side-list selection changes.
  useEffect(() => {
    if (!selectedId) return;
    const g = globeRef.current;
    if (!g) return;
    const target = activeCountries.find(c => c.id === selectedId);
    if (!target) return;
    const controls = g.controls() as unknown as { autoRotate: boolean };
    if (controls) controls.autoRotate = false;
    g.pointOfView({ lat: target.lat, lng: target.lng, altitude: 1.4 }, 1100);
  }, [selectedId, activeCountries]);

  // Country pins only. The HQ marker is a custom HTML overlay (logo+caption)
  // so we can show our brand mark instead of a plain 3D label.
  const labels = activeCountries.map(c => ({ ...c, color: BLUE, size: 0.7, isHQ: false as const }));

  // Pulsing rings — slow steady ring under Bursa pin and one under each
  // active country pin. Adds depth without the arc-line clutter.
  const rings = [
    { lat: BURSA.lat, lng: BURSA.lng, color: RED, maxR: 4.0, speed: 1.0, period: 2200 },
    ...activeCountries.map(c => ({
      lat: c.lat, lng: c.lng, color: BLUE, maxR: 2.2, speed: 0.7, period: 3200,
    })),
  ];

  // Custom HTML overlay for HQ — uses our /icon route so the marker matches
  // the browser tab favicon pixel-for-pixel.
  const htmlElements = [{ lat: BURSA.lat, lng: BURSA.lng }];

  // Thin export-flow arcs from Bursa to each active distributor country.
  // Stroke kept tiny + alpha low so the lines feel like a soft trail rather
  // than the busy fan we had before.
  const arcs = activeCountries.map(c => ({
    startLat: BURSA.lat,
    startLng: BURSA.lng,
    endLat: c.lat,
    endLng: c.lng,
  }));

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{
        minHeight: 380,
        height: size.h,
        background: dark
          ? "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.10) 0%, transparent 65%)"
          : "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.08) 0%, transparent 65%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: dark
            ? "inset 0 0 80px rgba(8,12,22,0.55), inset 0 0 0 1px rgba(59,130,246,0.18)"
            : "inset 0 0 80px rgba(255,255,255,0.55), inset 0 0 0 1px rgba(59,130,246,0.18)",
        }}
      />
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        // Earth textures — three-globe's stock 2K maps combined with retina
        // pixel ratio (set in useEffect below) keep coastlines sharp on HiDPI
        // screens without ballooning the bundle with 8K texture downloads.
        globeImageUrl={
          dark
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor={BLUE}
        atmosphereAltitude={0.22}
        showGraticules={false}
        labelsData={labels}
        labelLat={(d: object) => (d as { lat: number }).lat}
        labelLng={(d: object) => (d as { lng: number }).lng}
        labelText={(d: object) => (d as { countryName: string }).countryName}
        labelSize={(d: object) => (d as { size: number }).size}
        labelDotRadius={(d: object) => (d as { isHQ: boolean }).isHQ ? 0.85 : 0.45}
        labelColor={(d: object) => (d as { color: string }).color}
        labelResolution={3}
        labelAltitude={0.012}
        onLabelHover={(d: object | null) => {
          if (!d) return setHovered(null);
          if ((d as { isHQ?: boolean }).isHQ) return setHovered(null);
          setHovered(d as InternationalDealer);
        }}
        onLabelClick={(d: object) => {
          if ((d as { isHQ?: boolean }).isHQ) return;
          const id = (d as { id?: string }).id;
          if (id && onSelect) onSelect(id);
        }}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={(d: object) => () => (d as { color: string }).color}
        ringMaxRadius={(d: object) => (d as { maxR: number }).maxR}
        ringPropagationSpeed={(d: object) => (d as { speed: number }).speed}
        ringRepeatPeriod={(d: object) => (d as { period: number }).period}
        ringResolution={48}
        ringAltitude={0.008}
        // Thin export-flow arcs — fade-out gradient + slow dash animation
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => [`${BLUE}88`, `${BLUE}11`]}
        arcStroke={0.18}
        arcAltitudeAutoScale={0.45}
        arcDashLength={0.4}
        arcDashGap={0.55}
        arcDashAnimateTime={5800}
        // HQ HTML overlay — brand-mark image + tiny "MERKEZ" caption.
        htmlElementsData={htmlElements}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.02}
        htmlElement={() => {
          // The wrapper is centered on lat/lng via translate(-50%, -50%).
          // The badge sits at that center; the MERKEZ caption hangs below
          // absolutely so the LOGO (not the column) stays exactly on Bursa.
          const el = document.createElement("div");
          el.style.cssText = "transform: translate(-50%, -50%); pointer-events: none; position: relative; width: 22px; height: 22px;";
          el.innerHTML = `
            <div style="
              width: 26px; height: 26px;
              border-radius: 50%;
              /* Brand red so a white-on-transparent favicon stays visible. */
              background: #E11D48;
              border: 2px solid #ffffff;
              box-shadow: 0 0 0 2px ${RED}55, 0 6px 14px rgba(225,29,72,0.45);
              display: flex; align-items: center; justify-content: center;
              overflow: hidden;
            ">
              <img src="/icon" alt="Bemis" width="22" height="22" style="object-fit: contain; padding: 3px;" />
            </div>
            <span style="
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              margin-top: 3px;
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.10em;
              color: ${dark ? "#fecaca" : "#B91C1C"};
              text-shadow: 0 1px 2px rgba(0,0,0,0.6);
              padding: 1px 4px;
              border-radius: 3px;
              background: ${dark ? "rgba(8,12,22,0.55)" : "rgba(255,255,255,0.75)"};
              white-space: nowrap;
            ">MERKEZ</span>
          `;
          return el;
        }}
      />

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
