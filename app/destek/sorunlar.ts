/**
 * /destek ARIZA VERİSİ — TEK KAYNAK.
 *
 * ⚠️⚠️ NEDEN AYRI DOSYA: veri eskiden `DestekClient.tsx` içindeydi; sayfa onu
 * render ediyordu ama `page.tsx`'teki ŞEMA ayrı yazılmış metinlerden besleniyordu
 * (dosyada "Cevaplar sayfadaki metinle AYNI olmalı" uyarısı bunun izidir). Google
 * kuralı: şemadaki içerik sayfada GÖRÜNÜR olmalı — iki kopya zamanla ayrışır.
 * Artık hem görünür bölüm hem `HowTo` şeması BURADAN besleniyor.
 * (Aynı "ayrışan ikiz" kusuru bu oturumda üç kez çıktı: InternationalGlobe/Map2D,
 *  featured çevirileri, varyant gruplaması.)
 *
 * ⚠️ İKON BURADA YOK: ikon JSX'tir, sunucu şema tarafına sızmasın diye
 *    `DestekClient` içinde `id` üzerinden eşlenir.
 * ⚠️ /destek TR-ONLY bir rota (canonical + hreflang yalnız tr) → pickText yok.
 */

export type Sorun = {
  /** kararlı kimlik — ikon eşlemesi + ayırıcı tanı bağları bunu kullanır */
  id: string;
  baslik: string;
  belirti: string;
  adimlar: string[];
};

export const SORUNLAR: Sorun[] = [
  {
    id: "calismiyor",
    baslik: "Cihaz hiç çalışmıyor, ışık yanmıyor",
    belirti: "Ekran/LED tamamen sönük.",
    adimlar: [
      "Elektrik panonuzdaki cihaza ait sigortanın açık olduğunu kontrol edin.",
      "Kaçak akım rölesi (RCD) atmışsa, tekrar atıyorsa cihazı kullanmayın — yetkili elektrikçi çağırın.",
      "Taşınabilir cihazlarda prizde elektrik olduğunu başka bir cihazla doğrulayın.",
    ],
  },
  {
    id: "baslamiyor",
    baslik: "Cihaz çalışıyor ama şarj başlamıyor",
    belirti: "Işık yanıyor, araç şarja geçmiyor.",
    adimlar: [
      "Soketi araca tam oturana kadar itin; klik sesini duymalısınız.",
      "Aracın şarj zamanlayıcısı/gecikmeli şarj ayarı açık olabilir — araç ekranından kontrol edin.",
      "Aracı kilitleyip tekrar açmayı ve kabloyu yeniden takmayı deneyin.",
    ],
  },
  {
    id: "yavas",
    baslik: "Şarj beklediğimden yavaş",
    belirti: "22 kW cihazda düşük güçle şarj oluyor.",
    adimlar: [
      "Şarj hızını cihaz DEĞİL, aracınızın dahili AC şarj ünitesi belirler; aracınız 7,4 kW ile sınırlıysa 22 kW cihazda da 7,4 kW alır.",
      "Tesisatınız tek fazlıysa üç fazlı cihaz da tek faz güç verir.",
      "Çok soğuk havada ve batarya doluluk oranı yüksekken araç şarj hızını kendisi düşürür.",
    ],
  },
  {
    id: "kablo-cikmiyor",
    baslik: "Kablo araçtan çıkmıyor",
    belirti: "Soket araca kilitli kaldı.",
    adimlar: [
      "Şarjı önce araç ekranından veya uygulamadan sonlandırın.",
      "Aracın kapılarının kilidini açın — çoğu araç kilitliyken soketi bırakmaz.",
      "Aracınızın el kitabındaki acil kablo kurtarma kolunu kullanın.",
    ],
  },
  {
    id: "kendiliginden-duruyor",
    baslik: "Şarj sırasında kendiliğinden duruyor",
    belirti: "Şarj başlıyor ama bir süre sonra kesiliyor.",
    adimlar: [
      "Aracın şarj limiti (ör. %80) dolmuş olabilir — araç ekranından kontrol edin.",
      "Soketin araca tam oturduğundan ve kablonun gergin durmadığından emin olun.",
      "Kaçak akım rölesi atıyorsa sorun tesisat tarafında olabilir; yetkili elektrikçiye başvurun.",
      "Çok sıcak ortamlarda araç ve cihaz koruma amacıyla gücü düşürebilir veya şarjı duraklatabilir.",
    ],
  },
  {
    id: "uygulama-gormuyor",
    baslik: "Uygulama cihazı göremiyor",
    belirti: "Uygulama destekli modellerde cihaz çevrimdışı görünüyor.",
    adimlar: [
      "Cihazın bağlandığı WiFi ağının kapsama alanında olduğundan emin olun; modemi yeniden başlatmayı deneyin.",
      "Uygulamadan çıkıp tekrar giriş yapın ve cihazı yeniden ekleyin.",
      "GSM'li modellerde bulunduğunuz noktada operatör sinyalinin zayıf olması bağlantıyı etkiler.",
      "Cihaz şarj işlevini uygulamadan bağımsız sürdürür; şarj devam ediyorsa acil bir arıza yoktur.",
    ],
  },
];

