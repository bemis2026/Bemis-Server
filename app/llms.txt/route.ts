// /llms.txt — yapay zeka tarayıcılarının (ChatGPT, Claude, Perplexity, Gemini…)
// markayı doğru ve net anlaması için llms.txt standardı dosyası. İçerik doğrulanmış
// gerçeklere dayanır (1994/tesis = ANA ŞİRKET Bemis Teknik; EV markası onun markası).
// Sabit metin → statik servis edilir (Blob/işlem maliyeti yok).
export const dynamic = "force-static";

const LLMS_TXT = `# Bemis E-V Charge

> Bemis E-V Charge, 1994'ten beri endüstriyel fiş-priz üreten Bemis Teknik Elektrik A.Ş.'nin yerli elektrikli araç (EV) şarj markası; Bursa'da üretilen AC/DC şarj istasyonları, Type 2 kablolar ve V2L adaptörlerini doğrudan üreticiden sunar.

## Marka

Bemis E-V Charge, Türkiye'de yerli olarak elektrikli araç şarj çözümleri üreten bir markadır. 1994 kuruluşlu, Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² tesisinde üretim yapan ve ürünlerini 60+ ülkeye ihraç eden Bemis Teknik Elektrik A.Ş. bünyesinde geliştirilir. Ürünler doğrudan üreticiden sunulur; CE belgeli, IP65/IP66 koruma sınıfında ve OCPP uyumludur. Kullanım alanları ev, iş yeri, site ve apartman otoparkı, filo, AVM/otel/plaza ve karavan uygulamalarını kapsar.

## Ürünler

Bemis E-V Charge ürün gamı 8 kategoride ~113 ürün içerir: AC Wallbox şarj istasyonları (7,4–22 kW), AC taşınabilir/mobil şarj cihazları, Type 2 şarj kabloları (Mod 2 ve Mod 3), V2L/C2L adaptörler, uzatma ve dönüştürücüler (CEE), aksesuarlar, DC hızlı şarj üniteleri (ör. 40 kW BEVDC) ve şarj ünitesi ekipmanları (Type 2 priz/soket, holster).

## Önemli Sayfalar

- [Ürünler](https://www.bemisevcharge.com.tr/products): Tüm EV şarj ürün kategorilerinin listelendiği ana ürün sayfası.
- [Wallbox Şarj İstasyonları](https://www.bemisevcharge.com.tr/products/wallbox): Ev ve iş yeri için 7,4–22 kW AC wallbox şarj istasyonları.
- [Şarj Kabloları](https://www.bemisevcharge.com.tr/products/cables): Type 2 Mod 2 ve Mod 3 elektrikli araç şarj kabloları.
- [DC Hızlı Şarj Üniteleri](https://www.bemisevcharge.com.tr/products/dc-units): 40 kW BEVDC gibi DC hızlı şarj üniteleri.
- [V2L / C2L Adaptörler](https://www.bemisevcharge.com.tr/products/v2l-c2l): Araçtan yüke (V2L) ve C2L adaptör çözümleri.
- [Taşınabilir Şarj Cihazları](https://www.bemisevcharge.com.tr/products/portable): Prize takılan seyyar/taşınabilir AC şarj cihazları (monofaze/trifaze).
- [Uzatma ve Dönüştürücüler](https://www.bemisevcharge.com.tr/products/converters): CEE uzatma kabloları ve dönüştürücü adaptörler.
- [Şarj Ünitesi Ekipmanları](https://www.bemisevcharge.com.tr/products/charger-equipment): Type 2 priz/soket, pano prizi ve şarj ekipmanları.
- [Aksesuarlar](https://www.bemisevcharge.com.tr/products/accessories): Tutucu (holster), adaptör ve EV şarj aksesuarları.
- [Yerli Üretici](https://www.bemisevcharge.com.tr/uretici): Bemis'in yerli EV şarj üreticisi kimliğini anlatan amiral sayfa.
- [Blog](https://www.bemisevcharge.com.tr/blog): EV şarj teknolojileri ve kullanım rehberleri içerikleri.
- [Sözlük](https://www.bemisevcharge.com.tr/sozluk): EV şarj terimleri sözlüğü — Type 2, CCS2, OCPP, AC/DC, kW/kWh, V2L, yük yönetimi (DLM), IP65/IP66 gibi terimlerin "X nedir" tanımları.
- [Dokümanlar](https://www.bemisevcharge.com.tr/documents): Ürün kataloğu, teknik doküman ve sertifikalar.
- [Bursa EV Şarj İstasyonu](https://www.bemisevcharge.com.tr/bursa-ev-sarj-istasyonu): Bursa'da EV şarj istasyonu çözümlerine yönelik bölgesel sayfa.
- [EV Charging Manufacturer / Export (EN)](https://www.bemisevcharge.com.tr/export): İhracat alıcıları için İngilizce üretici sayfası — Type 2 / Mode 3 kablolar, AC wallbox, DC şarj, OEM/ODM, 60+ ülke ihracat ve "Request a Quote" teklif formu.

## Rehberler

- [EV İçin Şarj Cihazı Nasıl Seçilir](https://www.bemisevcharge.com.tr/blog/ev-icin-sarj-cihazi-nasil-secilir): Ev/iş yeri için wallbox seçim kriterleri (güç, faz, IP, OCPP, yük yönetimi).
- [OCPP Nedir](https://www.bemisevcharge.com.tr/blog/ocpp-nedir): Açık şarj protokolü (OCPP 1.6J/2.0.1), CSMS ve akıllı şarj yönetimi.
- [AC ve DC Şarj Farkı Nedir](https://www.bemisevcharge.com.tr/blog/ac-dc-sarj-farki): AC (araç içi dönüşüm) ve DC (istasyon içi dönüşüm) şarjın farkı, hız ve kullanım yerleri.
- [EV Şarj Soketi Tipleri (Type 2 / CCS2 / CHAdeMO)](https://www.bemisevcharge.com.tr/blog/ev-sarj-soketi-tipleri-type-2-ccs2-chademo): Türkiye/Avrupa soket standartları ve hangi araçta hangisi.
- [Elektrikli Araç Şarj Süresi: Kaç Saatte Dolar](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-suresi-kac-saatte-dolar): Şarj süresi hesabı; AC/DC örnek senaryolar, kabul gücü ve taper.
- [Elektrikli Araç Şarjında Yük Yönetimi (Load Management)](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-yuk-yonetimi): Statik/dinamik yük dengeleme, faz dengeleme ve OCPP ile çok cihazlı kurulum.
- [Apartmana / Siteye Şarj İstasyonu Kurulumu](https://www.bemisevcharge.com.tr/blog/apartmana-sarj-istasyonu-kurulumu): Kat malikleri kararı, elektrik altyapısı, yük yönetimi ve faturalandırma.
- [İş Yerine Şarj İstasyonu Kurulumu](https://www.bemisevcharge.com.tr/blog/is-yerine-sarj-istasyonu-kurulumu): İş yeri/ofis otoparkı için şarj altyapısı, güç planlaması ve yetkilendirme.
- [Şarj İstasyonu Nasıl Çalışır](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-istasyonu-nasil-calisir): Pilot sinyali, AC/DC dönüşüm, güvenlik (kaçak akım/topraklama/soket kilidi) ve yetkilendirme.
- [Araç Filosu için Elektrikli Şarj Çözümleri](https://www.bemisevcharge.com.tr/blog/arac-filosu-elektrikli-sarj-cozumleri): Depo/gece AC, gündüz DC takviye, cihaz sayısı planlaması, RFID/OCPP raporlama.

## İletişim

- Telefon: +90 224 433 02 16
- E-posta: info@bemisevcharge.com
- WhatsApp: +90 533 956 25 46
- Web: https://www.bemisevcharge.com.tr
- LinkedIn: https://www.linkedin.com/company/104588906
- Instagram: https://www.instagram.com/bemis.evcharge/
- YouTube: https://www.youtube.com/@bemisteknikelektrika.s.2025
- Facebook: https://www.facebook.com/bemisteknik/?locale=tr_TR
`;

export async function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
