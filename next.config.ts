import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content Security Policy — restricts what the browser is allowed to
// load. Tuned for our actual third-party surface: Google Analytics,
// YouTube embeds, JSONBin / ImgBB / Cloudinary / MyMemory APIs, flag
// CDN, Google Fonts. Includes 'unsafe-inline' for styles because
// framer-motion writes inline transforms on every animated element,
// and 'unsafe-inline' for scripts because Next.js ships small inline
// hydration scripts in the page shell. We keep frame-ancestors 'self'
// so the X-Frame-Options SAMEORIGIN policy still wins on browsers
// that prefer one over the other.
const csp = [
  "default-src 'self'",
  // Ads/marketing surface:
  //   googletagmanager + google-analytics  — GA4 + Google Ads gtag
  //   doubleclick.net                       — Google Ads remarketing pixel
  //   connect.facebook.net                  — Meta Pixel fbevents.js
  //   youtube-nocookie                      — embedded YouTube hero/DNA videos
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://www.googletagservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.youtube-nocookie.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // beacon/XHR targets:
  //   www.google-analytics.com / region1.google-analytics.com  — GA4 pageviews
  //   stats.g.doubleclick.net + www.google.com                 — Google Ads conversions
  //   www.facebook.com                                          — Meta Pixel event endpoint
  "connect-src 'self' https://api.jsonbin.io https://api.mymemory.translated.net https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://www.google.com https://www.facebook.com https://flagcdn.com https://api.imgbb.com https://api.cloudinary.com https://api.resend.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://vitals.vercel-insights.com https://vercel.live",
  "worker-src 'self' blob:",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://td.doubleclick.net https://www.googletagmanager.com",
  "media-src 'self' blob: https://res.cloudinary.com https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Baseline security headers applied to every response. These are
// browser-side defenses — they don't cost anything to serve and close
// off easy attack surface (clickjacking, MIME sniffing, leaky referers,
// opt-in browser features the site never uses).
const securityHeaders = [
  // Force HTTPS for two years and include subdomains. Safe to keep
  // permanently once a domain is HTTPS-only — Vercel's edge is HTTPS
  // by default so we never serve plain HTTP.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Lock down what the browser will load. See `csp` above for tuning.
  { key: "Content-Security-Policy", value: csp },
  // Don't let other origins iframe the site (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't let the browser guess content types from response bytes.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to third-party sites in the Referer header.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features the site doesn't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Modern guidance: disable the legacy XSS Auditor (it had bypass bugs).
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  images: {
    // Whitelist of quality values the next/image optimizer will accept.
    // Next.js 16 only honours these — anything else logs a warning and
    // falls back to 75. We use 88 for catalog packshots so product
    // photos don't get mushy on Retina, 90 for above-the-fold hero
    // backgrounds, and keep 75 in the list for the small admin
    // thumbnails that don't need detail.
    qualities: [75, 88, 90, 100],
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.vercel-storage.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "image.ibb.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
    ];
  },
};

// Wrap with Sentry. The wrapper:
//   1. Bundles the Sentry SDK into the client/server/edge runtimes
//   2. Uploads source maps to Sentry at build time (needs SENTRY_AUTH_TOKEN)
//   3. Strips sourcemap comments from the final JS so we don't leak
//      original source paths
//
// If SENTRY_AUTH_TOKEN isn't set (local builds), source-map upload is
// skipped silently and the build still succeeds.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? "bemis",
  project: process.env.SENTRY_PROJECT ?? "bemis-evcharge-website",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // We don't need Sentry's tunnel route — production isn't running an
  // ad-blocker-heavy audience and the extra route adds latency.
  tunnelRoute: undefined,
  // Don't ship debug logger to clients (smaller bundle).
  disableLogger: true,
  sourcemaps: {
    // Hide source maps from the public bundle to avoid leaking source.
    deleteSourcemapsAfterUpload: true,
  },
});
