import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ContactOverlayProvider } from "./context/ContactOverlayContext";
import ContactOverlay from "./components/ContactOverlay";
import { DealerApplyOverlayProvider } from "./context/DealerApplyOverlayContext";
import DealerApplyOverlay from "./components/DealerApplyOverlay";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ContentProvider } from "./context/ContentContext";
import { EditModeProvider } from "./context/EditModeContext";
import PropertiesPanelLoader from "./components/PropertiesPanelLoader";
import CookieConsent from "./components/CookieConsent";
import GoogleAnalytics from "./components/GoogleAnalytics";
import WebVitals from "./components/WebVitals";
import MetaPixel from "./components/MetaPixel";
import ContentLoadingBar from "./components/ContentLoadingBar";
import ContentErrorToast from "./components/ContentErrorToast";
import LanguageURLSync from "./components/LanguageURLSync";
import JsonLd from "./components/JsonLd";
import NoAppInstall from "./components/NoAppInstall";
import { organizationSchema, websiteSchema } from "./lib/seo";
import { getServerSiteContent } from "./lib/server-content";

// Mobil tarayıcı çubuğu rengi — renk şemasına göre sayfa zeminiyle uyumlu (theme-color).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
};

const BASE_URL = "https://www.bemisevcharge.com.tr";

// ⚠️ latin-ext ZORUNLU: Türkçe'nin ğ (U+011F), ı (U+0131), ş (U+015F), İ (U+0130)
// harfleri temel "latin" alt kümesinde DEĞİL, latin-ext'te. Yalnız "latin" verilince
// o 83 KB'lık dosya ön-yüklenmiyordu; tarayıcı ancak metni dizerken ihtiyacı fark edip
// geç indiriyor → "Şarj / Çözüm / İstasyonu" gibi kelimeler önce yedek fontla çizilip
// sonra yerine oturuyordu (LCP başlığımız da Türkçe harf içerir).
// EK BAYT MALİYETİ YOK: dosya zaten iniyordu, artık erken başlıyor. (2026-07-29)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

type ReviewSnapshotItem = {
  author: string; rating: number; text: string;
  date?: string; platform?: string; product?: string;
};
type ContentSnapshot = {
  ogImage: string | null;
  faviconUrl: string | null;
  logoDark: string | null;
  logoLight: string | null;
  phone: string | null;
  email: string | null;
  addressStreet: string | null;
  addressLocality: string | null;
  social: { linkedin: string; instagram: string; twitter: string; youtube: string; facebook: string };
  reviews: {
    rating: number;
    ratingCount: number;
    items: ReviewSnapshotItem[];
  };
  verification: { google: string; yandex: string; bing: string };
};

