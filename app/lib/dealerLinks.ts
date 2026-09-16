/**
 * Bayi bağlantılarını GÜVENLE kurar.
 *
 * 🔴 NEDEN VAR (2026-09-17, GSC 404 raporundan çıktı):
 *    Search Console'daki 8 "Bulunamadı (404)" adresinden biri
 *    **`https://www.bemisevcharge.com.tr/www.evocity.com.tr`** idi.
 *    Sebep: bayi verisinde `website` alanı PROTOKOLSÜZ kayıtlı
 *    (`"www.evocity.com.tr"`), ve `<a href={dealer.website}>` ham basılınca
 *    tarayıcı bunu KENDİ ALAN ADIMIZA GÖRE çözüyor → 404.
 *
 * ⚠️ Bu yalnız SEO kusuru değil: o bayinin web sitesi bağlantısına tıklayan
 *    GERÇEK MÜŞTERİ, bayinin sitesi yerine bizim 404 sayfamıza düşüyordu.
 *
 * ⚠️ Veri tarafını düzeltmek YETMEZ — operatör admin panelinden yine
 *    protokolsüz yazabilir. Bu yüzden normalleştirme RENDER ANINDA yapılır.
 *    (Aynı sınıf kusur `wa.me` numaralarında yaşanmış ve `waNumber()` ile
 *    çözülmüştü: TR verisinde yerel yazım normaldir, ham kullanma.)
 *
 * 📌 Bayi web adresi basan HER yerde bunu kullan — `href={b.website}` YAZMA.
 *    Kullanan: DealerNetwork (yurt içi + uluslararası) · DealerDirectory ·
 *    CityLandingClient · DealerPickerModal.
 */
export function webHref(url?: string | null): string | undefined {
  const u = (url ?? "").trim();
  if (!u) return undefined;
  // Zaten mutlak (http/https) ise dokunma.
  if (/^https?:\/\//i.test(u)) return u;
  // `mailto:` / `tel:` gibi başka şemalara da dokunma.
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
  // Protokolsüz alan adı → https ekle (aksi hâlde SİTE-İÇİ göreli yol sayılır).
  return `https://${u.replace(/^\/+/, "")}`;
}

/** Görünen etiket: şema ve sondaki eğik çizgi olmadan (kart içinde kısa dursun). */
export function webLabel(url?: string | null): string {
  return (url ?? "").trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}
