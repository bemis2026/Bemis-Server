"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import type { InternationalDealer } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";

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
  // ⚠️ Küre üzerindeki rozet/lejant metinleri 2026-08-02'ye kadar SABİT TÜRKÇEYDİ
  // ("Ülke · Aktif Ağ", "MERKEZ TR", "Distribütör") → yabancı dillerde de Türkçe
  // görünüyordu. Bileşenin dil bağlantısı hiç yoktu; DealerNetwork'teki desenle
  // aynı: L(tr,en) = pickText → tr/en satır-içi, de/es/ar/ru ui.json'dan.
  // 📌 Küreye yeni metin eklerken L() kullan + ui.json'a EN anahtarını ekle.
  const { lang } = useLanguage();
  const L = (tr: string, en: string) => pickText(lang, tr, en);
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

  // Initial framing — point at Bursa so the HQ pin is the centerpiece. We
  // hold the globe perfectly still for 2.6s before nudging auto-rotation on
  // so the visitor's eye lands on MERKEZ first.
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as unknown as {
      autoRotate: boolean; autoRotateSpeed: number;
      enableZoom: boolean; zoomSpeed?: number;
      enableRotate?: boolean; enablePan?: boolean;
      minDistance?: number; maxDistance?: number;
      touches?: { ONE?: number; TWO?: number };
    };
    if (controls) {
      controls.autoRotate = false;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
      controls.zoomSpeed = 0.9;
      controls.enableRotate = true;
      // enablePan must stay true for THREE.TOUCH.DOLLY_PAN (=2) to register
      // the second finger — otherwise pinch is silently dropped on mobile.
      controls.enablePan = true;
      controls.touches = { ONE: 0, TWO: 2 };
      controls.minDistance = 180;
      controls.maxDistance = 600;
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
    const t = setTimeout(() => {
      const c = g.controls() as unknown as { autoRotate: boolean };
      if (c) c.autoRotate = true;
    }, 2600);
    return () => clearTimeout(t);
  }, [size.w]);

  // Track the cursor position inside the wrapper so the hover tooltip
  // can sit next to the pointer instead of getting lost in the
  // top-left corner. Stored on a CSS variable via direct DOM mutation
  // so the React tree doesn't re-render on every pixel of movement.
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

  // Fly to a country when the side-list selection changes.
  // Depending on `activeCountries` here causes the effect to re-fire
  // on every parent re-render (the array reference changes), which
  // restarts the camera animation and reads as a repeated click.
  // Closure read of activeCountries is fine — we only care about the
  // current value at click time.
  useEffect(() => {
    if (!selectedId) return;
    const g = globeRef.current;
    if (!g) return;
    const target = activeCountries.find(c => c.id === selectedId);
    if (!target) return;
    const controls = g.controls() as unknown as { autoRotate: boolean };
    if (controls) controls.autoRotate = false;
    g.pointOfView({ lat: target.lat, lng: target.lng, altitude: 1.4 }, 1100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Country pins: single clean round dots painted as flat circles via
  // labelsData (with text invisible). Picked this layer instead of
  // pointsData because pointsData renders extruded cylinders, which
  // reads as "3D columns". labelDotRadius gives us a flat sphere
  // hugging the surface — looks like a round map dot from any angle.
  const labels = useMemo(
    () => activeCountries.map(c => ({ ...c, isHQ: false as const })),
    [activeCountries],
  );
  const rings = useMemo(
    () => [
      { lat: BURSA.lat, lng: BURSA.lng, color: RED, maxR: 4.0, speed: 1.0, period: 2200 },
    ],
    [],
  );
  // Only HQ rides the HTML overlay (red branded badge + "MERKEZ"/"HQ" caption).
  // ⚠️ `lang` bağımlılık: react-globe.gl htmlElement'i YALNIZ veri kimliği
  // değişince yeniden çağırır. Dizi sabit kalırsa dil değiştirildiğinde pin
  // altındaki yazı eski dilde takılı kalır (boş dep ile öyleydi).
  const htmlElements = useMemo(() => [{ lat: BURSA.lat, lng: BURSA.lng }], [lang]);
  const arcs = useMemo(
    () => activeCountries.map(c => ({
      startLat: BURSA.lat,
      startLng: BURSA.lng,
      endLat: c.lat,
      endLng: c.lng,
    })),
    [activeCountries],
  );

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${dark ? "globe-dimmed" : ""}`}
      onPointerLeave={() => setHovered(null)}
      style={{
        minHeight: 380,
        height: size.h,
        background: dark
          ? "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.10) 0%, transparent 65%)"
          : "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.08) 0%, transparent 65%)",
        // touch-action: none lets OrbitControls own all gestures inside the
        // globe (one-finger rotate, two-finger pinch-zoom, two-finger pan).
        // Without it, the browser captures the second finger for page zoom
        // and the globe can't be zoomed on mobile.
        touchAction: "none",
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
        // Always blue-marble — the night-side texture was too dark and
        // the operator wanted the surface lighter regardless of UI theme.
        // We'll dial brightness up further in a follow-up if needed.
        globeImageUrl="/globe/earth-blue-marble.jpg"
        bumpImageUrl="/globe/earth-topology.png"
        atmosphereColor={BLUE}
        atmosphereAltitude={0.22}
        showGraticules={false}
        // Country pins render here — labelDotRadius paints a small
        // flat-sphere dot at the country's lat/lng. Text is intentionally
        // empty so only the dot is visible; the hover tooltip in the
        // corner handles naming.
        labelsData={labels}
        labelLat={(d: object) => (d as { lat: number }).lat}
        labelLng={(d: object) => (d as { lng: number }).lng}
        labelText={() => ""}
        labelSize={() => 0.001}
        labelDotRadius={() => 0.45}
        labelColor={() => BLUE}
        labelResolution={3}
        labelAltitude={0.008}
        pointsData={[]}
        onLabelHover={(d: object | null) => {
          if (!d) return;
          if ((d as { isHQ?: boolean }).isHQ) return;
          const dealer = d as InternationalDealer;
          setHovered(prev => prev?.id === dealer.id ? prev : dealer);
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
          // HQ-only HTML overlay: red badge with the white favicon and
          // a "MERKEZ" caption underneath. Country pins are flat dots
          // rendered via the labelDotRadius layer above.
          const el = document.createElement("div");
          el.style.cssText = "transform: translate(-50%, -50%); pointer-events: none; position: relative; width: 22px; height: 22px;";
          el.innerHTML = `
            <div style="
              width: 26px; height: 26px;
              border-radius: 50%;
              background: #E11D48;
              border: 2px solid #ffffff;
              box-shadow: 0 0 0 2px ${RED}55, 0 6px 14px rgba(225,29,72,0.45);
              display: flex; align-items: center; justify-content: center;
              overflow: hidden;
            ">
              <img src="/favicon-white-192.png" alt="Bemis" width="22" height="22" style="object-fit: contain; padding: 3px;" />
            </div>
            <span style="
              position: absolute; top: 100%; left: 50%;
              transform: translateX(-50%);
              margin-top: 3px;
              font-size: 8px; font-weight: 800; letter-spacing: 0.10em;
              color: ${dark ? "#fecaca" : "#B91C1C"};
              text-shadow: 0 1px 2px rgba(0,0,0,0.6);
              padding: 1px 4px; border-radius: 3px;
              background: ${dark ? "rgba(8,12,22,0.55)" : "rgba(255,255,255,0.75)"};
              white-space: nowrap;
            ">${L("MERKEZ", "HQ")}</span>
          `;
          return el;
        }}
      />

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
          {activeCountries.length} {L("Ülke · Aktif Ağ", "Countries · Active Network")}
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
            {L("MERKEZ TR", "HQ TÜRKİYE")}
          </span>
        </span>
        <span className="w-px h-3" style={{ background: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)" }} />
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: BLUE, boxShadow: `0 0 6px ${BLUE}` }} />
          <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: dark ? "#cfe1ff" : "#1D4ED8" }}>
            {L("Distribütör", "Distributor")}
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
