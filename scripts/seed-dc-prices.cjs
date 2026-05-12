/**
 * Tek seferlik DC katalog düzeltmesi:
 *
 *   1. BEVDC 120 için "Tek Soketli" varyantı ekle (mevcut 2 Soketli
 *      ürünün deep-copy'si, sadece soket sayısı + code + fiyat farklı).
 *      Variant grouping aynı `name` üzerinden çalışıyor, UI tarafında
 *      ekstra iş gerekmiyor.
 *
 *   2. 6 DC modeline KDV-hariç EUR liste fiyatı ekle (mevcut "Fiyat"
 *      group'una; yoksa yarat).
 *
 *   3. 3 demo V2L ürününü sil — V2L Adaptör, C2L Adaptör,
 *      V2L / C2L Kombi Set. Variant'lar dahil tüm aile gider.
 *
 * Çalıştırma (cmd):
 *   cd C:\Users\sales\bemis-evcharge-website
 *   set JSONBIN_MASTER_KEY=$2a$10$zWJKdAUgfHbBy/CeORFuGesiyZ/OdkdVHfK9AiQfwg1fAfbTlnCH.
 *   node scripts/seed-dc-prices.cjs
 */

const MASTER = process.env.JSONBIN_MASTER_KEY;
if (!MASTER) { console.error("JSONBIN_MASTER_KEY eksik."); process.exit(1); }

const BIN_ID = "69e5093e856a6821894eaee8"; // products bin (ana shard)
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// code → liste fiyatı (KDV hariç, EUR)
const DC_PRICES = {
  "BEVDC-40-1":   4296.96,
  "BEVDC-80-2":   9492.48,
  "BEVDC-120-1": 11370.24,   // YENİ varyant: tek soketli
  "BEVDC-120-2": 11612.16,   // mevcut: çift soketli
  "BEVDC-160-2": 14238.72,
  "BEVDC-200-2": 16611.84,
};

const DELETE_NAMES = ["V2L Adaptör", "C2L Adaptör", "V2L / C2L Kombi Set"];

function formatEur(n) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function setPrice(product, eur) {
  product.specs = product.specs ?? [];
  let priceGroup = product.specs.find((g) => /^(fiyat|price)$/i.test(g.group ?? ""));
  if (!priceGroup) {
    priceGroup = { group: "Fiyat", items: [] };
    product.specs.push(priceGroup);
  }
  const valueStr = `${formatEur(eur)} (KDV hariç)`;
  let item = priceGroup.items.find((i) => /liste|fiyat|price/i.test(i.label));
  if (!item) {
    item = { label: "Liste Fiyatı", value: "" };
    priceGroup.items.push(item);
  }
  item.value = valueStr;
}

function clone(o) { return JSON.parse(JSON.stringify(o)); }

(async () => {
  console.log("→ products bin okunuyor...");
  const r = await fetch(`${BASE}/latest`, { headers: { "X-Master-Key": MASTER } });
  if (!r.ok) throw new Error(`Read ${r.status}`);
  const record = (await r.json()).record;
  const isArrayShape = Array.isArray(record);
  const categories = isArrayShape ? record : (record.products ?? []);

  let dcUpdates = 0, variantAdded = 0, deletions = 0;

  for (const cat of categories) {
    // ── DC kategorisi ──
    if (cat.id === "dc-units") {
      // 1. BEVDC-120-1 (tek soketli) yoksa, BEVDC-120-2'yi clone'la
      const existing120Double = (cat.products ?? []).find((p) => p.code === "BEVDC-120-2");
      const has120Single = (cat.products ?? []).some((p) => p.code === "BEVDC-120-1");
      if (existing120Double && !has120Single) {
        const single = clone(existing120Double);
        single.id = (existing120Double.id ?? "bevdc-120-2").replace(/-2$/, "-1");
        if (single.id === existing120Double.id) single.id = single.id + "-tek";
        single.code = "BEVDC-120-1";
        // Subtitle: 2 → 1 soket. "X Soketli" / "X CCS2" gibi rakam içerenleri 2→1 dönüştür.
        if (single.subtitle) {
          single.subtitle = single.subtitle
            .replace(/2\s*Soketli/gi, "1 Soketli")
            .replace(/2\s*CCS2/gi, "1 CCS2")
            .replace(/Çift\s*Soketli/gi, "Tek Soketli");
        } else {
          single.subtitle = "Tek Soketli · 120 kW";
        }
        // Specs içindeki soket sayısı satırlarını 2 → 1 yap.
        (single.specs ?? []).forEach((g) => {
          (g.items ?? []).forEach((it) => {
            if (/soket sayısı|outlet count|output count/i.test(it.label ?? "")) it.value = "1";
            if (/^soket/i.test(it.label ?? "") && /2\s*[×x]\s*ccs2/i.test(it.value ?? "")) {
              it.value = it.value.replace(/2\s*[×x]\s*ccs2/gi, "1 × CCS2");
            }
          });
        });
        // 2 Soketli mevcut ürün'ün subtitle'ına da net etiket koy.
        if (existing120Double.subtitle && !/Çift|2 Soketli/i.test(existing120Double.subtitle)) {
          existing120Double.subtitle = "Çift Soketli · " + existing120Double.subtitle;
        }
        // Yeni varyantı mevcut'un hemen önüne ekle (aile sırası temiz dursun).
        const idx = cat.products.indexOf(existing120Double);
        cat.products.splice(idx, 0, single);
        variantAdded++;
        console.log(`  + Yeni varyant: BEVDC-120-1 (tek soketli, ${existing120Double.id}'den clone)`);
      }

      // 2. Tüm DC ürünlerine fiyat ekle
      for (const p of cat.products ?? []) {
        const price = DC_PRICES[p.code];
        if (price == null) continue;
        setPrice(p, price);
        dcUpdates++;
        console.log(`  ✓ ${p.code}: ${formatEur(price)}`);
      }
    }

    // ── V2L kategorisi: 3 demo ürün ailesini sil ──
    if (cat.id === "v2l-c2l") {
      const before = cat.products?.length ?? 0;
      cat.products = (cat.products ?? []).filter((p) => !DELETE_NAMES.includes(p.name));
      deletions += before - (cat.products?.length ?? 0);
    }
  }

  if (dcUpdates === 0 && variantAdded === 0 && deletions === 0) {
    console.log("Hiçbir değişiklik gerekmedi.");
    return;
  }

  console.log(`\n→ Yazılıyor — DC fiyat: ${dcUpdates}, yeni varyant: ${variantAdded}, V2L silinen: ${deletions}`);
  const payload = isArrayShape ? categories : record;
  const w = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER },
    body: JSON.stringify(payload),
  });
  if (!w.ok) throw new Error(`Write ${w.status}: ${await w.text()}`);
  console.log("✓ Bitti. /products/dc-units ve /products/v2l-c2l sayfaları 60 sn içinde güncellenir.");
  console.log("  EN çevirisi için admin'den TR save (auto-translate) veya:");
  console.log("    node scripts/resync-products-en.cjs");
})();
