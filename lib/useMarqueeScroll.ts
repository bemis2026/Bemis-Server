"use client";

import { useEffect, useRef, useState } from "react";

// Native overflow-x scroll + slow auto-scroll loop + drag-to-scroll (mouse) +
// touch native + pause on hover/touch/drag + smooth scroll button helper.
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
  const [paused, setPaused] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const speed = opts?.speed ?? 0.5; // px / frame ≈ 30 px / sec @ 60 fps

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let rafId = 0;
    const tick = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [paused, speed]);

  const handlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => {
      setPaused(false);
      dragRef.current.active = false;
    },
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
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      const el = scrollRef.current;
      if (!el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = dragRef.current.startScroll - (x - dragRef.current.startX);
    },
    onTouchStart: () => setPaused(true),
    onTouchEnd: () => setPaused(false),
  };

  const scrollByAmount = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return { scrollRef, handlers, scrollByAmount };
}
