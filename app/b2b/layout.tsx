import type { Metadata } from "next";

// page.tsx "use client" olduğu için metadata'yı buradan veriyoruz —
// aksi halde root layout'un '/' canonical'ını miras alıp kendini ana
// sayfanın kopyası olarak işaretliyordu.
export const metadata: Metadata = {
  title: "Kurumsal & OEM Çözümler",
  description:
    "Bemis E-V Charge kurumsal, OEM ve şarj operatörü çözümleri — özel üretim, beyaz etiket EV şarj ekipmanları ve filo altyapısı.",
  alternates: { canonical: "/b2b" },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return children;
}
