// Kategori → rehber (blog) çapraz-link haritası — TEK KAYNAK.
//
// ⚠️ NEDEN AYRI DOSYA (2026-09-09): bu harita eskiden `ProductCategoryClient`
// içinde satır-içi tanımlıydı ve blok `lang === "en"` dışındaki HER dilde
// TÜRKÇE başlıklarla + TR adreslerle basılıyordu (de/es/ru/nl/ar sızıntısı).
// Artık: TR sayfalar bu haritayı kullanır; dil kolları kendi listesini SUNUCUDAN
// prop olarak geçirir (Arapça kol → Arapça başlık + /ar/blog adresi, karşılığı
// olmayan rehber DÜŞER). Harita saf veridir; blog gövdesini import ETMEZ
// (istemci paketine 1,5 MB çeviri sözlüğü girmesin — 2026-07-22 dersi).
export type Rehber = { label: string; href: string };

export const CATEGORY_GUIDES: Record<string, Rehber[]> = {
  cables: [
    { label: "Hangi araca hangi şarj cihazı ve kablosu uyar?", href: "/arac-sarj-uyumlulugu" },
    { label: "Şarj kablosu kaç metre, kaç amper olmalı?", href: "/blog/elektrikli-arac-sarj-kablosu-kac-metre-kac-amper" },
    { label: "Şarj kablosu dışarıda/yağmurda kullanılır mı?", href: "/blog/elektrikli-arac-sarj-kablosu-disarida-yagmurda-kullanilir-mi" },
    { label: "EV şarj kablosu seçimi (Type 2)", href: "/blog/ev-sarj-kablosu-secimi-type-2" },
  ],
  wallbox: [
    { label: "Hangi araca hangi şarj cihazı ve kablosu uyar?", href: "/arac-sarj-uyumlulugu" },
    { label: "Ev şarj ünitesi mi, taşınabilir cihaz mı?", href: "/blog/ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi" },
    { label: "EV için şarj cihazı nasıl seçilir?", href: "/blog/ev-icin-sarj-cihazi-nasil-secilir" },
    { label: "Apartmana / siteye şarj istasyonu kurulumu", href: "/blog/apartmana-sarj-istasyonu-kurulumu" },
    { label: "Wallbox nedir? Ev tipi şarj istasyonu rehberi", href: "/blog/wallbox-nedir-ev-tipi-sarj-istasyonu-rehberi" },
    { label: "11 kW mı 22 kW mı? Güç seçimi ve amper hesabı", href: "/blog/11-kw-mi-22-kw-mi-wallbox-guc-secimi-amper-hesabi" },
  ],
  portable: [
    { label: "Hangi araca hangi şarj cihazı ve kablosu uyar?", href: "/arac-sarj-uyumlulugu" },
    { label: "Ev şarj ünitesi mi, taşınabilir cihaz mı?", href: "/blog/ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi" },
    { label: "Şarj kablosu kaç metre, kaç amper olmalı?", href: "/blog/elektrikli-arac-sarj-kablosu-kac-metre-kac-amper" },
  ],
  "dc-units": [
    { label: "AC ve DC şarj farkı nedir?", href: "/blog/ac-dc-sarj-farki" },
    { label: "Şarj istasyonu nasıl çalışır?", href: "/blog/elektrikli-arac-sarj-istasyonu-nasil-calisir" },
  ],
  "v2l-c2l": [
    { label: "IONIQ 5 V2L nasıl kullanılır?", href: "/blog/ioniq-5-v2l-nasil-kullanilir" },
    { label: "Togg V2L: araçtan elektrik", href: "/blog/togg-v2l-aractan-elektrik" },
  ],
};
