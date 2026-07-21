"use client";

/**
 * Hero görseli ÇERÇEVELEME editörü — masaüstü ve mobil için AYRI odak + yakınlaştırma.
 *
 * NEDEN: hero `object-cover` ile ekranı doldurur. Mobilde hero çok dar/uzun olduğu
 * için görselin yalnız ~%20-26'sı görünür → masaüstüne göre ayarlanan odak mobilde
 * boş bir bölgeye (duvar/gökyüzü/zemin) düşer. Bu yüzden iki cihaz ayrı ayarlanır.
 *
 * ⚠️ AKICILIK: sürükleme sırasında React state GÜNCELLENMEZ. Pointer hareketinde
 * doğrudan DOM'a yazılır (style + readout textContent); yalnız parmak/fare
 * kaldırılınca onChange ile içeriğe işlenir. Böylece her pikselde yeniden render
 * olmaz, sürükleme takılmaz.
 *
 * ⚠️ Önizleme, canlı sitedeki ile BİREBİR aynı CSS'i kullanır:
 * object-cover + object-position(odak) + transform:scale(zoom) + transform-origin(odak).
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type FrameValue = { pos: string; zoom: number };

type Props = {
  src: string;
  /** Masaüstü değerleri */
  desktop: FrameValue;
  /** Mobil değerleri */
  mobile: FrameValue;
  onChange: (next: { desktop: FrameValue; mobile: FrameValue }) => void;
  title?: string;
};

const DESKTOP_RATIO = 16 / 9;      // geniş ekranda hero ≈ 16:9
const MOBILE_RATIO = 390 / 844;    // telefon dikey (iPhone 14 ölçüsü)
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

function parsePos(pos: string): [number, number] {
  const p = (pos || "50% 50%").trim().split(/\s+/);
  const x = parseFloat(p[0]);
  const y = parseFloat(p[1]);
  return [Number.isFinite(x) ? x : 50, Number.isFinite(y) ? y : 50];
}
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const fmt = (x: number, y: number) => `${Math.round(x)}% ${Math.round(y)}%`;

