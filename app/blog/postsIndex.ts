// ⚠️ OTOMATİK ÜRETİLİR — ELLE DÜZENLEME. Kaynak: app/blog/posts.ts
// Üretici: scripts/gen-posts-index.ts (build'de `next build` öncesi çalışır).
// Amaç: anasayfa (Reviews) son rehberleri gösterirken 346 KB posts.ts'i client
// bundle'ına ÇEKMESİN — yalnız hafif alanlar. allPosts() ile AYNI sırada (tarih desc).
export type PostIndexItem = { slug: string; title: string; category: string; datePublished: string; image?: string };
export const POSTS_INDEX: PostIndexItem[] = [
  {
    "slug": "gunes-enerjisi-solar-ile-elektrikli-arac-sarji",
    "title": "Güneş Enerjisi (Solar) ile Elektrikli Araç Şarjı: Evde Güneş Panelinden Araç Şarj Etmek",
    "category": "Rehber",
    "datePublished": "2026-07-18"
  },
  {
    "slug": "evde-elektrikli-arac-sarji-guvenli-mi",
    "title": "Evde Elektrikli Araç Şarjı Güvenli mi? Priz, Sigorta ve Kaçak Akım Rehberi",
    "category": "Rehber",
    "datePublished": "2026-07-18"
  },
  {
    "slug": "isletmeler-icin-dc-hizli-sarj-istasyonu-yatirimi",
    "title": "İşletmeler için DC Hızlı Şarj İstasyonu Yatırımı: Karar Rehberi",
    "category": "Rehber",
    "datePublished": "2026-07-11"
  },
  {
    "slug": "hangi-sarj-kablosu-aracima-uyumlu-type-2",
    "title": "Togg, Tesla ve Tüm Elektrikli Araçlar İçin Şarj Kablosu Uyumluluğu: Type 2 Rehberi",
    "category": "Rehber",
    "datePublished": "2026-07-11"
  },
  {
    "slug": "40-kw-dc-sarj-istasyonu",
    "title": "40 kW DC Şarj İstasyonu Nedir, Kime Uygun ve Ne Kadar Hızlı?",
    "category": "Rehber",
    "datePublished": "2026-07-08"
  },
  {
    "slug": "evde-elektrikli-arac-sarj-maliyeti-km-basina",
    "title": "Evde Elektrikli Araç Şarj Maliyeti: Km Başına Kaç TL?",
    "category": "Rehber",
    "datePublished": "2026-07-05"
  },
  {
    "slug": "monofaze-mi-trifaze-mi-ev-sarj",
    "title": "Monofaze mi, Trifaze (3 Faz) mı? Evinize Hangi Şarj Cihazı Uygun?",
    "category": "Teknik",
    "datePublished": "2026-07-05"
  },
  {
    "slug": "ev-sarj-cihazi-modelleri-karsilastirma",
    "title": "EV Şarj Cihazı Modelleri Karşılaştırma: Hangi Model Size Uygun?",
    "category": "Rehber",
    "datePublished": "2026-07-03"
  },
  {
    "slug": "elektrikli-arac-sarj-kablosu-disarida-yagmurda-kullanilir-mi",
    "title": "Elektrikli Araç Şarj Kablosu Dışarıda ve Yağmurda Kullanılır mı?",
    "category": "Rehber",
    "datePublished": "2026-07-02"
  },
  {
    "slug": "ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi",
    "title": "Ev Şarj Ünitesi mi, Taşınabilir Şarj Cihazı mı? Hangisi Size Uygun?",
    "category": "Rehber",
    "datePublished": "2026-07-02"
  },
  {
    "slug": "elektrikli-arac-sarj-kablosu-kac-metre-kac-amper",
    "title": "Elektrikli Araç Şarj Kablosu Kaç Metre ve Kaç Amper Olmalı?",
    "category": "Rehber",
    "datePublished": "2026-07-02"
  },
  {
    "slug": "elektrikli-arac-sarj-istasyonu-kurulum-rehberi",
    "title": "Elektrikli Araç Şarj İstasyonu Kurulum Rehberi",
    "category": "Rehber",
    "datePublished": "2026-06-27"
  },
  {
    "slug": "elektrikli-arac-sarj-yuk-yonetimi",
    "title": "Elektrikli Araç Şarjında Yük Yönetimi (Load Management) Nedir?",
    "category": "Teknik",
    "datePublished": "2026-06-20"
  },
  {
    "slug": "arac-filosu-elektrikli-sarj-cozumleri",
    "title": "Araç Filosu için Elektrikli Şarj Çözümleri: Depo ve Gece Şarjı Rehberi",
    "category": "Rehber",
    "datePublished": "2026-06-20"
  },
  {
    "slug": "elektrikli-arac-sarj-istasyonu-nasil-calisir",
    "title": "Elektrikli Araç Şarj İstasyonu Nasıl Çalışır? Çalışma Prensibi (AC, DC, Güvenlik)",
    "category": "Teknik",
    "datePublished": "2026-06-20"
  },
  {
    "slug": "elektrikli-arac-sarj-terimleri-sozlugu",
    "title": "Elektrikli Araç Şarj Terimleri Sözlüğü",
    "category": "Teknik",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "elektrikli-arac-sarj-suresi-kac-saatte-dolar",
    "title": "Elektrikli Araç Şarj Süresi: Kaç Saatte Dolar? (AC ve DC)",
    "category": "Rehber",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "ev-sarj-soketi-tipleri-type-2-ccs2-chademo",
    "title": "Elektrikli Araç Şarj Soketi Tipleri: Type 2, CCS2 ve CHAdeMO Farkı",
    "category": "Teknik",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "turkiye-yerli-ev-sarj-istasyonu-ureticisi",
    "title": "Türkiye'de Yerli EV Şarj Cihazı Üreticisi: Bemis E-V Charge",
    "category": "Marka",
    "datePublished": "2026-06-16"
  },
  {
    "slug": "turkiye-sehir-sehir-ev-sarj-rehberi",
    "title": "Türkiye'de Şehir Şehir EV Şarj: İstanbul, Ankara, İzmir, Bursa",
    "category": "Rehber",
    "datePublished": "2026-06-14"
  },
  {
    "slug": "ev-sarj-istasyonu-maliyeti",
    "title": "Ev Şarj İstasyonu Maliyeti: Fiyatı Belirleyen 6 Faktör",
    "category": "Rehber",
    "datePublished": "2026-06-14"
  },
  {
    "slug": "ioniq-5-v2l-nasil-kullanilir",
    "title": "Ioniq 5 ile V2L Nasıl Kullanılır? V2L / C2L Adaptör Rehberi",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ac-dc-sarj-farki",
    "title": "AC ve DC Şarj Arasındaki Fark Nedir? Ev ve İstasyon Rehberi",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ev-icin-sarj-cihazi-nasil-secilir",
    "title": "Ev İçin Elektrikli Araç Şarj Cihazı Nasıl Seçilir?",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "togg-v2l-aractan-elektrik",
    "title": "Togg ile V2L: Araçtan Elektrik (Araç-Dışı Güç) Kullanımı",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ev-sarj-kablosu-secimi-type-2",
    "title": "Elektrikli Araç Şarj Kablosu Nasıl Seçilir? (Type 2 Rehberi)",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "ocpp-nedir",
    "title": "OCPP Nedir? Şarj İstasyonlarında Neden Önemli?",
    "category": "Teknik",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "apartmana-sarj-istasyonu-kurulumu",
    "title": "Apartmana / Siteye Elektrikli Araç Şarj İstasyonu Kurulumu",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "is-yerine-sarj-istasyonu-kurulumu",
    "title": "İş Yerine Elektrikli Araç Şarj İstasyonu Kurmanın 6 Avantajı",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  },
  {
    "slug": "tesla-sarj-turkiye-type-2",
    "title": "Tesla Şarj Türkiye: Type 2 ile Tesla Nasıl Şarj Edilir?",
    "category": "Rehber",
    "datePublished": "2026-06-06"
  }
];
