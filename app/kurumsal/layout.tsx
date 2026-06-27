import type { Metadata } from "next";
import { ogImage, OG_URL } from "../lib/seo";

// page.tsx "use client" — self-canonical + başlık burada (bkz. b2b/layout.tsx).
export const metadata: Metadata = {
  title: "Hakkımızda & Kurumsal",
  description:
    "Bemis Teknik Elektrik A.Ş. — 1994'ten beri Bursa'da elektrik ekipmanı üretimi. Bemis E-V Charge markası, üretim altyapısı, sertifikalar ve grup şirketleri.",
  alternates: { canonical: "/kurumsal", languages: { tr: "/kurumsal", "x-default": "/kurumsal" } },
  openGraph: {
    title: "Hakkımızda & Kurumsal",
    description:
      "Bemis Teknik Elektrik A.Ş. — 1994'ten beri Bursa'da elektrik ekipmanı üretimi. Bemis E-V Charge markası, üretim altyapısı, sertifikalar ve grup şirketleri.",
    type: "website",
    url: "/kurumsal",
    images: ogImage("Bemis Teknik Elektrik A.Ş. — Bemis E-V Charge kurumsal"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda & Kurumsal",
    description:
      "Bemis Teknik Elektrik A.Ş. — 1994'ten beri Bursa'da elektrik ekipmanı üretimi. Bemis E-V Charge markası, üretim altyapısı, sertifikalar ve grup şirketleri.",
    images: [OG_URL],
  },
};

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
