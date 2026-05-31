import type { Metadata } from "next";

// page.tsx "use client" — self-canonical + başlık burada (bkz. b2b/layout.tsx).
export const metadata: Metadata = {
  title: "Dökümanlar & Kataloglar",
  description:
    "Bemis E-V Charge ürün katalogları, fiyat listeleri, kurulum kılavuzları, sertifikalar ve teknik dökümanlar — indirilebilir PDF arşivi.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
