/**
 * ARAÇ ŞARJ UYUMLULUĞU — DİL KOLU İÇERİKLERİ (en/de/es/ru/nl; ar ayrı dosyada)
 *
 * ⚠️ TR sayfası bu dosyayı HİÇ kullanmaz: `VehicleChargingClient` prop almazsa
 *    kendi Türkçe varsayılanını basar → /arac-sarj-uyumlulugu birebir aynı kalır.
 *
 * ⚠️⚠️ İHRACAT DİLLERİNDE "YETKİLİ BAYİMİZ KEŞİF YAPAR" DENMEZ. Bayi ağı
 *    Türkiye'ye özel; yurt dışında yalnız 3 ülkede distribütör var (Almanya,
 *    Şili, Portekiz). Yerinde keşif vaadi karşılanamaz → kapanış metni ve SSS
 *    "bize yazın, doğru kişiye yönlendirelim" şeklinde kuruldu. Uydurma ticari
 *    şart / var olmayan yerel varlık iddiası YOK (kayıtlı kural).
 * ⚠️ Yabancı dillerde "Türkiye'nin/yerli" milliyetçi çerçeve KULLANILMAZ;
 *    menşe OLGU olarak geçer ("Bursa'daki kendi tesisi", "80+ ülkeye ihracat").
 * ⚠️ Giriş cümlesi TR'de "Türkiye'de satılan", diğer dillerde "Avrupa'da satılan"
 *    çerçevesini kullanır — hedef pazara göre doğru olan bu.
 * ⚠️ Sayı/birim ve marka-model adları çevrilmez (11 kW, 32A, Type 2, Togg,
 *    Charger Plus 2…). Tablo değerleri `lib/vehicleCharging.ts`'ten gelir —
 *    burada UYDURMA SPEC YOK, yalnız metin.
 */
import type { UyumlulukIcerik } from "../../components/VehicleChargingClient";
import { AR_ICERIK, AR_SSS } from "./arIcerik";

export type UyumMeta = {
  title: string;
  desc: string;
  keywords: string[];
  anasayfa: string;
  sayfa: string;
  ogLocale: string;
  inLanguage: string;
};

const urun = (l: string) => ({
  wallbox: `/${l}/products/wallbox`,
  cables: `/${l}/products/cables`,
  // ⚠️ Bayi haritası Türkiye'ye özel, yabancı dilde YOK → ihracat masası (/export).
  bayi: "/export",
  iletisim: `/${l}/products`,
});

