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

/**
 * Ürün PNG'sinin kart/panel içindeki iç boşluğu (Tailwind sınıfı).
 *
 * ⚠️ Görsellerin KENDİ iç marjı YOK — ölçüldü: üç görselde de ürün dosyanın
 * **%99'unu** dolduruyor (kenar boşluğu %0). Yani nefes payını kart vermeli.
 * `charger-equipment` görseli ayrıca KARE oranlı (3808×3513) ve kart da
 * kareye yakın (288×290) → `object-contain` onu kenarlara dayıyordu; kullanıcı
 * "priz aşırı büyük, yakın duruyor" dedi (2026-08-05). Ona daha geniş pay.
 * Charger 2 (1434×1980) dikey olduğu için zaten yanlarda boşluk bırakıyor.
 */
// ⓘ p-12 seçildi: p-5/p-10/p-12/p-14 kart ölçüsünde yan yana çizilip
// karşılaştırıldı. p-5 ürünü kenarlara dayıyor ve başlık üstüne biniyordu;
// p-14 gereksiz küçültüyordu. p-12 → ürün kart genişliğinin ~%67'si.
export const urunPngBosluk = (id: string | undefined | null): string =>
  id === "charger-equipment" ? "p-12" : "p-5";
