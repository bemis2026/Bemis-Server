// Ürün ADLARININ Almanca / İspanyolca / Rusça karşılıkları — ELLE KÜRATÖRLÜ, TEK KAYNAK.
//
// ⚠️ NEDEN: /api/products merge'ünde `name` TR-kilitlidir (kimlik alanı) → /de /es /ru
// sayfalarında ürün adı Türkçe kalırdı (ölçüm 2026-08-28: 150 ürünün 114'ü). Bu dosya
// app/lib/productNamesEn.ts ile AYNI 45 anahtarı taşır; anahtar = TR ürün adı.
// Eşlemesi olmayan ad AYNEN döner → sessiz bozulma yok. Marka-model adları
// (Charger 2, Pro Mobile 2, BEVDC 180, Mini Mobile, Pedestal…) BİLEREK haritasız.
//
// ⚠️ YENİ ÜRÜN EKLENİNCE: productNamesEn.ts ile birlikte buraya da ekle.
// ⚠️ Yalnız ÜRÜN TİPİ isimleri çevrilir; sayı/amper/kesit/IP değerleri aynen kalır.

import type { LangCode } from "./languages";

export type LocaleNameLang = "de" | "es" | "ru";

const DE: Record<string, string> = {
  "Charger 2 Fişli": "Charger 2 mit Stecker",
  "Charger Plus 2 GSM MID Sayaçlı": "Charger Plus 2 GSM mit MID-Zähler",
  "Charger Pro 2 GSM MID Sayaçlı": "Charger Pro 2 GSM mit MID-Zähler",
  "Şarj Seti 16A Monofaze 3,7 kW": "Ladekabel-Set 16A einphasig 3,7 kW",
  "Şarj Seti 32A Monofaze 7,4 kW": "Ladekabel-Set 32A einphasig 7,4 kW",
  "Şarj Seti 16A Trifaze 11 kW": "Ladekabel-Set 16A dreiphasig 11 kW",
  "Şarj Seti 32A Trifaze 22 kW": "Ladekabel-Set 32A dreiphasig 22 kW",
  "Tek Çıkışlı V2L Adaptör": "V2L-Adapter mit einem Ausgang",
  "Tekli Priz Uzatma V2L Adaptör": "V2L-Adapter mit Einzelsteckdose (Verlängerung)",
  "2'li Priz Uzatma V2L Adaptör": "V2L-Adapter mit 2 Steckdosen (Verlängerung)",
  "3'lü Priz Uzatma V2L Adaptör": "V2L-Adapter mit 3 Steckdosen (Verlängerung)",
  "C2L Tekli Priz Uzatma Fişli Adaptör": "C2L-Verlängerungsadapter mit Einzelsteckdose und Stecker",
  "C2L 2'li Priz Uzatma Fişli Adaptör": "C2L-Verlängerungsadapter mit 2 Steckdosen und Stecker",
  "C2L 3'lü Priz Uzatma Fişli Adaptör": "C2L-Verlängerungsadapter mit 3 Steckdosen und Stecker",
  "C2L 5/32A Prizli Uzatma Fişli Adaptör": "C2L-Verlängerungsadapter 5/32A Steckdose mit Stecker",
  "C2C Charger to Caravan Adaptör": "C2C Charger-to-Caravan-Adapter",
  "Cee Norm Adaptör (3×2,5)": "CEE-Norm-Adapter (3×2,5)",
  "Cee Norm Adaptör (3×6)": "CEE-Norm-Adapter (3×6)",
  "Standart Adaptör (3×2,5)": "Standardadapter (3×2,5)",
  "Seyyar Uzatma Kablosu Monofaze (3×2,5)": "Mobiles Verlängerungskabel einphasig (3×2,5)",
  "Seyyar Uzatma Kablosu Monofaze IP68 (3×2,5)": "Mobiles Verlängerungskabel einphasig IP68 (3×2,5)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 3/32A)": "Mobiles CEE-Verlängerungskabel 3×2,5 (1/16A → 3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 5/32A)": "Mobiles CEE-Verlängerungskabel 3×2,5 (1/16A → 5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×6 (3/32A)": "Mobiles CEE-Verlängerungskabel 3×6 (3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×6 (5/32A)": "Mobiles CEE-Verlängerungskabel 5×6 (5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×2,5 (5/16A)": "Mobiles CEE-Verlängerungskabel 5×2,5 (5/16A)",
  "Şarj Kablosu Çantası": "Ladekabeltasche",
  "Mobile Charger Çantası": "Mobile-Charger-Tasche",
  "AC Soket Tutucu": "AC-Steckdosenhalter",
  "Mobile Charger Duvar Askı Aparatı": "Mobile-Charger-Wandhalterung",
  "V2L ve C2L Adaptör Çantası": "V2L- & C2L-Adaptertasche",
  "V2L ve C2L Kablo Çantası": "V2L- & C2L-Kabeltasche",
  "Bir Uçu Açık Kablolu Şarj Prizi": "Ladesteckdose mit offenem Kabelende",
  "Pano Prizi": "Schalttafel-Steckdose",
  "Pano Prizi (Kilit Motorsuz)": "Schalttafel-Steckdose (ohne Verriegelungsmotor)",
  "Pano Prizi Yeni Tip": "Schalttafel-Steckdose, neuer Typ",
  "Bir Ucu Açık Enerji Kablosu": "Energiekabel mit offenem Ende",
  "Otomatlı IP44 Kombinasyon": "IP44-Kombination mit Leitungsschutzschalter",
  "Otomatlı IP66 Kombinasyon": "IP66-Kombination mit Leitungsschutzschalter",
  "DC Şarj Soketi CCS2 (Bir Ucu Açık)": "DC-Ladesteckdose CCS2 (offenes Ende)",
  "Charger Plus 2 MID Sayaçlı": "Charger Plus 2 mit MID-Zähler",
  "Charger Pro 2 MID Sayaçlı": "Charger Pro 2 mit MID-Zähler",
  "Tek Çıkışlı C2L Adaptör": "C2L-Adapter mit einem Ausgang",
  "Cee Norm Adaptör (30cm Kablolu)": "CEE-Norm-Adapter (30 cm Kabel)",
  "DC Soket Tutucu (4 Bilyalı)": "DC-Steckdosenhalter (4 Kugellager)",
};

