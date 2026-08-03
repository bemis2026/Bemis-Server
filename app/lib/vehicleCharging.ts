// Araç → şarj uyumluluğu verisi.
//
// ⚠️⚠️ UYDURMA SPEC YASAK — buradaki her satır DIŞ KAYNAKTAN DOĞRULANDI.
// Kaynak: EV Database (ev-database.org), 2026-08-03'te tek tek okundu.
// Yeni araç eklerken: önce ev-database.org'daki model sayfasından "on-board
// charger" değerini oku, `source` alanına kaydı yaz. Doğrulayamadığın modeli
// TABLOYA EKLEME — eksik satır, yanlış satırdan iyidir.
//
// 📌 NEDEN BU SAYFA VAR (2026-08-03): V2L ailesi 28 günde 88 organik oturum
// getirirken /products/wallbox 5, /products/cables 4 getiriyordu. Ölçüldü:
// V2L sayfasında 6 ARAÇ MARKASI geçiyor (Togg, Ioniq, BYD, Tesla, Kia),
// wallbox'ta 2, kablolarda 1, taşınabilirde 0. Kullanıcı "Togg'a hangi şarj
// kablosu" diye arıyor ve sitede eşleşecek metin yok. Bu sayfa o boşluğu
// kapatır — V2L'yi kazandıran deseni (araç adı + spesifik cevap) kopyalar.

export type VehicleCharging = {
  /** Görünen ad — kullanıcının arattığı yazım. */
  name: string;
  /** Marka (gruplama/filtre için). */
  brand: string;
  /** AC soketi — Türkiye/Avrupa'da satılan tüm modellerde Type 2. */
  acPort: "Type 2";
  /** Aracın DAHİLİ AC şarj gücü — şarj hızının üst sınırını bu belirler. */
  onboardAc: string;
  /** Donanım/model yılı farkı varsa açıkça yaz (MG4 ve Megane'de var). */
  note?: string;
  /** Doğrulama kaydı — hangi kaynaktan, ne zaman. */
  source: string;
};

/** ⓘ Şarj hızını CİHAZ DEĞİL ARAÇ belirler: 22 kW'lık bir wallbox, dahili AC
 *  ünitesi 11 kW olan bir aracı 11 kW'ın üstünde şarj edemez. Tablodaki
 *  "dahili AC gücü" bu yüzden en kritik sütun. */
export const VEHICLES: VehicleCharging[] = [
  {
    name: "Togg T10X",
    brand: "Togg",
    acPort: "Type 2",
    onboardAc: "11 kW",
    note: "Opsiyonel 22 kW dahili şarj ünitesi sunuluyor; aracınızda hangisinin olduğunu ruhsat/donanım listesinden teyit edin.",
    source: "EV Database — TOGG T10X Long Range RWD (2026-08-03)",
  },
  {
    name: "Togg T10F",
    brand: "Togg",
    acPort: "Type 2",
    onboardAc: "11 kW",
    source: "EV Database — TOGG T10F Long Range RWD (2026-08-03)",
  },
  {
    name: "Hyundai IONIQ 5",
    brand: "Hyundai",
    acPort: "Type 2",
    onboardAc: "11 kW",
    source: "EV Database — Hyundai IONIQ 5 (2026-08-03)",
  },
  {
    name: "Tesla Model Y",
    brand: "Tesla",
    acPort: "Type 2",
    onboardAc: "11 kW",
    source: "EV Database — Tesla Model Y (2026-08-03)",
  },
  {
    name: "BYD ATTO 3",
    brand: "BYD",
    acPort: "Type 2",
    onboardAc: "11 kW",
    source: "EV Database — BYD ATTO 3 (2026-08-03)",
  },
  {
    name: "MG4",
    brand: "MG",
    acPort: "Type 2",
    onboardAc: "6,6 kW",
    note: "Donanıma göre değişiyor: çoğu versiyonda 6,6 kW, bazı 2026 versiyonlarında 11 kW. Üç fazlı tesisat 6,6 kW'lık versiyonda ek hız getirmez.",
    source: "EV Database — MG MG4 (2026-08-03)",
  },
  {
    name: "Renault Megane E-Tech",
    brand: "Renault",
    acPort: "Type 2",
    onboardAc: "22 kW / 11 kW",
    note: "Model yılına göre değişiyor: 2022–2025 sürümlerinde 22 kW, 2025 sonrası sürümlerde 11 kW.",
    source: "EV Database — Renault Megane E-Tech (2026-08-03)",
  },
];

/** Tesisata göre kurulum önerisi — ARACA DEĞİL, EVİN ELEKTRİĞİNE bağlıdır.
 *  Bu ayrım önemli: tek fazlı bir evde 22 kW cihaz 22 kW veremez. */