const EN: UyumlulukIcerik = {
  rozet: "Vehicle compatibility",
  h1: "Which charger and cable fits your car?",
  giris:
    "Almost every electric car sold in Europe uses a Type 2 socket for AC charging — Togg, Hyundai, Tesla, BYD, MG and Renault included. So when you pick a product the deciding factor is not the socket type but your car's onboard charging power and your home's electrical installation. The table below shows both together.",
  ctaUrunler: "Browse chargers",
  ctaKablolar: "Charging cables",
  kuralVurgu: "Your car sets the charging speed, not the charger.",
  kuralMetin:
    "A car with an 11 kW onboard charger draws 11 kW even when it is plugged into a 22 kW unit. That is why buying the most powerful device is usually an unnecessary cost — the right choice is where your car's limit meets your installation's capacity.",
  tabloBaslik: "AC charging power by car model",
  sutunlar: ["Vehicle", "AC socket", "Onboard AC power", "Suggested Bemis product"],
  oneri66: "Charger 2 (32A single phase) or the portable Mono Mobile",
  oneriDiger: "Charger 2 / Charger Plus 2 · 32A · Type 2 charging cable",
  notlar: {
    "Togg T10X": "An optional 22 kW onboard charger is offered; check your vehicle documents or equipment list to see which one you have.",
    "MG4": "Varies by trim: 6.6 kW on most versions, 11 kW on some 2026 versions. Check the onboard charger before buying a three-phase unit.",
    "Renault Megane E-Tech": "Varies by model year: 22 kW on 2022–2025 versions, 11 kW after 2025.",
  },
  kaynakNotu:
    "Values are taken from the model pages on EV Database (August 2026). Onboard charging power can differ between trim levels and model years; check your owner's manual for the exact figure. If your car is not on the list, write to us and we will work it out together.",
  tesisatBaslik: "What to buy for your installation",
  rehber: [
    {
      title: "Single-phase installation",
      body: "Most homes are single phase. The practical ceiling on such an installation is 7.4 kW (32A). Even if your car's onboard charger is 11 kW, you cannot exceed 7.4 kW in a single-phase home.",
      product: "Charger 2 · 32A single phase — or the portable Mono Mobile",
    },
    {
      title: "Three-phase installation",
      body: "On a three-phase installation you reach whatever your car's onboard charger allows: 11 kW on an 11 kW car, 22 kW on a 22 kW car. Matching the unit to the car's ceiling is enough; a more powerful unit adds no speed.",
      product: "Charger 2 / Charger Plus 2 · 32A three phase (up to 22 kW)",
    },
    {
      title: "I don't want a fixed installation",
      body: "If you rent or your parking spot changes, a portable charger suits you. It works from a socket and needs no wall mounting, and the stepped amperage setting lets you lower the current to match your installation.",
      product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
    },
  ],
  sssBaslik: "Frequently asked questions",
  sss: [
    {
      q: "Which charging cable fits my electric car?",
      a: "Almost all electric cars sold in Europe use a Type 2 (IEC 62196) socket for AC charging, including Togg, Hyundai, Tesla, BYD, MG and Renault models. So the socket type is not what decides the cable — current rating and length are: on a single-phase supply a 32A cable carries up to 7.4 kW, and on a three-phase installation the same cable carries up to 22 kW.",
    },
    {
      q: "Will my car charge faster if I buy a 22 kW charger?",
      a: "No. Charging speed is set by your car's onboard AC charger, not by the unit. A car with an 11 kW onboard charger draws 11 kW even on a 22 kW unit. Matching the unit to your car's ceiling and to your installation is enough.",
    },
    {
      q: "Which charger suits a Togg?",
      a: "Togg T10X and T10F use a Type 2 socket for AC charging and have an 11 kW onboard charger (22 kW is optional on the T10X). In a home with a three-phase installation an 11 kW or 22 kW wall unit is suitable; in a single-phase home the practical limit is 7.4 kW. For mobile use, portable chargers with stepped amperage are a good choice.",
    },
    {
      q: "There is no three-phase supply at my home — what should I do?",
      a: "On a single-phase installation you can charge up to 7.4 kW (32A), which is more than enough overnight for most drivers. Adding three phase is a separate process with your electricity distribution company and carries extra cost. Send us your installation details and we will tell you which option makes sense.",
    },
    {
      q: "How do I find my car's onboard AC charging power?",
      a: "It is listed in the owner's manual and on the manufacturer's technical specification page under \"onboard charger\". The figure can differ between trim levels of the same model; on some models 11 kW is standard and 22 kW optional.",
    },
    {
      q: "How long should the charging cable be?",
      a: "5 metres is enough for most home and workplace use. If the car's charging port sits far from the parking spot, or you will use the cable in different places, 7 to 10 metres is preferable. Cable length does not affect charging speed.",
    },
  ],
  kapanisBaslik: "Let's find the right model for your car",
  kapanisMetin:
    "Bemis E-V Charge manufactures its chargers and Type 2 cables in its own facility in Bursa and exports to more than 80 countries. Tell us your vehicle and your installation and we will point you to the right model and the right contact.",
  ctaBayi: "Request a quote",
  ctaIletisim: "All products",
  linkler: urun("en"),
};

