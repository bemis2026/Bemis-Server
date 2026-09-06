// ⚠️ OTOMATİK ÜRETİLİR — ELLE DÜZENLEME. Kaynak: app/blog/posts.ts
// Üretici: scripts/gen-posts-index.ts (build'de `next build` öncesi çalışır).
// Amaç: anasayfa (Reviews) son rehberleri gösterirken 346 KB posts.ts'i client
// bundle'ına ÇEKMESİN — yalnız hafif alanlar. allPosts() ile AYNI sırada (tarih desc).
export type PostIndexItem = { slug: string; title: string; titleI18n?: Record<string, string>; category: string; datePublished: string; image?: string };
export const POSTS_INDEX: PostIndexItem[] = [
  {
    "slug": "wallbox-nedir-ev-tipi-sarj-istasyonu-rehberi",
    "title": "Wallbox Nedir? Ev Tipi Elektrikli Araç Şarj İstasyonu Rehberi (2026)",
    "category": "Rehber",
    "datePublished": "2026-09-06"
  },
  {
    "slug": "11-kw-mi-22-kw-mi-wallbox-guc-secimi-amper-hesabi",
    "title": "11 kW mı 22 kW mı? Wallbox Güç Seçimi ve Amper Hesabı",
    "category": "Rehber",
    "datePublished": "2026-09-06"
  },
  {
    "slug": "elektrikli-arac-sarj-istasyonu-yonetmeligi",
    "title": "Elektrikli Araç Şarj İstasyonu Yönetmeliği: Apartman, Otopark ve AVM'de Ne Zorunlu?",
    "category": "Rehber",
    "datePublished": "2026-08-28"
  },
  {
    "slug": "elektrikli-arac-sarj-uzatma-kablosu-nasil-secilir",
    "title": "Elektrikli Araç Şarj Uzatma Kablosu: Kaç mm², Hangi Konnektör, Kaç Metre?",
    "category": "Rehber",
    "datePublished": "2026-08-28"
  },
  {
    "slug": "portatif-seyyar-sarj-cihazi-nedir-ne-kadar",
    "title": "Portatif (Seyyar) Elektrikli Araç Şarj Cihazı: Nedir, Kimlere Uygun, Ne Kadar?",
    "titleI18n": {
      "en": "Portable EV Charger: What It Is, Who It Suits and What It Costs",
      "de": "Mobiles EV-Ladegerät: Was es ist, für wen es passt und was es kostet",
      "es": "Cargador portátil para VE: qué es, para quién es y cuánto cuesta",
      "ar": "شاحن السيارات الكهربائية المحمول: ما هو، ولمن يناسب، وكم يكلّف؟",
      "ru": "Портативное зарядное устройство для электромобиля: что это, кому подходит и сколько стоит"
    },
    "category": "Rehber",
    "datePublished": "2026-07-23"
  },
  {
    "slug": "hangi-araclarda-v2l-var-turkiye",
    "title": "Türkiye'de Hangi Elektrikli Araçlarda V2L Var? (2026 Güncel Liste)",
    "titleI18n": {
      "en": "Which Electric Cars Have V2L? (Updated 2026 List)",
      "de": "Welche Elektroautos haben V2L? (Aktuelle Liste 2026)",
      "es": "¿Qué coches eléctricos tienen V2L? (Lista actualizada 2026)",
      "ar": "ما السيارات الكهربائية المزوّدة بخاصية V2L؟ (قائمة محدّثة 2026)",
      "ru": "В каких электромобилях есть V2L? (актуальный список 2026)"
    },
    "category": "Rehber",
    "datePublished": "2026-07-23"
  },
  {
    "slug": "elektrikli-arabami-evde-nasil-sarj-ederim",
    "title": "Elektrikli Arabamı Evde Nasıl Şarj Ederim? Yeni Başlayanlar İçin Şarj Aleti Rehberi",
    "titleI18n": {
      "en": "How Do I Charge My Electric Car at Home? A Beginner's Guide",
      "de": "Wie lade ich mein Elektroauto zu Hause? Ein Leitfaden für Einsteiger",
      "es": "¿Cómo cargo mi coche eléctrico en casa? Guía para principiantes",
      "ar": "كيف أشحن سيارتي الكهربائية في المنزل؟ دليل للمبتدئين",
      "ru": "Как зарядить электромобиль дома? Руководство для начинающих"
    },
    "category": "Rehber",
    "datePublished": "2026-07-20"
  },
  {
    "slug": "gunes-enerjisi-solar-ile-elektrikli-arac-sarji",
    "title": "Güneş Enerjisi (Solar) ile Elektrikli Araç Şarjı: Evde Güneş Panelinden Araç Şarj Etmek",
    "titleI18n": {
      "en": "Charging an Electric Car with Solar Power: Home Solar EV Charging",
      "de": "Elektroauto mit Solarstrom laden: EV-Laden mit der eigenen PV-Anlage",
      "es": "Cargar el coche eléctrico con energía solar: carga con paneles en casa",
      "ar": "شحن السيارة الكهربائية بالطاقة الشمسية: الشحن المنزلي بالألواح الشمسية",
      "ru": "Зарядка электромобиля от солнечной энергии: домашние солнечные панели"
    },
    "category": "Rehber",
    "datePublished": "2026-07-18"
  },
  {
    "slug": "evde-elektrikli-arac-sarji-guvenli-mi",
    "title": "Evde Elektrikli Araç Şarjı Güvenli mi? Priz, Sigorta ve Kaçak Akım Rehberi",
    "titleI18n": {
      "en": "Is Home EV Charging Safe? Sockets, Fuses and RCD Guide",
      "de": "Ist das Laden zu Hause sicher? Steckdosen, Sicherungen und FI-Schutzschalter",
      "es": "¿Es segura la carga en casa? Guía de tomas, fusibles y diferencial",
      "ar": "هل شحن السيارة الكهربائية في المنزل آمن؟ دليل المقابس والمصهرات وقاطع التسرّب",
      "ru": "Безопасна ли домашняя зарядка электромобиля? Розетки, автоматы и УЗО"
    },
    "category": "Rehber",
    "datePublished": "2026-07-18"
  },
  {
    "slug": "isletmeler-icin-dc-hizli-sarj-istasyonu-yatirimi",
    "title": "İşletmeler için DC Hızlı Şarj İstasyonu Yatırımı: Karar Rehberi",
    "titleI18n": {
      "en": "DC Fast Charging Investment for Businesses: A Decision Guide",
      "de": "DC-Schnellladeinvestition für Unternehmen: ein Entscheidungsleitfaden",
      "es": "Inversión en carga rápida DC para empresas: guía de decisión",
      "ar": "الاستثمار في الشحن السريع DC للشركات: دليل اتخاذ القرار",
      "ru": "Инвестиции в быструю DC-зарядку для бизнеса: руководство по выбору"
    },
    "category": "Rehber",
    "datePublished": "2026-07-11"
  },
  {
    "slug": "hangi-sarj-kablosu-aracima-uyumlu-type-2",
    "title": "Togg, Tesla ve Tüm Elektrikli Araçlar İçin Şarj Kablosu Uyumluluğu: Type 2 Rehberi",
    "titleI18n": {
      "en": "Charging Cable Compatibility for Every Electric Car: The Type 2 Guide",
      "de": "Ladekabel-Kompatibilität für jedes Elektroauto: der Typ-2-Leitfaden",
      "es": "Compatibilidad del cable de carga para cada coche eléctrico: guía Type 2",
      "ar": "توافق كابل الشحن مع كل سيارة كهربائية: دليل Type 2",
      "ru": "Совместимость зарядного кабеля для любого электромобиля: руководство по Type 2"
    },
    "category": "Rehber",
    "datePublished": "2026-07-11"
  },
  {
    "slug": "40-kw-dc-sarj-istasyonu",
    "title": "40 kW DC Şarj İstasyonu Nedir, Kime Uygun ve Ne Kadar Hızlı?",
    "titleI18n": {
      "en": "What Is a 40 kW DC Charging Station, Who Is It For and How Fast Is It?",
      "de": "Was ist eine 40-kW-DC-Ladestation, für wen eignet sie sich und wie schnell ist sie?",
      "es": "¿Qué es una estación de carga DC de 40 kW, para quién es y qué tan rápida es?",
      "ar": "ما محطة الشحن DC بقدرة 40 كيلوواط، ولمن تناسب، وما سرعتها؟",
      "ru": "Что такое DC-станция 40 кВт, кому она подходит и насколько быстра?"
    },
    "category": "Rehber",
    "datePublished": "2026-07-08"
  },
  {
    "slug": "evde-elektrikli-arac-sarj-maliyeti-km-basina",
    "title": "Evde Elektrikli Araç Şarj Maliyeti: Km Başına Kaç TL?",
    "titleI18n": {
      "en": "Home EV Charging Cost: How Much per Kilometre?",
      "de": "Kosten für das Laden zu Hause: Wie viel pro Kilometer?",
      "es": "Coste de carga en casa: ¿cuánto por kilómetro?",
      "ar": "تكلفة الشحن المنزلي: كم لكل كيلومتر؟",
      "ru": "Стоимость домашней зарядки: сколько за километр?"
    },
    "category": "Rehber",
    "datePublished": "2026-07-05"
  },
  {
    "slug": "monofaze-mi-trifaze-mi-ev-sarj",
    "title": "Monofaze mi, Trifaze (3 Faz) mı? Evinize Hangi Şarj Cihazı Uygun?",
    "titleI18n": {
      "en": "Single-Phase or Three-Phase? Choosing the Right Home Charger",
      "de": "Einphasig oder dreiphasig? Die richtige Wallbox für Ihr Zuhause",
      "es": "¿Monofásico o trifásico? Cómo elegir el cargador adecuado para casa",
      "ar": "أحادي الطور أم ثلاثي الأطوار؟ اختيار الشاحن المنزلي المناسب",
      "ru": "Однофазная или трёхфазная? Как выбрать домашнюю зарядную станцию"
    },
    "category": "Teknik",
    "datePublished": "2026-07-05"
  },
  {
    "slug": "ev-sarj-cihazi-modelleri-karsilastirma",
    "title": "EV Şarj Cihazı Modelleri Karşılaştırma: Hangi Model Size Uygun?",
    "titleI18n": {
      "en": "EV Charger Models Compared: Which One Is Right for You?",
      "de": "EV-Ladegeräte im Vergleich: Welches Modell passt zu Ihnen?",
      "es": "Comparativa de modelos de cargadores para VE: ¿cuál es el adecuado para ti?",
      "ar": "مقارنة موديلات أجهزة شحن السيارات الكهربائية: أي موديل يناسبك؟",
      "ru": "Сравнение моделей зарядных устройств для электромобилей: какая модель подойдёт вам?"
    },
    "category": "Rehber",
    "datePublished": "2026-07-03"
  },
  {
    "slug": "elektrikli-arac-sarj-kablosu-disarida-yagmurda-kullanilir-mi",
    "title": "Elektrikli Araç Şarj Kablosu Dışarıda ve Yağmurda Kullanılır mı?",
    "titleI18n": {
      "en": "Can You Use an EV Charging Cable Outdoors and in the Rain?",
      "de": "Darf man ein EV-Ladekabel draußen und im Regen verwenden?",
      "es": "¿Se puede usar el cable de carga de un vehículo eléctrico en el exterior y bajo la lluvia?",
      "ar": "هل يُستخدَم كابل شحن السيارة الكهربائية في الخارج وتحت المطر؟",
      "ru": "Можно ли использовать зарядный кабель электромобиля на улице и под дождём?"
    },
    "category": "Rehber",
    "datePublished": "2026-07-02"
  },
  {
    "slug": "ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi",
    "title": "Ev Şarj Ünitesi mi, Taşınabilir Şarj Cihazı mı? Hangisi Size Uygun?",
    "titleI18n": {
      "en": "Home Charging Unit or Portable Charger? Which Is Right for You?",
      "de": "Heimladeeinheit oder tragbares Ladegerät? Was passt zu Ihnen?",
      "es": "¿Unidad de carga doméstica o cargador portátil? ¿Cuál te conviene?",
      "ar": "وحدة شحن منزلية أم جهاز شحن محمول؟ أيّهما يناسبك؟",
      "ru": "Домашняя зарядная станция или переносное зарядное устройство? Что подойдёт вам?"
    },
    "category": "Rehber",
    "datePublished": "2026-07-02"
  },
  {
    "slug": "elektrikli-arac-sarj-kablosu-kac-metre-kac-amper",
    "title": "Elektrikli Araç Şarj Kablosu Kaç Metre ve Kaç Amper Olmalı?",
    "titleI18n": {
      "en": "How Many Metres and How Many Amps Should an EV Charging Cable Be?",
      "de": "Wie viele Meter und wie viele Ampere sollte ein EV-Ladekabel haben?",
      "es": "¿Cuántos metros y cuántos amperios debe tener el cable de carga de un vehículo eléctrico?",
      "ar": "كم متراً وكم أمبيراً يجب أن يكون كابل شحن السيارة الكهربائية؟",
      "ru": "Сколько метров и сколько ампер должен быть зарядный кабель электромобиля?"
    },
    "category": "Rehber",
    "datePublished": "2026-07-02"
  },
  {
    "slug": "elektrikli-arac-sarj-istasyonu-kurulum-rehberi",
    "title": "Elektrikli Araç Şarj İstasyonu Kurulum Rehberi",
    "titleI18n": {
      "en": "EV Charging Station Installation Guide",
      "de": "Ladestation für Elektroautos installieren: Der komplette Leitfaden",
      "es": "Guía de instalación de una estación de carga para vehículos eléctricos",
      "ar": "دليل تركيب محطة شحن السيارات الكهربائية",
      "ru": "Руководство по установке зарядной станции для электромобиля"
    },
    "category": "Rehber",
    "datePublished": "2026-06-27"
  },
  {
    "slug": "elektrikli-arac-sarj-yuk-yonetimi",
    "title": "Elektrikli Araç Şarjında Yük Yönetimi (Load Management) Nedir?",
    "titleI18n": {
      "en": "What Is Load Management in Electric Vehicle Charging?",
      "de": "Was ist Lastmanagement (Load Management) beim Laden von Elektrofahrzeugen?",
      "es": "¿Qué es la gestión de carga (Load Management) en la carga de vehículos eléctricos?",
      "ar": "ما هي إدارة الأحمال (Load Management) في شحن السيارات الكهربائية؟",
      "ru": "Что такое управление нагрузкой (Load Management) при зарядке электромобилей?"
    },
    "category": "Teknik",
    "datePublished": "2026-06-20"
  },
  {
    "slug": "arac-filosu-elektrikli-sarj-cozumleri",
    "title": "Araç Filosu için Elektrikli Şarj Çözümleri: Depo ve Gece Şarjı Rehberi",
    "titleI18n": {
      "en": "Electric Charging Solutions for Vehicle Fleets: A Guide to Depot and Overnight Charging",
      "de": "Elektro-Ladelösungen für Fahrzeugflotten: Leitfaden für Depot- und Nachtladen",
      "es": "Soluciones de carga eléctrica para flotas de vehículos: guía de carga en nave y nocturna",
      "ar": "حلول الشحن الكهربائي لأساطيل المركبات: دليل الشحن في المستودع والشحن الليلي",
      "ru": "Решения для зарядки автопарка электромобилей: руководство по зарядке в депо и ночной зарядке"
    },
    "category": "Rehber",
    "datePublished": "2026-06-20"
  },
  {
    "slug": "elektrikli-arac-sarj-istasyonu-nasil-calisir",
    "title": "Elektrikli Araç Şarj İstasyonu Nasıl Çalışır? Çalışma Prensibi (AC, DC, Güvenlik)",
    "titleI18n": {
      "en": "How Does an Electric Vehicle Charging Station Work? Operating Principle (AC, DC, Safety)",
      "de": "Wie funktioniert eine Ladestation für Elektrofahrzeuge? Funktionsprinzip (AC, DC, Sicherheit)",
      "es": "¿Cómo funciona una estación de carga de vehículos eléctricos? Principio de funcionamiento (AC, DC, seguridad)",
      "ar": "كيف تعمل محطة شحن السيارات الكهربائية؟ مبدأ العمل (AC و DC والأمان)",
      "ru": "Как работает зарядная станция для электромобилей? Принцип действия (AC, DC, безопасность)"
    },
    "category": "Teknik",
    "datePublished": "2026-06-20"
  },
  {
    "slug": "elektrikli-arac-sarj-terimleri-sozlugu",
    "title": "Elektrikli Araç Şarj Terimleri Sözlüğü",
    "titleI18n": {
      "en": "EV Charging Terminology Glossary",
      "de": "Glossar der Fachbegriffe zum Laden von Elektroautos",
      "es": "Glosario de términos de carga de vehículos eléctricos",
      "ar": "معجم مصطلحات شحن السيارات الكهربائية",
      "ru": "Словарь терминов зарядки электромобилей"
    },
    "category": "Teknik",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "elektrikli-arac-sarj-suresi-kac-saatte-dolar",
    "title": "Elektrikli Araç Şarj Süresi: Kaç Saatte Dolar? (AC ve DC)",
    "titleI18n": {
      "en": "EV Charging Time: How Many Hours to Full? (AC and DC)",
      "de": "Ladezeit von Elektroautos: In wie vielen Stunden ist es voll? (AC und DC)",
      "es": "Tiempo de carga de un vehículo eléctrico: ¿en cuántas horas se carga? (AC y DC)",
      "ar": "مدة شحن السيارة الكهربائية: في كم ساعة تمتلئ؟ (AC و DC)",
      "ru": "Время зарядки электромобиля: за сколько часов заряжается? (AC и DC)"
    },
    "category": "Rehber",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "ev-sarj-soketi-tipleri-type-2-ccs2-chademo",
    "title": "Elektrikli Araç Şarj Soketi Tipleri: Type 2, CCS2 ve CHAdeMO Farkı",
    "titleI18n": {
      "en": "EV Charging Connector Types: The Difference Between Type 2, CCS2 and CHAdeMO",
      "de": "Ladeanschlusstypen für Elektroautos: Unterschied zwischen Type 2, CCS2 und CHAdeMO",
      "es": "Tipos de conector de carga de vehículos eléctricos: diferencia entre Type 2, CCS2 y CHAdeMO",
      "ar": "أنواع موصّلات شحن السيارات الكهربائية: الفرق بين Type 2 و CCS2 و CHAdeMO",
      "ru": "Типы разъёмов зарядки электромобилей: различие Type 2, CCS2 и CHAdeMO"
    },
    "category": "Teknik",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "turkiye-yerli-ev-sarj-istasyonu-ureticisi",
    "title": "Türkiye'de Yerli EV Şarj Cihazı Üreticisi: Bemis E-V Charge",
    "titleI18n": {
      "en": "Turkey's Domestic EV Charger Manufacturer: Bemis E-V Charge",
      "de": "Einheimischer EV-Ladegerätehersteller in der Türkei: Bemis E-V Charge",
      "es": "Fabricante de cargadores para vehículos eléctricos en Turquía: Bemis E-V Charge",
      "ar": "الشركة التركية المصنّعة محلياً لأجهزة شحن السيارات الكهربائية: Bemis E-V Charge",
      "ru": "Отечественный производитель зарядных устройств для электромобилей в Турции: Bemis E-V Charge"
    },
    "category": "Marka",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "turkiye-sehir-sehir-ev-sarj-rehberi",
    "title": "Türkiye'de Şehir Şehir EV Şarj: İstanbul, Ankara, İzmir, Bursa",
    "titleI18n": {
      "en": "City-by-City EV Charging in Turkey: Istanbul, Ankara, Izmir, Bursa",
      "de": "EV-Laden Stadt für Stadt in der Türkei: Istanbul, Ankara, Izmir, Bursa",
      "es": "Carga de vehículos eléctricos ciudad por ciudad en Turquía: Estambul, Ankara, Esmirna, Bursa",
      "ar": "شحن السيارات الكهربائية مدينةً بمدينة في تركيا: إسطنبول وأنقرة وإزمير وبورصة",
      "ru": "Зарядка электромобилей по городам Турции: Стамбул, Анкара, Измир, Бурса"
    },
    "category": "Rehber",
    "datePublished": "2026-06-14"
  },
  {
    "slug": "ev-sarj-istasyonu-maliyeti",
    "title": "Ev Şarj İstasyonu Maliyeti: Fiyatı Belirleyen 6 Faktör",
    "titleI18n": {
      "en": "Home Charging Station Cost: The 6 Factors That Determine the Price",
      "de": "Kosten einer Ladestation für Zuhause: 6 preisbestimmende Faktoren",
      "es": "Coste de una estación de carga doméstica: los 6 factores que determinan el precio",
      "ar": "تكلفة محطة الشحن المنزلية: 6 عوامل تحدّد السعر",
      "ru": "Стоимость домашней зарядной станции: 6 факторов, определяющих цену"
    },
    "category": "Rehber",
    "datePublished": "2026-06-14"
  },
  {
    "slug": "ioniq-5-v2l-nasil-kullanilir",
    "title": "Ioniq 5 ile V2L Nasıl Kullanılır? V2L / C2L Adaptör Rehberi",
    "titleI18n": {
      "en": "How to Use V2L with the Ioniq 5? A V2L / C2L Adapter Guide",
      "de": "Wie nutzt man V2L mit dem Ioniq 5? Ratgeber zu V2L-/C2L-Adaptern",
      "es": "¿Cómo usar la función V2L con el Ioniq 5? Guía del adaptador V2L / C2L",
      "ar": "كيف تُستخدم خاصية V2L مع Ioniq 5؟ دليل محوّل V2L / C2L",
      "ru": "Как использовать V2L на Ioniq 5? Руководство по адаптерам V2L / C2L"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ac-dc-sarj-farki",
    "title": "AC Şarj Nedir, DC Şarj Nedir? Aradaki Fark ve Ev–İstasyon Kullanımı",
    "titleI18n": {
      "en": "What Is the Difference Between AC and DC Charging? A Home and Station Guide",
      "de": "Was ist der Unterschied zwischen AC- und DC-Laden? Ratgeber für Zuhause und Station",
      "es": "¿Cuál es la diferencia entre la carga AC y DC? Guía para el hogar y las estaciones",
      "ar": "ما الفرق بين الشحن بالتيار المتردد AC والتيار المستمر DC؟ دليل المنزل والمحطة",
      "ru": "В чём разница между зарядкой AC и DC? Руководство для дома и станции"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ev-icin-sarj-cihazi-nasil-secilir",
    "title": "Ev İçin Elektrikli Araç Şarj Cihazı Nasıl Seçilir?",
    "titleI18n": {
      "en": "How to Choose an Electric Vehicle Charger for Your Home",
      "de": "Wie wählt man ein Ladegerät für Elektrofahrzeuge für Zuhause aus?",
      "es": "¿Cómo elegir un cargador para vehículo eléctrico en casa?",
      "ar": "كيف تختار جهاز شحن السيارة الكهربائية للمنزل؟",
      "ru": "Как выбрать зарядное устройство для электромобиля для дома?"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "togg-v2l-aractan-elektrik",
    "title": "Togg ile V2L: Araçtan Elektrik (Araç-Dışı Güç) Kullanımı",
    "titleI18n": {
      "en": "V2L with Togg: Using Power from the Vehicle (Vehicle-to-Load)",
      "de": "V2L mit Togg: Strom aus dem Fahrzeug (Vehicle-to-Load) nutzen",
      "es": "V2L con Togg: electricidad desde el vehículo (alimentación externa)",
      "ar": "V2L مع Togg: استخدام الكهرباء من السيارة (الطاقة الخارجية)",
      "ru": "V2L с Togg: использование электричества от автомобиля (внешнее питание)"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ev-sarj-kablosu-secimi-type-2",
    "title": "Elektrikli Araç Şarj Kablosu Nasıl Seçilir? (Type 2 Rehberi)",
    "titleI18n": {
      "en": "How to Choose an Electric Vehicle Charging Cable (Type 2 Guide)",
      "de": "Wie wählt man ein Ladekabel für Elektrofahrzeuge aus? (Type 2 Ratgeber)",
      "es": "¿Cómo elegir un cable de carga para vehículo eléctrico? (Guía Type 2)",
      "ar": "كيف تختار كابل شحن السيارة الكهربائية؟ (دليل Type 2)",
      "ru": "Как выбрать зарядный кабель для электромобиля? (Руководство по Type 2)"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ocpp-nedir",
    "title": "OCPP Nedir? Şarj İstasyonlarında Neden Önemli?",
    "titleI18n": {
      "en": "What Is OCPP? Why Does It Matter for Charging Stations?",
      "de": "Was ist OCPP? Warum ist es bei Ladestationen so wichtig?",
      "es": "¿Qué es OCPP? ¿Por qué es importante en las estaciones de carga?",
      "ar": "ما هو OCPP؟ ولماذا يُعدّ مهمًّا في محطات الشحن؟",
      "ru": "Что такое OCPP? Почему это важно для зарядных станций?"
    },
    "category": "Teknik",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "apartmana-sarj-istasyonu-kurulumu",
    "title": "Apartmana / Siteye Elektrikli Araç Şarj İstasyonu Kurulumu",
    "titleI18n": {
      "en": "Installing an EV Charging Station in an Apartment / Housing Complex",
      "de": "Installation einer Ladestation für Elektrofahrzeuge in Mehrfamilienhäusern und Wohnanlagen",
      "es": "Instalación de una estación de carga para vehículos eléctricos en edificios y comunidades",
      "ar": "تركيب محطة شحن للسيارات الكهربائية في المبنى / المجمّع السكني",
      "ru": "Установка зарядной станции для электромобилей в жилом доме / комплексе"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "is-yerine-sarj-istasyonu-kurulumu",
    "title": "İş Yerine Elektrikli Araç Şarj İstasyonu Kurmanın 6 Avantajı",
    "titleI18n": {
      "en": "6 Advantages of Installing an EV Charging Station at Your Workplace",
      "de": "6 Vorteile der Installation einer EV-Ladestation am Firmenstandort",
      "es": "6 ventajas de instalar una estación de carga para vehículos eléctricos en tu negocio",
      "ar": "6 مزايا لتركيب محطة شحن للسيارات الكهربائية في مكان عملك",
      "ru": "6 преимуществ установки EV-зарядной станции на предприятии"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "tesla-sarj-turkiye-type-2",
    "title": "Tesla Şarj Türkiye: Type 2 ile Tesla Nasıl Şarj Edilir?",
    "titleI18n": {
      "en": "Charging a Tesla in Türkiye: How to Charge a Tesla with Type 2",
      "de": "Tesla laden in der Türkei: Wie lädt man einen Tesla mit Type 2?",
      "es": "Cargar un Tesla en Turquía: ¿cómo se carga un Tesla con Type 2?",
      "ar": "شحن Tesla في تركيا: كيف تُشحن Tesla عبر Type 2؟",
      "ru": "Зарядка Tesla в Турции: как заряжать Tesla через Type 2?"
    },
    "category": "Rehber",
    "datePublished": "2026-06-06"
  }
];
