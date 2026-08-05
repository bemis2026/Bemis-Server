// KLON AÇIKLAMA DENETİMİ — yeni ürün eklerken mevcut bir kardeşten klonlanıp
// açıklaması uyarlanmayan kayıtları bulur (BAK-8200-0002'de bizzat yaşandı:
// DC Soket Tutucu, AC wallbox tutucusunun metnini taşıyordu, 6 dilde).
// Yöntem: AYNI açıklamayı paylaşan ama ADI FARKLI AİLEDEN olan ürünleri eşle.
const fs = require("fs");
// ⚠️ repo data/products.json ÇIPLAK DİZİ; R2 bin'i ise { products: [...] } — ikisini de kabul et.
const path = require("path");
const _J = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "products.json"), "utf8"));
const K = Array.isArray(_J) ? _J : _J.products;

// Ad çekirdegi: parantez/varyant eki atilir -> "Mini Mobile 8m" ile "Mini Mobile" ayni aile
const aile = (ad) => String(ad).toLocaleLowerCase("tr").replace(/\(.*?\)/g, "").replace(/\d+\s*(m|kw|a)\b/g, "").replace(/[^a-zçğıöşü ]/g, "").replace(/\s+/g, " ").trim();

const kova = new Map();
for (const kat of K) for (const p of (kat.products || [])) {
  const d = String(p.description || "").trim();
  if (d.length < 40) continue;
  if (!kova.has(d)) kova.set(d, []);
  kova.get(d).push({ kod: p.code, ad: p.name, kat: kat.id, aile: aile(p.name) });
}

let bulgu = 0;
for (const [desc, liste] of kova) {
  if (liste.length < 2) continue;
  const aileler = new Set(liste.map((x) => x.aile));
  if (aileler.size < 2) continue;         // ayni aile ayni metni paylasabilir -> normal
  bulgu++;
  console.log("\n⚠️  " + liste.length + " ürün AYNI açıklamayı paylaşıyor ama " + aileler.size + " FARKLI aileden:");
  console.log("    \"" + desc.slice(0, 110) + "…\"");
  for (const x of liste) console.log("      " + String(x.kod).padEnd(18) + x.ad + "   [" + x.kat + "]");
}
console.log(bulgu ? "\nŞüpheli klon: " + bulgu : "\n✅ Aileler arası klon açıklama yok");
