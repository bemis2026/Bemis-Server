/**
 * /ar giriş sayfasının Arapça SSS'i — TEK KAYNAK.
 *
 * ⚠️ Neden ayrı dosya: hem istemci bileşeni (görünen SSS) hem sunucu rotası (FAQPage JSON-LD)
 * bunu okur. İki yerde ayrı yazılsaydı zamanla ayrışır ve Google'ın "şemadaki içerik sayfada
 * GÖRÜNÜR olmalı" kuralı sessizce ihlal edilirdi (bu depoda daha önce yaşanan kusur sınıfı).
 *
 * ⚠️ İçerik kuralları: uydurma ticari şart YOK (fiyat / asgari sipariş / teslim süresi /
 * bölge münhasırlığı); yalnız sitede zaten yazılı olgular.
 */
export type ArSss = { q: string; a: string };

export const AR_SSS: ArSss[] = [
  {
    q: "هل تصدّرون إلى دول الخليج والشرق الأوسط؟",
    a: "نعم. المنتجات تُصدَّر إلى أكثر من 80 دولة وتُشحن من المصنع في بورصة. للطلبات والعروض يُرجى التواصل مع قسم التصدير عبر البريد أو الهاتف الموضّحين في هذه الصفحة.",
  },
  {
    q: "هل يمكن الإنتاج بعلامتنا التجارية (OEM / ODM)؟",
    a: "نعم. نوفّر إنتاج OEM و ODM وعلامة خاصة: تخصيص العلامة التجارية والتغليف والتكوين الفني بحسب متطلبات الموزّع أو المستورد.",
  },
  {
    q: "ما الشهادات ودرجات الحماية؟",
    a: "المنتجات حاصلة على شهادة CE وبدرجة حماية IP65/IP66 بحسب الطراز، وتستخدم موصّل Type 2 وفق معيار IEC 62196. الطرازات الذكية متوافقة مع بروتوكول OCPP.",
  },
  {
    q: "ما نطاق القدرة المتاح؟",
    a: "محطات الشحن الجدارية AC من الجيل الثاني قابلة للضبط من 3,7 إلى 22 kW (الحد الأعلى يحدّده مقطع الكابل: 16A حتى 11 kW، و 32A حتى 22 kW). محطات الشحن السريع DC من 40 إلى 200 kW بموصّل CCS2.",
  },
  {
    q: "هل هناك ضمان؟",
    a: "نعم، ضمان المصنّع سنتان. تفاصيل الضمان الخاصة بكل طراز موضّحة في صفحة المنتج.",
  },
  {
    q: "كيف نصبح موزّعين في بلدنا؟",
    a: "تُقيَّم طلبات التوزيع لكل بلد على حدة. يُرجى مراسلة قسم التصدير مع ذكر بلدكم ومجال نشاطكم وحجم الأعمال المتوقّع؛ سيتواصل معكم الفريق المسؤول.",
  },
];

/**
 * Arapça sayfaların `<meta name="keywords">` tabanı.
 * ⚠️ NEDEN GEREKLİ: Next'te alt rota `keywords` vermezse KÖK YERLEŞİMDEN MİRAS ALIR —
 *    kök yerleşimin listesi TÜRKÇE. Yani "keywords vermeyerek Türkçe basmamış oluruz"
 *    varsayımı YANLIŞ; ölçüldü, /ar/blog ve /ar/sozluk canlıda Türkçe kelime basıyordu.
 *    (Google keywords meta'sını yok sayar → sıralamaya etkisi yok; sorun tutarlılık ve
 *     Arapça sayfayı okuyan YZ tarayıcıları.) Arapça rotalar bunu AÇIKÇA vermeli.
 */
export const AR_ANAHTAR_KELIMELER = [
  "شواحن السيارات الكهربائية",
  "محطات شحن جدارية",
  "شاحن سريع DC",
  "كابل شحن Type 2",
  "مصنّع شواحن السيارات الكهربائية",
];
