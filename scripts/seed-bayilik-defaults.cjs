/**
 * Tek seferlik: bayilik bin'ine network stats + tab-aware criteria
 * varsayılan değerlerini yaz. Mevcut criteria field'ı korunur, sadece
 * yeni trCriteria / intlCriteria / networkStats alanları eklenir.
 *
 * Çalıştırma:
 *   $env:JSONBIN_MASTER_KEY="$2a$10$..."   # PowerShell
 *   node scripts/seed-bayilik-defaults.cjs
 *
 * veya bash:
 *   JSONBIN_MASTER_KEY='$2a$10$...' node scripts/seed-bayilik-defaults.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) {
  console.error("HATA: JSONBIN_MASTER_KEY ortam değişkeni boş.");
  console.error("Vercel → Settings → Environment Variables → JSONBIN_MASTER_KEY değerini kopyala,");
  console.error("PowerShell'de:  $env:JSONBIN_MASTER_KEY=\"$2a$10$...\"");
  console.error("sonra:          node scripts/seed-bayilik-defaults.cjs");
  process.exit(1);
}

const BIN_ID = "69e5093d36566621a8cd7509"; // b2b bin
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const TR_CRITERIA = [
  "Elektrik, enerji veya otomotiv sektöründe en az 5 yıl faaliyet",
  "Yetkili satış ve teknik servis kapasitesi",
  "Bölgesel müşteri portföyü veya alt-bayi ağı",
  "Showroom / sergi alanı (önerilir)",
  "Sertifikalı kurulum ekibi veya alt yüklenici ağı",
  "Finansal yeterlilik ve düzenli sipariş kapasitesi",
];

const INTL_CRITERIA = [
  "Ülke veya bölge için tek-dağıtıcılık (exclusive) taahhüdü",
  "EV şarj veya elektrik altyapı pazarına hakimiyet",
  "Yerel ürün sertifikasyon yeterliliği (CE, ulusal standartlar)",
  "İthalat lisansı ve gümrük operasyon altyapısı",
  "Bölgesel depo ve lojistik kapasitesi",
  "Minimum yıllık ciro / sipariş hedefi taahhüdü",
  "Satış sonrası servis ve müşteri destek altyapısı",
];

const NETWORK_STATS = [
  { value: "30+",  label: "Yıl Sektör Tecrübesi" },
  { value: "80+",  label: "İlde Yetkili Bayi"    },
  { value: "60+",  label: "Ülke İhracat"          },
  { value: "24/7", label: "Teknik Destek"         },
];

(async () => {
  try {
    console.log("→ b2b bin okunuyor...");
    const readRes = await fetch(`${BASE}/latest`, {
      headers: { "X-Master-Key": MASTER },
    });
    if (!readRes.ok) throw new Error(`Read ${readRes.status}`);
    const json = await readRes.json();
    const record = json.record ?? {};

    const cur = record.bayilik ?? {};
    const before = {
      criteria: (cur.criteria ?? []).length,
      trCriteria: (cur.trCriteria ?? []).length,
      intlCriteria: (cur.intlCriteria ?? []).length,
      networkStats: (cur.networkStats ?? []).length,
    };
    console.log("  mevcut:", JSON.stringify(before));

    const next = {
      ...record,
      bayilik: {
        ...cur,
        // criteria zaten varsa dokunma — sadece trCriteria boşsa onu da bunla doldur
        trCriteria:  cur.trCriteria?.length   ? cur.trCriteria   : TR_CRITERIA,
        intlCriteria: cur.intlCriteria?.length ? cur.intlCriteria : INTL_CRITERIA,
        networkStats: cur.networkStats?.length ? cur.networkStats : NETWORK_STATS,
      },
    };

    console.log("→ Yazılıyor...");
    const writeRes = await fetch(BASE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER,
      },
      body: JSON.stringify(next),
    });
    if (!writeRes.ok) {
      const text = await writeRes.text();
      throw new Error(`Write ${writeRes.status}: ${text}`);
    }

    console.log("✓ Bitti. /bayilik sayfası 60 sn içinde güncel veriyle yenilenir.");
    console.log("  Admin panelden dilediğin zaman değiştirebilirsin.");
  } catch (err) {
    console.error("HATA:", err.message);
    process.exit(1);
  }
})();
