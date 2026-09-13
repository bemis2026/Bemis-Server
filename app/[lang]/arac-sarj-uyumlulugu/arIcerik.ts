/**
 * ARAPÇA "ARAÇ ŞARJ UYUMLULUĞU" METİNLERİ — /ar/arac-sarj-uyumlulugu
 *
 * ⚠️ NEDEN AYRI DOSYA: TR sayfası (app/arac-sarj-uyumlulugu) hiç çeviri taşımıyordu
 *    (0 pickText). Bileşeni pickText'e bağlamak yerine, sitedeki mevcut Arapça
 *    desenine uyuldu (`app/[lang]/arIcerik.ts`, `ortadoguIcerik.ts`): metinler tek
 *    kaynakta, bileşene PROP olarak geçilir → TR sayfası BİREBİR aynı kalır.
 *
 * ⚠️⚠️ `AR_SSS` TEK KAYNAK: hem görünen SSS hem FAQPage JSON-LD buradan beslenir.
 *    İkisi ayrı yazılırsa zamanla ayrışır ve Google'ın "şemadaki içerik sayfada
 *    görünür olmalı" kuralı sessizce ihlal edilir (kayıtlı ders).
 *
 * ⚠️ SAYILAR LATİN RAKAMLA (11 kW, 32A, 7,4) — sitenin geri kalanı da öyle;
 *    `Intl` ar yerelinde Arap-Hint rakamı üretir, karışık görünüm olur.
 * ⚠️ MARKA/MODEL ADLARI ÇEVRİLMEZ (Togg, IONIQ 5, Charger Plus 2…) — kimliktir.
 * ⚠️ İÇ BAĞLANTILAR ARAPÇA KOLDA KALIR: /ar/products/... · bayi ve iletişim
 *    Arapça karşılığı olmadığı için `/ar` giriş sayfasına gider (o sayfa ihracat
 *    iletişimi + teklif formunu zaten taşıyor). TR rotasına link SIZDIRILMAZ.
 * ⚠️ UYDURMA SPEC YOK: tablo değerleri app/lib/vehicleCharging.ts'ten gelir
 *    (kaynağı kayıtlı, EV Database). Burada yalnız METİN çevrilir.
 */
import type { UyumlulukIcerik } from "../../components/VehicleChargingClient";

export const AR_SSS = [
  {
    q: "ما كابل الشحن المناسب لسيارتي الكهربائية؟",
    a: "تستخدم جميع السيارات الكهربائية المعروضة في تركيا وأوروبا تقريبًا مقبس Type 2 (IEC 62196) في الشحن المتناوب، بما فيها طُرز Togg وHyundai وTesla وBYD وMG وRenault. لذلك لا يكون نوع المقبس هو الفيصل عند اختيار الكابل، بل فئة التيار والطول: في منزل أحادي الطور ينقل كابل 32A حتى 7,4 kW، وفي تمديدات ثلاثية الأطوار ينقل الكابل نفسه حتى 22 kW.",
  },
  {
    q: "هل تشحن سيارتي أسرع إذا اشتريت جهاز 22 kW؟",
    a: "لا. سرعة الشحن تحددها وحدة الشحن الداخلية في سيارتك لا الجهاز. السيارة التي تبلغ قدرة شاحنها الداخلي 11 kW تسحب 11 kW حتى لو وُصلت بجهاز 22 kW. يكفي اختيار الجهاز وفق الحدّ الأعلى لسيارتك وسعة تمديدات منزلك.",
  },
  {
    q: "أي شاحن يناسب سيارة Togg؟",
    a: "يستخدم طرازا Togg T10X وT10F مقبس Type 2 في الشحن المتناوب، وقدرة الشاحن الداخلي 11 kW (وتتوفر 22 kW اختياريًا في T10X). في منزل بتمديدات ثلاثية الأطوار يناسبك جهاز جداري بقدرة 11 kW أو 22 kW؛ أما في المنزل أحادي الطور فالحدّ العملي 7,4 kW. وللاستخدام المتنقل يمكن تفضيل الشواحن المحمولة ذات ضبط الأمبير المتدرّج.",
  },
  {
    q: "لا تتوفر ثلاثة أطوار في منزلي، ماذا أفعل؟",
    a: "في التمديدات أحادية الطور يمكنك الشحن حتى 7,4 kW (32A)، وهذا يكفي معظم المستخدمين للشحن الليلي. أما جرّ ثلاثة أطوار فهو إجراء منفصل يتم مع شركة توزيع الكهرباء وله تكلفة إضافية. يقيّم وكيلنا المعتمد تمديداتك الحالية أثناء المعاينة ويخبرك أيّ الخيارين أنسب.",
  },
  {
    q: "كيف أعرف قدرة الشاحن الداخلي في سيارتي؟",
    a: "تجدها في دليل استخدام السيارة وفي صفحة المواصفات الفنية لدى الشركة المصنّعة تحت عنوان «وحدة الشحن الداخلية» (on-board charger). وقد تختلف هذه القيمة بين حزم التجهيز للطراز نفسه؛ ففي بعض الطُرز تكون 11 kW قياسية و22 kW اختيارية.",
  },
  {
    q: "كم مترًا يجب أن يكون كابل الشحن؟",
    a: "يكفي 5 أمتار في معظم استخدامات المنزل ومقر العمل. وإذا كان مقبس الشحن في السيارة بعيدًا عن موقف السيارة أو كنت ستستخدم الكابل في مواضع مختلفة فيُفضّل 7 إلى 10 أمتار. طول الكابل لا يؤثر في سرعة الشحن.",
  },
];

