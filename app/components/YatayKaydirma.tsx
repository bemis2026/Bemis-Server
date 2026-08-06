"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

/**
 * Yatay kaydırılan şeritler için ORTAK MANTIK + hazır bileşen.
 *
 * ⚠️ NEDEN VAR (kullanıcı bildirdi, 2026-08-05): şeritlerde `scrollbar-hide`
 * kullanılıyor (kaydırma çubuğu gizli) ve **fare tekerleği yatay kaydırmaz** —
 * touchpad kaydırır, fare kaydırmaz. Sonuç: fare kullanan ziyaretçi şeridin
 * dışında kalan içeriğe HİÇ ulaşamıyordu.
 *
 * İki tüketici var ve GÖRÜNÜMLERİ farklı (biri kenarda perdeli küçük ok, öteki
 * içeride accent renkli yüzen ok) → görünümü tüketici çizer, BURASI yalnız
 * davranışı verir. Böylece "uçlarda oku gizle" mantığı tek yerde durur.
 */

/** Şeridin solunda/sağında daha içerik var mı? Ok tuşlarını göstermek için. */
export function useKaydirmaDurumu(
  ref: React.RefObject<HTMLElement | null>,
  bagimlilik?: unknown,
) {
  const [sol, setSol] = useState(false);
  const [sag, setSag] = useState(false);

  const olc = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const pay = 2; // yuvarlama payı: 0.5px artık ok'u sonsuza dek açık bırakmasın
    setSol(el.scrollLeft > pay);
    setSag(el.scrollLeft + el.clientWidth < el.scrollWidth - pay);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    olc();
    el.addEventListener("scroll", olc, { passive: true });
    // Kapsayıcı VE içerik boyutu değişince yeniden ölç: dil değişimi çip
    // genişliklerini değiştirir, pencere yeniden boyutlanır, kart eklenir.
    const ro = new ResizeObserver(olc);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    return () => { el.removeEventListener("scroll", olc); ro.disconnect(); };
  }, [ref, olc, bagimlilik]);

  return { sol, sag, olc };
}

/**
 * Şeridi `mesafe` kadar yumuşak kaydırır ve sınırlara kenetler.
 *
 * ⚠️ `scrollBy({behavior:"smooth"})` KULLANILMIYOR: bazı ortamlarda sayfa kare
 * üretmediği için SESSİZCE hiç çalışmıyor (ölçüldü: `auto` ve doğrudan
 * `scrollLeft` ataması çalışırken `smooth` scrollLeft'i 0'da bırakıyordu;
 * requestAnimationFrame 1 sn'de 0 kare). Elle rAF + güvenlik ağı her yerde çalışır.
 */
export function yumusakKaydir(
  el: HTMLElement | null,
  mesafe: number,
  bitince?: () => void,
  animRef?: { current: number },
) {
  if (!el || !mesafe) return;
  const bas = el.scrollLeft;
  const maks = el.scrollWidth - el.clientWidth;
  const hedef = Math.max(0, Math.min(maks, bas + mesafe));
  const yol = hedef - bas;
  if (!yol) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollLeft = hedef;
    bitince?.();
    return;
  }
  if (animRef) cancelAnimationFrame(animRef.current);
  const sure = 320;
  const t0 = performance.now();
  const kare = (t: number) => {
    const p = Math.min(1, (t - t0) / sure);
    el.scrollLeft = bas + yol * (1 - Math.pow(1 - p, 3)); // easeOutCubic
    if (p < 1) { const id = requestAnimationFrame(kare); if (animRef) animRef.current = id; }
    else bitince?.();
  };
  const id = requestAnimationFrame(kare);
  if (animRef) animRef.current = id;

  // ⚠️ GÜVENLİK AĞI: kare üretmeyen ortamda tuş SESSİZCE hiçbir şey yapmasın —
  // bu tuşun tek işlevi, fare kullanan ziyaretçinin başka türlü ulaşamadığı
  // içeriğe gitmesi. Süre dolduğunda hâlâ kıpırdamadıysa doğrudan hedefe atlar.
  window.setTimeout(() => {
    if (el.scrollLeft === bas) { el.scrollLeft = hedef; bitince?.(); }
  }, sure + 80);
}

/**
 * Hazır sarmalayıcı: şerit + kenarda perdeli ok tuşları.
 * (Farklı görünüm isteyen tüketici yukarıdaki hook/yardımcıyı doğrudan kullanır.)
 */
export default function YatayKaydirma({
  children, d, className = "", onceki = "Önceki", sonraki = "Sonraki",
}: {
  children: React.ReactNode;
  d: boolean;
  className?: string;
  onceki?: string;
  sonraki?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const { sol, sag, olc } = useKaydirmaDurumu(ref, children);
  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const kaydir = (yon: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // Görünen genişliğin %80'i: kullanıcı nerede kaldığını kaybetmesin diye
    // tam bir ekran değil, bir tık eksik kaydırılır.
    yumusakKaydir(el, yon * Math.max(160, el.clientWidth * 0.8), olc, animRef);
  };

  const okStili: React.CSSProperties = {
    background: d ? "rgba(30,30,36,0.92)" : "rgba(255,255,255,0.96)",
    border: `1px solid ${d ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)"}`,
    color: d ? "#e8e8ea" : "#1a1a1a",
    boxShadow: d ? "0 2px 10px rgba(0,0,0,0.45)" : "0 2px 10px rgba(0,0,0,0.12)",
  };
  const perde = (yon: "left" | "right"): React.CSSProperties => ({
    background: `linear-gradient(to ${yon === "left" ? "right" : "left"}, ${
      d ? "rgba(12,12,14,0.96)" : "rgba(248,248,251,0.96)"
    } 35%, transparent 100%)`,
  });

  return (
    <div className="relative">
      <div ref={ref} className={className}>{children}</div>

      {sol && (
        <div className="hidden sm:flex absolute left-0 top-0 bottom-0 w-14 items-center justify-start pointer-events-none" style={perde("left")}>
          <button
            type="button" onClick={() => kaydir(-1)} aria-label={onceki}
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
            type="button" onClick={() => kaydir(1)} aria-label={sonraki}
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
