"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

/**
 * Yatay kaydırılan şerit + FARE İÇİN ok tuşları.
 *
 * ⚠️ NEDEN GEREKLİ (kullanıcı bildirdi, 2026-08-05): şeritte `scrollbar-hide`
 * var (kaydırma çubuğu gizli) ve fare tekerleği yatay kaydırmaz — touchpad
 * kaydırır, fare kaydırmaz. Sonuç: FARE kullanan ziyaretçi şeridin sağında
 * kalan kategorilere HİÇ ulaşamıyordu. Oklar bu boşluğu kapatır.
 *
 * Oklar YALNIZ o yönde gidilecek içerik varsa görünür (sonuna gelince kaybolur),
 * dokunmatik/dar ekranda gizlidir (orada parmakla kaydırma zaten çalışıyor ve
 * oklar çipleri örterdi).
 */
export default function YatayKaydirma({
  children,
  d,
  className = "",
  onceki = "Önceki",
  sonraki = "Sonraki",
}: {
  children: React.ReactNode;
  d: boolean;
  className?: string;
  onceki?: string;
  sonraki?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [sol, setSol] = useState(false);
  const [sag, setSag] = useState(false);

  const olc = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const pay = 2; // yuvarlama payı: 0.5px'lik artıklar ok'u sonsuza dek açık bırakmasın
    setSol(el.scrollLeft > pay);
    setSag(el.scrollLeft + el.clientWidth < el.scrollWidth - pay);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    olc();
    el.addEventListener("scroll", olc, { passive: true });
    // Kapsayıcı VE içerik boyutu değişince yeniden ölç: dil değişimi çip
    // genişliklerini değiştirir, pencere yeniden boyutlanır, kategori eklenir.
    const ro = new ResizeObserver(olc);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    return () => { el.removeEventListener("scroll", olc); ro.disconnect(); };
  }, [olc, children]);

  const animRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const kaydir = (yon: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // Görünen genişliğin %80'i: kullanıcı nerede kaldığını kaybetmesin diye
    // tam bir ekran değil, bir tık eksik kaydırılır.
    const adim = Math.max(160, el.clientWidth * 0.8);
    const bas = el.scrollLeft;
    const maks = el.scrollWidth - el.clientWidth;
    const hedef = Math.max(0, Math.min(maks, bas + yon * adim));
    const mesafe = hedef - bas;
    if (!mesafe) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = hedef;
      olc();
      return;
    }
    // ⚠️ `scrollBy({behavior:"smooth"})` KULLANILMIYOR: bazı gömülü tarayıcı
    // ortamlarında SESSİZCE hiç çalışmıyor (ölçüldü: `auto` ve doğrudan
    // `scrollLeft` ataması çalışırken `smooth` scrollLeft'i 0'da bırakıyordu).
    // Elle rAF animasyonu her yerde çalışır + süre bizim kontrolümüzde.
    cancelAnimationFrame(animRef.current);
    const sure = 320;
    const t0 = performance.now();
    const kare = (t: number) => {
      const p = Math.min(1, (t - t0) / sure);
      el.scrollLeft = bas + mesafe * (1 - Math.pow(1 - p, 3)); // easeOutCubic
      if (p < 1) animRef.current = requestAnimationFrame(kare);
      else olc();
    };
    animRef.current = requestAnimationFrame(kare);

    // ⚠️ GÜVENLİK AĞI: bazı ortamlarda sayfa kare üretmez → rAF hiç çalışmaz
    // (bu panelde ölçüldü: 1 sn'de 0 kare; `behavior:"smooth"` de aynı sebeple
    // ölüydü). Bu tuşun TEK işlevi, faresi olan ziyaretçinin başka türlü
    // ulaşamadığı kategorilere gitmesi — sessizce hiçbir şey yapmamalı.
    // Süre dolduğunda hâlâ kıpırdamadıysa doğrudan hedefe atla.
    window.setTimeout(() => {
      if (ref.current && ref.current.scrollLeft === bas) {
        ref.current.scrollLeft = hedef;
        olc();
      }
    }, sure + 80);
  };

  const okStili: React.CSSProperties = {
    background: d ? "rgba(30,30,36,0.92)" : "rgba(255,255,255,0.96)",
    border: `1px solid ${d ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)"}`,
    color: d ? "#e8e8ea" : "#1a1a1a",
    boxShadow: d ? "0 2px 10px rgba(0,0,0,0.45)" : "0 2px 10px rgba(0,0,0,0.12)",
  };
  // Çipler okun ALTINDA kaybolsun diye kenarda yumuşak geçiş
  const perde = (yon: "left" | "right"): React.CSSProperties => ({
    background: `linear-gradient(to ${yon === "left" ? "right" : "left"}, ${
      d ? "rgba(12,12,14,0.96)" : "rgba(248,248,251,0.96)"
    } 35%, transparent 100%)`,
  });

  return (
    <div className="relative">
      <div ref={ref} className={className}>
        {children}
      </div>

      {sol && (
        <div className="hidden sm:flex absolute left-0 top-0 bottom-0 w-14 items-center justify-start pointer-events-none" style={perde("left")}>
          <button
            type="button"
            onClick={() => kaydir(-1)}
            aria-label={onceki}
            /* ⚠️ cursor-pointer ZORUNLU: Tailwind v4 button'a cursor:default verir */
            className="pointer-events-auto cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95"
            style={okStili}
          >
            <RiArrowLeftSLine size={20} />
          </button>
        </div>
      )}

      {sag && (
        <div className="hidden sm:flex absolute right-0 top-0 bottom-0 w-14 items-center justify-end pointer-events-none" style={perde("right")}>
          <button
            type="button"
            onClick={() => kaydir(1)}
            aria-label={sonraki}
            className="pointer-events-auto cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95"
            style={okStili}
          >
            <RiArrowRightSLine size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
