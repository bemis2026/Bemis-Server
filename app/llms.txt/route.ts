// /llms.txt — yapay zeka tarayıcılarının (ChatGPT, Claude, Perplexity, Gemini…)
// markayı doğru ve net anlaması için llms.txt standardı dosyası. İçerik doğrulanmış
// gerçeklere dayanır (1994/tesis = ANA ŞİRKET Bemis Teknik; EV markası onun markası).
// Sabit metin → statik servis edilir (Blob/işlem maliyeti yok).
export const dynamic = "force-static";

const LLMS_TXT = `# Bemis E-V Charge

> Bemis E-V Charge, 1994'ten beri endüstriyel fiş-priz üreten Bemis Teknik Elektrik A.Ş.'nin yerli elektrikli araç (EV) şarj markası; Bursa'da üretilen AC/DC şarj istasyonları, Type 2 kablolar ve V2L adaptörlerini doğrudan üreticiden sunar.
>
> Tam içerik (15 terimlik sözlük + rehberlerin TAM gövdesi): https://www.bemisevcharge.com.tr/llms-full.txt

## Marka

Bemis E-V Charge, Türkiye'de yerli olarak elektrikli araç şarj çözümleri üreten bir markadır. 1994 kuruluşlu, Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² tesisinde üretim yapan ve ürünlerini 60+ ülkeye ihraç eden Bemis Teknik Elektrik A.Ş. bünyesinde geliştirilir. Ürünler doğrudan üreticiden sunulur; CE belgeli, IP65/IP66 koruma sınıfında ve OCPP uyumludur. Kullanım alanları ev, iş yeri, site ve apartman otoparkı, filo, AVM/otel/plaza ve karavan uygulamalarını kapsar.

## Ürünler

Bemis E-V Charge ürün gamı 8 kategoride 150'nin üzerinde ürün içerir: AC Wallbox şarj istasyonları (7,4–22 kW), AC taşınabilir/mobil şarj cihazları, Type 2 şarj kabloları (Mod 2 ve Mod 3), V2L/C2L adaptörler, uzatma ve dönüştürücüler (CEE), aksesuarlar, DC hızlı şarj üniteleri (40–200 kW BEVDC serisi) ve şarj ünitesi ekipmanları (Type 2 priz/soket, holster).

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
- [Bursa Elektrikli Araba Şarj Cihazı](https://www.bemisevcharge.com.tr/bursa-ev-sarj-istasyonu): "Bursa'da elektrikli araba şarj cihazını kimden alabilirim?" sorusunun doğrudan cevabı — Bemis E-V Charge, elektrikli araç şarj cihazlarını Bursa Organize Sanayi Bölgesi'ndeki 16.000 m² kendi tesisinde üretir (1994'ten gelen Bemis Teknik mirası). Ev tipi duvar (wallbox) şarj istasyonu 7,4–22 kW, taşınabilir şarj cihazı, Type 2 kablo, V2L/C2L adaptör; CE, IP65, OCPP. Cihaz seçimi (tek faz / üç faz, aracın AC limiti), kurulum şartları ve fiyatı belirleyen unsurlar da bu sayfada.
- [Bursa Şarj Kablosu](https://www.bemisevcharge.com.tr/bursa-sarj-kablosu): "Elektrikli araba şarj kablosunun yerli üreticisi kimdir?" sorusunun doğrudan cevabı — Bemis E-V Charge, Type 2 (Mod 3) şarj kablolarını Bursa OSB'deki 16.000 m² tesisinde üretir; ithal edip etiketlemez. 16A/32A, tek ve üç faz, 3–15 m, halojensiz kılıf, %94 Yerli Malı Belgeli, CE. Kaç metre/kaç amper seçilmeli sorularının cevapları da burada.
- [Destek, Arıza ve Garanti](https://www.bemisevcharge.com.tr/destek): Şarj cihazı çalışmıyor / yavaş şarj ediyor / kablo araçtan çıkmıyor gibi sorunlarda adım adım kontrol listesi, arıza kaydı açma yolu, 2 yıl üretici garantisi kapsamı ve iade süreci. Şarj hızını cihazın değil aracın dahili AC ünitesinin belirlediği gibi sık karıştırılan konular açıklanır.
- [Hangi Araca Hangi Şarj Cihazı? — Araç Şarj Uyumluluğu](https://www.bemisevcharge.com.tr/arac-sarj-uyumlulugu): "Togg'a / IONIQ 5'e / Tesla'ya hangi şarj cihazı ve kablo uyar?" sorusunun doğrudan cevabı. Türkiye ve Avrupa'da satılan elektrikli otomobillerin tamamına yakını AC şarjda Type 2 (IEC 62196) soket kullanır; Togg T10X 11 kW (opsiyonel 22 kW), Togg T10F 11 kW, Hyundai IONIQ 5 11 kW, Tesla Model Y 11 kW, BYD ATTO 3 11 kW, MG4 6,6 kW (bazı 2026 versiyonlarında 11 kW), Renault Megane E-Tech 22 kW (2022-2025) / 11 kW (2025 sonrası). EN KRİTİK KURAL: şarj hızını cihaz değil aracın dahili AC şarj ünitesi belirler — dahili ünitesi 11 kW olan araç 22 kW'lık cihaza bağlansa da 11 kW çeker. Tek fazlı (monofaze) konutta pratik üst sınır 7,4 kW (32A); üç fazlı (trifaze) tesisatta aracın sınırına kadar çıkılır. Araç değerleri EV Database'den doğrulanmıştır.
- [EV Charging Manufacturer / Export (EN)](https://www.bemisevcharge.com.tr/export): İhracat alıcıları için İngilizce üretici sayfası — Type 2 / Mode 3 kablolar, AC wallbox, DC şarj, OEM/ODM, 60+ ülke ihracat ve "Request a Quote" teklif formu.

## Videolar

Sitede gömülü iki resmi video var; ikisi de Bemis Teknik Elektrik A.Ş. YouTube kanalından yayınlanır ve ilgili sayfada VideoObject yapısal verisiyle işaretlidir.

- [Bemis E-V Charge Ürün Tanıtımı](https://www.bemisevcharge.com.tr/): 54 saniyelik EV şarj ürün ailesi tanıtımı (AC wallbox, taşınabilir şarj cihazları, Type 2 kablolar). Anasayfanın Hakkımızda bölümünde oynatılır.
- [Bemis Kurumsal Film - 30 Yılın Hikâyesi](https://www.bemisevcharge.com.tr/kurumsal): 9 dakika 56 saniyelik kurumsal film; 1994'te Bursa'da kurulan şirketin üretim ve ihracat hikâyesi. /kurumsal sayfasında oynatılır.

## Rehberler

- [Elektrikli Arabamı Evde Nasıl Şarj Ederim? Yeni Başlayanlar İçin Şarj Aleti Rehberi](https://www.bemisevcharge.com.tr/blog/elektrikli-arabami-evde-nasil-sarj-ederim): Acemi/ilk kez alan sürücüye günlük dille ev şarjı rehberi — normal ev prizinden şarj olur mu (olur ama en yavaş/riskli), duvar tipi şarj aleti (wallbox) vs taşınabilir şarj aleti seçimi, arabaya hangi güçte (kW) cihaz uygun, "kendim takabilir miyim" (taşınabilir evet / wallbox montajı yetkili elektrikçi). Charger 2/Plus 2/Pro 2 ve Mini/Pro Mobile 2 gerçek özellikleriyle.
- [Güneş Enerjisi (Solar) ile Elektrikli Araç Şarjı](https://www.bemisevcharge.com.tr/blog/gunes-enerjisi-solar-ile-elektrikli-arac-sarji): Evde güneş panelinden EV şarjı rehberi — on-grid/öz tüketim mantığı, kaç panel/kW gerekir (varsayımsal örnek hesap), ayarlanabilir akımlı wallbox'ların (Charger Plus 2 / Pro 2) ve 6 kademe amperli Pro Mobile 2'nin solar senaryodaki avantajı, gece/bulutlu gün stratejisi.
- [Elektrikli Araç Şarj Uzatma Kablosu: Kaç mm², Hangi Konnektör, Kaç Metre?](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-uzatma-kablosu-nasil-secilir): Şarj beslemesini uzatmak için doğru ürün seçimi — kesit (16A için 2,5 mm², 32A için 6 mm²), CEE konnektör mantığı, IP44 ve IP68 koruma sınıfı farkı, uzunluk kararı; ev tipi çoklu priz ve kablo makarasının neden uygun olmadığı. Bemis seyyar uzatma kablolarının gerçek kesit/uzunluk/koruma tablosuyla.
- [Elektrikli Araç Şarj İstasyonu Yönetmeliği: Apartman, Otopark ve AVM'de Ne Zorunlu?](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-istasyonu-yonetmeligi): Şarj istasyonu mevzuatı — Otopark Yönetmeliği (RG 22.02.2018/30340, değişiklik RG 25.03.2021/31434) yeni yapı oranları (20+ otoparkta en az %5, bölge/genel otopark ve AVM'de %10, 30.000 m² üstü AVM'de 1, 70.000 m² üstü AVM'de 2 hızlı şarj), mevcut binalarda zorunluluk olmaması, ortak alanda salt çoğunluk onayı ve yapı ruhsatı muafiyeti, EPDK Şarj Hizmeti Yönetmeliği (02.04.2022) lisans şartı. Bilgilendirme amaçlıdır, hukuki görüş değildir.
- [Evde Elektrikli Araç Şarjı Güvenli mi?](https://www.bemisevcharge.com.tr/blog/evde-elektrikli-arac-sarji-guvenli-mi): Ev şarjı güvenlik rehberi — normal priz vs taşınabilir şarj vs wallbox, uzatma kablosu/çoklu priz riskleri, kaçak akım rölesi ve ayrı hat kontrolleri (yetkili elektrikçi vurgusuyla), yangın söylentileri ve gerçekler; IP65/CE ekipman kriterleri.
- [İşletmeler için DC Hızlı Şarj İstasyonu Yatırımı: Karar Rehberi](https://www.bemisevcharge.com.tr/blog/isletmeler-icin-dc-hizli-sarj-istasyonu-yatirimi): AVM, otel, restoran, otopark ve filolar için DC yatırım karar rehberi — ziyaret süresine göre AC/DC seçimi, 40-200 kW güç matrisi (işletme tipi × kalış süresi), elektrik altyapı ön kontrolü, ücretsiz-hizmet vs ücretli-şarj işletme modelleri (OCPP/RFID) ve keşiften devreye almaya kurulum süreci; BEVDC serisi gerçek spec'lerle.
- [Togg, Tesla ve Tüm Elektrikli Araçlar için Şarj Kablosu Uyumluluğu (Type 2)](https://www.bemisevcharge.com.tr/blog/hangi-sarj-kablosu-aracima-uyumlu-type-2): "Hangi şarj kablosu aracıma uyar?" sorusunun net cevabı — Türkiye/Avrupa'da satılan tüm yeni EV'ler AC şarjda Type 2 kullanır; Togg T10X ve Tesla Model 3/Y dahil marka-marka uyumluluk tablosu, Mod 2/Mod 3 farkı, monofaze 3,7-7,4 kW / trifaze 11-22 kW aileleri ve CE/IEC 62196 kontrol listesi.
- [40 kW DC Şarj İstasyonu: Hız, Kullanım ve Seçim](https://www.bemisevcharge.com.tr/blog/40-kw-dc-sarj-istasyonu): DC hızlı şarjın neden AC'den hızlı olduğu (dönüşüm istasyon içinde), 40 kW için örnek süre hesabı ve taper, AVM/otel/market/plaza/küçük filo için uygunluk, AC 22 kW vs DC 40 vs DC 80–120 kW karar tablosu ve Bemis BEVDC serisi (40–200 kW, CCS2, OCPP 1.6J/2.0.1, AC 380–480V 3 faz giriş).
- [Evde EV Şarj Maliyeti: Km Başına Kaç TL](https://www.bemisevcharge.com.tr/blog/evde-elektrikli-arac-sarj-maliyeti-km-basina): Evde şarjın km başına maliyetini kWh tüketimi, birim elektrik fiyatı, ~%10 şarj kaybı ve gece (çok zamanlı) tarifesiyle hesaplama formülü; benzinliyle kıyas için aynı yöntem. Tüm rakamlar varsayımsal; okuyucu kendi güncel fiyatını koyar.
- [Monofaze mi, Trifaze (3 Faz) mı: Evinize Hangi Şarj Cihazı](https://www.bemisevcharge.com.tr/blog/monofaze-mi-trifaze-mi-ev-sarj): Ev tipi wallbox için monofaze (~230V, ~7,4 kW) ve trifaze (~400V, 22 kW'a kadar) farkı, gece şarj süresi, evin fazını anlama ve gücü ayarlanabilir Bemis modelleriyle (Charger Plus 2 / Pro 2) doğru seçim.
- [EV Şarj Cihazı Modelleri Karşılaştırma: Hangi Model Size Uygun](https://www.bemisevcharge.com.tr/blog/ev-sarj-cihazi-modelleri-karsilastirma): AC wallbox (Charger / Plus / Pro / Pro GSM), DC hızlı şarj (BEVDC 40–200 kW) ve taşınabilir (Mini / Mono / Pro Mobile) modelleri güç, faz, konnektör ve OCPP'ye göre karşılaştıran, karar tablolu alıcı rehberi.
- [Şarj Kablosu Kaç Metre ve Kaç Amper Olmalı](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-kablosu-kac-metre-kac-amper): Elektrikli araç şarj kablosu seçimi — 16A/32A güç, monofaze 7,4 kW / trifaze 22 kW, 5–10 m ve onboard şarj limiti.
- [Ev Şarj Ünitesi mi, Taşınabilir Şarj Cihazı mı](https://www.bemisevcharge.com.tr/blog/ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi): Ev şarj ünitesi (wallbox) ile taşınabilir şarj cihazının güç, kurulum ve kullanım farkları; hangisi kime uygun.
- [Şarj Kablosu Dışarıda ve Yağmurda Kullanılır mı](https://www.bemisevcharge.com.tr/blog/elektrikli-arac-sarj-kablosu-disarida-yagmurda-kullanilir-mi): Dış mekân ve yağmurda güvenli kullanım; IP54/IP65/IP66 koruma sınıfları ve pratik güvenlik ipuçları.
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
- E-posta: satis@bemis.com.tr
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
