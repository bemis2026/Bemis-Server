// Teknik SVG diyagramların DİL ETİKETLERİ — tek kaynak.
// diagrams.ts bu etiketleri şablona basar; scripts/gen-diagram-i18n.mts da buradan
// üretip data/i18n/{blog,glossary}.json içine yazar (istemci dil değiştirince de çevrili görünsün).
//
// ⚠️ SVG <text> SARMAZ: uzun çeviri viewBox dışına taşar ve KIRPILIR. Etiketleri kısa tut,
//    değiştirdikten sonra `npm run gen:diagram-i18n` çalıştır ve görsel olarak doğrula.
// ⚠️ Diller: tr (kaynak) + en/de/es/ru/ar (blog+sözlük) + nl (yalnız sözlük).
// ⚠️ Rakip marka YOK; sayısal değerler (7,4–22 kW · 40–200 kW · 22 kW) TR kaynakla AYNI kalmalı.

export type Type2Etiket = {
  t: string; d: string; alt: string; cap: string;
  ust: string; ustNot: string; alt2: string; s1: string; s2: string; dip: string;
};
export type ModEtiket = {
  t: string; d: string; alt: string; cap: string;
  m2: string; priz: string; icpd: string; icpdAlt: string; arac: string; m2not: string;
  m3: string; wb: string; wbAlt: string; m3not1: string; m3not2: string;
};
export type DlmEtiket = {
  t: string; d: string; alt: string; cap: string;
  pano: string; limit: string; dlm: string; kont: string; wb: string;
  n1: string; n2: string; n3: string;
};
export type AcDcEtiket = {
  t: string; alt: string; cap: string;
  ac: string; dc: string; seb: string; ist: string; arac: string; ob: string; bat: string; cev: string;
};

