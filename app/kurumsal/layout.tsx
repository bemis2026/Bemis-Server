import type { Metadata } from "next";

// page.tsx "use client" — self-canonical + başlık burada (bkz. b2b/layout.tsx).
export const metadata: Metadata = {
  title: "Hakkımızda & Kurumsal",
  description:
    "Bemis Teknik Elektrik A.Ş. — 1994'ten beri Bursa'da elektrik ekipmanı üretimi. Bemis E-V Charge markası, üretim altyapısı, sertifikalar ve grup şirketleri.",
  alternates: { canonical: "/kurumsal" },
};

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