const ES: Record<string, string> = {
  "Charger 2 Fişli": "Charger 2 con enchufe",
  "Charger Plus 2 GSM MID Sayaçlı": "Charger Plus 2 GSM con contador MID",
  "Charger Pro 2 GSM MID Sayaçlı": "Charger Pro 2 GSM con contador MID",
  "Şarj Seti 16A Monofaze 3,7 kW": "Kit de cable de carga 16A monofásico 3,7 kW",
  "Şarj Seti 32A Monofaze 7,4 kW": "Kit de cable de carga 32A monofásico 7,4 kW",
  "Şarj Seti 16A Trifaze 11 kW": "Kit de cable de carga 16A trifásico 11 kW",
  "Şarj Seti 32A Trifaze 22 kW": "Kit de cable de carga 32A trifásico 22 kW",
  "Tek Çıkışlı V2L Adaptör": "Adaptador V2L de una salida",
  "Tekli Priz Uzatma V2L Adaptör": "Adaptador V2L con extensión de una toma",
  "2'li Priz Uzatma V2L Adaptör": "Adaptador V2L con extensión de 2 tomas",
  "3'lü Priz Uzatma V2L Adaptör": "Adaptador V2L con extensión de 3 tomas",
  "C2L Tekli Priz Uzatma Fişli Adaptör": "Adaptador de extensión C2L de una toma con enchufe",
  "C2L 2'li Priz Uzatma Fişli Adaptör": "Adaptador de extensión C2L de 2 tomas con enchufe",
  "C2L 3'lü Priz Uzatma Fişli Adaptör": "Adaptador de extensión C2L de 3 tomas con enchufe",
  "C2L 5/32A Prizli Uzatma Fişli Adaptör": "Adaptador de extensión C2L toma 5/32A con enchufe",
  "C2C Charger to Caravan Adaptör": "Adaptador C2C Charger-to-Caravan",
  "Cee Norm Adaptör (3×2,5)": "Adaptador CEE (3×2,5)",
  "Cee Norm Adaptör (3×6)": "Adaptador CEE (3×6)",
  "Standart Adaptör (3×2,5)": "Adaptador estándar (3×2,5)",
  "Seyyar Uzatma Kablosu Monofaze (3×2,5)": "Cable alargador portátil monofásico (3×2,5)",
  "Seyyar Uzatma Kablosu Monofaze IP68 (3×2,5)": "Cable alargador portátil monofásico IP68 (3×2,5)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 3/32A)": "Cable alargador portátil CEE 3×2,5 (1/16A → 3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 5/32A)": "Cable alargador portátil CEE 3×2,5 (1/16A → 5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×6 (3/32A)": "Cable alargador portátil CEE 3×6 (3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×6 (5/32A)": "Cable alargador portátil CEE 5×6 (5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×2,5 (5/16A)": "Cable alargador portátil CEE 5×2,5 (5/16A)",
  "Şarj Kablosu Çantası": "Bolsa para cable de carga",
  "Mobile Charger Çantası": "Bolsa para Mobile Charger",
  "AC Soket Tutucu": "Soporte de toma AC",
  "Mobile Charger Duvar Askı Aparatı": "Soporte de pared para Mobile Charger",
  "V2L ve C2L Adaptör Çantası": "Bolsa para adaptadores V2L y C2L",
  "V2L ve C2L Kablo Çantası": "Bolsa para cables V2L y C2L",
  "Bir Uçu Açık Kablolu Şarj Prizi": "Toma de carga con cable de extremo abierto",
  "Pano Prizi": "Toma para cuadro eléctrico",
  "Pano Prizi (Kilit Motorsuz)": "Toma para cuadro eléctrico (sin motor de bloqueo)",
  "Pano Prizi Yeni Tip": "Toma para cuadro eléctrico, nuevo tipo",
  "Bir Ucu Açık Enerji Kablosu": "Cable de energía de extremo abierto",
  "Otomatlı IP44 Kombinasyon": "Combinación IP44 con interruptor automático",
  "Otomatlı IP66 Kombinasyon": "Combinación IP66 con interruptor automático",
  "DC Şarj Soketi CCS2 (Bir Ucu Açık)": "Toma de carga DC CCS2 (extremo abierto)",
  "Charger Plus 2 MID Sayaçlı": "Charger Plus 2 con contador MID",
  "Charger Pro 2 MID Sayaçlı": "Charger Pro 2 con contador MID",
  "Tek Çıkışlı C2L Adaptör": "Adaptador C2L de una salida",
  "Cee Norm Adaptör (30cm Kablolu)": "Adaptador CEE (cable de 30 cm)",
  "DC Soket Tutucu (4 Bilyalı)": "Soporte de toma DC (4 rodamientos)",
};

