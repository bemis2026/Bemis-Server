// Blog dil kollarının SEO metinleri — TEK KAYNAK.
//
// ⚠️ NEDEN AYRI DOSYA: aynı metinler hem `app/[lang]/blog/**` (de/es/ru/nl/ar) hem
// `app/en/blog/**` (İngilizce ayrı statik ağaç) tarafından okunur. İki yerde tutulsa
// zamanla ayrışırdı.
//
// ⚠️ KEYWORDS AÇIKÇA VERİLİR: Next'te bir metadata alanını "vermemek" onu gizlemez,
// KÖK YERLEŞİMDEN miras alır — kökteki liste TÜRKÇE'dir. Arapça kolda bu ölçülmüş ve
// canlıda Türkçe keywords basıldığı görülmüştü (2026-09-10). Her dil kendi listesini verir.
//
// ⚠️ İçerikte uydurma YOK: yalnız konu başlıkları. Fiyat/teslim süresi/rakip marka geçmez.

import { LOCALE_OG } from "./localeProductSeo";

export type BlogSeo = {
  baslik: string;
  aciklama: string;
  keywords: string[];
  ogLocale: string;
  /** Ekmek kırıntısı etiketleri */
  anaSayfa: string;
  blog: string;
  /** OG görselindeki metin */
  ogMetin: string;
};

export const BLOG_SEO: Record<string, BlogSeo> = {
  en: {
    baslik: "EV Charging Guides and Technical Articles | Bemis E-V Charge",
    aciklama:
      "Practical guides on charging electric vehicles: choosing cables and adapters, installation, V2L, load management and more — from the Bemis E-V Charge blog.",
    keywords: [
      "EV charging guide",
      "electric vehicle charging",
      "Type 2 charging cable",
      "CCS2 connector",
      "AC wallbox",
      "DC fast charging",
      "V2L adapter",
      "OCPP",
      "load management",
    ],
    ogLocale: "en_US",
    anaSayfa: "Home",
    blog: "Blog",
    ogMetin: "Bemis E-V Charge — EV charging guides",
  },
  de: {
    baslik: "Ratgeber und Fachbeiträge zum Laden von E-Autos | Bemis E-V Charge",
    aciklama:
      "Praktische Ratgeber rund um das Laden von Elektroautos: Auswahl von Kabel und Adapter, Installation, V2L, Lastmanagement und mehr — aus dem Blog von Bemis E-V Charge.",
    keywords: [
      "Ladeleitfaden für E-Autos",
      "Elektroauto laden",
      "Type 2 Ladekabel",
      "CCS2 Stecker",
      "AC Wallbox",
      "DC Schnellladen",
      "V2L Adapter",
      "OCPP",
      "Lastmanagement",
    ],
    ogLocale: LOCALE_OG.de,
    anaSayfa: "Startseite",
    blog: "Blog",
    ogMetin: "Bemis E-V Charge — Ratgeber zum Laden von E-Autos",
  },
  es: {
    baslik: "Guías y artículos técnicos de carga de vehículos eléctricos | Bemis E-V Charge",
    aciklama:
      "Guías prácticas sobre la carga de vehículos eléctricos: elección de cable y adaptador, instalación, V2L, gestión de carga y más — del blog de Bemis E-V Charge.",
    keywords: [
      "guía de carga de vehículos eléctricos",
      "cargar coche eléctrico",
      "cable de carga Type 2",
      "conector CCS2",
      "wallbox AC",
      "carga rápida DC",
      "adaptador V2L",
      "OCPP",
      "gestión de carga",
    ],
    ogLocale: LOCALE_OG.es,
    anaSayfa: "Inicio",
    blog: "Blog",
    ogMetin: "Bemis E-V Charge — guías de carga de vehículos eléctricos",
  },
  ru: {
    baslik: "Руководства и технические статьи о зарядке электромобилей | Bemis E-V Charge",
    aciklama:
      "Практические руководства по зарядке электромобилей: выбор кабеля и адаптера, монтаж, V2L, управление нагрузкой и не только — из блога Bemis E-V Charge.",
    keywords: [
      "руководство по зарядке электромобиля",
      "зарядка электромобиля",
      "кабель Type 2",
      "разъём CCS2",
      "настенная станция AC",
      "быстрая зарядка DC",
      "адаптер V2L",
      "OCPP",
      "управление нагрузкой",
    ],
    ogLocale: LOCALE_OG.ru,
    anaSayfa: "Главная",
    blog: "Блог",
    ogMetin: "Bemis E-V Charge — руководства по зарядке электромобилей",
  },
  nl: {
    baslik: "Gidsen en technische artikelen over EV-laden | Bemis E-V Charge",
    aciklama:
      "Praktische gidsen over het laden van elektrische auto's: kabel en adapter kiezen, installatie, V2L, lastbeheer en meer — uit de blog van Bemis E-V Charge.",
    keywords: [
      "gids EV-laden",
      "elektrische auto laden",
      "Type 2-laadkabel",
      "CCS2-connector",
      "AC-wallbox",
      "DC-snelladen",
      "V2L-adapter",
      "OCPP",
      "lastbeheer",
    ],
    ogLocale: LOCALE_OG.nl,
    anaSayfa: "Home",
    blog: "Blog",
    ogMetin: "Bemis E-V Charge — gidsen over EV-laden",
  },
  ar: {
    baslik: "أدلة شحن السيارات الكهربائية ومقالات تقنية | Bemis E-V Charge",
    aciklama:
      "أدلة عملية حول شحن السيارات الكهربائية: اختيار الكابل والمحوّل، التركيب، V2L، إدارة الأحمال والمزيد — من مدوّنة Bemis E-V Charge.",
    keywords: [
      "دليل شحن السيارات الكهربائية",
      "شحن السيارة الكهربائية",
      "كابل شحن Type 2",
      "موصّل CCS2",
      "شاحن جداري AC",
      "الشحن السريع DC",
      "محوّل V2L",
      "OCPP",
      "إدارة الأحمال",
    ],
    ogLocale: LOCALE_OG.ar,
    anaSayfa: "الرئيسية",
    blog: "المدوّنة",
    ogMetin: "Bemis E-V Charge — أدلة شحن السيارات الكهربائية",
  },
};

/**
 * Blog hreflang kümesi — KARŞILIKLI olmalı.
 * ⚠️ Google tek yönlü kümede karşılıklılık hatası verir: TR sayfası `de` girişini
 * veriyorsa `/de/blog` de `tr` girişini vermeli. Bu yüzden küme TEK fonksiyondan
 * üretilir ve hem TR hem dil kolu rotaları BUNU çağırır.
 *
 * @param yol   TR yolu, ör. "/blog" ya da "/blog/<slug>"
 * @param diller O sayfanın ADRESİ olan yabancı diller (yazı bazında değişir)
 */
export function blogHreflang(yol: string, diller: readonly string[]): Record<string, string> {
  const kume: Record<string, string> = { tr: yol };
  for (const l of diller) kume[l] = `/${l}${yol}`;
  kume["x-default"] = yol;
  return kume;
}
