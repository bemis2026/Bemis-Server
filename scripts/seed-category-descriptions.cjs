/**
 * Tek seferlik: 8 ürün kategorisi için açıklama metinlerini content bin'e yaz.
 * Mevcut description boşsa doldurur, dolu olanları korur (overwrite YAPMAZ).
 *
 * Çalıştırma (cmd):
 *   cd C:\Users\sales\bemis-evcharge-website
 *   set JSONBIN_MASTER_KEY=...
 *   node scripts/seed-category-descriptions.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) { console.error("JSONBIN_MASTER_KEY eksik."); process.exit(1); }

const BIN_ID = "69e5093daaba88219716e044"; // content bin
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Brand voice: 1994 Bursa OSB üretimi, sertifikalı (CE / IP65 / IEC),
// 60+ ülke ihracat. Her kategori açıklaması 2-3 kısa cümle —
// arama motorlarının kategori sayfasını sınıflandırması için ürün-tipi
// anahtar kelimeleri içerir, ama satış konuşması yapmaz.
const DESCRIPTIONS = {
  wallbox:
    "Ev, iş yeri ve otopark için tasarlanmış AC duvar tipi şarj istasyonları. 7,4 kW – 22 kW arası tek ve üç fazlı modeller; Type 2 soket veya entegre kablo seçenekleriyle elektrikli aracınızı güvenli ve verimli şekilde şarj eder. CE & IP65 sertifikalı, IEC 61851 / IEC 62196 standartlarına uygun.",

  portable:
    "Kurulum gerektirmeyen taşınabilir AC şarj cihazları — standart prizden veya Cee soketten Type 2 araç soketine kadar. Tek fazlı 2,3 – 7,4 kW ve üç fazlı 11 – 22 kW seçenekleriyle yolda, kampta ve yedek senaryolarda esnek şarj çözümü.",

  cables:
    "Type 2 standartlı Mod 2 ve Mod 3 şarj kabloları. Tek ve üç fazlı, 16A – 32A akım sınıflarında; IEC 62196 / IEC 61851 uyumlu, halojensiz dış kılıf ve yüksek-akım Type 2 konektörü ile uzun ömürlü kullanım için tasarlandı.",

  "v2l-c2l":
    "Aracın bataryasını (V2L) veya şarj cihazını (C2L) harici güç kaynağına dönüştüren adaptörler. Type 2 girişi ve schuko / Cee çıkışları ile Hyundai, Kia, MG, BYD, Ssangyong ve Skywell gibi V2L destekli araçlarla uyumlu — kamp, atölye ve acil durum senaryoları için.",

  converters:
    "Mevcut şarj ekipmanını farklı priz tipleri ve uzaklıklara taşıyan uzatma kabloları ve Ceenorm dönüştürücüler. Tek ve üç fazlı 16A – 32A geçişler için tasarlanmış kombinasyon çözümleri.",

  "charger-equipment":
    "AC ve DC şarj cihazı üreticileri için Type 2 ve CCS2 soketleri, holster setleri, montaj ekipmanları ve bir ucu açık kablolu prizler. OEM müşterilere standart ve özel ölçüde tedarik sağlanır.",

  accessories:
    "RFID kartlar, taşıma çantaları ve montaj aksesuarları — bir şarj sahasının operasyonel ve güvenlik ihtiyaçlarını tamamlayan yan ürünler.",

  "dc-units":
    "BEVDC serisi DC hızlı şarj üniteleri — 40 kW'tan 200 kW'a kadar tek veya çift CCS2 çıkışlı modeller. OCPP 1.6J / 2.0.1 desteği, RFID kimlik doğrulama, IP54 koruma ve geniş sıcaklık aralığı (-25°C / +55°C) ile ticari saha kullanımına uygun.",
};

(async () => {
  console.log("→ content bin okunuyor...");
  const r = await fetch(`${BASE}/latest`, { headers: { "X-Master-Key": MASTER } });
  if (!r.ok) throw new Error(`Read ${r.status}`);
  const record = (await r.json()).record;

  const cats = record.categories ?? {};
  let filled = 0, kept = 0;
  for (const [id, desc] of Object.entries(DESCRIPTIONS)) {
    if (!cats[id]) { console.log(`  skip ${id} (kategori yok)`); continue; }
    if (cats[id].description?.trim()) {
      kept++;
      console.log(`  korundu: ${id} (zaten dolu)`);
    } else {
      cats[id].description = desc;
      filled++;
      console.log(`  yazıldı: ${id}`);
    }
  }

  if (filled === 0) {
    console.log("Hiçbir alan boş değildi — yazma atlandı.");
    return;
  }

  console.log(`→ Yazılıyor (${filled} alan)...`);
  const w = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER },
    body: JSON.stringify(record),
  });
  if (!w.ok) throw new Error(`Write ${w.status}: ${await w.text()}`);
  console.log(`✓ Bitti. ${filled} kategori dolduruldu, ${kept} mevcut açıklama korundu.`);
  console.log("  EN çevirisi: admin'den TR save yap (auto-translate tetiklenir),");
  console.log("  veya: node scripts/resync-en.cjs");
})();
