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
  // ⚠️ İç link çapası. Boşsa "<city> EV Şarj İstasyonu"na düşer — aynı şehirde
  // BİRDEN FAZLA sayfa olunca (Bursa: istasyon + kablo) hepsi aynı çapayla
  // linkleniyordu; Google'a yanlış sinyal. Yeni şehir sayfasında MUTLAKA doldur.
  linkLabel?: string;

  // ── Aşağıdaki iki alan sayfaya "o şehirde nereden alırım + ne kadar"
  //    bölümlerini açar (2026-08-02). Boş bırakılırsa bölümler RENDER EDİLMEZ,
  //    sayfa eski hâlinde çalışır → yeni şehir eklerken zorunlu değildir.
  //
  // 📌 NEDEN EKLENDİ: "bursa şarj cihazı elektrikli araba" aramasında 7-8.
  //    sayfadaydık. Ölçüldü: sayfa gövdesinde ₺ 0 kez, ürün modeli adı 0 kez,
  //    şehirdeki bayilerin adı/adresi 0 kez geçiyordu — anahtar kelimeler
  //    doğruydu ama sayfa "nereden alırım" sorusunu cevaplamıyordu. Otorite
  //    sorunu DEĞİLDİ (biz DR 13, bizi geçen kendi bayimiz DR 0).

  /** Bayi verisindeki şehir anahtarı (ör. "bursa"). Verilirse o şehrin
   *  yetkili bayileri ad/adres/telefon/harita ile sayfaya basılır. */
  dealerCityId?: string;
  /** Vitrinde gösterilecek ürün kategorileri (sırayla, kategori başına 2 ürün).
   *  Sayfanın konusuyla eşleşmeli: istasyon sayfasında wallbox/portable,
   *  kablo sayfasında cables. */
  showcaseCategories?: string[];
};

