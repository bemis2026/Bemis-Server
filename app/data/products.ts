export type SpecItem = { label: string; value: string };
export type SpecGroup = { group: string; items: SpecItem[] };

export type ProductEntry = {
  id: string;
  name: string;
  subtitle: string;
  badge: string | null;
  description: string;
  specs: SpecGroup[];
};

export type CategoryData = {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  products: ProductEntry[];
};

export const categories: CategoryData[] = [
  {
    id: "wallbox",
    name: "AC Wallbox",
    tagline: "Evinize ve iş yerinize özel duvar tipi şarj istasyonu",
    accent: "#3B82F6",
    products: [
      {
        id: "wallbox",
        name: "AC Wallbox",
        subtitle: "Duvar Tipi Şarj İstasyonu",
        badge: "En Çok Satan",
        description:
          "Konut, iş yeri ve ticari parkinglar için geliştirilmiş, IP65 korumalı akıllı AC şarj istasyonu. Tek ve üç fazlı modelleriyle geniş uygulama yelpazesi.",
        specs: [
          {
            group: "Elektriksel",
            items: [
              { label: "Güç Seçenekleri", value: "7,4 kW · 11 kW · 22 kW" },
              { label: "Giriş Gerilimi", value: "230V (1F) / 400V (3F) ± %10" },
              { label: "Faz", value: "Monofaze & Trifaze" },
              { label: "Maksimum Akım", value: "16A · 32A" },
              { label: "Güç Faktörü", value: "> 0,98" },
              { label: "Verimlilik", value: "> %95" },
            ],
          },
          {
            group: "Konnektör & Kablo",
            items: [
              { label: "Konnektör Tipi", value: "Type 2 (IEC 62196-2)" },
              { label: "Kablo Uzunluğu", value: "4m (opsiyonel 6m)" },
              { label: "Kablo Kesiti", value: "5 × 4 mm²" },
              { label: "Kablo Tipi", value: "Spiralli esnek" },
            ],
          },
          {
            group: "Koruma & Güvenlik",
            items: [
              { label: "Koruma Sınıfı", value: "IP65" },
              { label: "Darbe Koruması", value: "IK10" },
              { label: "Çalışma Sıcaklığı", value: "-40°C / +55°C" },
              { label: "Topraklama Koruması", value: "Var (PE)" },
              { label: "Kaçak Akım", value: "6 mA DC / 30 mA AC" },
              { label: "Aşırı Akım Koruması", value: "Dahili MCB" },
            ],
          },
          {
            group: "İletişim & Kontrol",
            items: [
              { label: "Protokol", value: "OCPP 1.6 / OCPP 2.0" },
              { label: "Bağlantı", value: "4G / Wi-Fi / LAN (modele göre)" },
              { label: "Kullanıcı Arayüzü", value: "LED gösterge / RFID okuyucu" },
              { label: "Uzaktan Yönetim", value: "Evet (bulut tabanlı)" },
              { label: "Yük Dengeleme", value: "Dinamik (DLM)" },
            ],
          },
          {
            group: "Mekanik",
            items: [
              { label: "Ağırlık", value: "Yaklaşık 4,5 kg" },
              { label: "Boyutlar", value: "275 × 175 × 110 mm" },
              { label: "Montaj", value: "Duvar / direk montajı" },
              { label: "Renk", value: "Beyaz / Siyah (opsiyonel)" },
              { label: "Malzeme", value: "UV dayanımlı ABS" },
            ],
          },
          {
            group: "Sertifikalar",
            items: [
              { label: "Elektriksel", value: "CE · IEC 61851-1 · IEC 62196" },
              { label: "Kalite", value: "ISO 9001:2015" },
              { label: "Üretim", value: "Yerli Üretim (Bursa OSB)" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "portable",
    name: "Taşınabilir Şarj",
    tagline: "Kurulum gerektirmez — prize tak, şarj et",
    accent: "#10B981",
    products: [
      {
        id: "portable",
        name: "Taşınabilir Şarj Cihazı",
        subtitle: "Plug & Play Çözüm",
        badge: "Yeni",
        description:
          "Sabit kurulum gerektirmeyen, standart ev prizinden çalışan taşınabilir EV şarj cihazı. İş seyahatleri, uzun yolculuklar ve yedek şarj için ideal.",
        specs: [
          {
            group: "Elektriksel",
            items: [
              { label: "Güç", value: "2,3 kW · 3,7 kW · 7,4 kW" },
              { label: "Giriş", value: "230V AC, 50Hz" },
              { label: "Akım", value: "10A / 16A / 32A (ayarlanabilir)" },
              { label: "Verimlilik", value: "> %93" },
            ],
          },
          {
            group: "Konnektör",
            items: [
              { label: "Araç Tarafı", value: "Type 2 (IEC 62196-2)" },
              { label: "Şebeke Tarafı", value: "Schuko (CEE 7/4)" },
              { label: "Kablo Uzunluğu", value: "5m (dahili)" },
              { label: "Kablo Kesiti", value: "3 × 2,5 mm²" },
            ],
          },
          {
            group: "Koruma & Güvenlik",
            items: [
              { label: "Koruma Sınıfı", value: "IP54" },
              { label: "Topraklama Tespiti", value: "Aktif — şarj engellenir" },
              { label: "Sıcaklık Koruması", value: "Termal kesme" },
              { label: "Kaçak Akım", value: "6 mA DC izleme" },
              { label: "Aşırı Yük", value: "Otomatik kesme" },
            ],
          },
          {
            group: "Taşınabilirlik",
            items: [
              { label: "Ağırlık", value: "Yaklaşık 700 g" },
              { label: "Boyutlar", value: "195 × 75 × 45 mm" },
              { label: "LED Gösterge", value: "5 renk durum LED'i" },
              { label: "Gövde", value: "Dayanıklı ABS muhafaza" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cables",
    name: "Şarj Kabloları",
    tagline: "AC ve DC şarj için sertifikalı kablo çözümleri",
    accent: "#F59E0B",
    products: [
      {
        id: "ac-cable",
        name: "AC Şarj Kablosu",
        subtitle: "Type 2 — Type 2 · Mod 3",
        badge: null,
        description:
          "AC şarj istasyonu ile araç arasında güvenli ve verimli güç aktarımı sağlayan Mod 3 uyumlu şarj kablosu. Ev ve ticari kullanıma uygun.",
        specs: [
          {
            group: "Elektriksel",
            items: [
              { label: "Maksimum Güç", value: "22 kW (3 × 32A)" },
              { label: "Gerilim", value: "230V (1F) / 400V (3F)" },
              { label: "Maksimum Akım", value: "16A / 32A" },
              { label: "İletken Kesiti", value: "5 × 2,5 mm² · 5 × 4 mm² · 5 × 6 mm²" },
            ],
          },
          {
            group: "Konnektör",
            items: [
              { label: "Her İki Uç", value: "Type 2 (IEC 62196-2)" },
              { label: "Gövde Malzeme", value: "Cam elyaf takviyeli PA (GF30)" },
              { label: "Kontakt Malzeme", value: "Gümüş kaplı bakır" },
              { label: "Kilitleme", value: "Mekanik mandal + PP kapak" },
            ],
          },
          {
            group: "Kablo Yapısı",
            items: [
              { label: "İzolasyon", value: "XLPE" },
              { label: "Kılıf", value: "Soğuk bükülür TPE" },
              { label: "Uzunluk", value: "5m · 7m · 10m · özel" },
              { label: "Bükülme Ömrü", value: "> 15.000 döngü" },
            ],
          },
          {
            group: "Koruma & Sertifikalar",
            items: [
              { label: "Koruma Sınıfı", value: "IP54" },
              { label: "Çalışma Sıcaklığı", value: "-30°C / +50°C" },
              { label: "Standart", value: "IEC 62893-2 · IEC 62196-2" },
              { label: "Güvenlik", value: "CE · VDE · TÜV" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
      {
        id: "dc-cable",
        name: "DC Şarj Kablosu",
        subtitle: "CCS / CHAdeMO · Hızlı Şarj",
        badge: null,
        description:
          "DC hızlı şarj istasyonları ile elektrikli araçlar arasında güvenilir ve yüksek performanslı güç aktarımı sağlayan profesyonel şarj kablosu.",
        specs: [
          {
            group: "Elektriksel",
            items: [
              { label: "Maksimum Güç", value: "350 kW" },
              { label: "Maksimum Gerilim", value: "1000V DC" },
              { label: "Maksimum Akım", value: "500A" },
              { label: "Konnektör Soğutma", value: "Aktif su soğutmalı (500A model)" },
            ],
          },
          {
            group: "Konnektör Tipleri",
            items: [
              { label: "CCS Combo 2", value: "IEC 62196-3" },
              { label: "CHAdeMO", value: "JEVS G105 rev. 2.0" },
              { label: "GB/T DC", value: "GB/T 20234.3 (opsiyonel)" },
            ],
          },
          {
            group: "Kablo Yapısı",
            items: [
              { label: "İletken", value: "70 mm² tinsil bakır alaşımı" },
              { label: "İzolasyon", value: "TPE çok katmanlı" },
              { label: "Uzunluk", value: "1,5m · 3m · 5m · 7m · özel" },
              { label: "Bükülme Ömrü", value: "> 20.000 döngü" },
            ],
          },
          {
            group: "Koruma & Sertifikalar",
            items: [
              { label: "Koruma Sınıfı", value: "IP67 (bağlıyken)" },
              { label: "Çalışma Sıcaklığı", value: "-40°C / +90°C" },
              { label: "Standartlar", value: "IEC 62893-4 · IEC 62196-3" },
              { label: "Güvenlik", value: "CE · TÜV" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "v2l-c2l",
    name: "V2L / C2L Adaptörler",
    tagline: "Araç bataryasını veya şarj cihazını harici güç kaynağına dönüştürün",
    accent: "#818CF8",
    products: [
      {
        id: "v2l",
        name: "V2L / C2L Adaptör",
        subtitle: "Vehicle-to-Load & Charger-to-Load",
        badge: "İnovatif",
        description:
          "Elektrikli araç bataryasını veya şarj cihazını harici güç kaynağına dönüştüren adaptör sistemi. Kamp, acil güç ve iş sahası uygulamaları için idealdir.",
        specs: [
          {
            group: "V2L (Araçtan Yüke)",
            items: [
              { label: "Çalışma Prensibi", value: "Type 2 → şebeke çıkışı" },
              { label: "Maks. Çıkış Gücü", value: "3,6 kW" },
              { label: "Çıkış Gerilimi", value: "230V AC, 50Hz" },
              { label: "Uyumlu Araçlar", value: "Ioniq 5/6, EV6, Mustang Mach-E vb." },
            ],
          },
          {
            group: "C2L (Şarjdan Yüke)",
            items: [
              { label: "Konnektör", value: "Type 2 erkek giriş · Schuko çıkış" },
              { label: "Uygulamalar", value: "Saha aydınlatma, alet, kamp" },
              { label: "Güvenlik", value: "Topraklama izleme · aşırı akım" },
            ],
          },
          {
            group: "Mekanik & Sertifikalar",
            items: [
              { label: "Gövde", value: "PA66-GF30" },
              { label: "Koruma Sınıfı", value: "IP44" },
              { label: "Ağırlık", value: "~350 g" },
              { label: "Standart", value: "IEC 62196-2 · IEC 61851-1 · CE" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "converters",
    name: "Uzatma & Dönüştürücüler",
    tagline: "Şarj kablosunu uzatın veya farklı fiş tiplerine dönüştürün",
    accent: "#06B6D4",
    products: [
      {
        id: "extension-cable",
        name: "Şarj Uzatma Kablosu",
        subtitle: "Type 2 Uzatma · 5m–25m",
        badge: null,
        description:
          "Araç ile duvar prizi veya şarj istasyonu arasındaki mesafeyi güvenli biçimde uzatan, yüksek akım kapasiteli esnek uzatma kablosu.",
        specs: [
          {
            group: "Elektriksel",
            items: [
              { label: "Maksimum Güç", value: "22 kW (3 × 32A)" },
              { label: "Gerilim", value: "230V – 400V" },
              { label: "İletken Kesiti", value: "5 × 4 mm² · 5 × 6 mm²" },
              { label: "İletken", value: "Tinsil bakır esnek tel" },
            ],
          },
          {
            group: "Konnektör",
            items: [
              { label: "Her İki Uç", value: "Type 2 (IEC 62196-2)" },
              { label: "Konnektör Gövde", value: "Cam elyaf takviyeli PA" },
              { label: "Uzunluk Seçenekleri", value: "5m · 10m · 15m · 20m · 25m" },
            ],
          },
          {
            group: "Koruma & Sertifikalar",
            items: [
              { label: "Koruma Sınıfı", value: "IP54" },
              { label: "Çalışma Sıcaklığı", value: "-30°C / +50°C" },
              { label: "Standart", value: "IEC 62196-2 · CE" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
      {
        id: "schuko-adapter",
        name: "Schuko → Type 2 Adaptör",
        subtitle: "Dönüştürücü Adaptör",
        badge: null,
        description:
          "Standart Schuko (CEE 7/4) fişini Type 2 dişi sokete dönüştüren adaptör. Taşınabilir şarj cihazlarıyla kullanım için.",
        specs: [
          {
            group: "Özellikler",
            items: [
              { label: "Giriş", value: "Schuko CEE 7/4 erkek" },
              { label: "Çıkış", value: "Type 2 IEC 62196-2 dişi" },
              { label: "Maksimum Akım", value: "16A" },
              { label: "Gerilim", value: "230V AC" },
              { label: "Gövde", value: "ABS + PA66" },
              { label: "Koruma Sınıfı", value: "IP44" },
              { label: "Garanti", value: "2 yıl" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "accessories",
    name: "Aksesuarlar",
    tagline: "Montaj ekipmanları ve tamamlayıcı ürünler",
    accent: "#64748B",
    products: [
      {
        id: "wall-mount",
        name: "Duvar Montaj Seti",
        subtitle: "Wallbox & Kablo Tutucular",
        badge: null,
        description:
          "Wallbox ve şarj kablolarını güvenli biçimde duvara sabitlemek için kullanılan paslanmaz çelik ve ABS montaj ekipmanları.",
        specs: [
          {
            group: "İçerik",
            items: [
              { label: "Montaj Braketi", value: "316L paslanmaz çelik" },
              { label: "Kablo Tutucu", value: "UV dayanımlı ABS, 2 adet" },
              { label: "Vida Seti", value: "M6 × 40 mm, 4 adet" },
              { label: "Dübel", value: "Beton / tuğla uyumlu, 4 adet" },
              { label: "Montaj Kılavuzu", value: "Türkçe / İngilizce" },
            ],
          },
        ],
      },
      {
        id: "electronics",
        name: "Elektronik Kontrol Kartı",
        subtitle: "Dahili Kontrol Ünitesi (ECU)",
        badge: "Tescilli Tasarım",
        description:
          "Bemis E-V Charge cihazlarının kalbinde yer alan yerli tasarım elektronik kontrol kartı. OCPP protokolü, güç yönetimi ve güvenlik işlevlerinin tamamı bu kart üzerinde çalışır.",
        specs: [
          {
            group: "İşlemci & Bellek",
            items: [
              { label: "MCU", value: "32-bit ARM Cortex-M4 (180 MHz)" },
              { label: "Flash", value: "1 MB (firmware + OTA)" },
              { label: "RAM", value: "256 KB SRAM" },
              { label: "Güncelleme", value: "OTA firmware update" },
            ],
          },
          {
            group: "İletişim",
            items: [
              { label: "Wi-Fi", value: "IEEE 802.11 b/g/n" },
              { label: "4G/LTE", value: "Cat-M1 modem" },
              { label: "RFID", value: "ISO 14443 / 15693 (13,56 MHz)" },
              { label: "Ethernet", value: "10/100 Mbps (opsiyonel)" },
            ],
          },
          {
            group: "Güç Yönetimi",
            items: [
              { label: "Güç Ölçümü", value: "Aktif / reaktif (±1% doğruluk)" },
              { label: "Enerji Sayacı", value: "kWh (IEC 62053-21)" },
              { label: "Dinamik Yük Denge", value: "DLM — çoklu istasyon" },
              { label: "OCPP", value: "1.6J · 2.0.1" },
            ],
          },
          {
            group: "Üretim & Sertifikasyon",
            items: [
              { label: "PCB Üretimi", value: "Türkiye (Bursa OSB)" },
              { label: "Test", value: "ICT + fonksiyonel (100%)" },
              { label: "EMC", value: "EN 55032 · EN 61000-4" },
              { label: "Kalite", value: "IPC-A-610 Sınıf 2" },
            ],
          },
        ],
      },
    ],
  },
];

export function getCategoryById(id: string): CategoryData | undefined {
  return categories.find((c) => c.id === id);
}
