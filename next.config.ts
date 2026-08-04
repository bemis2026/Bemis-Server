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
  // ⚡ GÜVENLİK (2026-07-12): 'unsafe-eval' YALNIZ dev'de (webpack HMR eval ister).
  // Üretimde Next/framer/gtag/Sentry eval KULLANMAZ → kaldırmak Mozilla Observatory
  // B+ → A adayı. Yerel prod (next start) ile doğrulandı. 'unsafe-inline' KALIYOR
  // (Next inline runtime + GA consent stub + speculation rules bunu ister; nonce
  // refaktörü ayrı/riskli iş).
  // youtube.com: GA4'ün gelişmiş video ölçümü, gömülü videoları izlemek için
  // youtube.com/iframe_api yükler — yalnız nocookie izinliyken her videolu
  // sayfada CSP konsol hatası basıyordu (2026-07-18, Playwright'ta yakalandı).
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://www.googletagservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.youtube-nocookie.com https://www.youtube.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // beacon/XHR targets:
  //   www.google-analytics.com / region1.google-analytics.com  — GA4 pageviews
  //   stats.g.doubleclick.net + www.google.com                 — Google Ads conversions
  //   www.facebook.com                                          — Meta Pixel event endpoint
  // res.cloudinary.com + *.r2.dev are our document (PDF) asset hosts — the
  // /documents viewer fetches them as a blob for a clean download.
  // analytics.google.com + *.google-analytics.com: GA4 collect beacon'ları (consent
  // mode bölge yönlendirmesiyle) bu uçlara da gider — yalnız www+region1 izinliyken
  // gerçek ölçüm istekleri CSP'ye takılıyordu = VERİ KAYBI (2026-07-18, Playwright).
  "connect-src 'self' https://api.jsonbin.io https://api.mymemory.translated.net https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://www.google.com https://www.facebook.com https://flagcdn.com https://api.imgbb.com https://api.cloudinary.com https://res.cloudinary.com https://api.resend.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://vitals.vercel-insights.com https://vercel.live https://*.r2.cloudflarestorage.com https://*.r2.dev",
  "worker-src 'self' blob:",
  // res.cloudinary.com + *.r2.dev are where document PDFs live — the
  // /documents/[id] viewer embeds them in an <iframe> for inline preview.
  // Without these the PDF frame is blank (CSP blocks the load).
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://td.doubleclick.net https://www.googletagmanager.com https://res.cloudinary.com https://*.r2.dev",
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
  // react-icons (onlarca named import) + framer-motion barrel'larını per-export
  // chunk'a böler → her dinamik section chunk'ına giren ikon/motion JS azalır.
  // Görünüm/davranış değişmez; sadece daha az client JS.
  experimental: {
    optimizePackageImports: ["react-icons", "react-icons/ri", "react-icons/hi", "react-icons/hi2", "framer-motion"],
  },

  // 🔴 REACT COMPILER KAPALI — 2026-07-29'da açıldı, 2026-07-31'de KAPATILDI.
  //
  // NEDEN: derleyici bileşen çıktısını izlediği props/state'e göre memoize eder.
  // Bu sitede ÜÇ ayrı i18n sistemi sözlüğünü MODÜL SEVİYESİNDE mutable bir
  // değişkende tutuyor ve tembel yükledikten sonra bir "tick" ile yeniden render
  // tetikliyor:
  //     · app/lib/blogI18n.ts    (BLOG_I18N   — bu oturumdan ÖNCE vardı)
  //     · app/lib/glossaryI18n.ts(GLOSSARY_I18N)
  //     · app/lib/ui.ts          (UI — bu yüzden statiğe geri alındı)
  // Derleyici bu modül değişkenini BİR GİRDİ OLARAK GÖRMEZ → sözlük indikten
  // sonra bile yeniden render, önbelleğe alınmış (sözlük boşken hesaplanmış)
  // çıktıyı servis ediyordu.
  //
  // ÖLÇÜLEN ETKİ (Rusça, yerel üretim derlemesi): blog yazısı TR gövdeyle,
  // /sozluk terimi TR tanımla, arayüz dizeleri İngilizce görünüyordu.
  // Yani kazanç spekülatif bir memoization iken bedeli 5 dilde bozuk içerikti.
  //
  // 📌 TEKRAR AÇILACAKSA ÖNCE bu üç sözlüğü modül değişkeninden çıkarıp React
  // state'ine (context) taşı — o zaman derleyici için gerçek bir girdi olurlar.
  // reactCompiler: true,
  images: {
    // next/image optimizer'ın KABUL ETTİĞİ quality değerleri.
    // ⚠️ Listede OLMAYAN değer istenirse optimizer HTTP 400 döner; render anında
    //    Next en yakın izinli değere yuvarlar (canlıda doğrulandı: quality={92}
    //    → q=90 servis edildi — eski yorumdaki "75'e düşer" bilgisi YANLIŞTI).
    // ⚠️ KURAL (kullanıcı): adminden/kullanıcıdan yüklenen görsellerin kalitesi
    //    ASLA düşürülmez. Bu yüzden <Image>'a quality VERMEYİ UNUTMA — prop yoksa
    //    Next varsayılanı 75'tir ve fotoğraf gözle görülür yumuşar.
    // Kademeler: 95 hero/tam-ekran · 90 kullanıcı fotoğrafı (ürün galerisi,
    // fabrika, harita, logo) · 88 katalog packshot · 75 yalnız admin küçük önizleme.
    qualities: [75, 88, 90, 95],
    // AVIF, AYNI quality'de WebP'den ~%20-30 küçük dosya verir (görsel olarak
    // fark yok — zaten lossy WebP servis ediliyordu). Eski tarayıcılar otomatik
    // WebP'ye düşer. Piksel/kalite kaybı yok; sadece daha verimli kodlama.
    formats: ["image/avif", "image/webp"],
    // Optimize edilen görseller edge cache'inde 30 gün kalır → her istekte
    // yeniden transcode/transfer olmaz.
    minimumCacheTTL: 2592000,
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
  async redirects() {
    return [
      // Google, eski/gömülü içerik referanslarından (productShowcase'in
      // render edilmeyen ctaSecondaryHref'i) /contact URL'ini keşfetmiş; ama
      // gerçek iletişim sayfası /iletisim → Search Console "bulunamadı (404)"
      // hatası veriyordu. Kalıcı (308) yönlendirme ile /contact geçerli sayfaya
      // çözülür; hata kapanır, gelecekteki her /contact referansı da çalışır.
      { source: "/contact", destination: "/iletisim", permanent: true },

      // BEVDC 120 sitede İKİ ayrı kayıttı: `bevdc-120-1` ve `bevdc-120-2` —
      // aynı kod (BEVDCC-4421-0005), aynı fiyat, aynı görsel, iki farklı URL.
      // Google için "aynı içerik iki adreste" (otoriteyi böler), katalog
      // beslemesinde de aynı ürün iki kez görünüyordu. Fazla kayıt silindi;
      // eski URL'e birikmiş değer ve dış linkler kırılmasın diye 308 ile
      // doğrusuna bağlandı. ⚠️ Ürün verisinden silmek TEK BAŞINA yetmez —
      // yönlendirme olmadan o adres 404 verirdi.
      { source: "/products/dc-units/bevdc-120-2", destination: "/products/dc-units/bevdc-120-1", permanent: true },

      // Fiyat listesi 2026 → 2026-2 ile değiştirildi (eski kayıt kaldırıldı).
      // Eski doküman sayfası indekslenmiş olabilir; 404 vermesin diye yenisine bağlandı.
      { source: "/documents/doc-1779265324270", destination: "/documents/doc-fiyat-listesi-2026-2", permanent: true },
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
// Bundle röntgeni: ANALYZE=true npm run build → .next/analyze/*.html raporları.
// Normal build'lerde tamamen devre dışı (sıfır etki).
import withBundleAnalyzer from "@next/bundle-analyzer";
const withAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true", openAnalyzer: false });

export default withAnalyzer(withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? "bemis",
  project: process.env.SENTRY_PROJECT ?? "bemis-evcharge-website",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // We don't need Sentry's tunnel route — production isn't running an
  // ad-blocker-heavy audience and the extra route adds latency.
  tunnelRoute: undefined,
  // Don't ship debug logger to clients (smaller bundle).
  disableLogger: true,
  // Pazarlama sitesi — Session Replay/ekstra Replay entegrasyonları
  // KULLANILMIYOR; client bundle'dan çıkar (hata yakalama korunur).
  bundleSizeOptimizations: {
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
    excludeDebugStatements: true,
  },
  sourcemaps: {
    // Hide source maps from the public bundle to avoid leaking source.
    deleteSourcemapsAfterUpload: true,
  },
}));
