import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { faqSchema, breadcrumbSchema, ogImage, OG_URL } from "../lib/seo";
import { VEHICLE_FAQ } from "../lib/vehicleCharging";
import VehicleChargingClient from "../components/VehicleChargingClient";

// 📌 NEDEN BU SAYFA (2026-08-03): V2L ailesi 28 günde 88 organik oturum
// getirirken /products/wallbox 5, /products/cables 4 getiriyordu. Ölçüldü:
// V2L sayfasında 6 ARAÇ MARKASI geçiyor, wallbox'ta 2, kablolarda 1,
// taşınabilirde 0. "Togg'a hangi şarj kablosu" diye arayan kullanıcı için
// sitede eşleşecek metin yoktu. Bu sayfa V2L'yi kazandıran deseni kopyalar:
// araç adı + o araca özgü, doğrulanmış cevap.
// ⚠️ Araç verisi app/lib/vehicleCharging.ts'te ve DIŞ KAYNAKTAN doğrulandı —
// yeni model eklerken uydurma spec yazma, kaynağı kaydet.

const SLUG = "arac-sarj-uyumlulugu";
const TITLE = "Hangi Araca Hangi Şarj Cihazı Uygun?";
const DESC =
  "Togg, IONIQ 5, Tesla, BYD, MG ve Renault için AC şarj uyumluluğu: soket tipi, aracın dahili şarj gücü ve tesisatınıza göre hangi cihaz ve kablo uygun.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `/${SLUG}`, languages: { tr: `/${SLUG}`, "x-default": `/${SLUG}` } },
  keywords: [
    "hangi araca hangi şarj cihazı",
    "elektrikli araba şarj kablosu uyumluluğu",
    "togg şarj cihazı",
    "togg şarj kablosu",
    "ioniq 5 şarj cihazı",
    "tesla model y şarj kablosu",
    "type 2 uyumlu araçlar",
    "aracımın dahili şarj gücü",
  ],
  openGraph: {
    title: `${TITLE} — Bemis E-V Charge`,
    description: DESC,
    type: "article",
    url: `/${SLUG}`,
    images: ogImage("Hangi Araca Hangi Şarj Cihazı — Bemis E-V Charge"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_URL] },
};

export default function AracSarjUyumlulukPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Araç Şarj Uyumluluğu", url: `/${SLUG}` },
    ]),
    // ⚠️ FAQPage metni sayfada GÖRÜNÜR olanla birebir aynı (Google kuralı) —
    // ikisi de app/lib/vehicleCharging.ts'teki tek kaynaktan gelir.
    faqSchema(VEHICLE_FAQ),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <VehicleChargingClient />
    </>
  );
}
