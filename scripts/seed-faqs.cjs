// One-shot seed for: (1) per-category Sıkça Sorulan Sorular and (2)
// the per-product `compatibleVehicles` field on the V2L variants. Both
// updates idempotent — re-running the script with the same JSONBin
// master key just writes the same payload back.
//
// FAQ revision in this version: the C2L answer used to claim it was
// vehicle-to-vehicle energy transfer; corrected to its actual meaning
// (Charger-to-Load — converts the Type 2 socket on a charging unit
// into Schuko / CEE outlets so a public charger can be used as a
// general AC source).
//
//   PowerShell : $env:JSONBIN_MASTER_KEY="$2a$10$..."; node scripts/seed-faqs.cjs
//   bash       : JSONBIN_MASTER_KEY='$2a$10$...' node scripts/seed-faqs.cjs

const KEY = process.env.JSONBIN_MASTER_KEY;
if (!KEY) {
  console.error("JSONBIN_MASTER_KEY environment variable is required.");
  process.exit(1);
}

const BINS = {
  content:  "69e5093daaba88219716e044",
  products: "69e5093e856a6821894eaee8",
};
const BASE = "https://api.jsonbin.io/v3/b";

async function readBin(id) {
  const r = await fetch(`${BASE}/${id}/latest`, { headers: { "X-Master-Key": KEY }});
  if (!r.ok) throw new Error(`read ${id} failed: ${r.status}`);
  const j = await r.json();
  return j.record;
}

async function writeBin(id, body) {
  const r = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`write ${id} failed: ${r.status} ${err}`);
  }
}

