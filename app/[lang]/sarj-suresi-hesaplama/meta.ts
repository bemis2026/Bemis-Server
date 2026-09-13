/**
 * ŞARJ SÜRESİ HESAPLAYICI — DİL KOLU METADATA'SI (en/de/es/ru/nl/ar)
 *
 * ⚠️ SAYFA GÖVDESİ ÇEVİRİ İSTEMEZ: `HesapClient` `pickText`, `Calculator` ise
 *    `useUiStrings()` → `data/i18n/ui.json` üzerinden besleniyor ve o sözlük 5
 *    dilde TAM (bekçi: `npm run check:i18n`). Dil kolunda `forcedLangForPath()`
 *    dili sabitlediği için gövde kendiliğinden o dilde render edilir.
 *    Burada YALNIZ arama motoruna giden metinler var: başlık, açıklama,
 *    anahtar kelimeler, ekmek kırıntısı ve `WebApplication` şeması.
 *
 * ⚠️ `featureList` sayfada GÖRÜNEN araçla aynı işlevleri sayar (Google kuralı:
 *    şemada iddia edilen şey sayfada bulunmalı) — uydurma özellik yazma.
 * ⚠️ Sayı/birim çevrilmez (kW, A, km) — dil-nötr.
 */

import { LOCALE_LANGS } from "../../lib/localeProductSeo";

/** tr + en + 5 dil + x-default — TÜM sürümler AYNI kümeyi verir.
 *  ⚠️ Tek yönlü/eksik küme Google'da karşılıklılık hatası üretir. */
export function hreflangKumesi(slug: string): Record<string, string> {
  const k: Record<string, string> = { tr: `/${slug}` };
  for (const l of ["en", ...LOCALE_LANGS]) k[l] = `/${l}/${slug}`;
  k["x-default"] = `/${slug}`;
  return k;
}

export type HesapMeta = {
  title: string;
  desc: string;
  keywords: string[];
  anasayfa: string;
  sayfa: string;
  semaAd: string;
  semaAciklama: string;
  ozellikler: [string, string, string, string];
  ogLocale: string;
  inLanguage: string;
};