const DE: UyumlulukIcerik = {
  rozet: "Fahrzeugkompatibilität",
  h1: "Welches Ladegerät und welches Kabel passt zu Ihrem Auto?",
  giris:
    "Nahezu jedes in Europa verkaufte Elektroauto nutzt beim AC-Laden eine Type-2-Buchse — Togg, Hyundai, Tesla, BYD, MG und Renault eingeschlossen. Bei der Produktwahl entscheidet also nicht der Steckertyp, sondern die fahrzeugeigene Ladeleistung und die Elektroinstallation Ihres Hauses. Die Tabelle unten zeigt beides zusammen.",
  ctaUrunler: "Ladestationen ansehen",
  ctaKablolar: "Ladekabel",
  kuralVurgu: "Die Ladegeschwindigkeit bestimmt Ihr Auto, nicht das Ladegerät.",
  kuralMetin:
    "Ein Fahrzeug mit 11 kW Onboard-Charger zieht auch an einer 22-kW-Station 11 kW. Deshalb ist „das stärkste Gerät kaufen“ meist unnötiger Aufwand — richtig ist das Gerät dort, wo das Limit Ihres Autos und die Kapazität Ihrer Installation zusammentreffen.",
  tabloBaslik: "AC-Ladeleistung nach Fahrzeugmodell",
  sutunlar: ["Fahrzeug", "AC-Buchse", "Onboard-AC-Leistung", "Empfohlenes Bemis Produkt"],
  oneri66: "Charger 2 (32A einphasig) oder das mobile Mono Mobile",
  oneriDiger: "Charger 2 / Charger Plus 2 · 32A · Type-2-Ladekabel",
  notlar: {
    "Togg T10X": "Ein optionaler 22-kW-Onboard-Charger wird angeboten; prüfen Sie in den Fahrzeugpapieren oder der Ausstattungsliste, welcher verbaut ist.",
    "MG4": "Je nach Ausstattung unterschiedlich: 6,6 kW in den meisten Versionen, 11 kW in einigen 2026er Versionen. Prüfen Sie den Onboard-Charger, bevor Sie ein dreiphasiges Gerät kaufen.",
    "Renault Megane E-Tech": "Je nach Modelljahr unterschiedlich: 22 kW in den Versionen 2022–2025, 11 kW ab 2025.",
  },
  kaynakNotu:
    "Die Werte stammen von den Modellseiten der EV Database (August 2026). Die Onboard-Ladeleistung kann sich zwischen Ausstattungslinien und Modelljahren unterscheiden; den genauen Wert finden Sie im Fahrzeughandbuch. Steht Ihr Auto nicht in der Liste, schreiben Sie uns — wir klären es gemeinsam.",
  tesisatBaslik: "Was passt zu Ihrer Installation?",
  rehber: [
    {
      title: "Einphasige Installation",
      body: "Die meisten Wohnhäuser sind einphasig. Die praktische Obergrenze liegt hier bei 7,4 kW (32A). Selbst mit einem 11-kW-Onboard-Charger kommen Sie in einem einphasigen Haus nicht über 7,4 kW hinaus.",
      product: "Charger 2 · 32A einphasig — oder das mobile Mono Mobile",
    },
    {
      title: "Dreiphasige Installation",
      body: "Bei dreiphasigem Anschluss erreichen Sie das, was Ihr Onboard-Charger zulässt: 11 kW bei einem 11-kW-Fahrzeug, 22 kW bei einem 22-kW-Fahrzeug. Das Gerät nach der Obergrenze des Autos zu wählen genügt; ein stärkeres Gerät bringt kein Tempo.",
      product: "Charger 2 / Charger Plus 2 · 32A dreiphasig (bis 22 kW)",
    },
    {
      title: "Ich möchte keine feste Installation",
      body: "Wenn Sie zur Miete wohnen oder der Stellplatz wechselt, ist ein mobiles Ladegerät passend. Es arbeitet an der Steckdose, braucht keine Wandmontage, und über die stufenweise Ampere-Einstellung senken Sie den Strom passend zu Ihrer Installation.",
      product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
    },
  ],
  sssBaslik: "Häufig gestellte Fragen",
  sss: [
    {
      q: "Welches Ladekabel passt zu meinem Elektroauto?",
      a: "Nahezu alle in Europa verkauften Elektroautos nutzen beim AC-Laden eine Type-2-Buchse (IEC 62196), darunter Modelle von Togg, Hyundai, Tesla, BYD, MG und Renault. Über das Kabel entscheidet daher nicht der Steckertyp, sondern Strombelastbarkeit und Länge: einphasig überträgt ein 32-A-Kabel bis 7,4 kW, dreiphasig dasselbe Kabel bis 22 kW.",
    },
    {
      q: "Lädt mein Auto schneller, wenn ich ein 22-kW-Gerät kaufe?",
      a: "Nein. Die Ladegeschwindigkeit bestimmt der Onboard-Charger Ihres Autos, nicht das Gerät. Ein Fahrzeug mit 11 kW Onboard-Charger zieht auch an einer 22-kW-Station 11 kW. Es genügt, das Gerät auf die Obergrenze des Autos und auf Ihre Installation abzustimmen.",
    },
    {
      q: "Welches Ladegerät passt zu einem Togg?",
      a: "Togg T10X und T10F nutzen beim AC-Laden eine Type-2-Buchse und haben einen 11-kW-Onboard-Charger (beim T10X optional 22 kW). In einem Haus mit dreiphasigem Anschluss passt eine Wandstation mit 11 kW oder 22 kW; einphasig liegt die praktische Grenze bei 7,4 kW. Für den mobilen Einsatz eignen sich mobile Ladegeräte mit stufenweiser Ampere-Einstellung.",
    },
    {
      q: "Bei mir gibt es keinen Drehstrom — was nun?",
      a: "Einphasig laden Sie bis 7,4 kW (32A); über Nacht reicht das den meisten Fahrern deutlich aus. Einen Drehstromanschluss legen zu lassen ist ein eigener Vorgang mit dem Netzbetreiber und kostet zusätzlich. Schicken Sie uns die Daten Ihrer Installation, dann sagen wir Ihnen, welche Variante sinnvoll ist.",
    },
    {
      q: "Woher weiß ich, wie stark der Onboard-Charger meines Autos ist?",
      a: "Er steht im Fahrzeughandbuch und auf der Datenblattseite des Herstellers unter „Onboard-Charger“. Der Wert kann sich zwischen Ausstattungslinien desselben Modells unterscheiden; bei manchen Modellen sind 11 kW Serie und 22 kW optional.",
    },
    {
      q: "Wie lang sollte das Ladekabel sein?",
      a: "Für die meisten Anwendungen zu Hause und am Arbeitsplatz genügen 5 Meter. Liegt der Ladeanschluss weit vom Stellplatz entfernt oder nutzen Sie das Kabel an verschiedenen Orten, sind 7 bis 10 Meter besser. Die Kabellänge beeinflusst die Ladegeschwindigkeit nicht.",
    },
  ],
  kapanisBaslik: "Finden wir gemeinsam das passende Modell",
  kapanisMetin:
    "Bemis E-V Charge fertigt Ladestationen und Type-2-Kabel im eigenen Werk in Bursa und exportiert in mehr als 80 Länder. Nennen Sie uns Ihr Fahrzeug und Ihre Installation — wir weisen Ihnen das passende Modell und den richtigen Ansprechpartner.",
  ctaBayi: "Angebot anfordern",
  ctaIletisim: "Alle Produkte",
  linkler: urun("de"),
};

