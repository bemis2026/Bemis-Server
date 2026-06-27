// Harici basın / haber / fuar paylaşımları — Bemis E-V Charge ile ilgili
// GERÇEK, doğrulanmış dış kaynaklar. Hem /blog "Haberler & Fuarlar" bölümünde,
// hem anasayfa blog şeridinde, hem de /blog/haber/[id] İÇ ÖZET sayfalarında kullanılır.
//
// ⚠️ KURAL: Buraya yalnızca GERÇEK, erişilebilir haber/fuar linkleri ekleyin.
// Uydurma başlık/URL EKLEMEYİN. `body` özetleri ÖZGÜN (kaynaktan kopyalanmamış),
// doğrulanmış gerçeklere dayalı kısa metinlerdir.
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
  summary: string;     // kısa, gerçek özet (kart üzerinde görünür)
  body?: string[];     // iç özet sayfası için ÖZGÜN paragraflar (/blog/haber/[id])
  image?: string;      // haber görseli (kaynağın OG görseli) — kart + özet sayfası
  keywords?: string[]; // Article JSON-LD keywords (SEO/GEO)
};

export const PRESS_ITEMS: PressItem[] = [
  {
    id: "electricity-turkey-uc-kita",
    keywords: ["Bemis", "Made in Türkiye enerji", "EV Charge Show 2025", "FISE 2025", "Power Energy Tanzanya", "yerli EV şarj ihracat", "TÜV sertifikalı şarj"],
    title: "Bemis, Kasım Ayında Üç Kıtada Türkiye'nin Enerji Vizyonunu Temsil Ediyor",
    source: "Electricity Turkey",
    url: "https://electricityturkey.com/haber/bemis_kasim_ayinda_uc_kitada_turkiyenin_enerji_vizyonunu_temsil_ediyor_-27097.html",
    type: "news",
    date: "2026-01-02",
    image: "https://www.electricityturkey.com/resimler/2026-1/2/25344363419687.webp",
    summary:
      "Bemis; Tanzanya (Power & Energy 2025), Kolombiya (FISE 2025) ve İstanbul (EV Charge Show 2025) fuarlarında TÜV sertifikalı Bemis E-V Charge çözümlerini ve 'Made in Türkiye' enerji ürünlerini uluslararası profesyonellere tanıttı.",
    body: [
      "Bemis, Kasım 2025'te üç ayrı kıtada düzenlenen büyük enerji etkinliklerinde yer alarak 'Made in Türkiye' enerji vizyonunu uluslararası sahneye taşıdı.",
      "Afrika'da Tanzanya Power & Energy 2025, Latin Amerika'da Kolombiya'daki FISE 2025 (11-13 Kasım) ve Avrupa'da İstanbul'daki EV Charge Show (12-14 Kasım) etkinliklerinde, Bemis E-V Charge'ın TÜV sertifikalı elektrikli araç şarj çözümleri ve yenilikçi enerji ürünleri tanıtıldı.",
      "70'ten fazla ülkeye ihracat yapan ve 7.000'i aşkın ürün çeşidine sahip Bemis, yerli üretim gücünü küresel pazarlarda göstermeyi sürdürüyor.",
    ],
  },
  {
    id: "eko-haber-yogun-ilgi",
    keywords: ["Bemis E-V Charge", "EV Charge Show", "yerli şarj cihazı", "elektrikli araç şarj fuarı", "şarj kablosu", "şarj aksesuarları"],
    title: "Bemis E-V Charge ürünlerine yoğun ilgi",
    source: "Eko Haber",
    url: "https://www.ekohaber.com.tr/bemis-e-v-charge-urunlerine-yogun-ilgi",
    type: "news",
    date: "2024-11-18",
    image: "https://ekohabercomtr.teimg.com/crop/1280x720/ekohaber-com-tr/uploads/2024/11/1486-m5.jpg",
    summary:
      "Bemis E-V Charge, İstanbul'daki EV Charge Show fuarında 30 yıllık birikimle geliştirdiği güvenli şarj cihazlarını, kablolarını ve aksesuarlarını sergiledi; ziyaretçilerden yoğun ilgi gördü.",
    body: [
      "Bemis E-V Charge, İstanbul'da düzenlenen EV Charge Show fuarında elektrikli araç şarj cihazları, kabloları ve aksesuarlarıyla ziyaretçilerden yoğun ilgi gördü.",
      "30 yıllık endüstriyel elektrik birikimiyle geliştirilen güvenli ve yerli şarj çözümleri, fuarda sektör profesyonelleriyle buluştu.",
    ],
  },
  {
    id: "ev-charge-show-2025",
    keywords: ["EV Charge Show 2025", "İstanbul EV şarj fuarı", "Bemis yerli üretim", "AC şarj cihazı", "V2L C2L adaptör", "şarj ünitesi ekipmanları"],
    title: "Bemis E-V Charge, EV Charge Show 2025'te",
    source: "EV Charge Show",
    url: "https://evchargeshow.com/",
    type: "fair",
    date: "2025-11-12",
    summary:
      "Dünyanın elektrikli araç şarj altyapısına odaklı ilk ve tek fuarı EV Charge Show'da (12-14 Kasım 2025, İstanbul Fuar Merkezi) Bemis E-V Charge, yerli üretim şarj çözümleriyle sektör profesyonellerinin karşısına çıktı.",
    body: [
      "Dünyanın elektrikli araç şarj altyapısına odaklanan ilk ve tek fuarı EV Charge Show, 12-14 Kasım 2025 tarihlerinde İstanbul Fuar Merkezi'nde gerçekleşti.",
      "Bemis E-V Charge; yerli üretim AC şarj cihazları, V2L/C2L adaptörleri ve şarj ünitesi ekipmanlarıyla fuarda yer alarak sektörün önde gelen markalarıyla aynı sahneyi paylaştı.",
    ],
  },
  {
    id: "sektorum-uretime-basladi",
    keywords: ["Bemis şarj ekipmanları", "yerli EV şarj üretimi", "AC şarj cihazı", "%100 yerli yazılım", "şarj prizi", "elektrikli araç şarj üreticisi"],
    title: "Bemis Şarj Ekipmanları Üretimine Başladı",
    source: "Sektörüm Dergisi",
    url: "https://www.sektorumdergisi.com/bemis-sarj-ekipmanlari-uretimine-basladi/",
    type: "news",
    summary:
      "30 yıllık endüstriyel elektrik birikimine sahip Bemis, %100 yerli yazılım ve üretim süreçleriyle elektrikli araç şarj ekipmanları üretimine başladığını duyurdu.",
    body: [
      "30 yıllık endüstriyel elektrik üreticisi Bemis, elektrikli araç şarj ekipmanları üretimine başladığını duyurdu.",
      "Şirket; AC şarj cihazlarını, şarj prizlerini ve ilgili ekipmanları %100 yerli yazılım ve üretim süreçleriyle kendi tesislerinde üretiyor.",
    ],
  },
  {
    id: "sektorum-v2l-c2l-adaptorler",
    keywords: ["V2L adaptör", "C2L adaptör", "araçtan elektrik", "yerli V2L üretimi", "Bemis E-V Charge", "Vehicle-to-Load", "Mini Adaptör"],
    title: "Bemis E-V Charge: Elektrikli Araç Teknolojisinde Devrim Yaratan V2L ve C2L Adaptörleri",
    source: "Sektörüm Dergisi",
    url: "https://www.sektorumdergisi.com/bemis-e-v-charge-elektrikli-arac-teknolojisinde-devrim-yaratan-v2l-ve-c2l-adaptorleri/",
    type: "news",
    summary:
      "Bemis E-V Charge'ın V2L (Vehicle-to-Load) ve C2L (Charger-to-Load) adaptörleri aracı seyyar bir elektrik kaynağına çeviriyor; talebin Çin'den karşılandığı Mini Adaptör'ün yerli üretimi de duyuruldu.",
    body: [
      "Bemis E-V Charge'ın V2L (Vehicle-to-Load) ve C2L (Charger-to-Load) adaptörleri, elektrikli aracın bataryasını seyyar bir elektrik kaynağına dönüştürerek kamp, saha ve acil durumlarda dış cihazların beslenmesine olanak tanıyor.",
      "Şirket ayrıca, talebin büyük ölçüde Çin'den karşılandığı Mini Adaptör'ün yerli üretimine başladığını açıklayarak bu alanda ithalata bağımlılığı azaltmayı hedefliyor.",
    ],
  },
  {
    id: "sektorum-yerli-urunler-tuketiciyle",
    keywords: ["Bemis Charger", "Charger Plus", "Charger Pro", "OCPP 1.6J", "IP66 IP65 şarj", "yerli EV şarj", "RFID NFC Wi-Fi şarj"],
    title: "Bemis'in %100 Yerli EV Şarj Ürünleri E-V Charge'lar Tüketiciyle Buluştu",
    source: "Sektörüm Dergisi",
    url: "https://www.sektorumdergisi.com/bemisin-0-yerli-elektrikli-arac-sarj-urunleri-e-v-chargelar-tuketiciyle-bulustu/",
    type: "news",
    summary:
      "Charger, Charger Plus ve Charger Pro modelleri (7,4–22 kW; IP66/IP65; QR, RFID, NFC, Wi-Fi, OCPP 1.6J) %100 yerli yazılım ve üretimle tüketiciyle buluştu.",
    body: [
      "Bemis'in %100 yerli elektrikli araç şarj ürünleri E-V Charge ailesi tüketiciyle buluştu.",
      "Charger, Charger Plus ve Charger Pro modelleri 7,4 kW'tan 22 kW'a kadar güç seçenekleri sunuyor; IP66/IP65 koruma sınıfı ile QR kod, RFID, NFC, Wi-Fi ve OCPP 1.6J protokol desteği içeriyor.",
    ],
  },
];

// Tarihe göre yeni→eski sıralı. (Tarihsiz kayıtlar sona düşer.)
export const allPress = (): PressItem[] =>
  [...PRESS_ITEMS].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

export const getPress = (id: string): PressItem | undefined =>
  PRESS_ITEMS.find((p) => p.id === id);
