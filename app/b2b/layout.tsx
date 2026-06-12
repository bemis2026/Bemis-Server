import type { Metadata } from "next";

// page.tsx "use client" olduğu için metadata'yı buradan veriyoruz —
// aksi halde root layout'un '/' canonical'ını miras alıp kendini ana
// sayfanın kopyası olarak işaretliyordu.
export const metadata: Metadata = {
  // OEM/fason/beyaz-etiket kelimeleri başlık+açıklamada öne çıkarıldı — bu sayfa
  // "ev şarj cihazı OEM üretici / fason üretim / beyaz etiket" aramalarını hedefler
  // (yerli üretim + ihracat + sertifika güven sinyalleriyle).
  title: "OEM & Fason EV Şarj Cihazı Üretimi (Beyaz Etiket)",
  description:
    "Kendi markanızla (beyaz etiket) EV şarj cihazı üretimi — OEM, fason ve özel etiket. AC Wallbox, taşınabilir şarj, Type 2 kablo, V2L/C2L adaptör. Bursa'da yerli üretim, 60+ ülke ihracat, CE/IP65. Kurumsal & şarj operatörü çözümleri.",
  keywords: [
    "ev şarj cihazı oem üretici", "fason ev şarj cihazı üretimi", "beyaz etiket wallbox",
    "white label ev şarj cihazı", "kendi markanızla şarj cihazı", "oem şarj cihazı üretimi",
    "ev şarj cihazı tedarikçisi", "wallbox oem üretici türkiye",
  ],
  alternates: { canonical: "/b2b" },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return children;
}