export const TYPE2: Record<string, Type2Etiket> = {
  tr: {
    t: "Type 2 ile CCS2 pin dizilimi farkı",
    d: "Type 2 soketi yedi pinlidir (L1, L2, L3 güç, N nötr, PE toprak, CP ve PP haberleşme) ve yalnız AC şarj sağlar; CCS2 aynı yedi pine ek olarak alttaki iki DC pini (DC+ ve DC−) ile AC ve DC hızlı şarjı tek soketle destekler.",
    alt: "Type 2 ve CCS2 soketlerinin pin dizilimi karşılaştırması: Type 2 yedi pinlidir (L1, L2, L3 güç + N nötr + PE toprak + CP ve PP haberleşme) ve yalnız AC şarj sağlar; CCS2 aynı yedi pine ek olarak altta iki büyük DC pini (DC+ ve DC−) ile AC ve DC hızlı şarjı tek soketle destekler.",
    cap: "Type 2 (yalnız AC, 7 pin) ile CCS2/Combo 2 (aynı 7 pin + 2 DC pini) farkı — CCS2'de aynı soketle hem AC hem DC hızlı şarj yapılır.",
    ust: "Type 2 — yalnız AC (7 pin)",
    ustNot: "3 faz güç (L1·L2·L3) + N + PE (toprak) + CP/PP (haberleşme) — 7,4–22 kW AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "Type 2'nin aynı 7 pini",
    s2: "+ altta 2 güçlü DC pini:",
    dip: "Aynı soketle AC + DC hızlı şarj (Bemis BEVDC 40–200 kW) — araçta tek giriş yeterli",
  },
  en: {
    t: "Type 2 vs CCS2 pin layout",
    d: "The Type 2 socket has seven pins (L1, L2, L3 power, N neutral, PE earth, CP and PP communication) and provides AC charging only; CCS2 adds two DC pins (DC+ and DC−) below the same seven pins and supports both AC and DC fast charging through a single socket.",
    alt: "Comparison of the pin layout of the Type 2 and CCS2 sockets: Type 2 has seven pins (L1, L2, L3 power + N neutral + PE earth + CP and PP communication) and provides AC charging only; CCS2 adds two large DC pins (DC+ and DC−) below the same seven pins and supports AC and DC fast charging through a single socket.",
    cap: "The difference between Type 2 (AC only, 7 pins) and CCS2/Combo 2 (the same 7 pins + 2 DC pins) — with CCS2 the same socket does both AC and DC fast charging.",
    ust: "Type 2 — AC only (7 pins)",
    ustNot: "3-phase power (L1·L2·L3) + N + PE (earth) + CP/PP (communication) — 7.4–22 kW AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "The same 7 pins as Type 2",
    s2: "+ 2 heavy DC pins below:",
    dip: "AC + DC fast charging from one socket (Bemis BEVDC 40–200 kW) — one inlet on the car is enough",
  },
  de: {
    t: "Type 2 und CCS2 im Pin-Vergleich",
    d: "Der Type-2-Stecker hat sieben Pins (L1, L2, L3 Leistung, N Neutralleiter, PE Erde, CP und PP Kommunikation) und lädt nur mit AC; CCS2 ergänzt unter denselben sieben Pins zwei DC-Pins (DC+ und DC−) und unterstützt AC- und DC-Schnellladen über einen einzigen Anschluss.",
    alt: "Vergleich der Pin-Belegung von Type-2- und CCS2-Steckern: Type 2 hat sieben Pins (L1, L2, L3 Leistung + N Neutralleiter + PE Erde + CP und PP Kommunikation) und lädt nur mit AC; CCS2 ergänzt unter denselben sieben Pins zwei große DC-Pins (DC+ und DC−) und unterstützt AC- und DC-Schnellladen über einen einzigen Anschluss.",
    cap: "Der Unterschied zwischen Type 2 (nur AC, 7 Pins) und CCS2/Combo 2 (dieselben 7 Pins + 2 DC-Pins) — bei CCS2 lädt derselbe Anschluss sowohl AC als auch DC schnell.",
    ust: "Type 2 — nur AC (7 Pins)",
    ustNot: "Dreiphasig (L1·L2·L3) + N + PE (Erde) + CP/PP (Kommunikation) — 7,4–22 kW AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "Dieselben 7 Pins wie Type 2",
    s2: "+ unten 2 starke DC-Pins:",
    dip: "AC + DC-Schnellladen über einen Anschluss (Bemis BEVDC 40–200 kW) — ein Einlass am Auto genügt",
  },
  es: {
    t: "Type 2 y CCS2: comparación de pines",
    d: "El conector Type 2 tiene siete pines (L1, L2, L3 de potencia, N neutro, PE tierra, CP y PP de comunicación) y solo permite carga AC; CCS2 añade bajo esos mismos siete pines dos pines DC (DC+ y DC−) y admite carga AC y carga rápida DC con una sola toma.",
    alt: "Comparación de la disposición de pines de los conectores Type 2 y CCS2: Type 2 tiene siete pines (L1, L2, L3 de potencia + N neutro + PE tierra + CP y PP de comunicación) y solo permite carga AC; CCS2 añade bajo esos mismos siete pines dos grandes pines DC (DC+ y DC−) y admite carga AC y carga rápida DC con una sola toma.",
    cap: "La diferencia entre Type 2 (solo AC, 7 pines) y CCS2/Combo 2 (los mismos 7 pines + 2 pines DC) — con CCS2 la misma toma hace carga AC y carga rápida DC.",
    ust: "Type 2 — solo AC (7 pines)",
    ustNot: "Potencia trifásica (L1·L2·L3) + N + PE (tierra) + CP/PP (comunicación) — 7,4–22 kW AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "Los mismos 7 pines del Type 2",
    s2: "+ abajo 2 pines DC potentes:",
    dip: "Carga AC + DC rápida con una sola toma (Bemis BEVDC 40–200 kW) — basta una entrada en el coche",
  },
  ru: {
    t: "Type 2 и CCS2: сравнение контактов",
    d: "Разъём Type 2 имеет семь контактов (L1, L2, L3 — мощность, N — нейтраль, PE — земля, CP и PP — связь) и обеспечивает только зарядку AC; CCS2 добавляет под теми же семью контактами два контакта DC (DC+ и DC−) и поддерживает зарядку AC и быструю DC через один разъём.",
    alt: "Сравнение расположения контактов разъёмов Type 2 и CCS2: у Type 2 семь контактов (L1, L2, L3 — мощность, N — нейтраль, PE — земля, CP и PP — связь) и он обеспечивает только зарядку AC; CCS2 добавляет под теми же семью контактами два крупных контакта DC (DC+ и DC−) и поддерживает зарядку AC и быструю DC через один разъём.",
    cap: "Разница между Type 2 (только AC, 7 контактов) и CCS2/Combo 2 (те же 7 контактов + 2 контакта DC) — в CCS2 один разъём даёт и AC, и быструю DC.",
    ust: "Type 2 — только AC (7 контактов)",
    ustNot: "Три фазы (L1·L2·L3) + N + PE (земля) + CP/PP (связь) — 7,4–22 кВт AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "Те же 7 контактов, что у Type 2",
    s2: "+ снизу 2 мощных контакта DC:",
    dip: "AC и быстрая DC через один разъём (Bemis BEVDC 40–200 кВт) — на машине хватает одного входа",
  },
  ar: {
    t: "الفرق بين تخطيط أطراف Type 2 وCCS2",
    d: "مقبس Type 2 له سبعة أطراف (L1 وL2 وL3 للقدرة، وN للحيادي، وPE للتأريض، وCP وPP للاتصال) ويوفّر الشحن AC فقط؛ أما CCS2 فيضيف تحت الأطراف السبعة نفسها طرفَي DC (DC+ وDC−) ويدعم الشحن AC والشحن السريع DC من مقبس واحد.",
    alt: "مقارنة تخطيط أطراف مقبسي Type 2 وCCS2: لمقبس Type 2 سبعة أطراف (L1 وL2 وL3 للقدرة، وN للحيادي، وPE للتأريض، وCP وPP للاتصال) ويوفّر الشحن AC فقط؛ أما CCS2 فيضيف تحت الأطراف السبعة نفسها طرفَي DC كبيرين (DC+ وDC−) ويدعم الشحن AC والشحن السريع DC من مقبس واحد.",
    cap: "الفرق بين Type 2 (‏AC فقط، 7 أطراف) وCCS2 / Combo 2 (الأطراف السبعة نفسها + طرفا DC) — في CCS2 يقوم المقبس نفسه بالشحن AC والشحن السريع DC.",
    ust: "Type 2 — AC فقط (7 أطراف)",
    ustNot: "قدرة ثلاثية الطور (L1·L2·L3) + N + PE (تأريض) + CP/PP (اتصال) — 7,4–22 kW AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "الأطراف السبعة نفسها من Type 2",
    s2: "+ في الأسفل طرفا DC قويان:",
    dip: "شحن AC وDC سريع من مقبس واحد (Bemis BEVDC 40–200 kW) — مدخل واحد في السيارة يكفي",
  },
  nl: {
    t: "Type 2 en CCS2: pinvergelijking",
    d: "De Type 2-connector heeft zeven pinnen (L1, L2, L3 vermogen, N nul, PE aarde, CP en PP communicatie) en laadt alleen met AC; CCS2 voegt onder diezelfde zeven pinnen twee DC-pinnen (DC+ en DC−) toe en ondersteunt AC- en DC-snelladen via één aansluiting.",
    alt: "Vergelijking van de pinindeling van de Type 2- en CCS2-connectoren: Type 2 heeft zeven pinnen (L1, L2, L3 vermogen + N nul + PE aarde + CP en PP communicatie) en laadt alleen met AC; CCS2 voegt onder diezelfde zeven pinnen twee grote DC-pinnen (DC+ en DC−) toe en ondersteunt AC- en DC-snelladen via één aansluiting.",
    cap: "Het verschil tussen Type 2 (alleen AC, 7 pinnen) en CCS2/Combo 2 (dezelfde 7 pinnen + 2 DC-pinnen) — bij CCS2 doet dezelfde aansluiting zowel AC- als DC-snelladen.",
    ust: "Type 2 — alleen AC (7 pinnen)",
    ustNot: "Driefasig (L1·L2·L3) + N + PE (aarde) + CP/PP (communicatie) — 7,4–22 kW AC",
    alt2: "CCS2 / Combo 2 — AC + DC",
    s1: "Dezelfde 7 pinnen als Type 2",
    s2: "+ onderaan 2 zware DC-pinnen:",
    dip: "AC + DC-snelladen via één aansluiting (Bemis BEVDC 40–200 kW) — één inlaat op de auto volstaat",
  },
};