const ES: UyumlulukIcerik = {
  rozet: "Compatibilidad de vehículos",
  h1: "¿Qué cargador y qué cable encajan con tu coche?",
  giris:
    "Casi todos los coches eléctricos que se venden en Europa usan una toma Type 2 para la carga en corriente alterna — Togg, Hyundai, Tesla, BYD, MG y Renault incluidos. Por eso, al elegir el producto no decide el tipo de toma, sino la potencia del cargador interno de tu coche y la instalación eléctrica de tu casa. La tabla siguiente muestra ambas cosas juntas.",
  ctaUrunler: "Ver cargadores",
  ctaKablolar: "Cables de carga",
  kuralVurgu: "La velocidad de carga la marca tu coche, no el cargador.",
  kuralMetin:
    "Un coche con cargador interno de 11 kW toma 11 kW aunque se conecte a un equipo de 22 kW. Por eso «comprar el aparato más potente» suele ser un gasto innecesario: la elección correcta está donde se cruzan el límite de tu coche y la capacidad de tu instalación.",
  tabloBaslik: "Potencia de carga CA por modelo",
  sutunlar: ["Vehículo", "Toma CA", "Potencia del cargador interno", "Producto Bemis sugerido"],
  oneri66: "Charger 2 (32A monofásico) o el portátil Mono Mobile",
  oneriDiger: "Charger 2 / Charger Plus 2 · 32A · cable de carga Type 2",
  notlar: {
    "Togg T10X": "Se ofrece un cargador interno opcional de 22 kW; comprueba en la documentación o en la lista de equipamiento cuál lleva tu coche.",
    "MG4": "Varía según el acabado: 6,6 kW en la mayoría de versiones y 11 kW en algunas versiones de 2026. Comprueba el cargador interno antes de comprar un equipo trifásico.",
    "Renault Megane E-Tech": "Varía según el año del modelo: 22 kW en las versiones 2022–2025 y 11 kW a partir de 2025.",
  },
  kaynakNotu:
    "Los valores proceden de las fichas de modelo de EV Database (agosto de 2026). La potencia del cargador interno puede cambiar entre acabados y años de modelo; consulta el manual de tu coche para el dato exacto. Si tu coche no aparece en la lista, escríbenos y lo vemos juntos.",
  tesisatBaslik: "¿Qué comprar según tu instalación?",
  rehber: [
    {
      title: "Instalación monofásica",
      body: "La mayoría de las viviendas son monofásicas. El techo práctico en esa instalación es de 7,4 kW (32A). Aunque el cargador interno de tu coche sea de 11 kW, en una casa monofásica no superarás los 7,4 kW.",
      product: "Charger 2 · 32A monofásico — o el portátil Mono Mobile",
    },
    {
      title: "Instalación trifásica",
      body: "Con instalación trifásica llegas hasta donde permita el cargador interno de tu coche: 11 kW en un coche de 11 kW y 22 kW en uno de 22 kW. Basta con elegir el equipo según el techo del coche; uno más potente no aporta velocidad.",
      product: "Charger 2 / Charger Plus 2 · 32A trifásico (hasta 22 kW)",
    },
    {
      title: "No quiero una instalación fija",
      body: "Si vives de alquiler o cambias de plaza de aparcamiento, el cargador portátil te encaja. Funciona desde un enchufe y no necesita montaje en pared, y el ajuste de amperaje por pasos te permite bajar la corriente según tu instalación.",
      product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
    },
  ],
  sssBaslik: "Preguntas frecuentes",
  sss: [
    {
      q: "¿Qué cable de carga sirve para mi coche eléctrico?",
      a: "Casi todos los coches eléctricos vendidos en Europa usan una toma Type 2 (IEC 62196) para la carga en corriente alterna, incluidos los modelos de Togg, Hyundai, Tesla, BYD, MG y Renault. Por tanto el cable no lo decide el tipo de toma, sino el amperaje y la longitud: en monofásico un cable de 32A lleva hasta 7,4 kW y en trifásico ese mismo cable llega a 22 kW.",
    },
    {
      q: "¿Mi coche cargará más rápido si compro un cargador de 22 kW?",
      a: "No. La velocidad la fija el cargador interno de tu coche, no el equipo. Un coche con cargador interno de 11 kW toma 11 kW aunque se conecte a uno de 22 kW. Basta con ajustar el equipo al techo de tu coche y a tu instalación.",
    },
    {
      q: "¿Qué cargador va bien para un Togg?",
      a: "Togg T10X y T10F usan toma Type 2 en corriente alterna y tienen un cargador interno de 11 kW (22 kW opcional en el T10X). En una casa con instalación trifásica encaja un equipo de pared de 11 kW o 22 kW; en monofásico el límite práctico es 7,4 kW. Para uso móvil son buena opción los cargadores portátiles con ajuste de amperaje por pasos.",
    },
    {
      q: "En mi casa no hay trifásica, ¿qué hago?",
      a: "En instalación monofásica puedes cargar hasta 7,4 kW (32A), y para la carga nocturna eso le sobra a la mayoría. Contratar trifásica es un trámite aparte con la distribuidora eléctrica y tiene un coste añadido. Envíanos los datos de tu instalación y te decimos qué opción tiene sentido.",
    },
    {
      q: "¿Dónde veo la potencia del cargador interno de mi coche?",
      a: "Aparece en el manual del vehículo y en la ficha técnica del fabricante, bajo el epígrafe «cargador interno» (on-board charger). El valor puede cambiar entre acabados del mismo modelo; en algunos, 11 kW es de serie y 22 kW opcional.",
    },
    {
      q: "¿Cuántos metros debe tener el cable de carga?",
      a: "Para la mayoría de usos en casa y en el trabajo bastan 5 metros. Si la toma del coche queda lejos de la plaza o vas a usar el cable en sitios distintos, es preferible de 7 a 10 metros. La longitud del cable no afecta a la velocidad de carga.",
    },
  ],
  kapanisBaslik: "Encontremos juntos el modelo adecuado",
  kapanisMetin:
    "Bemis E-V Charge fabrica sus cargadores y sus cables Type 2 en su propia planta de Bursa y exporta a más de 80 países. Cuéntanos tu vehículo y tu instalación y te indicaremos el modelo adecuado y el contacto correcto.",
  ctaBayi: "Solicitar presupuesto",
  ctaIletisim: "Todos los productos",
  linkler: urun("es"),
};

