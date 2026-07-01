"use client";

import Script from "next/script";
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

  // Both gtag tags share the same gtag.js — we config one for GA4 and a
  // second one for the Ads tag (if set). When the Ads ID is blank we
  // skip the second config call so the gtag bootstrap stays minimal.
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
      {/* ⚡ gtag.js (≈178KB + ana-iş bloğu) sayfa TAMAMEN yüklendikten sonra
          insin (lazyOnload). Üstteki consent stub'ı window.gtag'ı erken
          tanımlıyor → araya gelen tüm gtag()/trackEvent çağrıları dataLayer'da
          KUYRUKLANIR, gtag.js gelince işlenir — veri kaybolmaz, sadece
          gönderim ilk saniyelerde gecikir. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
          ${adsId ? `gtag('config', '${adsId}');` : ""}
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
