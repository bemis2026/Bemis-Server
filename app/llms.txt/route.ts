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
- [Yerli Üretici](https://www.bemisevcharge.com.tr/uretici): Bemis'in yerli EV şarj üreticisi kimliğini anlatan amiral sayfa.
- [Blog](https://www.bemisevcharge.com.tr/blog): EV şarj teknolojileri ve kullanım rehberleri içerikleri.
- [Dokümanlar](https://www.bemisevcharge.com.tr/documents): Ürün kataloğu, teknik doküman ve sertifikalar.
- [Bursa EV Şarj İstasyonu](https://www.bemisevcharge.com.tr/bursa-ev-sarj-istasyonu): Bursa'da EV şarj istasyonu çözümlerine yönelik bölgesel sayfa.

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
