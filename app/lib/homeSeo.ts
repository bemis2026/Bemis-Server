// Yabancı dil ANASAYFA metinleri — /en /de /es /ru /nl.
//
// ⚠️ 2026-09-18 (kullanıcı kararı "beşini birden aç"): bu beş adres ÖNCEDEN 404
// veriyordu; yalnız `/` (TR) ve `/ar` (Körfez iniş sayfası) vardı. Ürün kolları
// (/de/products …) aylardır açıktı ama o dillerde ANASAYFA hiç yoktu → Google
// yabancı dilde giriş sayfamızı göremiyordu.
//
// ⚠️ İÇERİK SINIRI — bu metinlerde UYDURMA yok. Hepsi sitede zaten yayınlanmış
// olgular: 1994, Bursa'daki kendi tesisi, 80+ ülkeye ihracat, CE, IP65,
// Type 2 (IEC 62196), CCS2, OCPP, AC 3,7–22 kW, DC 40–200 kW, 2 yıl üretici
// garantisi, OEM/ODM. Fiyat / asgari sipariş / teslim süresi / bölge
// münhasırlığı YAZILMAZ.
// ⚠️ Yabancı dilde milliyetçi çerçeve YOK ("Türkiye'nin en iyisi" vb.): menşe
// yalnız OLGU olarak geçer (kayıtlı kural).

import type { LangCode } from "./languages";

/** Anasayfa kümesi — yedi sayfanın hepsi AYNI kümeyi basar (karşılıklılık şartı). */
export const HOME_HREFLANG: Record<string, string> = {
  tr: "/",
  en: "/en",
  de: "/de",
  es: "/es",
  ru: "/ru",
  nl: "/nl",
  ar: "/ar",
  "x-default": "/",
};

export type HomeLang = "en" | "de" | "es" | "ru" | "nl";
export const HOME_LANGS: HomeLang[] = ["en", "de", "es", "ru", "nl"];

export function isHomeLang(v: string): v is HomeLang {
  return (HOME_LANGS as string[]).includes(v);
}

type HomeSeo = {
  /** <title> — marka eki DAHİL (absolute olarak verilir, layout şablonu atlanır). */
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
  /** Ekmek kırıntısında "Ana Sayfa" karşılığı. */
  home: string;
};

export const HOME_SEO: Record<HomeLang, HomeSeo> = {
  en: {
    title: "EV Charging Equipment Manufacturer | Bemis E-V Charge",
    description:
      "EV charging equipment manufacturer since 1994: AC wallboxes 3.7–22 kW, DC fast charging up to 200 kW, Type 2 cables. CE, IP65, OCPP. Exporting to 80+ countries.",
    keywords: [
      "ev charging equipment manufacturer",
      "ac wallbox manufacturer",
      "dc fast charger manufacturer",
      "type 2 charging cable",
      "oem ev charger",
      "ev charger supplier",
    ],
    ogLocale: "en_US",
    home: "Home",
  },
  de: {
    title: "Hersteller für E-Auto-Ladetechnik | Bemis E-V Charge",
    description:
      "Hersteller von Ladetechnik für Elektroautos seit 1994: AC-Wallboxen 3,7–22 kW, DC-Schnellladen bis 200 kW, Type-2-Kabel. CE, IP65, OCPP. Export in 80+ Länder.",
    keywords: [
      "hersteller ladestationen elektroautos",
      "ac wallbox hersteller",
      "dc schnellladesäule hersteller",
      "type 2 ladekabel",
      "oem ladestation",
      "ladetechnik großhandel",
    ],
    ogLocale: "de_DE",
    home: "Startseite",
  },
  es: {
    title: "Fabricante de Equipos de Carga para VE | Bemis E-V Charge",
    description:
      "Fabricante de equipos de carga para vehículos eléctricos desde 1994: wallbox AC 3,7–22 kW, carga rápida DC hasta 200 kW, cables Type 2. CE, IP65, OCPP.",
    keywords: [
      "fabricante cargadores coche electrico",
      "wallbox ac fabricante",
      "cargador rapido dc",
      "cable de carga type 2",
      "cargador ve oem",
      "equipos de carga ve",
    ],
    ogLocale: "es_ES",
    home: "Inicio",
  },
  ru: {
    title: "Производитель зарядных станций | Bemis E-V Charge",
    description:
      "Производитель зарядного оборудования для электромобилей с 1994 года: настенные станции AC 3,7–22 кВт, быстрая зарядка DC до 200 кВт, кабели Type 2. CE, IP65.",
    keywords: [
      "производитель зарядных станций",
      "зарядная станция для электромобиля",
      "быстрая зарядка dc",
      "кабель type 2",
      "oem зарядные станции",
      "зарядное оборудование оптом",
    ],
    ogLocale: "ru_RU",
    home: "Главная",
  },
  nl: {
    title: "Fabrikant van EV-laadapparatuur | Bemis E-V Charge",
    description:
      "Fabrikant van laadapparatuur voor elektrische auto's sinds 1994: AC-wallboxen 3,7–22 kW, DC-snelladen tot 200 kW, Type 2-kabels. CE, IP65, OCPP.",
    keywords: [
      "fabrikant ev laadpalen",
      "ac wallbox fabrikant",
      "dc snellader fabrikant",
      "type 2 laadkabel",
      "oem laadpaal",
      "laadapparatuur groothandel",
    ],
    ogLocale: "nl_NL",
    home: "Home",
  },
};

/** Dil kodundan anasayfa SEO kaydı (bilinmeyen dil → null). */
export function homeSeo(lang: LangCode | string): HomeSeo | null {
  return isHomeLang(String(lang)) ? HOME_SEO[String(lang) as HomeLang] : null;
}
