/**
 * ÜRÜN SEO BEKÇİSİ — `npm run check:seo`  (canlı API okur, YAZMAZ)
 *
 * 🔴 YAKALADIĞI SESSİZ KUSUR: `applyProductSeo` → `pick(veri, kod)`. Veri
 *    katmanındaki (`R2 products` / `productsEn` / repo `data/products*.json`)
 *    `meta*` değeri DOLUYSA `app/lib/productSeo.ts` haritasını EZER. Bu tasarım
 *    gereğidir (operatör admin'den özelleştirebilsin) AMA veri katmanında ESKİ
 *    kopyalar kalırsa kod haritasına yapılan her düzeltme SESSİZCE YUTULUR.
 *
 * 📌 2026-09-12'de ölçüldü: 12 üründe canlı değer koddan farklıydı.
 *    · 6 wallbox varyantı → GSM / MID Sayaçlı ayrımı kaybolmuş, 4 grupta
 *      10 ürün AYNI metaTitle'ı paylaşıyordu (Google kopya-başlık sinyali).
 *    · pro-mobile → adı "Pro Mobile 2" olmuştu, meta hâlâ "Pro Mobile 22 kW".
 *    · 5 DC ünitesi → meta "IP65" diyordu, GERÇEK SPEC "IP54". Ağustos'ta
 *      kodda düzeltilmiş ama veri yuttuğu için CANLIYA HİÇ ÇIKMAMIŞTI →
 *      aylarca Google sonucunda fazla koruma iddiası servis edildi.
 *
 * ⚠️ Bir ürünün meta'sı BİLEREK özelleştirildiyse (admin'den yazıldıysa)
 *    aşağıdaki BILEREK_FARKLI listesine GEREKÇESİYLE ekle — yoksa bekçi
 *    her çalıştırmada onu sorun sayar.
 * ⚠️ BUILD ZİNCİRİNE EKLENMEDİ: uyarı denetimi (check:clones · check:i18n ile
 *    aynı gerekçe). Dağıtımı durdurmaz.
 * 📌 `app/lib/productSeo.ts` düzenledikten SONRA çalıştır — düzeltmen canlıya
 *    çıkacak mı, yoksa veri katmanı yutacak mı, tek komutla görürsün.
 */
import { PRODUCT_SEO } from "../app/lib/productSeo";

const ALANLAR = ["metaTitle", "metaDescription", "focusKeyword", "keywords"] as const;
const BASLIK_SINIRI = 62; // Google'ın masaüstünde tipik kestiği uzunluk

/** "<ürün id>|<alan>" → gerekçe. Bilerek özelleştirilmiş meta alanları. */
const BILEREK_FARKLI = new Map<string, string>([]);

const r = await fetch("https://www.bemisevcharge.com.tr/api/products", {
  headers: { "user-agent": "BemisSeoBekci/1.0" },
});
if (!r.ok) { console.error(`🔴 /api/products ${r.status} — ölçüm yapılamadı`); process.exit(1); }
const j = (await r.json()) as any;
const kats: any[] = Array.isArray(j) ? j : j.categories ?? [];

type U = { kat: string; id: string; p: any };
const urunler: U[] = [];
for (const k of kats) for (const p of k.products ?? []) urunler.push({ kat: k.id, id: p.id, p });

const kodAnahtar = new Set(Object.keys(PRODUCT_SEO));
const canliId = new Set(urunler.map((u) => u.id));

// (1) veri katmanı kod haritasını EZİYOR mu?
type Fark = { id: string; kat: string; alan: string; canli: string; kod: string };
const farklar: Fark[] = [];
for (const u of urunler) {
  const s = (PRODUCT_SEO as Record<string, any>)[u.id] ?? {};
  for (const a of ALANLAR) {
    const canli = String(u.p[a] ?? "").trim();
    const kod = String(s[a] ?? "").trim();
    if (!canli || !kod || canli === kod) continue;
    if (BILEREK_FARKLI.has(`${u.id}|${a}`)) continue;
    farklar.push({ id: u.id, kat: u.kat, alan: a, canli, kod });
  }
}

