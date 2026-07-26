// KDV — TEK KAYNAK.
//
// ⚠️ NEDEN TEK DOSYA: Ürün sayfasında gösterilen "KDV dahil" tutar ile ürün
// feed'inde (/meta-catalog.xml) gönderilen fiyat BİREBİR aynı olmak zorunda.
// Farklı yerlerde ayrı ayrı oran tutulursa biri güncellenip diğeri unutulur ve
// Google Merchant Center "fiyat uyuşmazlığı" ile ürünleri reddeder.
//
// Liste fiyatları KDV HARİÇ tutulur (bayilik sözleşmesi de iskonto/prim
// hesaplarını "KDV hariç" üzerinden kurar); KDV yalnız GÖSTERİM ve feed
// aşamasında eklenir.
//
// Oran değişirse (mevzuat) SADECE burayı güncelle.
export const VAT_RATE = 20; // % — Türkiye genel KDV oranı

/** KDV hariç tutardan KDV dahil tutarı üretir. */
export const withVat = (net: number): number => net * (1 + VAT_RATE / 100);

/** Fiyat çarpanı (1.20) — formatPrice gibi yerlerde doğrudan kullanılır. */
export const VAT_MULTIPLIER = 1 + VAT_RATE / 100;