export const INSTALL_GUIDE = [
  {
    title: "Tek fazlı (monofaze) tesisat",
    body:
      "Türkiye'de konutların çoğu tek fazlıdır. Bu tesisatta ulaşılabilecek pratik üst sınır 7,4 kW'tır (32A). Aracınızın dahili ünitesi 11 kW olsa bile tek fazlı evde 7,4 kW'ı aşamazsınız.",
    product: "Charger 2 · 32A tek faz — ya da taşınabilir Mono Mobile",
  },
  {
    title: "Üç fazlı (trifaze) tesisat",
    body:
      "Üç fazlı tesisatta aracınızın dahili ünitesi neye izin veriyorsa o hıza çıkarsınız: 11 kW'lık araçta 11 kW, 22 kW'lık araçta 22 kW. Cihazı aracın üst sınırına göre seçmek yeterlidir; daha güçlü cihaz ek hız getirmez.",
    product: "Charger 2 / Charger Plus 2 · 32A üç faz (22 kW'a kadar)",
  },
  {
    title: "Sabit kurulum istemiyorum",
    body:
      "Kiracıysanız veya park yeriniz değişiyorsa taşınabilir şarj cihazı uygundur. Prizden çalışır, duvara montaj gerektirmez; kademeli amper ayarıyla tesisatınıza göre akımı düşürebilirsiniz.",
    product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
  },
];

/** Sayfanın SSS'i — hem görünür içerik hem FAQPage şeması (GEO: AI motorları
 *  tek başına anlamlı, olgusal cevapları alıntılar). ⚠️ Cevaplarda ham URL
 *  yazma: düz metin render edilir, sayfanın adıyla tarif et. */
export const VEHICLE_FAQ = [
  {
    q: "Elektrikli arabama hangi şarj kablosu uyar?",
    a: "Türkiye ve Avrupa'da satılan elektrikli otomobillerin tamamına yakını AC şarj için Type 2 (IEC 62196) soket kullanır; Togg, Hyundai, Tesla, BYD, MG ve Renault modelleri dahil. Dolayısıyla kablo seçiminde soket tipi değil, akım sınıfı ve uzunluk belirleyicidir: tek fazlı evde 32A'lık kablo 7,4 kW'a, üç fazlı tesisatta 32A'lık kablo 22 kW'a kadar taşır.",
  },
  {
    q: "22 kW şarj cihazı alırsam arabam daha hızlı mı şarj olur?",
    a: "Hayır. Şarj hızını cihaz değil aracınızın dahili AC şarj ünitesi belirler. Dahili ünitesi 11 kW olan bir araç, 22 kW'lık bir cihaza bağlansa da 11 kW çeker. Cihazı aracınızın üst sınırına ve evinizin tesisatına göre seçmek yeterlidir.",
  },
  {
    q: "Togg'a hangi şarj cihazı uygun?",
    a: "Togg T10X ve T10F, AC şarjda Type 2 soket kullanır ve dahili şarj ünitesi 11 kW'tır (T10X'te opsiyonel 22 kW sunuluyor). Üç fazlı tesisatı olan bir evde 11 kW veya 22 kW'lık bir duvar tipi cihaz uygundur; tek fazlı evde pratik sınır 7,4 kW olur. Taşınabilir kullanım için kademeli amper ayarlı mobil şarj cihazları tercih edilebilir.",
  },
  {
    q: "Evimde üç faz yok, ne yapmalıyım?",
    a: "Tek fazlı tesisatta 7,4 kW'a kadar (32A) şarj yapabilirsiniz; bu, gecelik şarj için çoğu kullanıcıya fazlasıyla yeter. Üç faz çektirmek elektrik dağıtım şirketiyle yürütülen ayrı bir süreçtir ve ek maliyeti vardır. Yetkili bayimiz keşifte mevcut tesisatınızı değerlendirip hangisinin mantıklı olduğunu söyler.",
  },
  {
    q: "Aracımın dahili AC şarj gücünü nereden öğrenirim?",
    a: "Aracın kullanım kılavuzunda ve üreticinin teknik özellik sayfasında \"dahili şarj ünitesi\" (on-board charger) başlığı altında yazar. Aynı modelin farklı donanım paketlerinde bu değer değişebilir; örneğin bazı modellerde 11 kW standart, 22 kW opsiyoneldir.",
  },
  {
    q: "Şarj kablosu kaç metre olmalı?",
    a: "Çoğu ev ve iş yeri kullanımında 5 metre yeterlidir. Aracın şarj soketi park yerine göre uzak kalıyorsa veya kabloyu farklı noktalarda kullanacaksanız 7–10 metre tercih edilir. Kablo uzunluğu şarj hızını etkilemez.",
  },
];
