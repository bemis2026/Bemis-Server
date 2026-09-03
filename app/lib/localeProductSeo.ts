// Almanca / İspanyolca / Rusça (/de /es /ru) ürün & kategori SEO metinleri — TEK KAYNAK.
// app/[lang]/products/... sayfaları buradan okur. İngilizce eşi: app/lib/enProductSeo.ts.
//
// ⚠️ Kategori başlık/açıklamaları ELLE yazıldı (ihracat/OEM niyetine göre);
// gerçek ürün aralıklarıyla uyumlu — uydurma spec YOK (7,4–22 kW · 6–32 A · 3–15 m ·
// 40–200 kW · IP65 · OCPP · CE · 1994 · 60+ ülke = sitede zaten yazılı olgular).
// Ürün meta'sı, enProductSeo.ts'teki desenle ürünün KENDİ spec'lerinden türetilir.

import { productNameLocale, type LocaleNameLang } from "./productNamesLocale";

export type LocaleLang = LocaleNameLang; // "de" | "es" | "ru"
export const LOCALE_LANGS: LocaleLang[] = ["de", "es", "ru", "nl"];
export const LOCALE_OG: Record<LocaleLang, string> = { de: "de_DE", es: "es_ES", ru: "ru_RU", nl: "nl_NL" };

type CatSeo = { name: string; title: string; description: string };

