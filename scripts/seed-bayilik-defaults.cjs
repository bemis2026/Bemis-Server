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

const FORCE = process.argv.includes("--force");

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
  "En az 3 yaşında kurumsal şirket (LTD/A.Ş.) — ticaret sicili ile teyit",
  "A-grubu banka üzerinden minimum 1.000.000 ₺ limitli DBS (Doğrudan Borçlandırma Sistemi) hattı",
  "Fiziksel mağaza / satış noktası",
  "SMM belgeli elektrik mühendisi veya MYK belgeli EV şarj kurulum teknisyeni (minimum 1 kişi)",
  "Markalanmış en az 1 adet servis aracı ve bölgesel saha kurulum kapasitesi",
  "Son 2 yıl bilanço pozitif; iflas / konkordato / icra haciz kaydı bulunmaması (Findeks teyitli)",
  "Açılış siparişinde Bemis E-V Charge'ın belirlediği ürün karması üzerinden stok alımı taahhüdü",
  "Münhasır bölge karşılığında minimum yıllık 5.000.000 ₺ ciro taahhüdü",
  "Aylık dijital + saha pazarlama aktivitesi taahhüdü (sosyal medya, B2B ziyaret raporu)",
  "Bemis E-V Charge Akademi teknik + satış sertifikasyon programını 6 ay içinde tamamlama",
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
        // Default: sadece boşsa yaz. --force ile koşulsuz override.
        trCriteria:   FORCE ? TR_CRITERIA   : (cur.trCriteria?.length   ? cur.trCriteria   : TR_CRITERIA),
        intlCriteria: FORCE ? INTL_CRITERIA : (cur.intlCriteria?.length ? cur.intlCriteria : INTL_CRITERIA),
        networkStats: cur.networkStats?.length ? cur.networkStats : NETWORK_STATS,
      },
    };
    if (FORCE) console.log("  ⚠ --force: trCriteria + intlCriteria koşulsuz override edilecek");

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