// (2) kopya metaTitle (canlı, servis edilen değer)
const baslik = new Map<string, string[]>();
for (const u of urunler) {
  const t = String(u.p.metaTitle ?? "").trim();
  if (!t) continue;
  if (!baslik.has(t)) baslik.set(t, []);
  baslik.get(t)!.push(u.id);
}
const kopya = [...baslik].filter(([, ids]) => ids.length > 1);

// (3) uzun başlık · (4) kaydı olmayan ürün · (5) yetim kayıt · (6) meta'sı hiç olmayan ürün
const uzun = [...baslik].filter(([t]) => t.length > BASLIK_SINIRI);
const kayitsiz = urunler.filter((u) => !kodAnahtar.has(u.id));
const yetim = [...kodAnahtar].filter((k) => !canliId.has(k));
const metasiz = urunler.filter((u) => !String(u.p.metaTitle ?? "").trim());

console.log(`canlı ürün: ${urunler.length} · PRODUCT_SEO kaydı: ${kodAnahtar.size}`);

if (farklar.length) {
  const idler = [...new Set(farklar.map((f) => f.id))];
  console.log(`\n🔴 (1) VERİ KATMANI KOD HARİTASINI EZİYOR: ${farklar.length} alan · ${idler.length} ürün`);
  console.log(`      → kod haritasındaki düzeltme CANLIYA ÇIKMIYOR. Çözüm: o ürünün`);
  console.log(`        R2 + repo meta* anahtarlarını SİL (⚠️ "" yazma, delete et).`);
  for (const id of idler) {
    console.log(`   ▸ ${id}`);
    for (const f of farklar.filter((x) => x.id === id)) {
      console.log(`       ${f.alan}\n         CANLI: ${f.canli.slice(0, 110)}\n         KOD  : ${f.kod.slice(0, 110)}`);
    }
  }
}
if (kopya.length) {
  console.log(`\n🔴 (2) KOPYA metaTitle: ${kopya.length} grup`);
  console.log(`      → Google "bunlar aynı sayfa" sayıp birini bastırır.`);
  for (const [t, ids] of kopya) console.log(`   "${t}"\n       ${ids.join(", ")}`);
}
if (uzun.length) {
  console.log(`\n🟡 (3) ${BASLIK_SINIRI} karakteri aşan metaTitle: ${uzun.length}`);
  for (const [t] of uzun) console.log(`   ${t.length} kr  "${t}"`);
}
if (kayitsiz.length) {
  console.log(`\n🟡 (4) PRODUCT_SEO kaydı OLMAYAN ürün: ${kayitsiz.length} (otomatik üretilene düşer)`);
  for (const u of kayitsiz) console.log(`   ${u.kat}/${u.id}`);
}
if (yetim.length) {
  console.log(`\n🟡 (5) haritada VAR ama katalogda YOK (yetim kayıt): ${yetim.length}`);
  for (const y of yetim) console.log(`   ${y}`);
}
if (metasiz.length) {
  console.log(`\n🟡 (6) canlıda metaTitle BOŞ: ${metasiz.length}`);
  for (const u of metasiz) console.log(`   ${u.kat}/${u.id}`);
}

const toplam = farklar.length + kopya.length + uzun.length + kayitsiz.length + yetim.length + metasiz.length;
console.log(
  toplam
    ? `\n🔴 ${toplam} sorun.`
    : `\n✅ Ürün SEO bekçisi: temiz (${urunler.length} ürün · ezilen alan 0 · kopya başlık 0 · uzun başlık 0 · kayıtsız 0 · yetim 0).`,
);

// ⚠️ `process.exit()` KULLANMA — bu betik `fetch` yapıyor ve Windows'ta canlı
//    keep-alive soketi açıkken process.exit() çağırmak Node'u teardown'da
//    `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` ile düşürüyor →
//    çıkış kodu 127 oluyor ve bekçi TEMİZKEN DE "başarısız" görünüyor
//    (2026-09-12'de ölçüldü). `process.exitCode` ile kodu bildir, süreç
//    kendiliğinden kapansın.
process.exitCode = toplam ? 1 : 0;
