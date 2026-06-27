// EV şarj terimleri sözlüğü — GEO/AEO "X nedir" sorgularına doğrudan,
// alıntılanabilir tanımlarla cevap veren hub. Hem sunucu (sayfa/JSON-LD) hem
// istemci import eder; burada İSTEMCİ kodu olmamalı.
//
// Her tanım 40-60 kelime, kendi kendine yeten DOĞRUDAN cevaptır. İçerik
// blog gövdelerindeki fact-check'li bilgilere dayanır; uydurma spec yoktur.

export type GlossaryTerm = {
  slug: string;
  term: string;        // başlık (H1) — "Type 2 nedir?"
  abbr: string;        // kısa etiket (kart + liste)
  short: string;       // tek cümlelik özet (index kartı + meta description çekirdeği)
  definition: string;  // 40-60 kelime doğrudan-cevap bloğu
  keywords: string[];
  related?: { label: string; href: string }[];
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "type-2",
    term: "Type 2 Nedir?",
    abbr: "Type 2",
    short: "Türkiye ve Avrupa'nın standart AC şarj soketi (IEC 62196-2).",
    definition:
      "Type 2 (IEC 62196-2), Türkiye ve Avrupa'nın standart AC şarj soketidir. Yedi pinli bu konnektör hem tek faz (monofaze) hem üç faz (trifaze) güç aktarımını destekler ve 7,4 kW'tan 22 kW'a kadar AC şarja izin verir. Çoğu modern elektrikli araç ve AC wallbox bu soketi kullanır; Bemis AC şarj ürünleri de Type 2 standardındadır.",
    keywords: ["type 2 nedir", "type 2 soket", "iec 62196", "ac şarj soketi"],
    related: [
      { label: "EV Şarj Soketi Tipleri", href: "/blog/ev-sarj-soketi-tipleri-type-2-ccs2-chademo" },
      { label: "Type 2 Şarj Kabloları", href: "/products/cables" },
    ],
  },
  {
    slug: "ccs2",
    term: "CCS2 Nedir?",
    abbr: "CCS2",
    short: "Türkiye ve Avrupa'nın standart DC hızlı şarj soketi (Combo 2).",
    definition:
      "CCS2 (Combined Charging System / Combo 2), Türkiye ve Avrupa'nın standart DC hızlı şarj soketidir. Type 2 soketinin altına eklenen iki güçlü DC pini ile yüksek güçte doğru akım aktarır; böylece araç dakikalar içinde önemli oranda dolar. Aynı konnektör hem AC (Type 2 kısmı) hem DC şarjı destekler. Bemis BEVDC hızlı şarj üniteleri CCS2 kullanır.",
    keywords: ["ccs2 nedir", "combo 2 soket", "dc hızlı şarj soketi", "ccs2 type 2"],
    related: [
      { label: "EV Şarj Soketi Tipleri", href: "/blog/ev-sarj-soketi-tipleri-type-2-ccs2-chademo" },
      { label: "DC Hızlı Şarj Üniteleri", href: "/products/dc-units" },
    ],
  },
  {
    slug: "ocpp",
    term: "OCPP Nedir?",
    abbr: "OCPP",
    short: "Şarj istasyonu ile yönetim yazılımı arasındaki açık iletişim standardı.",
    definition:
      "OCPP (Open Charge Point Protocol), şarj istasyonları ile merkezi yönetim yazılımı (CSMS) arasındaki açık iletişim standardıdır. Cihazların markadan bağımsız olarak uzaktan izlenmesini, yetkilendirme, faturalandırma ve yük yönetimini sağlar. Yaygın sürümleri OCPP 1.6J ve 2.0.1'dir. OCPP uyumlu cihaz tek bir markanın kapalı sistemine bağlı kalmaz; Bemis'in akıllı modelleri OCPP uyumludur.",
    keywords: ["ocpp nedir", "open charge point protocol", "csms", "ocpp 1.6j"],
    related: [
      { label: "OCPP Nedir? (Rehber)", href: "/blog/ocpp-nedir" },
      { label: "Yük Yönetimi", href: "/blog/elektrikli-arac-sarj-yuk-yonetimi" },
    ],
  },
  {
    slug: "ac-dc-sarj",
    term: "AC ve DC Şarj Nedir?",
    abbr: "AC / DC şarj",
    short: "Akım dönüşümünün araçta (AC) mı istasyonda (DC) mı yapıldığı farkı.",
    definition:
      "AC ve DC şarj, akım dönüşümünün nerede yapıldığıyla ayrışır. AC şarjda istasyon alternatif akımı araca iletir, doğru akıma dönüşümü aracın içindeki onboard charger yapar (tipik 7,4–22 kW). DC hızlı şarjda ise dönüşüm istasyonun içinde yapılır ve doğru akım doğrudan bataryaya verilir; bu sayede çok daha yüksek güce (50 kW ve üzeri) çıkar.",
    keywords: ["ac dc şarj farkı", "ac şarj nedir", "dc hızlı şarj nedir"],
    related: [
      { label: "AC ve DC Şarj Farkı", href: "/blog/ac-dc-sarj-farki" },
      { label: "Şarj İstasyonu Nasıl Çalışır", href: "/blog/elektrikli-arac-sarj-istasyonu-nasil-calisir" },
    ],
  },
  {
    slug: "kw-kwh",
    term: "kW ve kWh Farkı Nedir?",
    abbr: "kW / kWh",
    short: "kW gücü (hız), kWh ise enerji miktarını (depolanan/aktarılan) gösterir.",
    definition:
      "kW (kilowatt) gücü, yani şarjın hızını ifade eder; kWh (kilowatt-saat) ise enerji miktarını, yani araca aktarılan veya bataryada depolanan toplam enerjiyi gösterir. Basit benzetmeyle kW musluğun debisi, kWh ise dolan su miktarıdır. Örneğin 11 kW güçle 1 saat şarj, yaklaşık 11 kWh enerji aktarır.",
    keywords: ["kw kwh farkı", "kw nedir", "kwh nedir", "şarj gücü enerji"],
    related: [
      { label: "Şarj Süresi: Kaç Saatte Dolar", href: "/blog/elektrikli-arac-sarj-suresi-kac-saatte-dolar" },
    ],
  },
  {
    slug: "v2l",
    term: "V2L Nedir?",
    abbr: "V2L",
    short: "Aracın bataryasından dış cihazları besleme özelliği (Vehicle-to-Load).",
    definition:
      "V2L (Vehicle-to-Load), elektrikli aracın bataryasındaki enerjiyi dış cihazları beslemek için kullanmayı sağlayan özelliktir. Bir V2L adaptörü araç soketine takılarak normal priz (Schuko) çıkışı verir; kamp, saha ve acil durumlarda laptop, aydınlatma veya küçük cihazları çalıştırabilirsiniz. Araç böylece seyyar bir elektrik kaynağına dönüşür. Bemis yerli V2L adaptörleri üretir.",
    keywords: ["v2l nedir", "vehicle to load", "araçtan elektrik", "v2l adaptör"],
    related: [
      { label: "V2L / C2L Adaptörler", href: "/products/v2l-c2l" },
      { label: "Togg V2L ile Araçtan Elektrik", href: "/blog/togg-v2l-aractan-elektrik" },
    ],
  },
  {
    slug: "c2l",
    term: "C2L Nedir?",
    abbr: "C2L",
    short: "Şarj cihazı üzerinden aracın enerjisini dış kullanıma aktaran adaptör.",
    definition:
      "C2L (Charger-to-Load), şarj cihazı üzerinden aracın enerjisini dış kullanıma aktaran adaptör çözümüdür. V2L gibi aracı seyyar bir güç kaynağına çevirir; araç şarj soketine bağlanır ve standart priz/CEE çıkışı sağlar. Kamp, atölye ve acil senaryolarda dış cihazların beslenmesine olanak tanır. Bemis V2L ve C2L adaptörlerini yerli üretimle sunar.",
    keywords: ["c2l nedir", "charger to load", "c2l adaptör", "araçtan güç"],
    related: [
      { label: "V2L / C2L Adaptörler", href: "/products/v2l-c2l" },
    ],
  },
  {
    slug: "yuk-yonetimi-dlm",
    term: "Yük Yönetimi (DLM) Nedir?",
    abbr: "Yük yönetimi / DLM",
    short: "Sınırlı gücü birden çok şarj cihazına akıllıca paylaştıran sistem.",
    definition:
      "Yük yönetimi (DLM — Dynamic Load Management), bir tesisin elektrik kapasitesini aşmadan birden fazla şarj cihazına gücü akıllıca paylaştıran sistemdir. Toplam tüketimi izleyerek şarj akımını yükseltir veya düşürür; böylece çok sayıda araç aynı anda güvenle şarj olur ve ana sigorta zorlanmaz. Apartman, iş yeri ve filo kurulumlarında pratik bir zorunluluktur.",
    keywords: ["yük yönetimi nedir", "dlm nedir", "dinamik yük dengeleme", "load management"],
    related: [
      { label: "Yük Yönetimi (Load Management)", href: "/blog/elektrikli-arac-sarj-yuk-yonetimi" },
      { label: "Araç Filosu Şarj Çözümleri", href: "/blog/arac-filosu-elektrikli-sarj-cozumleri" },
    ],
  },
  {
    slug: "ip65-ip66",
    term: "IP65 / IP66 Nedir?",
    abbr: "IP65 / IP66",
    short: "Cihazın toza ve suya karşı koruma sınıfı (dış mekân dayanımı).",
    definition:
      "IP65 ve IP66, bir cihazın toza ve suya karşı koruma sınıfını gösterir (Ingress Protection). İlk rakam (6) tam toz korumasını, ikinci rakam su korumasını ifade eder: IP65 her yönden düşük basınçlı su jetlerine, IP66 güçlü su jetlerine dayanır. Bu sınıf, şarj cihazının dış mekânda güvenle kullanılabileceğini gösterir; Bemis modelleri IP65/IP66 korumalıdır.",
    keywords: ["ip65 nedir", "ip66 nedir", "ip koruma sınıfı", "şarj cihazı su geçirmez"],
    related: [
      { label: "Şarj Cihazı Nasıl Seçilir", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
      { label: "AC Wallbox Ürünleri", href: "/products/wallbox" },
    ],
  },
  {
    slug: "faz",
    term: "Monofaze ve Trifaze Nedir?",
    abbr: "Faz (mono/tri)",
    short: "Tek faz (≤7,4 kW) ve üç faz (11/22 kW) elektrik bağlantısı.",
    definition:
      "Monofaze (tek faz) ve trifaze (üç faz), elektrik bağlantısının tipini belirtir. Tek fazlı tesisat tipik olarak 7,4 kW'a kadar AC şarja izin verirken, üç fazlı tesisat 11 veya 22 kW'a çıkar. Şarj hızı hem tesisin fazına hem aracın onboard charger kapasitesine bağlıdır. Doğru cihaz seçimi için ikisini de bilmek gerekir.",
    keywords: ["monofaze trifaze nedir", "tek faz üç faz şarj", "trifaze şarj", "faz nedir"],
    related: [
      { label: "Şarj Cihazı Nasıl Seçilir", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
    ],
  },
  {
    slug: "onboard-charger",
    term: "Onboard Charger Nedir?",
    abbr: "Onboard charger",
    short: "Araç içindeki, AC'yi DC'ye çeviren şarj ünitesi; AC hızını belirler.",
    definition:
      "Onboard charger (araç içi şarj ünitesi), elektrikli aracın içinde bulunan ve AC şarjda gelen alternatif akımı bataryanın ihtiyaç duyduğu doğru akıma çeviren birimdir. AC şarj hızının üst sınırını çoğunlukla istasyon değil bu ünite belirler; örneğin 11 kW onboard charger'lı bir araç, 22 kW istasyonda da yaklaşık 11 kW ile şarj olur. DC şarjda devre dışı kalır.",
    keywords: ["onboard charger nedir", "araç içi şarj ünitesi", "ac şarj hızı", "on-board charger"],
    related: [
      { label: "Şarj İstasyonu Nasıl Çalışır", href: "/blog/elektrikli-arac-sarj-istasyonu-nasil-calisir" },
    ],
  },
  {
    slug: "mod-2-mod-3",
    term: "Mod 2 ve Mod 3 Şarj Nedir?",
    abbr: "Mod 2 / Mod 3",
    short: "Prizden taşınabilir (Mod 2) ve sabit istasyondan (Mod 3) AC şarj.",
    definition:
      "Mod 2 ve Mod 3, AC şarj yöntemlerini tanımlar (IEC 61851). Mod 2, araçla normal/endüstriyel priz arasında, kabloya entegre bir koruma kutusu (IC-CPD) ile yapılan taşınabilir şarjdır. Mod 3 ise sabit bir şarj istasyonu (wallbox) üzerinden, araç-istasyon haberleşmeli kalıcı AC şarjdır. Ev ve iş yeri wallbox'ları Mod 3 çalışır.",
    keywords: ["mod 2 mod 3 nedir", "iec 61851", "taşınabilir şarj", "mode 3 şarj"],
    related: [
      { label: "Type 2 Şarj Kabloları", href: "/products/cables" },
      { label: "Taşınabilir Şarj Cihazları", href: "/products/portable" },
    ],
  },
  {
    slug: "rfid",
    term: "RFID (Şarjda Yetkilendirme) Nedir?",
    abbr: "RFID",
    short: "Temassız kartla şarj başlatma ve kullanıcı yetkilendirme teknolojisi.",
    definition:
      "RFID (Radio Frequency Identification), şarj istasyonlarında yetkilendirme için kullanılan temassız kart teknolojisidir. Kullanıcı kartını okutarak şarjı başlatır; kart okutulmadan oturum açılmaz. Ortak alan, iş yeri ve filo kurulumlarında yetkisiz kullanımı engeller ve her şarj oturumunu belirli bir kullanıcıya bağlayarak raporlamayı mümkün kılar. Bemis'in akıllı modelleri RFID destekler.",
    keywords: ["rfid nedir", "şarj yetkilendirme", "rfid kart şarj", "şarj kimlik"],
    related: [
      { label: "Araç Filosu Şarj Çözümleri", href: "/blog/arac-filosu-elektrikli-sarj-cozumleri" },
    ],
  },
  {
    slug: "taper",
    term: "Taper (Kademeli Yavaşlama) Nedir?",
    abbr: "Taper",
    short: "Batarya ~%80'e ulaşınca şarj hızının kasıtlı düşürülmesi (koruma).",
    definition:
      "Taper (kademeli yavaşlama), bataryanın belli bir doluluğa (sıklıkla yaklaşık %80) ulaşmasından sonra şarj hızının kasıtlı olarak düşürülmesidir. Bir arıza değil, koruma davranışıdır: batarya dolduğunda yüksek akımı güvenle kabul edemez, bu yüzden araç daha az akım ister. Özellikle DC hızlı şarjda son %20 orantısız uzar; en verimli aralık %80'e kadardır.",
    keywords: ["taper nedir", "şarj neden yavaşlar", "%80 sonrası şarj", "batarya şarj eğrisi"],
    related: [
      { label: "Şarj Süresi: Kaç Saatte Dolar", href: "/blog/elektrikli-arac-sarj-suresi-kac-saatte-dolar" },
    ],
  },
  {
    slug: "wallbox",
    term: "Wallbox Nedir?",
    abbr: "Wallbox",
    short: "Duvara monte sabit AC şarj istasyonu (ev/iş yeri, 7,4–22 kW).",
    definition:
      "Wallbox, duvara monte edilen sabit AC şarj istasyonudur. Ev, iş yeri ve site otoparklarında kullanılır; tipik olarak Type 2 soketli ve 7,4–22 kW güç aralığındadır. Aracın gece boyu park hâlindeyken güvenle dolmasını sağlar. Akıllı modeller OCPP, mobil uygulama, yük yönetimi ve RFID gibi özellikler sunar. Bemis Charger serisi yerli üretim wallbox'lardır.",
    keywords: ["wallbox nedir", "duvar tipi şarj", "ev şarj istasyonu", "ac wallbox"],
    related: [
      { label: "AC Wallbox Ürünleri", href: "/products/wallbox" },
      { label: "Şarj Cihazı Nasıl Seçilir", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
    ],
  },
];

export const allTerms = (): GlossaryTerm[] => GLOSSARY;
export const getTerm = (slug: string): GlossaryTerm | undefined =>
  GLOSSARY.find((t) => t.slug === slug);
