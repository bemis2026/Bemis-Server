"use client";

// Modal/overlay erişilebilirlik yardımcısı (WCAG 2.4.3 / 2.1.2):
//  - açılınca odağı modal içindeki ilk öğeye taşır
//  - Tab/Shift+Tab odağı modal içinde döndürür (arka plana kaçmaz)
//  - Escape ile onEscape() çağırır (modalı kapatmak için)
//  - kapanınca odağı modalı açan öğeye geri verir
// Görsel etki YOK — yalnız klavye/ekran-okuyucu davranışı.

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  onEscape?: () => void
) {
  const ref = useRef<T>(null);
  // onEscape'i ref'te tut — inline callback effect'i yeniden tetiklemesin.
  const escRef = useRef(onEscape);
  escRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const prevFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );

    // Açılışta ilk odaklanabilir öğeye geç (yoksa panelin kendisine).
    const first = focusables()[0];
    if (first) first.focus();
    else {
      node.setAttribute("tabindex", "-1");
      node.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        escRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      const activeEl = document.activeElement as HTMLElement;
      if (e.shiftKey) {
        if (activeEl === firstEl || !node.contains(activeEl)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (activeEl === lastEl || !node.contains(activeEl)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (prevFocused && typeof prevFocused.focus === "function") prevFocused.focus();
    };
  }, [active]);

  return ref;
}