const FAQS = {
  wallbox: [
    {
      q: "AC Wallbox şarj cihazını evimde nasıl kullanırım?",
      a: "Bemis AC Wallbox cihazları hem ev hem iş yerlerine duvar tipi olarak kurulur. Müstakil ev veya villada doğrudan ana hat sigortasından çekilen bir besleme hattı yeterlidir. Apartmanda kullanım için bina yönetiminin onayı ve ortak sayaca bağlı bir kurulum planı gereklidir. Yetkili bayimiz keşif sonrası en uygun seçeneği önerir."
    },
    {
      q: "7 kW ile 11 kW ve 22 kW arasındaki fark nedir?",
      a: "7 kW tek fazlı bağlantıyla çalışır ve gece şarjı için yeterlidir; tipik bir EV'yi 6-8 saatte tam şarj eder. 11 kW ve 22 kW üç fazlı bağlantı gerektirir; 22 kW ile aynı araç 2-3 saat içinde dolar. Aracınızın AC şarj kabul gücü 11 kW ise 22 kW cihaz almak ek hız sağlamaz; satın almadan önce araç manuelinizi kontrol edin."
    },
    {
      q: "Type 2 konnektör tüm elektrikli araçlarla uyumlu mu?",
      a: "Evet. Avrupa pazarında satılan tüm elektrikli araçlar (Tesla Model 3/Y dahil), Çin menşeli BYD ve MG modelleri, Kore ve Japon EV'leri AC tarafında IEC 62196-2 (Type 2) standardını kullanır. Bemis Wallbox cihazlarımız bu standarttadır; ek bir adaptör gerekmez."
    },
    {
      q: "Dinamik yük dengeleme nedir?",
      a: "Aynı şebeke hattına bağlı diğer cihazlar yüksek güç çekerken (klima, fırın, ısı pompası) wallbox şarj gücünü otomatik olarak düşürür ve sigorta atmasını engeller. Çoklu wallbox kurulumlarında ise kullanılabilir toplam gücü cihazlar arasında dengeli paylaştırır. Hem güvenlik hem de altyapı maliyetini düşüren kritik bir özelliktir."
    },
    {
      q: "IP65 koruma sınıfı ne anlama gelir?",
      a: "IP65, cihazın toza tamamen kapalı olduğunu (6) ve her yönden gelen su jetlerine karşı dayanıklı olduğunu (5) gösterir. Bemis Wallbox'larımız bu sınıftadır; açık otopark, balkon ve dış mekan kurulumlarında ek bir koruyucu kabin gerektirmez."
    },
    {
      q: "Kurulum dahil mi?",
      a: "Cihaz fiyatına kurulum dahil değildir. Yetkili bayimiz keşif yaparak hat çekimi, kablolama ve sigorta panosu çalışmaları için ayrı bir teklif verir. Ortalama kurulum maliyeti 5.000-15.000 TL arasında değişir; mevcut altyapıya göre belirlenir."
    }
  ],
  portable: [
    {
      q: "Taşınabilir şarj cihazı normal prizden çalışır mı?",
      a: "Evet. Bemis Mobile Charger ürünlerimiz hem standart 16A tek fazlı priz hem de 32A endüstriyel tip CEE prizlerle çalışır. Pro modeller üç fazlı 32A prizden 22 kW'a kadar şarj sunar; Mini modeller ise 3.6 kW ile ev tipi prizlere uygundur."
    },
    {
      q: "Mini Mobile ile Pro Mobile arasındaki fark nedir?",
      a: "Mini Mobile: 3.6 kW tek faz, kompakt boyut, ev/seyahat için ideal. Pro Mobile: 7-22 kW arası ayarlanabilir güç, üç fazlı destek, profesyonel kullanım için. Pro modelinde ekran üzerinden akım sınırı (6A-32A) ayarlanabilir; Mini'de güç sabittir."
    },
    {
      q: "Mobile şarj cihazı su altında kalırsa ne olur?",
      a: "IP54 koruma sınıfı yağmurda kullanıma uygundur ancak ürün su altında kalmamalıdır. Cihaz kasası ıslandıktan sonra fişe takılmadan önce kuru bir bezle silinmelidir. Su basması durumunda yetkili servise götürmeden çalıştırmayın."
    },
    {
      q: "Yolculukta yedek olarak kullanılabilir mi?",
      a: "Evet, taşınabilir şarj cihazları tam olarak bu amaca yöneliktir. Otel, kamp alanı, tatil köyü gibi DC/AC şarj noktası bulunmayan yerlerde mevcut prizlerden şarj yapılır. Çantasında saklanır, ortalama 4-6 kg ağırlığındadır."
    },
    {
      q: "Mobile şarj ile sabit wallbox arasında nasıl seçim yaparım?",
      a: "Aracınızı her gün aynı yerde park ediyorsanız sabit wallbox daha hızlı, daha güvenli ve uzun vadede daha ekonomiktir. Sık seyahat ediyorsanız veya birden fazla mekan arasında geçiş yapıyorsanız mobile şarj cihazı daha esnek bir çözümdür. İkisini de almak da yaygın bir tercihtir."
    }
  ],
  cables: [
    {
      q: "AC şarj kablosu kaç metre olmalı?",
      a: "5 metre kablonun çoğu durumda yeterli olduğunu görüyoruz: araç şarj soketinin park edilirken duvara mesafesi 3-4 metreyi geçmiyorsa idealdir. Garaj/otopark düzeniniz farklıysa 7.5 m veya 10 m seçenekleri vardır. Kablo ne kadar uzun olursa o kadar ağır ve esnemezdir; gereksiz uzun seçim taşımayı zorlaştırır."
    },
    {
      q: "Type 2 ile Type 1 arasındaki fark nedir?",
      a: "Type 1 (SAE J1772) Kuzey Amerika ve eski Asya araçlarında kullanılır, tek fazlı 7.4 kW'a kadar destek verir. Type 2 (IEC 62196-2) Avrupa standardıdır ve üç fazlı 22 kW'a kadar destek verir. Türkiye pazarındaki neredeyse tüm yeni EV'ler Type 2 kullanır. Tesla Model S/X'in eski versiyonları Type 1 idi; yeni Tesla'lar Type 2'dir."
    },
    {
      q: "16A ile 32A kablo arasında nasıl seçim yapmalıyım?",
      a: "16A kablolar tek fazda 3.7 kW, üç fazda 11 kW'a kadar dayanır. 32A kablolar tek fazda 7.4 kW, üç fazda 22 kW kapasitelidir. Wallbox veya araç ne kadar yüksek akım çekebiliyorsa, kabloyu o akıma göre seçin; kabloda darboğaz kalırsa şarj hızı düşer."
    },
    {
      q: "Kablo seçimi araç markasına göre değişir mi?",
      a: "Konnektör tipi standartlaştığı için (Type 2 hemen hemen tüm Avrupa pazarında) kablo seçimi marka bağımsızdır. Tek fark her aracın AC şarj kabul kapasitesidir: 11 kW kabul eden bir araca 22 kW kablo alsanız fazla güç akmaz, sadece güvenlik fazlalığı olur."
    },
    {
      q: "Üç fazlı kablo benim aracımla çalışır mı?",
      a: "Evet, üç fazlı kablo aynı zamanda tek fazlı şarjı da destekler. Aracınız tek fazlıysa kablo otomatik olarak tek fazda çalışır ve 7.4 kW ile sınırlanır. Üç fazlı kablo, ileride üç fazlı bir araç almanız durumunda gereksiz değişiklik yapmamanızı sağlar."
    }
  ],
  "v2l-c2l": [
    {
      q: "V2L (Vehicle to Load) ne işe yarar?",
      a: "V2L, aracınızın bataryasını taşınabilir bir güç kaynağı olarak kullanmanızı sağlar. Adaptör araç soketine takılır ve standart 220V çıkış verir. Kamp, outdoor etkinlik, elektrik kesintisi gibi durumlarda buzdolabı, projektör, küçük cihaz çalıştırabilirsiniz. Enerji aracın bataryasından gelir."
    },
    {
      q: "C2L (Charger to Load) ne işe yarar?",
      a: "C2L adaptör, AC şarj istasyonunun Type 2 soketinden çekilen elektriği standart Schuko (ev tipi) veya CEE (sanayi tipi) prize dönüştürür. Böylece bir Type 2 şarj noktası, sadece araç şarjı değil — atölye, etkinlik alanı veya geçici kurulum için 220V/380V çıkış olarak da kullanılabilir. Enerji şarj ünitesinden gelir, aracınızın bataryasını kullanmaz."
    },
    {
      q: "V2L ile C2L arasındaki fark nedir?",
      a: "Tek farkı enerjinin nereden geldiğidir: V2L enerjiyi ARAÇTAN alır (aracın bataryası kaynak) — aracınız mobil bir güç kaynağına dönüşür. C2L enerjiyi ŞARJ ÜNİTESİNDEN alır (Type 2 charger kaynak) — bir şarj noktasını klasik prize çevirir. İkisi farklı amaçlara hizmet eder; Kombi Set ile her iki adaptörü tek pakette alabilirsiniz."
    },
    {
      q: "Hangi araçlar V2L destekler?",
      a: "Hyundai Ioniq 5/6, Kia EV6/EV9, Genesis GV60, Ssangyong (KGM) Torres EVX, MG ZS EV / MG4, BYD Atto 3 / Seal / Han, Skywell ET5 gibi araçlar fabrika çıkışı V2L destekler. Bemis V2L adaptörlerimiz bu üreticilerin soket pin diziliminde üretilir — ürünü seçerken aracınıza uygun varyantı işaretleyin (Hyundai/Kia/Ssangyong, MG, BYD/Skywell). Tesla araçları standart olarak desteklemez."
    },
    {
      q: "V2L adaptörden ne kadar güç çekilebilir?",
      a: "Aracın V2L gücüne bağlıdır. Hyundai/Kia çoğu modelde 3.6 kW (16A), BYD ve MG modelleri 2.2 kW (10A), bazı yeni modeller 7.2 kW'a kadar çıkar. Bemis V2L adaptörlerimiz aracın çıkış gücünü güvenli şekilde aktarır; aracınızın limitini aşmaz. Tekli, ikili ve üçlü prizli versiyonlar aynı toplam gücü paylaştırır."
    },
    {
      q: "V2L kullanımı bataryaya zarar verir mi?",
      a: "Hayır. V2L üretici tarafından öngörülen bir kullanım modudur; batarya yönetim sistemi (BMS) deşarj derinliğini kontrol eder. Çoğu araç, V2L modunda batarya seviyesini %20'ye indiğinde otomatik kapatır. Sürekli kullanım batarya ömrünü etkilemez."
    }
  ],
  converters: [
    {
      q: "Şarj kablosu uzatması güvenli mi?",
      a: "Bemis uzatma kablolarımız orijinal kablonun aynı standartlarında (IEC 62196-2, 32A bakır iletken) üretilir. IP54 sınıfı bağlantı bölümleri suya karşı korunur. Üçüncü taraf düşük kaliteli uzatmalar yangın riski oluşturabilir; sadece sertifikalı ürünler kullanın."
    },
    {
      q: "Hangi durumlarda uzatma kullanmak gerekir?",
      a: "Aracın park ettiği yer wallbox'ın bulunduğu duvardan uzaksa, otopark giriş alanı uzun çekiyorsa, kamp gibi mobil ortamlarda yük noktası uzaksa uzatma kullanılır. Standart 5 m kablonuz yetiyorsa ek uzatma gereksizdir; her bağlantı noktası ek bir hassasiyet noktasıdır."
    },
    {
      q: "Dönüştürücü ile farklı konnektör tipleri uyumlu yapılabilir mi?",
      a: "Evet. Type 1'den Type 2'ye, CEE prizden Type 2'ye, Type 2'den Schuko'ya gibi yaygın dönüşümler için adaptörlerimiz vardır. Ancak DC ile AC arasında dönüşüm yapılmaz; her sistem ayrı çalışır. Dönüştürücüler güç sınırını düşük tarafa göre alır."
    },
    {
      q: "Uzatma kablosu maksimum kaç metre olabilir?",
      a: "Toplam kablo uzunluğu (orijinal + uzatma) tek fazda 22 kW için 15 metreyi, üç fazda 11 kW için 25 metreyi geçmemelidir. Daha uzun mesafelerde kablo direnci nedeniyle güç düşer ve ısınma artar. Uzun mesafe gereken kurulumlarda sabit kablolama önerilir."
    },
    {
      q: "Türkiye'de hangi soket tipleri yaygın?",
      a: "Ev şarjında Schuko (standart Türk prizi), 16A endüstriyel CEE mavi priz, 32A CEE kırmızı üç fazlı priz yaygındır. Halka açık AC noktalarda Type 2 standarttır. DC hızlı şarjda CCS2 (en yaygın) ve CHAdeMO (Nissan/eski araçlar) görülür."
    }
  ],
  "charger-equipment": [
    {
      q: "Şarj Ünitesi Ekipmanları kategorisinde ne bulunur?",
      a: "Şarj istasyonu kurulumlarında kullanılan profesyonel ekipmanlar yer alır: AC ve DC şarj soketleri (Type 2, CCS2), kablolu ve kablosuz versiyonlar, soket kapakları, kilit mekanizmaları, opsiyonel iletişim modülleri ve şarj cihazı içine entegre edilebilen yedek parçalar. OEM üreticiler ve servis kullanır."
    },
    {
      q: "DC şarj soketi ile AC şarj soketi farkı nedir?",
      a: "AC soketler (Type 2) maksimum 22 kW alternatif akım iletir, basit yapıdadır. DC soketler (CCS2) 50-350 kW doğru akım iletir, içinde sıvı soğutma, sıcaklık sensörü ve daha kalın iletkenler bulunur. DC soketler 3-4 kat daha ağırdır ve özel kurulum gerektirir."
    },
    {
      q: "Şarj istasyonu kurmak isteyen bir operatör için ne gerekli?",
      a: "Trafo bağlantısı veya yeterli abonelik gücü, OCPP 1.6J/2.0.1 destekli şarj cihazları, fatura/yönetim için bir CPO yazılımı, EPDK lisansı veya bayi sözleşmesi gerekir. Bemis B2B ekibimiz turnkey kurulum için site etüdünden donanım tedarikine kadar destek verir."
    },
    {
      q: "CCS2 soket nedir?",
      a: "Combined Charging System 2 (CCS2), Avrupa pazarının DC hızlı şarj standardıdır. Type 2 AC konnektörünün altına iki ek DC pin eklenmiş kombine bir tasarımdır; aynı araç soketinden hem AC hem DC şarj yapılabilir. 50-350 kW arası güç destekler."
    },
    {
      q: "Yedek soket veya kablo değişimi mümkün mü?",
      a: "Evet. Bemis şarj cihazlarımızın kabloları ve soketleri modüler tasarımdadır; aşınma veya hasar durumunda yetkili servisimiz hızla değiştirebilir. CCS2 sıvı soğutmalı kablolar gibi özel parçalar için stok yönetimi yapıyoruz."
    }
  ],
  accessories: [
    {
      q: "RFID kart neden gerekli?",
      a: "RFID kart, şarj istasyonunda kullanıcı yetkilendirmesi sağlar — istemediğiniz biri cihazı kullanamaz. Kurumsal/işyeri kurulumlarında kim hangi araçla ne kadar şarj yaptığını takip etmek için kullanılır. OCPP destekli istasyonlarda mobil uygulamayla da aynı işi yapabilirsiniz."
    },
    {
      q: "Şarj kablosu çantası neden alınmalı?",
      a: "Mobile şarj cihazını araç bagajında çantasız taşımak hem kabloyu hem aracın iç döşemesini hırpalar. Çanta bezdeki nemi izole eder, fişleri ezilmeye karşı korur ve seyahat sırasında pratik kullanım sağlar. Pro Mobile ürünlerimizde çanta standart, diğerlerinde opsiyonel olabilir."
    },
    {
      q: "Bemis aksesuarları diğer markalarla uyumlu mu?",
      a: "Konnektör standartları (Type 2, CCS2, RFID Mifare) evrensel olduğundan Bemis aksesuarlarımız ABB, Schneider, Wallbox, Easee ve diğer büyük markalarla uyumludur. Marka-spesifik özellikler (firmware kilidi, tescilli kart sistemi) varsa dökümanda belirtilir."
    },
    {
      q: "Yedek aksesuar siparişi nasıl verilir?",
      a: "Doğrudan iletişim formundan ürün kodu ile talep iletilebilir, satış ekibimiz bayi yönlendirmesi yapar. Toplu sipariş veren operatörler için OEM hesap üzerinden API ile entegre sipariş mümkündür. Stoğumuzda olmayan parçalar 2-4 hafta içinde temin edilir."
    },
    {
      q: "RFID kart kaybolursa ne yapmalıyım?",
      a: "Kart kaybolduğunda admin panelinden veya satış ekibimize bildirerek devre dışı bırakılabilir. Yeni bir kart eşleşmesi 5 dakikada tamamlanır. Kayıp kartla yetkisiz kullanım riski ihmal edilebilir; çünkü her kart cihaz kayıt sistemine bağlıdır."
    }
  ],
  "dc-units": [
    {
      q: "DC şarj ile AC şarj arasındaki fark nedir?",
      a: "AC şarjda elektrik araca alternatif akım olarak gider ve içerideki dönüştürücü doğru akıma çevirir; bu nedenle 22 kW ile sınırlıdır. DC şarjda dönüşüm istasyonun içinde yapılır ve doğru akım doğrudan bataryaya akar; 50-350 kW'a kadar çıkabilir. Sonuç: DC ile bir EV 20-40 dakikada %80'e ulaşırken, AC'de 6-8 saat gerekir."
    },
    {
      q: "BEVDC modelleri kaç araç şarj edebilir aynı anda?",
      a: "BEVDC-40 tek soketli, 40 kW gücü tek araca verir. BEVDC-80, BEVDC-120, BEVDC-160 ve BEVDC-200 çift soketlidir; toplam güç iki araç arasında eş zamanlı paylaştırılabilir. Örneğin BEVDC-200 aynı anda iki araca 100 kW verebilir veya tek araca 200 kW (araç destekliyorsa)."
    },
    {
      q: "DC şarj cihazı kurulumu için ne gereklidir?",
      a: "DC üniteler 3 fazlı 380-480V şebeke bağlantısı, BEVDC-120 ve üzeri için trafo veya yüksek güçlü abonelik (200-400 kVA), zemin sabitleme platformu, soğutma için yeterli hava akımı, OCPP iletişimi için Ethernet veya 4G hattı gerektirir. Bemis B2B ekibi site etüdünden devreye almaya kadar tüm süreci yönetir."
    },
    {
      q: "Hangi BEVDC modeli benim filom için uygundur?",
      a: "Filo aracınız ortalama 50-60 kWh batarya ile şehir içiyse BEVDC-40 yeterlidir. Uzun yolculuk yapan ticari filo veya hızlı dönüş gereken taksi/kurye için BEVDC-120 ile 30 dakikada %80 dolum sağlanır. Kamuya açık yüksek trafiğe yönelik istasyonlarda BEVDC-160/200 önerilir; aynı anda iki araç hızla şarj olur."
    },
    {
      q: "Kamuya açık DC şarj noktası açmak için ne gerekli?",
      a: "EPDK'dan şarj hizmeti yönetmeliği kapsamında lisans veya yetki belgesi, OCPP destekli cihaz, EPVIS sistemine entegrasyon, fatura/ödeme altyapısı (Bemis CPO yazılımı veya 3. parti) gereklidir. Yatırım büyüklüğü 1-3 milyon TL arasında değişir; B2B ekibimiz yol haritası hazırlamada destek verir."
    }
  ],
};

