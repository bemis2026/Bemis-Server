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
      "Üretim merkezimiz Bursa'dadır. 1994'ten gelen Bemis Teknik mirası ve kendi Ar-Ge'mizle, donanımdan yazılıma yerli üretim yaparak bölgemizdeki müşterilerimize cihaz, kurulum ve yedek parçada en hızlı erişimi sağlıyoruz.",
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
  // ⚠️ 2026-07-26 — "bursa şarj kablosu" aramasında 2. sayfadaydık. Teşhis: bu
  // KESİŞİMİ hedefleyen sayfa YOKTU. /products/cables ulusal (bursa 2 kez geçiyor),
  // /bursa-ev-sarj-istasyonu ise istasyon odaklı (kablo yalnız 3 kez). İki yarım
  // eşleşme yerine bu sayfa doğrudan "Bursa + şarj kablosu" niyetini karşılar.
  // ⓘ Günlük dil bilinçli: kullanıcılar "elektrikli araba" yazıyor, sitenin geri
  // kalanı "araç" diyordu — burada ikisi de doğal biçimde geçer.
  {
    slug: "bursa-sarj-kablosu",
    city: "Bursa",
    loc: "Bursa'da",
    region: "Bursa",
    isHQ: true,
    title: "Bursa Şarj Kablosu — Type 2 Elektrikli Araba Şarj Kablosu",
    h1: "Bursa Şarj Kablosu — Yerli Üretim Type 2",
    eyebrow: "Bursa · Kendi Tesisimizde Üretim",
    intro:
      "Elektrikli araba şarj kablonuzu üreticisinden alın: Bemis E-V Charge, Type 2 (Mod 3) şarj kablolarını Bursa Organize Sanayi Bölgesi'ndeki kendi tesisinde üretir. Tek ve üç fazlı, 16A – 32A akım sınıflarında, 3 metreden 15 metreye kadar uzunluk seçenekleriyle; halojensiz dış kılıf ve yüksek akım Type 2 konektörüyle.",
    localPitch:
      "Kablolarımız ithal edilip etiketlenmiyor; Bursa'daki tesisimizde üretiliyor. Bu yüzden Bursa ve çevresindeki müşterilerimiz ürüne, yedek parçaya ve teknik desteğe doğrudan üreticiden erişir. Proje bazlı işlerde kablo boyunu ve soket rengini talebinize göre özelleştirebiliyoruz.",
    metaDescription:
      "Bursa şarj kablosu — Type 2 elektrikli araba şarj kablosu, Bursa OSB'deki kendi tesisimizde üretilir. 16A/32A, tek ve üç faz, 3–15 m, halojensiz. %94 Yerli Malı Belgeli, CE sertifikalı yerli üretici.",
    keywords: [
      "bursa şarj kablosu",
      "bursa type 2 şarj kablosu",
      "bursa elektrikli araba şarj kablosu",
      "elektrikli araba şarj kablosu yerli üretici",
      "yerli üretim şarj kablosu",
      "bursa ev şarj kablosu",
    ],
    faq: [
      {
        q: "Bursa'da şarj kablosunu nereden alabilirim?",
        a: "Bemis E-V Charge Type 2 şarj kablolarını Bursa Organize Sanayi Bölgesi'ndeki üretim tesisimizden ve yetkili bayilerimizden temin edebilirsiniz. Ürünleri inceleyip teklif almak için sitemizden bize ulaşabilir, bayi bul aracıyla size en yakın noktayı görebilirsiniz.",
      },
      {
        q: "Elektrikli araba şarj kablosunun yerli üreticisi kimdir?",
        a: "Bemis E-V Charge, Type 2 şarj kablolarını Bursa OSB'deki 16.000 m² tesisinde üreten yerli bir üreticidir. 1994'ten gelen Bemis Teknik Elektrik mirasıyla üretim yapar; ürünler %94 Yerli Malı Belgeli ve CE sertifikalıdır. Kablolar ithal edilip etiketlenmez, tesisimizde üretilir.",
      },
      {
        q: "Kaç metre şarj kablosu almalıyım?",
        a: "Çoğu ev ve iş yeri kullanımında 5 metre yeterlidir. Aracın şarj soketi park yerine göre uzaktaysa veya kabloyu farklı noktalarda kullanacaksanız 7–10 metre tercih edilir. 3 metreden 15 metreye kadar seçeneğimiz vardır.",
      },
      {
        q: "16A mı 32A mı şarj kablosu almalıyım?",
        a: "Kablonun akım sınıfı, şarj cihazınızın ve aracınızın desteklediği akımla uyumlu olmalıdır. Tek fazlı 16A kablo 3,7 kW'a, 32A kablo 7,4 kW'a kadar; üç fazlı 32A kablo ise 22 kW'a kadar güç taşır. Şarj hızını kablo değil, aracınızın dahili AC şarj ünitesi belirler.",
      },
      {
        q: "Şarj kablosu her elektrikli arabaya uyar mı?",
        a: "Türkiye ve Avrupa'da satılan elektrikli arabaların büyük çoğunluğu Type 2 (IEC 62196) soket kullanır; kablolarımız bu araçlarla uyumludur. Aracınızın soket tipinden emin değilseniz marka ve modelini bize yazın, uygun kabloyu birlikte belirleyelim.",
      },
      {
        q: "Bursa dışına gönderim yapıyor musunuz?",
        a: "Evet. Bursa merkezli üretimimizden Türkiye geneline sevkiyat yapıyor, 60+ ülkeye ihracat gerçekleştiriyoruz.",
      },
    ],
  },
];

export const getCityPage = (slug: string): CityPage | undefined =>
  CITY_PAGES.find((c) => c.slug === slug);
