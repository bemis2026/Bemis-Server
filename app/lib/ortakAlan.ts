// /apartman-site-sarj-istasyonu iniş sayfası — GÖRÜNÜR METNİN TEK KAYNAĞI.
//
// ⚠️ NEDEN AYRI VERİ DOSYASI (dcKablo.ts ve şehir sayfalarıyla aynı desen):
//   (a) metin JSX içine ham yazılmadığı için `npm run check:i18n` 5. sınıfı
//       (görünür ham Türkçe metin) bu sayfada yanlış alarm vermez;
//   (b) SSS **TEK KAYNAK**: hem görünen akordeon hem FAQPage şeması buradan
//       beslenir → şema ile sayfadaki metin ayrışamaz.
//
// ⚠️ SAYFA TÜRKÇE-ÖZEL (TR-only): hedef kitle Türkiye'deki site/apartman
//    yönetimleri ve toplu konut projeleri. Karşılığı olmayan hreflang Google'da
//    karşılıklılık hatası üretir → yalnız self-canonical.
//
// ⚠️ UYDURMA YOK — sayfadaki HER iddia ürün verisinde kayıtlı:
//    · "ücretsiz yönetim paneli" → `lib/productFeatures.ts` → `ucretsizPanel`
//      (canlıda 19 wallbox SKU'sunun 16'sında var: tüm Plus 2 + Pro 2)
//    · OCPP / ortak kullanım / yük dengeleme → `ocpp` · `shared` · `load`
//    · RFID · mobil uygulama · IP65 → `rfid` · `app` · `ip65`
//    · 3,7–22 kW aralığı → kategori H1'i ve ürün açıklamaları
//    Fiyat, kurulum hizmeti, teslim süresi ve mevzuat izni GEÇMİYOR.
//
// ⚠️ RAKİP ADI YOK, RAKİP FİYATI İDDİASI YOK. Ayrıştırıcı ("panel bizde
//    ücretsiz") kendi teklifimiz üzerinden anlatılır; sektör geneli için
//    mevcut blog yazısındaki ölçülü dil korunur ("genellikle abonelik ya da
//    lisansla sunulur"). Kimin ne aldığı iddia EDİLMEZ.
//
// ⚠️ TOKİ / Emlak Konut gibi kurum adları BİLEREK GEÇMİYOR (kullanıcı kararı,
//    2026-09-15): doğrulanmış kurulumumuz olmadan yazmak müşteri atfı olur.
//    Tür adıyla anlatılır: "toplu konut", "site otoparkı", "apartman ortak alanı".

export type OrtakAlanSatir = {
  cihaz: string;
  panel: string;
  ocpp: string;
  ortak: string;
  slug: string;
  vurgu: boolean;
};

/** Üç aile — değerler canlı ürün kayıtlarının `features` alanından türetildi. */
export const ORTAK_ALAN_TABLOSU: OrtakAlanSatir[] = [
  {
    cihaz: "Charger 2",
    panel: "Yok",
    ocpp: "Yok",
    ortak: "Tek kullanıcılı ev senaryosu",
    slug: "charger-2-kablolu",
    vurgu: false,
  },
  {
    cihaz: "Charger Plus 2",
    panel: "Ücretsiz",
    ocpp: "OCPP 1.6",
    ortak: "Ortak kullanım · yük dengeleme",
    slug: "charger-plus-2-kablolu",
    vurgu: true,
  },
  {
    cihaz: "Charger Pro 2",
    panel: "Ücretsiz",
    ocpp: "OCPP 1.6",
    ortak: "Ortak kullanım · gelişmiş yük yönetimi",
    slug: "charger-pro-2-kablolu",
    vurgu: true,
  },
];

export const ORTAK_ALAN_URUN_TABANI = "/products/wallbox";

