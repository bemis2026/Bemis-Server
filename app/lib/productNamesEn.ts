// Ürün ADLARININ İngilizce karşılıkları — ELLE KÜRATÖRLÜ, TEK KAYNAK.
//
// ⚠️ NEDEN ELLE: /api/products merge'ünde `name` bilinçli olarak TR-kilitlidir
// (kimlik alanı) — eski MyMemory çeviri geçişlerinden productsEn bin'ine bozuk
// adlar yazılmıştı ve onlara güvenilemez. Bu dosya o boşluğu güvenilir biçimde
// doldurur: yalnız BURADA eşlemesi olan ad İngilizceye çevrilir, olmayan aynen
// (TR) kalır → sessiz bozulma olmaz.
//
// KAPSAM: yalnız `lang === "en"` (gerçek /en URL'leri). Diğer dillerde ad TR kalır
// (davranış değişmedi); istenirse aynı harita oraya da bağlanabilir.
//
// ⚠️ YENİ ÜRÜN EKLENİNCE: adı buraya da ekle. `npm run check:en-names` benzeri bir
// kontrol yok; eşlemesi olmayan ad İngilizce sayfada Türkçe görünür (bozulmaz).
//
// Marka/model adları (Charger Plus 2, Pro Mobile 2, BEVDC 40 …) çevrilmez —
// bunlar ürün kimliğidir, İngilizce sayfada da aynı yazılır.

const EN_NAMES: Record<string, string> = {
  // ── AC Wallbox ── (marka adları aynı; yalnız Türkçe ek çevrilir)
  "Charger Plus 2 GSM MID Sayaçlı": "Charger Plus 2 GSM with MID Meter",
  "Charger Pro 2 GSM MID Sayaçlı": "Charger Pro 2 GSM with MID Meter",

  // ── AC Şarj Kabloları (Type 2 şarj setleri) ──
  "Şarj Seti 16A Monofaze 3,7 kW": "Charging Cable Set 16A Single-Phase 3.7 kW",
  "Şarj Seti 32A Monofaze 7,4 kW": "Charging Cable Set 32A Single-Phase 7.4 kW",
  "Şarj Seti 16A Trifaze 11 kW": "Charging Cable Set 16A Three-Phase 11 kW",
  "Şarj Seti 32A Trifaze 22 kW": "Charging Cable Set 32A Three-Phase 22 kW",

  // ── V2L / C2L Adaptörler ──
  "Tek Çıkışlı V2L Adaptör": "Single-Output V2L Adapter",
  "Tekli Priz Uzatma V2L Adaptör": "Single-Socket Extension V2L Adapter",
  "2'li Priz Uzatma V2L Adaptör": "2-Socket Extension V2L Adapter",
  "3'lü Priz Uzatma V2L Adaptör": "3-Socket Extension V2L Adapter",
  "C2L Tekli Priz Uzatma Fişli Adaptör": "C2L Single-Socket Extension Adapter with Plug",
  "C2L 2'li Priz Uzatma Fişli Adaptör": "C2L 2-Socket Extension Adapter with Plug",
  "C2L 3'lü Priz Uzatma Fişli Adaptör": "C2L 3-Socket Extension Adapter with Plug",
  "C2L 5/32A Prizli Uzatma Fişli Adaptör": "C2L 5/32A Socket Extension Adapter with Plug",
  "C2C Charger to Caravan Adaptör": "C2C Charger to Caravan Adapter",

  // ── Uzatmalar ve Dönüştürücüler ── (ondalık virgül → nokta)
  "Cee Norm Adaptör (3×2,5)": "CEE Norm Adapter (3×2.5)",
  "Cee Norm Adaptör (3×6)": "CEE Norm Adapter (3×6)",
  "Standart Adaptör (3×2,5)": "Standard Adapter (3×2.5)",
  "Seyyar Uzatma Kablosu Monofaze (3×2,5)": "Portable Extension Cable Single-Phase (3×2.5)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 3/32A)": "Portable Extension Cable CEE Norm 3×2.5 (1/16A → 3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 5/32A)": "Portable Extension Cable CEE Norm 3×2.5 (1/16A → 5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×6 (3/32A)": "Portable Extension Cable CEE Norm 3×6 (3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×6 (5/32A)": "Portable Extension Cable CEE Norm 5×6 (5/32A)",

  // ── Aksesuarlar ──
  "Şarj Kablosu Çantası": "Charging Cable Bag",
  "Mobile Charger Çantası": "Mobile Charger Bag",
  "AC Soket Tutucu": "AC Socket Holder",
  "Mobile Charger Duvar Askı Aparatı": "Mobile Charger Wall Bracket",
  "V2L ve C2L Adaptör Çantası": "V2L & C2L Adapter Bag",
  // "Pedestal" — İngilizcede de aynı, eşleme gerekmez.

  // ── Şarj Ünitesi Ekipmanları ──
  // ⚠️ Kaynak veride iki yazım var: "Bir Uçu Açık" ve "Bir Ucu Açık" — ikisi de eşlendi.
  "Bir Uçu Açık Kablolu Şarj Prizi": "Charging Socket with Open-Ended Cable",
  "Pano Prizi": "Panel Socket",
  "Pano Prizi (Kilit Motorsuz)": "Panel Socket (Without Lock Motor)",
  "Bir Ucu Açık Enerji Kablosu": "Open-Ended Power Cable",
  "Otomatlı IP44 Kombinasyon": "IP44 Combination Unit with Circuit Breaker",
  "Otomatlı IP66 Kombinasyon": "IP66 Combination Unit with Circuit Breaker",
  "DC Şarj Soketi CCS2 (Bir Ucu Açık)": "DC Charging Socket CCS2 (Open-Ended)",

  // ── 2026-2 fiyat listesiyle eklenen adlar ──
  // (BEVDC 180 · Charger 2 · Mini/Mono/Pro Mobile gibi marka-model adları BİLEREK yok:
  //  eşlemesi olmayan ad aynen döner, İngilizce sayfada da aynı yazılmalı.)
  "Charger Plus 2 MID Sayaçlı": "Charger Plus 2 with MID Meter",
  "Charger Pro 2 MID Sayaçlı": "Charger Pro 2 with MID Meter",
  "Tek Çıkışlı C2L Adaptör": "Single-Output C2L Adapter",
  "Seyyar Uzatma Kablosu Ceenorm 5×2,5 (5/16A)": "CEE Norm Extension Cable 5×2.5 (5/16A)",
  "Cee Norm Adaptör (30cm Kablolu)": "CEE Norm Adapter (30 cm Cable)",
  "V2L ve C2L Kablo Çantası": "V2L & C2L Cable Bag",
  "DC Soket Tutucu (4 Bilyalı)": "DC Socket Holder (4 Ball Bearings)",
  "Pano Prizi Yeni Tip": "Panel Socket New Type",
};

/** TR ürün adının İngilizcesi; eşleme yoksa adı AYNEN döndürür (güvenli düşüş). */
export function productNameEn(trName: unknown): string {
  if (typeof trName !== "string") return "";
  return EN_NAMES[trName] ?? trName;
}

export default EN_NAMES;
