import type { Metadata } from "next";
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
import MetaPixel from "./components/MetaPixel";
import ContentLoadingBar from "./components/ContentLoadingBar";
import ContentErrorToast from "./components/ContentErrorToast";
import LanguageURLSync from "./components/LanguageURLSync";
import JsonLd from "./components/JsonLd";
import { organizationSchema, websiteSchema } from "./lib/seo";
import { getServerSiteContent } from "./lib/server-content";

const BASE_URL = "https://www.bemisevcharge.com.tr";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    description:
      "Bemis E-V Charge — Türkiye'nin lider EV şarj ekipmanı üreticisi. AC Wallbox, taşınabilir şarj cihazları, DC ve AC şarj kabloları, V2L adaptörler. CE & IP65 sertifikalı, 60+ ülkeye ihracat.",
    keywords: [
      "EV şarj istasyonu", "elektrikli araç şarj", "AC wallbox", "DC şarj kablosu",
      "Type 2 şarj kablosu", "V2L adaptör", "yerli üretim EV şarj", "Bemis",
      "Bemis Teknik Elektrik", "ev şarj cihazı", "araç şarj ekipmanı",
    ],
    authors: [{ name: "Bemis Teknik Elektrik A.Ş.", url: BASE_URL }],
    creator: "Bemis Teknik Elektrik A.Ş.",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: "/" },
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
      // Only attach the reviews block when there's enough data to
      // satisfy Google's rich result requirements (≥1 review, score
      // between 1 and 5). Empty bins fall back to a clean schema.
      ...(meta.reviews.items.length > 0 && meta.reviews.rating >= 1 && {
        reviews: meta.reviews,
      }),
    }),
    websiteSchema(),
  ];
  return (
    <html lang="tr" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full antialiased bg-[#141414] text-white">
        <JsonLd data={jsonLd} />
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <ContentProvider initialContent={initialContent}>
                <GoogleAnalytics />
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
      </body>
    </html>
  );
}
