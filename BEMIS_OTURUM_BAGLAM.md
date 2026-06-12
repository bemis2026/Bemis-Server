# Bemis Website — Yaşayan Oturum Bağlamı (HER OTURUMDA OKU)

> **Bu dosya CLAUDE.md `@import` ile her oturumda OTOMATİK yüklenir.** Amacı: sohbet dolup
> sıfırlansa/temizlense bile yeni oturum bağlamdan KOPMADAN, halüsinasyon görmeden devam etsin.
>
> **Kural:** Anlamlı her değişiklikten sonra + sohbet dolmaya yaklaşınca bu dosyayı GÜNCELLE.
> Derin teknik bağlam: `Desktop/Claude Çalışmaları/Bemis Website/md/BEMIS_PROJECT_CONTEXT.md`
> (özellikle §15.16 denetim, §15.17 Blob taşıması).
>
> Son güncelleme: **2026-06-13**

---

## 0. ŞU AN AÇIK İŞ (önce burayı oku)

0. **⭐ ANA ODAK: SEO / Google görünürlüğü.** Teşhis yapıldı (2026-06-06): yeni site
   `bemisevcharge.com.tr` Google'da görünmez; eski `bemis.com.tr` (EV ürünleri) + bayiler
   sıralanıyor → **alan adı kanibalizasyonu**. Teknik temel iyi (128 URL sitemap, JSON-LD, meta).
   Tam plan + teşhis: **Desktop/Claude Çalışmaları/MD'ler/BEMIS_SEO_MASTER_PLAN.md** (en üstteki
   "🔴 2026-06-06 CANLI TEŞHİS" bölümü). **Bekleyen kullanıcı girdisi:** (1) GSC'ye site ekli mi?
   (2) GBP açık mı? (3) bemis.com.tr düzenlenebiliyor mu + alan adı kararı (B=301 ile yeni siteye
   otorite aktarımı önerildi).
   **GSC verisi (2026-06-06):** 48 indeksli / 80 "keşfedildi-dizine eklenmedi" (genç site/otorite) +
   3 ayda 144 gösterim, sadece marka/niş kelimeler (bemis ev charge, ioniq 5 v2l, c2l adaptör...).
   Rakip benchmark: **elektromarketim** (T-Soft mağaza) "bemis"te bile öne çıkıyor.
   **YAPILDI (hepsi canlı):** `app/blog` blog altyapısı + **7 yazı** (ioniq-5-v2l, ac-dc-sarj-farki,
   ev-icin-sarj-cihazi-nasil-secilir, togg-v2l-aractan-elektrik, ev-sarj-kablosu-secimi-type-2,
   ocpp-nedir, apartmana-sarj-istasyonu-kurulumu) · **/uretici** "Yerli Üretici" amiral sayfası
   (Service/FAQ JSON-LD) · footer'da tel+mail (alt-sağ) · **ürün sayfası** "Teklif Al" (WhatsApp,
   `content.contact.whatsappPhone`) + "Bayi Bul" (**DealerPickerModal** popup'ı → bayi web siteleri;
   şehir çipi + şehir/firma ARAMASI, SABİT çerçeve(640px)+iç-scroll; artık /#dealer'a ATMIYOR) ·
   **kategori sayfası** SSS bölümü (CMS'teki
   42 soru) + FAQPage JSON-LD. ("Benzer Ürünler" zaten vardı.) Hepsi sitemap+footer'da, Article/FAQ şemalı.
   **+ (2026-06-07):** ürün detayı CE/TÜV/TSE/RoHS çiplerine yeşil **onaylı belge rozeti** (RiVerifiedBadgeFill).
   `app/blog/press.ts` = GERÇEK/doğrulanmış dış haber-fuar verisi (Electricity Turkey, Eko Haber, EV Charge Show)
   → /blog'da **"Haberler & Fuarlar"** bölümü + anasayfa Reviews şeridi artık **2 rehber + 1 haber** (alan BÜYÜMEDEN,
   yine 3 kart). ⚠️ press.ts'e yalnızca DOĞRULANMIŞ gerçek link ekle, uydurma. (Blog listesi dev'de 2× görünür = preview artefaktı; canlı tek kopya, curl ile doğrulandı.)
   **+ (2026-06-07 ileri, CANLI):** press.ts'e Sektörüm Dergisi 3 haber daha (toplam **6**). charger-equipment
   ("Şarj Ünitesi Ekipmanları") kategori görseli placeholder'dan GERÇEK ürün görseline (Pano Prizi 32A Type2)
   çevrildi → canlı Blob `content` bin + data/content.json (`scripts/fix-charger-equipment-image.cjs`, yedekli).
   **ÖNİZLEMEDE BEKLEYEN (commit EDİLMEDİ, kullanıcı onayı bekliyor — localhost:3942):** (1) Navbar "Ürünler"
   dropdown'ında kategori GÖRSEL thumbnail'ları (`Navbar.tsx`); (2) kategori sayfası hero'su artık
   `categories[id].image` (anasayfa görseli) öncelikli (`ProductCategoryClient.tsx`). Onaylanırsa commit+push.
   **(5 + ekstralar YAPILDI, ÖNİZLEMEDE/uncommitted — kullanıcı localde inceliyor, birlikte push):** anasayfa Reviews
   sol kompakt yorum+sosyal / sağ büyük "Haberler & Basında" (Haberi Oku + Özet İncele + görsel/placeholder); haberlere
   İÇ ÖZET sayfaları `/blog/haber/[id]` (`PressArticle`, özgün `body`, "Kaynağı Oku"); blog'da Rehberler/Haberler SEKMESİ
   (#haberler hash); Blog → **Hakkımızda** menüsüne alt sayfa; kategori hero **object-contain**+küçültme (zoom yok);
   charger-equipment kart+hero **BEYAZ zemin**; 2 habere gerçek OG görseli (Electricity Turkey, Eko Haber); dropdown ÜRÜN PNG'leri.
   **Ürün tanıtım bandı "Akıllı Yönetim" — CANLI:** `ProductDetailClient` içinde SSS'den ÖNCE; `app`/`ocpp` ürünlerinde
   (10 ürün; Pro 2 telefon+web). Butonlar anasayfa `smartCharger` verisine BAĞLI: App Store + Google Play (gerçek) +
   **Web Panel** (B logosu `/favicon-white-192.png`, `ctaHref`=portal.bemis.com.tr; http değilse gizli). Mockup'lar
   `smartCharger.mockupPhoneImage/mockupWebImage`'a bağlı (görsel yüklenince anasayfayla aynı; şu an CSS).
   **BEKLEYEN İÇERİK (kullanıcıdan):** telefon/web ekran görüntüleri + iOS App Store linki (admin → İçerik → Akıllı Şarj).
   **Hero (CANLI):** tüm kategorilerde AYNI sabit KARE çerçeve (1:1, max 420px); scene `object-cover`, charger-equipment beyaz+`object-contain`.
   **Ayrıca CANLI:** ürün fiyat satırı "Liste Fiyatı"→**"Fiyat"** (görüntüde, veri değişmedi); anasayfa Reviews'a kompakt **"Rehberler"** mini-listesi (3 haber + 3 rehber).
   **FOLLOW-UP (launch engeli değil):** BlogShell + DealerPickerModal EN i18n (içerik TR olduğu için TR chrome tutarlı; tam EN = içerik çevirisi gerek). Pre-launch review workflow: link 0 / düzen 0 / regresyon 4 (2 düzeltildi, 2 i18n notlandı).
   **+ (2026-06-07 — Rehber menüsü + SSS, CANLI):** Üst menüde "Hesaplayıcı" → **"Rehber" dropdown** (alt: Hesaplayıcı `#calculator` /
   Rehberler `/blog#rehberler` / SSS `/blog#sss`). Navbar.tsx'te `isRehber` (href `#calculator` ile algılar) + `REHBER_DROPDOWN`
   (desktop+mobil). Etiket admin verisinde: content bin navbar.links "Hesaplayıcı"→**"Rehber"** / "Calculator"→"Guide"
   (`scripts/fix-navbar-rehber-label.cjs`, Blob+data/content.json, recursive walk). Blog'a **SSS sekmesi** (varsayılan Haberler;
   Rehberler / Haberler & Fuarlar / **SSS**) — tüm kategorilerin `faq`'larını toplar (admin → kategori meta `faq`'tan; 42 soru/8 kategori).
   **Admin notu:** SSS ayrı depo DEĞİL; kaynak per-kategori `faq` (admin'de düzenlenir → SSS sekmesi + ürün/kategori sayfaları otomatik yansır).
   **+ (2026-06-07 son — Hero slider + QA, CANLI):** "Rehber"e TIKLAYINCA artık `/blog#rehberler` (hesaplayıcıya değil); hover'da alt menü.
   **Hero arka plan SLIDER:** `hero.heroImages` (ContentContext + admin tip) + Hero.tsx 3sn crossfade (tek görselse statik); adminde "İlave Görseller" yükle/sil UI.
   **final-qa-scan workflow** (4 ajan: responsive **0** / light 2 / EN 6 / regresyon 1) → HEPSİ düzeltildi: tüm güncellemeler **EN-i18n** (BlogShell + DealerPickerModal + Products + ProductCategoryClient + ProductDetail tabs + Footer; sub-bileşenlere `useLanguage`, `pressLabel` helper); 2 **light** fix (Products "Yakında" badge, kategori skeleton); **BlogShell hashchange listener** (/blog'dayken Rehber menüsünden #sss/#rehberler sekmeyi değiştirir).
   **+ (2026-06-08 — anasayfa başlık tutarlılığı, CANLI · commit 78a5d44):** Tüm anasayfa bölüm **eyebrow**'ları tek standarda hizalandı:
   renk `d ? #93C5FD : #3B82F6`, `text-xs font-bold tracking-[0.18em]`, aynı chip opaklığı/kenarlık/padding. **SmartCharger** + **ProductShowcase**
   eyebrow'ları karanlık modda yanlışlıkla `#3B82F6` idi → `#93C5FD`. **B2BCta** h2 bir tık küçüktü → `text-4xl sm:text-5xl lg:text-6xl` (artık
   TÜM section h2 eşit, 36px@base). **DNA** + **SmartCharger** başlıklarındaki mavi vurgu satırı eyebrow tonuna (`d ? #93C5FD : #3B82F6`). **DealerNetwork**
   eyebrow chip bg/border dark/light varyantlı. 5 dosya/12 satır. Hem dark hem light canlı doğrulandı (tüm eyebrow tek renk, tüm h2 tek boyut).
   Kasıtlı istisna (bölüm başlığı DEĞİL): Hero "AC Şarj · 11 kW" ürün-spec rozeti (#3B82F6); ProductShowcase görsel üstündeki koyu cam karttaki etiket (#93C5FD).
   **+ (2026-06-08 — ISR Writes limiti + döküman kapağı + odak noktası, CANLI · commit 6b7eaa4/0eba64d/9e7e462):**
   **(a) ⚠️ ISR Writes (200k/ay) doluyordu — Vercel uyarı maili (geçen ay da olmuştu).** KÖK NEDEN: ürün kategori
   (`products/[id]`) + detay (`products/[id]/[productId]`) sayfaları `dynamicParams=true` + ISR (`revalidate=3600`) idi;
   bot/tarayıcı taramaları geçersiz `/products/<rastgele>` ve `/products/<x>/<y>` yollarını 200 sayfa render edip ISR
   cache'e YAZIYORDU → her benzersiz yol = 1 yazma, iki segment = sınırsız kombinasyon → 200k doldu. `revalidate=3600`
   bunu ÇÖZMEZ (her YENİ yol yine yazar). ÇÖZÜM: her iki sayfaya **`export const dynamic="force-dynamic"`** (SSR; ISR'a
   HİÇ yazmaz) + `generateStaticParams`/`revalidate`/`dynamicParams` KALDIRILDI. Canlı doğrulandı: `x-vercel-cache: MISS`
   + `cache-control: private,no-store` (eskiden STALE+Age). **⚠️ BU İKİ SAYFAYI TEKRAR ISR/revalidate'E ÇEVİRME — bot
   amplifikasyonu geri döner.** (Görünür içerik zaten client `/api/products`'tan taze; `getServerProducts` Blob hatasında
   `data/products.json` fallback'i var. Tamamlayıcı öneri: Vercel Firewall bot koruması.) ISR Writes AYLIK sıfırlanır.
   **(b) Döküman KAPAK görseli `/documents`'ta çıkmıyordu:** public `/api/documents` `revalidate=3600` cache'li ama admin
   döküman kaydı (`app/api/admin/documents` POST) `revalidatePath` ÇAĞIRMIYORDU (diğer tüm admin route'ları çağırıyor —
   unutulmuş). Kapak Blob'a (`coverUrl`, ImgBB) kaydoluyor ama public 1 saate kadar bayat liste serviste. FIX:
   `revalidatePath("/api/documents")+("/documents")` eklendi. Deploy sonrası 12 dökümandan 9'unun kapağı canlıda göründü.
   **(c) Referans Projeler — görsel ODAK NOKTASI (focal point):** adminde tıkla-odakla önizleme (public kartla aynı
   ≈3:2 + object-cover + başlık gradyanı), `imagePos` alanı (ContentContext `ReferenceProject` + admin tip), public kart
   `objectPosition=item.imagePos||"center"` → `object-cover` kırparken cihaz yarıda kalmaz. ProductShowcase deseniyle aynı.
   **+ (2026-06-08 — anasayfa içerik TAZELİĞİ / staleness, CANLI · commit 90b52c0):** Adminden Referans Projeler `imagePos`
   (odak noktası) değiştirildi ama canlıda görünmüyordu. KÖK NEDEN: anasayfa **STATİK** (`○`); `app/layout.tsx` (server)
   içeriği build/revalidate anında okuyup `ContentProvider`'a `initialContent` veriyor. Admin save'in `revalidatePath("/")`'i
   Vercel Blob **read-after-write gecikmesiyle** write propagasyonundan ÖNCE okuyup BAYAT SSR pişirebiliyor → imagePos
   "center"da takılı kaldı. **⚠️ Anasayfa `app/page.tsx` `"use client"` olduğu için tek başına `force-dynamic` YAPILAMAZ**
   (route segment config server bileşende olmalı; `layout.tsx`'e koymak TÜM siteyi dinamik yapar). ÇÖZÜM: `ContentProvider`
   client refetch'ine (`ContentContext.tsx` ~1000) **`cache:"no-store"`** → statik SSR bayat olsa bile tarayıcı TAZE
   `/api/content`'i çekip ekranı günceller. Deploy ayrıca statik anasayfayı taze Blob ile yeniden pişirdi (canlı SSR'da artık
   `54% 34%` / `49% 27%` var, doğrulandı). **GENEL DERS:** admin içerik değişikliği statik anasayfada görünmüyorsa → bu
   Blob gecikmesidir; `no-store` client refetch maskeler + yeni deploy SSR'ı tazeler. (`/api/content` zaten dinamik + MISS.)
   **+ (2026-06-09 — navbar Dökümanlar dropdown + SEO ilerleme):**
   **(a) Navbar "Dökümanlar" alt-açılır (commit 502c694):** üst menü Dökümanlar artık dropdown — yüklü dökümanlar
   (`/api/documents`) kategoriye göre gruplanır (Fiyat/Katalog/Kurulum/Sertifika/Teknik/Diğer); kategoriye tıkla →
   akordeon açılır (ilki otomatik), dökümana tıkla → `/documents/[id]`. Footer "Tüm Dökümanlar". Desktop hover +
   mobil accordion, TR/EN, veri lazy (`Navbar.tsx`: `DOC_CATEGORIES`, `loadDocs`, `isDokumanlar`, `openDocCat`).
   **(b) 🔴 SEO — `bemis.com.tr` ERİŞİMİ AÇILDI (kullanıcı):** eski sitenin üst menüsündeki "E-V Charge" linki
   YENİ siteye (`https://www.bemisevcharge.com.tr/`) bağlandı ✓. **KALAN (en kritik, B planı):** eski sitedeki EV
   sayfaları (`/sarj-cihazlari`, `/BEV-xxxx-xxxx` ~8+ ürün, `/ev-charge-dokumanlar`) Google'da hâlâ sıralanıyor →
   bunları **301** ile yeni siteye yönlendir (kanibalizasyon biter, otorite aktarılır). Eski site **Next.js** (panel/ajans
   301 destekliyor mu öğrenilecek). ⚠️ Sadece EV sayfaları; endüstriyel fiş-priz sitesine DOKUNMA. + GSC'ye yeni site
   ekle/sitemap + GBP (Bursa). Tam plan: `MD'ler/BEMIS_SEO_MASTER_PLAN.md`.
   **Kilit SEO dosyaları:** `app/blog/*`, `app/uretici/*`, `app/lib/seo.ts` (articleSchema/faqSchema/
   blogListingSchema), `app/sitemap.ts`, `Footer.tsx`, `ProductDetailClient.tsx`, `ProductCategoryClient.tsx`.
   **GBP gerçeği:** Bemis Teknik kartı VAR; aynı adreste AYRI "Bemis E-V Charge" kartı Google yinelenen
   sayıyor → Teknik kartını EV için kullan (kategori+foto+açıklama). **Mail:** bemisevcharge.com.tr'de MX YOK;
   Google Workspace'e alan-adı-alias ile `info@bemisevcharge.com.tr` açılacak (hafta içi). Merchant+Ads kuruldu
   (feed.xml hazır ama EUR fiyat + sepet olmadan tam çalışmaz). 
   **Sıradaki sen-işi:** GSC'de yeni sayfalara "dizine eklenmesini iste" + GBP doldur + ürün açıklamaları(TL).
   **Sıradaki ben-işi (opsiyon):** şehir sayfaları, daha çok blog. İkinci hedef: e-ticaret (ödeme sağlayıcı + TL fiyat gelince).
   **+ (2026-06-13 — /uretici zenginleştirme + Stats duplikasyon temizliği, CANLI · commit 17003d7):**
   Kullanıcı: anasayfa Stats'taki "32 yıllık miras" bloğu üst bölüm/DNA ile NEREDEYSE AYNI içerikti (duplikasyon) +
   mavi bandda mavi eyebrow okunmuyordu. **ÇÖZÜM:** (1) **Stats**'tan miras bloğu KALDIRILDI (sadece istatistik grid
   kaldı; `Link`+`RiArrowRightLine` importları da temizlendi). (2) Miras anlatısı zaten **/kurumsal** (1994 tarihçe,
   marka, fabrika, video) + **/uretici** amiral sayfasında var → tekrar bitti. (3) ⚠️ Stats bloğu anasayfanın TEK
   taranabilir (`<a>`) /uretici linkiydi (footer "Yerli Üretim" `<button>`=taranmaz) → SEO kaybı olmasın diye **DNA**
   (Hakkımızda) "Bemis Dünyasını Keşfet" butonunun yanına GERÇEK `<a href="/uretici">` "Yerli Üretici Hikayemiz" linki
   eklendi (anasayfa→/uretici iç link korundu, canlı doğrulandı: anasayfada 1 adet). (4) **/kurumsal** hero'suna
   "Yerli Üretici Hikayemiz" → /uretici butonu. (5) **/uretici** geliştirmeleri: hero'dan sonra **fabrika görseli**
   (`dna.factoryImage` — /kurumsal ile AYNI kaynak, 16:7 büyük çerçeve, `priority`/LCP) + **bemis.com.tr** linki &
   32 yıllık Bemis Teknik mirası alıntısı; alttaki **"OEM Çözümleri" CTA bölümü kaldırıldı** (hero'daki OEM butonu +
   /b2b duruyor); **SSS basınca-açılır AKORDEON** (`openFaq` state, tek-açık, HiChevronDown, AnimatePresence; ilki açık);
   en alta **"Bemis Basında & Haberler"** minik 4'lü şerit (`allPress()`, type≠social). Build ○ static geçti; canlı
   /uretici+/kurumsal+anasayfa doğrulandı. Değişen: `Stats.tsx`, `DNA.tsx`, `kurumsal/page.tsx`, `uretici/UreticiClient.tsx`.
   **+ (2026-06-13 ileri — /uretici canlı animasyon + /kurumsal sadeleştirme + Hakkımızda menü, CANLI · commit 293bbd9):**
   Kullanıcı: /uretici "soğuk/hareketsiz"; /kurumsal'dan 2 bölüm kaldır; /uretici'yi üst menüye ekle. **5-ajan analiz
   workflow** (site animasyon dili + /uretici cold-spot + navbar yapısı + /kurumsal sınırlar → animasyon spec) sonra
   uygulandı: **(a) /kurumsal**'dan "Üretim Süreci" + "Değerlerimiz/Teknoloji/Sertifikalar" bölümleri KALDIRILDI (timeline +
   hero + video + grup markaları KALDI); kullanılmayan 12 ikon importu + 16 const temizlendi (197 satır; `node` scriptiyle
   güvenlik-kontrollü silme). **(b) Navbar** `HAKKIMIZDA_DROPDOWN` HARDCODED (CMS değil) → "Yerli Üretim → /uretici"
   eklendi (desktop+mobil otomatik; accent #DC0E1A); /kurumsal alt-metni güncellendi. **(c) /uretici** site animasyon
   diline hizalandı — TÜM bölümler `whileInView` scroll-reveal (`viewport={{once:true,margin:"-60px"}}`, sayfa-içi tek
   desen; useInView DEĞİL), stagger `0.1+i*0.07`, kart hover `whileHover y:-4` + JS border/box-shadow glow (FeaturedProducts
   deseni), başlık altı accent çizgiler (tek varyant A), fabrika görseline çok yavaş **Ken Burns** (16sn scale 1→1.06),
   eyebrow **nabız noktası**, CERTS çipleri **backOut pop** stagger, hero dekoratif blob, FAQ ok rotate framer'a taşındı,
   **`prefers-reduced-motion`** (Ken Burns + nabız kısılır). Çekişmeli inceleme (1 ajan): motion çakışması/Ken Burns/
   whileInView görünmezlik/paylaşılan accentLine/TS/perf HEPSİ temiz; tek minör fix = eyebrow nabız span'ına `aria-hidden`
   (eklendi). Build ○ static; canlı doğrulandı. Değişen: `Navbar.tsx`, `kurumsal/page.tsx`, `uretici/UreticiClient.tsx`.
   ⚠️ /uretici artık TEK animasyon deseni kullanıyor (whileInView); değiştirirken useInView ile KARIŞTIRMA.
   **+ (2026-06-13 son — Footer ölü link temizliği, CANLI):** Kullanıcı: footer'da basınca en üste (hero'ya) atan
   ölü kelimeler. KÖK NEDEN: `#contact` (Contact.tsx) ve `#technology` (Technology.tsx) bileşenleri VAR ama anasayfada
   RENDER EDİLMİYOR (`SECTION_COMPONENTS` map'inde yok) → o hash linkleri hedefsiz, alt sayfadan tıklayınca home'a gidip
   hero'da kalıyordu. FIX (`Footer.tsx` NAV_GROUPS tr+en + alt bar): Şirket → Teknoloji/Kalite&Belgeler(#technology)/Kariyer
   kaldırıldı, "Bemis Dünyası→/kurumsal" eklendi (5 dolu link). Destek → İletişim/Teknik Destek/Garanti/KVKK (#contact)
   kaldırıldı; Dökümanlar, Kalite&Belgeler→**/documents**, SSS→**/blog#sss**, Rehberler→**/blog#rehberler**,
   Hesaplayıcı→#calculator (5 dolu). Alt bar → ölü "Gizlilik Politikası"+"GDPR/KVKK" (onClick yok) butonları kaldırıldı;
   telefon+e-posta+OEM/B2B kaldı. ⚠️ Gerçek hedefi olmayan link EKLEME: anasayfada render edilen section id'leri =
   #dna/#stats/#products/#dealer/#calculator/#dealer-export/#hero; #contact + #technology YOK. KVKK/İletişim sayfası yok
   (gerekirse ileride eklenebilir; iletişim şu an footer alt barda tel+mail). Değişen: `Footer.tsx`.

1. **[KULLANICI] Admin kayıt testi** — Vercel'den `ADMIN_PASSWORD` ayarla → `/admin` giriş →
   bir ürünü değiştir → Kaydet → yenile → durdu mu? **Blob'a yazmanın uygulama üzerinden son
   kanıtı.** Hata verirse Vercel'de `BLOB_READ_WRITE_TOKEN` env'inin deploy'da olduğunu kontrol et.
2. **[KULLANICI] Katalog veri girişi** — EAN/desi/uzun açıklama değerleri (alanlar hazır; uydurulamaz).
3. **[ERTELENDİ] hreflang `/en/`** — ayrı indekslenebilir EN URL; görünür+riskli → ayrı oturum.
4. **[GÜVENLİK] temizlik** — GitHub'daki eski `JSONBIN_MASTER_KEY` secret'ını sil; (ops.) Blob token + JSONBin key yenile (transcript'te geçti).

---

## 1. HIZLI DURUM

- **Site:** https://www.bemisevcharge.com.tr · Next.js **16.2.6** · Vercel (Hobby) · repo `bemis2026/Bemis-Server`
- **VERİ KATMANI = VERCEL BLOB** (JSONBin TERK EDİLDİ — kotası doldu). `bins/<name>.json` private bloblar.
- Her şey CANLI: 113 ürün/112 görsel, 8 kategori, 32 bayi (14 şehir), içerik, b2b, dökümanlar.
- Şirket: Bemis Teknik Elektrik A.Ş. (Bursa, 1994). 4 domain canlı. Yerel: `C:\Users\sales\bemis-evcharge-website`.

---

## 2. ⚠️ EN KRİTİK: JSONBin → Vercel Blob (2026-06-01)

**Olay:** JSONBin ücretsiz katman aylık 10.000 istek kotası doldu (403 "Requests exhausted",
-12.192). Sebep: Opus 4.8 denetiminin canlı API'yi ağır dövmesi + her deploy'un ISR cache'ini
temizlemesi → public route'lar veriyi okuyamayıp eski `data/*.json` yedeğine düştü → site "7 Mayıs'a
döndü", görseller/bayiler kaybolmuş **gibi göründü** (veri JSONBin'de duruyordu). Ödeme TR/PayPal
sorunuyla yapılamadı → **Blob'a taşındı.**

**Yeni mimari (KALICI):**
- **`lib/store.ts`** — Blob adaptörü. `readBin(name)`/`writeBin(name,body)` AYNI imza. Her bin →
  private blob `bins/<name>.json`. Okuma `get(path,{access:'private'})`+stream→json; yazma
  `put(... access:'private', allowOverwrite:true)`.
- **`lib/jsonbin.ts`** = sadece `export { readBin, writeBin } from "./store"` (16 dosya buradan import eder).
- **`data/*.json`** = offline güvenlik ağı (Blob okunamazsa düşülür); güncel veriyle dolu (messages HARİÇ=PII).
- **`scripts/seed-blob.cjs`** — export'tan Blob'a tek seferlik tohum (tekrar gerekirse).
- **Env:** `BLOB_READ_WRITE_TOKEN` (Vercel store bağlı=otomatik + GitHub Actions secret).
- **Cron** `scripts/daily-monitors.cjs` + workflow Blob'a çevrildi; "bin-size" kontrolü kaldırıldı; CI'da doğrulandı.
- **Blob store:** `bemis-server-blob` / `store_ubSbVntTdlX6d9lJ`.
- **Bin'ler:** b2b, content, dealers, products, productsExtra, productsEn, productsEnExtra, documents, messages, changelog.
- **JSONBin hesabı/verisi SİLİNMEDİ** (ek yedek). Eski bin ID'leri + master key artık kullanılmıyor.

---

## 3. Bu Oturumun Hikayesi (kronolojik)

1. Küçük işler: `+KDV→+Tax` (EN dil-kapısı), navbar **"Projeler"** kaldırma (mergeContent enjeksiyon→filtre).
2. **Opus 4.8 denetimi** (2 workflow, 45 ajan): çekişmeli doğrulama 6 yanlış-alarmı çürüttü; gerçek
   bulgular: admin auth bypass, Next CVE, 127/128 görsel, SEO canonical, a11y.
3. **Güvenlik:** `lib/adminAuth.ts` HMAC token (13 route), Next 16.2.6 (8 HIGH CVE), R2 allow-list, contact escape.
4. **SEO/i18n:** 6 self-canonical (5 layout.tsx + /products meta), dinamik `<html lang>`, /documents i18n, 14 string lang-gate.
5. **a11y:** form label bağlama, `lib/useFocusTrap.ts` (3 modal), harita klavye, kontrast 0.28→0.62/0.70.
6. **JSONBin krizi → Blob taşıması** (§2) — en büyük iş.
7. Cron Blob'a + CI doğrulama.
8. **B2B portal favicon** (ayrı proje bemis-b2b): default→Bemis B; kullanıcı push'uyla deploy, canlı OK.
9. **Katalog:** admin'e EAN/barkod + desi alanları; feed.xml EAN→`g:gtin`.
10. **Denetim backlog (#5):** IP44/IP66 varyant çip ayrımı, features çift-gösterim guard, admin fiyat
    tespiti (`fiyat|price`), boxContents EN çeviri. (mergeContent sığ-merge **gerekçeyle atlandı**.)

---

## 3b. Oturum 2 (2026-06-06) — UI cilası + dökümanlar (hepsi canlı + doğrulandı)

1. **Video:** anasayfa DNA + /kurumsal videolarına sağ-alt ses aç/kapa tuşu (varsayılan sessiz).
   `app/components/useBackgroundVideo.ts` hook'u: poster yalnız video gerçekten PLAYING olunca
   açılır + sekme değişince geri kapanır → YouTube oynatıcı/splash hiç görünmez.
2. **/kurumsal "Bemis Grup Markaları":** parent (Bemis) logosunun altına da isim eklendi (text-sm).
3. **Ürün kategori hero:** yan görsel kaldırıldı → `descriptionImage` artık başlık+açıklamanın
   ARKASINA tam-genişlik hero arka planı (admin etiketi "Hero Arka Plan Görseli").
4. **Bayi:** "Haritada Aç" artık mapUrl harita değilse adresten Google Maps üretir. **VERİ DÜZELTME:**
   27 bayinin `mapUrl`'ine yanlış girilmiş web siteleri `website` alanına taşındı, mapUrl temizlendi
   (Blob + data/dealers.json senkron). `scripts/fix-dealer-mapurl.cjs`.
5. **Hero "Üreticisi" (headline3):** aydınlık modda da karanlıktaki parlak mavi gradyan (#93C5FD→#3B82F6).
   → **(2026-06-07 REVİZE)** light artık DERİN mavi `#3B82F6→#1E40AF` + `drop-shadow` ayrımı; #93C5FD
   açık hero görselinin parlak bölgelerinde soluyordu. Dark AYNEN (#93C5FD→#3B82F6). `headline3Gradient`/`headline3Filter` Hero.tsx.
6. **Navbar:** açık modda ANA SAYFA tepesinde (şeffaf, koyu hero üstünde) ön plan artık BEYAZ;
   kaydırınca SİYAH. `lightTop = pathname==="/" && !dark && !scrolled`. Diğer sayfalar + karanlık mod aynen.
7. **Dökümanlar PDF (ÖNEMLİ mimari):** Cloudinary/R2 URL'ini doğrudan iframe'e vermek CSP/cross-origin/
   R2/mobil yüzünden TÜM PDF'lerde "açılmıyor/inmiyor"a yol açıyordu. Çözüm: **same-origin vekil**
   `app/api/documents/file?id=...` (inline önizleme, `&dl=1` indirme) — dosyayı SUNUCUDA çekip KENDİ
   alan adımızdan akıtır; host allow-list ile SSRF yok. Viewer artık bu vekil URL'leri kullanıyor.
   Ayrıca `next.config.ts` CSP frame-src/connect-src'e `res.cloudinary.com` + `*.r2.dev` eklendi.

**Yeni kilit dosyalar:** `app/components/useBackgroundVideo.ts` · `app/api/documents/file/route.ts` ·
`scripts/fix-dealer-mapurl.cjs`. **Değişen:** `next.config.ts` (CSP), `app/components/Navbar.tsx`,
`Hero.tsx`, `DNA.tsx`, `kurumsal/page.tsx`, `products/[id]/ProductCategoryClient.tsx`, `documents/[id]/page.tsx`.

---

## 4. Önemli Commit'ler (hepsi `main`'de canlı)

`ce23935` güvenlik · `61b4428` SEO+i18n · `aff6494` navbar+Sentry · `880a25e`/`d4d31ab` a11y ·
`e837bf1` jsonbin circuit-breaker *(sonra Blob)* · `c06c570` data/*.json kurtarma ·
`0411569` Blob adaptör+seed · **`d27c545` JSONBin→Blob** · `6ce923b` cron Blob ·
`405099b` katalog EAN/desi+feed · `68fe598` denetim backlog.

**Kilit dosyalar:** `lib/store.ts` · `lib/jsonbin.ts` · `lib/adminAuth.ts` · `lib/useFocusTrap.ts` ·
`scripts/seed-blob.cjs` · `app/api/admin/*` (verifyAdminSession) · `data/*.json` · `app/feed.xml/route.ts`.

---

## 5. Kullanıcı Tercihleri (UNUTMA)

- **Görünür (TR) ekranı değiştirme** elzem değilse; gerekiyorsa **basitçe sor.** Teknik işlerde güveniyor.
- Türkçe, non-teknik, net+sade açıklama ister.
- Deploy'lar sağlıklı geçmeli; commit/push genelde serbest.
- "Profil"=cwd, "Proje"=Desktop/Claude Çalışmaları/<ad>.
- "Mevcut Bemis projelerine dokunma" kuralı YALNIZ Sanal Satış işi sırasında geçerli (şu an değil).

---

## 6. Otomasyon (bu dosya nasıl yaşıyor)

- **Auto-yükleme:** Bu dosya proje kökünde; `CLAUDE.md` içinde `@BEMIS_OTURUM_BAGLAM.md` ile
  **her oturumda otomatik bağlama girer** (bemis-b2b ile aynı desen). Temizlik/compact sonrası da yüklenir.
- **Auto-güncelleme:** Claude anlamlı milestone'larda + bağlam dolarken bu dosyayı GÜNCELLER (standing kural,
  bu başlıkta + CLAUDE.md'de yazılı). Claude Code ayrıca bağlam dolunca otomatik compact eder (yerleşik).
- **MEMORY.md**'de ⭐ kayıt bu dosyayı işaret eder (her oturum yüklenen auto-memory).
- **PreCompact hook** (global `~/.claude/settings.json`): her compact (auto+manual) ÖNCESİ transcript'i
  `C:\Users\sales\.claude\backups\transcript-<tarih>.jsonl`'e otomatik yedekler. **2026-06-02'de test edildi, çalışıyor** (11.7MB yedek alındı).
- **SessionStart hook** (matcher `compact|clear`): temizlik/compact sonrası "çalıştığın projenin
  BEMIS_OTURUM_BAGLAM.md'sini oku" hatırlatması basar (proje-bağımsız).