const RU: UyumlulukIcerik = {
  rozet: "Совместимость автомобилей",
  h1: "Какое зарядное устройство и какой кабель подойдут вашему автомобилю?",
  giris:
    "Почти все электромобили, продаваемые в Европе, используют для зарядки переменным током разъём Type 2 — включая Togg, Hyundai, Tesla, BYD, MG и Renault. Поэтому при выборе решает не тип разъёма, а мощность бортового зарядного устройства автомобиля и электропроводка вашего дома. Таблица ниже показывает и то, и другое.",
  ctaUrunler: "Смотреть зарядные станции",
  ctaKablolar: "Зарядные кабели",
  kuralVurgu: "Скорость зарядки задаёт автомобиль, а не станция.",
  kuralMetin:
    "Автомобиль с бортовым зарядным устройством на 11 kW возьмёт 11 kW даже от станции на 22 kW. Поэтому подход «куплю самое мощное» чаще всего означает лишние расходы: правильный выбор находится там, где предел автомобиля совпадает с возможностями вашей проводки.",
  tabloBaslik: "Мощность зарядки переменным током по моделям",
  sutunlar: ["Автомобиль", "Разъём AC", "Мощность бортового ЗУ", "Рекомендуемый продукт Bemis"],
  oneri66: "Charger 2 (32A однофазный) или переносной Mono Mobile",
  oneriDiger: "Charger 2 / Charger Plus 2 · 32A · зарядный кабель Type 2",
  notlar: {
    "Togg T10X": "Предлагается опциональное бортовое зарядное устройство на 22 kW; какой вариант установлен у вас, уточните по документам или списку комплектации.",
    "MG4": "Зависит от комплектации: 6,6 kW в большинстве версий и 11 kW в некоторых версиях 2026 года. Проверьте бортовое ЗУ перед покупкой трёхфазной станции.",
    "Renault Megane E-Tech": "Зависит от модельного года: 22 kW в версиях 2022–2025 и 11 kW после 2025 года.",
  },
  kaynakNotu:
    "Значения взяты со страниц моделей в EV Database (август 2026). Мощность бортового зарядного устройства может отличаться между комплектациями и модельными годами; точное значение смотрите в руководстве по эксплуатации. Если вашего автомобиля нет в списке, напишите нам — разберёмся вместе.",
  tesisatBaslik: "Что выбрать под вашу проводку?",
  rehber: [
    {
      title: "Однофазная сеть",
      body: "Большинство жилых домов — однофазные. Практический потолок в такой сети составляет 7,4 kW (32A). Даже если бортовое ЗУ автомобиля рассчитано на 11 kW, в однофазном доме вы не превысите 7,4 kW.",
      product: "Charger 2 · 32A однофазный — или переносной Mono Mobile",
    },
    {
      title: "Трёхфазная сеть",
      body: "В трёхфазной сети вы выходите на то, что позволяет бортовое ЗУ: 11 kW у автомобиля на 11 kW и 22 kW у автомобиля на 22 kW. Достаточно выбрать станцию по пределу автомобиля; более мощная скорости не добавит.",
      product: "Charger 2 / Charger Plus 2 · 32A трёхфазный (до 22 kW)",
    },
    {
      title: "Стационарная установка не нужна",
      body: "Если вы снимаете жильё или парковочное место меняется, подойдёт переносное зарядное устройство. Оно работает от розетки и не требует настенного монтажа, а ступенчатая настройка тока позволяет снизить ток под вашу проводку.",
      product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
    },
  ],
  sssBaslik: "Часто задаваемые вопросы",
  sss: [
    {
      q: "Какой зарядный кабель подойдёт моему электромобилю?",
      a: "Почти все электромобили, продаваемые в Европе, используют для зарядки переменным током разъём Type 2 (IEC 62196), включая модели Togg, Hyundai, Tesla, BYD, MG и Renault. Поэтому кабель определяется не типом разъёма, а номиналом тока и длиной: в однофазной сети кабель на 32A передаёт до 7,4 kW, а в трёхфазной — до 22 kW.",
    },
    {
      q: "Автомобиль зарядится быстрее, если купить станцию на 22 kW?",
      a: "Нет. Скорость задаёт бортовое зарядное устройство автомобиля, а не станция. Автомобиль с бортовым ЗУ на 11 kW возьмёт 11 kW и от станции на 22 kW. Достаточно подобрать станцию под предел автомобиля и вашу проводку.",
    },
    {
      q: "Какая станция подойдёт для Togg?",
      a: "Togg T10X и T10F используют разъём Type 2 для зарядки переменным током, бортовое ЗУ — 11 kW (на T10X опционально 22 kW). В доме с трёхфазной сетью подойдёт настенная станция на 11 kW или 22 kW; в однофазной сети практический предел — 7,4 kW. Для мобильного использования удобны переносные устройства со ступенчатой настройкой тока.",
    },
    {
      q: "У меня дома нет трёх фаз, что делать?",
      a: "В однофазной сети можно заряжать до 7,4 kW (32A) — для ночной зарядки этого с запасом хватает большинству водителей. Подключение трёх фаз — отдельная процедура с электросетевой компанией и дополнительные расходы. Пришлите нам данные вашей проводки, и мы подскажем, какой вариант имеет смысл.",
    },
    {
      q: "Где узнать мощность бортового зарядного устройства?",
      a: "Она указана в руководстве по эксплуатации и на странице технических характеристик производителя в разделе «бортовое зарядное устройство» (on-board charger). Значение может отличаться между комплектациями одной модели: где-то 11 kW — базовое, а 22 kW — опция.",
    },
    {
      q: "Какой длины должен быть зарядный кабель?",
      a: "Для большинства домашних и рабочих сценариев достаточно 5 метров. Если зарядный порт автомобиля далеко от парковочного места или кабель будет использоваться в разных местах, лучше 7–10 метров. Длина кабеля на скорость зарядки не влияет.",
    },
  ],
  kapanisBaslik: "Подберём подходящую модель вместе",
  kapanisMetin:
    "Bemis E-V Charge производит зарядные станции и кабели Type 2 на собственном предприятии в Бурсе и экспортирует более чем в 80 стран. Сообщите нам модель автомобиля и параметры проводки — подскажем подходящую модель и нужный контакт.",
  ctaBayi: "Запросить предложение",
  ctaIletisim: "Все продукты",
  linkler: urun("ru"),
};

