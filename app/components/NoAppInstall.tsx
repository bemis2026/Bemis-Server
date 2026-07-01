"use client";

import { useEffect } from "react";

/**
 * "Uygulama olarak yükle" (PWA install) istemini AKTİF engeller.
 *
 * Site zaten web app manifest'i / service worker İÇERMİYOR (installability
 * sinyali yok — kasıtlı kaldırıldı). Bu bileşen ek güvence katmanıdır:
 *   1. `beforeinstallprompt` — herhangi bir tarayıcı otomatik "install"
 *      banner'ı denerse iptal edilir (preventDefault), banner çıkmaz.
 *   2. Eski bir sürümden tarayıcıda kalmış service worker varsa kaldırılır
 *      (installability + eski cache kaynağı olabilir).
 *
 * ⚠️ Not: Tarayıcının KENDİ adres-çubuğu "bu siteyi uygulama olarak yükle"
 * ikonu (özellikle Microsoft Edge) site tarafından KALDIRILAMAZ — o, her
 * web sitesinde çıkan tarayıcı arayüzüdür, sayfanın kontrolünde değildir.
 */
export default function NoAppInstall() {
  useEffect(() => {
    const block = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("beforeinstallprompt", block);

    // Eski sürümlerden kalan service worker'ları temizle (varsa).
    try {
      navigator.serviceWorker
        ?.getRegistrations?.()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
    } catch {
      /* serviceWorker API yok — sorun değil */
    }

    return () => window.removeEventListener("beforeinstallprompt", block);
  }, []);

  return null;
}
