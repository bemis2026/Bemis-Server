// GEÇİCİ OLARAK GİZLENEN ÜRÜN KATEGORİLERİ — TEK KAYNAK.
//
// ⚠️ 2026-09-10 · KULLANICI KARARI: **DC şarj cihazlarının satışı DURDURULDU** →
// `dc-units` (BEVDC 40/80/120/160/180/200 + Direk Tipi, 7 cihaz) sitede HİÇBİR
// yerde gösterilmez. **SATIŞTA KALANLAR ETKİLENMEZ:** `charger-equipment`
// içindeki 8 adet "DC Şarj Soketi CCS2" (kablolar) ve `accessories` içindeki
// "DC Soket Tutucu" — onlar ayrı kategorilerde olduğu için dokunulmadı.
//
// 📌 NEDEN VERİ SİLİNMEDİ: ürünler `data/products*.json` + R2'de AYNEN duruyor
// (7 dilde çeviri, spec, görsel, fiyat). Gizleme yalnız GÖSTERİM katmanında →
// satış yeniden açılınca aşağıdaki kümeden `"dc-units"` satırını silmek YETER,
// veri yeniden girilmez.
//
// 📌 GİZLEME NEREDE UYGULANIR (yeni yüzey eklersen buraya bak):
//   1. `app/lib/server-content.ts` → getServerProducts()      [sitemap · meta-catalog.xml · /api/catalog]
//   2. `app/lib/serverProductsLang.ts` → getProductsForLang() [/api/products · TR/EN/dil kolu sayfaları]
//   3. `app/components/Navbar.tsx`   → Ürünler açılır menüsü
//   4. `app/components/Products.tsx` → anasayfa kategori ızgarası (+ kod yedeği)
//   5. `app/components/Footer.tsx`   → footer ürün listesi
//   6. `app/export/ExportLandingClient.tsx` → İngilizce ihracat sayfası kartı
//   7. `app/lib/glossary.ts`         → sözlük "ilgili" bağlantısı
//   8. `app/components/Calculator.tsx` → DC ürün önerisi (DC_URUN boşaltıldı)
//   9. `app/en/products/[id]/page.tsx` → prerender listesi
//  10. `next.config.ts`              → /products/dc-units* için GEÇİCİ (302) yönlendirme
//
// ⚠️ Kategori sayfası/ürün sayfaları artık üretilmiyor; eski adresler 404 yerine
// **302 ile /products'a** gider (blog yazılarındaki bağlantılar ve Google'dan
// gelen ziyaretçi boşluğa düşmesin). 302 = GEÇİCİ → arama motoru adresi unutmaz,
// satış açılınca sıralama geri gelir. **301 KULLANMA** (kalıcı sayılır).

export const GIZLI_KATEGORILER: ReadonlySet<string> = new Set(["dc-units"]);

export function kategoriGizli(id: unknown): boolean {
  return typeof id === "string" && GIZLI_KATEGORILER.has(id);
}

/** Kategori dizisinden gizli olanları eler. Şekli bozmaz, yeni dizi döner. */
export function gizliKategorileriEle<T>(kategoriler: T[]): T[] {
  if (!Array.isArray(kategoriler) || GIZLI_KATEGORILER.size === 0) return kategoriler;
  return kategoriler.filter((k) => !kategoriGizli((k as { id?: unknown })?.id));
}