async function getContentMeta(): Promise<ContentSnapshot> {
  try {
    const { readBin } = await import("../lib/jsonbin");
    const data = await readBin("content") as Record<string, unknown>;
    const logos = (data?.logos ?? {}) as { dark?: string; light?: string };
    const contact = (data?.contact ?? {}) as { phone?: string; email?: string; address?: string; addressSub?: string };
    const social = (data?.social ?? {}) as { linkedin?: string; instagram?: string; twitter?: string; youtube?: string; facebook?: string };
    const verifyRaw = (data?.siteVerification ?? {}) as { google?: string; yandex?: string; bing?: string };
    const verification = {
      google: (verifyRaw.google || "").trim(),
      yandex: (verifyRaw.yandex || "").trim(),
      bing:   (verifyRaw.bing   || "").trim(),
    };
    const reviewsRaw = (data?.reviews ?? {}) as {
      rating?: number | string;
      ratingCount?: number | string;
      items?: { author?: string; rating?: number; text?: string; date?: string; platform?: string; product?: string }[];
    };
    const reviews = {
      rating: typeof reviewsRaw.rating === "number"
        ? reviewsRaw.rating
        : parseFloat(String(reviewsRaw.rating ?? "0").replace(",", ".")) || 0,
      ratingCount: typeof reviewsRaw.ratingCount === "number"
        ? reviewsRaw.ratingCount
        : parseInt(String(reviewsRaw.ratingCount ?? "0").replace(/\D/g, ""), 10) || 0,
      items: (reviewsRaw.items ?? [])
        .filter((r) => r?.author && r?.text && (r.rating ?? 0) > 0)
        .map((r) => ({
          author: r.author!,
          rating: r.rating!,
          text: r.text!,
          date: r.date,
          platform: r.platform,
          product: r.product,
        })),
    };
    return {
      ogImage: (data?.ogImage as string) || null,
      faviconUrl: (data?.faviconUrl as string) || null,
      logoDark: logos.dark || null,
      logoLight: logos.light || null,
      phone: contact.phone || null,
      email: contact.email || null,
      addressStreet: contact.address || null,
      addressLocality: contact.addressSub || null,
      social: {
        linkedin: social.linkedin || "",
        instagram: social.instagram || "",
        twitter: social.twitter || "",
        youtube: social.youtube || "",
        facebook: social.facebook || "",
      },
      reviews,
      verification,
    };
  } catch {}
  return {
    ogImage: null, faviconUrl: null,
    logoDark: null, logoLight: null,
    phone: null, email: null,
    addressStreet: null, addressLocality: null,
    social: { linkedin: "", instagram: "", twitter: "", youtube: "", facebook: "" },
    reviews: { rating: 0, ratingCount: 0, items: [] },
    verification: { google: "", yandex: "", bing: "" },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  // Pull the snapshot once at build/revalidate time so we can render
  // site-verification meta tags inline (Google / Yandex / Bing each
  // require their own canonical name= header).
  const verifyMeta = await getContentMeta();
  const verifyOther: Record<string, string> = {};
  if (verifyMeta.verification.bing) verifyOther["msvalidate.01"] = verifyMeta.verification.bing;
  // Note: og:image / twitter:image meta tags are produced automatically
  // by app/opengraph-image.tsx — we deliberately don't set them here so
  // the dynamic generator stays the single source of truth (avoids
  // platforms picking the wrong URL when both are present).
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: "Bemis E-V Charge | Yerli EV Şarj Ekipmanı Üreticisi",
      template: "%s | Bemis E-V Charge",
    },
    // ~158 karakter, hedef: "yerli EV şarj üreticisi" + "AC/DC şarj istasyonu".
    description:
      "Bemis E-V Charge — yerli EV şarj üreticisi. AC/DC şarj istasyonu, Type 2 Wallbox, taşınabilir şarj cihazı ve kablolar. CE & IP65, 60+ ülkeye ihracat.",
    keywords: [
      "EV şarj istasyonu", "elektrikli araç şarj", "AC wallbox", "DC şarj kablosu",
      "Type 2 şarj kablosu", "V2L adaptör", "yerli üretim EV şarj", "Bemis",
      "Bemis Teknik Elektrik", "ev şarj cihazı", "araç şarj ekipmanı",
    ],
    authors: [{ name: "Bemis Teknik Elektrik A.Ş.", url: BASE_URL }],
    creator: "Bemis Teknik Elektrik A.Ş.",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    // NOT: web app manifest KALDIRILDI — kullanıcı "uygulamada aç / yükle" istemini
    // istemiyor. Manifest olmadan tarayıcı PWA install/app affordance sunamaz.
    // theme-color ayrı (viewport.themeColor) → korunur; site %100 normal web sitesi.
    alternates: {
      canonical: "/",
      // hreflang: TR=/ , x-default=TR. ⚠️ SAHTE "en"=/?lang=en KALDIRILDI — aynı TR
      // HTML'i dönüyordu (gerçek ayrı EN URL değil), Google'a yanlış sinyaldi. Gerçek
      // EN sayfa yalnız /export (kendi en/x-default alternatifi orada). Yeni gerçek EN
      // URL eklenmedikçe homepage'e "en" KOYMA.
      languages: {
        tr: "/",
        "x-default": "/",
      },
    },
    // Marka yönü: beyaz B logo her yerde görünmeli. Tek sıkıntı
    // light-mode tab/adres çubuğunda (beyaz arka plan) — şeffaf beyaz
    // logo kaybolur. Onun için light-mode için "siyah kare içinde
    // beyaz B" varyantı (favicon-on-black-*), dark-mode için şeffaf
    // beyaz B (favicon-white-*). iOS apple-touch-icon her zaman opaque
    // gerektirdiği için on-black versiyonunu kullanır.
    icons: {
      icon: [
        { url: "/favicon-on-black-64.png",  sizes: "64x64",   type: "image/png" },
        { url: "/favicon-on-black-192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon-on-black-512.png", sizes: "512x512", type: "image/png" },
        { url: "/favicon-white-64.png",  sizes: "64x64",   type: "image/png", media: "(prefers-color-scheme: dark)" },
        { url: "/favicon-white-192.png", sizes: "192x192", type: "image/png", media: "(prefers-color-scheme: dark)" },
        { url: "/favicon-white-512.png", sizes: "512x512", type: "image/png", media: "(prefers-color-scheme: dark)" },
      ],
      shortcut: "/favicon-on-black-192.png",
      apple: { url: "/favicon-on-black-512.png", sizes: "180x180" },
    },
    openGraph: {
      title: "Bemis E-V Charge | Yerli EV Şarj Ekipmanı Üreticisi",
      description:
        "30+ yıllık Bemis kalitesiyle üretilen yerli EV şarj çözümleri. CE & IP65 sertifikalı ürünler, 60+ ülkeye ihracat.",
      url: BASE_URL,
      siteName: "Bemis E-V Charge",
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bemis E-V Charge | Yerli EV Şarj Ekipmanı",
      description: "Türkiye'nin lider EV şarj ekipmanı üreticisi — CE & IP65 sertifikalı, 60+ ülkeye ihracat.",
    },
    verification: {
      ...(verifyMeta.verification.google && { google: verifyMeta.verification.google }),
      ...(verifyMeta.verification.yandex && { yandex: verifyMeta.verification.yandex }),
      ...(Object.keys(verifyOther).length > 0 && { other: verifyOther }),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [meta, initialContent] = await Promise.all([
    getContentMeta(),
    getServerSiteContent(),
  ]);
  // ⚠️⚠️ BURAYA SAYFAYA-ÖZEL ŞEMA KOYMA — kök yerleşim HER sayfada basılır.
  // 2026-08-01: Search Console "brand alanı yineleniyor" KRİTİK uyarısı verdi.
  // Sebep: öne çıkan 4 ürünün TAM Product+Offer şeması ve 8 kategori ItemList'i
  // burada üretiliyordu → ürün DETAY sayfası kendi Product'ını da eklediğinde
  // sayfada 5 Product / 5 brand oluyordu ve Google "bu sayfanın ürünü hangisi"
  // sorusunu çözemiyordu. İkisi de anasayfaya (app/page.tsx) taşındı; orada
  // sayfanın kendi ürünü olmadığı için çakışma doğmaz.
  // 📌 KURAL: kök yerleşim yalnız SİTE GENELİ kimlik şeması taşır
  // (Organization + WebSite). Product/ItemList/FAQ/Breadcrumb = ilgili sayfada.
  const orgLogo = meta.logoDark || meta.logoLight || `${BASE_URL}/logo.png`;
  const sameAs = [meta.social.linkedin, meta.social.instagram, meta.social.twitter, meta.social.youtube, meta.social.facebook].filter(Boolean);
  const jsonLd = [
    organizationSchema({
      logo: orgLogo,
      sameAs,
      phone: meta.phone ?? undefined,
      email: meta.email ?? undefined,
      address: {
        street: meta.addressStreet ?? undefined,
        locality: meta.addressLocality ?? undefined,
        region: "Bursa",
        country: "TR",
      },
      // NOT: Marka-geneli yorumlar (4.9/500+) Organization'a BASILMAZ — Google
      // bunu "self-serving" sayar (yıldız vermez + manuel-aksiyon riski). Gerçek
      // ürün yorumları ürün DETAY sayfalarında Product şemasına bağlanır
      // (bkz. reviewsForProduct + productSchema). Ana sayfada görünür kalır.
    }),
    websiteSchema(),
  ];
  // ⚠️ `scroll-smooth` sınıfı KALDIRILDI (2026-07-25): Next App Router sayfa
  // geçişinde en üste kaydırırken CSS smooth devredeydi → yeni sayfa ÖNCEKİ
  // scroll konumunda (altta) açılıp yukarı doğru kayıyordu ("Tüm Ürünler"e
  // basınca görülen davranış). globals.css'te aynı kural daha önce bu sebeple
  // kaldırılmıştı ama buradaki sınıf kalmıştı — asıl uygulayan buydu.
  // ⓘ Sayfa içi yumuşak kaydırmalar ETKİLENMEZ: navbar/hero/footer/arama
  // hepsi JS ile `behavior:"smooth"` veriyor.
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-full antialiased bg-[#141414] text-white">
        {/* Üçüncü-taraf bağlantıyı erken aç (DNS + TLS el sıkışması) — GA/GTM ve
            Meta Pixel afterInteractive yüklenirken ilk byte daha hızlı gelir.
            (next/font zaten fonts.gstatic preconnect'i ekliyor; Next bu link'leri
            <head>'e taşır.) */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        {/* res.cloudinary.com hero + ürün görsellerini barındırıyor — LCP/ilk boya için preconnect. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <JsonLd data={jsonLd} />
        {/* "Uygulama olarak yükle" istemini aktif engelle + eski SW temizliği */}
        <NoAppInstall />
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <ContentProvider initialContent={initialContent}>
                <GoogleAnalytics />
                {/* Gerçek ziyaretçi Core Web Vitals → GA4 (CrUX boşken saha verisi) */}
                <WebVitals />
                <MetaPixel />
                <ContactOverlayProvider>
                  <DealerApplyOverlayProvider>
                    <EditModeProvider>
                      <ContentLoadingBar />
                      <ContentErrorToast />
                      <Suspense fallback={null}>
                        <LanguageURLSync />
                      </Suspense>
                      {children}
                      <ContactOverlay />
                      <DealerApplyOverlay />
                      <CookieConsent />
                      <PropertiesPanelLoader />
                    </EditModeProvider>
                  </DealerApplyOverlayProvider>
                </ContactOverlayProvider>
              </ContentProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
        {/* Vercel-owned trackers — Speed Insights samples Core Web
            Vitals (LCP, CLS, INP, FCP, TTFB) and Analytics counts
            pageviews + referrers. Both ship a tiny script that beacons
            to vercel-insights.com; they're free on Vercel's Hobby tier
            with monthly limits, and silently no-op when the deploy
            isn't on Vercel infra (so local dev stays clean). */}
        <SpeedInsights />
        <Analytics />
        {/* ⚡ Speculation Rules — linke hover edilince hedef sayfa ÖNDEN ÇEKİLİR,
            tıklamada geçiş hızlanır. Diğer tarayıcılar bu script tipini yok sayar.
            ⚠️⚠️ 2026-07-29: BURASI `prerender` İDİ VE PAHALIYDI. prerender, hedef
            sayfayı gizli bir işleyicide GERÇEKTEN ÇALIŞTIRIR (JS indirilir + React
            uygulaması baştan kurulur). Bu sitede paketin açılmış hâli ~2 MB olduğu
            için, üst menüde gezerken art arda tam sayfa açılışı tetikleniyordu —
            yani ziyaretçinin CPU'su hover ettiği HER linkte yeni bir React uygulaması
            kaldırıyordu ("menüde gezerken kasma" şikayetinin ikinci sebebi; birincisi
            optimize edilmemiş thumbnail'lardı, o ayrıca düzeltildi).
            `prefetch` yalnız BELGEYİ önden çeker, JS ÇALIŞTIRMAZ → hover'daki CPU
            yükü kalkar, tıklama sonrası hız büyük ölçüde korunur.
            📌 prerender'a geri dönme; dönülecekse tüm site değil, yalnız birkaç
            yüksek-niyetli rota için ve "conservative" (pointerdown) ile yapılmalı. */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prefetch: [
                {
                  where: {
                    and: [
                      { href_matches: "/*" },
                      { not: { href_matches: "/admin*" } },
                      { not: { href_matches: "/api/*" } },
                    ],
                  },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
