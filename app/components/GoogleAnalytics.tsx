"use client";

import Script from "next/script";

const GA_ID = "G-Q5GCREWZ0W";

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
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