/** ⚠️ SSS TEK KAYNAK — görünen bölüm + FAQPage şeması aynı diziden. */
export const ORTAK_ALAN_SSS = [
  {
    q: "Apartman ve site ortak otoparkına şarj istasyonu kurulabilir mi?",
    a: "Teknik olarak evet: ortak otoparka duvar tipi AC şarj istasyonu monte edilir ve binanın elektrik altyapısına bağlanır. Kurulumun önündeki asıl belirleyiciler binanın abone gücü, pano kapasitesi ve ortak alanda yapılacak işler için gereken yönetim kararıdır. Karar süreci ve mevzuat için bina yönetiminize ve yetkili kurumlara danışmanızı öneririz; cihaz tarafındaki güç, ölçüm ve yetkilendirme gereksinimlerini birlikte netleştirebiliriz.",
  },
  {
    q: "Ortak alanda elektriği kim harcadı, nasıl takip edilir?",
    a: "Takip cihazın kendisinde değil, arkasındaki yönetim panelinde yapılır. Panel her şarj oturumunu başlatan kullanıcıya yazar; kWh birim fiyatı tanımlanır ve kişi bazlı raporlama alınır. Kullanıcı yetkilendirmesi RFID kart ile yapıldığı için hangi kartın ne kadar harcadığı kayıt altındadır. Böylece ortak elektrik giderine karışmadan kullanıcı bazında ayrıştırma yapılabilir.",
  },
  {
    q: "Yönetim paneli gerçekten ücretsiz mi, hangi cihazlarda geçerli?",
    a: "Evet. Ortak alan yönetim paneli Charger Plus 2 ve Charger Pro 2 ailelerinde cihazla birlikte gelir; ayrıca abonelik ya da lisans bedeli ödenmez. Ürün sayfalarında bu cihazlar Ücretsiz Yönetim Paneli rozetiyle işaretlidir. Giriş seviyesi Charger 2 tek kullanıcılı ev senaryosu için tasarlanmıştır ve ortak alan yönetimi kapsamında değildir. Sektörde şarj yönetim yazılımları genellikle cihaz başına abonelik ya da yıllık lisansla sunulduğu için, cihaz karşılaştırırken donanım fiyatının yanında arkasından gelen yazılım giderine de bakmakta fayda vardır.",
  },
  {
    q: "Ön ödemeli bakiye nasıl çalışıyor?",
    a: "Kullanıcının RFID kartına bakiye yüklenir ve kullanıcı yalnız kartındaki bakiye kadar şarj yapar. Bakiye bittiğinde şarj başlamaz. Bu yöntem ortak alanda tahsilat sorununu baştan çözer: yönetim, ay sonunda kimden ne kadar alacağını kovalamak yerine bakiyeyi peşin toplamış olur.",
  },
  {
    q: "Mobil uygulama ne işe yarıyor?",
    a: "Mobil uygulama kullanıcı tarafındadır: şarj telefondan başlatılır, durdurulur ve anlık olarak izlenir. Yönetim paneli ise yönetici tarafındadır; birim fiyat tanımlama, bakiye yükleme ve raporlama oradan yapılır. İki katman birlikte çalışır: kullanıcı kendi şarjını görür, yönetim bütün cihazları tek yerden yönetir.",
  },
  {
    q: "Binanın elektrik gücü yetmezse ne olur?",
    a: "Charger Plus 2 ve Charger Pro 2 ailelerinde güç 3,7 – 22 kW aralığında ayarlanabilir; cihaz binanın tesisat sınırına göre kısılabilir. Ayrıca dinamik yük dengeleme, abonelik gücü aşılmadan yükün otomatik dağıtılmasını sağlar. Birden fazla cihazın aynı anda çalıştığı ortak otoparklarda belirleyici olan tek cihazın gücü değil, bu dengeleme katmanıdır.",
  },
];