export const LOCALE_CATEGORY_SEO: Record<LocaleLang, Record<string, CatSeo>> = {
  de: {
    "wallbox": { name: "AC-Wallbox-Ladestationen", title: "Wallbox-Hersteller für Elektroautos (7,4–22 kW, OCPP)", description: "Type-2-AC-Wallboxen 7,4–22 kW, ein- und dreiphasig, IP65, OCPP-fähig. Hergestellt in der Türkei seit 1994. OEM/ODM, Private Label und Großhandelsexport." },
    "portable": { name: "Mobile Ladegeräte", title: "Hersteller mobiler Ladegeräte (Type 2, 6–32 A einstellbar)", description: "Mobile Type-2-Ladegeräte, 6–32 A einstellbar, Plug-and-Charge ohne Installation. CE, IP65. Hergestellt in der Türkei. OEM und Großhandelsexport." },
    "cables": { name: "Ladekabel für Elektroautos", title: "Hersteller von Type-2-Ladekabeln (Mode 3, 16–32 A)", description: "Type-2-/Mode-3-Ladekabel, 16–32 A, ein- und dreiphasig, 3–15 m, halogenfrei. CE, IEC 62196. Hergestellt in der Türkei. OEM und Großhandelsexport." },
    "v2l-c2l": { name: "V2L- / C2L-Adapter", title: "Hersteller von V2L- und C2L-Adaptern für Elektroautos", description: "Vehicle-to-Load-(V2L-) und C2L-Adapter — Geräte direkt aus dem Elektroauto versorgen. Markenkompatibel, CE. Hergestellt in der Türkei, weltweiter Export." },
    "converters": { name: "Verlängerungskabel & Adapter", title: "Hersteller von Ladeverlängerungen und CEE-Adaptern", description: "Verlängerungskabel und CEE-Adapter/-Konverter für die Ladeinfrastruktur, Type-2-kompatibel. CE. Hergestellt in der Türkei, Export in 60+ Länder." },
    "charger-equipment": { name: "Komponenten für Ladestationen", title: "EVSE-Komponenten und Ersatzteile für Ladestationen", description: "Komponenten, Steckdosen, Anschlüsse und Ersatzteile für Ladestationen. OEM-Lieferung für Hersteller und Betreiber. Hergestellt in der Türkei." },
    "accessories": { name: "Zubehör für Elektroauto-Laden", title: "Hersteller und Lieferant von Ladezubehör", description: "Zubehör für das Laden von Elektroautos — Steckdosenhalter, Tragetaschen, Kabelmanagement. CE. Hergestellt in der Türkei, Großhandelsexport." },
    "dc-units": { name: "DC-Schnellladestationen", title: "Hersteller von DC-Schnellladestationen (CCS2, OCPP)", description: "DC-Schnellladestationen 40–200 kW mit CCS2, OCPP-fähig. Hergestellt in der Türkei. OEM/ODM und Großhandelsexport für Betreiber und Distributoren." },
  },
  es: {
    "wallbox": { name: "Estaciones de carga AC Wallbox", title: "Fabricante de wallbox para coche eléctrico (7,4–22 kW, OCPP)", description: "Wallbox AC Type 2 de 7,4 a 22 kW, monofásico y trifásico, IP65, compatible con OCPP. Fabricado en Türkiye desde 1994. OEM/ODM, marca blanca y exportación mayorista." },
    "portable": { name: "Cargadores portátiles", title: "Fabricante de cargadores portátiles (Type 2, 6–32 A ajustable)", description: "Cargadores portátiles Type 2, 6–32 A ajustable, enchufar y cargar sin instalación. CE, IP65. Fabricado en Türkiye. OEM y exportación mayorista." },
    "cables": { name: "Cables de carga para coche eléctrico", title: "Fabricante de cables de carga Type 2 (Modo 3, 16–32 A)", description: "Cables de carga Type 2 / Modo 3, 16–32 A, monofásico y trifásico, 3–15 m, libres de halógenos. CE, IEC 62196. Fabricado en Türkiye. OEM y exportación mayorista." },
    "v2l-c2l": { name: "Adaptadores V2L / C2L", title: "Fabricante de adaptadores V2L y C2L para vehículos eléctricos", description: "Adaptadores Vehicle-to-Load (V2L) y C2L: alimente sus dispositivos desde el coche. Compatibles por marca, CE. Fabricado en Türkiye, exportación mundial." },
    "converters": { name: "Alargadores y adaptadores", title: "Fabricante de alargadores de carga y adaptadores CEE", description: "Cables alargadores y adaptadores/convertidores CEE para la carga, compatibles con Type 2. CE. Fabricado en Türkiye, exportación a más de 60 países." },
    "charger-equipment": { name: "Componentes para cargadores", title: "Componentes EVSE y repuestos para estaciones de carga", description: "Componentes, tomas, conectores y repuestos para estaciones de carga. Suministro OEM para fabricantes y operadores. Fabricado en Türkiye." },
    "accessories": { name: "Accesorios de carga", title: "Fabricante y proveedor de accesorios de carga para coche eléctrico", description: "Accesorios de carga: soportes de conector, bolsas de transporte, gestión de cables. CE. Fabricado en Türkiye, exportación mayorista." },
    "dc-units": { name: "Cargadores rápidos DC", title: "Fabricante de cargadores rápidos DC (CCS2, OCPP)", description: "Cargadores rápidos DC de 40 a 200 kW con CCS2, compatibles con OCPP. Fabricado en Türkiye. OEM/ODM y exportación mayorista para operadores y distribuidores." },
  },
  ru: {
    "wallbox": { name: "Настенные зарядные станции AC", title: "Производитель настенных зарядных станций (7,4–22 кВт, OCPP)", description: "Настенные зарядные станции AC Type 2 на 7,4–22 кВт, одно- и трёхфазные, IP65, с поддержкой OCPP. Производство в Турции с 1994 года. OEM/ODM, частная марка и оптовый экспорт." },
    "portable": { name: "Переносные зарядные устройства", title: "Производитель переносных зарядных устройств (Type 2, 6–32 А)", description: "Переносные зарядные устройства Type 2 с регулировкой 6–32 А, без монтажа. CE, IP65. Производство в Турции. OEM и оптовый экспорт." },
    "cables": { name: "Зарядные кабели для электромобилей", title: "Производитель зарядных кабелей Type 2 (Mode 3, 16–32 А)", description: "Зарядные кабели Type 2 / Mode 3, 16–32 А, одно- и трёхфазные, 3–15 м, безгалогенные. CE, IEC 62196. Производство в Турции. OEM и оптовый экспорт." },
    "v2l-c2l": { name: "Адаптеры V2L / C2L", title: "Производитель адаптеров V2L и C2L для электромобилей", description: "Адаптеры Vehicle-to-Load (V2L) и C2L — питание устройств от электромобиля. Совместимость по маркам, CE. Производство в Турции, экспорт по всему миру." },
    "converters": { name: "Удлинители и адаптеры", title: "Производитель удлинителей и CEE-адаптеров для зарядки", description: "Удлинители и CEE-адаптеры/переходники для зарядной инфраструктуры, совместимые с Type 2. CE. Производство в Турции, экспорт в 60+ стран." },
    "charger-equipment": { name: "Компоненты зарядных станций", title: "Компоненты EVSE и запчасти для зарядных станций", description: "Компоненты, розетки, разъёмы и запчасти для зарядных станций. OEM-поставки производителям и операторам. Производство в Турции." },
    "accessories": { name: "Аксессуары для зарядки", title: "Производитель и поставщик аксессуаров для зарядки электромобилей", description: "Аксессуары для зарядки: держатели разъёмов, сумки, организация кабеля. CE. Производство в Турции, оптовый экспорт." },
    "dc-units": { name: "Быстрые зарядные станции DC", title: "Производитель быстрых зарядных станций DC (CCS2, OCPP)", description: "Быстрые зарядные станции DC мощностью 40–200 кВт с CCS2, поддержка OCPP. Производство в Турции. OEM/ODM и оптовый экспорт для операторов и дистрибьюторов." },
  },
  nl: {
    "wallbox": { name: "AC-wallbox laadstations", title: "Fabrikant van wallboxen voor elektrische auto's (7,4–22 kW, OCPP)", description: "Type 2 AC-wallboxen van 7,4–22 kW, een- en driefasig, IP65, OCPP-compatibel. Geproduceerd in Türkiye sinds 1994. OEM/ODM, private label en groothandelsexport." },
    "portable": { name: "Mobiele laders", title: "Fabrikant van mobiele laders (Type 2, 6–32 A instelbaar)", description: "Mobiele Type 2-laders, 6–32 A instelbaar, insteken en laden zonder installatie. CE, IP65. Geproduceerd in Türkiye. OEM en groothandelsexport." },
    "cables": { name: "Laadkabels voor elektrische auto's", title: "Fabrikant van Type 2-laadkabels (Mode 3, 16–32 A)", description: "Type 2 / Mode 3-laadkabels, 16–32 A, een- en driefasig, 3–15 m, halogeenvrij. CE, IEC 62196. Geproduceerd in Türkiye. OEM en groothandelsexport." },
    "v2l-c2l": { name: "V2L- / C2L-adapters", title: "Fabrikant van V2L- en C2L-adapters voor elektrische auto's", description: "Vehicle-to-Load (V2L)- en C2L-adapters — apparaten rechtstreeks vanuit de elektrische auto voeden. Merkcompatibel, CE. Geproduceerd in Türkiye, wereldwijde export." },
    "converters": { name: "Verlengkabels & adapters", title: "Fabrikant van laadverlengkabels en CEE-adapters", description: "Verlengkabels en CEE-adapters/verloopstukken voor laadinfrastructuur, Type 2-compatibel. CE. Geproduceerd in Türkiye, export naar 60+ landen." },
    "charger-equipment": { name: "Componenten voor laadstations", title: "EVSE-componenten en reserveonderdelen voor laadstations", description: "Componenten, contactdozen, connectoren en reserveonderdelen voor laadstations. OEM-levering aan fabrikanten en operators. Geproduceerd in Türkiye." },
    "accessories": { name: "Accessoires voor EV-laden", title: "Fabrikant en leverancier van laadaccessoires", description: "Accessoires voor het laden van elektrische auto's — connectorhouders, draagtassen, kabelmanagement. CE. Geproduceerd in Türkiye, groothandelsexport." },
    "dc-units": { name: "DC-snellaadstations", title: "Fabrikant van DC-snellaadstations (CCS2, OCPP)", description: "DC-snellaadstations van 40–200 kW met CCS2, OCPP-compatibel. Geproduceerd in Türkiye. OEM/ODM en groothandelsexport voor operators en distributeurs." },
  },
};

