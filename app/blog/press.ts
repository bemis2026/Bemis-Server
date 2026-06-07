// Harici basın / haber / fuar paylaşımları — Bemis E-V Charge ile ilgili
// GERÇEK, doğrulanmış dış kaynaklar. Hem /blog "Haberler & Fuarlar" bölümünde
// hem de anasayfa blog şeridinde kullanılır.
//
// ⚠️ KURAL: Buraya yalnızca GERÇEK, erişilebilir haber/fuar linkleri ekleyin.
// Uydurma başlık/URL EKLEMEYİN — her kayıt doğrulanmış olmalı.
//
// İstemci + sunucu ortak import eder; bu yüzden burada İSTEMCİ kodu olmamalı.

export type PressType = "news" | "fair" | "social";

export type PressItem = {
  id: string;
  title: string;       // haber/fuar başlığı
  source: string;      // kaynak adı: "Eko Haber", "Electricity Turkey" ...
  url: string;         // harici kaynak (yeni sekmede açılır)
  type: PressType;
  date?: string;       // ISO "yyyy-mm-dd" (varsa)
  summary: string;     // kısa, gerçek özet (kaynaktan)
};

export const PRESS_ITEMS: PressItem[] = [
  {
    id: "electricity-turkey-uc-kita",
    title: "Bemis, Kasım Ayında Üç Kıtada Türkiye'nin Enerji Vizyonunu Temsil Ediyor",
    source: "Electricity Turkey",
    url: "https://electricityturkey.com/haber/bemis_kasim_ayinda_uc_kitada_turkiyenin_enerji_vizyonunu_temsil_ediyor_-27097.html",
    type: "news",
    date: "2026-01-02",
    summary:
      "Bemis; Tanzanya (Power & Energy 2025), Kolombiya (FISE 2025) ve İstanbul (EV Charge Show 2025) fuarlarında TÜV sertifikalı Bemis E-V Charge çözümlerini ve 'Made in Türkiye' enerji ürünlerini uluslararası profesyonellere tanıttı.",
  },
  {
    id: "eko-haber-yogun-ilgi",
    title: "Bemis E-V Charge ürünlerine yoğun ilgi",
    source: "Eko Haber",
    url: "https://www.ekohaber.com.tr/bemis-e-v-charge-urunlerine-yogun-ilgi",
    type: "news",
    date: "2024-11-18",
    summary:
      "Bemis E-V Charge, İstanbul'daki EV Charge Show fuarında 30 yıllık birikimle geliştirdiği güvenli şarj cihazlarını, kablolarını ve aksesuarlarını sergiledi; ziyaretçilerden yoğun ilgi gördü.",
  },
  {
    id: "ev-charge-show-2025",
    title: "Bemis E-V Charge, EV Charge Show 2025'te",
    source: "EV Charge Show",
    url: "https://evchargeshow.com/",
    type: "fair",
    date: "2025-11-12",
    summary:
      "Dünyanın elektrikli araç şarj altyapısına odaklı ilk ve tek fuarı EV Charge Show'da (12-14 Kasım 2025, İstanbul Fuar Merkezi) Bemis E-V Charge, yerli üretim şarj çözümleriyle sektör profesyonellerinin karşısına çıktı.",
  },
  {
    id: "sektorum-uretime-basladi",
    title: "Bemis Şarj Ekipmanları Üretimine Başladı",
    source: "Sektörüm Dergisi",
    url: "https://www.sektorumdergisi.com/bemis-sarj-ekipmanlari-uretimine-basladi/",
    type: "news",
    summary:
      "30 yıllık endüstriyel elektrik birikimine sahip Bemis, %100 yerli yazılım ve üretim süreçleriyle elektrikli araç şarj ekipmanları üretimine başladığını duyurdu.",
  },
  {
    id: "sektorum-v2l-c2l-adaptorler",
    title: "Bemis E-V Charge: Elektrikli Araç Teknolojisinde Devrim Yaratan V2L ve C2L Adaptörleri",
    source: "Sektörüm Dergisi",
    url: "https://www.sektorumdergisi.com/bemis-e-v-charge-elektrikli-arac-teknolojisinde-devrim-yaratan-v2l-ve-c2l-adaptorleri/",
    type: "news",
    summary:
      "Bemis E-V Charge'ın V2L (Vehicle-to-Load) ve C2L (Charger-to-Load) adaptörleri aracı seyyar bir elektrik kaynağına çeviriyor; talebin Çin'den karşılandığı Mini Adaptör'ün yerli üretimi de duyuruldu.",
  },
  {
    id: "sektorum-yerli-urunler-tuketiciyle",
    title: "Bemis'in %100 Yerli EV Şarj Ürünleri E-V Charge'lar Tüketiciyle Buluştu",
    source: "Sektörüm Dergisi",
    url: "https://www.sektorumdergisi.com/bemisin-0-yerli-elektrikli-arac-sarj-urunleri-e-v-chargelar-tuketiciyle-bulustu/",
    type: "news",
    summary:
      "Charger, Charger Plus ve Charger Pro modelleri (7,4–22 kW; IP66/IP65; QR, RFID, NFC, Wi-Fi, OCPP 1.6J) %100 yerli yazılım ve üretimle tüketiciyle buluştu.",
  },
];

// Tarihe göre yeni→eski sıralı. (Tarihsiz kayıtlar sona düşer.)
export const allPress = (): PressItem[] =>
  [...PRESS_ITEMS].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