const NL: UyumlulukIcerik = {
  rozet: "Voertuigcompatibiliteit",
  h1: "Welke lader en welke kabel passen bij jouw auto?",
  giris:
    "Vrijwel elke elektrische auto die in Europa wordt verkocht gebruikt bij AC-laden een Type 2-aansluiting — Togg, Hyundai, Tesla, BYD, MG en Renault inbegrepen. Bij de productkeuze is dus niet het stekkertype doorslaggevend, maar het ingebouwde laadvermogen van je auto en de elektrische installatie van je woning. De tabel hieronder laat beide samen zien.",
  ctaUrunler: "Bekijk laadstations",
  ctaKablolar: "Laadkabels",
  kuralVurgu: "Je auto bepaalt de laadsnelheid, niet de lader.",
  kuralMetin:
    "Een auto met een ingebouwde lader van 11 kW trekt 11 kW, ook aan een station van 22 kW. Daarom is „het krachtigste apparaat kopen” meestal onnodige kosten — de juiste keuze ligt waar de limiet van je auto en de capaciteit van je installatie elkaar raken.",
  tabloBaslik: "AC-laadvermogen per automodel",
  sutunlar: ["Voertuig", "AC-aansluiting", "Ingebouwd AC-vermogen", "Aanbevolen Bemis product"],
  oneri66: "Charger 2 (32A eenfasig) of de draagbare Mono Mobile",
  oneriDiger: "Charger 2 / Charger Plus 2 · 32A · Type 2-laadkabel",
  notlar: {
    "Togg T10X": "Er wordt optioneel een ingebouwde lader van 22 kW aangeboden; controleer in de voertuigpapieren of uitrustingslijst welke jij hebt.",
    "MG4": "Verschilt per uitvoering: 6,6 kW in de meeste versies, 11 kW in sommige versies uit 2026. Controleer de ingebouwde lader voordat je een driefasig station koopt.",
    "Renault Megane E-Tech": "Verschilt per modeljaar: 22 kW in de versies 2022–2025 en 11 kW na 2025.",
  },
  kaynakNotu:
    "De waarden komen van de modelpagina's van EV Database (augustus 2026). Het ingebouwde laadvermogen kan verschillen per uitvoering en modeljaar; kijk voor de exacte waarde in het instructieboekje. Staat jouw auto niet in de lijst, schrijf ons dan — we zoeken het samen uit.",
  tesisatBaslik: "Wat past bij jouw installatie?",
  rehber: [
    {
      title: "Eenfasige installatie",
      body: "De meeste woningen zijn eenfasig. Het praktische plafond is daar 7,4 kW (32A). Ook met een ingebouwde lader van 11 kW kom je in een eenfasige woning niet boven 7,4 kW uit.",
      product: "Charger 2 · 32A eenfasig — of de draagbare Mono Mobile",
    },
    {
      title: "Driefasige installatie",
      body: "Met een driefasige aansluiting haal je wat de ingebouwde lader van je auto toelaat: 11 kW bij een auto van 11 kW en 22 kW bij een auto van 22 kW. Het station afstemmen op de limiet van de auto volstaat; een krachtiger station levert geen extra snelheid.",
      product: "Charger 2 / Charger Plus 2 · 32A driefasig (tot 22 kW)",
    },
    {
      title: "Ik wil geen vaste installatie",
      body: "Huur je, of wisselt je parkeerplek, dan past een draagbare lader. Hij werkt vanaf een stopcontact en hoeft niet aan de muur, en met de instelbare ampèrestanden verlaag je de stroom passend bij je installatie.",
      product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
    },
  ],
  sssBaslik: "Veelgestelde vragen",
  sss: [
    {
      q: "Welke laadkabel past bij mijn elektrische auto?",
      a: "Vrijwel alle in Europa verkochte elektrische auto's gebruiken bij AC-laden een Type 2-aansluiting (IEC 62196), inclusief modellen van Togg, Hyundai, Tesla, BYD, MG en Renault. De kabel wordt dus niet bepaald door het stekkertype maar door de stroomsterkte en de lengte: eenfasig draagt een 32A-kabel tot 7,4 kW, driefasig dezelfde kabel tot 22 kW.",
    },
    {
      q: "Laadt mijn auto sneller als ik een 22 kW-station koop?",
      a: "Nee. De laadsnelheid wordt bepaald door de ingebouwde lader van je auto, niet door het station. Een auto met een ingebouwde lader van 11 kW trekt ook aan een 22 kW-station 11 kW. Het station afstemmen op de limiet van je auto en op je installatie volstaat.",
    },
    {
      q: "Welke lader past bij een Togg?",
      a: "Togg T10X en T10F gebruiken bij AC-laden een Type 2-aansluiting en hebben een ingebouwde lader van 11 kW (22 kW is optioneel op de T10X). In een woning met een driefasige aansluiting past een wandstation van 11 kW of 22 kW; eenfasig is de praktische grens 7,4 kW. Voor mobiel gebruik zijn draagbare laders met instelbare ampèrestanden een goede keuze.",
    },
    {
      q: "Ik heb thuis geen krachtstroom, wat nu?",
      a: "Op een eenfasige installatie laad je tot 7,4 kW (32A); voor laden door de nacht is dat voor de meeste rijders ruim voldoende. Een driefasige aansluiting laten aanleggen is een apart traject met de netbeheerder en kost extra. Stuur ons de gegevens van je installatie, dan zeggen we welke optie zinvol is.",
    },
    {
      q: "Hoe weet ik het ingebouwde AC-laadvermogen van mijn auto?",
      a: "Het staat in het instructieboekje en op de technische specificatiepagina van de fabrikant onder „ingebouwde lader” (on-board charger). De waarde kan per uitvoering van hetzelfde model verschillen; bij sommige modellen is 11 kW standaard en 22 kW optioneel.",
    },
    {
      q: "Hoe lang moet de laadkabel zijn?",
      a: "Voor de meeste situaties thuis en op het werk is 5 meter genoeg. Zit de laadpoort van de auto ver van de parkeerplek, of gebruik je de kabel op verschillende plekken, dan is 7 tot 10 meter beter. De kabellengte heeft geen invloed op de laadsnelheid.",
    },
  ],
  kapanisBaslik: "Laten we samen het juiste model kiezen",
  kapanisMetin:
    "Bemis E-V Charge produceert zijn laadstations en Type 2-kabels in de eigen fabriek in Bursa en exporteert naar meer dan 80 landen. Vertel ons je voertuig en je installatie, dan wijzen we je het passende model en het juiste aanspreekpunt.",
  ctaBayi: "Offerte aanvragen",
  ctaIletisim: "Alle producten",
  linkler: urun("nl"),
};