/**
 * AYIRICI TANI — "bu belirti hangi belirtiyle karışır ve nasıl ayırt edilir".
 *
 * ⚠️ NEDEN VAR: kullanıcı yanlış tabloya bakıp yanlış adımı uyguluyor (ör. araç
 * kaynaklı güç sınırını "cihaz arızası" sanıp servis çağırıyor). Tablo aynı
 * zamanda sayfalar arası İÇ LİNK AĞI kurar — her satır ilgili derin sayfaya gider.
 * 📌 `ayirt` alanı KARAR KURALIDIR: tek bakışta hangi sütuna geçeceğini söyler.
 * 📌 `href` yalnız SİTEDE VAR OLAN adresler; uydurma slug yazma (kayıtlı kural).
 */
export type AyiriciTani = {
  /** hangi sorunun satırı */
  id: string;
  /** karışabildiği sorun/durum */
  karisir: string;
  /** ayırt etme kuralı */
  ayirt: string;
  /** derinlemesine okuma */
  link?: { label: string; href: string };
};

export const AYIRICI_TANI: AyiriciTani[] = [
  {
    id: "calismiyor",
    karisir: "Cihaz çalışıyor ama şarj başlamıyor",
    ayirt: "LED/ekran TAMAMEN sönükse besleme sorunudur (sigorta/RCD/priz). Işık yanıyorsa besleme vardır, sorun araç–cihaz el sıkışmasındadır.",
  },
  {
    id: "baslamiyor",
    karisir: "Araç tarafındaki zamanlayıcı ayarı",
    ayirt: "Araç ekranında \"gecikmeli/zamanlanmış şarj\" açıksa cihaz hazır bekler — bu arıza değildir. Ayarı kapatıp yeniden takın.",
  },
  {
    id: "yavas",
    karisir: "Araç kaynaklı güç sınırı (ARIZA DEĞİL)",
    ayirt: "Aracın dahili AC şarj ünitesi 7,4 kW ise 22 kW cihazda da 7,4 kW alırsınız. Aracınızın AC şarj gücüne bakın; cihazı suçlamadan önce bu sınırı doğrulayın.",
    link: { label: "Monofaze mi, trifaze mi?", href: "/blog/monofaze-mi-trifaze-mi-ev-sarj" },
  },
  {
    id: "yavas",
    karisir: "Taşınabilir cihazda düşük amper kademesi",
    ayirt: "Taşınabilir cihazda akım kademesi düşük seçilmişse güç de düşer. Kademeyi cihazdan veya uygulamadan kontrol edin — bu bir ayardır, arıza değil.",
    link: { label: "Taşınabilir şarj cihazında amper ayarı", href: "/blog/tasinabilir-sarj-cihazinda-amper-ayari" },
  },
  {
    id: "yavas",
    karisir: "Uzun/ince hat üzerinde gerilim düşümü",
    ayirt: "Uzatma hattı devredeyse aynı akımda daha az güç alırsınız ve kablo ısınır. Hattı kısaltın veya kesiti büyütün; ısınma varsa akımı bir kademe düşürün.",
    link: { label: "Evden kablo uzatarak şarj etme", href: "/blog/evden-kablo-uzatarak-elektrikli-araba-sarj-etme" },
  },
  {
    id: "yavas",
    karisir: "Beklentinin kendisi yanlış olabilir",
    ayirt: "Aracınızın batarya kapasitesi ve dahili AC şarj gücüyle sürenin ne kadar olması GEREKTİĞİNİ hesaplayın. Gerçek süre hesapla uyuyorsa arıza yoktur.",
    link: { label: "Şarj süresi hesaplama", href: "/sarj-suresi-hesaplama" },
  },
  {
    id: "kendiliginden-duruyor",
    karisir: "Şarj beklediğimden yavaş",
    ayirt: "Güç SÜREKLİ düşükse \"yavaş şarj\" satırına bakın. Şarj başlayıp KESİLİYORSA bu ayrı bir durumdur: araç limiti, soket teması veya RCD.",
  },
  {
    id: "kendiliginden-duruyor",
    karisir: "Kaçak akım rölesinin atması",
    ayirt: "Kesinti sırasında panodaki RCD de attıysa sorun cihazda değil tesisattadır. RCD tekrar atıyorsa cihazı kullanmayı bırakın ve yetkili elektrikçiye başvurun.",
    link: { label: "Evde şarj güvenli mi? Priz, sigorta, kaçak akım", href: "/blog/evde-elektrikli-arac-sarji-guvenli-mi" },
  },
  {
    id: "kablo-cikmiyor",
    karisir: "Şarj oturumu hâlâ sürüyor",
    ayirt: "Kilit, şarj sonlanmadan açılmaz. Önce araç ekranından/uygulamadan şarjı bitirin; ancak sonra soketi çekin. Zorlamak kilit mekanizmasına zarar verir.",
  },
  {
    id: "uygulama-gormuyor",
    karisir: "Cihaz hiç çalışmıyor",
    ayirt: "Cihazda ışık varsa ve şarj olabiliyorsa sorun YALNIZ bağlantıdadır; şarj işlevi uygulamadan bağımsız çalışır. Işık da yoksa besleme satırına geçin.",
  },
];

