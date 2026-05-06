import type { NextConfig } from "next";

// Baseline security headers applied to every response. These are
// browser-side defenses — they don't cost anything to serve and close
// off easy attack surface (clickjacking, MIME sniffing, leaky referers,
// opt-in browser features the site never uses).
const securityHeaders = [
  // Force HTTPS for two years and include subdomains. Safe to keep
  // permanently once a domain is HTTPS-only — Vercel's edge is HTTPS
  // by default so we never serve plain HTTP.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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

export default nextConfig;
