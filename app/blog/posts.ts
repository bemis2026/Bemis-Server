// Blog içeriği — şimdilik kod tarafında (hızlı SEO için). İleride istenirse
// admin panele taşınabilir. Hem sunucu (page.tsx metadata/JSON-LD) hem istemci
// (BlogShell) bu modülü import eder; bu yüzden burada İSTEMCİ kodu olmamalı.

export type BlogSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "cta"; text: string; href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;          // H1 + SEO başlık
  description: string;    // meta description (~150-160 karakter)
  excerpt: string;        // liste kartında görünen kısa özet
  category: string;       // "Rehber" / "Teknik" vb.
  datePublished: string;  // ISO "yyyy-mm-dd"
  dateModified?: string;
  readingMinutes: number;
  cover?: string;
  keywords: string[];
  body: BlogSection[];
  faq?: { q: string; a: string }[];
  related?: { label: string; href: string }[]; // ürün/iç linkler
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "turkiye-sehir-sehir-ev-sarj-rehberi",
    title: "Türkiye'de Şehir Şehir EV Şarj: İstanbul, Ankara, İzmir, Bursa",
    description:
      "İstanbul, Ankara, İzmir ve Bursa'da elektrikli araç şarjı: şehir içi AC kurulum, ev ve iş yeri şarj istasyonu, doğru cihaz seçimi. Yerli üretim Bemis E-V Charge rehberi.",
    excerpt:
      "Hangi şehirde elektrikli araç şarjı nasıl planlanır? İstanbul, Ankara, İzmir ve Bursa için ev ve iş yeri şarj istasyonu, AC kurulum ve cihaz seçimi rehberi.",
    category: "Rehber",
    datePublished: "2026-06-14",
    readingMinutes: 7,
    keywords: ["istanbul ev şarj istasyonu", "ankara ev şarj", "izmir ev şarj istasyonu", "bursa ev şarj", "şehir içi elektrikli araç şarj", "ev tipi şarj istasyonu kurulumu"],
    body: [
      { type: "p", text: "Elektrikli araç sayısı arttıkça en çok sorulan sorulardan biri şu: kendi şehrimde şarjı nasıl çözerim? İstanbul, Ankara, İzmir ve Bursa, Türkiye'de en çok elektrikli araç ve en yoğun şarj ihtiyacı olan illerin başında geliyor. Bu rehberde dört şehir için ev ve iş yeri tarafında nelere dikkat etmeniz gerektiğini, doğru AC şarj cihazını nasıl seçeceğinizi ve yerli üretimin avantajlarını anlatıyoruz." },
      { type: "h2", text: "Şehir içi şarjda temel mantık: günlük şarj evde veya iş yerinde olur" },
      { type: "p", text: "Halka açık DC hızlı şarj istasyonları uzun yol için idealdir; ama günlük kullanımda en ekonomik ve pratik yöntem, aracı park ettiğiniz yerde — evde veya iş yerinde — AC duvar tipi (wallbox) cihazla şarj etmektir. Gece boyunca yavaş ve güvenli şarj, sabah dolu araç demektir; istasyon aramak ve kuyrukta beklemek ortadan kalkar. Bu yüzden şehir hangisi olursa olsun ilk adım, kendi otoparkınıza bir AC şarj noktası kurmaktır." },
      { type: "h2", text: "İstanbul" },
      { type: "p", text: "İstanbul, Türkiye'de en yüksek elektrikli araç yoğunluğuna sahip şehir. Apartman ve site otoparklarının çokluğu nedeniyle en sık karşılaşılan ihtiyaç, ortak otoparka bireysel veya yönetim onaylı şarj noktası kurulumudur. Site yönetimiyle elektrik altyapısı ve faturalandırma (OCPP destekli yük yönetimi) konuşulduğunda kurulum sorunsuz ilerler." },
      { type: "h2", text: "Ankara" },
      { type: "p", text: "Ankara'da müstakil ve villa tipi konutların yanı sıra geniş iş yeri ve kampüs otoparkları yaygındır. Müstakil otoparkta 7,4–22 kW AC wallbox doğrudan kurulabilir; iş yeri ve kamu kampüslerinde ise çoklu kurulum ve uzaktan izleme öne çıkar." },
      { type: "h2", text: "İzmir" },
      { type: "p", text: "İzmir'de site otoparkları ve ticari tesisler (otel, AVM, plaza) şarj noktası talebini artırıyor. Sahil ve nem koşulları nedeniyle IP65/IP66 koruma sınıfı cihaz tercih etmek, dış mekân kurulumlarında uzun ömür sağlar." },
      { type: "h2", text: "Bursa" },
      { type: "p", text: "Bursa, hem sanayi hem konut tarafında hızla büyüyen bir EV şehri. Üretim merkezimiz Bursa'da olduğu için cihaz, kurulum desteği ve yedek parçaya en hızlı eriştiğiniz şehir Bursa'dır. Bursa'ya özel ayrıntılar için Bursa EV şarj sayfamıza göz atabilirsiniz." },
      { type: "cta", text: "Bursa'da elektrikli araç şarjı: yerel üretici avantajı, ürünler ve kurulum desteği.", href: "/bursa-ev-sarj-istasyonu", label: "Bursa EV Şarj İstasyonu" },
      { type: "h2", text: "Hangi cihazı seçmeliyim?" },
      { type: "ul", items: [
        "Ev için: tek araç, gece şarjı → 7,4–11 kW AC wallbox çoğu kullanıma yeter.",
        "Üç fazlı tesisat varsa: 22 kW ile daha hızlı şarj mümkün.",
        "Site ve iş yeri: çoklu kurulum + OCPP yük yönetimi + kullanıcı bazlı faturalandırma.",
        "Dış mekân: IP65/IP66 koruma sınıfı ve sağlam gövde şart.",
      ]},
      { type: "p", text: "Şehir fark etmeksizin doğru cihazı seçmenin ayrıntılı kriterlerini ayrı rehberimizde bulabilirsiniz." },
      { type: "cta", text: "Ev ve iş yeri için yerli üretim AC Wallbox modellerini inceleyin.", href: "/products/wallbox", label: "AC Wallbox Modelleri" },
      { type: "h2", text: "Neden yerli üretici?" },
      { type: "p", text: "Cihazı doğrudan üreticisinden almak; hızlı teknik destek, yedek parça ve aracı/ithalat marjı olmadan uygun fiyat demektir. Bemis E-V Charge, Bursa'daki tesisinde donanımdan yazılıma kadar üreten yerli bir markadır; 60+ ülkeye ihracat tecrübesi ve CE, IP65/IP66, OCPP uyumlu cihazlarıyla dört şehirde ve tüm Türkiye'de yanınızdadır." },
    ],
    faq: [
      { q: "Hangi şehirde elektrikli araç şarjı en kolay?", a: "Şehir fark etmeksizin en kolay ve ekonomik yöntem, aracı park ettiğiniz yere (ev veya iş yeri) bir AC wallbox kurmaktır. İstanbul, Ankara, İzmir ve Bursa'da bireysel ve kurumsal kurulumlar yaygındır." },
      { q: "Sitemde veya apartmanımda şarj istasyonu kurabilir miyim?", a: "Evet. Ortak otoparkta yönetim onayı ve uygun elektrik altyapısıyla, OCPP destekli yük yönetimli kurulum yapılabilir; kullanıcı bazlı faturalandırma mümkündür." },
      { q: "Bursa'da kurulum neden avantajlı?", a: "Üretim merkezimiz Bursa'da olduğu için cihaz, kurulum desteği ve yedek parçaya en hızlı erişim Bursa'dadır." },
    ],
    related: [
      { label: "Bursa EV Şarj İstasyonu", href: "/bursa-ev-sarj-istasyonu" },
      { label: "Ev Şarj İstasyonu Maliyeti", href: "/blog/ev-sarj-istasyonu-maliyeti" },
      { label: "Şarj Cihazı Nasıl Seçilir?", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },
  {
    slug: "ev-sarj-istasyonu-maliyeti",
    title: "Ev Şarj İstasyonu Maliyeti: Fiyatı Belirleyen 6 Faktör",
    description:
      "Ev tipi elektrikli araç şarj istasyonu maliyeti neye göre değişir? Cihaz gücü, kablo, akıllı özellikler, koruma sınıfı, kurulum ve elektrik gideri — yerli üretimin avantajı.",
    excerpt:
      "Ev şarj istasyonu maliyeti cihazdan kuruluma kadar nelere bağlı? Fiyatı belirleyen faktörleri ve yerli üretimin avantajını sade bir rehberde topladık.",
    category: "Rehber",
    datePublished: "2026-06-14",
    readingMinutes: 6,
    keywords: ["ev şarj istasyonu maliyeti", "ev şarj cihazı fiyatı", "elektrikli araç şarj maliyeti", "wallbox fiyatı", "evde şarj elektrik gideri"],
    body: [
      { type: "p", text: "Ev tipi elektrikli araç şarj istasyonu maliyeti tek bir rakamla özetlenemez; çünkü cihazın gücünden tesisatın durumuna kadar birçok faktöre bağlıdır. Bu rehberde fiyatı belirleyen ana başlıkları sade bir dille açıklıyor, bütçenizi doğru planlamanız için nelere dikkat etmeniz gerektiğini anlatıyoruz. Güncel fiyat ve teklif için ürün sayfamızdan bize ulaşabilirsiniz." },
      { type: "h2", text: "1) Cihazın gücü (kW)" },
      { type: "p", text: "Şarj cihazları tipik olarak 7,4 kW (tek faz) ile 22 kW (üç faz) arasında değişir. Daha yüksek güç daha hızlı şarj demektir ama tesisatınızın üç fazlı olmasını gerektirir. Çoğu ev kullanıcısı için 7,4–11 kW gece şarjında fazlasıyla yeterlidir; gereğinden yüksek güç hem cihaz hem altyapı maliyetini artırır." },
      { type: "h2", text: "2) Kablolu mu, soketli mi?" },
      { type: "p", text: "Sabit kablolu modeller pratiktir — kabloyu takıp şarja başlarsınız. Soketli modellerde kabloyu ayrı taşırsınız; farklı araçlar için esneklik sağlar. Kablo uzunluğu ve kalitesi de toplam maliyeti etkiler." },
      { type: "h2", text: "3) Akıllı özellikler (OCPP, uygulama, yük yönetimi)" },
      { type: "p", text: "Temel bir cihaz sadece şarj eder; akıllı bir cihaz uygulamadan kontrol, kullanıcı tanımlama (RFID), uzaktan izleme ve OCPP ile yük yönetimi sunar. Site ve iş yeri kurulumlarında bu özellikler kullanıcı bazlı faturalandırma için gereklidir ve cihaz sınıfını belirler." },
      { type: "h2", text: "4) Koruma sınıfı (IP65 / IP66)" },
      { type: "p", text: "Dış mekâna kurulacak bir cihazın toz ve suya karşı yüksek koruma sınıfında (IP65/IP66) olması şarttır. Düşük korumalı ucuz cihazlar dış mekânda kısa ömürlü olur ve uzun vadede daha pahalıya gelir." },
      { type: "h2", text: "5) Kurulum ve elektrik altyapısı" },
      { type: "p", text: "Cihaz fiyatının yanında kurulum kalemini de hesaba katın: panodan cihaza kablo çekimi, kaçak akım rölesi (RCD), sigorta ve gerekiyorsa pano güçlendirmesi. Otoparkın panoya uzaklığı ve mevcut tesisatın durumu, kurulum maliyetini en çok etkileyen unsurdur." },
      { type: "h2", text: "6) Üreticiden mi, aracıdan mı?" },
      { type: "p", text: "Cihazı doğrudan üreticisinden almak, aradaki ithalat ve aracı marjını ortadan kaldırarak maliyeti düşürür; ayrıca servis ve yedek parçada beklemezsiniz. Bemis E-V Charge, Bursa'daki tesisinde donanımdan yazılıma kadar üreten yerli bir markadır — bu da hem fiyat hem destek tarafında avantaj sağlar." },
      { type: "h2", text: "Peki elektrik gideri ne kadar?" },
      { type: "p", text: "Cihaz tek seferlik bir yatırımdır; asıl tekrar eden gider şarj için harcanan elektriktir. Aracınızın 100 km'de tükettiği kWh ile evdeki birim elektrik fiyatını çarparak yaklaşık km maliyetinizi bulabilirsiniz. Evde gece şarjı, halka açık DC hızlı şarja göre genellikle belirgin biçimde daha ekonomiktir." },
      { type: "cta", text: "Ev ve iş yeri için yerli üretim AC Wallbox modellerini inceleyin, teklif alın.", href: "/products/wallbox", label: "AC Wallbox Modelleri" },
    ],
    faq: [
      { q: "Ev şarj istasyonu ne kadar?", a: "Tek bir rakam vermek doğru olmaz; fiyat cihazın gücüne (7,4–22 kW), kablolu/soketli oluşuna, akıllı özelliklerine, koruma sınıfına ve kurulum koşullarına göre değişir. Güncel fiyat ve teklif için ürün sayfamızdan bize ulaşabilirsiniz." },
      { q: "Evde şarj mı, dışarıda hızlı şarj mı daha ucuz?", a: "Günlük kullanımda evde gece AC şarjı, halka açık DC hızlı şarja göre genellikle daha ekonomiktir; DC hızlı şarj uzun yol için idealdir." },
      { q: "Kaç kW cihaz almalıyım?", a: "Çoğu ev kullanıcısı için 7,4–11 kW yeterlidir. 22 kW için üç fazlı tesisat gerekir; ihtiyacınızdan fazla güç gereksiz maliyet demektir." },
    ],
    related: [
      { label: "Şehir Şehir EV Şarj Rehberi", href: "/blog/turkiye-sehir-sehir-ev-sarj-rehberi" },
      { label: "Şarj Cihazı Nasıl Seçilir?", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
      { label: "AC mı DC mi?", href: "/blog/ac-dc-sarj-farki" },
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },
  {
    slug: "ioniq-5-v2l-nasil-kullanilir",
    title: "Ioniq 5 ile V2L Nasıl Kullanılır? V2L / C2L Adaptör Rehberi",
    description:
      "Ioniq 5 V2L özelliği nedir, kaç kW güç verir, V2L/C2L adaptörü nasıl kullanılır? Aracınızı seyyar prize çeviren adaptör rehberi — kamp, elektrikli alet ve acil durum.",
    excerpt:
      "Elektrikli aracınızın bataryasını seyyar bir elektrik kaynağına çevirin: V2L nedir, Ioniq 5'te kaç kW güç alırsınız ve doğru V2L/C2L adaptörünü nasıl seçersiniz?",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 6,
    keywords: ["ioniq 5 v2l", "v2l nedir", "c2l adaptör", "v2l adaptör", "araçtan elektrik", "vehicle to load"],
    body: [
      { type: "p", text: "Elektrikli araçların en çok konuşulan ama en az kullanılan özelliklerinden biri V2L (Vehicle-to-Load). Kısaca: aracınızın yüksek kapasiteli bataryasını, tıpkı dev bir taşınabilir güç istasyonu gibi kullanarak dışarıdan elektrikli cihazları besleyebilirsiniz. Bu rehberde V2L'nin ne olduğunu, Hyundai Ioniq 5 örneğinde nasıl çalıştığını ve doğru V2L/C2L adaptörünü nasıl seçeceğinizi anlatıyoruz." },

      { type: "h2", text: "V2L nedir?" },
      { type: "p", text: "V2L (Vehicle-to-Load), elektrikli aracın sürüş bataryasındaki enerjiyi standart şebeke gerilimine (230V) çevirip dış cihazlara aktarmasıdır. Yani araç, bir tüketici olmaktan çıkıp bir elektrik kaynağına dönüşür. Kamp alanında buzdolabı, şantiyede matkap, piknikte ızgara, hatta kısa elektrik kesintilerinde evdeki kritik cihazlar bu enerjiyle çalışabilir." },

      { type: "h2", text: "Ioniq 5 V2L kaç kW güç verir?" },
      { type: "p", text: "Hyundai Ioniq 5 (E-GMP platformu) iki noktadan V2L sunar: kabin içinde, arka koltukların altındaki 230V priz ve dışarıda şarj soketine takılan bir V2L adaptörü üzerinden çıkış. Toplamda yaklaşık 3,6 kW'a kadar güç çekebilirsiniz — bu, aynı anda bir buzdolabı + birkaç aydınlatma + küçük elektrikli aletleri rahatça besler. Araç kontak kapalıyken bile çıkış verebilir; sistem belirli bir batarya seviyesinin altına inince kendini korur." },
      { type: "quote", text: "3,6 kW pratikte ne demek? Tipik bir ev tipi prizden (Schuko) çekebileceğiniz gücün üzerinde — kamp, saha ve acil durum için fazlasıyla yeterli." },

      { type: "h2", text: "V2L / C2L adaptörü ne işe yarar?" },
      { type: "p", text: "Aracın dış çıkışını kullanmak için şarj soketine (Type 2 / CCS) takılan bir adaptöre ihtiyacınız olur. Bu adaptör soketteki çıkışı standart topraklı prize (Schuko) çevirir; siz de cihazınızı doğrudan takarsınız. Bemis'in V2L/C2L adaptör ailesi tam olarak bunu yapar: sağlam gövde, topraklı priz ve güvenli kilitleme ile aracınızı sahada seyyar bir enerji kaynağına dönüştürür." },
      { type: "ul", items: [
        "Şarj soketine tak — saniyeler içinde hazır, ek kurulum yok.",
        "Topraklı standart priz çıkışı — cihazlarınızı doğrudan bağlayın.",
        "Taşınabilir: bagajda taşıyın, her yerde elektrik.",
        "Ioniq 5, Kia EV6 ve V2L destekleyen diğer araçlarla uyumlu.",
      ]},

      { type: "h2", text: "Nerelerde kullanılır?" },
      { type: "ul", items: [
        "Kamp & karavan: buzdolabı, aydınlatma, kahve makinesi, telefon/laptop şarjı.",
        "Saha & şantiye: matkap, taşlama, küçük kompresör gibi elektrikli el aletleri.",
        "Acil durum: kısa elektrik kesintilerinde buzdolabı ve modem gibi kritik cihazlar.",
        "Etkinlik & piknik: ses sistemi, ızgara, projeksiyon.",
        "İmdat: başka bir elektrikli aracı veya cihazı düşük güçte besleme.",
      ]},

      { type: "h2", text: "Güvenli kullanım için 5 ipucu" },
      { type: "ul", items: [
        "Toplam gücü aşmayın: bağladığınız cihazların toplam watt değeri aracın V2L limitinin altında kalsın.",
        "Topraklı priz kullanın ve adaptörü kuru tutun; dış mekânda yağmurdan koruyun.",
        "Yüksek kalkış akımı çeken cihazlarda (kompresör, motor) ani yük dalgalanmasına dikkat edin.",
        "Uzun kullanımda batarya seviyesini takip edin; aracınız belirli eşikte çıkışı otomatik keser.",
        "Kaliteli, sertifikalı adaptör tercih edin — ucuz adaptörler ısınma ve güvenlik riski taşır.",
      ]},

      { type: "h2", text: "Hangi araçlarda V2L var?" },
      { type: "p", text: "V2L'yi yaygınlaştıran modellerin başında Hyundai Ioniq 5 ve Kia EV6 (E-GMP) gelir. Togg, bazı MG, BYD ve diğer yeni nesil elektrikli araçlar da farklı güç seviyelerinde V2L sunar. Aracınızın V2L gücünü ve gerekli adaptör tipini kullanım kılavuzundan teyit edin; çoğu durumda Type 2 soketine uygun bir adaptör yeterlidir." },

      { type: "cta", text: "Aracınıza uygun V2L / C2L adaptörünü inceleyin — Bemis yerli üretim, sertifikalı.", href: "/products/v2l-c2l", label: "V2L / C2L Adaptörleri Gör" },
    ],
    faq: [
      { q: "Ioniq 5 V2L kaç kW güç verir?", a: "Ioniq 5, kabin içi 230V priz ve dış şarj soketine takılan V2L adaptörü üzerinden toplam yaklaşık 3,6 kW'a kadar güç sağlar." },
      { q: "V2L adaptörü ne işe yarar?", a: "Aracın şarj soketindeki (Type 2 / CCS) çıkışı standart topraklı prize (Schuko) çevirir; böylece elektrikli cihazlarınızı doğrudan araca bağlayıp çalıştırabilirsiniz." },
      { q: "C2L ile V2L arasındaki fark nedir?", a: "V2L aracın enerji verme özelliğinin genel adıdır; C2L/V2L adaptörü ise bu çıkışı pratikte kullanılabilir bir prize dönüştüren donanımdır. İkisi birlikte çalışır." },
      { q: "Hangi araçlarda V2L bulunur?", a: "Başta Hyundai Ioniq 5 ve Kia EV6 olmak üzere E-GMP araçları; ayrıca Togg ve bazı yeni nesil MG/BYD modelleri farklı güç seviyelerinde V2L sunar." },
    ],
    related: [
      { label: "V2L / C2L Adaptörler", href: "/products/v2l-c2l" },
      { label: "AC Şarj Kabloları (Type 2)", href: "/products/cables" },
      { label: "Tüm Ürünler", href: "/products" },
    ],
  },

  {
    slug: "ac-dc-sarj-farki",
    title: "AC ve DC Şarj Arasındaki Fark Nedir? Ev ve İstasyon Rehberi",
    description:
      "AC şarj ile DC hızlı şarj arasındaki fark nedir, hangisi ne zaman kullanılır, ev için hangisi uygun? Güç, hız, maliyet ve donanım farklarını sade anlatıyoruz.",
    excerpt:
      "AC mı DC mi? İkisinin nasıl çalıştığını, hız ve maliyet farkını ve ev/istasyon için hangisinin doğru olduğunu basitçe açıklıyoruz.",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 5,
    keywords: ["ac dc şarj farkı", "ac şarj nedir", "dc hızlı şarj", "elektrikli araç şarj türleri"],
    body: [
      { type: "p", text: "Elektrikli araç şarjında en sık karışan konu AC ve DC ayrımıdır. İkisi de aynı amaca hizmet eder — bataryayı doldurmak — ama çalışma şekilleri, hızları ve kullanım yerleri tamamen farklıdır. Bu rehber, doğru cihazı seçebilmeniz için ikisini sade bir dille karşılaştırıyor." },

      { type: "h2", text: "AC şarj nedir?" },
      { type: "p", text: "AC (alternatif akım) şarjda elektrik şebekeden araca alternatif akım olarak gelir; aracın içindeki 'on-board charger' (dahili şarj ünitesi) bunu bataryanın kullanabileceği doğru akıma (DC) çevirir. Yani dönüşüm aracın içinde olur. Bu yüzden AC şarj hızı, aracın dahili şarj ünitesinin kapasitesiyle sınırlıdır — tipik olarak 7,4 kW (tek faz) ile 11–22 kW (üç faz) arası." },
      { type: "h3", text: "Nerede kullanılır?" },
      { type: "p", text: "Ev, iş yeri, otopark, AVM gibi aracın uzun süre park ettiği yerler. Donanımı görece basit ve uygun maliyetlidir; günlük kullanımda gece boyu şarj için idealdir." },

      { type: "h2", text: "DC hızlı şarj nedir?" },
      { type: "p", text: "DC (doğru akım) şarjda dönüşüm istasyonun içinde yapılır; cihaz şebekedeki AC'yi DC'ye çevirip doğrudan bataryaya verir, aracın dahili şarj ünitesini baypas eder. Bu nedenle çok daha yüksek güçlere çıkabilir (50 kW'tan 350 kW'a kadar) ve bataryayı dakikalar içinde önemli oranda doldurur." },
      { type: "h3", text: "Nerede kullanılır?" },
      { type: "p", text: "Otoyol dinlenme tesisleri, şehir içi hızlı şarj noktaları, filo ve ticari işletmeler. Donanım daha karmaşık ve maliyetlidir; 'yola devam etmek için 20 dakikada hızlı dolum' senaryosuna uygundur." },

      { type: "h2", text: "Özet karşılaştırma" },
      { type: "ul", items: [
        "Dönüşüm yeri: AC → araçta · DC → istasyonda.",
        "Hız: AC 7,4–22 kW · DC 50–350+ kW.",
        "Maliyet: AC uygun · DC yüksek.",
        "Kullanım: AC ev/iş yeri (uzun park) · DC yol/ticari (hızlı dolum).",
        "Batarya ömrü: günlük AC şarj daha naziktir; DC'yi gerektiğinde kullanmak idealdir.",
      ]},

      { type: "quote", text: "Pratik kural: Her gün evde/işte AC ile yavaş ve ucuz şarj edin; uzun yolda DC hızlı şarjı kullanın." },

      { type: "h2", text: "Ev için hangisi?" },
      { type: "p", text: "Evde neredeyse her zaman doğru tercih bir AC Wallbox'tır: aracınız gece park halindeyken sabaha kadar dolar, donanım ve kurulum maliyeti makuldür. DC hızlı şarj evde hem çok pahalı hem de gereksizdir. Bemis'in AC Wallbox ve taşınabilir şarj cihazları tam da bu günlük kullanım için tasarlanmıştır." },

      { type: "cta", text: "Ev ve iş yeri için AC Wallbox modellerini inceleyin — yerli üretim, OCPP uyumlu.", href: "/products/wallbox", label: "AC Wallbox Modelleri" },
    ],
    faq: [
      { q: "AC ve DC şarj arasındaki temel fark nedir?", a: "AC şarjda akım dönüşümü aracın içinde yapılır ve hız aracın dahili şarj ünitesiyle sınırlıdır (7,4–22 kW). DC şarjda dönüşüm istasyonda yapılır, çok daha hızlıdır (50–350+ kW)." },
      { q: "Ev için AC mı DC mi almalıyım?", a: "Ev için AC Wallbox doğru tercihtir; gece boyu uygun maliyetle şarj eder. DC hızlı şarj ev için hem gereksiz hem çok pahalıdır." },
      { q: "DC hızlı şarj bataryaya zarar verir mi?", a: "Ara sıra DC kullanımı sorun değildir; ancak her gün yalnızca DC ile şarj etmek yerine günlük AC şarjı tercih etmek batarya sağlığı için daha iyidir." },
    ],
    related: [
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "DC Şarj Üniteleri", href: "/products/dc-units" },
      { label: "AC Şarj Kabloları", href: "/products/cables" },
    ],
  },

  {
    slug: "ev-icin-sarj-cihazi-nasil-secilir",
    title: "Ev İçin Elektrikli Araç Şarj Cihazı Nasıl Seçilir?",
    description:
      "Ev tipi elektrikli araç şarj cihazı seçerken güç (7,4/11/22 kW), prizli mi kablolu mu, akıllı özellikler ve güvenlik sertifikalarına nasıl bakılır? Pratik seçim rehberi.",
    excerpt:
      "Kaç kW? Prizli mi kablolu mu? Akıllı özellikler ve güvenlik neden önemli? Ev tipi şarj cihazı seçimini adım adım anlatıyoruz.",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 6,
    keywords: ["ev şarj cihazı seçimi", "ev tipi şarj cihazı", "kaç kw şarj cihazı", "wallbox seçimi", "prizli kablolu şarj"],
    body: [
      { type: "p", text: "Elektrikli araç aldıktan sonraki ilk soru genellikle aynı: \"Eve hangi şarj cihazını alayım?\" Doğru cihaz, aracınızı her sabah dolu teslim alırken yıllarca sorunsuz çalışır; yanlış cihaz ise hem yavaş şarj hem güvenlik riski demektir. İşte ev tipi şarj cihazı seçerken bakılacak 5 başlık." },

      { type: "h2", text: "1) Güç: 7,4 kW mı, 11/22 kW mı?" },
      { type: "p", text: "Güç hem evinizin elektrik altyapısına hem aracınızın dahili şarj kapasitesine bağlıdır. Tek fazlı tesisatta genelde 7,4 kW; üç fazlı tesisatta 11 veya 22 kW mümkündür. Ancak aracınızın dahili şarj ünitesi 11 kW kabul ediyorsa 22 kW cihaz almak ekstra hız getirmez. Çoğu ev kullanıcısı için 7,4–11 kW gece boyu rahat dolum sağlar." },

      { type: "h2", text: "2) Prizli (soketli) mi, kablolu mu?" },
      { type: "ul", items: [
        "Kablolu (tethered): kablo cihaza sabittir; gelip fişi takarsınız, en pratiği.",
        "Prizli (soketli): kablo ayrıdır; farklı araç/kablolarla esneklik sağlar, kablo gerektiğinde değişir.",
        "Apartman/ortak otoparkta prizli model, müstakil garajda kablolu model genelde daha kullanışlıdır.",
      ]},

      { type: "h2", text: "3) Akıllı özellikler" },
      { type: "p", text: "OCPP uyumu (uzaktan yönetim/şarj ağına bağlanabilme), mobil uygulama, zamanlı şarj (ucuz gece tarifesinde başlatma), yük yönetimi (evin sigortasını zorlamadan dengeli şarj) ve kullanıcı yetkilendirme (RFID) cihazı bugünden yarına taşır. Bemis cihazları OCPP uyumlu tasarlanır." },

      { type: "h2", text: "4) Güvenlik ve sertifikalar" },
      { type: "ul", items: [
        "CE uygunluk ve ilgili IEC standartları (IEC 61851).",
        "Dış mekân için yeterli koruma sınıfı (örn. IP65) — toz ve suya dayanım.",
        "Dahili kaçak akım koruması (RCD / DC leakage) — ayrı pano ekipmanı maliyetini düşürür.",
        "Aşırı akım, aşırı gerilim ve sıcaklık korumaları.",
      ]},

      { type: "h2", text: "5) Kurulum ve marka" },
      { type: "p", text: "Şarj cihazı yetkili bir elektrikçi tarafından, tercihen ayrı bir hat ve uygun koruma ile kurulmalıdır. Yedek parça, garanti ve teknik destek için yerli ve ulaşılabilir bir üretici seçmek uzun vadede fark yaratır. Bemis, Bursa'daki kendi tesisinde üretim yapan yerli bir EV şarj ekipmanı üreticisidir; AC Wallbox, taşınabilir cihazlar, kablolar ve adaptörlerle eksiksiz bir ev ekosistemi sunar." },

      { type: "cta", text: "Eve uygun modeli seçin: Bemis AC Wallbox ve taşınabilir şarj cihazları.", href: "/products/wallbox", label: "Ürünleri İncele" },
    ],
    faq: [
      { q: "Ev için kaç kW şarj cihazı yeterli?", a: "Çoğu ev kullanıcısı için 7,4–11 kW gece boyu rahat dolum sağlar. Üç fazlı tesisat ve uygun araçta 22 kW mümkündür, ancak aracın dahili şarj kapasitesini aşan güç ekstra hız getirmez." },
      { q: "Prizli mi kablolu mu şarj cihazı daha iyi?", a: "Kablolu model en pratiğidir (gel-tak). Prizli model farklı araç ve kablolarla esneklik sağlar; ortak otoparklarda genelde tercih edilir." },
      { q: "Ev tipi şarj cihazında nelere dikkat etmeliyim?", a: "Güç uyumu, prizli/kablolu tercihi, OCPP ve akıllı özellikler, IP65 gibi koruma sınıfı ve dahili kaçak akım koruması, CE sertifikası, yetkili kurulum ve ulaşılabilir yerli üretici desteği." },
    ],
    related: [
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Taşınabilir Şarj Cihazları", href: "/products/portable" },
      { label: "AC Şarj Kabloları", href: "/products/cables" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },

  {
    slug: "togg-v2l-aractan-elektrik",
    title: "Togg ile V2L: Araçtan Elektrik (Araç-Dışı Güç) Kullanımı",
    description:
      "Togg V2L (araçtan elektrik) özelliği nedir, nasıl kullanılır, hangi adaptör gerekir? Togg'unuzu kamp, saha ve acil durumda seyyar güç kaynağına çeviren V2L rehberi.",
    excerpt:
      "Togg'un V2L özelliğiyle aracınızı taşınabilir bir prize çevirin: nasıl çalışır, ne için kullanılır ve hangi V2L adaptörü gerekir?",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 5,
    keywords: ["togg v2l", "togg araçtan elektrik", "v2l adaptör", "togg şarj"],
    body: [
      { type: "p", text: "Yerli otomobil Togg, elektrikli araçların en kullanışlı özelliklerinden biri olan V2L'yi (Vehicle-to-Load / araçtan elektrik) destekler. Bu sayede Togg'unuzun bataryasını dışarıdan elektrikli cihazları beslemek için kullanabilirsiniz. Bu rehber, V2L'nin Togg'da nasıl çalıştığını ve doğru adaptörü nasıl seçeceğinizi anlatıyor." },

      { type: "h2", text: "V2L (araçtan elektrik) nedir?" },
      { type: "p", text: "V2L, aracın sürüş bataryasındaki enerjiyi 230V şebeke gerilimine çevirip dış cihazlara aktarmasıdır. Araç bir tüketici olmaktan çıkar, taşınabilir bir güç istasyonuna dönüşür. Togg ile kamp, saha ve kısa elektrik kesintilerinde cihazlarınızı çalıştırabilirsiniz." },

      { type: "h2", text: "Togg'da V2L nasıl kullanılır?" },
      { type: "p", text: "Aracın şarj soketine (Type 2) takılan bir V2L adaptörü, çıkışı standart topraklı prize (Schuko) çevirir; cihazınızı doğrudan bu prize takarsınız. Adaptör sayesinde ekstra kurulum gerekmez — bagajda taşıyıp her yerde elektrik alırsınız. (Aracınızın V2L gücünü ve önerilen kullanım sınırlarını kullanım kılavuzundan teyit edin.)" },
      { type: "ul", items: [
        "Kamp & karavan: buzdolabı, aydınlatma, telefon/laptop şarjı.",
        "Saha & şantiye: matkap, taşlama gibi elektrikli el aletleri.",
        "Acil durum: kısa kesintilerde buzdolabı ve modem gibi kritik cihazlar.",
        "Etkinlik & piknik: ses sistemi, ızgara, küçük cihazlar.",
      ]},

      { type: "quote", text: "İpucu: Bağladığınız cihazların toplam gücü aracın V2L limitinin altında kalsın; adaptörü kuru tutun ve sertifikalı ürün kullanın." },

      { type: "cta", text: "Togg ve diğer V2L destekli araçlar için uygun adaptörü inceleyin — Bemis yerli üretim.", href: "/products/v2l-c2l", label: "V2L / C2L Adaptörleri Gör" },
    ],
    faq: [
      { q: "Togg V2L'yi destekliyor mu?", a: "Evet, Togg araçtan elektrik (V2L) özelliğini destekler. Şarj soketine takılan bir V2L adaptörü ile dış cihazlarınızı besleyebilirsiniz." },
      { q: "Togg V2L için hangi adaptör gerekir?", a: "Aracın Type 2 şarj soketine uygun bir V2L/C2L adaptörü gerekir; bu adaptör çıkışı standart topraklı prize (Schuko) çevirir." },
      { q: "V2L ile neleri çalıştırabilirim?", a: "Toplam gücü araç limitinin altında kalmak şartıyla buzdolabı, aydınlatma, küçük elektrikli aletler, ses sistemi ve şarj cihazları gibi cihazları çalıştırabilirsiniz." },
    ],
    related: [
      { label: "V2L / C2L Adaptörler", href: "/products/v2l-c2l" },
      { label: "Ioniq 5 V2L Rehberi", href: "/blog/ioniq-5-v2l-nasil-kullanilir" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },

  {
    slug: "ev-sarj-kablosu-secimi-type-2",
    title: "Elektrikli Araç Şarj Kablosu Nasıl Seçilir? (Type 2 Rehberi)",
    description:
      "Type 2 elektrikli araç şarj kablosu seçerken amper (16A/32A), güç (7,4–22 kW), kablo uzunluğu ve kaliteye nasıl bakılır? Yerli üretim şarj kablosu seçim rehberi.",
    excerpt:
      "16A mı 32A mı? Kaç metre? Type 2 şarj kablosu seçerken bakılacak amper, güç, uzunluk ve kalite kriterlerini sade anlatıyoruz.",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 5,
    keywords: ["şarj kablosu", "type 2 şarj kablosu", "ev şarj kablosu seçimi", "elektrikli araç şarj kablosu"],
    body: [
      { type: "p", text: "Elektrikli araç şarj kablosu, aracınızı bir prize ya da istasyona bağlayan en temel ekipmandır. Doğru kablo hem hızlı hem güvenli şarj sağlar; yanlış seçim ise yavaş şarj veya ısınma riski demektir. İşte Type 2 şarj kablosu seçerken bakılacak başlıklar." },

      { type: "h2", text: "Type 2 nedir?" },
      { type: "p", text: "Type 2 (IEC 62196), Avrupa ve Türkiye'de AC şarjın standart konektörüdür. Neredeyse tüm yeni elektrikli araçlar ve AC şarj istasyonları Type 2 kullanır. Mode 3 kablolar, araç ile istasyon arasında güvenli haberleşmeyi de sağlar." },

      { type: "h2", text: "1) Amper ve güç: 16A mı, 32A mı?" },
      { type: "ul", items: [
        "16A: tek fazda ~3,7 kW, üç fazda ~11 kW.",
        "32A: tek fazda ~7,4 kW, üç fazda ~22 kW.",
        "Kablonuzun amperi, aracınızın ve istasyonun desteklediğinin altındaysa şarjı o sınırlar — en yüksek ortak değeri seçin.",
      ]},

      { type: "h2", text: "2) Tek faz mı, üç faz mı?" },
      { type: "p", text: "Üç fazlı kablo (5 telli) daha yüksek güç taşır (11–22 kW); evinizde/istasyonda üç faz varsa ve aracınız destekliyorsa avantajlıdır. Tek fazlı tesisatta tek faz kablo yeterlidir." },

      { type: "h2", text: "3) Uzunluk" },
      { type: "p", text: "5 metre çoğu kullanım için idealdir; aracın park yeri ile soket arası mesafeye göre seçin. Çok uzun kablo taşımayı zorlaştırır, çok kısa kablo esnekliği azaltır." },

      { type: "h2", text: "4) Kalite ve güvenlik" },
      { type: "ul", items: [
        "Dayanıklı, esnek dış kılıf ve sağlam konektör (sık tak-çıkar için).",
        "Doğru sıcaklık ve aşırı akım dayanımı; IEC 62196 / IEC 61851 uyumu.",
        "Yerli ve ulaşılabilir üreticiden alın — garanti ve değişim kolay olsun.",
      ]},

      { type: "quote", text: "Bemis, Type 2 şarj kablolarını kendi tesisinde üreten yerli bir şarj kablo üreticisidir — kalite ve tedarik güvencesiyle." },

      { type: "cta", text: "Aracınıza uygun Type 2 şarj kablosunu seçin — Bemis yerli üretim.", href: "/products/cables", label: "Şarj Kablolarını Gör" },
    ],
    faq: [
      { q: "16A mı 32A şarj kablosu mu almalıyım?", a: "Aracınızın ve istasyonun desteklediği en yüksek ortak değeri seçin. 32A kablo tek fazda 7,4 kW, üç fazda 22 kW'a kadar taşır; 16A ise 3,7/11 kW ile sınırlıdır." },
      { q: "Şarj kablosu kaç metre olmalı?", a: "5 metre çoğu kullanım için idealdir. Aracın park konumu ile prize/istasyona olan mesafeye göre seçin." },
      { q: "Type 2 kablo her araçla uyumlu mu?", a: "Avrupa ve Türkiye'de satılan yeni elektrikli araçların neredeyse tamamı AC şarjda Type 2 kullanır; aracınızın soket tipini teyit etmeniz yeterlidir." },
    ],
    related: [
      { label: "AC Şarj Kabloları (Type 2)", href: "/products/cables" },
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },

  {
    slug: "ocpp-nedir",
    title: "OCPP Nedir? Şarj İstasyonlarında Neden Önemli?",
    description:
      "OCPP (Open Charge Point Protocol) nedir, ne işe yarar, neden önemli? OCPP 1.6J ile uzaktan yönetim, faturalandırma ve marka bağımsızlığı — sade rehber.",
    excerpt:
      "OCPP, şarj istasyonunuzu hangi yazılıma isterseniz bağlamanızı sağlayan açık standarttır. Ne işe yarar ve neden OCPP uyumlu cihaz almalısınız?",
    category: "Teknik",
    datePublished: "2026-06-06",
    readingMinutes: 5,
    keywords: ["ocpp nedir", "ocpp uyumlu şarj cihazı", "ocpp 1.6j", "şarj yönetim sistemi"],
    body: [
      { type: "p", text: "Şarj istasyonu alırken sık karşılaştığınız kısaltma OCPP, cihazınızın geleceğini doğrudan etkiler. Bu yazıda OCPP'nin ne olduğunu, ne işe yaradığını ve neden OCPP uyumlu bir cihaz seçmeniz gerektiğini sade bir dille anlatıyoruz." },

      { type: "h2", text: "OCPP nedir?" },
      { type: "p", text: "OCPP (Open Charge Point Protocol / Açık Şarj Noktası Protokolü), şarj istasyonu ile onu yöneten merkezi yazılım (CSMS — şarj yönetim sistemi) arasındaki açık, standart haberleşme dilidir. Açık standart olması şu demek: cihazınızı tek bir markanın yazılımına mahkûm kalmadan, OCPP destekleyen herhangi bir yönetim sistemine bağlayabilirsiniz." },

      { type: "h2", text: "OCPP ne işe yarar?" },
      { type: "ul", items: [
        "Uzaktan izleme & yönetim: istasyonu uzaktan görün, başlatın/durdurun, arıza alın.",
        "Faturalandırma & yetkilendirme: RFID/uygulama ile kullanıcı tanıma, kullanım başına ücretlendirme.",
        "Uzaktan firmware güncelleme: cihaza gitmeden yazılım güncellemesi.",
        "Yük yönetimi: birden çok istasyonu şebekeyi zorlamadan dengeli çalıştırma.",
        "Roaming: farklı şarj ağları arasında ortak kullanım.",
      ]},

      { type: "h2", text: "Marka bağımsızlığı neden önemli?" },
      { type: "p", text: "OCPP uyumlu olmayan bir cihaz, üreticinin kapalı sistemine bağlıdır; o şirket desteği keserse ya da fiyat artırırsa elinizde seçenek kalmaz. OCPP uyumlu cihaz ise istediğiniz yönetim sistemine taşınabilir — yatırımınızı korur." },

      { type: "h2", text: "OCPP 1.6J ve 2.0.1" },
      { type: "p", text: "Bugün en yaygın sürüm OCPP 1.6J'dir (JSON tabanlı); birçok yönetim sistemiyle uyumludur. OCPP 2.0.1 ise gelişmiş güvenlik ve akıllı şarj özellikleri ekler. Bemis cihazları OCPP 1.6J uyumlu olarak üretilir; böylece açık şarj ekosistemine sorunsuz bağlanır." },

      { type: "cta", text: "OCPP uyumlu Bemis AC Wallbox modellerini inceleyin.", href: "/products/wallbox", label: "OCPP Uyumlu Cihazlar" },
    ],
    faq: [
      { q: "OCPP açılımı nedir?", a: "OCPP, Open Charge Point Protocol (Açık Şarj Noktası Protokolü) demektir; şarj istasyonu ile yönetim sistemi arasındaki açık haberleşme standardıdır." },
      { q: "Neden OCPP uyumlu cihaz almalıyım?", a: "OCPP uyumlu cihaz, tek bir markanın kapalı yazılımına bağlı kalmadan istediğiniz şarj yönetim sistemine bağlanmanızı sağlar; uzaktan yönetim, faturalandırma ve yük yönetimi sunar." },
      { q: "Bemis cihazları OCPP destekliyor mu?", a: "Evet, Bemis'in akıllı modelleri OCPP 1.6J uyumlu olarak üretilir ve açık şarj yönetim sistemlerine bağlanabilir." },
    ],
    related: [
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Şarj Ağı Operatörleri", href: "/operator" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },

  {
    slug: "apartmana-sarj-istasyonu-kurulumu",
    title: "Apartmana / Siteye Elektrikli Araç Şarj İstasyonu Kurulumu",
    description:
      "Apartman ve site otoparkına elektrikli araç şarj istasyonu kurulumu nasıl yapılır? Kat malikleri kararı, elektrik altyapısı, yük yönetimi ve faturalandırma adım adım.",
    excerpt:
      "Sitenizin otoparkına şarj istasyonu mu kuracaksınız? Kat malikleri kararı, altyapı, yük yönetimi ve faturalandırma için bilmeniz gerekenler.",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 6,
    keywords: ["apartmana şarj kurulumu", "siteye şarj istasyonu", "otopark şarj istasyonu", "apartman ev şarj"],
    body: [
      { type: "p", text: "Elektrikli araç sahibi olunca en kritik konu evde şarj edebilmektir. Müstakil garajda bu kolaydır; ama apartman/site otoparkında birkaç ek adım gerekir. İşte sürecin sağlıklı ilerlemesi için bilmeniz gerekenler." },

      { type: "h2", text: "1) Kat malikleri kararı" },
      { type: "p", text: "Ortak alandaki (otopark) kurulum için yönetim/kat malikleri onayı gerekir. Türkiye'de mevzuat, elektrikli araç şarj altyapısı taleplerini kolaylaştıracak yönde gelişmektedir; yine de kurulumdan önce yönetimle görüşüp gerekli kararı almak en doğrusudur." },

      { type: "h2", text: "2) Elektrik altyapısı" },
      { type: "p", text: "Şarj cihazı, mümkünse panodan çekilen ayrı bir hat üzerinden beslenmelidir. Mevcut tesisatın kapasitesi (ana sigorta, kablo kesiti) değerlendirilmeli; gerekirse ayrı sayaç düşünülmelidir. Bu değerlendirmeyi yetkili bir elektrikçi yapmalıdır." },

      { type: "h2", text: "3) Yük yönetimi (birden fazla araç için)" },
      { type: "p", text: "Sitede birden çok şarj noktası olacaksa, hepsi aynı anda tam güç çekerse şebeke zorlanır. Yük yönetimi (DLM) özellikli cihazlar, mevcut gücü noktalar arasında dengeli paylaştırarak bu sorunu çözer." },

      { type: "h2", text: "4) Faturalandırma & yetkilendirme" },
      { type: "p", text: "Ortak kullanımda kimin ne kadar harcadığını ayırmak için RFID kart, mobil uygulama veya OCPP tabanlı yönetim sistemi kullanılır. Böylece her kullanıcı kendi tüketimini öder." },

      { type: "ul", items: [
        "OCPP uyumlu cihaz seçin (uzaktan yönetim + faturalandırma).",
        "IP65/IP66 koruma sınıfı (otopark/dış mekân).",
        "Yük yönetimi desteği (çoklu nokta için).",
        "Yetkili kurulum + ayrı hat.",
      ]},

      { type: "cta", text: "Site ve iş yeri için OCPP uyumlu Bemis çözümlerini inceleyin.", href: "/products/wallbox", label: "Şarj İstasyonlarını Gör" },
    ],
    faq: [
      { q: "Apartmana şarj istasyonu kurmak için izin gerekir mi?", a: "Ortak alan (otopark) kurulumu için yönetim/kat malikleri kararı gerekir. Kurulumdan önce yönetimle görüşüp onay almak doğru yaklaşımdır." },
      { q: "Sitede birden çok şarj noktası nasıl yönetilir?", a: "Yük yönetimi (DLM) özellikli ve OCPP uyumlu cihazlarla; mevcut güç noktalar arasında dengeli paylaştırılır, her kullanıcının tüketimi RFID/uygulama ile ayrı faturalandırılır." },
      { q: "Apartman şarjı için hangi cihaz uygun?", a: "OCPP uyumlu, yük yönetimi destekleyen, IP65/IP66 korumalı bir AC Wallbox apartman/site otoparkı için uygundur." },
    ],
    related: [
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Şarj Ağı Operatörleri", href: "/operator" },
      { label: "Bayilik / İletişim", href: "/bayilik" },
      { label: "Bursa EV Şarj İstasyonu", href: "/bursa-ev-sarj-istasyonu" },
      { label: "Şehir Şehir EV Şarj Rehberi", href: "/blog/turkiye-sehir-sehir-ev-sarj-rehberi" },
    ],
  },

  {
    slug: "is-yerine-sarj-istasyonu-kurulumu",
    title: "İş Yerine Elektrikli Araç Şarj İstasyonu Kurmanın 6 Avantajı",
    description:
      "İş yerine / ofise / otoparka elektrikli araç şarj istasyonu kurmanın avantajları nelerdir? Müşteri çekme, ek gelir, çalışan memnuniyeti ve kurulum rehberi.",
    excerpt:
      "Ofis, AVM veya işletme otoparkına şarj istasyonu kurmak neden mantıklı? Müşteri çekmekten ek gelire 6 somut avantaj ve nelere dikkat etmeli.",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 5,
    keywords: ["iş yerine şarj kurulumu", "ofis şarj istasyonu", "ticari şarj istasyonu", "işletme ev şarj"],
    body: [
      { type: "p", text: "Elektrikli araç sayısı arttıkça, işletmeler için otoparkta şarj imkânı sunmak bir ayrıcalık olmaktan çıkıp beklentiye dönüşüyor. İster ofis, ister AVM, otel, restoran veya site yönetimi olun — iş yerine şarj istasyonu kurmanın somut faydaları var." },

      { type: "h2", text: "6 somut avantaj" },
      { type: "ul", items: [
        "Müşteri çekme: EV sürücüleri şarj imkânı olan mekânları tercih eder; kalma süresi (ve harcama) artar.",
        "Ek gelir: kullanım başına ücretlendirme ile şarj noktası bir gelir kalemi olur.",
        "Çalışan memnuniyeti: işe gelirken araç şarj olur; yan hak olarak değerli.",
        "Marka & sürdürülebilirlik: çevreci imaj, kurumsal sorumluluk göstergesi.",
        "Rekabet avantajı: rakip işletmelerden ayrışma.",
        "Geleceğe hazırlık: artan EV talebine bugünden uyum.",
      ]},

      { type: "h2", text: "Kurarken nelere dikkat etmeli?" },
      { type: "ul", items: [
        "OCPP uyumlu cihaz: uzaktan yönetim + kullanım başına faturalandırma.",
        "Yük yönetimi (DLM): birden çok nokta şebekeyi zorlamasın.",
        "IP65/IP66 koruma: dış/otopark kullanımı.",
        "RFID / uygulama ile yetkilendirme: kim kullandı, ne kadar ödedi.",
        "Yetkili kurulum ve ayrı hat.",
      ]},

      { type: "quote", text: "İpucu: Önce 1-2 nokta ile başlayıp talebe göre büyütmek, hem maliyeti hem riski düşürür." },

      { type: "cta", text: "İşletmeniz için OCPP uyumlu Bemis çözümlerini inceleyin.", href: "/products/wallbox", label: "Ticari Çözümler" },
    ],
    faq: [
      { q: "İş yerine şarj istasyonu kurmak gelir getirir mi?", a: "Evet; OCPP uyumlu cihaz ve faturalandırma ile kullanım başına ücretlendirme yaparak şarj noktasını bir gelir kalemine dönüştürebilirsiniz." },
      { q: "İşletme için hangi şarj cihazı uygun?", a: "OCPP uyumlu, yük yönetimi destekleyen, IP65/IP66 korumalı ve RFID/uygulama ile yetkilendirme yapabilen AC Wallbox modelleri ticari kullanım için uygundur." },
      { q: "Kaç şarj noktasıyla başlamalıyım?", a: "Genellikle 1-2 nokta ile başlayıp talebe göre büyütmek en mantıklısıdır; yük yönetimi sayesinde ileride sorunsuz genişletebilirsiniz." },
    ],
    related: [
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "Şarj Ağı Operatörleri", href: "/operator" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },

  {
    slug: "tesla-sarj-turkiye-type-2",
    title: "Tesla Şarj Türkiye: Type 2 ile Tesla Nasıl Şarj Edilir?",
    description:
      "Tesla Model 3 / Model Y Türkiye'de nasıl şarj edilir? Evde Type 2 AC şarj, gerekli kablo ve wallbox, Supercharger farkı — Tesla şarj rehberi.",
    excerpt:
      "Tesla'nızı evde nasıl şarj edersiniz? Type 2 AC şarj, gerekli kablo/wallbox ve Supercharger farkını sade anlatıyoruz.",
    category: "Rehber",
    datePublished: "2026-06-06",
    readingMinutes: 5,
    keywords: ["tesla şarj", "tesla type 2", "tesla model 3 şarj", "tesla ev şarj"],
    body: [
      { type: "p", text: "Türkiye'de (ve Avrupa'da) satılan Tesla modelleri AC şarjda standart Type 2 konektörünü kullanır. Bu, Tesla'nızı evde herhangi bir standart Type 2 wallbox veya kabloyla şarj edebileceğiniz anlamına gelir. İşte Tesla şarjı hakkında bilmeniz gerekenler." },

      { type: "h2", text: "Tesla hangi konektörü kullanır?" },
      { type: "p", text: "Avrupa/Türkiye versiyonu Tesla Model 3 ve Model Y, AC (yavaş/normal) şarjda Type 2, DC hızlı şarjda ise CCS Combo 2 kullanır. Yani evde AC şarj için ihtiyacınız olan şey standart bir Type 2 ekipmandır — Tesla'ya özel bir cihaz şart değildir." },

      { type: "h2", text: "Tesla'yı evde nasıl şarj ederim?" },
      { type: "ul", items: [
        "Type 2 AC Wallbox: en pratik ev çözümü; gece boyu dolum.",
        "Type 2 şarj kablosu: prizli wallbox veya genel istasyonlarda kullanım için.",
        "Güç: aracın dahili şarj kapasitesine göre 7,4–11 kW (tek/üç faz).",
      ]},

      { type: "h2", text: "Supercharger ile ev şarjı farkı" },
      { type: "p", text: "Tesla Supercharger'lar DC hızlı şarjdır; yolda hızlı dolum için idealdir. Günlük kullanımda ise evde AC şarj hem daha ucuz hem batarya için daha naziktir. Çoğu Tesla sahibi evde AC ile şarj edip Supercharger'ı uzun yolda kullanır." },

      { type: "quote", text: "Özet: Tesla'nızı evde standart bir Type 2 wallbox/kablo ile rahatça şarj edebilirsiniz; Tesla'ya özel ekipman gerekmez." },

      { type: "cta", text: "Tesla ve diğer EV'ler için uygun Type 2 wallbox ve kabloları inceleyin.", href: "/products/wallbox", label: "Wallbox & Kablolar" },
    ],
    faq: [
      { q: "Tesla Type 2 ile şarj olur mu?", a: "Evet. Avrupa/Türkiye versiyonu Tesla Model 3 ve Model Y, AC şarjda standart Type 2 konektörü kullanır; herhangi bir Type 2 wallbox veya kabloyla evde şarj edebilirsiniz." },
      { q: "Tesla'yı evde şarj etmek için neye ihtiyacım var?", a: "Bir Type 2 AC Wallbox (en pratiği) veya Type 2 şarj kablosu yeterlidir. Tesla'ya özel bir cihaz gerekmez." },
      { q: "Tesla evde kaç kW ile şarj olur?", a: "Aracın dahili şarj kapasitesine ve tesisatınıza göre genelde 7,4–11 kW arasında AC şarj olur." },
    ],
    related: [
      { label: "AC Wallbox", href: "/products/wallbox" },
      { label: "AC Şarj Kabloları (Type 2)", href: "/products/cables" },
      { label: "Yerli Üretici", href: "/uretici" },
    ],
  },
];

export function allPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function getPost(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}
