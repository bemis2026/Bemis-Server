"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";

// Meta (Facebook) Pixel base tag. Only mounts when the operator has
// set `marketing.metaPixelId` from the admin panel — empty string =
// completely off (no script, no <noscript> fallback). Consent is
// gated separately: until the visitor accepts cookies the pixel
// initialises in "revoked" state so Meta receives no PII; once
// consent is granted we send the queued PageView.
//
// CookieConsent's accept handler dispatches `bemis:marketing-consent`
// with `{ detail: true | false }`, which this component listens for.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const CONSENT_KEY = "bemis-cookie-consent";

export default function MetaPixel() {
  const { marketing } = useContent();
  const pixelId = marketing?.metaPixelId?.trim() || "";
  const [consent, setConsent] = useState<"granted" | "revoked">("revoked");

  useEffect(() => {
    // Initial read — accept localStorage value if already present.
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === "accepted") setConsent("granted");
    } catch {}
    // Listen for runtime consent flips so a "Reddet → Kabul Et"
    // toggle activates tracking without a reload.
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setConsent(detail ? "granted" : "revoked");
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("consent", detail ? "grant" : "revoke");
        if (detail) window.fbq("track", "PageView");
      }
    };
    window.addEventListener("bemis:marketing-consent", handler as EventListener);
    return () => window.removeEventListener("bemis:marketing-consent", handler as EventListener);
  }, []);

  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', '${consent === "granted" ? "grant" : "revoke"}');
          fbq('init', '${pixelId}');
          ${consent === "granted" ? "fbq('track', 'PageView');" : ""}
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/** Fire a Meta Pixel standard event. Returns silently when the
 *  pixel isn't loaded (admin hasn't set an ID, or consent revoked). */
export function trackMetaPixelEvent(
  event: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq("track", event, params);
}
