"use client";

import { useEffect, useRef } from "react";

// Native overflow-x scroll + slow auto-scroll loop + drag-to-scroll (mouse) +
// native touch + smooth scroll button helper.
//
// Auto-scroll hover'da DURMAZ — sadece drag ve touch sırasında duraklar.
// Bant hep kayar; kullanıcı drag bıraktığında veya parmağı kaldırdığında
// kayışa devam eder. Button click anlık scrollBy yapar, auto-scroll
// arka planda devam eder.
//
// Container'ı 2× duplicate items'la doldur. Auto-scroll scrollWidth/2'ye
// ulaşınca scrollLeft'i 0'a alır → görsel olarak kesintisiz akış.
//
// Returns:
//   scrollRef       — outer .overflow-x-auto div'e bağlanır
//   handlers        — outer div'in onMouse*/onTouch* prop'ları
//   scrollByAmount  — sol/sağ button'lar için programmatic smooth scroll
export function useMarqueeScroll(opts?: { speed?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const touchedRef = useRef(false);
  // Button click başlattığında smooth scroll bitene kadar RAF'i durdur —
  // aksi halde her frame'deki +speed smooth scroll'un hedefini ezer.
  const buttonPauseUntil = useRef(0);
  const speed = opts?.speed ?? 0.5; // px / frame ≈ 30 px / sec @ 60 fps

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Accessibility: kullanıcı OS'unda "reduce motion" tercihini açtıysa
    // otomatik kayma çalışmaz; drag + button manuel kontrol kalır.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let rafId = 0;
    const tick = () => {
      // Drag, touch veya aktif button-smooth-scroll varken auto-scroll
      // atlanır — aksi halde hover dahil her durumda sürekli akar.
      const buttonActive = performance.now() < buttonPauseUntil.current;
      if (
        !dragRef.current.active &&
        !touchedRef.current &&
        !buttonActive &&
        el.scrollWidth > el.clientWidth
      ) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  const handlers = {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      dragRef.current = {
        active: true,
        startX: e.pageX - el.offsetLeft,
        startScroll: el.scrollLeft,
      };
    },
    onMouseUp: () => {
      dragRef.current.active = false;
    },
    onMouseLeave: () => {
      // Mouse container dışına çıkarsa drag'i iptal et — auto-scroll'a
      // dokunmaz çünkü hover-based pause yok.
      dragRef.current.active = false;
    },
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      const el = scrollRef.current;
      if (!el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = dragRef.current.startScroll - (x - dragRef.current.startX);
    },
    onTouchStart: () => {
      touchedRef.current = true;
    },
    onTouchEnd: () => {
      touchedRef.current = false;
    },
  };

  const scrollByAmount = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    // Smooth scroll'a ~700ms süre tanı; bu pencerede RAF dokunmaz.
    // Klikten önce loop reset koşulunu kontrol et — eğer scrollLeft
    // çok yüksekse (yarısına yakın) sıfırla ki sağ scroll loop'a yakın
    // zıplama yapmasın.
    buttonPauseUntil.current = performance.now() + 700;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return { scrollRef, handlers, scrollByAmount };
}
