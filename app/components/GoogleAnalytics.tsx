"use client";

import Script from "next/script";

const GA_ID = "G-Q5GCREWZ0W";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Consent Mode v2: deny everything by default. CookieConsent component
          flips the relevant flags to "granted" after the user accepts. */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
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
