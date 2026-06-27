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
      "Type 2 (IEC 62196-2), Türkiye ve Avrupa'nın standart AC şarj soketidir. Yedi pinli bu konnektör hem tek faz (monofaze) hem üç faz (trifaze) güç aktarımını destekler ve 7,4 kW'tan 22 kW'a kadar AC şarja izin verir. Soketin içindeki güç pinlerine ek olarak CP (Control Pilot) ve PP (Proximity Pilot) haberleşme hatları, araç ile istasyonun birbirini tanımasını, akımın güvenle ayarlanmasını ve kablonun doğru kavrandığının doğrulanmasını sağlar. 2014'ten bu yana Avrupa'da fiili standart olduğu için bugün satılan elektrikli araçların ve AC wallbox'ların neredeyse tamamı bu soketi kullanır; farklı marka araç ve istasyonların sorunsuz çalışması bu ortak standart sayesindedir. Bemis'in yerli üretim AC şarj cihazları ve kabloları da Type 2 standardındadır. Pratikte bir ev kullanıcısı, evine kurduğu Type 2 soketli wallbox ile aracını gece boyu şarj ederken; bir iş yeri otoparkında trifaze tesisatla aynı soket 11 veya 22 kW'a kadar güç aktarabilir. Aynı standart kullanıldığı için sürücü, farklı yerlerdeki Type 2 istasyonlara araca özel adaptör aramadan bağlanabilir.",
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
      "CCS2 (Combined Charging System / Combo 2), Türkiye ve Avrupa'nın standart DC hızlı şarj soketidir. Type 2 soketinin altına eklenen iki güçlü DC pini ile yüksek güçte doğru akım aktarır; böylece araç, AC şarja kıyasla dakikalar içinde önemli oranda dolar. \"Kombine\" adını buradan alır: aynı konnektör hem AC (üstteki Type 2 kısmı) hem DC şarjı tek soketle destekler, bu yüzden araçta tek bir şarj girişi yeterlidir. DC şarjda akım dönüşümü araç yerine istasyonun içinde yapıldığından güç, aracın bataryasına doğrudan verilir ve onboard charger sınırına takılmaz. Türkiye'deki kamuya açık hızlı şarj ağlarının ve yeni nesil elektrikli araçların ortak standardı CCS2'dir. Bemis'in yerli üretim BEVDC serisi hızlı şarj üniteleri (40–120 kW DC) CCS2 konnektör kullanır. Tipik bir senaryoda, yol üstündeki bir CCS2 istasyonu uzun yolculukta aracı kısa bir molada önemli ölçüde doldururken; aynı soket bir AVM otoparkında alışveriş süresi boyunca hızlı şarj sağlar. Bu yüzden CCS2, evde AC ile gece şarjını tamamlayan, dışarıda hız gereken durumlara uygun bir çözümdür.",
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
      "OCPP (Open Charge Point Protocol), şarj istasyonları ile merkezi yönetim yazılımı (CSMS) arasındaki açık iletişim standardıdır. Şarj cihazının markasından bağımsız olarak uzaktan izlenmesini, kullanıcı yetkilendirmesini, faturalandırmayı, yazılım güncellemesini ve yük yönetimini tek bir merkezden yürütmeyi sağlar. Yaygın sürümleri OCPP 1.6J ve 2.0.1'dir. Açık bir standart olması, işletmecinin tek bir üreticinin kapalı sistemine kilitlenmemesi anlamına gelir: farklı markalardan cihazlar aynı yönetim yazılımında birlikte yönetilebilir, ileride yazılım veya donanım değiştirmek kolaylaşır. Bu yüzden OCPP, kamuya açık istasyonlar, filolar ve çok cihazlı kurulumlar için fiili sektör standardıdır. Bemis'in akıllı (OCPP uyumlu) modelleri bu protokolü destekler ve standart bir merkezi yönetim yazılımına bağlanabilir. Örneğin bir site otoparkında onlarca cihaz tek bir yönetim ekranından izlenebilir, her oturum kullanıcıya bağlanarak faturalandırılabilir ve cihazların yazılımı uzaktan güncellenebilir. Bir filoda da araç başına tüketim raporlanır ve yük yönetimi merkezi olarak ayarlanır; bu da sahaya gitmeden kontrol sağlar.",
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
      "AC ve DC şarj, akım dönüşümünün nerede yapıldığıyla ayrışır. AC şarjda istasyon şebekeden gelen alternatif akımı araca iletir; bataryanın ihtiyaç duyduğu doğru akıma dönüşümü aracın içindeki onboard charger yapar (tipik 7,4–22 kW). DC hızlı şarjda ise dönüşüm istasyonun içindeki güçlü çevirici tarafından yapılır ve doğru akım doğrudan bataryaya verilir; aracın küçük onboard charger'ı devreye girmediği için çok daha yüksek güce (50 kW ve üzeri) çıkılabilir. Bu nedenle AC şarj ev, iş yeri ve gece park gibi saatlerce süren senaryolara, DC hızlı şarj ise yol üstü ve filo gibi dakikalar içinde menzil eklenmesi gereken durumlara uygundur. Bemis hem yerli üretim AC wallbox cihazlarını hem CCS2 standardındaki BEVDC serisi DC hızlı şarj ünitelerini birlikte sunar. Somut karşılaştırmayla, evde 11 kW'lık bir AC wallbox aracı saatler içinde doldururken, BEVDC serisi bir DC ünitesi (40–120 kW) aynı menzili yol üstünde çok daha kısa sürede ekler. Bu yüzden çoğu kullanıcı için pratik kurulum, günlük kullanımda AC ev şarjı + uzun yolda DC hızlı şarj kombinasyonudur.",
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
      "kW (kilowatt) gücü, yani şarjın hızını ifade eder; kWh (kilowatt-saat) ise enerji miktarını, yani araca aktarılan veya bataryada depolanan toplam enerjiyi gösterir. Basit benzetmeyle kW musluğun debisi (suyun ne kadar hızlı aktığı), kWh ise dolan su miktarıdır (kovaya toplam ne kadar su girdiği). İkisi süreyle bağlıdır: aktarılan enerji (kWh), güç (kW) ile şarj süresinin (saat) çarpımına yaklaşık eşittir. Örneğin 11 kW güçle 1 saat şarj yaklaşık 11 kWh enerji aktarır; aynı 11 kW ile 22 kWh enerji yüklemek ise kabaca 2 saat sürer. Bu yüzden araç menzilini belirleyen kWh (batarya kapasitesi), ne kadar hızlı dolacağını belirleyen ise kW'tır. Bemis AC cihazları 7,4–22 kW, BEVDC serisi DC üniteleri 40–120 kW güç aralığında çalışır. Pratikte bu fark cihaz seçimini doğrudan etkiler: evde gece 8 saat park eden bir araç için düşük kW'lı bir AC cihaz yeterli enerjiyi sığdırırken, yol üstünde aynı kWh'i kısa sürede yüklemek yüksek kW'lı bir DC ünitesi gerektirir. Yani ihtiyacınız \"ne kadar enerji\" değil, \"ne kadar sürede\" sorusuyla belirlenir.",
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
      "V2L (Vehicle-to-Load), elektrikli aracın bataryasındaki enerjiyi dış cihazları beslemek için kullanmayı sağlayan özelliktir. Bir V2L adaptörü aracın şarj soketine (Type 2) takılır ve normal priz (Schuko) çıkışı verir; böylece şebeke veya jeneratör olmadan laptop, aydınlatma, buzdolabı veya küçük el aletleri gibi cihazlar doğrudan araçtan çalıştırılabilir. Akım dönüşümü araç tarafından yapıldığı için adaptör sadece güvenli bir köprü görevi görür ve aracı seyyar bir elektrik kaynağına dönüştürür; bu özellikle kamp, açık hava etkinlikleri, saha çalışmaları ve elektrik kesintisi gibi acil durumlarda pratiktir. V2L'yi her elektrikli araç desteklemez; aracın bu özelliğe ve uygun soket çıkışına sahip olması gerekir. Bemis, Türkiye'de Type 2 standardına uygun yerli üretim V2L adaptörleri üretir. Örneğin bir hafta sonu kampında araç, Type 2 soketine takılan V2L adaptörüyle buzdolabını, aydınlatmayı ve telefon şarjını jeneratörsüz besleyebilir; evde elektrik kesintisinde de kısa süreli bir yedek güç kaynağı olarak iş görür. Kullanmadan önce aracınızın V2L desteklediğini ve verdiği çıkış gücünü kontrol etmek gerekir.",
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
      "C2L (Charger-to-Load), şarj cihazı üzerinden aracın enerjisini dış kullanıma aktaran adaptör çözümüdür. V2L mantığına benzer biçimde aracı seyyar bir güç kaynağına çevirir: araç şarj soketine (Type 2) bağlanır ve standart priz ya da CEE (endüstriyel) çıkışı sağlayarak dış cihazların beslenmesine olanak tanır. Aradaki fark çözümün şarj cihazı/kablo tarafından kurgulanmasıdır; akım yine araç tarafından yönetilir ve adaptör güvenli bir arayüz görevi görür. Kamp, atölye, şantiye ve elektrik kesintisi gibi senaryolarda taşınabilir bir enerji çıkışı sunar; V2L gibi bu özellik de aracın desteğine bağlıdır. Bemis, V2L ve C2L adaptörlerini Type 2 standardına uygun yerli üretimle sunar. Örneğin bir şantiyede CEE (endüstriyel) çıkış sayesinde üç fazlı el aletleri veya saha ekipmanları doğrudan araçtan beslenebilir; standart priz çıkışı ise atölyede küçük cihazlar için pratik bir enerji kaynağı sağlar. Bu yüzden C2L, özellikle CEE çıkışı gereken profesyonel saha kullanımlarında V2L'ye göre daha esnek bir seçenektir.",
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
      "Yük yönetimi (DLM — Dynamic Load Management), bir tesisin elektrik kapasitesini aşmadan birden fazla şarj cihazına gücü akıllıca paylaştıran sistemdir. Binanın anlık toplam tüketimini ölçer ve şarj cihazlarına verilen akımı gerçek zamanlı yükseltir veya düşürür; böylece çok sayıda araç aynı anda güvenle şarj olurken ana sigorta zorlanmaz ve pahalı bir altyapı/trafo yükseltmesine çoğu zaman gerek kalmaz. Statik paylaşımdan farkı, boştaki kapasiteyi anlık ihtiyaca göre dinamik dağıtmasıdır: az araç bağlıyken her birine daha çok güç verir, talep artınca otomatik dengeler. Apartman otoparkları, iş yerleri, AVM'ler ve araç filoları gibi çok cihazlı kurulumlarda yük yönetimi pratik bir zorunluluktur. Bemis'in OCPP uyumlu akıllı modelleri merkezi yönetim yazılımı üzerinden yük yönetimine uygundur. Örneğin bir apartman otoparkında tek araç bağlıyken o cihaza tam güç verilir, akşam birçok araç aynı anda takıldığında ise sistem akımı otomatik bölüştürerek binanın ana sigortasını attırmadan hepsini şarj etmeyi sürdürür. Bu sayede mevcut elektrik aboneliği çoğu zaman yeterli olur ve trafo yükseltme maliyetinden kaçınılır.",
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
      "IP65 ve IP66, bir cihazın toza ve suya karşı koruma sınıfını gösterir (Ingress Protection, IEC 60529). Kodun ilk rakamı katı cisim/toz korumasını, ikinci rakamı su korumasını ifade eder: her iki sınıfta da ilk rakam 6'dır, yani cihaz toza karşı tam sızdırmazlık sağlar (içeriye toz girmez). İkinci rakam su dayanımını ayırır: IP65 her yönden gelen düşük basınçlı su jetlerine, IP66 ise daha güçlü su jetlerine karşı korur. Bu seviye, bir şarj cihazının yağmur, toz ve rüzgârlı koşullarda açık otoparkta veya duvar üzerinde dış mekânda güvenle kullanılabileceği anlamına gelir. Yine de doğrudan su altında kalmaya değil, dış ortam koşullarına dayanıklılığa işaret eder. Bemis'in yerli üretim şarj cihazı modelleri IP65/IP66 koruma sınıfındadır. Pratikte bu, açık bir otoparkta dış duvara monte edilmiş bir wallbox'un yağmur altında veya tozlu bir sanayi bölgesinde sorunsuz çalışabileceği anlamına gelir; ev kullanıcısı için cihazı bahçe duvarına ya da garaj dışına takmak güvenlidir. Bu koruma sınıfı sayesinde cihaz için ayrı bir kapalı muhafaza veya sundurma çoğu zaman gerekmez.",
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
      "Monofaze (tek faz) ve trifaze (üç faz), tesisattaki elektrik bağlantısının tipini belirtir. Tek faz tek bir akım hattı taşır ve AC şarjda tipik olarak 7,4 kW'a kadar güç sunarken, üç faz birbirini dengeleyen üç hat taşıdığı için aynı kabloyla çok daha fazla gücü (11 veya 22 kW) aktarabilir. Çoğu ev tek fazlı, iş yeri ve site otoparkları çoğunlukla üç fazlıdır. Önemli bir nokta: gerçek şarj hızı hem tesisin fazına hem de aracın onboard charger kapasitesine bağlıdır; trifaze bir tesisat olsa bile araç yalnızca 11 kW kabul ediyorsa şarj 11 kW ile sınırlı kalır. Bu yüzden doğru cihaz ve güç seçimi için tesisin fazını ve aracın kapasitesini birlikte bilmek gerekir. Bemis AC cihazları hem monofaze hem trifaze kurulumlara uygun modeller sunar. Örneğin tek fazlı bir müstakil evde 7,4 kW'lık bir cihaz tesisata uyarken, üç fazlı bir iş yeri otoparkında 11 veya 22 kW'lık bir cihaz aynı kabloyla daha hızlı şarj sağlar; bu yüzden cihaz seçmeden önce tesisatın tek faz mı üç faz mı olduğunu teyit etmek doğru güç kararını kolaylaştırır.",
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
      "Onboard charger (araç içi şarj ünitesi), elektrikli aracın içinde bulunan ve AC şarjda gelen alternatif akımı bataryanın ihtiyaç duyduğu doğru akıma çeviren birimdir. AC şarj hızının üst sınırını çoğunlukla istasyon değil bu ünite belirler: örneğin 11 kW onboard charger'lı bir araç, 22 kW kapasiteli bir istasyona bağlansa bile yaklaşık 11 kW ile şarj olur, çünkü darboğaz araçtadır. Bu yüzden \"istasyonum 22 kW olduğu hâlde neden daha hızlı dolmuyor?\" sorusunun yanıtı genellikle aracın onboard charger kapasitesidir. DC hızlı şarjda ise dönüşüm istasyonun içinde yapıldığından onboard charger devre dışı kalır ve aracın AC sınırı geçerli olmaz; güç doğrudan bataryaya verilir. Doğru AC cihazını seçerken aracın onboard charger gücünü bilmek, gereğinden yüksek güçlü bir cihaza para harcamamak açısından önemlidir. Bemis AC wallbox cihazları yaygın onboard charger güçlerine (7,4–22 kW) uygun seçenekler sunar. Pratik bir örnek: aracı yalnızca 11 kW kabul eden bir kullanıcı için evde 22 kW'lık bir cihaz almak ek hız getirmez; bu durumda araca uygun 11 kW'lık bir model hem yeterli hem daha ekonomik olur.",
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
      "Mod 2 ve Mod 3, AC şarj yöntemlerini tanımlar (IEC 61851). Mod 2, araç ile normal ya da endüstriyel (CEE) priz arasında, kabloya entegre bir koruma kutusu (IC-CPD) ile yapılan taşınabilir şarjdır; bu kutu kaçak akım ve sıcaklık koruması sağlar, ama güç prizin sınırıyla kısıtlı kaldığı için Mod 2 görece yavaştır ve daha çok acil/seyrek kullanım veya seyahat çözümüdür. Mod 3 ise sabit bir şarj istasyonu (wallbox) üzerinden yapılan, araç ile istasyonun sürekli haberleştiği kalıcı AC şarjdır; akım güvenle ayarlandığı için daha yüksek güç ve daha güvenli, günlük kullanıma uygun bir şarj sunar. Ev, iş yeri ve site otoparklarındaki wallbox'lar Mod 3 çalışır. Bemis hem Mod 2 taşınabilir şarj çözümleri hem Mod 3 sabit AC wallbox cihazları üretir. Pratikte sabit istasyon bulunmayan bir yerde Mod 2 cihaz prize takılarak yedek/acil şarj sağlarken, günlük şarj için evde duvara monte bir Mod 3 wallbox hem daha hızlı hem daha güvenlidir; bu yüzden Mod 2 genellikle bagajda taşınan tamamlayıcı çözüm, Mod 3 ise asıl günlük kurulumdur.",
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
      "RFID (Radio Frequency Identification), şarj istasyonlarında kullanıcı yetkilendirmesi için kullanılan temassız kart teknolojisidir. Kullanıcı, kendisine tanımlı kartını cihaza okutarak şarjı başlatır; kart okutulmadan oturum açılmaz, böylece istasyonu yalnızca yetkili kişiler kullanabilir. Bu yöntem, kamuya açık alanlarda, iş yerlerinde, sitelerde ve araç filolarında yetkisiz kullanımı engellemenin yanı sıra her şarj oturumunu belirli bir karta (dolayısıyla bir kişiye veya departmana) bağlar. Bu kayıt, tüketimin kullanıcı bazında raporlanmasını ve maliyetlerin doğru paylaştırılmasını mümkün kılar; OCPP uyumlu sistemlerde yetkilendirme merkezi yönetim yazılımı üzerinden de yönetilebilir. Bemis'in akıllı (OCPP uyumlu) modelleri RFID ile yetkilendirmeyi destekler. Örneğin bir site otoparkında her sakine bir kart tanımlanır; böylece dışarıdan biri istasyonu kullanamaz ve her ailenin tükettiği enerji ayrı raporlanarak aidat veya fatura paylaşımı adil yapılır. Bir iş yeri filosunda da kartlar departmanlara atanarak hangi aracın ne kadar şarj aldığı kolayca izlenir.",
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
      "Taper (kademeli yavaşlama), bataryanın belli bir doluluğa (sıklıkla yaklaşık %80) ulaşmasından sonra şarj hızının kasıtlı olarak düşürülmesidir. Bu bir arıza ya da cihaz kusuru değil, bataryayı koruyan normal bir davranıştır: hücreler dolmaya yaklaştıkça yüksek akımı güvenle kabul edemez, ısınma ve yıpranma riskini azaltmak için aracın batarya yönetim sistemi daha az akım ister. Bu nedenle ilk %80'lik bölüm hızlı dolarken, son %20 orantısız biçimde uzar; özellikle DC hızlı şarjda bu fark belirgindir. Pratikte en verimli kullanım, hızlı şarjı yaklaşık %80'de bırakıp yola devam etmektir; %100'e tamamlamak gereksiz zaman kaybına yol açabilir. Bu davranış esas olarak araçtan kaynaklanır, şarj cihazının markasından değil; Bemis'in DC hızlı şarj üniteleri de bataryanın istediği akım eğrisine uyum sağlar. Örneğin uzun yol molasında bir DC istasyonunda aracı %80'de bırakıp yola devam etmek, son %20 için ekstra beklemekten çok daha verimlidir; evde gece AC ile şarjda ise süre baştan uzun olduğu için %100'e tamamlamak sorun yaratmaz. Yani taper'ı bilmek, yol üstünde zaman planlamasını kolaylaştırır.",
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
      "Wallbox, duvara monte edilen sabit AC şarj istasyonudur. Ev, iş yeri ve site otoparklarında kullanılır; tipik olarak Type 2 soketli ve 7,4–22 kW güç aralığındadır ve Mod 3 yöntemiyle çalışır. Aracın gece boyu ya da gün içinde park hâlindeyken, taşınabilir prizden şarja göre çok daha hızlı ve güvenli dolmasını sağlar; sürekli haberleşme sayesinde akım güvenle ayarlanır ve kaçak akım koruması bulunur. Sabit kurulumu sayesinde günlük kullanıma uygundur ve kablo karmaşası yaratmaz. Akıllı modeller OCPP, mobil uygulama, yük yönetimi (DLM) ve RFID ile yetkilendirme gibi özellikler sunarak çok cihazlı ve filo kurulumlarına da uygun hâle gelir. Bemis'in Charger serisi, Type 2 standardında ve IP65/IP66 korumalı yerli üretim AC wallbox cihazlarıdır. Örneğin bir ev kullanıcısı garaj duvarına taktığı wallbox ile aracını gece boyu sessizce şarj ederken; bir iş yeri, otoparkına birden çok wallbox kurup OCPP ile merkezi izleme, yük yönetimi ve RFID yetkilendirme ekleyerek çalışan araçlarını tek panelden yönetebilir. IP65/IP66 koruması sayesinde cihaz açık otoparkta dış duvara da takılabilir.",
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