// Sayfa kabuğu dizeleri (breadcrumb, JSON-LD adları, geri dönüş metinleri).
export const LOCALE_UI: Record<LocaleLang, {
  home: string; products: string; allProducts: string; allProductsTitle: string; allProductsDesc: string;
  catalogueDesc: string; notFoundCat: string; notFoundProduct: string; contactLine: string; manufacturedBy: string; phase3: string; phase1: string; cable: string;
}> = {
  de: {
    home: "Startseite", products: "Produkte", allProducts: "Alle Produkte",
    allProductsTitle: "Hersteller von Ladetechnik für Elektroautos — Alle Produkte",
    allProductsDesc: "AC-Wallboxen, mobile Ladegeräte, DC-Schnellladestationen, Type-2-/Mode-3-Kabel, V2L-Adapter und OEM-Komponenten. Bemis E-V Charge — hergestellt in der Türkei, CE & IP65, OCPP-fähig. OEM/ODM und Großhandelsexport.",
    catalogueDesc: "Bemis E-V Charge Produktkatalog — alle Ladekategorien und Produkte für Elektroautos.",
    notFoundCat: "Kategorie nicht gefunden", notFoundProduct: "Produkt nicht gefunden",
    contactLine: "Kontaktieren Sie uns für Preise, Großhandel und OEM-/Private-Label-Bestellungen.",
    manufacturedBy: "Hergestellt von Bemis E-V Charge in Bursa, Türkei.",
    phase3: "dreiphasig", phase1: "einphasig", cable: "Kabel",
  },
  es: {
    home: "Inicio", products: "Productos", allProducts: "Todos los productos",
    allProductsTitle: "Fabricante de equipos de carga para coche eléctrico — Todos los productos",
    allProductsDesc: "Wallbox AC, cargadores portátiles, cargadores rápidos DC, cables Type 2 / Modo 3, adaptadores V2L y componentes OEM. Bemis E-V Charge — fabricado en Türkiye, CE e IP65, compatible con OCPP. OEM/ODM y exportación mayorista.",
    catalogueDesc: "Catálogo de productos Bemis E-V Charge — todas las categorías y productos de carga para vehículos eléctricos.",
    notFoundCat: "Categoría no encontrada", notFoundProduct: "Producto no encontrado",
    contactLine: "Contáctenos para precios, venta mayorista y pedidos OEM / marca blanca.",
    manufacturedBy: "Fabricado por Bemis E-V Charge en Bursa, Türkiye.",
    phase3: "trifásico", phase1: "monofásico", cable: "cable",
  },
  ru: {
    home: "Главная", products: "Продукция", allProducts: "Все товары",
    allProductsTitle: "Производитель зарядного оборудования для электромобилей — Все товары",
    allProductsDesc: "Настенные станции AC, переносные зарядные устройства, быстрые станции DC, кабели Type 2 / Mode 3, адаптеры V2L и OEM-компоненты. Bemis E-V Charge — производство в Турции, CE и IP65, поддержка OCPP. OEM/ODM и оптовый экспорт.",
    catalogueDesc: "Каталог продукции Bemis E-V Charge — все категории и товары для зарядки электромобилей.",
    notFoundCat: "Категория не найдена", notFoundProduct: "Товар не найден",
    contactLine: "Свяжитесь с нами по вопросам цен, оптовых и OEM-заказов.",
    manufacturedBy: "Производитель: Bemis E-V Charge, Бурса, Турция.",
    phase3: "трёхфазный", phase1: "однофазный", cable: "кабель",
  },
  nl: {
    home: "Home", products: "Producten", allProducts: "Alle producten",
    allProductsTitle: "Fabrikant van laadapparatuur voor elektrische auto's — Alle producten",
    allProductsDesc: "AC-wallboxen, mobiele laders, DC-snellaadstations, Type 2 / Mode 3-kabels, V2L-adapters en OEM-componenten. Bemis E-V Charge — geproduceerd in Türkiye, CE & IP65, OCPP-compatibel. OEM/ODM en groothandelsexport.",
    catalogueDesc: "Productcatalogus Bemis E-V Charge — alle laadcategorieën en producten voor elektrische auto's.",
    notFoundCat: "Categorie niet gevonden", notFoundProduct: "Product niet gevonden",
    contactLine: "Neem contact met ons op voor prijzen, groothandel en OEM-/private-labelorders.",
    manufacturedBy: "Geproduceerd door Bemis E-V Charge in Bursa, Türkiye.",
    phase3: "driefasig", phase1: "eenfasig", cable: "kabel",
  },
};