// V2L variants currently encode car-brand compatibility in their
// subtitle ("Hyundai · Kia · Ssangyong" etc). Promote that into a real
// `compatibleVehicles: string[]` field so the public side can render it
// as a labeled chip row without parsing free text. Subtitles that
// describe shape/size (e.g. "Tek Çıkışlı", "3m. Kablolu · Tek Priz")
// are skipped — only legit brand strings get lifted.
const KNOWN_BRANDS = new Set([
  "Hyundai", "Kia", "Ssangyong", "MG", "BYD", "Skywell",
  "Tesla", "Genesis", "Polestar", "Volkswagen", "VW",
]);

function vehiclesFromSubtitle(subtitle) {
  if (!subtitle || typeof subtitle !== "string") return null;
  const parts = subtitle.split(/[·,]/).map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const allBrands = parts.every(p => KNOWN_BRANDS.has(p));
  return allBrands ? parts : null;
}

async function seedFaqs() {
  console.log("→ Reading content bin...");
  const content = await readBin(BINS.content);
  if (!content?.categories || typeof content.categories !== "object") {
    throw new Error("content.categories missing — unexpected bin shape");
  }
  let touched = 0;
  for (const [catId, faq] of Object.entries(FAQS)) {
    if (!content.categories[catId]) {
      console.warn(`  ⚠ category '${catId}' not in content bin — skipping`);
      continue;
    }
    content.categories[catId].faq = faq;
    console.log(`  ✓ ${catId}: ${faq.length} sorular eklendi`);
    touched++;
  }
  if (content.warranty) {
    delete content.warranty;
    console.log("  ✓ legacy content.warranty alanı temizlendi");
  }
  console.log(`→ Writing content bin (${touched} kategori güncellendi)...`);
  await writeBin(BINS.content, content);
}

