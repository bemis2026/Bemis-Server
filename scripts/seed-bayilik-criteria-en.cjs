/**
 * Bayilik trCriteria / intlCriteria EN çevirilerini b2b bin'inin
 * _translations.en.bayilik altına yazar. MyMemory atlanır çünkü
 * "DBS", "SMM belgesi", "Findeks" gibi sektörel/regülasyon terimleri
 * otomatik çeviride bozuluyor — manuel curated EN listesi kullanılır.
 *
 * Çalıştırma:
 *   $env:JSONBIN_MASTER_KEY="$2a$10$..."   # PowerShell
 *   node scripts/seed-bayilik-criteria-en.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) {
  console.error("HATA: JSONBIN_MASTER_KEY ortam değişkeni boş.");
  process.exit(1);
}

const BIN_ID = "69e5093d36566621a8cd7509"; // b2b bin
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const TR_CRITERIA_EN = [
  "At least 3-year-old corporate entity (LLC/Inc.) — verified via trade registry",
  "Minimum ₺1,000,000 DDS (Direct Debit System) credit line through a Tier-A bank",
  "Physical store / sales point",
  "Licensed electrical engineer or VQA-certified EV charging installation technician (minimum 1 person)",
  "At least 1 branded service vehicle and regional on-site installation capacity",
  "Positive balance sheet for the last 2 years; no bankruptcy / composition / debt enforcement records (verified via credit bureau)",
  "Opening order commitment based on the product mix defined by Bemis E-V Charge",
  "Minimum annual revenue commitment of ₺5,000,000 in exchange for exclusive territory rights",
  "Monthly digital + field marketing activity commitment (social media, B2B visit reports)",
  "Completion of the Bemis E-V Charge Academy technical + sales certification program within 6 months",
];

const INTL_CRITERIA_EN = [
  "Exclusive distribution commitment for the country or region",
  "Strong market presence in EV charging or electrical infrastructure",
  "Local product certification competence (CE, national standards)",
  "Import license and customs operation infrastructure",
  "Regional warehousing and logistics capacity",
  "Minimum annual revenue / order target commitment",
  "After-sales service and customer support infrastructure",
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

    const translations = record._translations ?? {};
    const en = translations.en ?? {};
    const enBay = en.bayilik ?? {};

    const before = {
      trCriteria: (enBay.trCriteria ?? []).length,
      intlCriteria: (enBay.intlCriteria ?? []).length,
    };
    console.log("  mevcut EN:", JSON.stringify(before));

    const next = {
      ...record,
      _translations: {
        ...translations,
        en: {
          ...en,
          bayilik: {
            ...enBay,
            trCriteria: TR_CRITERIA_EN,
            intlCriteria: INTL_CRITERIA_EN,
          },
        },
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

    console.log(`✓ Bitti. EN trCriteria=${TR_CRITERIA_EN.length}, intlCriteria=${INTL_CRITERIA_EN.length}`);
    console.log("  /bayilik?lang=en 60 sn içinde yeni listeyle yenilenir.");
  } catch (err) {
    console.error("HATA:", err.message);
    process.exit(1);
  }
})();
