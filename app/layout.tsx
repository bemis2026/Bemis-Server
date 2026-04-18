import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ContentProvider } from "./context/ContentContext";
import { EditModeProvider } from "./context/EditModeContext";
import PropertiesPanel from "./components/PropertiesPanel";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ContentLoadingBar from "./components/ContentLoadingBar";
import LanguageURLSync from "./components/LanguageURLSync";

const BASE_URL = "https://www.bemisevcharge.com.tr";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

async function getContentMeta(): Promise<{ ogImage: string | null; faviconUrl: string | null }> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "data/content.json" });
    const blob = blobs.find(b => b.pathname === "data/content.json");
    if (blob) {
      const res = await fetch(blob.url, { cache: "no-store" });
      const data = await res.json();
      return { ogImage: data?.ogImage || null, faviconUrl: data?.faviconUrl || null };
    }
  } catch {}
  return { ogImage: null, faviconUrl: null };
}

export async function generateMetadata(): Promise<Metadata> {
  const { ogImage, faviconUrl } = await getContentMeta();
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: "Bemis E-V Charge" }]
    : [];

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
    icons: {
      icon: faviconUrl || "/favicon.ico",
      shortcut: faviconUrl || "/favicon.ico",
      apple: faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title: "Bemis E-V Charge | Yerli EV Şarj Ekipmanı Üreticisi",
      description:
        "30+ yıllık Bemis kalitesiyle üretilen yerli EV şarj çözümleri. CE & IP65 sertifikalı ürünler, 60+ ülkeye ihracat.",
      url: BASE_URL,
      siteName: "Bemis E-V Charge",
      locale: "tr_TR",
      type: "website",
      ...(images.length > 0 && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: "Bemis E-V Charge | Yerli EV Şarj Ekipmanı",
      description: "Türkiye'nin lider EV şarj ekipmanı üreticisi — CE & IP65 sertifikalı, 60+ ülkeye ihracat.",
      ...(images.length > 0 && { images: [ogImage!] }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full antialiased bg-[#141414] text-white">
        <GoogleAnalytics />
        <ThemeProvider>
          <LanguageProvider>
            <ContentProvider>
              <EditModeProvider>
                <ContentLoadingBar />
                <Suspense fallback={null}>
                  <LanguageURLSync />
                </Suspense>
                {children}
                <PropertiesPanel />
              </EditModeProvider>
            </ContentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
