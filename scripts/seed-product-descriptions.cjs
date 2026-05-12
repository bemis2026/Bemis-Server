/**
 * Tek seferlik: 47 ürün ailesi için marka-tonu / teknik-detay / kullanım-
 * senaryosu üçlüsünde yeniden yazılmış description'ları yaz.
 *
 * Variant grouping aynı `name` üzerinden çalışıyor — bu yüzden script
 * "<cat>|<name>" anahtarıyla eşleşen TÜM varyantlara aynı metni atar.
 * Variant'lar arasında ürün-kimliği aynı kalır, sadece subtitle / spec
 * farkları zaten ürün-detay sayfasında ayrı görünür.
 *
 * Çalıştırma (cmd):
 *   cd C:\Users\sales\bemis-evcharge-website
 *   set JSONBIN_MASTER_KEY=$2a$10$zWJKdAUgfHbBy/CeORFuGesiyZ/OdkdVHfK9AiQfwg1fAfbTlnCH.
 *   node scripts/seed-product-descriptions.cjs
 *
 * EN çevirisi sonra: admin'den TR save (auto-translate) veya
 *   node scripts/resync-products-en.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) { console.error("JSONBIN_MASTER_KEY eksik."); process.exit(1); }

const BASE = "https://api.jsonbin.io/v3/b";
const BINS = {
  products:      "69e5093e856a6821894eaee8",  // ana shard
  productsExtra: "69fbcdf1c0954111d8e90670",  // charger-equipment shard
};

// "<cat>|<name>" → yeni description.
// Format: 2-3 cümle. Cümle 1: ne olduğu + teknik parametre. Cümle 2:
// kullanım senaryosu. Cümle 3 (opsiyonel): diferansiyel detay
// (sertifika, malzeme, uyumluluk).
const DESCRIPTIONS = {
  // ── wallbox ──
  "wallbox|Charger 2":
    "Bemis Charger 2, monofaze 7,4 kW ve trifaze 11–22 kW seçenekleriyle ev ve iş yeri kullanımı için tasarlanmış AC duvar tipi şarj istasyonu. 5 metrelik entegre Type 2 kablo veya pano-priz versiyonuyla, CE & IP65 sertifikalı gövdesi açık ve kapalı alanda güvenli çalışır.",
  "wallbox|Charger Plus 2":
    "Charger Plus 2, 4-7-11-22 kW arası ayarlanabilir güç seviyesi ile farklı elektrik tesisatlarına uyum sağlar. Akıllı şarj algoritması, aracın kabul ettiği maksimum akıma otomatik adapte olur; ev ve küçük işletmeler için optimize edildi.",
  "wallbox|Charger Pro 2":
    "Charger Pro 2, 4-7-11-22 kW ayarlanabilir güçte, gelişmiş yük yönetimi (DLM) ve kullanıcı yetkilendirme özellikleriyle profesyonel ortamlar için tasarlandı. OCPP 1.6 protokolü ile şarj ağı entegrasyonuna açık; OEM ve operatör müşteriler için ideal.",
  "wallbox|Charger Pro 2 GSM":
    "Charger Pro 2 GSM versiyonu, dahili 4G modülü ile bulut tabanlı uzaktan izleme ve yönetimi sahaya entegre eder. OCPP 1.6 üzerinden harici operatör platformlarına bağlanır; kablolu internet altyapısı olmayan saha kurulumları için.",

  // ── portable ──
  "portable|Mini Mobile":
    "Mini Mobile, 2,3–3,7 kW gücünde monofaze taşınabilir AC şarj cihazı. Schuko prize doğrudan takılarak ev tipi prizlerden güvenli şarj sağlar; taşıma çantası ile birlikte gelir, yedek ve seyahat senaryolarında ideal.",
  "portable|Mono Mobile":
    "Mono Mobile, 3,7–7,4 kW monofaze taşınabilir şarj cihazı. CEE 16/32A endüstriyel priz adaptörleri ve schuko çıkışı dahil; ev, iş yeri ve mobil kullanım arasında esnek geçiş sağlar.",
  "portable|Pro Mobile":
    "Pro Mobile, 11–22 kW trifaze taşınabilir AC şarj cihazı. CEE 5/16A ve 5/32A endüstriyel adaptörleriyle yüksek güçte saha şarjı sunar; profesyonel ve filo kullanımı için tasarlandı.",

  // ── cables ──
  "cables|Şarj Seti 20A Monofaze":
    "Monofaze 20A — 3,7 kW gücünde Type 2 — Type 2 Mod 3 şarj seti. 3×2,5 mm² + 1×0,75 mm² TTR halojensiz kablo yapısı, ev tipi prizden veya AC wallbox'tan araç şarjı için.",
  "cables|Şarj Seti 32A Monofaze":
    "Monofaze 32A — 7,4 kW gücünde Type 2 — Type 2 Mod 3 şarj seti. 3×6 mm² + 1×0,75 mm² halojensiz kablo ile ev ve iş yeri AC wallbox kullanımı için optimize edildi.",
  "cables|Şarj Seti 20A Trifaze":
    "Trifaze 20A — 11 kW gücünde Type 2 — Type 2 Mod 3 şarj seti. 5×2,5 mm² + 1×0,75 mm² halojensiz kablo; ticari ve iş yeri uygulamaları için orta-güç sınıfı.",
  "cables|Şarj Seti 32A Trifaze":
    "Trifaze 32A — 22 kW maksimum AC kapasiteli Type 2 — Type 2 Mod 3 şarj seti. 5×6 mm² + 1×0,75 mm² halojensiz kablo, hızlı AC şarjı destekleyen tüm kurulumlara uygundur.",

  // ── v2l-c2l ──
  "v2l-c2l|Tek Çıkışlı V2L Adaptör":
    "Aracın Type 2 şarj soketini standart schuko prize dönüştüren tek çıkışlı V2L (Vehicle-to-Load) adaptörü. Hyundai, Kia, MG, BYD, Ssangyong ve Skywell gibi V2L destekli araçlarla uyumlu; kamp, atölye ve acil senaryolar için.",
  "v2l-c2l|Tekli Priz Uzatma V2L Adaptör":
    "3 metre kablo üzerinden tek schuko çıkışlı V2L adaptörü. V2L destekli aracınızı seyyar bir güç kaynağına dönüştürür; kullanım noktasına 3 metre mesafeden enerji aktarır.",
  "v2l-c2l|2'li Priz Uzatma V2L Adaptör":
    "3 metre kablo üzerinden iki ayrı schuko çıkışlı V2L adaptörü. Aynı anda iki cihazı aracın bataryasından besler; saha aydınlatması, atölye ekipmanı veya tatil kullanımı için.",
  "v2l-c2l|3'lü Priz Uzatma V2L Adaptör":
    "3 metre kablo üzerinden üç ayrı schuko çıkışlı V2L adaptörü. Şantiye, kamp veya etkinlik gibi çoklu cihaz beslenmesi gereken senaryolarda aracınızı kompakt bir jeneratöre dönüştürür.",
  "v2l-c2l|C2L Tekli Priz Uzatma Fişli Adaptör":
    "3 metre kablo üzerinden tek schuko çıkışlı C2L (Charger-to-Load) adaptörü. AC şarj cihazının çıkışını harici güç kaynağı olarak kullanmaya olanak tanır; saha ve atölye kurulumları için.",
  "v2l-c2l|C2L 2'li Priz Uzatma Fişli Adaptör":
    "3 metre kablo üzerinden iki schuko çıkışlı C2L adaptörü. Şarj istasyonu çıkışını iki ayrı yüke dağıtır; geçici saha kurulumları ve etkinliklerde pratik enerji çözümü.",
  "v2l-c2l|C2L 3'lü Priz Uzatma Fişli Adaptör":
    "3 metre kablo üzerinden üç schuko çıkışlı C2L adaptörü. Şarj istasyonu çıkışını üç ayrı yüke dağıtarak çoklu ekipmanı tek bağlantı noktasından besler.",
  "v2l-c2l|C2L 5/32A Prizli Uzatma Fişli Adaptör":
    "3 metre kablo üzerinden 5/32A endüstriyel CEE çıkışlı C2L adaptörü. Şarj istasyonu çıkışını yüksek-akımlı sanayi ekipmanına aktarır; şantiye ve sanayi ortamları için.",
  "v2l-c2l|C2C Charger to Caravan Adaptör":
    "3 metre kablo üzerinden 3/16A CEE girişini Type 2 monofaze 16A fişe dönüştüren C2C adaptörü. Karavan ve mobil ünitelerin standart şarj istasyonlarından enerji almasını sağlar.",

  // ── converters ──
  "converters|Cee Norm Adaptör (3×2,5)":
    "30 cm kablolu CEE Norm fiş-priz dönüştürücü adaptör. 3×2,5 mm² TTR kablo, monofaze 16A kapasitede saha ve atölye kullanımı için.",
  "converters|Cee Norm Adaptör (3×6)":
    "30 cm kablolu yüksek-akım CEE Norm fiş-priz dönüştürücü adaptör. 3×6 mm² TTR kablo, monofaze 32A güvenli akım iletimi sağlar.",
  "converters|Standart Adaptör (3×2,5)":
    "Kompakt fiş-priz dönüştürücü adaptör. 3×2,5 mm² TTR kablo, düşük akımlı standart priz uygulamaları için ekonomik çözüm.",
  "converters|Seyyar Uzatma Kablosu Monofaze (3×2,5)":
    "Monofaze 16A — 3×2,5 mm² TTR halojensiz seyyar uzatma kablosu. Atölye, saha ve geçici kurulumlarda esnek enerji aktarımı için.",
  "converters|Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 3/32A)":
    "CEE Norm fiş-priz dönüşümlü seyyar uzatma kablosu. 3×2,5 mm² TTR kablo monofaze 16A girişini trifaze 3 pinli 32A prize aktarır; faz adaptasyonu gereken sahalar için.",
  "converters|Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 5/32A)":
    "CEE Norm dönüşümlü seyyar uzatma kablosu. 3×2,5 mm² TTR kablo monofaze 16A girişini 5 pinli 32A prize aktarır; nötr + toprak içeren sistemlere geçiş için.",
  "converters|Seyyar Uzatma Kablosu Ceenorm 3×6 (3/32A)":
    "Trifaze 32A — 3×6 mm² TTR yüksek-akım seyyar uzatma kablosu. Şantiye ve sanayi kullanımlarında ana panodan iş alanına güvenli güç taşır.",
  "converters|Seyyar Uzatma Kablosu Ceenorm 5×6 (5/32A)":
    "Trifaze + nötr + toprak (5 telli) 32A seyyar uzatma kablosu. 5×6 mm² TTR kablo, profesyonel altyapı projelerinde tam-sistem yükler için uygundur.",

  // ── charger-equipment ──
  "charger-equipment|Bir Uçu Açık Kablolu Şarj Prizi":
    "Şarj ünitesi üreticileri için bir ucu açık kablolu Type 2 şarj prizi. Faz/güç ve uzunluk seçeneklerine göre üretim hattına doğrudan terminasyon — OEM kablolu çözüm.",
  "charger-equipment|Pano Prizi":
    "Şarj panolarına entegrasyon için Type 2 pano prizi. Kilit motorlu monofaze ya da trifaze, 3 veya 4 noktadan montajlı varyantlarla AC şarj cihazı üreticilerine standart bileşen.",
  "charger-equipment|Pano Prizi (Kilit Motorsuz)":
    "Kilit motoru olmayan ekonomik Type 2 pano prizi. Manuel kilitleme gerektirmeyen veya kilit mekanizması ayrı tedarik edilen üretici kurulumları için.",
  "charger-equipment|Bir Ucu Açık Enerji Kablosu":
    "Şarj cihazı üreticileri için 1,5 m bir ucu açık enerji kablosu. Cihaz iç bağlantılarına doğrudan terminasyon, üretim hattı entegrasyonu sağlar.",
  "charger-equipment|Otomatlı IP44 Kombinasyon":
    "IP44 koruma sınıfında otomatlı kombinasyon ünitesi. Taşınabilir mobil şarj cihazları için entegre koruma + dağıtım; iç mekan ve yarı-açık alanlarda kullanıma uygundur.",
  "charger-equipment|Otomatlı IP66 Kombinasyon":
    "IP66 koruma sınıfında otomatlı kombinasyon ünitesi. Tam toza ve güçlü su jetlerine karşı koruma sağlar; dış mekan, deniz kıyısı ve endüstriyel saha kurulumları için.",
  "charger-equipment|DC Şarj Soketi CCS2 (Bir Ucu Açık)":
    "DC hızlı şarj cihazı üreticileri için bir ucu açık CCS2 şarj soketi. İstediğiniz uzunluk ve akım kademesinde DC ünitelere doğrudan terminasyon — OEM kablolu çözüm.",

  // ── accessories ──
  "accessories|Şarj Kablosu Çantası":
    "Type 2 şarj kabloları için dayanıklı, fermuarlı taşıma çantası. Su iticili dış kumaş, kablo ucunu koruyan iç hücre — araç bagajında veya saha kullanımında kabloyu temiz ve düzenli tutar.",
  "accessories|Mobile Charger Çantası":
    "Bemis taşınabilir şarj cihazlarına özel taşıma çantası. Cihaz, kablo ve adaptörler için ayrı bölmeler; saha taşınması sırasında ekipmanı koruma altına alır.",
  "accessories|Priz Tutucu":
    "Kullanılmadığında Type 2 prizin asılarak saklanması için duvar veya pano montajlı tutucu aparat. Kabloyu yerden uzak tutar, kurulumun düzenli ve güvenli kalmasını sağlar.",
  "accessories|Charger Priz Tutucu":
    "Bemis Charger serisi AC wallbox cihazları için tasarlanmış özel priz tutucu. Cihazın gövde rengiyle uyumlu, hızlı kelepçe ile cihaza monte edilir.",
  "accessories|Pedestal":
    "AC şarj istasyonu için zemine montajlı paslanmaz çelik pedestal kaide. Açık alan ve otopark kurulumlarında tek ya da çift cihaz montajına uygundur; kablo geçişi için iç kanallar.",
  "accessories|Mobile Charger Duvar Askı Aparatı":
    "Taşınabilir Bemis şarj cihazları için duvara monte askı aparatı. Cihazın garaj, atölye veya tesiste düzenli ve hazır halde saklanmasını sağlar.",
  "accessories|V2L ve C2L Adaptör Çantası":
    "V2L ve C2L adaptörleri için kompakt taşıma çantası. Adaptör + uzatma kablosu için tek bölmeli düzenleme, saha ekipmanını korur.",

  // ── dc-units ──
  "dc-units|BEVDC 40":
    "40 kW tek CCS2 çıkışlı kompakt DC hızlı şarj istasyonu. Kafe, restoran, otel ve şehir içi otopark kurulumları için ideal güç sınıfı; OCPP 1.6J / 2.0.1 desteği, RFID kullanıcı yetkilendirme, IP54 dış mekan kullanımı.",
  "dc-units|BEVDC 80":
    "80 kW çift CCS2 çıkışlı DC hızlı şarj istasyonu. İki aracı eş zamanlı şarj eden orta-güç çözümü; AVM otoparkları, kurumsal kampüs ve şehirlerarası ana akslar için. OCPP, RFID, IP54 koruma.",
  "dc-units|BEVDC 120":
    "120 kW tek veya çift CCS2 çıkışlı DC hızlı şarj istasyonu. Yüksek-trafiğe sahip otoyol dinlenme alanları ve filo merkezlerinde 30 dakika içinde önemli menzil sağlar; OCPP, RFID, IP54 koruma.",
  "dc-units|BEVDC 160":
    "160 kW çift CCS2 çıkışlı yüksek-güç DC hızlı şarj istasyonu. Otoyol pit-stop ve yoğun ticari filo şarjı için, dinamik güç paylaşımı ile iki aracı maksimum kapasitede besler.",
  "dc-units|BEVDC 200":
    "200 kW çift CCS2 çıkışlı amiral DC hızlı şarj istasyonu. Otoyol koridoru ve yüksek-trafik istasyon kurulumları için en üst güç sınıfı; ultra hızlı şarj senaryolarında 15-20 dakikada önemli menzil ekler.",
};

async function readBin(id) {
  const r = await fetch(`${BASE}/${id}/latest`, { headers: { "X-Master-Key": MASTER } });
  if (!r.ok) throw new Error(`Read ${id}: ${r.status}`);
  return (await r.json()).record;
}

async function writeBin(id, record) {
  const r = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER },
    body: JSON.stringify(record),
  });
  if (!r.ok) throw new Error(`Write ${id}: ${r.status} ${await r.text()}`);
}

function applyToShard(record, shardName) {
  const isArray = Array.isArray(record);
  const categories = isArray ? record : (record.products ?? record);
  let touched = 0;
  for (const cat of categories) {
    for (const p of cat.products ?? []) {
      const key = `${cat.id}|${p.name}`;
      const next = DESCRIPTIONS[key];
      if (next == null) continue;
      if (p.description !== next) {
        p.description = next;
        touched++;
      }
    }
  }
  console.log(`  ${shardName}: ${touched} ürün güncellendi`);
  return { touched, payload: isArray ? categories : record };
}

(async () => {
  console.log("→ shard'lar okunuyor...");
  const [main, extra] = await Promise.all([readBin(BINS.products), readBin(BINS.productsExtra)]);

  console.log("→ description'lar uygulanıyor...");
  const a = applyToShard(main, "products");
  const b = applyToShard(extra, "productsExtra");

  if (a.touched === 0 && b.touched === 0) {
    console.log("Hiçbir değişiklik gerekmedi.");
    return;
  }

  console.log("→ yazılıyor...");
  if (a.touched > 0) await writeBin(BINS.products, a.payload);
  if (b.touched > 0) await writeBin(BINS.productsExtra, b.payload);

  console.log(`\n✓ Bitti. Toplam ${a.touched + b.touched} ürün için açıklama güncellendi.`);
  console.log("  EN çevirisi için: admin'den TR save (auto-translate)");
  console.log("  veya: node scripts/resync-products-en.cjs");
})();