/**
 * TAŞINABİLİR CİHAZ IŞIK DURUMLARI.
 *
 * ⚠️ KAYNAK: "Elektrikli Araç Mobil Şarj Cihazları Kurulum ve Kullanım Kılavuzu"
 *    (site dökümanı `doc-1779265535780`, s. 2-4 "IŞIK FONKSİYONLARI").
 *    Mini / Mono / Pro Mobile'da ışık şeması AYNI — kılavuzda üç modelde de
 *    birebir aynı tablo veriliyor (okundu, varsayım değil).
 * 📌 Bu tablo KILAVUZDAN alındı; uydurulmadı. Kılavuz değişirse burayı güncelle.
 */
export type IsikDurumu = { isik: string; renk: string; anlam: string };

export const ISIK_DURUMLARI: IsikDurumu[] = [
  { isik: "POWER", renk: "Beyaz", anlam: "Cihaz şebekeye bağlı, enerji var. Bu ışık yanmıyorsa sorun beslemededir: priz, sigorta veya kaçak akım rölesi." },
  { isik: "CHARGING", renk: "Yeşil (yanıp sönen)", anlam: "Şarj başladı ve sürüyor. Yanıp sönme normaldir — arıza belirtisi değildir." },
  { isik: "CHARGER STATUS", renk: "Kırmızı", anlam: "YALNIZ arıza durumunda yanar. Kırmızı yanıyorsa cihazı kullanmayı bırakın ve yetkili servise başvurun." },
];