export default function HeroFramer({ src, desktop, mobile, onChange, title = "Hero Çerçeveleme" }: Props) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const isM = device === "mobile";
  const active = isM ? mobile : desktop;

  const boxRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const readRef = useRef<HTMLSpanElement | null>(null);
  const natural = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  // Sürükleme sırasında yaşayan değerler (React state'e dokunmadan)
  const live = useRef<{ x: number; y: number; zoom: number }>({ x: 50, y: 50, zoom: 1 });
  const drag = useRef<{ startX: number; startY: number; px: number; py: number } | null>(null);

  // Cihaz/props değişince canlı değerleri ve DOM'u eşitle
  const syncFromProps = useCallback(() => {
    const [x, y] = parsePos(active.pos);
    live.current = { x, y, zoom: active.zoom || 1 };
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.pos, active.zoom, device]);

  // DOM'a doğrudan yaz (render YOK)
  const paint = useCallback(() => {
    const { x, y, zoom } = live.current;
    const el = imgRef.current;
    if (el) {
      const p = `${x}% ${y}%`;
      el.style.objectPosition = p;
      el.style.transformOrigin = p;
      el.style.transform = `scale(${zoom})`;
    }
    if (readRef.current) readRef.current.textContent = `${Math.round(x)}% ${Math.round(y)}% · ${zoom.toFixed(2)}×`;
  }, []);

  useEffect(() => { syncFromProps(); }, [syncFromProps]);

  // ⚠️ Görsel ÖNBELLEKTEN gelirse `onLoad` React dinleyicisi bağlanmadan ateşlenir →
  // naturalWidth okunamaz, doğal boyut 0 kalır ve sürükleme matematiği 0 döndürür
  // (yakalandı: sürükleme hiç çalışmıyordu). Mount'ta `complete` ile de oku.
  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth) {
      natural.current = { w: el.naturalWidth, h: el.naturalHeight };
      paint();
    }
  }, [src, paint]);

  const commit = useCallback(() => {
    const { x, y, zoom } = live.current;
    const val: FrameValue = { pos: fmt(x, y), zoom: Math.round(zoom * 100) / 100 };
    onChange(isM ? { desktop, mobile: val } : { desktop: val, mobile });
  }, [desktop, mobile, isM, onChange]);

  /** Sürüklenen piksel → odak yüzdesi. object-cover taşma miktarına göre birebir. */
  const pxToPct = (dx: number, dy: number) => {
    const box = boxRef.current;
    if (!box) return { dx: 0, dy: 0 };
    const bw = box.clientWidth, bh = box.clientHeight;
    let { w: nw, h: nh } = natural.current;
    // Doğal boyut hâlâ bilinmiyorsa canlı DOM'dan dene, o da yoksa kutu oranını
    // varsay → sürükleme HER DURUMDA çalışır (sessizce ölmez).
    if (!nw || !nh) {
      const el = imgRef.current;
      if (el?.naturalWidth) { nw = el.naturalWidth; nh = el.naturalHeight; natural.current = { w: nw, h: nh }; }
      else { nw = bw; nh = bh; }
    }
    const Ri = nw / nh, Rb = bw / bh;
    let Ws: number, Hs: number;
    if (Ri > Rb) { Hs = bh; Ws = bh * Ri; } else { Ws = bw; Hs = bw / Ri; }
    Ws *= live.current.zoom; Hs *= live.current.zoom;
    const ovX = Math.max(0, Ws - bw), ovY = Math.max(0, Hs - bh);
    return {
      dx: ovX > 0 ? -(dx / ovX) * 100 : 0,
      dy: ovY > 0 ? -(dy / ovY) * 100 : 0,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!src) return;
    // ⚠️ setPointerCapture bazı durumlarda fırlatır (geçersiz/pasif pointer id).
    // try/catch OLMADAN sürükleme sessizce hiç başlamıyordu — drag state'i ÖNCE kur.
    drag.current = { startX: e.clientX, startY: e.clientY, px: live.current.x, py: live.current.y };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const { dx, dy } = pxToPct(e.clientX - d.startX, e.clientY - d.startY);
    live.current.x = clamp(d.px + dx, 0, 100);
    live.current.y = clamp(d.py + dy, 0, 100);
    paint(); // render YOK → akıcı
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    commit();
  };

  // Tekerlek ile yakınlaştırma
  const onWheel = (e: React.WheelEvent) => {
    if (!src) return;
    live.current.zoom = clamp(live.current.zoom + (e.deltaY < 0 ? 0.06 : -0.06), ZOOM_MIN, ZOOM_MAX);
    paint();
    if (wheelTimer.current) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(commit, 260); // sürtünmesiz: dursun, sonra kaydet
  };
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setZoom = (z: number) => { live.current.zoom = clamp(z, ZOOM_MIN, ZOOM_MAX); paint(); };
  const reset = () => { live.current = { x: 50, y: 50, zoom: 1 }; paint(); commit(); };

  const ratio = isM ? MOBILE_RATIO : DESKTOP_RATIO;
  // Mobilde yüksekliği sabitleyip genişliği türet (telefon şekli), masaüstünde tam genişlik
  const boxStyle: React.CSSProperties = isM
    ? { height: 400, width: Math.round(400 * MOBILE_RATIO), margin: "0 auto" }
    : { width: "100%", aspectRatio: String(DESKTOP_RATIO) };

  if (!src) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-[11px] font-semibold text-white/45 uppercase tracking-wider">{title}</p>
        <div className="flex items-center gap-2">
          <span ref={readRef} className="text-[10px] font-mono text-white/35" />
          <button onClick={reset} className="text-[10px] text-white/30 hover:text-white/60 underline underline-offset-2">Sıfırla</button>
        </div>
      </div>

      {/* Cihaz sekmeleri — hangi cihazın ayarını düzenlediğini belirler */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 w-fit">
        {([["desktop", "🖥️ Masaüstü"], ["mobile", "📱 Mobil"]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setDevice(k)}
            className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
              device === k ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >{label}</button>
        ))}
      </div>

      {/* CANLI ÖNİZLEME — canlı sitedeki ile birebir aynı CSS */}
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        className="relative rounded-xl overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none bg-black/40"
        style={boxStyle}
        title="Sürükleyerek konumlandır · tekerlek ile yakınlaştır"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          onLoad={(e) => {
            const el = e.currentTarget;
            natural.current = { w: el.naturalWidth, h: el.naturalHeight };
            paint();
          }}
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* Üçte-bir kılavuzları */}
        {[33, 66].map((p) => (
          <div key={`v${p}`} className="absolute inset-y-0 pointer-events-none" style={{ left: `${p}%`, width: 1, background: "rgba(255,255,255,0.10)" }} />
        ))}
        {[33, 66].map((p) => (
          <div key={`h${p}`} className="absolute inset-x-0 pointer-events-none" style={{ top: `${p}%`, height: 1, background: "rgba(255,255,255,0.10)" }} />
        ))}
        <div className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] text-white/45 pointer-events-none">
          {isM ? "Mobilde görünen alan" : "Geniş ekranda görünen alan"}
        </div>
      </div>

      {/* Yakınlaştırma */}
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] text-white/35 w-14 shrink-0">Yakınlaştır</span>
        <input
          type="range" min={ZOOM_MIN} max={ZOOM_MAX} step={0.01}
          defaultValue={active.zoom || 1}
          key={`${device}-${active.zoom}`}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          onPointerUp={commit}
          onKeyUp={commit}
          className="flex-1 accent-white/70"
          aria-label="Yakınlaştırma"
        />
      </div>

      <p className="text-[10px] text-white/25 leading-relaxed">
        Görseli <b className="text-white/40">sürükleyerek</b> konumlandırın, <b className="text-white/40">tekerlek</b> veya
        çubukla yakınlaştırın. Masaüstü ve mobil <b className="text-white/40">ayrı ayrı</b> ayarlanır — mobilde hero dar
        olduğu için görselin çok daha küçük bir kısmı görünür.
      </p>
    </div>
  );
}