export const ORTAK_ALAN = {
  slug: "apartman-site-sarj-istasyonu",

  metaTitle: "Apartman ve Site Şarj İstasyonu — Ücretsiz Panel",
  metaDescription:
    "Apartman ve site ortak otoparkı için AC şarj istasyonu. Ortak alan yönetim paneli ücretsiz: RFID ile ön ödemeli bakiye, kişi bazlı raporlama. Teklif alın.",
  keywords:
    "apartman şarj istasyonu, site otoparkı şarj istasyonu, ortak alan şarj yönetim paneli, ücretsiz şarj yönetim yazılımı, toplu konut şarj istasyonu, site yönetimi şarj cihazı, ortak kullanım şarj istasyonu, kişi bazlı şarj takibi, rfid kart ile şarj, apartman elektrikli araç şarj cihazı, ön ödemeli şarj bakiyesi",

  eyebrow: "ORTAK ALAN ÇÖZÜMÜ",
  h1: "Apartman ve Site Otoparkına Şarj İstasyonu",
  tagline: "Ortak alan yönetim paneli ve mobil uygulama ücretsiz · Charger Plus 2 ve Charger Pro 2",
  giris:
    "Ortak otoparkta şarj cihazının montajı işin kolay kısmıdır; asıl mesele elektriği kimin harcadığı ve tahsilatın nasıl yapılacağıdır. Charger Plus 2 ve Charger Pro 2 ailelerinde ortak alan yönetim paneli cihazla birlikte ücretsiz gelir: kWh birim fiyatı tanımlanır, RFID karta ön ödemeli bakiye yüklenir ve kişi bazlı rapor alınır. Cihazlar Bursa'daki kendi tesisimizde üretilir.",

  ctaBirincilEtiket: "Teklif Al",
  ctaBirincilHref: "/iletisim",
  ctaIkincilEtiket: "Cihazları İncele",
  ctaIkincilHref: "/products/wallbox",

  rozetler: ["Ücretsiz yönetim paneli", "OCPP 1.6", "RFID kart", "Dinamik yük dengeleme", "CE · IP65"],

  // ── Ortak alanın asıl sorusu ──────────────────────────────────────────
  nedirBaslik: "Ortak alanda asıl soru: elektriği kim ödeyecek?",
  nedirMaddeler: [
    {
      baslik: "Kişi bazlı ölçüm",
      metin:
        "Panel her şarj oturumunu başlatan kullanıcıya yazar. Ortak elektrik giderine karışmadan kim ne kadar harcadı raporlanabilir.",
    },
    {
      baslik: "Ön ödemeli bakiye",
      metin:
        "RFID karta bakiye yüklenir; kullanıcı yalnız yüklediği kadar şarj yapar. Tahsilat ay sonuna bırakılmaz, peşin toplanır.",
    },
    {
      baslik: "Yetkisiz kullanım yok",
      metin:
        "Şarjı yalnız panelde tanımlı RFID kartlar başlatabilir. Binada oturmayan biri cihazı kullanamaz.",
    },
  ],

  // ── Ayrıştırıcı: panel + uygulama ─────────────────────────────────────
  panelBaslik: "Yönetim paneli ve mobil uygulama — ücretsiz",
  panelMetin:
    "Ortak alan yönetim paneli cihazla birlikte gelir; ayrıca abonelik ya da lisans bedeli ödenmez. Sektörde şarj yönetim yazılımları genellikle cihaz başına abonelik ya da yıllık lisansla sunulur; tek cihazda küçük görünen bu tutar cihaz sayısı arttıkça işletme gideri içinde kalıcı bir kalem hâline gelir. Ortak alan yatırımını değerlendirirken donanım fiyatının yanında arkasından gelen yazılım giderine de bakmak gerekir.",
  panelMaddeler: [
    "kWh birim fiyatı tanımlama",
    "RFID karta ön ödemeli bakiye yükleme",
    "Kişi bazlı kullanım raporu",
    "Mobil uygulamadan şarjı başlatma, durdurma ve anlık takip",
  ],
  panelNot:
    "Ücretsiz yönetim paneli Charger Plus 2 ve Charger Pro 2 ailelerinde geçerlidir; ürün sayfalarında Ücretsiz Yönetim Paneli rozetiyle işaretlidir.",

  // ── Cihaz seçimi ──────────────────────────────────────────────────────
  tabloBaslik: "Ortak alan için hangi cihaz?",
  tabloAciklama:
    "Üç ailenin ortak alan yetenekleri. Her ailenin kablolu, pano-prizli, GSM ve MID sayaçlı sürümleri vardır; ürün sayfalarında tüm sürümler listelenir.",
  tabloBasliklari: {
    cihaz: "Cihaz",
    panel: "Ortak alan paneli",
    ocpp: "Protokol",
    ortak: "Ortak kullanım",
    link: "Ürün sayfası",
  },
  tabloLinkEtiket: "İncele",
  tabloDipnot:
    "GSM sürümü dahili 4G modülü taşır; otoparkta kablolu internet çekilemediği durumlar için tercih edilir. MID sayaçlı sürümde sertifikalı enerji sayacı kasaya entegredir.",

  // ── Kimler için ───────────────────────────────────────────────────────
  kimBaslik: "Kimler için",
  kimKartlar: [
    {
      baslik: "Site ve apartman yönetimleri",
      metin:
        "Ortak otoparkta birden fazla kullanıcıya hizmet veren kurulumlar. Yönetim panelden birim fiyatı belirler, bakiyeyi yükler ve raporu alır.",
    },
    {
      baslik: "Toplu konut projeleri",
      metin:
        "Blok sayısı ve otopark yerleşimi belli olan projelerde, cihaz sayısı ve güç dağılımı bina abone gücüne göre planlanır.",
    },
    {
      baslik: "Ortak otoparkı olan iş yerleri",
      metin:
        "Personel ve ziyaretçi kullanımının ayrıştırılması gereken otoparklar. RFID yetkilendirme ile kimin kullanabileceği tanımlanır.",
    },
  ],

  // ── Kurulum öncesi ────────────────────────────────────────────────────
  hazirlikBaslik: "Kurulum öncesi netleşmesi gerekenler",
  hazirlikMetin:
    "Ortak alan kurulumunda cihaz seçimi genellikle son adımdır. Önce binanın taşıyabileceği yük ve kaç kullanıcıya hizmet verileceği netleşir; cihaz sayısı ve güç kademesi bunun üzerine oturur. Aşağıdaki dört başlık netleştiğinde uygun kurulumu birlikte belirleyebiliriz.",
  hazirlikMaddeler: [
    "Binanın abone gücü ve ana pano kapasitesi.",
    "Şarj edilecek tahmini araç sayısı ve hedeflenen soket sayısı.",
    "Otopark yerleşimi ve panodan cihazlara kablo güzergâhı.",
    "Ortak alanda yapılacak iş için gereken yönetim kararı.",
  ],

  // ── Kapanış ───────────────────────────────────────────────────────────
  kapanisBaslik: "Sitenize uygun kurulumu birlikte belirleyelim",
  kapanisMetin:
    "Bina abone gücünü, otopark yerleşimini ve hedeflediğiniz soket sayısını iletin; uygun cihazı, güç kademesini ve teklifi hazırlayalım.",
  kapanisBirincilEtiket: "Teklif Al",
  kapanisBirincilHref: "/iletisim",
  kapanisIkincilEtiket: "Kurumsal Satış",
  kapanisIkincilHref: "/b2b",

  sssBaslik: "Sıkça Sorulan Sorular",

  ilgiliBaslik: "İlgili sayfalar",
  ilgiliLinkler: [
    { etiket: "AC Wallbox Şarj İstasyonları", href: "/products/wallbox" },
    { etiket: "Ortak Alan Şarj Yönetim Paneli", href: "/blog/ortak-alan-sarj-yonetim-paneli-apartman-site" },
    { etiket: "OCPP nedir?", href: "/sozluk/ocpp" },
    { etiket: "RFID nedir?", href: "/sozluk/rfid" },
  ],
} as const;
