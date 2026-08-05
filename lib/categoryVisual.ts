// Kategori görselinin TÜRÜ — TEK KAYNAK (anasayfa kartı + kategori sayfası hero'su
// aynı listeyi okur; ayrı ayrı yazılsaydı biri güncellenip öteki unutulurdu).
//
// Bu kategorilerin görseli SAHNE FOTOSU değil, arka planı olmayan bir ÜRÜN
// RENDER'ı (şeffaf PNG). İkisi farklı davranış ister:
//   • sahne fotosu → `object-cover`, tam kareyi doldurur, kırpılması normaldir
//   • ürün PNG'si  → `object-contain` + iç boşluk; `object-cover` cihazı kırpar,
//     kablo/soket kadraj dışında kalır
//
// ⚠️ ZEMİN HER İKİ TEMADA DA AÇIK OLMALI — tema-bağımlı YAPMAYIN:
//    yeni Charger 2 KOYU gövdeli, Pro Mobile 2 BEYAZ gövdeli. Koyu zeminde koyu
//    cihaz, saf beyaz zeminde beyaz cihaz kaybolur; nötr açık gri / açık gradyan
//    ikisini birden taşır. (Aynı ders ürün KARTLARINDA da alınmıştı: kart görsel
//    alanı 2026-07-01'de her iki temada açık zemine çekilmişti.)
export const URUN_PNG_KATEGORI = new Set(["charger-equipment", "wallbox", "portable"]);

/** Kategori görseli şeffaf ürün PNG'si mi? (sahne fotosu değil) */
export const urunPngKategorisi = (id: string | undefined | null): boolean =>
  !!id && URUN_PNG_KATEGORI.has(id);
