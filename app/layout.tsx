import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { ContentProvider } from "./context/ContentContext";
import { EditModeProvider } from "./context/EditModeContext";
import PropertiesPanel from "./components/PropertiesPanel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bemisevcharge.com"),
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
  authors: [{ name: "Bemis Teknik Elektrik A.Ş.", url: "https://www.bemisevcharge.com" }],
  creator: "Bemis Teknik Elektrik A.Ş.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bemis E-V Charge | Yerli EV Şarj Ekipmanı Üreticisi",
    description:
      "30+ yıllık Bemis kalitesiyle üretilen yerli EV şarj çözümleri. CE & IP65 sertifikalı ürünler, 60+ ülkeye ihracat.",
    url: "https://www.bemisevcharge.com",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full antialiased bg-[#0A0A0A] text-white">
        <ThemeProvider>
          <ContentProvider>
            <EditModeProvider>
              {children}
              <PropertiesPanel />
            </EditModeProvider>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