export const MOD: Record<string, ModEtiket> = {
  tr: {
    t: "Mod 2 ile Mod 3 AC şarj karşılaştırması",
    d: "Mod 2'de araç normal prizden, kabloya entegre IC-CPD koruma kutusu üzerinden taşınabilir biçimde ve görece yavaş şarj olur; Mod 3'te araç sabit bir wallbox üzerinden, sürekli haberleşmeyle daha yüksek güçte ve daha güvenli şarj olur.",
    alt: "Mod 2 ve Mod 3 AC şarj karşılaştırması: Mod 2'de araç normal prizle, kabloya entegre IC-CPD koruma kutusu üzerinden taşınabilir biçimde şarj olur ve güç prizle sınırlı olduğu için yavaştır; Mod 3'te araç sabit bir wallbox üzerinden, sürekli haberleşme ile daha yüksek güçte ve daha güvenli şarj olur.",
    cap: "Mod 2 (taşınabilir, IC-CPD korumalı, prize tak) ile Mod 3 (sabit wallbox, sürekli haberleşme) AC şarj farkı.",
    m2: "Mod 2 — taşınabilir (prize tak)",
    priz: "Priz", icpd: "IC-CPD", icpdAlt: "koruma kutusu", arac: "Araç",
    m2not: "Güç prizle sınırlı → görece yavaş; acil/seyrek kullanım ve seyahat çözümü.",
    m3: "Mod 3 — sabit wallbox",
    wb: "Wallbox", wbAlt: "sabit istasyon",
    m3not1: "Sürekli haberleşme → daha yüksek güç,",
    m3not2: "daha güvenli, günlük kullanım (7,4–22 kW).",
  },
  en: {
    t: "Mode 2 vs Mode 3 AC charging",
    d: "In Mode 2 the car charges from an ordinary socket through an IC-CPD protection box built into the cable — portable but relatively slow; in Mode 3 the car charges from a fixed wallbox with continuous communication, at higher power and more safely.",
    alt: "Comparison of Mode 2 and Mode 3 AC charging: in Mode 2 the car charges from an ordinary socket through an IC-CPD protection box built into the cable, and it is slow because the power is limited by the socket; in Mode 3 the car charges from a fixed wallbox with continuous communication, at higher power and more safely.",
    cap: "The difference between Mode 2 (portable, IC-CPD protected, plug into a socket) and Mode 3 (fixed wallbox, continuous communication) AC charging.",
    m2: "Mode 2 — portable (plug into a socket)",
    priz: "Socket", icpd: "IC-CPD", icpdAlt: "protection box", arac: "Car",
    m2not: "Power limited by the socket → relatively slow; for occasional use and travel.",
    m3: "Mode 3 — fixed wallbox",
    wb: "Wallbox", wbAlt: "fixed station",
    m3not1: "Continuous communication → higher power,",
    m3not2: "safer, for everyday use (7.4–22 kW).",
  },
  de: {
    t: "Modus 2 und Modus 3 im AC-Ladevergleich",
    d: "Bei Modus 2 lädt das Auto an einer normalen Steckdose über eine im Kabel integrierte IC-CPD-Schutzbox — tragbar, aber vergleichsweise langsam; bei Modus 3 lädt das Auto an einer festen Wallbox mit ständiger Kommunikation, mit höherer Leistung und sicherer.",
    alt: "Vergleich von Modus 2 und Modus 3 beim AC-Laden: Bei Modus 2 lädt das Auto an einer normalen Steckdose über eine im Kabel integrierte IC-CPD-Schutzbox und ist langsam, weil die Leistung durch die Steckdose begrenzt ist; bei Modus 3 lädt das Auto an einer festen Wallbox mit ständiger Kommunikation, mit höherer Leistung und sicherer.",
    cap: "Der Unterschied zwischen Modus 2 (tragbar, IC-CPD-geschützt, in die Steckdose) und Modus 3 (feste Wallbox, ständige Kommunikation) beim AC-Laden.",
    m2: "Modus 2 — tragbar (in die Steckdose)",
    priz: "Steckdose", icpd: "IC-CPD", icpdAlt: "Schutzbox", arac: "Auto",
    m2not: "Leistung durch die Steckdose begrenzt → langsamer; für seltene Nutzung und unterwegs.",
    m3: "Modus 3 — feste Wallbox",
    wb: "Wallbox", wbAlt: "feste Station",
    m3not1: "Ständige Kommunikation → mehr Leistung,",
    m3not2: "sicherer, für den Alltag (7,4–22 kW).",
  },
  es: {
    t: "Modo 2 y Modo 3: comparación de carga AC",
    d: "En el Modo 2 el coche carga desde una toma normal a través de una caja de protección IC-CPD integrada en el cable: es portátil pero relativamente lento; en el Modo 3 el coche carga desde un wallbox fijo, con comunicación continua, a más potencia y de forma más segura.",
    alt: "Comparación de la carga AC en Modo 2 y Modo 3: en el Modo 2 el coche carga desde una toma normal a través de una caja de protección IC-CPD integrada en el cable y es lento porque la potencia está limitada por la toma; en el Modo 3 el coche carga desde un wallbox fijo, con comunicación continua, a más potencia y de forma más segura.",
    cap: "La diferencia entre la carga AC en Modo 2 (portátil, con protección IC-CPD, enchufado a la toma) y en Modo 3 (wallbox fijo, comunicación continua).",
    m2: "Modo 2 — portátil (enchufar a la toma)",
    priz: "Toma", icpd: "IC-CPD", icpdAlt: "caja de protección", arac: "Coche",
    m2not: "Potencia limitada por la toma → más lento; para uso esporádico y viajes.",
    m3: "Modo 3 — wallbox fijo",
    wb: "Wallbox", wbAlt: "estación fija",
    m3not1: "Comunicación continua → más potencia,",
    m3not2: "más seguro, uso diario (7,4–22 kW).",
  },
  ru: {
    t: "Сравнение зарядки AC: режим 2 и режим 3",
    d: "В режиме 2 автомобиль заряжается от обычной розетки через встроенный в кабель защитный блок IC-CPD — переносное, но сравнительно медленное решение; в режиме 3 автомобиль заряжается от стационарного wallbox с постоянной связью, на большей мощности и безопаснее.",
    alt: "Сравнение зарядки AC в режиме 2 и режиме 3: в режиме 2 автомобиль заряжается от обычной розетки через встроенный в кабель защитный блок IC-CPD и делает это медленно, потому что мощность ограничена розеткой; в режиме 3 автомобиль заряжается от стационарного wallbox с постоянной связью, на большей мощности и безопаснее.",
    cap: "Разница между зарядкой AC в режиме 2 (переносной, с защитой IC-CPD, в розетку) и в режиме 3 (стационарный wallbox, постоянная связь).",
    m2: "Режим 2 — переносной (в розетку)",
    priz: "Розетка", icpd: "IC-CPD", icpdAlt: "защитный блок", arac: "Авто",
    m2not: "Мощность ограничена розеткой → медленнее; для редких случаев и в дороге.",
    m3: "Режим 3 — стационарный wallbox",
    wb: "Wallbox", wbAlt: "стационарная станция",
    m3not1: "Постоянная связь → больше мощности,",
    m3not2: "безопаснее, каждый день (7,4–22 кВт).",
  },
  ar: {
    t: "مقارنة الشحن AC بين الوضع 2 والوضع 3",
    d: "في الوضع 2 تُشحن السيارة من مأخذ عادي عبر صندوق حماية IC-CPD مدمج في الكابل، وهو حل محمول لكنه أبطأ نسبياً؛ وفي الوضع 3 تُشحن السيارة من wallbox ثابت باتصال مستمر، بقدرة أعلى وأماناً أكبر.",
    alt: "مقارنة الشحن AC بين الوضع 2 والوضع 3: في الوضع 2 تُشحن السيارة من مأخذ عادي عبر صندوق حماية IC-CPD مدمج في الكابل، وهي بطيئة لأن القدرة محدودة بالمأخذ؛ وفي الوضع 3 تُشحن السيارة من wallbox ثابت باتصال مستمر، بقدرة أعلى وأماناً أكبر.",
    cap: "الفرق في الشحن AC بين الوضع 2 (محمول، بحماية IC-CPD، يوصل بالمأخذ) والوضع 3 (‏wallbox ثابت، اتصال مستمر).",
    m2: "الوضع 2 — محمول (يوصل بالمأخذ)",
    priz: "مأخذ", icpd: "IC-CPD", icpdAlt: "صندوق حماية", arac: "سيارة",
    m2not: "القدرة محدودة بالمأخذ ← أبطأ؛ للاستخدام النادر وللسفر.",
    m3: "الوضع 3 — wallbox ثابت",
    wb: "Wallbox", wbAlt: "محطة ثابتة",
    m3not1: "اتصال مستمر ← قدرة أعلى،",
    m3not2: "وأماناً أكبر، للاستخدام اليومي (7,4–22 kW).",
  },
  nl: {
    t: "Modus 2 en modus 3 in AC-laden vergeleken",
    d: "In modus 2 laadt de auto via een gewoon stopcontact met een in de kabel ingebouwde IC-CPD-beveiligingsbox: draagbaar maar relatief traag; in modus 3 laadt de auto via een vaste wallbox met continue communicatie, op hoger vermogen en veiliger.",
    alt: "Vergelijking van AC-laden in modus 2 en modus 3: in modus 2 laadt de auto via een gewoon stopcontact met een in de kabel ingebouwde IC-CPD-beveiligingsbox en gaat dat traag omdat het vermogen door het stopcontact wordt begrensd; in modus 3 laadt de auto via een vaste wallbox met continue communicatie, op hoger vermogen en veiliger.",
    cap: "Het verschil tussen AC-laden in modus 2 (draagbaar, met IC-CPD-beveiliging, in het stopcontact) en modus 3 (vaste wallbox, continue communicatie).",
    m2: "Modus 2 — draagbaar (in het stopcontact)",
    priz: "Stopcontact", icpd: "IC-CPD", icpdAlt: "beveiligingsbox", arac: "Auto",
    m2not: "Vermogen begrensd door het stopcontact → trager; voor incidenteel gebruik en onderweg.",
    m3: "Modus 3 — vaste wallbox",
    wb: "Wallbox", wbAlt: "vast station",
    m3not1: "Continue communicatie → meer vermogen,",
    m3not2: "veiliger, dagelijks gebruik (7,4–22 kW).",
  },
};

