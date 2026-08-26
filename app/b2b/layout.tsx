import type { Metadata } from "next";

// page.tsx "use client" olduğu için metadata'yı buradan veriyoruz —
// aksi halde root layout'un '/' canonical'ını miras alıp kendini ana
// sayfanın kopyası olarak işaretliyordu.
export const metadata: Metadata = {
  // OEM/beyaz-etiket kelimeleri başlık+açıklamada öne çıkarıldı — bu sayfa
  // "ev şarj cihazı OEM üretici / beyaz etiket / özel üretim" aramalarını hedefler
  // (yerli üretim + ihracat + sertifika güven sinyalleriyle).
  title: "OEM & Beyaz Etiket EV Şarj Cihazı Üretimi",
  description:
    "Kendi markanızla (beyaz etiket) EV şarj cihazı üretimi: AC Wallbox, taşınabilir şarj, Type 2 kablo, V2L adaptör. Bursa'da üretim, 60+ ülkeye ihracat, CE/IP65.",
  keywords: [
    "ev şarj cihazı oem üretici", "oem şarj cihazı üretimi", "beyaz etiket wallbox",
    "white label ev şarj cihazı", "kendi markanızla şarj cihazı", "özel üretim şarj cihazı",
    "ev şarj cihazı tedarikçisi", "wallbox oem üretici türkiye",
  ],
  alternates: { canonical: "/b2b" },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return children;
}