async function seedV2LVehicles() {
  console.log("→ Reading products bin...");
  const products = await readBin(BINS.products);
  const arr = Array.isArray(products) ? products : products.products;
  if (!Array.isArray(arr)) throw new Error("products bin shape unexpected");
  const v2l = arr.find(c => c.id === "v2l-c2l");
  if (!v2l) {
    console.warn("  ⚠ v2l-c2l category not in products bin — skipping vehicles seed");
    return;
  }
  let updated = 0;
  for (const p of v2l.products ?? []) {
    const vehicles = vehiclesFromSubtitle(p.subtitle);
    if (vehicles) {
      p.compatibleVehicles = vehicles;
      console.log(`  ✓ ${p.name}: ${vehicles.join(", ")}`);
      updated++;
    } else if (p.compatibleVehicles) {
      // Keep manually-curated compatibleVehicles untouched on re-runs
      // when the subtitle no longer parses cleanly (e.g. operator
      // edited the subtitle to remove brands).
    }
  }
  console.log(`→ Writing products bin (${updated} V2L ürünü güncellendi)...`);
  await writeBin(BINS.products, products);
}

async function main() {
  await seedFaqs();
  await seedV2LVehicles();
  console.log("✓ Done. Admin'de bir TR kayıt yapınca EN otomatik üretilir, ya da scripts/resync-en.cjs / scripts/resync-products-en.cjs çalıştır.");
}

main().catch(e => { console.error(e); process.exit(1); });