export function localeCategoryMeta(lang: LocaleLang, id: string, fallbackName: string): CatSeo {
  return LOCALE_CATEGORY_SEO[lang][id] ?? {
    name: fallbackName,
    title: `${fallbackName} | Bemis E-V Charge`,
    description: `${fallbackName} — ${LOCALE_UI[lang].manufacturedBy} CE. OEM/ODM.`,
  };
}

// ── Ürün meta'sı — enProductSeo.enProductHighlights ile aynı olgusal desen ────
type SpecItem = { label?: string; value?: string };
type SpecGroup = { group?: string; items?: SpecItem[] };
type ProductLike = { name?: string; specs?: SpecGroup[] };

function specValue(product: ProductLike, labelPattern: RegExp): string | null {
  for (const g of product.specs ?? []) {
    const it = (g.items ?? []).find((i) => i?.label && labelPattern.test(i.label));
    if (it?.value) return String(it.value).trim();
  }
  return null;
}

/** Ürünün spec'lerinden o dilde olgusal "öne çıkanlar" (yalnız veride olan değerler). */
export function localeProductHighlights(product: ProductLike, lang: LocaleLang): string[] {
  const ui = LOCALE_UI[lang];
  const bits: string[] = [];
  const power = specValue(product, /güç|power/i);
  if (power) bits.push(lang === "ru" ? power.replace(/kW/i, "кВт") : power);
  const phase = specValue(product, /^faz$|phase/i);
  if (phase) {
    if (/trifaze|three/i.test(phase)) bits.push(ui.phase3);
    else if (/monofaze|single/i.test(phase)) bits.push(ui.phase1);
  }
  const amp = specValue(product, /maks.*akım|current/i);
  if (amp) bits.push(amp);
  const len = specValue(product, /kablo uzunlu|cable length/i);
  if (len) bits.push(`${len} ${ui.cable}`);
  const conn = specValue(product, /konnektör|connector/i);
  if (conn) bits.push(conn.replace(/\s*\(.*?\)\s*/g, "").trim());
  return bits.filter(Boolean);
}

/** O dilde ürün meta başlığı + açıklaması (spec-türetimli, olgusal). ⚠️ TR ürün nesnesi verilir. */
export function localeProductMeta(product: ProductLike, lang: LocaleLang, categoryId: string, fallbackCategoryName: string) {
  const name = productNameLocale(lang, product.name);
  const cat = localeCategoryMeta(lang, categoryId, fallbackCategoryName);
  const bits = localeProductHighlights(product, lang);
  const title = `${name} — ${cat.name} | Bemis E-V Charge`;
  const specLine = bits.length ? `${bits.join(" · ")}. ` : "";
  const description = `${name} — ${specLine}${LOCALE_UI[lang].manufacturedBy} ${LOCALE_UI[lang].contactLine}`;
  return { name, title, description, categoryName: cat.name };
}
