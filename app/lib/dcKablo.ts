// /dc-sarj-kablosu iniş sayfası — GÖRÜNÜR METNİN TEK KAYNAĞI.
//
// ⚠️ NEDEN AYRI VERİ DOSYASI (şehir sayfalarıyla aynı desen):
//   (a) metin JSX içine ham yazılmadığı için `npm run check:i18n` 5. sınıfı
//       (görünür ham Türkçe metin) bu sayfada yanlış alarm vermez — dosya
//       muafiyeti eklemeye gerek kalmaz;
//   (b) SSS **TEK KAYNAK**: hem görünen bölüm hem FAQPage şeması buradan
//       beslenir → şema ile sayfadaki metin ayrışamaz (Google'ın "şemadaki
//       içerik sayfada görünür olmalı" kuralı).
//
// ⚠️ SAYFA TÜRKÇE-ÖZEL (TR-only): hedef kitle Türkiye'deki şarj istasyonu
//    üreticileri, işletmeciler ve saha servisleri. Karşılığı olmayan hreflang
//    Google'da karşılıklılık hatası üretir → yalnız self-canonical.
//
// ⚠️ UYDURMA SPEC YOK. Tabloda yalnız katalogda KAYITLI olan alanlar var:
//    akım kademesi · kablo uzunluğu · ürün kodu. Gerilim, IP sınıfı, sıcaklık
//    aralığı, sıcaklık sensörü, çevrim sayısı ve iletken kesiti ürün verisinde
//    KAYITLI DEĞİL → sayfada da GEÇMİYOR. Teknik föy gelince eklenebilir.

export type DcKabloSatir = {
  akim: string;
  uzunluk: string;
  kod: string;
  slug: string;
};

