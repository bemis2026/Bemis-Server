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

type ContentSnapshot = {
  ogImage: string | null;
  faviconUrl: string | null;
  logoDark: string | null;
  logoLight: string | null;
  phone: string | null;
  email: string | null;
  addressStreet: string | null;
  addressLocality: string | null;
  social: { linkedin: string; instagram: string; twitter: string; youtube: string };
};

async function getContentMeta(): Promise<ContentSnapshot> {
  try {
    const { readBin } = await import("../lib/jsonbin");
    const data = await readBin("content") as Record<string, unknown>;
    const logos = (data?.logos ?? {}) as { dark?: string; light?: string };
    const contact = (data?.contact ?? {}) as { phone?: string; email?: string; address?: string; addressSub?: string };
    const social = (data?.social ?? {}) as { linkedin?: string; instagram?: string; twitter?: string; youtube?: string };
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
      },
    };
  } catch {}
  return {
    ogImage: null, faviconUrl: null,
    logoDark: null, logoLight: null,
    phone: null, email: null,
    addressStreet: null, addressLocality: null,
    social: { linkedin: "", instagram: "", twitter: "", youtube: "" },
  };
}

export async function generateMetadata(): Promise<Metadata> {
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
    // Dual favicons: black-on-white is the default (what Google's favicon
    // crawler uses, and what shows in light-mode browser tabs / address
    // bars). The white-on-transparent variant kicks in via the
    // (prefers-color-scheme: dark) media query so dark-mode Chrome tabs
    // keep showing the original mark instead of a black square on a dark
    // strip. apple-touch-icon stays opaque because iOS fills any
    // transparent area with the home-screen wallpaper.
    icons: {
      icon: [
        { url: "/favicon-black-64.png", sizes: "64x64", type: "image/png" },
        { url: "/favicon-black-192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon-black-512.png", sizes: "512x512", type: "image/png" },
        { url: "/favicon-white-64.png", sizes: "64x64", type: "image/png", media: "(prefers-color-scheme: dark)" },
        { url: "/favicon-white-192.png", sizes: "192x192", type: "image/png", media: "(prefers-color-scheme: dark)" },
        { url: "/favicon-white-512.png", sizes: "512x512", type: "image/png", media: "(prefers-color-scheme: dark)" },
      ],
      shortcut: "/favicon-black-192.png",
      apple: { url: "/favicon-black-512.png", sizes: "180x180" },
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
  const sameAs = [meta.social.linkedin, meta.social.instagram, meta.social.twitter].filter(Boolean);
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
    }),
    websiteSchema(),
  ];
  return (
    <html lang="tr" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full antialiased bg-[#141414] text-white">
        <JsonLd data={jsonLd} />
        <GoogleAnalytics />
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <ContentProvider initialContent={initialContent}>
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
