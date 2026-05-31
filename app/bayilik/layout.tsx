import type { Metadata } from "next";

// page.tsx "use client" — self-canonical + başlık burada (bkz. b2b/layout.tsx).
export const metadata: Metadata = {
  title: "Bayilik Başvurusu",
  description:
    "Bemis E-V Charge yetkili bayilik ve distribütörlük başvurusu — Türkiye geneli ve yurt dışı iş ortaklığı fırsatları.",
  alternates: { canonical: "/bayilik" },
};

export default function BayilikLayout({ children }: { children: React.ReactNode }) {
  return children;
}
