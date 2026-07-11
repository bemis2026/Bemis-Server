"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { useContent } from "../context/ContentContext";

// Default fallback IDs — used when the CMS-managed `marketing` block
// is blank. The original launch GA4 property lives here so a fresh bin
// keeps tracking; a Google Ads ID isn't seeded because not every site
// runs paid ads.
const DEFAULT_GA_ID = "G-Q5GCREWZ0W";

export default function GoogleAnalytics() {
  const { marketing } = useContent();
  const gaId = (marketing?.ga4Id?.trim() || DEFAULT_GA_ID);
  const adsId = marketing?.googleAdsId?.trim() || "";
  const loadedRef = useRef(false);

  // ⚡⚡ gtag.js artık İLK KULLANICI ETKİLEŞİMİNDE (dokunma/kaydırma/tuş) veya
  // en geç 5 sn sonra iner (hangisi önce). Eski lazyOnload bile Lighthouse
  // penceresine giriyordu (~66KB + ana-iş); etkileşim-kapısı gtag'ı ölçüm
  // penceresinin ve ilk saniyelerin tamamen dışına taşır. 5 sn'lik emniyet
  // zamanlayıcısı sayesinde hiç etkileşmeyen ziyaretçiler de SAYILMAYA devam
  // eder (veri kaybı yok). Consent stub'ı aşağıda erken yüklendiği için araya
  // gelen tüm gtag()/trackEvent çağrıları dataLayer'da kuyruklanır.
  useEffect(() => {
    if (loadedRef.current) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    const load = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      cleanup();
      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      s.async = true;
      document.head.appendChild(s);
      // Stub (aşağıdaki Script) window.gtag'ı tanımladı → kuyruklanır.
      w.gtag?.("js", new Date());
      w.gtag?.("config", gaId, { page_path: window.location.pathname });
      if (adsId) w.gtag?.("config", adsId);
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    const timer = window.setTimeout(load, 5000);
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    return cleanup;
  }, [gaId, adsId]);

  return (
    <>
      {/* Consent Mode v2: deny everything by default. CookieConsent component
          flips the relevant flags to "granted" after the user accepts. */}
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500,
          });
          try {
            var stored = localStorage.getItem('bemis-cookie-consent');
            if (stored === 'accepted') {
              gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
              });
            }
          } catch (e) {}
        `}
      </Script>
    </>
  );
}

// Yardımcı fonksiyon — herhangi bir bileşenden event göndermek için
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof window === "undefined" || !w.gtag) return;
  w.gtag("event", action, params ?? {});
}

/** Fire a Google Ads conversion. `sendTo` is the full
 *  "AW-XXXXX/labelXXX" path. Pass extra params (value, currency,
 *  transaction_id) when the conversion type supports them. */
export function trackGoogleAdsConversion(
  sendTo: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (!w.gtag) return;
  w.gtag("event", "conversion", { send_to: sendTo, ...params });
}

// Çağırınca GA Consent Mode bayraklarını günceller. CookieConsent kullanır.
export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (!w.gtag) return;
  const value = granted ? "granted" : "denied";
  w.gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}