const RU: Record<string, string> = {
  "Charger 2 Fişli": "Charger 2 с вилкой",
  "Charger Plus 2 GSM MID Sayaçlı": "Charger Plus 2 GSM со счётчиком MID",
  "Charger Pro 2 GSM MID Sayaçlı": "Charger Pro 2 GSM со счётчиком MID",
  "Şarj Seti 16A Monofaze 3,7 kW": "Зарядный кабель 16A однофазный 3,7 кВт",
  "Şarj Seti 32A Monofaze 7,4 kW": "Зарядный кабель 32A однофазный 7,4 кВт",
  "Şarj Seti 16A Trifaze 11 kW": "Зарядный кабель 16A трёхфазный 11 кВт",
  "Şarj Seti 32A Trifaze 22 kW": "Зарядный кабель 32A трёхфазный 22 кВт",
  "Tek Çıkışlı V2L Adaptör": "Адаптер V2L с одним выходом",
  "Tekli Priz Uzatma V2L Adaptör": "Адаптер V2L с удлинителем на одну розетку",
  "2'li Priz Uzatma V2L Adaptör": "Адаптер V2L с удлинителем на 2 розетки",
  "3'lü Priz Uzatma V2L Adaptör": "Адаптер V2L с удлинителем на 3 розетки",
  "C2L Tekli Priz Uzatma Fişli Adaptör": "Адаптер-удлинитель C2L на одну розетку с вилкой",
  "C2L 2'li Priz Uzatma Fişli Adaptör": "Адаптер-удлинитель C2L на 2 розетки с вилкой",
  "C2L 3'lü Priz Uzatma Fişli Adaptör": "Адаптер-удлинитель C2L на 3 розетки с вилкой",
  "C2L 5/32A Prizli Uzatma Fişli Adaptör": "Адаптер-удлинитель C2L с розеткой 5/32A и вилкой",
  "C2C Charger to Caravan Adaptör": "Адаптер C2C Charger-to-Caravan",
  "Cee Norm Adaptör (3×2,5)": "Адаптер CEE (3×2,5)",
  "Cee Norm Adaptör (3×6)": "Адаптер CEE (3×6)",
  "Standart Adaptör (3×2,5)": "Стандартный адаптер (3×2,5)",
  "Seyyar Uzatma Kablosu Monofaze (3×2,5)": "Переносной удлинитель однофазный (3×2,5)",
  "Seyyar Uzatma Kablosu Monofaze IP68 (3×2,5)": "Переносной удлинитель однофазный IP68 (3×2,5)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 3/32A)": "Переносной удлинитель CEE 3×2,5 (1/16A → 3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×2,5 (1/16A → 5/32A)": "Переносной удлинитель CEE 3×2,5 (1/16A → 5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 3×6 (3/32A)": "Переносной удлинитель CEE 3×6 (3/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×6 (5/32A)": "Переносной удлинитель CEE 5×6 (5/32A)",
  "Seyyar Uzatma Kablosu Ceenorm 5×2,5 (5/16A)": "Переносной удлинитель CEE 5×2,5 (5/16A)",
  "Şarj Kablosu Çantası": "Сумка для зарядного кабеля",
  "Mobile Charger Çantası": "Сумка для Mobile Charger",
  "AC Soket Tutucu": "Держатель разъёма AC",
  "Mobile Charger Duvar Askı Aparatı": "Настенный кронштейн для Mobile Charger",
  "V2L ve C2L Adaptör Çantası": "Сумка для адаптеров V2L и C2L",
  "V2L ve C2L Kablo Çantası": "Сумка для кабелей V2L и C2L",
  "Bir Uçu Açık Kablolu Şarj Prizi": "Зарядная розетка с кабелем со свободным концом",
  "Pano Prizi": "Щитовая розетка",
  "Pano Prizi (Kilit Motorsuz)": "Щитовая розетка (без мотора блокировки)",
  "Pano Prizi Yeni Tip": "Щитовая розетка, новый тип",
  "Bir Ucu Açık Enerji Kablosu": "Силовой кабель со свободным концом",
  "Otomatlı IP44 Kombinasyon": "Комбинация IP44 с автоматическим выключателем",
  "Otomatlı IP66 Kombinasyon": "Комбинация IP66 с автоматическим выключателем",
  "DC Şarj Soketi CCS2 (Bir Ucu Açık)": "Зарядный разъём DC CCS2 (свободный конец)",
  "Charger Plus 2 MID Sayaçlı": "Charger Plus 2 со счётчиком MID",
  "Charger Pro 2 MID Sayaçlı": "Charger Pro 2 со счётчиком MID",
  "Tek Çıkışlı C2L Adaptör": "Адаптер C2L с одним выходом",
  "Cee Norm Adaptör (30cm Kablolu)": "Адаптер CEE (кабель 30 см)",
  "DC Soket Tutucu (4 Bilyalı)": "Держатель разъёма DC (4 подшипника)",
};

export const LOCALE_NAMES: Record<LocaleNameLang, Record<string, string>> = { de: DE, es: ES, ru: RU };

export function isLocaleNameLang(v: unknown): v is LocaleNameLang {
  return v === "de" || v === "es" || v === "ru";
}

/** TR ürün adını verilen dile çevirir; eşleşme yoksa AYNEN döner (sessiz bozulma yok). */
export function productNameLocale(lang: LangCode | string, trName: unknown): string {
  const s = typeof trName === "string" ? trName : String(trName ?? "");
  if (!isLocaleNameLang(lang)) return s;
  return LOCALE_NAMES[lang][s.trim()] ?? s;
}