export const UYUM_ICERIK: Record<string, UyumlulukIcerik> = { en: EN, de: DE, es: ES, ru: RU, nl: NL, ar: AR_ICERIK };

/** SSS tek kaynak: görünen liste + FAQPage şeması aynı diziden okur. */
export const UYUM_SSS: Record<string, { q: string; a: string }[]> = {
  en: EN.sss, de: DE.sss, es: ES.sss, ru: RU.sss, nl: NL.sss, ar: AR_SSS,
};

export const UYUM_META: Record<string, UyumMeta> = {
  en: {
    title: "Which charger and cable fits your car?",
    desc: "AC charging compatibility for Togg, IONIQ 5, Tesla, BYD, MG and Renault: socket type, onboard charging power, and which unit and cable suit your installation.",
    keywords: ["ev charger compatibility", "type 2 charging cable", "onboard charger power", "togg charger", "ioniq 5 charger", "which charger for my car"],
    anasayfa: "Home", sayfa: "Vehicle charging compatibility", ogLocale: "en_US", inLanguage: "en",
  },
  de: {
    title: "Welches Ladegerät und Kabel passt zu Ihrem Auto?",
    desc: "AC-Ladekompatibilität für Togg, IONIQ 5, Tesla, BYD, MG und Renault: Steckertyp, Onboard-Ladeleistung und welches Gerät und Kabel zu Ihrer Installation passen.",
    keywords: ["ladegerät kompatibilität", "type 2 ladekabel", "onboard charger leistung", "togg ladegerät", "ioniq 5 wallbox", "welche wallbox für mein auto"],
    anasayfa: "Startseite", sayfa: "Fahrzeug-Ladekompatibilität", ogLocale: "de_DE", inLanguage: "de",
  },
  es: {
    title: "¿Qué cargador y qué cable encajan con tu coche?",
    desc: "Compatibilidad de carga CA para Togg, IONIQ 5, Tesla, BYD, MG y Renault: tipo de toma, potencia del cargador interno y qué equipo y cable encajan con tu instalación.",
    keywords: ["compatibilidad cargador coche eléctrico", "cable type 2", "potencia cargador interno", "cargador para togg", "cargador ioniq 5", "qué cargador para mi coche"],
    anasayfa: "Inicio", sayfa: "Compatibilidad de carga", ogLocale: "es_ES", inLanguage: "es",
  },
  ru: {
    title: "Какое зарядное устройство и кабель подойдут вашему автомобилю?",
    desc: "Совместимость зарядки переменным током для Togg, IONIQ 5, Tesla, BYD, MG и Renault: тип разъёма, мощность бортового ЗУ и какая станция и кабель подходят вашей проводке.",
    keywords: ["совместимость зарядного устройства", "кабель type 2", "мощность бортового зарядного устройства", "зарядка для togg", "зарядка ioniq 5", "какая зарядная станция"],
    anasayfa: "Главная", sayfa: "Совместимость зарядки", ogLocale: "ru_RU", inLanguage: "ru",
  },
  nl: {
    title: "Welke lader en kabel passen bij jouw auto?",
    desc: "AC-laadcompatibiliteit voor Togg, IONIQ 5, Tesla, BYD, MG en Renault: aansluiting, ingebouwd laadvermogen en welk station en welke kabel bij jouw installatie passen.",
    keywords: ["laadpaal compatibiliteit", "type 2 laadkabel", "ingebouwd laadvermogen", "togg laadpaal", "ioniq 5 laadpaal", "welke laadpaal voor mijn auto"],
    anasayfa: "Home", sayfa: "Laadcompatibiliteit", ogLocale: "nl_NL", inLanguage: "nl",
  },
  ar: {
    title: "أي شاحن وأي كابل يناسب سيارتك؟",
    desc: "توافق الشحن المتناوب لسيارات Togg وIONIQ 5 وTesla وBYD وMG وRenault: نوع المقبس وقدرة الشاحن الداخلي، وأي جهاز وكابل يناسب تمديدات منزلك.",
    keywords: ["شاحن السيارة الكهربائية", "كابل شحن Type 2", "قدرة الشاحن الداخلي", "شاحن Togg", "شاحن IONIQ 5", "أي شاحن يناسب سيارتي"],
    anasayfa: "الصفحة الرئيسية", sayfa: "توافق شحن المركبات", ogLocale: "ar_AE", inLanguage: "ar",
  },
};
