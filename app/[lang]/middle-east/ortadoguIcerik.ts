/**
 * /ar/middle-east — Körfez + Mısır iniş sayfasının Arapça içeriği. TEK KAYNAK.
 *
 * ⚠️ Neden ayrı dosya: SSS'i hem istemci bileşeni (GÖRÜNEN metin) hem sunucu rotası
 * (FAQPage JSON-LD) okur. İki yerde yazılsaydı zamanla ayrışır ve Google'ın
 * "şemadaki içerik sayfada görünür olmalı" kuralı sessizce ihlal edilirdi.
 *
 * ⚠️ İÇERİK KURALLARI (metin eklerken uy):
 *  - UYDURMA TİCARİ ŞART YOK: fiyat, asgari sipariş, teslim süresi, iskonto,
 *    bölge münhasırlığı, süre taahhüdü YAZILMAZ. Yalnız davet cümlesi.
 *  - O ÜLKELERDE VARLIK İDDİASI YOK: Körfez'de distribütörümüz yok
 *    (`internationalDealers`: yalnız Almanya · Şili · Portekiz aktif) → "şu ülkede
 *    bayimiz/projemiz var" denmez. Ülke kartları TEKLİF dilidir, geçmiş iddia değil.
 *  - "Türkiye'nin / yerli" milliyetçi çerçeve YOK (yabancı dil kuralı). 1994, Bursa,
 *    16.000 m² gibi olgular nötr kalabilir.
 *  - Rakip marka adı YOK (build zinciri `check:brands` ile durdurur).
 *  - Teknik iddialar YALNIZ sitede zaten yazılı olgulardan: CE, IP65/IP66,
 *    Type 2 / IEC 62196, CCS2, OCPP, AC 3,7–22 kW ayarlanabilir, DC 40–200 kW,
 *    2 yıl üretici garantisi, 80+ ülkeye ihracat.
 *  - ⚠️ 50/60 Hz: kullanıcı 2026-09-09'da ÜRETİMDEN TEYİTLİ olarak bildirdi
 *    (Suudi Arabistan şebekesi 60 Hz — bu sayfanın en kritik teknik ayrımı).
 *    Teyit geri alınırsa bu ibare sayfadan ÇIKARILMALI.
 */

export type ArSoru = { q: string; a: string };
export type Pazar = { kod: string; ad: string; not: string };

/** Hedef pazarlar — KKİK 6 ülke + Mısır (kullanıcı kararı, 2026-09-09). */
export const PAZARLAR: Pazar[] = [
  { kod: "AE", ad: "الإمارات العربية المتحدة", not: "محطات جدارية AC وشحن سريع DC لمشاريع الفنادق والمجمّعات السكنية ومواقف المكاتب. توريد للموزّعين والمقاولين." },
  { kod: "SA", ad: "المملكة العربية السعودية", not: "أجهزتنا تعمل على 50/60 هرتز، وهو ما يناسب الشبكة السعودية. مجموعة كاملة من الشحن المنزلي إلى محطات DC السريعة." },
  { kod: "QA", ad: "قطر", not: "حلول شحن للمجمّعات السكنية والمنشآت التجارية والأساطيل، مع إمكانية الإنتاج بعلامة الموزّع." },
  { kod: "KW", ad: "الكويت", not: "شواحن جدارية وكابلات Type 2 وشواحن متنقلة — توريد بالجملة للموزّعين ومتاجر قطع السيارات." },
  { kod: "BH", ad: "البحرين", not: "أحجام طلب مرنة تناسب السوق: من الشحن المنزلي إلى مكوّنات محطات الشحن للمشغّلين." },
  { kod: "OM", ad: "سلطنة عُمان", not: "منتجات بدرجة حماية IP65/IP66 تناسب التركيب الخارجي والظروف المناخية القاسية." },
  { kod: "EG", ad: "مصر", not: "مجموعة واسعة بأسعار المصنع للموزّعين والمستوردين، مع دعم فني ووثائق باللغة العربية." },
];

