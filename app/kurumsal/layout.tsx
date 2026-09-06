import type { Metadata } from "next";
import { ogImage, OG_URL } from "../lib/seo";

// page.tsx "use client" — self-canonical + başlık burada (bkz. b2b/layout.tsx).
export const metadata: Metadata = {
  title: "Hakkımızda: 1994'ten Beri Bursa'da Yerli EV Şarj Üretimi",
  description:
    "1994'ten beri Bursa'da üretim: 11.000 m² tesis, 60+ ülkeye ihracat, %94 yerli malı belgeli EV şarj cihazları. Bemis E-V Charge'ın üretim altyapısı, sertifikaları ve grup şirketleri.",
  alternates: { canonical: "/kurumsal", languages: { tr: "/kurumsal", "x-default": "/kurumsal" } },
  openGraph: {
    title: "Hakkımızda: 1994'ten Beri Bursa'da Yerli EV Şarj Üretimi",
    description:
      "1994'ten beri Bursa'da üretim: 11.000 m² tesis, 60+ ülkeye ihracat, %94 yerli malı belgeli EV şarj cihazları. Bemis E-V Charge'ın üretim altyapısı, sertifikaları ve grup şirketleri.",
    type: "website",
    url: "/kurumsal",
    images: ogImage("Bemis Teknik Elektrik A.Ş. — Bemis E-V Charge kurumsal"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda: 1994'ten Beri Bursa'da Yerli EV Şarj Üretimi",
    description:
      "1994'ten beri Bursa'da üretim: 11.000 m² tesis, 60+ ülkeye ihracat, %94 yerli malı belgeli EV şarj cihazları. Bemis E-V Charge'ın üretim altyapısı, sertifikaları ve grup şirketleri.",
    images: [OG_URL],
  },
};

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