/**
 * DC ŞARJ İSTASYONU EKRAN MESAJLARI (halka açık / işletme istasyonları).
 *
 * ⚠️ KAYNAK: "Bemis E-V Charge DC Şarj Cihazı Kullanıcı El Kitabı" (site dökümanı
 *    `doc-1783940147818`), **bölüm 8: "Araç Şarj Sistemi Hataları ve Kullanıcı
 *    Tarafından Yapılacak İşlemler"**, s. 19-21. Okundu; mesaj metinleri kılavuzdaki
 *    EKRAN YAZISIYLA birebir.
 * ⚠️ BUNLAR DC İSTASYON MESAJIDIR — ev tipi AC wallbox veya taşınabilir cihazda
 *    bu ekranlar YOKTUR. Sayfada ayrı başlık altında, DC olduğu yazılarak verilir;
 *    yoksa ev kullanıcısı kendi cihazında arıyor ve bulamıyor.
 * 📌 SAYISAL HATA KODU (E01/F02 gibi) bu cihazlarda YOK — kılavuz durum mesajı
 *    gösteriyor. "Hata kodu" diye kod uydurmayın.
 */
export type EkranMesaji = { mesaj: string; anlam: string; neYapmali: string };

export const DC_EKRAN_MESAJLARI: EkranMesaji[] = [
  {
    mesaj: "Acil Durdur Butonu Basılı!",
    anlam: "İstasyonun üzerindeki acil durdurma butonu basılı konumda; bu hâlde yeni şarj başlatılamaz.",
    neYapmali: "Butonu çekip normal konumuna getirin. Cihaz yeni şarj başlatmaya hazır duruma döner.",
  },
  {
    mesaj: "Araçla Haberleşme Koptu!",
    anlam: "Şarj başlatma sırasında araç ile istasyon arasındaki haberleşmede sorun oluştu.",
    neYapmali: "Ekran 5 saniye sonra başlangıç durumuna döner. Soketi çıkarıp tekrar takın ve yeniden başlatmayı deneyin.",
  },
  {
    mesaj: "Otorizasyon Sağlanmadı!",
    anlam: "Şarj başlatma isteği sunucu tarafından onaylanmadı.",
    neYapmali: "Mobil uygulamadan başlattıysanız uygulamada kayıtlı bir kart olup olmadığını, RFID kartla başlattıysanız o kartın uygulamada kayıtlı olduğunu kontrol edin. Sorun görünmüyorsa istasyonun servis sağlayıcısına başvurun.",
  },
  {
    mesaj: "Uygun Değil",
    anlam: "Soket, sunucu yöneticisi tarafından devre dışı bırakılmış.",
    neYapmali: "Servis sağlayıcısıyla iletişime geçip soketlerin etkinleştirilmesini isteyin veya devre dışı olma sebebini öğrenin.",
  },
  {
    mesaj: "Ekran değişmiyor / bağlantı simgesi kırmızı",
    anlam: "İnternet veya sunucu haberleşmesi yok. Bağlantı simgesinin yanında yıldırım işareti ve OCPP yazısı görünmüyorsa sunucuya bağlantı kopmuş; simge kırmızıysa cihazda internet yok.",
    neYapmali: "Şarj başlatma isteği gönderildiği hâlde ekran değişmiyorsa servis sağlayıcısına bildirin — sorun istasyonun bağlantısındadır, aracınızda değil.",
  },
];

/**
 * SERVİS ÇAĞIRMADAN ÖNCE — DC el kitabındaki kontrol listesi (s. 22).
 * ⚠️ Kılavuzdan; sırası korunmuştur.
 */
export const SERVIS_ONCESI: string[] = [
  "Sigortaların ON konumunda olup olmadığını kontrol edin.",
  "Yukarıdaki adımlarda tarif edilen işlemleri uygulayın.",
  "Uyarılar menüsünden uyarı listesini ve uyarı raporlarını not alın.",
  "Bu bilgi ve notları teknik servise iletin.",
  "Teknik servis sizi gerektiği gibi yönlendirecek ya da kendisi müdahale edecektir.",
];