/** Proje tipine göre çözümler — her kart Arapça ürün koluna derin link verir. */
export const COZUMLER: { t: string; d: string; href: string; cta: string }[] = [
  {
    t: "الفنادق والمراكز التجارية",
    d: "محطات جدارية AC للمواقف الطويلة، ومحطات DC السريعة للزوار العابرين. الطرازات الذكية متوافقة مع OCPP لإدارة الجلسات والتعرفة.",
    href: "/ar/products/dc-units",
    cta: "محطات الشحن السريع DC",
  },
  {
    t: "المجمّعات السكنية والفلل",
    d: "محطات جدارية AC قابلة للضبط من 3,7 إلى 22 kW مع موازنة الأحمال والتحكّم عبر التطبيق وبطاقة RFID — مناسبة للمواقف المشتركة.",
    href: "/ar/products/wallbox",
    cta: "المحطات الجدارية AC",
  },
  {
    t: "الأساطيل والخدمات اللوجستية",
    d: "شحن ليلي في المستودع بمحطات AC متعدّدة، وشحن سريع DC عند الحاجة. مكوّنات ومقابس ومحوّلات من مصدر واحد.",
    href: "/ar/products/charger-equipment",
    cta: "مكوّنات محطات الشحن",
  },
  {
    t: "المعارض وورش الصيانة والطوارئ",
    d: "شواحن متنقلة بضبط تيار 6–32 A وكابلات Type 2 بأطوال 3–15 م ومحوّلات V2L/C2L — حلول تعمل دون تركيب ثابت.",
    href: "/ar/products/portable",
    cta: "الشواحن المتنقلة",
  },
];

/**
 * Bölgeye özel SSS. ⚠️ `/ar` giriş sayfasındaki `AR_SSS` ile KASITLI olarak
 * FARKLI sorular — aynı soruları iki Arapça sayfada tekrarlamak kopya içerik
 * sinyali üretir ve iki sayfa aynı sorguda birbirini yer.
 */
export const ORTADOGU_SSS: ArSoru[] = [
  {
    q: "هل تعمل أجهزتكم على شبكة 60 هرتز؟",
    a: "نعم. أجهزتنا تعمل على 50/60 هرتز، لذلك تناسب شبكات الخليج كافة بما فيها الشبكة السعودية التي تعمل بتردد 60 هرتز، إضافة إلى الشبكات العاملة بتردد 50 هرتز في الإمارات وقطر والكويت والبحرين وعُمان ومصر.",
  },
  {
    q: "إلى أي دول في المنطقة تشحنون؟",
    a: "الشحن يتم من المصنع في بورصة، والمنتجات تُصدَّر إلى أكثر من 80 دولة. للطلبات المتعلّقة بالخليج ومصر يُرجى التواصل مع قسم التصدير عبر البريد أو الهاتف الموضّحين في هذه الصفحة، مع ذكر البلد والمنتجات والكميات.",
  },
  {
    q: "ما القدرات المتاحة لمشاريع المنطقة؟",
    a: "المحطات الجدارية AC من الجيل الثاني قابلة للضبط من 3,7 إلى 22 kW (يحدّد الحد الأعلى مقطع الكابل: 16A حتى 11 kW و 32A حتى 22 kW). محطات الشحن السريع DC من 40 إلى 200 kW بموصّل CCS2. كما تتوفّر شواحن متنقلة وكابلات Type 2 بأطوال 3–15 م.",
  },
  {
    q: "هل المنتجات مناسبة للتركيب الخارجي في مناخ حار ومغبَر؟",
    a: "المنتجات مصنّفة IP65/IP66 بحسب الطراز، أي محميّة من الغبار ومن رذاذ الماء، وهي مصمّمة للتركيب الخارجي. تفاصيل درجة الحماية ونطاق درجات الحرارة موضّحة في المواصفات الفنية لكل منتج.",
  },
  {
    q: "هل يمكن توريد المنتجات بعلامتنا التجارية؟",
    a: "نعم. نوفّر إنتاج OEM و ODM وعلامة خاصة: العلامة التجارية والتغليف والتكوين الفني يمكن تخصيصها بحسب متطلبات الموزّع أو المستورد، لأن الإنتاج يتم في منشأتنا الخاصة.",
  },
  {
    q: "كيف نصبح موزّعين معتمدين في بلدنا؟",
    a: "تُقيَّم طلبات التوزيع لكل بلد على حدة. يُرجى مراسلة قسم التصدير مع ذكر البلد ومجال النشاط والبنية الحالية (معرض، مخزن، فريق فني) وحجم الأعمال المتوقّع؛ سيتواصل معكم الفريق المسؤول لمناقشة التفاصيل.",
  },
  {
    q: "ما الشهادات والضمان؟",
    a: "المنتجات حاصلة على شهادة CE وتستخدم موصّل Type 2 وفق معيار IEC 62196 (وموصّل CCS2 في محطات DC). ضمان المصنّع سنتان، وتفاصيله موضّحة في صفحة كل منتج.",
  },
];