export const CITY_PAGES: CityPage[] = [
  {
    slug: "bursa-ev-sarj-istasyonu",
    city: "Bursa",
    loc: "Bursa'da",
    region: "Bursa",
    isHQ: true,
    linkLabel: "Bursa Elektrikli Araba Şarj Cihazı",
    dealerCityId: "bursa",
    showcaseCategories: ["wallbox", "portable", "cables"],
    // ⚠️ 2026-07-27: "elektrikli araba şarj cihazı bursa" aramasında 11. sıradaydık ve
    // Google bu sayfa yerine /uretici'yi gösteriyordu. Ölçüm: bu sayfada "elektrikli
    // araba" 0 kez geçiyordu (metin "elektrikli araç" diyordu) → kullanıcının YAZDIĞI
    // kelime sayfada yoktu. Başlık/H1/giriş/SSS günlük dile göre yeniden yazıldı;
    // "araç" kullanımı da korundu (iki yazım da geçiyor).
    title: "Bursa Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    h1: "Bursa Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    eyebrow: "Bursa · Kendi Tesisimizde Üretim",
    intro:
      "Elektrikli araba şarj cihazınızı Bursa'da doğrudan üreticisinden alın. Bemis E-V Charge, Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² tesisinde elektrikli araç şarj cihazlarını kendi üreten yerli bir markadır. Ev, iş yeri ve filonuz için duvar tipi (wallbox) şarj istasyonu, taşınabilir şarj cihazı, Type 2 şarj kablosu ve V2L/C2L adaptörleri tek noktadan temin edilir.",
    localPitch:
      "Üretim merkezimiz Bursa'dadır. 1994'ten gelen Bemis Teknik mirası ve kendi Ar-Ge'mizle, donanımdan yazılıma yerli üretim yaparız. Cihazlar ithal edilip etiketlenmez; bu yüzden Bursa ve çevresindeki müşterilerimiz ürüne, yedek parçaya ve teknik desteğe doğrudan üreticiden erişir. Satış ve kurulum keşfi yetkili bayilerimiz üzerinden yürür.",
    metaDescription:
      "Bursa elektrikli araba şarj cihazı — Bemis E-V Charge, Bursa OSB'deki kendi tesisinde üreten yerli üretici. Ev tipi wallbox (7,4–22 kW), taşınabilir şarj cihazı, Type 2 kablo. CE, IP65, OCPP.",
    keywords: [
      "bursa elektrikli araba şarj cihazı",
      "elektrikli araba şarj cihazı bursa",
      "bursa ev şarj istasyonu",
      "bursa ev şarj cihazı",
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
        a: "Evet. Türkiye geneli bayi ağımız ve 80+ ülkeye ihracatımız var; Bursa merkezli üretimden tüm Türkiye'ye sevkiyat yapıyoruz.",
      },
      {
        q: "İş yeri ve filo için toplu şarj çözümünüz var mı?",
        a: "Evet. İş yeri, AVM, otel ve filolar için çoklu kurulum, OCPP yönetimi ve OEM/özel üretim seçeneklerimiz mevcuttur.",
      },
      {
        q: "Bursa'da elektrikli araba şarj cihazı fiyatı ne kadar?",
        a: "Fiyat; cihazın gücüne (7,4 kW tek faz — 22 kW üç faz), kablolu mu soketli mi olduğuna, ekran, RFID, uygulama ve MID sayaç gibi özelliklere göre değişir. Güncel liste fiyatları ürün sayfalarımızda yayınlanır. Kurulum cihaz fiyatına dahil değildir; yetkili bayimiz keşif yaparak hat çekimi ve pano işleri için ayrı teklif verir.",
      },
      {
        q: "Elektrikli araba şarj cihazı seçerken nelere dikkat etmeliyim?",
        a: "Önce tesisatınızın tek fazlı mı üç fazlı mı olduğunu ve aracınızın dahili AC şarj limitini öğrenin — şarj hızını cihaz değil aracınız belirler. Aracınız 7,4 kW ile sınırlıysa 22 kW cihaz daha hızlı şarj etmez. Dış mekân kullanımında IP65 koruma sınıfı, ortak alan veya iş yerinde ise OCPP uyumu ve RFID yetkilendirme önem kazanır.",
      },
      {
        q: "Evime şarj cihazı taktırmak için ne gerekiyor?",
        a: "Cihazın bağlanacağı hattın uygun kesitte kablo, kendi sigortası ve kaçak akım koruması ile çekilmesi gerekir. Bu işler yetkili bir elektrikçi tarafından, ürün kurulum şartnamesine uygun yapılmalıdır. Site veya apartman otoparkında ayrıca yönetim onayı ve sayaç/abonelik düzeni gündeme gelir. Yetkili bayimiz keşifte mevcut altyapınızı değerlendirip gereken işleri çıkarır.",
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
    linkLabel: "Bursa Şarj Kablosu",
    dealerCityId: "bursa",
    showcaseCategories: ["cables"],
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
        a: "Evet. Bursa merkezli üretimimizden Türkiye geneline sevkiyat yapıyor, 80+ ülkeye ihracat gerçekleştiriyoruz.",
      },
    ],
  },
  // ── 2026-09-15: İstanbul · Ankara · İzmir ─────────────────────────────
  // ⚠️ YEREL DAYANAK GERÇEKTİR: bu üç şehirde de adresi kayıtlı YETKİLİ BAYİ var
  //    (data/dealers.json → istanbul 10 · ankara 4 · izmir 3). Sayfa bayileri
  //    ad/adres/telefonla SUNUCUDA basar; Bursa sayfasını ayağa kaldıran sinyal
  //    buydu ("nereden alırım" sorusunun cevabı).
  // ⚠️ `isHQ` YOK: üretim yalnız Bursa'da. Bu sayfalarda "burada üretiyoruz"
  //    denmez — "üretim Bursa'da, bu şehirde yetkili bayi" denir.
  // ⚠️ Bayi SAYISI metinde GEÇMEZ: sayı değişir, prose bayatlar; liste zaten
  //    veriden basılıyor.
  // ⚠️ Şehir hakkında doğrulanamayan iddia YOK ("İstanbul'da şu kadar kurulum
  //    yaptık" gibi). Metin alıcının KARARINA odaklanır, şehir istatistiğine değil.
  // 📌 Üç sayfa birbirinin şablon kopyası DEĞİL: her birinde farklı bir karar
  //    ekseni ve farklı iç bağlantı var (İstanbul → ortak alan; Ankara → filo/B2B;
  //    İzmir → müstakil ev + solar). Aksi hâlde kapı-sayfası (doorway) sınıfına
  //    girer ve üçü birden değersizleşir.
  {
    slug: "istanbul-ev-sarj-istasyonu",
    city: "İstanbul",
    loc: "İstanbul'da",
    region: "İstanbul",
    linkLabel: "İstanbul Elektrikli Araba Şarj Cihazı",
    dealerCityId: "istanbul",
    showcaseCategories: ["wallbox", "portable", "cables"],
    title: "İstanbul Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    h1: "İstanbul Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    eyebrow: "İstanbul · Yetkili Bayi Ağı",
    intro:
      "Elektrikli araba şarj cihazınızı İstanbul'daki yetkili bayilerimizden alın. Bemis E-V Charge cihazları Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² kendi tesisimizde üretilir; İstanbul'un iki yakasındaki yetkili bayilerimiz satış, keşif ve kurulum yönlendirmesini yürütür. Ev tipi duvar (wallbox) şarj istasyonu, taşınabilir şarj cihazı ve Type 2 şarj kablosu tek noktadan temin edilir.",
    localPitch:
      "İstanbul'da kurulum kararını çoğu zaman cihazın kendisi değil, cihazın bağlanacağı yer belirler: müstakil bir otoparkta iş hattın çekilmesiyle biterken, site veya apartman ortak otoparkında yönetim kararı, sayaç düzeni ve kullanıcı yetkilendirmesi gündeme gelir. İkinci durumda Charger Plus 2 ve Charger Pro 2 ailelerinde ortak alan yönetim paneli cihazla birlikte ücretsiz gelir; kim ne kadar harcadı kişi bazında raporlanır. Yetkili bayimiz keşifte hangi senaryoda olduğunuzu netleştirir.",
    metaDescription:
      "İstanbul elektrikli araba şarj cihazı — yetkili bayilerimizden alın. Ev tipi wallbox (3,7–22 kW), taşınabilir şarj cihazı, Type 2 kablo. Yerli üretim, CE, IP65.",
    keywords: [
      "istanbul elektrikli araba şarj cihazı",
      "elektrikli araba şarj cihazı istanbul",
      "istanbul ev şarj istasyonu",
      "istanbul ev şarj cihazı",
      "istanbul wallbox",
      "istanbul araç şarj istasyonu kurulumu",
      "istanbul site otoparkı şarj istasyonu",
    ],
    faq: [
      {
        q: "İstanbul'da elektrikli araba şarj cihazını nereden alabilirim?",
        a: "İstanbul'daki yetkili bayilerimizden temin edebilirsiniz; bu sayfada bayilerimizin adı, adresi ve iletişim bilgisi listelenir. Cihaz Bursa'daki kendi tesisimizde üretilir, satış ve kurulum keşfi bayimiz üzerinden yürür. Ürünleri inceleyip doğrudan teklif de isteyebilirsiniz.",
      },
      {
        q: "Site veya apartman otoparkına şarj cihazı taktırabilir miyim?",
        a: "Teknik olarak evet; belirleyici olan binanın abone gücü, pano kapasitesi ve ortak alanda yapılacak iş için gereken yönetim kararıdır. Ortak kullanımda elektriğin kişi bazında ayrıştırılması gerekir: Charger Plus 2 ve Charger Pro 2 ailelerinde ortak alan yönetim paneli cihazla birlikte ücretsiz gelir, RFID karta ön ödemeli bakiye yüklenir ve kullanım kişi bazında raporlanır.",
      },
      {
        q: "İstanbul'da kurulum yapılıyor mu, keşif ücretli mi?",
        a: "Kurulum, bulunduğunuz ilçedeki yetkili bayimiz tarafından yapılır. Bayi önce keşif yaparak mevcut panonuzu, hat mesafesini ve kablo güzergâhını değerlendirir; hat çekimi ve pano işleri cihaz fiyatına dahil değildir, keşif sonrası ayrı teklif verilir.",
      },
      {
        q: "Evimde üç faz yok, hangi cihazı almalıyım?",
        a: "Tek fazlı (monofaze) tesisatta pratik üst sınır 7,4 kW'tır (32A). Cihazlarımızın gücü 3,7 – 22 kW aralığında ayarlanabildiği için tek fazlı bir evde de sorunsuz çalışır; ileride üç faza geçerseniz aynı cihazı yükseltebilirsiniz. Şarj hızını cihaz değil aracınızın dahili AC şarj ünitesi belirler.",
      },
      {
        q: "İş yeri, otopark ve filo için çözümünüz var mı?",
        a: "Evet. Çok cihazlı kurulumlarda dinamik yük dengeleme abone gücü aşılmadan yükü dağıtır; OCPP 1.6 desteği ile cihazlar şarj yönetim sistemlerine bağlanır. RFID yetkilendirme ile personel ve ziyaretçi kullanımı ayrıştırılabilir.",
      },
      {
        q: "İstanbul'a teslimat ne kadar sürer?",
        a: "Cihazlar Bursa'daki üretim tesisimizden sevk edilir. Güncel teslim süresi ürüne ve stok durumuna göre değiştiği için, ilgilendiğiniz modeli belirtip bayimizden ya da doğrudan bizden teyit almanızı öneririz.",
      },
    ],
  },
  {
    slug: "ankara-ev-sarj-istasyonu",
    city: "Ankara",
    loc: "Ankara'da",
    region: "Ankara",
    linkLabel: "Ankara Elektrikli Araba Şarj Cihazı",
    dealerCityId: "ankara",
    showcaseCategories: ["wallbox", "portable", "cables"],
    title: "Ankara Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    h1: "Ankara Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    eyebrow: "Ankara · Yetkili Bayi Ağı",
    intro:
      "Elektrikli araba şarj cihazınızı Ankara'daki yetkili bayilerimizden alın. Bemis E-V Charge, cihazlarını Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² tesisinde kendi üreten yerli bir markadır; Ankara'daki yetkili bayilerimiz satış, keşif ve kurulum yönlendirmesini yürütür. Ev tipi wallbox, taşınabilir şarj cihazı ve Type 2 kablo tek noktadan temin edilir.",
    localPitch:
      "Kurum, filo ve çok araçlı otopark kurulumlarında tek cihazın gücü değil, binanın toplam kapasitesi belirleyicidir. Dinamik yük dengeleme, abone gücü aşılmadan yükü cihazlar arasında dağıtır; OCPP 1.6 desteği cihazları şarj yönetim sistemlerine bağlar, RFID yetkilendirme ise kimin kullanabileceğini tanımlar. Kaç soket, hangi güç kademesi ve hangi ölçüm düzeni gerektiğini yetkili bayimizle birlikte keşifte netleştiriyoruz.",
    metaDescription:
      "Ankara elektrikli araba şarj cihazı — yetkili bayilerimizden alın. Ev tipi wallbox (3,7–22 kW), taşınabilir şarj cihazı, Type 2 kablo. Yerli üretim, CE, IP65, OCPP.",
    keywords: [
      "ankara elektrikli araba şarj cihazı",
      "elektrikli araba şarj cihazı ankara",
      "ankara ev şarj istasyonu",
      "ankara ev şarj cihazı",
      "ankara wallbox",
      "ankara araç şarj istasyonu kurulumu",
      "ankara kurumsal şarj istasyonu",
    ],
    faq: [
      {
        q: "Ankara'da elektrikli araba şarj cihazını nereden alabilirim?",
        a: "Ankara'daki yetkili bayilerimizden temin edebilirsiniz; bu sayfada bayilerimizin adı, adresi ve iletişim bilgisi listelenir. Cihazlar Bursa'daki kendi tesisimizde üretilir; satış ve kurulum keşfi bayimiz üzerinden yürür.",
      },
      {
        q: "Kurum, filo ve iş yeri otoparkı için toplu kurulum yapıyor musunuz?",
        a: "Evet. Çok cihazlı kurulumlarda dinamik yük dengeleme abone gücü aşılmadan yükü dağıtır, OCPP 1.6 desteği cihazları şarj yönetim sistemlerine bağlar ve RFID yetkilendirme kullanımı tanımlı kişilerle sınırlar. Ölçüm bazlı paylaştırma gerekiyorsa MID sayaçlı sürümler kullanılır.",
      },
      {
        q: "Ankara'da kurulum ve keşif nasıl ilerliyor?",
        a: "Kurulum, bölgenizdeki yetkili bayimiz tarafından yapılır. Bayi keşifte mevcut panoyu, hat mesafesini ve kablo güzergâhını değerlendirir. Hat çekimi ve pano işleri cihaz fiyatına dahil değildir; keşif sonrası ayrı teklif verilir.",
      },
      {
        q: "Cihaz kışın soğukta da çalışır mı?",
        a: "Cihazlarımız IP65 koruma sınıfındadır ve dış mekân kullanımına uygundur. Soğukta şarj hızındaki düşüş cihazdan değil aracın batarya yönetiminden kaynaklanır; batarya ısınana kadar araç daha düşük akım çeker. Planlı şarj özelliğiyle şarjı ucuz tarife saatlerine alabilirsiniz.",
      },
      {
        q: "Hangi güç kademesini seçmeliyim?",
        a: "Önce tesisatınızın tek fazlı mı üç fazlı mı olduğunu ve aracınızın dahili AC şarj limitini öğrenin. Tek fazda pratik üst sınır 7,4 kW'tır; üç fazlı tesisatta aracın sınırına kadar çıkılır. Aracınız 11 kW ile sınırlıysa 22 kW'lık cihaz daha hızlı şarj etmez — cihazımızın gücü 3,7 – 22 kW arasında ayarlanabildiği için tesisatınıza göre kısılır.",
      },
      {
        q: "Ankara'ya teslimat ne kadar sürer?",
        a: "Cihazlar Bursa'daki üretim tesisimizden sevk edilir. Teslim süresi ürüne ve stok durumuna göre değiştiği için, ilgilendiğiniz modeli belirterek bayimizden ya da doğrudan bizden teyit almanızı öneririz.",
      },
    ],
  },
  {
    slug: "izmir-ev-sarj-istasyonu",
    city: "İzmir",
    loc: "İzmir'de",
    region: "İzmir",
    linkLabel: "İzmir Elektrikli Araba Şarj Cihazı",
    dealerCityId: "izmir",
    showcaseCategories: ["wallbox", "portable", "cables"],
    title: "İzmir Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    h1: "İzmir Elektrikli Araba Şarj Cihazı ve Şarj İstasyonu",
    eyebrow: "İzmir · Yetkili Bayi Ağı",
    intro:
      "Elektrikli araba şarj cihazınızı İzmir'deki yetkili bayilerimizden alın. Bemis E-V Charge cihazları Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² kendi tesisimizde üretilir; İzmir'deki yetkili bayilerimiz satış, keşif ve kurulum yönlendirmesini yürütür. Ev tipi wallbox, taşınabilir şarj cihazı ve Type 2 şarj kablosu tek noktadan temin edilir.",
    localPitch:
      "Müstakil ev ve villa kurulumlarında cihazın konumu kadar hattın uzunluğu da önem taşır: pano ile aracın park ettiği nokta arasındaki mesafe kablo kesitini ve dolayısıyla işin maliyetini belirler. Çatısında güneş paneli olan bir evde şarjı gündüz üretim saatlerine almak mümkündür; cihazlarımızın planlı şarj özelliği bunu kolaylaştırır, gücü 3,7 – 22 kW arasında kısarak mevcut tesisata uydurabilirsiniz. Doğru kurulumu yetkili bayimiz keşifte birlikte belirler.",
    metaDescription:
      "İzmir elektrikli araba şarj cihazı — yetkili bayilerimizden alın. Ev tipi wallbox (3,7–22 kW), taşınabilir şarj cihazı, Type 2 kablo. Yerli üretim, CE, IP65.",
    keywords: [
      "izmir elektrikli araba şarj cihazı",
      "elektrikli araba şarj cihazı izmir",
      "izmir ev şarj istasyonu",
      "izmir ev şarj cihazı",
      "izmir wallbox",
      "izmir araç şarj istasyonu kurulumu",
      "izmir müstakil ev şarj cihazı",
    ],
    faq: [
      {
        q: "İzmir'de elektrikli araba şarj cihazını nereden alabilirim?",
        a: "İzmir'deki yetkili bayilerimizden temin edebilirsiniz; bu sayfada bayilerimizin adı, adresi ve iletişim bilgisi listelenir. Cihazlar Bursa'daki kendi tesisimizde üretilir; satış ve kurulum keşfi bayimiz üzerinden yürür.",
      },
      {
        q: "Müstakil evime şarj cihazı taktırmak için ne gerekiyor?",
        a: "Cihazın bağlanacağı hattın uygun kesitte kablo, kendi sigortası ve kaçak akım koruması ile çekilmesi gerekir; bu iş yetkili bir elektrikçi tarafından kurulum şartnamesine uygun yapılmalıdır. Pano ile aracın park ettiği nokta arasındaki mesafe kablo kesitini ve maliyeti doğrudan etkiler, bu yüzden keşif önemlidir.",
      },
      {
        q: "Güneş enerjisiyle elektrikli aracımı şarj edebilir miyim?",
        a: "Evet, çatı üretiminiz varsa şarjı gündüz üretim saatlerine almak mümkündür. Cihazlarımızın planlı şarj özelliğiyle şarj saatini belirleyebilir, gücü 3,7 – 22 kW aralığında kısarak mevcut tesisatınıza ve üretim kapasitenize uydurabilirsiniz. Sistem tasarımı için tesisatınızı bilen bir uzmana danışmanızı öneririz.",
      },
      {
        q: "Yazlıkta veya farklı adreste kullanmak için taşınabilir cihaz uygun mu?",
        a: "Sabit kurulum istemediğiniz durumlarda taşınabilir (seyyar) şarj cihazı prize takılarak kullanılır ve montaj gerektirmez. Şarj hızı prizin ve aracın sınırıyla belirlenir; düzenli günlük şarj için duvar tipi cihaz daha uygundur.",
      },
      {
        q: "Cihaz dış mekânda, açık otoparkta durabilir mi?",
        a: "Evet. Cihazlarımız IP65 koruma sınıfındadır; toz ve suya karşı korumalıdır ve dış mekân kullanımına uygundur. Doğrudan güneş altında kalacaksa gölgeleme, kablonun yerde sürtünmeyeceği bir askı düzeniyle birlikte planlanmalıdır.",
      },
      {
        q: "İzmir'e teslimat ne kadar sürer?",
        a: "Cihazlar Bursa'daki üretim tesisimizden sevk edilir. Teslim süresi ürüne ve stok durumuna göre değiştiği için, ilgilendiğiniz modeli belirterek bayimizden ya da doğrudan bizden teyit almanızı öneririz.",
      },
    ],
  },
];

export const getCityPage = (slug: string): CityPage | undefined =>
  CITY_PAGES.find((c) => c.slug === slug);
