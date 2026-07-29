// Sayfa içi yumuşak kaydırma — TEK KAYNAK.
//
// ⚠️⚠️ NEDEN ELDE YAZILDI (tarayıcının `scrollIntoView({behavior:"smooth"})`'u
// yerine): bu sitede kaydırma hedefi HAREKETLİDİR. `SectionWrapper` bölümleri
// `content-visibility:auto` + `contain-intrinsic-size:auto 900px` kullanır → ekran
// dışındaki bölümler GERÇEK yüksekliğiyle değil TAHMİNİ yükseklikle yer kaplar.
// Kaydırma ilerledikçe bölümler gerçekten render olur, yükseklikleri değişir ve
// tıklama anında hesaplanan sabit Y BAYATLAR. Tarayıcının yerleşik smooth
// kaydırması hedefi yalnız BİR KEZ hesapladığı için yanlış yere varır.
// (Canlıda ölçülmüştü: hedefi 71px aşmıştık. Ayrıca whileInView animasyonları ve
// geç yüklenen görseller de yüksekliği oynatır.)
//
// Çözüm: hedefi HER KAREDE yeniden hesapla ve hareketli hedefi izle.
// Bu mantık önce Hero'daki "Ürünleri Keşfet" için yazıldı; 2026-07-29'da üst
// menünün bölüm bağlantıları da aynı kusurdan etkilendiği anlaşılınca (kullanıcı
// "Bayi Ağı'na basınca haritaya götürmüyor" dedi) buraya taşındı.

/** Sabit üst menü yüksekliği — bölüm başlığı menünün altında kalmasın. */
export const NAV_OFFSET = 76;

/**
 * Hareketli hedefe yumuşak kaydırır.
 * @param hedefHesapla Her karede çağrılır; o anki doğru scrollY değerini döndürmeli.
 */
export function smoothScrollToTarget(hedefHesapla: () => number) {
  const baslangic = window.scrollY;
  const ilkHedef = hedefHesapla();
  const fark = ilkHedef - baslangic;
  const azalt = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (azalt || Math.abs(fark) < 8) { window.scrollTo(0, ilkHedef); return; }

  // Süre mesafeyle ölçeklenir. Ölçüm: hero → #products mesafesi ~3300px;
  // 0.55/1700ms'te tempo ~3000px/sn (aradaki 3 bölüm hızla akıyordu) →
  // 0.6/2000ms ile ~2200px/sn = kullanıcının istediği "sakin" his.
  const sure = Math.min(2000, Math.max(900, Math.abs(fark) * 0.6));
  const t0 = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let iptal = false;
  const temizle = () => {
    window.removeEventListener("wheel", birak);
    window.removeEventListener("touchstart", birak);
    window.removeEventListener("keydown", birak);
  };
  // Kullanıcı arada kendisi kaydırırsa animasyonu BIRAK (kaydırması kaçırılmasın).
  function birak() { iptal = true; temizle(); }
  window.addEventListener("wheel", birak, { passive: true });
  window.addEventListener("touchstart", birak, { passive: true });
  window.addEventListener("keydown", birak);

  const adim = (simdi: number) => {
    if (iptal) return;
    const p = Math.min(1, (simdi - t0) / sure);
    const guncelHedef = hedefHesapla(); // hareketli hedefi izle
    window.scrollTo(0, baslangic + (guncelHedef - baslangic) * ease(p));
    if (p < 1) requestAnimationFrame(adim);
    else { window.scrollTo(0, hedefHesapla()); temizle(); }
  };
  requestAnimationFrame(adim);
}

/**
 * Bir bölümü ekrana getirir.
 *
 * ⚠️ ÇERÇEVELEME KURALI: bölüm ekrana SIĞMIYORSA üste hizalanır (menü payıyla),
 * sığıyorsa ortalanır. Eskiden her bölüm `block:"center"` ile ortalanıyordu; Bayi
 * Ağı gibi 1149px'lik bir bölümde bu, bölümün ta ortasına — haritanın ALTINDAKİ
 * listeye — düşürüyordu. Uzun bölümde doğru olan üstten başlamaktır.
 */
export function scrollToSection(el: HTMLElement) {
  smoothScrollToTarget(() => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const top = window.scrollY + r.top;
    if (r.height > vh - NAV_OFFSET) return Math.max(0, top - NAV_OFFSET);
    return Math.max(0, top + (r.height - vh) / 2);
  });
}