export const HESAP_META: Record<string, HesapMeta> = {
  en: {
    title: "EV Charging Time Calculator",
    desc: "Calculate your EV charging time: pick your car and the charging power to see the estimated duration and the cost per kilometre — for AC and DC, taking the car's onboard limit into account.",
    keywords: [
      "ev charging time calculator", "how long to charge an electric car",
      "ev charging cost calculator", "cost per km electric car", "home charging calculator",
    ],
    anasayfa: "Home",
    sayfa: "Charging Time Calculator",
    semaAd: "EV Charging Time Calculator",
    semaAciklama:
      "Calculates the estimated charging time and the cost per kilometre from the battery capacity, the car's onboard AC charging power and the selected current step.",
    ozellikler: [
      "Battery capacity and onboard AC power by car model",
      "AC and DC charging time estimate",
      "Power calculation by current step",
      "Cost per kilometre from the electricity price",
    ],
    ogLocale: "en_US",
    inLanguage: "en",
  },
  de: {
    title: "Ladezeit-Rechner für Elektroautos",
    desc: "Berechnen Sie die Ladezeit Ihres Elektroautos: Fahrzeug und Ladeleistung wählen und die geschätzte Dauer sowie die Kosten pro Kilometer sehen — für AC und DC, unter Berücksichtigung des fahrzeugseitigen Limits.",
    keywords: [
      "ladezeit rechner", "wie lange lädt ein elektroauto", "ladekosten rechner",
      "kosten pro kilometer elektroauto", "wallbox ladezeit",
    ],
    anasayfa: "Startseite",
    sayfa: "Ladezeit-Rechner",
    semaAd: "Ladezeit-Rechner für Elektroautos",
    semaAciklama:
      "Berechnet die geschätzte Ladezeit und die Kosten pro Kilometer aus Batteriekapazität, fahrzeugeigener AC-Ladeleistung und gewählter Stromstufe.",
    ozellikler: [
      "Batteriekapazität und AC-Ladeleistung je Fahrzeugmodell",
      "Schätzung der AC- und DC-Ladezeit",
      "Leistungsberechnung nach Stromstufe",
      "Kosten pro Kilometer nach Strompreis",
    ],
    ogLocale: "de_DE",
    inLanguage: "de",
  },
  es: {
    title: "Calculadora de tiempo de carga para coches eléctricos",
    desc: "Calcula el tiempo de carga de tu coche eléctrico: elige el vehículo y la potencia de carga para ver la duración estimada y el coste por kilómetro, en CA y CC, teniendo en cuenta el límite del propio vehículo.",
    keywords: [
      "calculadora tiempo de carga", "cuánto tarda en cargar un coche eléctrico",
      "coste carga coche eléctrico", "coste por kilómetro coche eléctrico", "calculadora carga en casa",
    ],
    anasayfa: "Inicio",
    sayfa: "Calculadora de tiempo de carga",
    semaAd: "Calculadora de tiempo de carga para coches eléctricos",
    semaAciklama:
      "Calcula el tiempo estimado de carga y el coste por kilómetro a partir de la capacidad de la batería, la potencia del cargador interno del vehículo y el escalón de corriente seleccionado.",
    ozellikler: [
      "Capacidad de batería y potencia de carga CA por modelo",
      "Estimación del tiempo de carga en CA y CC",
      "Cálculo de potencia según el escalón de corriente",
      "Coste por kilómetro según el precio de la electricidad",
    ],
    ogLocale: "es_ES",
    inLanguage: "es",
  },
  ru: {
    title: "Калькулятор времени зарядки электромобиля",
    desc: "Рассчитайте время зарядки электромобиля: выберите автомобиль и мощность зарядки, чтобы увидеть примерную продолжительность и стоимость на километр — для AC и DC, с учётом ограничения бортового зарядного устройства.",
    keywords: [
      "калькулятор времени зарядки", "сколько заряжается электромобиль",
      "стоимость зарядки электромобиля", "стоимость на километр электромобиль", "расчёт домашней зарядки",
    ],
    anasayfa: "Главная",
    sayfa: "Калькулятор времени зарядки",
    semaAd: "Калькулятор времени зарядки электромобиля",
    semaAciklama:
      "Рассчитывает примерное время зарядки и стоимость на километр по ёмкости батареи, мощности бортового зарядного устройства автомобиля и выбранной ступени тока.",
    ozellikler: [
      "Ёмкость батареи и мощность бортового зарядного устройства по модели",
      "Оценка времени зарядки AC и DC",
      "Расчёт мощности по ступени тока",
      "Стоимость на километр по цене электроэнергии",
    ],
    ogLocale: "ru_RU",
    inLanguage: "ru",
  },
  nl: {
    title: "Laadtijd-calculator voor elektrische auto's",
    desc: "Bereken de laadtijd van je elektrische auto: kies je auto en het laadvermogen en zie de geschatte tijd en de kosten per kilometer — voor AC en DC, met de limiet van de auto meegerekend.",
    keywords: [
      "laadtijd calculator", "hoe lang laden elektrische auto", "laadkosten berekenen",
      "kosten per kilometer elektrische auto", "thuis laden calculator",
    ],
    anasayfa: "Home",
    sayfa: "Laadtijd-calculator",
    semaAd: "Laadtijd-calculator voor elektrische auto's",
    semaAciklama:
      "Berekent de geschatte laadtijd en de kosten per kilometer op basis van de accucapaciteit, het ingebouwde AC-laadvermogen van de auto en de gekozen stroomstand.",
    ozellikler: [
      "Accucapaciteit en ingebouwd AC-laadvermogen per model",
      "Schatting van AC- en DC-laadtijd",
      "Vermogensberekening per stroomstand",
      "Kosten per kilometer op basis van de stroomprijs",
    ],
    ogLocale: "nl_NL",
    inLanguage: "nl",
  },
  ar: {
    title: "حاسبة مدة شحن السيارة الكهربائية",
    desc: "احسب مدة شحن سيارتك الكهربائية: اختر السيارة وقدرة الشحن لترى المدة التقديرية والتكلفة لكل كيلومتر، للشحن المتناوب والسريع مع مراعاة حدّ الشاحن الداخلي.",
    keywords: [
      "حاسبة مدة الشحن", "كم ساعة يستغرق شحن السيارة الكهربائية", "مدة شحن السيارة الكهربائية",
      "تكلفة شحن السيارة الكهربائية", "حاسبة الشحن المنزلي",
    ],
    anasayfa: "الصفحة الرئيسية",
    sayfa: "حاسبة مدة الشحن",
    semaAd: "حاسبة مدة شحن السيارة الكهربائية",
    semaAciklama:
      "تحسب المدة التقديرية للشحن والتكلفة لكل كيلومتر بحسب سعة البطارية وقدرة الشاحن الداخلي في السيارة ودرجة التيار المختارة.",
    ozellikler: [
      "سعة البطارية وقدرة الشحن المتناوب الداخلية بحسب طراز السيارة",
      "تقدير مدة الشحن المتناوب والسريع",
      "حساب القدرة بحسب درجة التيار",
      "التكلفة لكل كيلومتر بحسب سعر الكهرباء",
    ],
    ogLocale: "ar_AE",
    inLanguage: "ar",
  },
};