export const AR_ICERIK: UyumlulukIcerik = {
  rozet: "توافق المركبات",
  h1: "أي شاحن وأي كابل يناسب سيارتك؟",
  giris:
    "تستخدم جميع السيارات الكهربائية المعروضة في تركيا وأوروبا تقريبًا مقبس Type 2 في الشحن المتناوب — بما فيها Togg وHyundai وTesla وBYD وMG وRenault. لذلك لا يكون نوع المقبس هو الفيصل عند اختيار المنتج المناسب، بل قدرة الشاحن الداخلي في سيارتك وسعة التمديدات الكهربائية في منزلك. يجمع الجدول أدناه بين الاثنين.",
  ctaUrunler: "استعرض محطات الشحن",
  ctaKablolar: "كابلات الشحن",
  kuralVurgu: "سرعة الشحن تحددها سيارتك لا الجهاز.",
  kuralMetin:
    "السيارة التي تبلغ قدرة شاحنها الداخلي 11 kW تسحب 11 kW حتى لو وُصلت بجهاز 22 kW. لذلك يكون منطق «أشتري أقوى جهاز» تكلفة زائدة في أغلب الحالات؛ الاختيار الصحيح هو تقاطع حدّ سيارتك مع سعة تمديدات منزلك.",
  tabloBaslik: "قدرة الشحن المتناوب حسب طراز السيارة",
  sutunlar: ["المركبة", "مقبس AC", "قدرة الشاحن الداخلي", "المنتج المقترح من Bemis"],
  oneri66: "Charger 2 (32A طور واحد) أو Mono Mobile المحمول",
  oneriDiger: "Charger 2 / Charger Plus 2 · 32A · كابل شحن Type 2",
  // Araç adı → Arapça not. Adı burada OLMAYAN araç notsuz basılır (TR notu SIZMAZ).
  notlar: {
    "Togg T10X":
      "تتوفر وحدة شحن داخلية اختيارية بقدرة 22 kW؛ تأكد من المركّب في سيارتك عبر رخصة السيارة أو قائمة التجهيزات.",
    "MG4":
      "تختلف حسب التجهيز: 6,6 kW في معظم النسخ، و11 kW في بعض نسخ 2026. تحقّق من قدرة الشاحن الداخلي قبل شراء جهاز ثلاثي الأطوار.",
    "Renault Megane E-Tech":
      "تختلف حسب سنة الطراز: 22 kW في نسخ 2022–2025، و11 kW في النسخ بعد 2025.",
  },
  kaynakNotu:
    "القيم مأخوذة من صفحات الطُرز في EV Database (أغسطس 2026). قد تتغير قدرة الشاحن الداخلي بين حزم التجهيز وسنوات الطراز؛ للقيمة الدقيقة راجع دليل استخدام سيارتك. وإذا لم تجد سيارتك في القائمة فراسلنا لنحددها معًا.",
  tesisatBaslik: "ماذا تختار وفق تمديدات منزلك؟",
  rehber: [
    {
      title: "تمديدات أحادية الطور (مونوفاز)",
      body:
        "معظم المساكن في تركيا أحادية الطور. الحدّ العملي الأعلى في هذه التمديدات هو 7,4 kW (32A). وحتى لو كانت وحدة سيارتك الداخلية 11 kW فلن تتجاوز 7,4 kW في منزل أحادي الطور.",
      product: "Charger 2 · 32A طور واحد — أو Mono Mobile المحمول",
    },
    {
      title: "تمديدات ثلاثية الأطوار (ترايفاز)",
      body:
        "في التمديدات ثلاثية الأطوار تصل إلى ما تسمح به وحدة سيارتك الداخلية: 11 kW في سيارة 11 kW، و22 kW في سيارة 22 kW. يكفي اختيار الجهاز وفق الحدّ الأعلى للسيارة؛ الجهاز الأقوى لا يضيف سرعة.",
      product: "Charger 2 / Charger Plus 2 · 32A ثلاثي الأطوار (حتى 22 kW)",
    },
    {
      title: "لا أريد تركيبًا ثابتًا",
      body:
        "إذا كنت مستأجرًا أو يتغيّر موقف سيارتك فالشاحن المحمول مناسب. يعمل من المقبس ولا يحتاج تثبيتًا على الجدار، ويمكنك خفض التيار بما يوافق تمديداتك عبر ضبط الأمبير المتدرّج.",
      product: "Mini Mobile · Mono Mobile · Pro Mobile 2",
    },
  ],
  sssBaslik: "الأسئلة الشائعة",
  sss: AR_SSS,
  kapanisBaslik: "لنحدّد معًا الطراز المناسب لسيارتك",
  kapanisMetin:
    "تنتج Bemis E-V Charge محطات الشحن وكابلات Type 2 في منشأتها الخاصة في بورصة. تجري عمليات البيع ومعاينة التركيب عبر وكلائنا المعتمدين؛ يقيّم الوكيل تمديداتك في الموقع ويحدد الطراز المناسب لسيارتك وتكلفة التركيب.",
  ctaBayi: "أقرب وكيل إليك",
  ctaIletisim: "تواصل معنا",
  linkler: {
    wallbox: "/ar/products/wallbox",
    cables: "/ar/products/cables",
    // ⚠️ Arapça bayi/iletişim sayfası YOK → /ar giriş sayfası (ihracat iletişimi
    //    + teklif formu orada). TR rotasına link verilmez.
    bayi: "/ar",
    iletisim: "/ar",
  },
};