export const DLM: Record<string, DlmEtiket> = {
  tr: {
    t: "Dinamik yük yönetimi (DLM) ile güç paylaşımı",
    d: "Ana panonun toplam güç limiti (örnek 22 kW) bir DLM kontrolcüsü üzerinden üç wallbox'a dağıtılır; tek araç şarjdayken o cihaza neredeyse tüm güç verilir, üç araç aynı anda şarj olduğunda güç dengeli biçimde paylaştırılır ve tesis limiti aşılmaz.",
    alt: "Dinamik yük yönetimi (DLM) şeması: ana panodaki 22 kW toplam güç limiti bir DLM kontrolcüsü üzerinden üç wallbox'a dağıtılır. Tek araç bağlıyken o cihaza neredeyse tüm güç verilir; üç araç aynı anda şarj olunca güç dengeli biçimde paylaştırılır ve toplam tesis limiti aşılmaz.",
    cap: "DLM (dinamik yük yönetimi): ana panonun toplam gücü cihazlar arasında akıllıca paylaştırılır, ana sigorta atmaz.",
    pano: "Ana Pano", limit: "22 kW limit", dlm: "DLM", kont: "kontrolcü", wb: "Wallbox",
    n1: "Tek araç şarjda: güç ona (≈22 kW).",
    n2: "3 araç birlikte: bölüşülür (≈7,3 kW ×3),",
    n3: "toplam 22 kW limiti aşılmaz.",
  },
  en: {
    t: "Power sharing with dynamic load management (DLM)",
    d: "The total power limit of the main board (22 kW in this example) is distributed to three wallboxes through a DLM controller; when only one car is charging it gets almost all the power, and when three cars charge at once the power is shared evenly so the site limit is not exceeded.",
    alt: "Dynamic load management (DLM) diagram: the 22 kW total power limit at the main board is distributed to three wallboxes through a DLM controller. When one car is connected it gets almost all the power; when three cars charge at once the power is shared evenly and the total site limit is not exceeded.",
    cap: "DLM (dynamic load management): the total power of the main board is shared intelligently between the units, so the main fuse does not trip.",
    pano: "Main Board", limit: "22 kW limit", dlm: "DLM", kont: "controller", wb: "Wallbox",
    n1: "One car charging: it gets the power (≈22 kW).",
    n2: "3 cars together: shared (≈7.3 kW ×3),",
    n3: "the 22 kW total limit is not exceeded.",
  },
  de: {
    t: "Leistungsteilung mit dynamischem Lastmanagement (DLM)",
    d: "Das Gesamtlimit der Hauptverteilung (im Beispiel 22 kW) wird über einen DLM-Regler auf drei Wallboxen verteilt; lädt nur ein Auto, bekommt es nahezu die gesamte Leistung, laden drei Autos gleichzeitig, wird die Leistung gleichmäßig aufgeteilt und das Limit der Anlage nicht überschritten.",
    alt: "Schema des dynamischen Lastmanagements (DLM): Das Gesamtlimit von 22 kW an der Hauptverteilung wird über einen DLM-Regler auf drei Wallboxen verteilt. Ist ein Auto angeschlossen, bekommt es nahezu die gesamte Leistung; laden drei Autos gleichzeitig, wird die Leistung gleichmäßig aufgeteilt und das Gesamtlimit der Anlage nicht überschritten.",
    cap: "DLM (dynamisches Lastmanagement): Die Gesamtleistung der Hauptverteilung wird intelligent auf die Geräte aufgeteilt, die Hauptsicherung fliegt nicht heraus.",
    pano: "Hauptverteilung", limit: "22 kW Limit", dlm: "DLM", kont: "Regler", wb: "Wallbox",
    n1: "Ein Auto lädt: es bekommt die Leistung (≈22 kW).",
    n2: "3 Autos zusammen: aufgeteilt (≈7,3 kW ×3),",
    n3: "das Limit von 22 kW wird nicht überschritten.",
  },
  es: {
    t: "Reparto de potencia con gestión dinámica de carga (DLM)",
    d: "El límite total de potencia del cuadro general (22 kW en el ejemplo) se reparte entre tres wallbox mediante un controlador DLM; si carga un solo coche recibe casi toda la potencia, y si cargan tres a la vez la potencia se reparte de forma equilibrada sin superar el límite de la instalación.",
    alt: "Esquema de gestión dinámica de carga (DLM): el límite total de 22 kW del cuadro general se reparte entre tres wallbox mediante un controlador DLM. Con un solo coche conectado, este recibe casi toda la potencia; si cargan tres coches a la vez, la potencia se reparte de forma equilibrada y no se supera el límite total de la instalación.",
    cap: "DLM (gestión dinámica de carga): la potencia total del cuadro general se reparte de forma inteligente entre los equipos y el fusible general no salta.",
    pano: "Cuadro general", limit: "límite 22 kW", dlm: "DLM", kont: "controlador", wb: "Wallbox",
    n1: "Un coche cargando: la potencia es para él (≈22 kW).",
    n2: "3 coches a la vez: se reparte (≈7,3 kW ×3),",
    n3: "no se supera el límite total de 22 kW.",
  },
  ru: {
    t: "Распределение мощности с динамическим управлением нагрузкой (DLM)",
    d: "Общий лимит мощности главного щита (в примере 22 кВт) распределяется через контроллер DLM на три wallbox; когда заряжается одна машина, ей достаётся почти вся мощность, а когда заряжаются три — мощность делится равномерно и лимит объекта не превышается.",
    alt: "Схема динамического управления нагрузкой (DLM): общий лимит 22 кВт на главном щите распределяется через контроллер DLM на три wallbox. Когда подключена одна машина, ей достаётся почти вся мощность; когда заряжаются три машины одновременно, мощность делится равномерно и общий лимит объекта не превышается.",
    cap: "DLM (динамическое управление нагрузкой): общая мощность главного щита разумно делится между устройствами, и главный автомат не выбивает.",
    pano: "Главный щит", limit: "лимит 22 кВт", dlm: "DLM", kont: "контроллер", wb: "Wallbox",
    n1: "Заряжается одна машина: мощность ей (≈22 кВт).",
    n2: "3 машины вместе: делится (≈7,3 кВт ×3),",
    n3: "общий лимит 22 кВт не превышается.",
  },
  ar: {
    t: "تقاسم القدرة عبر الإدارة الديناميكية للأحمال (DLM)",
    d: "يُوزَّع الحد الكلي لقدرة اللوحة الرئيسية (22 kW في المثال) عبر متحكّم DLM على ثلاث وحدات wallbox؛ فإن كانت سيارة واحدة تشحن نالت القدرة كلها تقريباً، وإن شحنت ثلاث سيارات معاً قُسِمت القدرة بالتساوي دون تجاوز حد المنشأة.",
    alt: "مخطط الإدارة الديناميكية للأحمال (DLM): يُوزَّع الحد الكلي 22 kW في اللوحة الرئيسية عبر متحكّم DLM على ثلاث وحدات wallbox. فعند توصيل سيارة واحدة تنال القدرة كلها تقريباً؛ وعند شحن ثلاث سيارات معاً تُقسَم القدرة بالتساوي ولا يُتجاوز الحد الكلي للمنشأة.",
    cap: "‏DLM (الإدارة الديناميكية للأحمال): تُقسَم قدرة اللوحة الرئيسية الكلية بذكاء بين الأجهزة، فلا يفصل القاطع الرئيسي.",
    pano: "اللوحة الرئيسية", limit: "حد 22 kW", dlm: "DLM", kont: "متحكّم", wb: "Wallbox",
    n1: "سيارة واحدة تشحن: القدرة لها (≈22 kW).",
    n2: "3 سيارات معاً: تُقتسم (≈7,3 kW ×3)،",
    n3: "ولا يُتجاوز الحد الكلي 22 kW.",
  },
  nl: {
    t: "Vermogensverdeling met dynamisch lastmanagement (DLM)",
    d: "De totale vermogenslimiet van de hoofdverdeler (in het voorbeeld 22 kW) wordt via een DLM-regelaar over drie wallboxen verdeeld; laadt er één auto, dan krijgt die vrijwel al het vermogen, en laden er drie tegelijk, dan wordt het vermogen gelijkmatig verdeeld zonder de limiet van de installatie te overschrijden.",
    alt: "Schema van dynamisch lastmanagement (DLM): de totale limiet van 22 kW op de hoofdverdeler wordt via een DLM-regelaar over drie wallboxen verdeeld. Is er één auto aangesloten, dan krijgt die vrijwel al het vermogen; laden er drie auto's tegelijk, dan wordt het vermogen gelijkmatig verdeeld en wordt de totale limiet van de installatie niet overschreden.",
    cap: "DLM (dynamisch lastmanagement): het totale vermogen van de hoofdverdeler wordt slim over de apparaten verdeeld, zodat de hoofdzekering niet uitvalt.",
    pano: "Hoofdverdeler", limit: "limiet 22 kW", dlm: "DLM", kont: "regelaar", wb: "Wallbox",
    n1: "Eén auto laadt: die krijgt het vermogen (≈22 kW).",
    n2: "3 auto's samen: verdeeld (≈7,3 kW ×3),",
    n3: "de totale limiet van 22 kW wordt niet overschreden.",
  },
};

