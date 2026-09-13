"use client";

// KATLANABİLİR TELEFON UYUMU (2026-09-14) — tek seferlik ölçüm yerine CANLI abonelik.
//
// ⚠️ NEDEN VAR: katlanabilir cihazda ekran SAYFA YENİLENMEDEN değişir.
//    iPhone Duo: kapak ekranı ~466×678 CSS px → açılınca ~890×626 (yatay).
//    Galaxy Fold: kapak ~344×882 → açık ~884×774.
//    Mount anında `window.innerWidth` ya da `matchMedia(...).matches` okuyup
//    bırakan kod o andaki hâlde DONAR: kapalıyken açılan sayfa, telefon
//    açıldıktan sonra da "dar ekran" sanır (tersi de olur — açıkken açılan
//    sayfa katlanınca "geniş ekran" sanmaya devam eder).
//    matchMedia'nın `change` olayına abone olmak bunu kendiliğinden çözer;
//    aynı abonelik ekran döndürmede de doğru çalışır.
//
// SSR GÜVENLİ: sunucuda ve ilk render'da DAİMA `false` döner, gerçek değere ilk
// effect'te geçilir. (İlk render'da matchMedia okunsaydı sunucu HTML'i ile
// istemci HTML'i ayrışır, hydration uyarısı çıkardı.) Bu yüzden çağıran taraf
// "false" başlangıcını güvenli varsayılan kabul edecek şekilde yazılmalı.

import { useEffect, useState } from "react";

export function useMediaQuery(sorgu: string): boolean {
  const [eslesti, setEslesti] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(sorgu);
    const uygula = () => setEslesti(mql.matches);
    uygula();
    mql.addEventListener("change", uygula);
    return () => mql.removeEventListener("change", uygula);
  }, [sorgu]);

  return eslesti;
}
