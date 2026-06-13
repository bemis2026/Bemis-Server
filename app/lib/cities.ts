// Şehir bazlı yerel-SEO landing sayfaları için veri. Hem route (page.tsx)
// hem sitemap.ts buradan okur. Yeni şehir eklemek = bu listeye bir kayıt +
// app/<slug>/page.tsx dosyasını kopyalamak (içerik veri-tabanlı).
//
// İçerik ÖZGÜNDÜR (mevcut site/blog kopyası değil) ve rakip marka adı GEÇMEZ.

export type CityFaq = { q: string; a: string };

export type CityPage = {
  slug: string;            // "bursa-ev-sarj-istasyonu"
  city: string;            // "Bursa"
  loc: string;             // locative — "Bursa'da"
  region: string;          // schema areaServed — "Bursa"
  isHQ?: boolean;          // üretim merkezi bu şehirdeyse (Bursa) güçlü yerel sinyal
  title: string;           // meta title (marka soneki layout'tan eklenir)
  h1: string;
  eyebrow: string;
  intro: string;           // hero paragrafı
  localPitch: string;      // "neden bu şehirde Bemis" paragrafı
  metaDescription: string;
  keywords: string[];
  faq: CityFaq[];
};

export const CITY_PAGES: CityPage[] = [
  {
    slug: "bursa-ev-sarj-istasyonu",
    city: "Bursa",
    loc: "Bursa'da",
    region: "Bursa",
    isHQ: true,
    title: "Bursa EV Şarj İstasyonu ve Şarj Cihazı",
    h1: "Bursa EV Şarj İstasyonu ve Şarj Cihazı",
    eyebrow: "Bursa · Yerli Üretim",
    intro:
      "Bemis E-V Charge, Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² tesisinde elektrikli araç şarj cihazlarını kendi üreten yerli bir markadır. Bursa'da ev, iş yeri ve filonuz için AC Wallbox şarj istasyonu, taşınabilir şarj cihazı, Type 2 şarj kablosu ve V2L/C2L adaptörlerini doğrudan üreticisinden temin edebilirsiniz.",
    localPitch:
      "Üretim merkezimiz Bursa'da olduğu için cihaza, kurulum desteğine ve yedek parçaya en hızlı eriştiğiniz şehir Bursa'dır. 1994'ten beri süren Bemis Teknik üretim mirası ve kendi Ar-Ge'mizle, donanımdan yazılıma kadar yerli üretim yapıyoruz.",
    metaDescription:
      "Bursa'da elektrikli araç şarj istasyonu ve şarj cihazı — Bemis E-V Charge, Bursa OSB'deki tesisinde üreten yerli üretici. AC Wallbox, taşınabilir şarj, Type 2 kablo. CE, IP65, OCPP.",
    keywords: [
      "bursa ev şarj istasyonu",
      "bursa ev şarj cihazı",
      "bursa elektrikli araç şarj",
      "bursa wallbox",
      "bursa ev şarj cihazı üreticisi",
      "bursa araç şarj istasyonu kurulumu",
    ],
    faq: [
      {
        q: "Bursa'da EV şarj cihazını nereden alabilirim?",
        a: "Bemis E-V Charge cihazlarını Bursa'daki üretim merkezimizden ve yetkili bayilerimizden temin edebilirsiniz. Ürünleri inceleyip teklif almak için sitemizden bize ulaşabilir, bayi bul aracıyla size en yakın noktayı görebilirsiniz.",
      },
      {
        q: "Bursa'da ev tipi şarj istasyonu kurulumu yapılıyor mu?",
        a: "Evet. AC Wallbox (7,4–22 kW) cihazlarımız ev, site ve iş yeri otoparkları için uygundur; elektrik altyapısı ve kurulum konusunda yönlendirme sağlıyoruz.",
      },
      {
        q: "Bemis şarj cihazları yerli üretim mi?",
        a: "Evet. Cihazlarımız Bursa OSB'deki kendi tesisimizde, PCB tasarımından gömülü yazılıma kadar üretilir; CE, IP65/IP66 ve OCPP uyumludur.",
      },
      {
        q: "Bursa dışına satış ve sevkiyat yapıyor musunuz?",
        a: "Evet. Türkiye geneli bayi ağımız ve 60+ ülkeye ihracatımız var; Bursa merkezli üretimden tüm Türkiye'ye sevkiyat yapıyoruz.",
      },
      {
        q: "İş yeri ve filo için toplu şarj çözümünüz var mı?",
        a: "Evet. İş yeri, AVM, otel ve filolar için çoklu kurulum, OCPP yönetimi ve OEM/özel üretim seçeneklerimiz mevcuttur.",
      },
    ],
  },
];

export const getCityPage = (slug: string): CityPage | undefined =>
  CITY_PAGES.find((c) => c.slug === slug);
