import type { Metadata } from "next";

// page.tsx "use client" — self-canonical + başlık burada (bkz. b2b/layout.tsx).
export const metadata: Metadata = {
  title: "Şarj Ağı Operatörleri için Çözümler",
  description:
    "Şarj ağı operatörleri (CPO) için Bemis E-V Charge AC/DC şarj istasyonları, OCPP uyumlu donanım ve saha altyapısı çözümleri.",
  alternates: { canonical: "/operator" },
};

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