export const ACDC: Record<string, AcDcEtiket> = {
  tr: {
    t: "AC ve DC şarjda akım dönüşümünün nerede yapıldığı",
    alt: "AC ve DC şarjda akım dönüşümünün nerede yapıldığını gösteren diyagram: AC şarjda alternatif akımın doğru akıma dönüşümü araç içindeki onboard charger'da, DC hızlı şarjda ise istasyon içindeki çeviricide yapılır.",
    cap: "AC'de dönüşümü araç (onboard charger), DC'de istasyon yapar — DC bu yüzden çok daha yüksek güce çıkabilir.",
    ac: "AC ŞARJ", dc: "DC HIZLI ŞARJ",
    seb: "Şebeke (AC)", ist: "Şarj İstasyonu", arac: "Araç", ob: "onboard charger AC→DC", bat: "Batarya", cev: "çevirici AC→DC",
  },
  en: {
    t: "Where the current conversion happens in AC and DC charging",
    alt: "Diagram showing where the current conversion happens in AC and DC charging: in AC charging the conversion from alternating to direct current takes place in the onboard charger inside the car, while in DC fast charging it takes place in the converter inside the station.",
    cap: "In AC the car (onboard charger) does the conversion, in DC the station does — which is why DC can reach much higher power.",
    ac: "AC CHARGING", dc: "DC FAST CHARGING",
    seb: "Grid (AC)", ist: "Charging Station", arac: "Car", ob: "onboard charger AC→DC", bat: "Battery", cev: "converter AC→DC",
  },
  de: {
    t: "Wo die Stromwandlung beim AC- und DC-Laden stattfindet",
    alt: "Diagramm dazu, wo die Stromwandlung beim AC- und DC-Laden stattfindet: Beim AC-Laden erfolgt die Wandlung von Wechsel- in Gleichstrom im Onboard-Charger im Auto, beim DC-Schnellladen dagegen im Wandler in der Station.",
    cap: "Bei AC wandelt das Auto (Onboard-Charger), bei DC die Station — deshalb erreicht DC eine viel höhere Leistung.",
    ac: "AC-LADEN", dc: "DC-SCHNELLLADEN",
    seb: "Netz (AC)", ist: "Ladestation", arac: "Auto", ob: "Onboard-Charger AC→DC", bat: "Batterie", cev: "Wandler AC→DC",
  },
  es: {
    t: "Dónde se hace la conversión de corriente en la carga AC y DC",
    alt: "Diagrama de dónde se hace la conversión de corriente en la carga AC y DC: en la carga AC la conversión de corriente alterna a continua se hace en el cargador de a bordo del coche, mientras que en la carga rápida DC se hace en el convertidor de la estación.",
    cap: "En AC la conversión la hace el coche (cargador de a bordo); en DC, la estación — por eso la DC alcanza mucha más potencia.",
    ac: "CARGA AC", dc: "CARGA RÁPIDA DC",
    seb: "Red (AC)", ist: "Estación de carga", arac: "Coche", ob: "cargador de a bordo AC→DC", bat: "Batería", cev: "convertidor AC→DC",
  },
  ru: {
    t: "Где происходит преобразование тока при зарядке AC и DC",
    alt: "Схема того, где происходит преобразование тока при зарядке AC и DC: при зарядке AC переменный ток преобразуется в постоянный в бортовом зарядном устройстве автомобиля, а при быстрой зарядке DC — в преобразователе внутри станции.",
    cap: "При AC преобразование делает автомобиль (бортовое ЗУ), при DC — станция; поэтому DC выходит на гораздо большую мощность.",
    ac: "ЗАРЯДКА AC", dc: "БЫСТРАЯ ЗАРЯДКА DC",
    seb: "Сеть (AC)", ist: "Зарядная станция", arac: "Авто", ob: "бортовое ЗУ AC→DC", bat: "Батарея", cev: "преобразователь AC→DC",
  },
  ar: {
    t: "أين يجري تحويل التيار في الشحن AC والشحن DC",
    alt: "مخطط يبيّن أين يجري تحويل التيار في الشحن AC والشحن DC: ففي الشحن AC يجري تحويل التيار المتناوب إلى مستمر في الشاحن الداخلي بالسيارة، أما في الشحن السريع DC فيجري في المحوّل داخل المحطة.",
    cap: "في AC تقوم السيارة (الشاحن الداخلي) بالتحويل، وفي DC تقوم به المحطة — ولهذا يبلغ DC قدرة أعلى بكثير.",
    ac: "الشحن AC", dc: "الشحن السريع DC",
    seb: "الشبكة (AC)", ist: "محطة الشحن", arac: "سيارة", ob: "الشاحن الداخلي AC→DC", bat: "بطارية", cev: "محوّل AC→DC",
  },
  nl: {
    t: "Waar de stroomomzetting plaatsvindt bij AC- en DC-laden",
    alt: "Diagram van waar de stroomomzetting plaatsvindt bij AC- en DC-laden: bij AC-laden gebeurt de omzetting van wissel- naar gelijkstroom in de onboard charger in de auto, terwijl dat bij DC-snelladen in de omvormer in het station gebeurt.",
    cap: "Bij AC doet de auto (onboard charger) de omzetting, bij DC het station — daarom haalt DC veel hoger vermogen.",
    ac: "AC-LADEN", dc: "DC-SNELLADEN",
    seb: "Net (AC)", ist: "Laadstation", arac: "Auto", ob: "onboard charger AC→DC", bat: "Accu", cev: "omvormer AC→DC",
  },
};

export const DIYAGRAM_DILLERI = ["tr", "en", "de", "es", "ru", "ar", "nl"] as const;
