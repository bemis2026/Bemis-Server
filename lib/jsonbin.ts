// Veri katmanı JSONBin'den **Vercel Blob**'a taşındı (2026-06-01).
// JSONBin ücretsiz katmanının aylık istek kotası sürekli doluyordu (403
// "Requests exhausted") → site eski yedeğe düşüyordu. Blob'da istek/ay limiti
// ve 100KB kayıt limiti yok.
//
// Bu dosya geriye dönük uyum için ince bir yeniden-dışa-aktarım: 16 dosya
// readBin/writeBin'i hâlâ buradan import ediyor; içerik artık lib/store.ts
// üzerinden Vercel Blob'dan gelir. Çağıranlardaki data/*.json yedekleri
// güvenlik ağı olarak korunur (Blob okunamazsa onlara düşülür).
export { readBin, writeBin } from "./store";