/** 8 SKU — değerler `charger-equipment` kategorisindeki ürün kayıtlarından. */
export const DC_KABLO_TABLOSU: DcKabloSatir[] = [
  { akim: "80 A",  uzunluk: "5 m", kod: "BEVDC-4011-0005", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-80a-5m" },
  { akim: "80 A",  uzunluk: "8 m", kod: "BEVDC-4011-0008", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-80a-8m" },
  { akim: "150 A", uzunluk: "5 m", kod: "BEVDC-1011-0005", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-150a-5m" },
  { akim: "150 A", uzunluk: "8 m", kod: "BEVDC-1011-0008", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-150a-8m" },
  { akim: "250 A", uzunluk: "5 m", kod: "BEVDC-2011-0005", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-250a-5m" },
  { akim: "250 A", uzunluk: "8 m", kod: "BEVDC-2011-0008", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-250a-8m" },
  { akim: "400 A", uzunluk: "5 m", kod: "BEVDC-3011-0005", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-400a-5m" },
  { akim: "400 A", uzunluk: "8 m", kod: "BEVDC-3011-0008", slug: "dc-sarj-soketi-ccs2-bir-ucu-acik-400a-8m" },
];

export const DC_KABLO_URUN_TABANI = "/products/charger-equipment";

/** ⚠️ SSS TEK KAYNAK — görünen bölüm + FAQPage şeması aynı diziden. */
export const DC_KABLO_SSS = [
  {
    q: "Bir ucu açık CCS2 şarj kablosu ne demek?",
    a: "Kablonun bir ucunda fabrikada sonlandırılmış CCS2 konnektör bulunur; diğer ucu açık bırakılmıştır. Açık uç, DC hızlı şarj ünitesinin kendi güç bağlantısına doğrudan sonlandırılır. Böylece kablo seti ünitenin içine monte edilerek kullanılır; ayrı bir ara bağlantı elemanı gerekmez.",
  },
  {
    q: "DC şarj kablosu ile CCS2 soketi aynı şey mi?",
    a: "Sahada iki isim de aynı ürün için kullanılır. “CCS2 soketi” konnektörün kendisini, “DC şarj kablosu” ise konnektör ile kablonun oluşturduğu seti anlatır. Bemis kataloğunda ürün, konnektör ve kablosu birlikte tek parça olarak sunulur; bu yüzden her iki arama da aynı ürüne çıkar.",
  },
  {
    q: "Hangi akım kademesini seçmeliyim?",
    a: "Seçim, kablonun bağlanacağı DC ünitenin çıkış akımına göre yapılır. Katalogda 80 A, 150 A, 250 A ve 400 A kademeleri bulunur. Ünitenin etiket değerine eşit ya da onun üzerindeki kademe seçilir; ünitenin çıkış akımından düşük bir kademe seçilmemelidir.",
  },
  {
    q: "5 metre mi, 8 metre mi almalıyım?",
    a: "Uzunluk, ünite ile aracın park edeceği nokta arasındaki mesafeye ve kablonun askı/kılavuz düzenine göre seçilir. Ünitenin iki tarafına da araç yanaşıyorsa ya da park yeri üniteden uzaktaysa 8 metre tercih edilir. Gereğinden uzun kablo yerde daha fazla sürtünür ve daha çabuk yıpranır.",
  },
  {
    q: "Sahadaki bir ünitenin kablosu hasar gördüğünde tamamı mı değişir?",
    a: "Hayır. CCS2 kablo seti ünitenin değiştirilebilir bir parçasıdır; konnektör gövdesi kırıldığında, kablo ezildiğinde ya da kilit mekanizması zarar gördüğünde ünitenin tamamı değil yalnızca kablo seti değiştirilir. Değişim, ünitenin üreticisi veya yetkili servisi tarafından yapılmalıdır.",
  },
  {
    q: "Farklı bir üreticinin DC ünitesinde kullanılabilir mi?",
    a: "Ürün, bir ucu açık olarak teslim edildiği için sonlandırma ünitenin kendi güç bağlantısına yapılır ve bu bağlantı üniteden üniteye değişir. Bu nedenle uygunluk değerlendirmesi ve montaj, ilgili ünitenin üreticisi ya da yetkili servisi tarafından yapılmalıdır. Akım kademesi, uzunluk ve bağlantı bilgisini iletirseniz doğru ürünü birlikte belirleyebiliriz.",
  },
];

export const DC_KABLO = {
  slug: "dc-sarj-kablosu",

  metaTitle: "DC Şarj Kablosu ve CCS2 Soketi — 80–400 A, Bir Ucu Açık",
  metaDescription:
    "Elektrikli araç DC hızlı şarj istasyonları için bir ucu açık CCS2 şarj kablosu: 80, 150, 250 ve 400 A kademeleri, 5 ve 8 metre. İstasyon üreticileri, işletmeciler ve saha servisleri için — yerli üretim, CE. Üreticisinden teklif alın.",
  keywords:
    "dc şarj kablosu, ccs2 şarj kablosu, ccs2 kablo, dc hızlı şarj kablosu, ccs2 soket, dc şarj soketi, şarj istasyonu kablosu, ccs2 konnektör, yedek dc şarj kablosu, şarj istasyonu yedek parça, oem ccs2 kablo",

  eyebrow: "OEM VE YEDEK PARÇA",
  h1: "DC Şarj Kablosu ve CCS2 Soketi",
  tagline: "Bir ucu açık CCS2 kablo setleri · 80–400 A · 5 ve 8 metre",
  giris:
    "DC hızlı şarj ünitelerine doğrudan sonlandırılan, bir ucu açık CCS2 şarj kablosu üretiyoruz. Şarj istasyonu üreticileri üretim hattında, işletmeciler ve saha servisleri ise sahadaki ünitelerin kablo değişiminde kullanır. Bursa'daki kendi tesisimizde üretilir.",

  ctaBirincilEtiket: "Teklif Al",
  ctaBirincilHref: "/iletisim",
  ctaIkincilEtiket: "Tüm Ekipmanları İncele",
  ctaIkincilHref: "/products/charger-equipment",

  rozetler: ["IEC 62196-3 · CCS2", "Yerli üretim", "CE", "OEM tedarik"],

  // ── Ürün nedir ────────────────────────────────────────────────────────
  nedirBaslik: "“Bir ucu açık” ne anlama geliyor?",
  nedirMaddeler: [
    {
      baslik: "Bir uç: CCS2 konnektör",
      metin:
        "Araca takılan uç fabrikada sonlandırılmış hâlde gelir. IEC 62196-3 kapsamındaki CCS2 (Combo 2) arayüzünü kullanır.",
    },
    {
      baslik: "Diğer uç: açık",
      metin:
        "Kablonun ünite tarafındaki ucu açık bırakılır ve DC ünitenin kendi güç bağlantısına doğrudan sonlandırılır. Ara bağlantı elemanı gerekmez.",
    },
    {
      baslik: "Akım kademesi ve uzunluk",
      metin:
        "Ünitenin çıkış akımına göre 80, 150, 250 veya 400 A; saha yerleşimine göre 5 veya 8 metre seçilir.",
    },
  ],

  // ── Seçim tablosu ─────────────────────────────────────────────────────
  tabloBaslik: "Akım kademesi ve uzunluk seçimi",
  tabloAciklama:
    "Katalogdaki sekiz sürüm. Ürün sayfasında teknik özellikler, görsel ve liste fiyatı yer alır.",
  tabloBasliklari: { akim: "Akım kademesi", uzunluk: "Kablo uzunluğu", kod: "Ürün kodu", link: "Ürün sayfası" },
  tabloLinkEtiket: "İncele",

  // ── Kimler kullanıyor ─────────────────────────────────────────────────
  kimBaslik: "Kimler için",
  kimKartlar: [
    {
      baslik: "Şarj istasyonu üreticileri",
      metin:
        "DC ünite üretiminde, ünitenin çıkış akımına uygun kademede kablo seti. OEM tedarik için akım kademesi ve uzunluk talebe göre belirlenir.",
    },
    {
      baslik: "İşletmeciler ve filo sahipleri",
      metin:
        "Sahadaki üniteler için yedek kablo seti. Hasarlı kablo değiştirildiğinde ünite yeniden hizmete alınır; ünitenin tamamının değişmesi gerekmez.",
    },
    {
      baslik: "Teknik servis firmaları",
      metin:
        "Konnektör gövdesi kırılması, kablo ezilmesi ya da kilit mekanizması hasarı gibi durumlarda kablo seti değişimi için kullanılır.",
    },
  ],

  // ── Saha senaryosu ────────────────────────────────────────────────────
  sahaBaslik: "Sahada kablo neden değişir?",
  sahaMetin:
    "DC şarj kabloları ağırdır ve kullanım sırasında yere düşer, üzerinden araç geçer, askıdan çıkar ya da çekilerek zorlanır. Zamanla konnektör gövdesi çatlar, kilit mekanizması sıkışır veya kablo kılıfı zarar görür. Bu durumların hemen hepsinde ünitenin kendisi sağlamdır; değişmesi gereken yalnızca kablo setidir.",
  sahaMaddeler: [
    "Kablonun bağlı olduğu ünitenin çıkış akımını doğrulayın.",
    "Mevcut kablo uzunluğunu ve askı düzenini ölçün.",
    "Açık ucun ünite içinde nasıl sonlandırıldığını not edin.",
    "Bu üç bilgiyle doğru kademeyi birlikte belirleyelim.",
  ],

  // ── Kapanış ───────────────────────────────────────────────────────────
  kapanisBaslik: "Doğru kademeyi birlikte belirleyelim",
  kapanisMetin:
    "Ünitenin çıkış akımını, ihtiyaç duyduğunuz kablo uzunluğunu ve adet bilgisini iletin; uygun ürünü ve teklifi hazırlayalım.",
  kapanisBirincilEtiket: "Teklif Al",
  kapanisBirincilHref: "/iletisim",
  kapanisIkincilEtiket: "DC Şarj Üniteleri",
  kapanisIkincilHref: "/products/dc-units",

  sssBaslik: "Sıkça Sorulan Sorular",

  ilgiliBaslik: "İlgili sayfalar",
  ilgiliLinkler: [
    { etiket: "Şarj Ünitesi Ekipmanları", href: "/products/charger-equipment" },
    { etiket: "DC Hızlı Şarj Üniteleri", href: "/products/dc-units" },
    { etiket: "CCS2 nedir?", href: "/sozluk/ccs2" },
    { etiket: "OEM ve Kurumsal Satış", href: "/b2b" },
  ],
} as const;
