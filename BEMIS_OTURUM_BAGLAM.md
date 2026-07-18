# Bemis Website — Yaşayan Oturum Bağlamı (HER OTURUMDA OKU)

> **Bu dosya CLAUDE.md `@import` ile her oturumda OTOMATİK yüklenir.** Amacı: sohbet dolup
> sıfırlansa/temizlense bile yeni oturum bağlamdan KOPMADAN, halüsinasyon görmeden devam etsin.
>
> **Kural:** Anlamlı her değişiklikten sonra + sohbet dolmaya yaklaşınca bu dosyayı GÜNCELLE.
> Derin teknik bağlam: `Desktop/Claude Çalışmaları/Bemis Website/md/BEMIS_PROJECT_CONTEXT.md`
> (özellikle §15.16 denetim, §15.17 Blob taşıması).
>
> Son güncelleme: **2026-07-03**

---

## 0. ŞU AN AÇIK İŞ (önce burayı oku)

> 🤖✅ **GÜNLÜK SİTE-SAĞLIK / VERİ-BÜTÜNLÜĞÜ BEKÇİSİ KURULDU + seo-sentinel KALICILAŞTI (2026-07-16):** Kullanıcı "bu sistem için loop ihtiyacımız var mı değerlendir, varsa hazırla" dedi. **DEĞERLENDİRME:** 5 otonom zamanlanmış görev zaten vardı (haftalık site/SEO + aylık rakip/AI-arama/haber/blog) → SEO/GEO/içerik iyi kaplı. **⚠️ NOT: `/loop` (sohbet-içi) canlı site izlemede İŞE YARAMAZ** (yalnız sohbet açıkken çalışır); doğru mekanizma = otonom cron görevi. **BULUNAN 2 GERÇEK BOŞLUK:** (1) **sessiz veri kaybının hızlı tespiti YOK** — haftalık görev meta/şema bakar, "kaç ürün/bayi/döküman var" saymaz → dökümanların 12→3 sessiz düşüşü (2026-07-13) yakalanamazdı; (2) haftalık görevin çağırdığı **`seo-sentinel.cjs` kalıcı diskte yoktu** (geçici scratchpad'deydi; baseline vardı, script yoktu → adım-0 boşa düşüyordu). **YAPILAN (kullanıcı "tam paket" seçti):** **(a)** `Desktop\Bemis_Raporlar\site-sentinel.cjs` (yeni, deterministik, harici paket yok) — 5 kritik sayfa uptime + `/api/products`(kat/ürün)·`/api/dealers`(şehir/bayi)·`/api/documents`·`/api/content`·`/api/b2b` sayımlarını `site-baseline.json` ile kıyaslar. **Ratchet mantığı: sayım YALNIZ yukarı çıkar, her DÜŞÜŞ = 🔴 alarm; alarm varken baseline DONDURULUR (maskeleme yok); meşru düşüşte elle `--rebaseline`.** Yapı-toleranslı (⚠️ `/api/documents` ÇIPLAK DİZİ — yapı tanınamazsa "0'a düştü" değil 🟡 uyarı verir; bu tuzağa 2026-07-15'te bizzat düşülmüştü). **Baseline tohumu (canlı doğrulandı):** 8 kat / 113 ürün / 14 şehir / 33 bayi / 14 döküman + content(23)/b2b(8) bölümleri. Alarm yolu TEST EDİLDİ (sahte yüksek baseline → 🔴 + exit 1 + baseline dondu). Rapor: `Site_Saglik_Rapor.md` (üste ekler, son 45 giriş). **(b)** `seo-sentinel.cjs` beklenen yola (`Desktop\Bemis_Raporlar\`) baseline-uyumlu yeniden yazıldı → haftalık adım-0 artık gerçekten çalışır; "GERILEME YOK - OK"/"GERILEMELER:" token'larını basar, baseline yalnız temizken güncellenir. **(c)** yeni cron görevi **`gunluk-site-saglik`** (her gün 08:08; script'i çalıştırır, 🔴 varsa öne çıkarır + muhtemel sebep [R2 bin boşalması/bozuk deploy/admin üzerine-yazma], KENDİ BAŞINA DÜZELTMEZ — insan kararı). ⚠️ **Toplam 6 otonom görev** artık. ⚠️ İlk otonom çalışmada `node` için izin sorabilir → kullanıcı bir kez "Run now" ile ön-onaylayabilir. **⚠️ Sentinel'ler `Desktop\Bemis_Raporlar\` altında KALICI — taşıma/silme (cron o yolu çağırıyor).**


> 🌍✅ **/export ARTIK KABUĞUYLA BİRLİKTE İNGİLİZCE (2026-07-13, CANLI · commit 5a7c310):** Kullanıcı: "/export gövdesi İngilizce ama menü Türkçe, tutarsız; oraya yabancılar girecek". **YENİ TEK KURAL:** `lib/languages.ts` → **`ENGLISH_ONLY_PATHS = ["/export"]`** + `isEnglishOnlyPath()`. `LanguageContext` `usePathname` ile bu yollarda `effectiveLang="en"` döner. **⚠️⚠️ EN ÖNEMLİ TASARIM KARARI — ZORLAMA TERCİH DEĞİLDİR:** (a) **localStorage'a YAZILMAZ** → TR ziyaretçinin tercihi bozulmaz, sayfadan çıkınca kendi diline döner; (b) ziyaretçi o sayfadayken seçiciden dil seçerse **zorlamayı ezer** (`pickedHere`, rota değişince sıfırlanır) → seçici bozuk görünmez. **⚠️⚠️ ASIL TUZAK (`LanguageURLSync`):** bu bileşen `lang`'i URL'e `?lang=en` olarak yazar VE mount'ta URL'den okuyup `setLang()` çağırır → zorlama URL'e yazılsaydı, sayfa yenilenince o parametre okunup **TR ziyaretçinin tercihi kalıcı İngilizce'ye dönerdi**. Bu yüzden `LanguageURLSync` İngilizce-only yollarda **atlanır** (`skip`). Yeni İngilizce-only sayfa eklerken: `ENGLISH_ONLY_PATHS`'e yaz, gerisi otomatik. **`app/components/HtmlLang.tsx` SİLİNDİ** (yalnız `<html lang>` çeviriyordu, kabuğu Türkçe bırakıyordu; artık LanguageContext tek sahip — iki bileşen aynı attribute'a yazmasın). **Navbar'da 4 sabit Türkçe `aria-label`** (Ana sayfa / Site içinde ara / Menüyü aç / kapat) `pickText`'e bağlandı → İngilizce sayfada ekran okuyucu da İngilizce. **YEREL TEST (4/4 geçti):** TR tercihli ziyaretçi /export'ta EN görür + localStorage `tr` KALIR + çıkınca tr'ye döner · seçici çalışır (Deutsch→de) · tercihsiz yabancı EN açılır · URL temiz · konsol 0. **Build: 221 statik sayfa, /export HÂLÂ prerender** (kök provider'a `usePathname` eklemek dinamikleştirMEDİ — ISR/perf regresyonu yok; doküman: usePathname ilk yüklemede sunucuda dolu gelir, hydration uyarısı yalnız `rewrites`/Proxy'de ve tek rewrite'ımız `/favicon.ico→/icon`, sayfa rotalarını etkilemez). **⚠️ BİLİNEN (mevcut mimari, yeni değil):** üst menünün **CMS'ten** gelen etiketleri (`content.navbar.links`) SSR'da TR basılır, `/api/content?lang=en` dönünce EN olur → **kısa sıçrama**; sabit etiketler (dropdown/aria) SSR'da zaten EN. Tam SSR-EN kabuk = kök layout'un rotayı bilmesi gerekir (server'da URL okunamaz) = route-group refactor'u, bilinçli ERTELENDİ.

> 🖼️✅ **/uretici FABRİKA GÖRSELİ 16/7→16/6 + `sizes` FIX (2026-07-13, CANLI · commit 91bed2d):** Genişlik turunun YAN ETKİSİ: konteyner 1360→1600 olunca **oran sabit kaldığı için görsel yükseklik de büyüdü** (1576×**690px** = ekranın %69'u; kullanıcı "aşırı büyük olmuş" dedi). Canlı önizleme (16/7·16/6·16/5.5·16/5 toggle) → kullanıcı **16/6** seçti = 1576×**591px**, genişlik değişikliğinden ÖNCEKİ yükseklikle (595px) pratikte aynı ama kenar hizası sayfayla korunur. **⚠️ AYRICA `sizes` KUSURU BULUNDU+DÜZELTİLDİ:** ipucu **"1024px"** iken görsel 1576px basılıyordu. **Doğru etki analizi (ölçüldü):** DPR-1 (normal monitör, kullanıcıların ÇOĞU) → tarayıcı 1024 isteyip ~1080w adayını çekiyordu → 1576'ya gerilip **bulanık**; DPR-2 (retina) → 2048 isteyip zaten 1600'ü (kaynak tavanı) alıyordu → etkilenmemişti. Artık `(max-width:768px) 100vw, (max-width:1536px) 1280px, 1600px` → DPR-1'de de 1600×900 iner = NET. **⚠️ KALAN (KULLANICI):** kaynak foto **1600×900 WhatsApp export'u** (`/kurumsal/1775044209322-WhatsApp_Image_2026-04-01...jpeg`) → DPR-2 geniş ekranda çerçeve 1576 CSS px = **3152 aygıt px** ister, kaynak yetmez → retinada bir tık yumuşak. Çözüm yalnız admin'den **~3000px+ orijinal** yüklemek (kod işi DEĞİL). **⚠️ TEŞHİS TUZAĞI (zaman kaybettirdi):** ölçümde 666×375 ve 1333×750 göründü → **`img.naturalWidth` TARAYICININ YEREL ÖNBELLEĞİNİ yansıtır**; sunucu `fetch(url,{cache:'reload'})` + `createImageBitmap` ile test edilince **1600×900 / cache HIT** çıktı = yeni ziyaretçi NET görüyor. Görsel netliği teşhis ederken naturalWidth'e GÜVENME, önbellek atlayarak sunucuyu ölç. **⚠️ DERS: konteyner genişliğini değiştirince sabit `aspectRatio`'lu görseller ORANTILI büyür + `sizes` ipuçları bayatlar — ikisini de kontrol et.** `/kurumsal` aynı `dna.factoryImage`'ı kullanır ama 50/50 sütunda (`sizes 50vw`) → etkilenmedi, dokunulmadı.

> 📐✅ **SİTE ARTIK TEK GENİŞLİK KONVANSİYONU — `wide-content` EMEKLİ (2026-07-13, CANLI · commit e8e31ff):** Yukarıdaki turun DEVAMI. Kullanıcı "ön izleme olarak farkı göster, seçerek karar verelim" dedi → `/uretici`'ye **canlı toggle enjekte edildi** (tarayıcıda 1360↔1600 arası geçiş + 1360 sınırını gösteren kesik çizgi; JS yalnız ÖNİZLEME, kaynak değişmedi) → kullanıcı **"Hepsi 1600px olsun"** seçti (gerekçe: sayfa geçişinde içerik kenarı zıplamasın). **YAPILAN:** kalan 16 konteyner `max-w-7xl mx-auto wide-content` → **`max-w-7xl 2xl:max-w-[1600px] mx-auto`** (uretici 7 · export 4 · CityLandingClient 3 · iletisim 2) + `globals.css`'teki **`.wide-content.mx-auto` kuralı SİLİNDİ** (ölü kod; yerine özgüllük-tuzağı uyarı yorumu). **⚠️ ARTIK TEK KURAL: `max-w-7xl 2xl:max-w-[1600px] mx-auto`** — yeni sayfada bunu kullan, `wide-content` DİRİLTME (özgüllüğü 0,2,0 → `2xl:max-w-[1600px]`i 0,1,0 sessizce ezer). Etki YALNIZ ≥1536px (1360→1600); dizüstü/mobil 1280px'te AYNI. İç metin `max-w-3xl` (768px) ellenmedi → okunabilirlik korundu. Ölçüm: /uretici @1728px %79→**%93**, 3'lü ızgara kartı 443→**523px**, iç metin 768px sabit. tsc 0, marka bekçisi temiz.

> 📐✅ **GENİŞ EKRAN GENİŞLİK TURU — LİSTELER + KURUMSAL 3 (2026-07-13, CANLI · commit'ler 697daae/a65c552/9ac718b):** Kullanıcı "dökümanlar/blog/rehberler/sözlük ekranı tam kullanmıyor ortada toplanmış; adaptive olsun, tasarımı bozma" dedi, sonra "kurumsal 3 sayfaları da aynı şekilde yap". **⚠️ KRİTİK ÖZGÜLLÜK TUZAĞI:** `globals.css`'teki **`.wide-content.mx-auto`** seçicisi (özgüllük **0,2,0**) ≥1536px'te `max-width:1360px` dayatır ve Tailwind'in `2xl:max-w-[1600px]`'ini (0,1,0) **EZER** → 1600px istiyorsan `wide-content`'i KALDIRMAK ZORUNDASIN (sadece sınıf eklemek işe yaramaz). **SİTEDE 2 GENİŞLİK KONVANSİYONU VAR (bilinçli):** (a) **1600px** = `max-w-7xl 2xl:max-w-[1600px] mx-auto` → listeler/ürünler/dökümanlar/blog/sözlük **+ artık Kurumsal 3**; (b) **1360px** = `max-w-7xl mx-auto wide-content` → kalan pazarlama landing'leri (/uretici, /export, /iletisim, şehir sayfaları) — bu 1360 KASITLI pazarlama tasarımı, sorMADAN değiştirme. **YAPILAN:** documents+blog+sözlük 1600px + grid sütunları (blog `lg:3 2xl:4`, sözlük `xl:4 2xl:5`, documents `2xl:5`); blog'da **wide-content KALDIRILDI** (yoksa 1360'ta takılırdı); 7 landing'de orta-aralık boşluğu kapatıldı (`max-w-5xl`→`max-w-7xl`, 1024→1280px @1280-1512px); **Kurumsal 3 (/b2b·/bayilik·/operator) 1600px'e** (9ac718b, wide-content kaldırıldı). Blog'a **Sözlük tuşu** eklendi (⚠️ `role="tablist"` DIŞINA — a11y: tablist yalnız tab içerir). **İç metin konteynerleri (`max-w-3xl` 768px) HİÇ ELLENMEDİ** (okunabilirlik/satır uzunluğu). Canlı ölçüldü: /b2b·/bayilik·/operator @1728px = **1600px / %93 / wide-content 0 / taşma 0**, @1440px = 1280px / %89; blog 4 sütun, sözlük 5 sütun, documents 5 sütun. tsc 0, marka bekçisi temiz, konsol 0 hata.

> 🚨 **VERCEL DERSİ — HESAP GENELİ BUILD KİLİDİ (2026-07-13):** Deploy'lar 40+ dk "Queued"da takıldı. **Sebep bemis-server DEĞİLDİ:** ⚠️ **Hobby planı TEK eşzamanlı build** verir ve **bemis-b2b'nin bir build'i `Running TypeScript ...` adımında 39 dk donmuştu** (`✓ Compiled successfully` sonrası tip-kontrolü hiç bitmedi) → o tek slotu işgal edip **hesaptaki TÜM projelerin** deploy'larını kilitledi. **ÇÖZÜM:** takılı + arkasındaki queued b2b deploy'ları `vercel remove <url> --yes` ile kaldırıldı (⚠️ önce `vercel inspect` ile **alias'sız = canlı DEĞİL** doğrulandı; b2b canlı sürümü kendi son Ready deploy'unda kaldı, HTTP 302 ile teyit) → slot açıldı, bemis-server anında Building'e geçti. **Teşhis yolu:** `vercel ls <proje>` her projede tek tek → Building/Queued ara; `vercel inspect <url> --logs` ile nerede donduğunu gör; vercel-status.com "All Operational" ise sorun HESABA özel. **⚠️ bemis-b2b'nin build'i HÂLÂ BOZUK** (kullanıcı ayrıca kontrol ettiriyor) — tekrar deploy denenirse yine kilitler. **DEPLOY AKIŞI DEĞİŞTİ (kullanıcı kararı):** artık **YALNIZ `git push`** kullan — push GitHub oto-deploy'u zaten tetikliyor; ayrıca `vercel --prod` çalıştırmak her turda ÇİFT deploy yaratıp kuyruğu şişiriyordu.

> 🔤✅ **SİTE GENELİ EŞ ANLAMLI ZENGİNLEŞTİRME — 8/8 KATEGORİ (2026-07-13, CANLI):** Kullanıcı "seyyar/portatif/şarj aleti/kaliteli yerli aramalarında hiç çıkmıyoruz" dedi. **TEŞHİS (tarama ile):** "portatif", "şarj aleti", **"araba"**, "ev tipi", "evde şarj", "garantili" **HER sayfada 0 kez** geçiyordu — site resmî dili ("taşınabilir/araç/cihaz") konuşuyor, kullanıcı günlük dili ("portatif/araba/alet") arıyordu. **Kullanmadığımız kelimede çıkmak imkansız.** DC sayfası metin açısından en zayıfıydı. **YAPILAN (H1'ler DEĞİŞMEDİ — `metaTitle` deseni):** wallbox→"**Ev Tipi** Elektrikli Araç Şarj İstasyonu" + SSS "Ev tipi/duvar tipi/wallbox aynı şey mi?"; dc-units→"DC Hızlı Şarj **İstasyonu** — CCS2 40–200 kW"; portable→"Seyyar & **Portatif**" + SSS "Portatif şarj aleti/seyyar/taşınabilir aynı şey mi?"; cables→"**Yerli Üretim** Ev Şarj Kablosu"; v2l-c2l/converters/accessories/charger-equipment→araba+%94 Yerli Malı+CE+garantili (kategoriye ÖZEL cümleler; aksesuarda %94 iddiası YOK, ekipmanda "araba" YOK — kasıtlı, uydurma yok). 2 yeni SSS **FAQPage şemasına** girer = **AI/GEO alıntılanabilir**. Yoğunluklar kelime başına %0.43–1.71 (stuffing YOK — ⚠️ yoğunluk KELİME BAŞINA ölçülür, eş anlamlıları toplama!). Footer alt barına "Bemis Grup: Bemis Teknik · BYES" (flex-wrap → footer BÜYÜMEDİ). ⚠️ **Dış link backlink DEĞİLDİR** — `Organization.parentOrganization` (bemis.com.tr + ana şirket Wikidata) zaten entity bağını taşıyor; asıl kazanç bemis.com.tr'nin BİZE link vermesi (o taraf ayrı sitede). store.ts cache key **v19-vocab**. IndexNow 11 URL, regresyon SIFIR. **⚠️ SEO TEŞHİS DERSİ:** çıkmıyorsak önce **otorite mi, hedefleme mi** diye bak — Bemis **DR 10**, çıkan rakipler **DR 8 ve DR 0** çıktı; sorun otorite değil, o kelimeyi kuran sayfanın olmamasıydı. Ayrıca **tek-niyet-tek-sayfa**: aynı kelimeye 2. sayfa açmak kanibalize eder.

> ✍️✅ **İÇERİK CİLASI: MID opsiyonel + montaj metni son-kullanıcı diline (2026-07-13, CANLI):** Kullanıcı: (1) Pro/Plus'ta MID Sayaç OPSİYONEL göster, (2) eklediğim metinler ham/kurulumcu-jargonu; son-kullanıcı odaklı kurumsal dile çevir, (3) son-kullanıcının görmemesi gereken ham ifadeleri çıkar. **YAPILAN:** (a) `mid` rozet etiketi "MID Sayaç" → **"MID Sayaç (Opsiyonel)"** (`productFeatures.ts`; açıklamalarda zaten "opsiyonel MID sayaç" geçiyordu). (b) **Montaj cümlesi cilalandı** — "cihazın içi açılmadan yalnızca dıştan güç klemensine bağlanıp dış montaj kulaklarından sabitlenerek" (kurulumcu jargonu, "içini açma" ifadesi) → **"Yenilenen dış kasası ve dıştan bağlantılı pratik montaj tasarımı sayesinde kurulum hızlı ve zahmetsizdir."** 9 üründe (8 wallbox + pro-mobile), 6 dilde (`scratchpad/_polish.cjs`, tüm kaynaklar: repo 6 + R2 base+de/es/ar/ru+productsEn). Jargon (klemens/kulak/açılmadan) TAMAMEN kalktı — 6 dil doğrulandı. Diğer açıklamalar (amperage/DC ödeme/wallbox otomatik başlatma) zaten profesyonel + tutarlı, dokunulmadı. store.ts cache key **v16-polish**. ⚠️ NOT (gelecek): eklediğim yeni metinler yazılırken **son-kullanıcı odaklı kurumsal dil** kullan (kurulumcu/iç jargon değil); "cihazın içini açma", ham klemens/terminal detayı gibi ifadelerden kaçın.

> 🔧✅ **KANONİK FEATURE SETLERİ + KOLAY MONTAJ (2026-07-13, CANLI, 6 DİL):** Kullanıcı feature modelini netleştirdi: **çekirdek set** (ip65/rfid/app/**screen**/wifi/schedule) = Pro Mobile 2 + TÜM Charger'da; **Plus 2 & Pro 2** ek: ocpp+shared+load (ortak alan yönetimi) — Pro Mobile 2 & Charger 2'de YOK. + Ekstralar: Pro Mobile 2→autostart/amp6, Plus2→autostart/mid, Pro2→mid. Ayrıca **Pro Mobile + tüm AC wallbox yenilenen dış kasa/Kolay Montaj** (içi açılmadan dıştan klemens + dış montaj kulakları). **YAPILAN:** `PRODUCT_FEATURES`'a **`montaj`** rozeti (RiToolsLine, Detail+Featured haritalarına). **Kanonik setler ENFORCE edildi** (tutarlılık — varyantlar artık aynı; `scratchpad/_mount_features.cjs`): Charger2=çekirdek+montaj, Plus2=çekirdek+ocpp/shared/load/autostart/mid/montaj, Pro2=çekirdek+ocpp/shared/load/mid/montaj, Pro Mobile 2=çekirdek+autostart/amp6/montaj. Kolay montaj açıklaması 9 ürüne (8 wallbox + pro-mobile) 6 dilde eklendi. 6 kaynak (repo 6 dosya + R2 base+de/es/ar/ru+productsEn). Canlı doğrulandı: Pro Mobile 2 Genel Özellikler = IP65/RFID/App/**LCD Ekran**/WiFi/Planlı Şarj/Otomatik Başlatma/6 Kademe Amper/**Kolay Montaj** render; montaj metni 6 dilde. store.ts cache key **v15-mount**. ⚠️ Detay sayfası ISR (`<title>` metaTitle hâlâ eski "Pro Mobile 22 kW"; admin ürün-kaydı revalidateTag ile tazeler — bkz alt not).

> 🏷️✅ **GENEL ÖZELLİKLER ROZETLERİ + PRO MOBILE 2 RENAME (2026-07-13, CANLI):** Kullanıcı: (1) Pro Mobile→**Pro Mobile 2**, (2) broşür özellikleri "Genel Özellikler" sekmesinde YOK (specs'e eklenmişti), admin-senkron olmalı. **BULGU:** "Genel Özellikler" = `features[]` (ikon rozet, `lib/productFeatures.ts` `PRODUCT_FEATURES` kataloğu — admin OTOMATİK checkbox okur = senkron) + `generalFeatures[]`. Broşür specleri Teknik Özellikler'deydi. **YAPILAN:** `PRODUCT_FEATURES`'a **6 yeni rozet** (autostart/mid/plugplay/safety/ik10/amp6) + 3 yeni ikon (RiDashboard3Line/RiHammerLine/RiEqualizerLine) hem `ProductDetailClient` hem `FeaturedProducts` ikon haritalarına. Ürünlere features atandı (6 kaynak: base+de/es/ar/ru _translations+productsEn+5 repo fallback): DC→load/plugplay/safety(+120-200 ik10), Plus2→autostart/mid, Pro2→mid/app, **Pro Mobile 2→app/ip65/autostart/amp6**. Rename: name→"Pro Mobile 2" (6 dil) + açıklama + blog tablosu (`posts.ts`) + **`productSeo.ts` metaTitle** (Pro Mobile 2 · 22 kW, +6 kademe amper). Canlı doğrulandı: Genel Özellikler sekmesi Pro Mobile 2'de 4 rozet render, features 6 dilde. store.ts cache key **v14-features**. **⚠️ ÖĞRENME (ISR):** ürün sayfası `revalidate=86400` ISR + Vercel ISR cache DEPLOYLAR ARASI KALICI. Doğrudan-R2 yazımı `revalidateTag` tetiklemez → **PAGE metaTitle deploy'da tazelenMEZ** (X-Vercel-Cache HIT, name client-fetch ile güncel görünür ama SSR `<title>` eski kalır). Tazelenme: 24s ISR penceresi VEYA admin'de ürün kaydı (writeBin→revalidateTag store:products). *Veri/spec değişiminde bunu unutma — kritik metadata için admin-save veya on-demand revalidate gerekebilir.*

> 🔌✅ **PRO MOBILE 6 KADEMELİ AMPER (2026-07-13, CANLI, 6 DİL):** Kullanıcı: Pro Mobile artık **6 kademeli amper (6/10/16/20/25/32A)**, mobil uygulama + cihaz üstündeki tuşla ayarlanır; "tüm yerlerde değiştir". **YAPILAN:** eski `Akım=16A - 32A` → **`6 / 10 / 16 / 20 / 25 / 32 A (6 kademe ayarlanabilir)`** + yeni **`Amper Ayarı`** speci (mobil+tuş) + açıklama, **6 DİLDE**: TR base (repo `data/products.json` + R2 `products` base), **de/es/ar/ru** (R2 `products._translations` + repo `data/products-*.json`), **en** (R2 **`productsEn` bin** — ⚠️ yapısı `{en:[...]}`, `.products` DEĞİL! ilk denemede kaçmıştı + repo `data/products-en.json`). Blog karşılaştırma tablosu (`app/blog/posts.ts`, post `ev-sarj-cihazi-modelleri-karsilastirma`) Pro Mobile satırı `32A`→`6 – 32A`. Fiziksel adaptörler (CEE 5/16A, 5/32A) ve fiyat (€429) dokunulmadı; güç "11-22 kW" korundu. **⚠️ ÖĞRENME:** çok-dilli ürün-spec değişiminde 3 kaynak: base `products`(TR) + `products._translations`(de/es/ar/ru) + ayrı `productsEn` bin(`{en:[...]}`); + 5 repo fallback `products-<lang>.json`. store.ts cache key **`v11-docs`→`v13-promobile-en`**. Canlı 6 dil doğrulandı (stale 16A-32A hiçbir yerde yok). *(Not: önceki broşür specleri IP65/PA6/IK10 non-TR sayfalarda TR görünüyor — ayrı i18n boşluğu, bu iş kapsamı dışı.)*

> 🏭✅ **HAFTALIK SEO 3 ÖNERİSİ — /uretici GÜÇLENDİRME (2026-07-13, CANLI):** SEO site-kontrol 3 madde önerdi. **KARAR (kullanıcı seçti):** (#1 bemis.com.tr on-page + #3 çapraz-link) → **ŞİMDİLİK ATLANDI** çünkü ⚠️ **bemis.com.tr AYRI SİTE** (başlık "Bemis Endüstriyel Fiş Priz", endüstriyel ana şirket; repomda referansı YOK → bu oturumdan koda dokunulmaz, projeler-karışmasın). Not: bemis.com.tr'de gerçek sorunlar var (meta desc BOŞ, **16 h1**, Organization şema YOK) — istenirse ayrı oturumda kodu açılır veya hazır düzeltme paketi hazırlanır. (#2 "EV şarj üreticisi landing") → **ZATEN /uretici olarak CANLIYDI** (16.000 m²/60+ ülke/CE-IP65/1994 hepsi var); kullanıcı "hedef kelimeleri güçlendir" dedi. **YAPILAN (görünüm bozulmadan):** (a) `page.tsx` metadata keywords'e 3 yüksek-niyet terimi eklendi ("elektrikli araç şarj **istasyonu** üreticisi", "türkiye şarj cihazı üreticisi", "DC şarj istasyonu üreticisi"); (b) FAQ'a 2 kelime-zengin soru (DC istasyon üretimi + "Türkiye'de ne zamandır" 1994/30+yıl/60+ülke otoritesi) → **FAQPage şeması 5→7 soru** (GEO/AI alıntı gücü) + eksik "şarj istasyonu üreticisi" terimi artık gövdede. Canlı doğrulandı (keywords head'de, 2 FAQ render, FAQPage 7 soru JSON-LD geçerli), IndexNow /uretici ping 200. tsc 0 + brand guard temiz. ⚠️ /uretici iç linkleri zaten iyi (Navbar+Footer site-geneli+DNA+kurumsal).

> 🔎✅ **SEO/GEO DOĞRULAMA + ŞEMA ZENGİNLEŞTİRME (2026-07-13, CANLI):** Broşür+döküman değişikliklerinden sonra kullanıcı "SEO/GEO nasıl etkilendi, bildirim/yapılacak var mı" sordu. **DOĞRULAMA:** SEO bekçisi (`scratchpad/seo-sentinel.cjs`) 18 sayfa → **SIFIR regresyon** (hepsi 200/index/canonical ok/JSON-LD geçerli); sitemap 187 URL, **154'ünde bugünün lastmod'u** (Google oto yeniden tarar); ürün URL'leri değişmedi (id-bazlı, sadece görünen kod). **BİLDİRİM:** IndexNow ile **21 değişen URL** Bing/Yandex'e gönderildi (200 kabul; ChatGPT/Copilot Bing kullanır) — *yeni içerik/URL değişiminde `scratchpad/indexnow-submit.cjs` mantığıyla tekrar gönder*. **ŞEMA ZENGİNLEŞTİRME (`app/lib/seo.ts` `productSchema`):** artık her ürün Product şemasına **`countryOfOrigin: Türkiye`** (yerli sinyal, tüm ürünler) + **`material`** (Gövde Malzemesi spec'inden, ör. mobilde "PA6 %30GF") + **`offers.warranty`** (WarrantyPromise, standart 2 yıl; DC'deki +3 uzatma opsiyonel olduğu için şemada 2 yıl) ekleniyor. Not: specler ZATEN `additionalProperty`'e dökülüyordu (IK10/ölçü/garanti/%94 dahil) — bunlar first-class alanlar olarak eklendi (Google/AI daha iyi tanır). Canlı doğrulandı: JSON-LD 3/3 geçerli, DC200 countryOfOrigin+warranty+20 addProp, mini-mobile material=PA6+warranty+9 addProp. tsc 0 + brand guard temiz.

> 📄✅ **KAYIP DÖKÜMANLAR GERİ GETİRİLDİ + KÖK NEDEN DÜZELTİLDİ (2026-07-13, CANLI):** Kullanıcı "teknik dökümanlar/PDF'ler sitede gözükmüyor, geri getir + neden gitmişler". **TEŞHİS:** Döküman rotası `/documents` (nav "Dökümanlar" → `/documents`). `documents` R2 bin'i **12→3'e düşmüştü**: public `/api/documents` R2 boşken `data/documents.json` yedeğine (12 döküman) düşüyordu ve site bunu gösteriyordu; AMA admin GET (`app/api/admin/documents/route.ts`) R2 boşken yedeğe DÜŞMEYİP **boş liste** yüklüyordu → bugün ilk kez 3 döküman (DC el kitabı + 2026 broşür TR/EN) yüklenince `writeBin("documents", body)` R2 bin'ini 3'e sabitledi → public artık R2'yi (3) okuyor, 12'lik yedek gölgede kaldı = "kayboldu". **(Ürün/broşür işiyle ALAKASIZ — ayrı bin; ürün `documents` alanı transform öncesi/sonrası birebir aynıydı, doğrulandı.)** **ÇÖZÜM (2 parça):** (1) **Restore:** canlı 3 + repo'daki 11 (9 Cloudinary URL'si HTTP 200 doğrulandı + 2 r2.dev [Kurulum Prosedürleri 5.3MB, EA Şarj Kullanma Kılavuzu 5.1MB] canlı file-proxy'den 200 PDF doğrulandı; süperseded "Şarj Cihazları Broşürü 2026" r2.dev atlandı, yeni "2026 broşür" onu değiştirdi) → **birleşik 14 döküman** R2 `documents` bin'ine yazıldı + `data/documents.json` eşitlendi (`scratchpad/_docrestore.cjs`, yedek `documents.R2.bak.json`, secret pull→SİL). (2) **Kök neden fix:** admin GET artık R2 boşsa `data/documents.json`'dan SEED ediyor (bir daha ilk-kayıt eski dökümanları silmez). store.ts cache key **`v10-brosur2`→`v11-docs`**. Canlı doğrulandı: `/api/documents`=14 (7 kurulum/3 katalog/1 fiyat/3 teknik), `/documents` sayfası hepsini render ediyor, r2.dev PDF'leri proxy'den açılıyor. ⚠️ Döküman = `{documents:[{id,title,description,category,url,filename,size,lang,date,visible,coverUrl?}]}`; kaynak R2 `documents` bin (fallback data/documents.json). İstenirse eski "Broşür 2025" admin'den kaldırılabilir.

> 📘✅ **BROŞÜR-2026 → ÜRÜN SPEC/AÇIKLAMA ZENGİNLEŞTİRME (2026-07-13, CANLI):** Kullanıcı en güncel katlamalı broşürü (`scratchpad/brosur-utf8.txt`, `pdftotext -enc UTF-8` ile) verdi; seçmeli sordum, işleme aldım. **83 değişiklik** hem `data/products.json` (repo) hem **canlı R2 `products` bin**'ine tek ortak transform (`scratchpad/_transform.cjs`, dedup'lı/idempotent, `_translations` KORUNDU 766962 byte, fiyat specleri dokunulmadı) ile uygulandı; secret `vercel env pull`→kullan→**SİL**. **DC (6 ürün):** kod BEVDC-xx → **gerçek katalog kodu BEVDCC-xxxx-0005** (40=4223 duvar, 80=4321, 120=4421, 160=4521, 200=4721; 180kW kullanıcı İSTEMEDİ eklenmedi) + **Fiziksel Özellikler** (ölçü G×D×Y; 40=600×320×900/80kg, 80=693×603×1865, 120-200=800×800×1900) + 120-200'e **IK10** + **10" LCD Kapasitif Dokunmatik** + **Güvenlik** grubu (kısa devre/aşırı akım/acil stop/DC toprak kaçak…) + Yönetim'e **Ödeme Yöntemleri** (RFID/NFC temassız, CPO kredi/banka kartı) + **Belgeler & Garanti** grubu (Garanti "2 Yıl + ek ücretle 3 yıl uzatma", **Yerli Malı Belgesi %94**, Sertifika CE) + açıklama zenginleşti (tak-çalıştır/güç dengeleme/NFC ödeme). **Wallbox:** Plus 2 (2 var.) → **Otomatik Şarj Başlatma İnovasyonu** + MID Sayaç; Pro 2 (4 var.) → MID + Mobil Uygulama; "Akıllı & Opsiyonel" grubu + açıklama. **Taşınabilir:** mini/mono → Gövde PA6 %30GF + Tip 2 + **IP65 + -40°C/+55°C**; **Pro Mobile → çakışma ÇÖZÜLDÜ** (broşür IP65/-40 vs pazaryeri IP66/-30; kullanıcı **broşür değerini seçti** 2026-07-13 → tüm mobil seri IP65/-40 tutarlı, +2 değişiklik R2+repo). **/uretici** "Yerli mühendislik" kartına %94 Yerli Malı Belgesi metni işlendi (grid bozulmadı). store.ts cache key **`v8-dealers`→`v9-brosur`→`v10-brosur2`**. Deploy READY, canlı doğrulandı (BEVDCC kod + IK10 + %94 + garanti + wallbox otomatik başlatma + /uretici %94; teknik-özellik sekmesi tüm yeni gruplar temiz render). ⚠️ Kod değişti ama name (BEVDC 200) + FAQ metinleri model-adı olarak aynı; global üst-badge hâlâ "2 Yıl Üretici Garantisi" (DC spec'te +3 yıl detayı var — istenirse DC'ye özel badge yapılabilir).

> 🧪✅ **FABLE-5 KALİTE TURU — DIŞ TESTLER + 11 İYİLEŞTİRME (2026-07-12, commit 63a7ec4):** Kullanıcı "dış test araçlarıyla değerlendir + GitHub kaynaklarına bak + seçmeli sor" dedi; TÜM önerileri onayladı.
> **DIŞ TEST SONUÇLARI:** Mozilla Observatory **B+ (80)** → tek eksik CSP unsafe-eval/inline · **W3C 11 hata** (B2BCta button>div ×9, loading/toast `<style>` ×1, Footer h2→h4 atlaması ×1) · TLS 1.3 ✓ (SSL Labs botu Vercel'e ulaşamıyor — site sorunu değil) · PSI keyless kota dolu (yerel LH profili geçerli) · güvenlik başlıkları TAM.
> **YAPILAN (görünüm sıfır değişim):** (1) **W3C 11→0** (yerel prod'da 0'a indi doğrulandı): B2BCta div/p→span, Footer h4→h3, `bemisToastIn`+`bemis-spin` keyframe'leri globals.css'e (gövdede `<style>` geçersizdi). (2) **CSP:** `unsafe-eval` YALNIZ dev'de (`process.env.NODE_ENV` koşulu, next.config) — yerel prod'da securitypolicyviolation dinleyicisiyle **0 ihlal** doğrulandı. (3) **a11y (axe, 4 sayfa):** Navbar 3 ikon butonu aria-label, Calculator 4 slider `aria-label={label}` + elektrik-fiyat slider + araç `<select>`, FeaturedProducts+ReferenceProjects+benzer-ürünler şeridi `tabIndex+role=region+aria-label`, ContactBar 4 sosyal ikon aria-label. Kalan (bilinçli): `region(37)`/landmark moderate'ları — DOM yapısal, düşük etki, dokunulmadı. (4) **YENİ:** `/blog/rss.xml` (36 içerik; posts+press) · `/.well-known/security.txt` · **IndexNow** key `public/c39eaee7...txt` + `scratchpad/indexnow-submit.cjs` (canlı sitemap'i Bing/Yandex'e bildirir — ChatGPT/Copilot Bing kullanır; **yeni içerik yayınında tek-URL ping'i tekrar kullan**) · **WebVitals→GA4** (`components/WebVitals.tsx`, layout'ta; gtag stub kuyruklar) . (5) **KVKK:** `/gizlilik` + `/cerez-politikasi` (ortak `LegalPage.tsx`; GERÇEK veri akışına göre: form→Resend, IP rate-limit, consent-mode GA/Meta, Sentry maskeli) — ✅ **KULLANICI METİNLERİ ONAYLADI (2026-07-12, "kvkk çerezler de okay") → YAYINDA:** robots index:true + Footer alt barına 2 taranabilir link + sitemap'e 2 rota (commit 6464c06). (6) **Bundle röntgeni:** Next 16 build TURBOPACK → @next/bundle-analyzer pasif (webpack eklentisi; devDep duruyor); chunk-imza yöntemiyle bakıldı: **sürpriz yok** — en büyük 2 chunk (1.8+1.4MB ham) = lazy globe (ilk yükte inmez), Sentry idle'da, kritik yol=react-dom+framer (bilinen). (7) **Kırık link: 183 sayfa, 0 gerçek kırık** (linkinator; ⚠️ yereldeki `/_next/image` 500'leri localhost yapaylığı — canlıda 200). (8) **Çok-dilli SEO planı** `Desktop\Bemis_CokDilli_SEO_Plani.md` (Faz A/B/C; uygulama ayrı onay). launch.json'a `bemis-prod` (next start 3943) eklendi.

> 🧹✅ **BAYİ ÇIKARMA + ADMİN SENKRON DENETİMİ (2026-07-12, commit 304154b CANLI):** Kullanıcı "ALİ YAYLA (BB ENERGY) bayisini çıkar + admin senkron, ayrıca son değişiklikler admin senkronunu bozmuş mu kontrol et, GÖRSEL DEĞİŞTİRME." **(1) Bayi çıkarıldı:** İstanbul'daki "ALİ YAYLA (BB ENERGY)" hem `data/dealers.json` hem **canlı R2 `dealers` bin**'inden silindi (`scratchpad/remove-dealer.cjs` + `-r2.cjs`, parse→filter→yaz, yedekli; secret pull→sil). store.ts cache key `v7-reviews-ty→v8-dealers` (R2 doğrudan-yazımı taze okunsun). Canlı `/api/dealers` doğrulandı: ALİ YAYLA YOK ✓, diğer İstanbul bayileri duruyor. ⚠️ Bayi = `{ cityId: { dealers:[...] } }`; kaynak R2 dealers bin (fallback data/dealers.json). **(2) ADMİN SENKRON DENETİMİ — TEMİZ:** `npm run build` exit 0 (tüm admin derlenir, bağlantı kopuğu yok). Admin dealers editörü `readBin("dealers",{fresh:true})` = ANINDA R2 okur → çıkarma admin'de zaten görünür (senkron). Admin reviews editörü item alanları (platform/platformColor/rating/author/date/product/text) benim 3 gerçek yorumla BİREBİR uyumlu + rating/ratingCount editleniyor. **SECTION_COMPONENTS (11 homepage bölümü) = admin section listesi = BİREBİR** (b2bcta dahil, eksik/bağlanmamış bölüm yok). b2bcta section-bg admin'de bağlı. **Bu oturumdaki değişiklikler admin senkronunu BOZMADI** (reviews aynı shape, dealers fresh-read, gerisi kod). ⚠️ Görsel/düzen HİÇ değişmedi (yalnız veri+cache key).

> 📰🎨 **GÜNCEL FUAR HABERLERİ + MODERN BÖLGE DROPDOWN + /b2b GÖRSEL + DARK MOD AYDINLATMA (2026-07-12, commit 0e1c2b6 CANLI):**
> **(1) HABER (kullanıcı "web'de güncel Bemis haberi olmalı, kurguladık mı?"):** Aylık haber ajanı (`aylik-bemis-haber-ajani`) ZATEN kurulu (ayın 5'i, onaya sunar) — ama tavily ile ŞİMDİ arayıp 2 GERÇEK güncel fuar buldum + `press.ts` başına ekledim: **Power2Drive Europe 2026** (23-25 Haz, Münih Hall B6) + **Light+Building 2026** (8-13 Mart, Frankfurt). Web'de doğrulandı (LinkedIn + fuar siteleri). Anasayfa "Haberler & Basında" + /blog#haberler + /blog/haber/[id] otomatik.
> **(2) BÖLGE DROPDOWN modernleştirildi:** `DealerNetwork` native `<select>` → tasarım odaklı özel dropdown (pin ikonu + bayi-sayısı rozeti + hover/aktif + dışa-tık/Esc kapanma). ⚠️ **BUG+FIX (önemli ders):** AnimatePresence çıkış-animasyonlu düğümü, DealerNetwork sık render olduğu için **opacity:0'da DOM'da bırakıyordu** = görünmez ama tıklama-yutan katman → seçimden sonra kapanmıyordu (aria-expanded=false ama listbox mount). **Çözüm: AnimatePresence KALDIRILDI → koşullu mount** (`{regionOpen && <motion.div initial animate>}`; kapanınca anında unmount, giriş animasyonu korunur). `key` eklemek YETMEDİ. Preview'da aç/seç/kapa/tekrar-aç doğrulandı.
> **(3) /b2b OEM Çözümler görseli:** 50/50 → **12'li ızgara görsel 7/12** (≈%58; geniş ekranda %32→%43). 16/9 kırpmasız korundu; mobilde tek sütun. (Kullanıcı önceki 50/50 fix'i hâlâ "küçük" buldu.)
> **(4) DARK MOD İÇ SAYFA AYDINLATMA (kullanıcı "iç sayfalar biraz karanlık, bir tık aydınlat"):** iç sayfa bg **#0c0c0e→#131318** (6 dosya: b2b/bayilik/documents-[id]/operator/ProductCategoryClient/ProductDetailClient). ⚠️ #131318, ürün-detay #141416 kartlarına ÇOK yakındı (blend) → **kartlar #141416→#1c1c22** (ProductDetail 9 + bayilik 1; kontrast +9/+9/+10) + **hero bgSub #111114→#1a1a20** (b2b/bayilik/operator, page üstünde elevated band). Işık modu HİÇ değişmedi (hepsi `d ? koyu : açık`). Hiyerarşi: page #131318 < hero #1a1a20 < kart #1c1c22 (< category kart #1d1d22). ⚠️ **KURAL: dark bg açarken kart/hero değerlerini de birlikte kontrol et** (aksi halde kartlar sayfaya gömülür). ⚠️ Homepage OEM admin arka planı (`sectionBgs["b2bcta"]`) ZATEN kurulu (geçen tur) — kullanıcıya hatırlatıldı.

> 🔍✅ **DIŞ DENETİM DEĞERLENDİRMESİ + MOBİL İNCE AYAR TURU (2026-07-12, commit 65d98f7):** Kullanıcı 3.parti bir site-denetimi paylaştı; **%90'ı bu site için YANLIŞ/BAYAT** (JS-siz tarayıcı ya da eski bemis.com.tr'ye bakmış). Canlı kanıtla çürütüldü: "İngilizce yok"→6 dil ✓, "blog yok"→28 yazı ✓, "yorum yok"→bugün eklendi ✓, "bayi haritası yok"→var ✓, "doküman yok"→/documents ✓, "iletişim formu yok"→/iletisim+overlay ✓, "sitemap/robots yok"→183 URL ✓, "alt yok"→27 dolu/0 boş ✓, "lazy yok"→var ✓, "Keşfet çalışmıyor"→çalışıyor ✓, "canlı destek yok"→WhatsApp balonu ✓. **Fiyat/e-ticaret** = BİLİNÇLİ karar (bayi modeli — kullanıcı "bayi modelinde kal" seçti, DOKUNMA). **AskUserQuestion:** kullanıcı yalnız **mobil ince ayar** seçti (karşılaştırma aracı/AI chat/sertifika vitrini İSTEMEDİ) + **video gönderecek** (Task #10 beklemede: gelince ürün/anasayfa + VideoObject). **MOBİL TUR (360px, 8 sayfa):** anasayfa/products/ürün-detay/kategori/b2b/blog-yazısı/iletisim/uretici → **YATAY TAŞMA HİÇBİR YERDE YOK** (site mobil-sağlam; blog tabloları kendi konteynerinde `overflow-x:auto` kayıyor = doğru). Tek gerçek sorun: çok küçük içerik rozetleri → **ProductShowcase "Amiral Gemisi Ürün" 7px→9px**, ürün varyant IP-rozeti+kod (BKT) 8px→9px. ⚠️ Kalan <9px = yalnız **dekoratif telefon-mockup** etiketleri (SmartCharger/ProductDetail mock ekran — KASITLI, dokunma). ⚠️ **DERS: dış denetimleri ham-HTML/canlı ile DOĞRULA — bu SSR+client site JS-siz araçlarda 'boş' görünür.**

> 📊✅ **GSC GERÇEK VERİ ANALİZİ + CTR PAKETİ (2026-07-11, commit 7ba2d25 CANLI):** Kullanıcı GSC CSV'sini indirdi (`Desktop\Bemis_Raporlar\GSC\2026-07\`); analiz + aksiyon raporu **`Desktop\Bemis_Raporlar\GSC_Analiz.md`**. **ANA BULGular:** V2L ailesi sitenin organik motoru ("v2l adaptör" 239 gösterim poz 4,7 = en büyük marka-dışı sorgu; V2L Hyundai ürünü 33 tık/514 gösterim); en büyük fırsat CTR (şarj-süresi blogu 576 gösterim %0,35!). **UYGULANAN (yalnız SERP metaları, görünür UI sıfır):** 5 blog metaTitle/description (şarj-süresi "Kaç Saatte Şarj Olur?", kablo, togg-v2l "Togg V2L Adaptör", soket-tipleri, ac-dc "AC Şarj Nedir, DC Şarj Nedir") + **sözlük `<title>` "X Nedir?" kalıbı** (`sozluk/[slug]/page.tsx` metaTitle değişkeni; IP65/IP66 133, kW/kWh 94, CCS2 59 gösterim %0 CTR idi) + **CATEGORY_SEO'ya opsiyonel `metaTitle` alanı** (v2l-c2l SERP başlığı markalı "(Hyundai, MG, BYD)"; ⚠️ `categoryH1` title'ı kullanır → görünür H1 KORUNDU — kategori SERP başlığını H1'den ayrı optimize etmek için bu alanı kullan). Ölçüm: Ağustos CSV'siyle kıyas (hedef: şarj-süresi %0,35→%3+). SONRAKİ TUR ADAYLARI raporda: "v2l olan araçlar" poz-1-tıksız (AI Overview; snippet bloğu görünür-değişiklik→SOR), kurulum kümesi zayıf (poz 30-79), wallbox poz 23 = otorite işi.

> ⚡🌟✍️ **HIZ PAKETİ + GERÇEK ÜRÜN-YORUM ŞEMASI + 2 ALICI-BLOG (2026-07-11, tek push):**
> Kullanıcı "hız + SEO/GEO nasıl iyileşir" sordu; ölçüm yapıldı (yerel LH mobil 42, FCP 2,1s, CLS 0, **TBT 3.220ms = tek darboğaz**; JS 452KB sıkıştırılmış = makul; PSI API günlük kota doldu → yerel LH kullanıldı). AskUserQuestion: kullanıcı güvenli paket + derin plan + 4 SEO işinin HEPSİNİ seçti.
> **(a) GÜVENLİ HIZ PAKETİ (görünüm sıfır değişim):** `GoogleAnalytics.tsx` gtag.js artık **ilk etkileşimde veya 5sn'de** (hangisi önce; consent stub erken → dataLayer kuyruklanır, veri kaybı yok; lazyOnload Script'leri kaldırıldı). `instrumentation-client.ts` **Sentry dinamik import + requestIdleCallback(timeout 6s)** — kritik bundle'dan çıktı; init-öncesi hatalar mini kuyrukta (max 20) → flush; `onRouterTransitionStart` senkron sarmalayıcı (Next sözleşmesi). `app/layout.tsx` **speculation rules** (prerender, eagerness moderate, /admin+/api hariç; CSP unsafe-inline mevcut → çalışır).
> **(b) GERÇEK ÜRÜN-YORUM ŞEMASI + GÖRÜNÜR BLOK:** `PRODUCT_REVIEW_KEY` yeniden dolduruldu (GERÇEK): `sarj-seti-20a-trifaze-5m` ← 2 HB yorumu (İ.T.+M.C.) + `pro-mobile` ← Onur D. (TY). `ProductDetailClient`'a `productReviews` prop + **SSS'ten önce görünür "Müşteri Yorumları" bloğu** (yıldızlar+platform rozeti+kaynak notu; Google kuralı: şema=görünür yorum). page.tsx `productReviews` geçiyor; şema dürüst AggregateRating (5.0/2 ve 5.0/1). Preview doğrulandı: blok+rozet+JSON-LD ✓.
> **(c) 2 YENİ ALICI-NİYETLİ BLOG (26→28; 2 paralel ajan taslağı + fact-check + script ekleme):** `isletmeler-icin-dc-hizli-sarj-istasyonu-yatirimi` (işletme tipi×kalış süresi×güç matrisi; fiyat/teşvik/EPDK YOK) + `hangi-sarj-kablosu-aracima-uyumlu-type-2` (Togg T10X/Tesla dahil marka tablosu; rakip şarj markası 0). llms.txt Rehberler + llms-full GUIDE_SLUGS eklendi. ⚠️ posts.ts related tipi `{label,href}[]` — insert script slug→label dönüştürdü (`scratchpad/insert-blogs.cjs`; posts.ts iki stil: tırnaklı+tırnaksız slug regex'i).
> **(d) 301 KANITLI E-POSTA:** bugün tekrar test edildi — `/sarj-cihazlari`+`/ev-charge` HÂLÂ 200 (ajans "yaptık" demişti, YAPMAMIŞ) → `Desktop\Bemis_301_Ajans_Eposta.txt` (kanıt+kapsam+doğrulama adımı; ek: Bemis_301_Yonlendirme_Haritasi.txt). KULLANICI GÖNDERECEK.
> **(e) GSC REHBERİ:** `Desktop\Bemis_GSC_Veri_Akisi_Rehberi.txt` (Yol 1: aylık CSV/ekran görüntüsü → ben analiz; Yol 2: servis hesabı API). KULLANICI ilk CSV'yi indirecek.
> ⚠️ Hız etkisi dürüst çerçeve: skor kovalamak sıralamayı doğrudan değiştirmez (CrUX saha verisi yok, trafik az); kazanç UX + GA/Sentry ana-iş yükünün ilk saniyelerden çıkması. Büyük skor sıçraması = aşağıdaki DERİN TBT TURU (ayrı oturum).

> 🧭❌ **DERİN TBT TURU — DENENDİ ve GERİ ALINDI (2026-07-11): React 19 "innerHTML-adoption" hilesini ÖLDÜRÜYOR.**
> **Ne denendi:** `LazyHydrate` sarmalayıcı (SSR'da children normal; client ilk render'da `dangerouslySetInnerHTML:{__html:""}` + `suppressHydrationWarning` ile sunucu DOM'unu koruy(amay)ıp IO ~1000px yaklaşınca gerçek mount) → `SectionWrapper` non-edit dalında dealer/calculator/reviews'a uygulandı.
> **NEDEN BAŞARISIZ (kanıtlı):** (1) İlk hata: IO içteki div'i gözlüyordu — `content-visibility:auto` ekran-dışıyken İÇERİĞE KUTU VERMEZ (rect=0) → IO asla ateşlenmez; ebeveyni gözle diye düzeltildi. (2) ASIL öldürücü: **React 19 + Next 16 streaming'de adoption hiç olmuyor** — ebeveyn zinciri probe'u gösterdi: `#dealer` içeriği **gizli streaming konteynerinde** kaldı (`div#S:0` > `main` 0×0), görünür ağaçtaki LazyHydrate div'leri BOŞ (outer wrapper 0×0; sayfada 3 bölüm YOK). Yani react-lazy-hydration deseninin dayandığı "hydration'da dangerouslySetInnerHTML'e dokunulmaz" varsayımı bu stack'te GEÇERSİZ; React boundary'yi client-fallback'e alıp sunucu HTML'ini görünür ağaçtan düşürüyor (konsolda hata YOK — sessiz). SEO+görünüm felaketi = kabul ölçütü gereği **anında revert** (commit edilmemişti; `git checkout SectionWrapper` + LazyHydrate.tsx silindi; dev'de doğrulandı: dealer 705px + bölge select "Marmara — 15 bayi" geri geldi).
> **⚠️ BU DESENİ TEKRAR DENEME.** İleride TBT için gerçekçi yollar: (a) bileşen-İÇİ ertelenmiş mount'lar (ör. DealerNetwork liste/harita gövdesini kendi in-view state'iyle mount etmek — SSR'da hafif placeholder kabul edilirse; bölüm başına tasarım kararı), (b) React `<Activity>` API'si stabil olunca, (c) framer yükünü azaltma (kullanıcı animasyon kısmayı REDDETTİ — dokunma). Ölçüm bazı: yerel LH mobil 42 / TBT 3.2s (2026-07-11).
> _(Orijinal plan aşağıda referans için tutuluyor:)_
> 🧭 **DERİN TBT TURU — PLAN (referans; denendi→başarısız→geri alındı; 2026-07-11):**
> **Neden:** Yerel Lighthouse mobil 42/100; FCP 2,1s + CLS 0 mükemmel ama **TBT 3.220ms / ana-iş 23,5s / JS çalışma 13,5s** — darboğaz indirme DEĞİL (JS 452KB sıkıştırılmış, makul), **hidrasyon + framer animasyon ana-iş yükü**. Güvenli paket (GA etkileşim-kapısı + Sentry idle + speculation rules) 2026-07-11'de yapıldı; kalan büyük kazanç = fold-altı hidrasyonu ertelemek.
> **YÖNTEM (sırayla, her adımda preview + Lighthouse ölç):** (1) `SectionWrapper`'a "hydrate-on-approach" modu: fold-altı bölümlerin children'ını IntersectionObserver ~800px yaklaşınca mount eden sarmalayıcı — ama SSR HTML'i KAYBETMEDEN (SEO şart). Teknik: server-render edilen HTML'i koruyup client mount'u geciktirmek Next'te hazır değil → pratik yol: bölüm bileşenlerini `next/dynamic` (ssr:true) + görünürlük-kapılı render'a almak SSR HTML'İ DÜŞÜRÜR (client'ta unmount) → ⚠️ BUNU YAPMA. Doğru desen: react-lazy-hydration benzeri "statik HTML'i dangerouslySetInnerHTML ile dondur, yaklaşınca gerçek bileşeni mount et" sarmalayıcıyı KENDİMİZ yazmak (SSR'da children normal render; client'ta hydrate suppress + approach'ta canlandır). (2) İlk denemede yalnız EN AĞIR 3 bölüme uygula (DealerNetwork [harita+liste], Calculator, Reviews) → ölç → görsel doğrula (whileInView animasyonlar yaklaşınca mount olduğu için yine oynar; fark: hidrasyon gecikir). (3) Riskler: hash-anchor navigasyonu (#dealer/#calculator scrollIntoView) mount tetiklemeli (approach observer'a hash kontrolü ekle); edit-mode (admin) tüm bölümleri hemen mount etmeli (isEditMode ise kapıyı atla); SSR/client uyuşmazlığı hydration hatası verebilir → suppressHydrationWarning + tek-yönlü mount. (4) Kabul ölçütü: TBT ≥%40 düşer + görünüm/etkileşim birebir + anchor nav çalışır + SSR HTML'de bölüm içerikleri aynen (curl ile kontrol). Başarısızsa geri al (tek commit'te tut). ⚠️ Kullanıcı animasyon azaltmayı REDDETTİ — animasyonlara DOKUNMA; bu tur yalnız hidrasyon zamanlaması.

> 🖼️ **B2B (OEM/Kurumsal) BÖLÜMÜNE ARKA PLAN GÖRSELİ DESTEĞİ (2026-07-11, CANLI):** Kullanıcı fuar standı fotoğrafını B2B CTA bölümüne arka plan yapmak istedi (hafif karartma, tasarım/boyut bozulmadan, geri-alınabilir). **⚠️ Sohbete YAPIŞTIRILAN görsele DOSYA olarak erişilemiyor** (vision-only, diskte yok) → **sectionBgs mekanizması** kullanıldı (Reviews/Stats deseni; admin upload → Cloudinary → R2). `B2BCta.tsx`: `sectionBgs["b2bcta"]` okur; görsel VARSA → foto (`backgroundImage` cover) + **sola-koyu karartma gradyanı** `rgba(9,12,18,0.86→0.62→0.44)` + metin/kartlar AÇIK'a geçer (beyaz metin, koyu-cam kartlar `backdrop-blur`); görsel YOKSA → bölüm **ESKİ tasarımı AYNEN** (tam geri-alınabilir, boyut `py-14 sm:py-16` değişmez). `admin/page.tsx` "Bölüm Arka Planları" listesine `{ id:"b2bcta", label:"OEM & Kurumsal Satış (B2B)" }` eklendi. **KULLANICI AKIŞI:** admin → Bölüm Arka Planları → **OEM & Kurumsal Satış (B2B)** → Yükle (fuar fotosu) → Kaydet → canlıda görünür (admin save writeBin→revalidateTag, cache-bump GEREKMEZ). Geri al: aynı yerde **"Kaldır"**. ⚠️ Karartma çok/az olursa `B2BCta.tsx` overlay gradyan alpha'sı TEK-nokta ayar (hasBg bloğu). Fotoğraf varken `lightOnDark=true` → eyebrow/tag/kart okunur.

> 🩹🤖 **2 UI FIX (CANLI) + 2 AKSİYON AJANI (propose-mode) + YORUMLAR kullanıcıda (2026-07-10, commit abeaa55):**
> **(1) Kategori kartı footer (`Products.tsx`):** açıklama `line-clamp-2 + min-w-0 flex-1`, İncele `flex-shrink-0` + `gap-2.5` → dar/mobil kartlarda açıklamanın İncele tuşuna binmesi bitti (eski gap=0, açıklama 2-6 satıra taşıp tuşa değiyordu). **(2) DNA 2 CTA mobil (`DNA.tsx`):** mobilde `flex-col items-stretch` (tam-genişlik ortalı buton + altında ortalı link), `sm:flex-row` eski satır-içi düzen korunur → "buton alta kaymış" görüntüsü bitti. İkisi de canlı+preview'da doğrulandı (mobil+desktop, konsol 0 hata).
> **(3) 🤖 2 YENİ ZAMANLANMIŞ AKSİYON AJANI (propose-for-approval; kullanıcı "önce onaya sun" + "ikisi de" seçti):** mevcut 3 rutin RAPOR-only; bunlar TASLAK üretir ama SİTEYİ DEĞİŞTİRMEZ (commit/deploy YOK). **`aylik-bemis-haber-ajani`** (cron `0 9 5 * *`) — Bemis EV haber/fuar tarar, her linki WebFetch ile doğrular (uydurma yasak), press.ts formatında adayları `Desktop\Bemis_Raporlar\Haber_Onay.md`'ye yazar + bildirir. **`aylik-seo-geo-blog-ajani`** (cron `0 9 20 * *`) — içerik boşluğu bulup ONAYA HAZIR blog taslağı (posts.ts formatı) + SEO/GEO ham-HTML taraması → `Desktop\Bemis_Raporlar\Blog_SEO_Onay.md`. **ONAY AKIŞI:** kullanıcı "onayla/yayınla" deyince taslaklar bu 2 dosyadan alınıp press.ts / (posts.ts + llms.txt Rehberler + llms-full GUIDE_SLUGS)'a eklenip deploy edilir. ⚠️ Tool ön-onayı için kullanıcı bir kez "Run now" yapmalı (yoksa ilk çalışmada izin sorabilir).
> **(4) ✅ YORUMLAR GERÇEKLE DEĞİŞTİRİLDİ (CANLI):** eski `reviews.items` (6 uydurma: Mehmet K./Ayşe T…) + "4.9/500+" → **2 DOĞRULANMIŞ Hepsiburada yorumu** (11 kW Çantalı Taşınabilir Şarj Seti; İ.T. Şub2026 + M.C. Kas2025, 5★) + gerçek rozet **5.0 / 59** (Hepsiburada ürün sayfasından tavily ile doğrulandı: 58×5★+1×4★). **6 dilde** (TR/EN/DE/ES/AR/RU — gerçek çeviri, yıldız+platform evrensel). **YAPILAN:** (a) 6 repo dosyası (`data/content.json` TR+`_translations.en` + `content-{en,de,es,ar,ru}.json`) `scratchpad/apply-reviews-repo.cjs` ile; (b) **CANLI R2 `content` bin** base(TR)+`_translations.en` doğrudan yazıldı (`apply-reviews-r2.cjs`, yedek alındı; de/es/ar/ru bin'de YOK→repo overlay'den gelir); (c) **cache key `v5-dealer-desc`→`v6-reviews`** bump; (d) `PRODUCT_REVIEW_KEY` (seo.ts) BOŞALTILDI (uydurma per-ürün review şeması kaldırıldı). tsc 0 + brand guard temiz. ✅ **TRENDYOL DA EKLENDİ (CANLI):** 3. gerçek yorum **Onur D.** (Trendyol, Pro Mobile 11-22 kW, 6 Mart 2026, 5★) eklendi. Artık **3 yorum**, sıra `[M.C. HB, Onur D. TY, İ.T. HB]` → homepage `items.slice(0,2)` = **1 HepsiBurada + 1 Trendyol** çeşitlilik. Cache key `v6-reviews`→`v7-reviews-ty`. Rozet yine **5.0/59** (kullanıcı seçimi; 59=HB kablo doğrulanmış sayısı, marka-geneli trust rozeti). Yeni yorum eklerken: `scratchpad/reviews-data.cjs` R objesini güncelle → `apply-reviews-repo.cjs` + `apply-reviews-r2.cjs` tekrar çalıştır (env: `vercel env pull` bemis-server prod → çalıştır → **.env SİL**) → store.ts cache key bump → deploy. (İstenirse Pro Mobile ürün sayfasına gerçek review şeması ileride bağlanabilir; `PRODUCT_REVIEW_KEY` şu an boş.)

> ✍️✅ **VERİ-ODAKLI BLOG — 2 YENİ ALICI-NİYETLİ YAZI (2026-07-05, CANLI · commit fd1fb6d):**
> Kullanıcı "bekleyen blog işine başlayalım mı" + "veri-odaklı" dedi. ⚠️ **GSC/Ahrefs MCP plan-gated** ("Insufficient
> plan") → canlı GSC verisi çekilemedi; bunun yerine **mevcut 23 yazının kapsamından boşluk analizi** yapıldı. Kullanıcı
> AskUserQuestion'da 2 konu seçti (solar/işletmecilik/güvenlik/menzil'i ERTELEDİ). YAZILDI (2 paralel ajan + fact-review):
> **`evde-elektrikli-arac-sarj-maliyeti-km-basina`** (km başına maliyet formülü, %10 şarj kaybı, gece/çok-zamanlı tarife,
> benzinli kıyas — ⚠️ TÜM fiyatlar VARSAYIMSAL, uydurma fiyat/EPDK YOK) + **`monofaze-mi-trifaze-mi-ev-sarj`** (7,4 kW vs
> 22 kW, faz kararı, güvenlik→yetkili elektrikçi, ayarlanabilir Bemis Charger Plus/Pro 2). Gerçek Bemis specleri, rakip
> marka 0, tsc+build+guard temiz. Blog eklendi → sitemap+/blog OTOMATİK; **llms.txt Rehberler + llms-full GUIDE_SLUGS ELLE**
> eklendi (yeni blog eklerken bu 2'sini de güncelle). **⏳ KALAN blog serisi (istenirse):** güneş/solar şarj · şarj
> istasyonu işletmeciliği/gelir · evde şarj güvenliği · menzil/şarj sıklığı. **SEO NOTU (kullanıcı sordu):** çok-dilli
> çeviri **SEO'ya zarar VERMİYOR** ama doğrudan sıralama faydası da YOK (ayrı indekslenebilir /de/ /es/ URL yok → Google
> SSR=TR indeksliyor); fayda UX/dönüşüm. Dilleri SEO'ya çevirmek = ayrı URL+SSR+hreflang (ayrı orta-büyük iş). **Yeni TR
> blog = indekslenebilir = gerçek SEO getirisi** (bu yüzden blog önceliklendirildi).
> 🎯 **DİL SEÇİCİ KOMPAKT (commit f82bf43):** üst bar tetikleyicisi tam native ad yerine 2-harf KOD (TR/EN/DE) + küçük
> dünya ikonu (üst menüyü sıkıştırmasın); açılır listede tam adlar kalıyor. + **HERO dönen-kelime kutusu** artık canvas ile
> gerçek piksel ölçülüyor (eski (maxLen+1)ch 48px'te ~375px şişiriyordu → boşluk/satır bozuk) → kutu kelimeye tam oturur,
> her dilde temiz (commit c2a8d46). + Türkiye-odaklı hero/pazarlama yabancı dillerde GLOBAL'e çevrildi (bkz. dil cilası).

> 🌍✅ **6-DİL SİTE TAM ÇEVİRİ — CANLI (TR/EN/DE/ES/AR/RU; commit'ler c1efb10 + a762dc3 PUSH edildi, 2026-07-05):**
> Diller: TR/EN + **DE/ES/AR/RU**. Yöntem: kredi yok → **Claude paralel ajanla ELLE çevirir** (ücretsiz).
> ✅ **BİTEN + commit'li (c1efb10, henüz PUSH edilmedi):** (1) `data/i18n/ui.json` = **290 EN anahtar × de/es/ar/ru**
> (chrome + ürün/blog/döküman chrome'u). (2) **88 satır-içi `lang==="en"?EN:TR` üçlüsü → `pickText(lang,TR,EN)`**
> (9 dosya) + documents/* yerel `{tr,en}` dict'leri → `byLang` (locale/para-birimi üçlüleri korundu). (3)
> **`LanguageSwitcher.tsx`** — Navbar'daki TR/EN pill yerine **6-dilli açılır seçici** (bayrak+native ad; `app/lib/
> languages.ts` LANGS). (4) **Arapça `dir=rtl`** (LanguageContext effect) — canlı preview'da doğrulandı (htmlDir=rtl).
> tsc + rakip-marka guard temiz. Sözlük (a84d7c7) + blog (9d0a5b3) ZATEN 5 dilde canlıydı. **Yardımcılar:** `app/lib/
> ui.ts` `pickText(lang,tr,en)` [tr→tr·en→en·diğer→ui.json'dan, yoksa EN] + `byLang(map,lang)` [`{tr,en}` nesne-indeks].
> ✅ **CMS içerik overlay'i BİTTİ + CANLI (kullanıcı "CMS'i de çevir + birlikte yayınla" seçti):** Üst menü/hero/bölüm
> metinleri + 113 ürün **`/api/content?lang=` & `/api/products?lang=` & `/api/b2b?lang=`** ile SUNUCU tarafında; eskiden
> TR-dışı her dil → EN dönüyordu. **3 route GENELLEŞTİRİLDİ** (overlay kaynağı dile göre: `_translations[lang]` yoksa
> `data/<bin>-<lang>.json`; merge dil-bağımsız — **kimlik/marka alanları id/code/**name**/image/accent/href DAİMA TR'den**,
> yalnız açıklama/spec/özellik/tagline metni çevrilir). ✅ **`data/content-{de,es,ar,ru}.json` (4) BİTTİ + yapısal
> doğrulandı** (23 top-level key, derin shape birebir). ✅ **`data/products-{de,es,ar,ru}.json` BİTTİ** (16 ajan:
> 4 chunk[cables·charger-equipment·v2l+converters·wallbox+portable+accessories+dc-units] × 4 dil → `_wip_prod_<lang>_<n>`
> → `reassemble-products.cjs` kategori-id ile 8-sıraya dizdi + hiza ✓; 8 kat/113 ürün). ✅ **b2b overlay** (kaynak
> `data/b2b.json` TR → `data/b2b-<lang>.json`, 4 ajan) BİTTİ. **YAPILDI:** tsc + brand guard + `next build` temiz +
> preview'da 4 dil API + Almanca sayfa render doğrulandı → commit + PUSH (a762dc3). ⚠️ **Canlı R2 okur** ama overlay dosyaları
> REPO'da (deploy'la paketlenir) → R2 yazma/cache-bump GEREKMEZ (yapısal alanlar canlı TR base'den merge). ⚠️ Ürün
> ADLARI TR kalır (route `name`i TR'den zorlar — EN'de de böyle; tutarlı). ⚠️ Scriptler `scratchpad/`de (merge-ui,
> ternary-codemod, split/reassemble-products, validate-content). Pipeline (`npm run translate`) kredi gelirse tam-oto.
> ✅ **AKILLI HİBRİT OTOMATİK GÜNCELLEME (kullanıcı seçti, CANLI):** Artık admin'den TR içerik/ürün/b2b
> kaydedilince, **DEĞİŞEN alanlar** ücretsiz **MyMemory** ile 5 dile (en/de/es/ar/ru) otomatik çevrilir;
> **değişmeyen her şey premium çevirisini KORUR** (temel = bin `_translations[lang]` ?? `data/<bin>-<lang>.json`).
> Yani bedava + otomatik + mevcut premium kalite bozulmaz (yalnız yeni düzenlenen alanlar makine-kalitesinde).
> Motor: `lib/translate.ts` `TransLang` 6-dil + `contentTranslate.ts`/`productsTranslate.ts` `to` param (diff-aware
> reuse); admin route'ları (content/b2b `after()` 5-dil döngü; products EN shard bin + de/es/ar/ru products bin
> `_translations`). Runtime products route de/es/ar/ru için `_translations[lang]` ?? premium dosya okur. ⚠️ Ürün
> ADI/kod TR-kanonik (productsTranslate paths'te YOK — MyMemory model adı bozuyordu). tsc + next build temiz.
> 🎨✅ **DİL CİLASI — seçici + taşma + global metin (2026-07-05, kullanıcı geri bildirimi):** (1) **Dil seçici**
> `LanguageSwitcher.tsx` bayrak emoji → **dünya SVG ikonu + dilin kendi adı** (Windows'ta 🇹🇷→"TR" olup kodla "TR TR"
> tekrar ediyordu; artık "Türkçe/Deutsch/Русский/العربية…"). (2) **Taşma bug'ı:** çeviri ajanları bazı butonlara
> **240+ boşluk** eklemişti (ctaSecondary DE/RU 252 karakter → kutu bozuluyordu; content-en.json'da bile 6 alan!).
> `scratchpad/normalize-ws.cjs` tüm overlay dosyalarında yatay-boşluk dizilerini tek boşluğa indirdi + trim (27 alan).
> (3) **HERO + Türkiye-odaklı metinler → GLOBAL/kısa** (4 ajan, `reframe-source.json`→`patch-reframe.cjs`): "Türkiye'nin
> E-V Şarj Üreticisi" / "Yerli Üretim" → dünya-odaklı ("Производим E-V [Системы] по всему миру", "Zuverlässige E-V
> Lade [Systeme] Hersteller", AR "نصنع أنظمة بخبرة منذ 1994", ES "Fabricante de carga E-V a tu medida"); hero satırları
> TR uzunluğuna çekildi (≤~16 kr), dönen kelimeler ≤7 kr. Preview: RU+AR **horizOverflow=0**, AR dir=rtl, seçici native ad.
> ⚠️ **KURAL:** yabancı dillerde Türkiye-milliyetçi ifade ("yerli/Türkiye'nin/from Turkey") KULLANMA → global/Avrupa
> çerçeve (1994/Bursa/ihracat nötr-olgu olarak kalabilir). Reframe premium temelde → admin TR hero'yu düzenlemezse korunur.

> 🎯✅ **HERO DÖNEN-KELİME SATIR KAYMASI + CANLI EN İÇERİK DÜZELTME (2026-07-05, CANLI · commit c9c66ef):**
> Kullanıcı: EN hero'da dönen kelime uzayınca satır kayıyor (hiçbir dilde olmamalı) + "SİLİNECEK" diye kelime çıkıyor.
> **KÖK NEDEN:** (1) `Hero.tsx` `RotatingWord` `minWidth:5ch` idi → 5ch'ten uzun kelimede kutu büyüyüp satırı kaydırıyordu.
> (2) **Canlı R2 `content` bin'inin `_translations.en`'i bozuktu:** headline2Words = `["SİLİNECEK","Units","Sockets","wires"]`,
> headline3 = "Manufacurer" (typo). data/content.json fallback'i TEMİZDİ (Systems/Units/Sockets/Cables) → sorun yalnız R2'de
> (⚠️ **site R2 okuyor**, fallback değil — canlı `/api/content?lang=en` SİLİNECEK döndü). **FIX:** (1) RotatingWord kutu
> genişliği `${maxLen+1}ch` (o dilin en uzun kelimesi) → SABİT + kelime AKIŞ-İÇİ (baseline doğal; ⚠️ grid & absolute denendi
> → baseline 18-36px kaydı, in-flow min-width doğru çözüm). (2) `vercel env pull` (bemis-server prod) → R2 kimlik → geçici
> `scripts/_r2fix.ts` (recursive: SİLİNECEK'li dizi→temiz EN, Manufacurer→Manufacturer; yedek scratchpad/content-r2-backup.json)
> R2'yi düzeltti → script + pull'lanan secrets SİLİNDİ. (3) data/content*.json Manufacurer typo'su da düzeltildi. (4) ⚠️⚠️
> **`store.ts` okuma-cache anahtarı `v2-cloudinary` → `v3-hero`** — R2'ye DOĞRUDAN yazınca `readBin` `unstable_cache` (6 saat)
> eskiyi tutuyor; anahtar bump = deploy'da taze okuma. **DERS: R2 içeriğini doğrudan düzeltince cache anahtarını BUMP'la**
> (yoksa değişiklik 6 saat görünmez; writeBin'in revalidateTag'i sadece admin yolunda çalışır). ⚠️ **GÜNCEL cache versiyonu = `v4-address`** (2026-07-06 adres "Bursa OSB" R2 yazımında v3-hero→v4-address bump'landı; sonraki doğrudan-R2-yazımında yine bump'la).

> 🌍🔄 **ÇOK-DİLLİ ÇEVİRİ — KREDİ YOK → CLAUDE ELLE ÇEVİRİYOR (ücretsiz); SÖZLÜK 5 DİLDE BİTTİ (2026-07-04, uncommitted):**
> **DURUM:** API anahtarı GEÇERLİ ama Anthropic hesabında **kredi yok** (ilk `npm run translate` "credit balance too low" ile durdu). Kullanıcı krediyi "yapmayalım" dedi → **yöntem: "Ben çeviririm"** = Claude (Opus 4.8) sohbet içinde ELLE / paralel-ajanla çevirir, ücretsiz + en yüksek kalite; aynı JSON dosyalarını doldurur. **Oto-yenileme yarı-otomatik** (içerik değişince kullanıcı "güncelle" der, Claude çevirir). ✅✅ **SÖZLÜK 5 DİLDE BİTTİ** (EN elle + **DE/ES/AR/RU 4 paralel general-purpose ajanla**, hepsi ücretsiz/harness → `data/i18n/glossary.json`; 5×15 terim, `scratchpad/merge-glossary.cjs` ile birleştirilip doğrulandı — eksik/fazla/SSS-sayısı 0; tsc 0; rakip-marka guard temiz; temp `_wip_*.json` silindi). ⚠️ AC/DC dile göre değişik (DE/AR "AC" bıraktı, ES "CA", RU açık yazdı) — istenirse hepsi "AC/DC" yapılır. ✅✅ **BLOG 23 YAZI × 5 DİL BİTTİ** (`data/i18n/blog.json` + `app/lib/blogI18n.ts` `trBlogPost` merge katmanı [yapısal alanlar href/SVG/tarih HEP TR kaynaktan, yalnız metin çevrilir; hiza bozuksa o yazı TR kalır] + `BlogShell` bağlandı; **25 paralel ajan workflow + 5 ek ajan**, hizalama KUSURSUZ — misaligned 0, tsc/guard temiz; body/faq/related sayıları kaynağa birebir). ⚠️ Rate limit dersi: workflow'da 25 ajanı AYNI ANDA fırlatınca "server temporarily limiting" → **4'erli dalgaya böl** çözdü. ⏳ **SIRADA — UI ARAYÜZ i18n FAZI (BAŞLADI ama DERİN refactor → taze/odaklı oturum):** Kullanıcı "arayüz metinleri + seçici" seçti. **PREP YAPILDI (`app/lib/ui.ts` — commit'li):** `pickText(lang,tr,en)` [tr→tr · en→en · de/es/ar/ru→`ui.json`, yoksa EN] + `byLang(map,lang)` [nesne-indeks `{tr,en}[lang]` için, jenerik, EN-fallback] + `data/i18n/ui.json` (boş). **KAPSAM ÖLÇÜLDÜ:** (a) **106 `lang==="en"?EN:TR` üçlüsü / 14 dosya** (ProductDetailClient 27, BlogShell 19, DealerPickerModal 13, documents 12, ProductCategoryClient 9, Reviews 9, Navbar 6, Products 3…) → hepsi `pickText(lang,TR,EN)`'e (tr/en davranışı AYNI = güvenli). (b) **~16 `{tr,en}[lang]` indeks / 3 dosya** (Navbar 14: item.label/sub/cat.label/NAV_STRINGS.*; Footer 1: NAV_GROUPS; DealerApplyOverlay 1: STRINGS) → `byLang(...)`. ⚠️ **Lang'ı 6-union yapınca YALNIZ bu 3 dosya tsc kırar (21 hata)** — önce bunlar. **UYGULAMA PLANI:** 1) `LanguageContext` Lang'ı `languages.ts` `LangCode`'a (6) genişlet + localStorage 6 kabul + `<html dir=rtl>` (isRTL effect). 2) 3 dosyayı `byLang`'le düzelt → build yeşil. 3) 14 dosyanın 106 üçlüsünü `pickText`'e çevir. 4) benzersiz EN chrome dizelerini topla → 4 dile çevir (ajanla) → `ui.json` doldur. 5) **Navbar'daki TR/EN toggle'ı 6-dil seçiciye** çevir (LANGS `languages.ts`'te hazır: bayrak+native ad). 6) Arapça RTL CSS. **⚠️ Bu oturumda 6-union DENENDİ + GERİ ALINDI** (build kırıldı + oturum çok uzundu; `ui.ts` prep kaldı, `LanguageContext` orijinal tr/en'e döndü, tsc yeşil). Sonra **CMS** (ürün/içerik/b2b binleri de/es/ar/ru — MyMemory→AI). **DE/ES/AR/RU İÇERİK (sözlük+blog) HAZIR ama SEÇİCİDE YOK** — chrome+seçici bu fazda açılacak. Pipeline (`npm run translate`) kredi gelirse hâlâ tam-otomatik. ⚠️ Anahtar sohbete yapıştırıldı → iş bitince Console'dan REVOKE + üretim için yeni anahtar. **(altta pipeline kurulum detayları — referans):**
> 🌍⏳ **ÇOK-DİLLİ AI ÇEVİRİ PIPELINE'I KURULDU (2026-07-04, uncommitted):**
> Kullanıcı: "başka diller ekle, tüm siteyi eksiksiz+doğru çevir, her güncellemede kendini yenilesin." Diller
> **EN + DE + ES + AR + RU** (+ EN tamamla); kalite **AI çevirisi**; kapsam **tüm site**. Kullanıcı "A" dedi =
> Anthropic API anahtarıyla pipeline kur. **KURULDU + DOĞRULANDI (tsc 0, dry-run çalışıyor, runtime import OK):**
> `app/lib/languages.ts` (6 dil TEK KAYNAK, ar=rtl) · `lib/aiTranslate.ts` (Claude motoru, model env `TRANSLATE_MODEL`
> vars. **claude-opus-4-8**, EV-terminoloji sistem-prompt'u + korunan terimler Bemis/Type 2/CCS2/OCPP/kW... + rakip-marka
> yasağı + uydurma-yok) · `scripts/translate.ts` (`npm run translate`, oto-senkron: `data/i18n/.manifest.json` hash'le
> yalnız DEĞİŞENİ çevirir) · `data/i18n/glossary.json` (sözlük çevirileri; **glossaryI18n.ts artık BURADAN okur**, elle-
> yazılan 4 EN terim seed + backfill) · deps `@anthropic-ai/sdk`+`tsx`, npm script `translate`. Tam kılavuz:
> **`bemis-evcharge-website/TRANSLATION_PIPELINE.md`**. **PILOT = SÖZLÜK** (15 terim). Dry-run: EN 11 (4 seed atlandı),
> DE/ES/AR/RU 15'er = 670 metin. **🔴 ŞU AN AÇIK İŞ:** (1) **[KULLANICI] ANTHROPIC_API_KEY** (console.anthropic.com →
> `$env:ANTHROPIC_API_KEY="sk-ant-..."` → `npm run translate`; ya da kalıcı `setx` + ben çalıştırayım). Anahtar YOKKEN
> çeviri üretilemez (dry-run + backfill anahtarsız çalışır). (2) Anahtar gelince: `npm run translate` → sözlük 5 dile çevrilir
> → **commit** (glossary.json + .manifest.json). (3) SONRA: `SOURCES`'a **blog** (`posts.ts`) + **sayfa/UI dizeleri** +
> **CMS** (contentTranslate/productsTranslate'i MyMemory→bu motora + 5 dile yükselt, Vercel env ANTHROPIC_API_KEY). (4) EN
> SON: **dil seçici** (LanguageContext tr/en→6 dil + Navbar) + **RTL** (ar `<html dir=rtl>`) — çeviriler ÜRETİLDİKTEN sonra
> (yoksa boş/TR-fallback görünür). ⚠️ Şu an seçici hâlâ tr/en; kullanıcı yeni dilleri HENÜZ GÖREMEZ (kasıtlı sıralama).
> Maliyet (tek-sefer): sözlük ~$2 (Opus); tüm site ~$50-100 Opus / ~$15-25 Sonnet / ~$5-8 Haiku (TRANSLATE_MODEL ile
> seçilir). Oto-senkron sonrası güncellemeler = kuruş (yalnız değişen).

> 🔗✅ **SEO/UX turu — Teklif Al kaldırma + /contact redirect + footer crawlable + sitelink (2026-07-03/04, CANLI):**
> **(1) "Teklif Al" ürün sayfalarından KALDIRILDI** (commit 4717eb5): bayilerin talebi — buton müşteriyi doğrudan
> Bemis WhatsApp'ına bağlayıp bayileri atlıyordu. `ProductDetailClient.tsx`'te WhatsApp `<a>` + gereksiz waPhone/
> RiWhatsappLine/contact temizlendi; **"Bayi Bul" KALDI** (müşteri bayiye yönlenir). ContactBar (genel tel/e-posta)
> dokunulmadı. Kalan "Teklif Al" (productShowcase.ctaSecondary) = render-EDİLMEYEN orphan veri.
> **(2) /contact 404 → /iletisim 308 redirect** (commit 26d8ac0, `next.config.ts` `redirects()`): GSC "bulunamadı"
> veriyordu; gerçek sayfa /iletisim. Google URL'i productShowcase'in render-edilmeyen ctaSecondaryHref'inden yakalamış.
> Redirect + ContentContext default temizliği (/contact→/iletisim, "Teklif Al"→"Bayi Bul"). ⚠️ /contact hiç gerçek
> sayfa DEĞİL — /iletisim kullan.
> **(3) GSC "Sayfayı dizine ekleme": teknik iş YOK** — "alternatif sayfa/canonical" (6) NORMAL (Google kopya-eleme),
> "taranmış-eklenmemiş" (2) = otorite (off-site). Sadece 404 (=/contact) gerçekti, o da çözüldü.
> **(4) "Uygulama olarak aç" butonu (5.+ kez): site %100 TEMİZ** — canlı kesin denetim: manifest 0, /manifest.json+
> site.webmanifest+/manifest hepsi 404, mobile-web-app-capable 0, SW yok. Buton = **tarayıcının** (özellikle Edge)
> HER siteye sunduğu özellik; **kod ile kapatılamaz** (web standardı yok). Kanıt: google.com'da da aynı. ZARARSIZ.
> **(5) SİTELİNKS (OvoCRM gibi alt-sayfalı görünüm):** OTOMATİK — zorlanamaz, teşvik edilir (marka-sorgusu + otorite +
> #1). Bemis "bemis ev charge"de #1 → muhtemelen zaten temel sitelink alıyor. **YAPILDI:** (a) `/iletisim` çift-marka
> başlığı düzeltildi (commit 9ae216e — layout `%s | Bemis E-V Charge` şablonu + title'da marka = çiftti → title "İletişim").
> (b) **Footer nav'ı crawlable `<a href>` yapıldı** (commit cbc8742, `Footer.tsx`): eskiden `<button onClick=router.push>`
> (Google takip edemiyordu) → şimdi gerçek `<a href>` (canlı 29 iç-link, 8 anahtar sayfa) + onClick SPA/kaydırma korunur
> + ctrl-tık yeni sekme. Preview doğrulandı (görünüm AYNI, nav çalışıyor). ⚠️ **Navbar HÂLÂ router.push** (kasıtlı,
> "riskli" — değiştirme). Sitelink'in ASIL kaldıracı = off-site otorite (kullanıcı yürütüyor). **⛔ bemis.com.tr SEO
> spec'i** (ayrı endüstri sitesi, ajansa) → `Desktop\Bemis_ComTr_SEO_Duzeltme_Spec.md` (meta/H1/JSON-LD hazır).

> 🖥️✅ **GENİŞ EKRAN OPTİMİZASYONU + A-Z rapor (29.06) değerlendirmesi (2026-07-03, CANLI · commit a0372ba):**
> Kullanıcı: "geniş ekranlarda içerik ortada sıkışmasın, ekranı verimli kullan." **KÖK NEDEN:** site-geneli bölüm
> konteynerleri `max-w-7xl mx-auto` (1280px) → 1440p/4K/ultra-geniş monitörlerde ortada sıkışıp iki yanda geniş boşluk.
> **FIX (`app/globals.css`, TEK NOKTA):** iki-sınıf seçici `.max-w-7xl.mx-auto` ile kademeli genişleme →
> **2xl(≥1536px) 1600px, ultra-geniş(≥1920px) 1800px**. Dizüstü (<1536px) 1280px'de DEĞİŞMEDİ. İki-sınıf seçici YALNIZ
> bölüm konteynerlerini hedefler; **blog/sözlük gövde metni `max-w-3xl/5xl` kullandığı için ETKİLENMEZ** (okunabilirlik/
> satır uzunluğu korundu). **Preview ile doğrulandı** (dev 3942): 1366px=1280 (değişmez) · 1920px=1800 · 2560px=1800 cap
> (kenar 380px, eski ~640'a karşı) · yatay taşma YOK · konsol 0 hata · ürün grid 6 sütun geniş alanı kullanıyor. Üretim
> CSS'inde 2 media query teyit edildi. ⚠️ Wrapper deseni tek: `max-w-7xl mx-auto px-5 sm:px-6 lg:px-8` (18 bileşende);
> daha genişletmek istenirse globals.css'teki 1600/1800 değerlerini artır (blog prose max-w-3xl/5xl'e DOKUNMA).
> **A-Z RAPOR (kullanıcı 29.06 raporunu iletti):** on-site maddeleri **r6-r10 dalgaları + Cloudinary göçüyle ZATEN
> KAPANMIŞ** — canlı teyit: kategori `ItemList+CollectionPage` ✅, hero i.ibb.co=0 ✅, SVG diyagram canlı ✅ (raporun
> perf/görsel/schema/hreflang/og:image/NAP/review/additionalProperty maddeleri hep yapılmış; Wikidata P159 İstanbul→Bursa
> kullanıcı düzeltti). **Raporun kendi teşhisi:** "Bundan sonraki kazanç KOD DEĞİL, off-site otorite (DR 10)." Yani
> asıl darboğaz **off-site** (kullanıcı yürütüyor: off-site paketinde 1 ok, 2-3 yapıldı, 4-5 bekliyor). Kalan on-site =
> tiny/bloklu: **first-party video/VideoObject** (video kullanıcıda yok → multimodal tavan 80'de), /export SSR lang=en
> (route-group riski), JS bundle/ISR perf turu (ayrı/riskli). SERP 34 = düşük DR sonucu, içerik değil.

> 🤖✅ **GEO 3-FAZ İŞ — off-site paketi + CI guard + ticari-sorgu blogu (2026-07-03, CANLI · commit'ler 4c3e0c8/c350bde/4041fd7):**
> Kullanıcı 27.06 tarihli GEO rapor arşivini paylaştı; "değerlendir, aksiyon gerekirse seçmeli sor" dedi. **KRİTİK:
> rapor 6 gün eskiydi** — canlı doğrulandı, açık maddelerin ÇOĞU zaten kapanmış (sözlük mesh ✅, SVG diyagram ✅,
> rakip-marka 0 ✅ [anasayfadaki "2 abb" = `cursor-grabbing` yanlış-pozitifi], Wikidata %100 ✅). AskUserQuestion →
> kullanıcı **3 fazın hepsini** seçti. **YAPILDI:**
> **Faz 1 (off-site, kullanıcı uygular):** `C:\Users\sales\Desktop\Bemis_GEO_OffSite_Paketi.md` hazır — NAP kartı
> (Bemis Teknik Elektrik A.Ş. · Yeşil Cad. No:31, 16140 Bursa · +90 224 433 02 16 · info@bemisevcharge.com) + GBP
> tamamlama checklist + sektörel/ihracat dizin listesi (BTSO/TOBB/UİB/Europages/Kompass/TurkishExporter/pazaryeri) +
> PR açıları + bayi backlink şablonu + öncelikli takvim. **ASIL KALDIRAÇ artık burada** (on-site taban ~82, doygun).
> **Faz 2 (on-site şema):** ⚠️ **DÜRÜST BULGU — rapordaki HowTo-yayma + QAPage önerileri EKSİMİŞ** (Mayıs 2026: HowTo
> deprecated, FAQ rich-results emekli→AI-alıntı için tutulur, QAPage sadece gerçek kullanıcı-Q&A için). hasDocumentation
> da eklenmedi (dökümanlar ürüne değil kategoriye bağlı → zorlarsam yanlış şema). Gerçek kalıcı iş = **CI GUARD:**
> `scripts/check-no-competitor-brands.cjs` build script'ine zincirli (`node ... && next build`) → rakip marka
> (ABB/Schneider/Vestel/Easee/KEBA/Zaptec/Alfen/Tritium/Fronius/go-e) build'de bulunursa deploy DURUR (denetimlerin
> defalarca temizlediği regresyon bir daha gelemez). Jenerik "wallbox" hariç; ABB/KEBA büyük-harf duyarlı. Vercel'de
> guard'lı build başarılı geçti (teyit). Manuel: `npm run check:brands`.
> **Faz 3 (ticari-sorgu içeriği):** raporun ilk #1 boşluğu ("en iyi/hangi wallbox" ticari sorgularda Bemis yoktu).
> YENİ blog **`ev-sarj-cihazi-modelleri-karsilastirma`** (blog 19→20) — rakip adı GEÇMEDEN 3 gerçek spec-karşılaştırma
> tablosu: AC (Charger 2/Plus/Pro/Pro GSM), DC (BEVDC 40–200 kW), taşınabilir (Mini/Mono/Pro Mobile) + "kablolu mu
> pano prizli mi" + "hangi senaryoda hangi model" + 5 SSS (~90 kelime). TÜM spec'ler `data/products.json`'dan (uydurma
> YOK). Canlı doğrulandı: 200, 3 `<table>`, Article+FAQPage şema, sitemap+llms.txt+llms-full.txt. ⚠️ **DERS: hızlı
> ardışık 2 push'ta GitHub→Vercel webhook 2.'yi (c350bde) KAÇIRDI** → blog 404 kaldı; **boş commit** (`git commit
> --allow-empty` → 4041fd7) push'u deploy'u tetikledi, blog canlıya çıktı. (Ardışık push'larda deploy'u teyit et.)
> **⏳ KALAN: yalnız off-site (kullanıcı) + first-party video (video sende yok→bloklu).** Aylık GEO turu (ayın 15'i) izle.

> 🖼️✅ **TÜM GÖRSELLER i.ibb.co → CLOUDINARY'E TAŞINDI (2026-07-03, CANLI · commit'ler d3b91d4 + 30288a6):**
> Codex denetiminin işaret ettiği i.ibb.co (ücretsiz ImgBB) bağımlılığı TAMAMEN kaldırıldı. **94 benzersiz görsel
> BİREBİR (orijinal bayt, yeniden boyutlandırma/sıkıştırma YOK → kalite AYNI) `res.cloudinary.com`'a taşındı**
> (Cloudinary hesap: cloud **dmnttjyzm**, unsigned preset `CLOUDINARY_UPLOAD_PRESET`, folder `products`; env zaten
> vardı = dökümanlar için). **⚠️ KRİTİK ÖĞRENME:** görseller 3 KATMANDA duruyordu, hepsi taşındı: **(1) repo `data/*.json`
> fallback** (products/products-en/content/content-en — commit d3b91d4). **(2) R2 bin'leri = ASIL SERVİS EDİLEN** —
> admin save yapıldığı için R2'ye i.ibb.co tohumlanmıştı; site R2 okuyor, data/*.json fallback DEĞİL → R2 bin'leri de
> güncellendi (`bins/products.json`+`content.json`+`productsEn.json`: R2'den oku → SADECE görsel URL'leri Cloudinary'e
> çevir → geri yaz; diğer TÜM admin verisi korundu; yedekler alındı). R2 içinde **9 görsel kullanıcının BUGÜN admin'den
> yüklediği YENİ ürün fotoları** idi (i.ibb.co'ya gitmişti; onlar da taşındı → kullanıcının yeni fotoları canlıda Cloudinary'de).
> **(3) Kod:** `Navbar.tsx` 8 kategori thumbnail + `layout.tsx` preconnect i.ibb.co→res.cloudinary.com. **CACHE-BUST:**
> `readBin` `unstable_cache` (Vercel Data Cache) eski i.ibb.co'yu 6 saat tutuyordu (redeploy TEMİZLEMEZ) → **cache anahtarı
> sürümlendi** `["store",name]`→`["store",name,"v2-cloudinary"]` (commit 30288a6) = tek-seferlik miss = R2'den taze okuma;
> aynı redeploy statik sayfaları da taze R2 ile pişirdi. **✅ CANLI DOĞRULANDI:** /api/products + /api/content + anasayfa +
> /products/wallbox + /products/portable HTML'de **i.ibb.co = 0**, Cloudinary = 100+; next/image optimizer Cloudinary'i
> kabul ediyor (200, AVIF/WebP). **✅ ADMIN UPLOAD ROTASI DEĞİŞTİ** (`app/api/admin/upload/route.ts`): YENİ görsel
> yüklemeleri artık **Cloudinary `/image/upload`** (ImgBB yalnız yedek, env yoksa) → i.ibb.co bağımlılığı yeni yüklemelerde
> de bitti. ⚠️ **KALAN/NOT:** (a) `next.config` remotePatterns'te i.ibb.co KASITLI duruyor (ImgBB fallback güvenliği). (b) İlk
> migration turu verify-adımı Windows `%{http_code}` bug'ıyla fail olunca 62 orphan Cloudinary upload oldu (zararsız, free tier;
> unsigned preset'te silinemez). (c) repo `data/products.json` fallback'i o 9 admin-yeni-fotoyu içermiyor (eski-ama-Cloudinary
> fotolar) — R2 (asıl servis) kullanıcının yenilerini gösteriyor; fallback yalnız R2 boşalırsa devreye girer. ⚠️ **DERS:**
> görsel/veri değişikliği canlıya yansımıyorsa SADECE data/*.json değil **R2 bin'lerini de** güncelle (`readBin` R2 okur) +
> cache anahtarını bump'la; R2'yi doğrudan okumak/yazmak için store.ts deseni (S3 SDK, `bins/<name>.json`, env R2_*).

> 🔴🔴 **BLOB DEPOSU ASKIYA ALINMIŞ → TÜM ADMİN KAYITLARI FAIL (2026-07-02, KESİN TEŞHİS · Vercel canlı log):**
> Kullanıcı şarj cihazı görsellerini admin'den değiştiremiyor ("Kayıt başarısız"). **Vercel log KESİN kanıt:**
> `POST /api/admin/products 500 — Vercel Blob: This store has been suspended.` (bugün 09:19–09:25 onlarca 500).
> Yani aylardır not edilen Blob kota/token sorunu SONUÇLANDI: **Blob store SUSPENDED.** `writeBin`→`put`→reddediliyor
> → 500 → **tüm admin saves (ürün/içerik/bayi/döküman) FAIL** (hepsi Blob'a yazıyor). Site ÇALIŞIYOR (data/*.json
> fallback). **✅✅ ÜCRETSİZ ÇÖZÜLDÜ — VERİ KATMANI BLOB→CLOUDFLARE R2'YE TAŞINDI (kod, commit 24cee9a):**
> `lib/store.ts` `readBin/writeBin` artık **@aws-sdk/client-s3 ile R2** kullanıyor (Get/PutObject). R2 free tier ÇOK
> cömert (10GB + milyonlarca işlem) → kota/suspension sorunu YOK. R2 zaten entegreydi (döküman yüklemeleri, env
> mevcut: `R2_ENDPOINT/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET`; canlıda 3 döküman r2.dev'den servisleniyor).
> readBin R2'de bin yoksa (ilk anda hepsi boş) `data/*.json` yedeğine düşer → **site çalışmaya devam** (canlı: 200,
> 8 kategori). İlk admin SAVE her bin'i R2'ye tohumlar → sonraki okumalar R2'den. ⚠️ **GÜVENLİK:** r2.dev bucket'ı
> PUBLIC → `messages` (iletişim PII) R2'ye YAZILMIYOR (writeBin guard; form yine Resend e-posta gönderiyor; private
> bins bucket'ı kurulunca guard kalkar). **Vercel Blob'a Pro/yeni-store GEREK YOK — Blob tamamen bırakıldı.**
> **⚠️ KULLANICI TEST ETMELİ:** admin → ürün görseli değiştir → KAYDET → artık "kaydedildi" demeli (Blob değil R2'ye
> yazar). Ayrıca admin ürün-kayıt hatası artık gerçek sebebi gösteriyor (58167d3). ⚠️ **YENİ KURAL:** veri = R2 (Blob DEĞİL);
> lib/store.ts R2 adaptörü; yeni bin eklerken BINS set'ine ekle.


> 🚀 **HERO LCP KÖK-NEDEN FIX (Codex dış-denetim → mobil LCP 21.5s) (2026-07-02, CANLI · commit 01316e2):**
> Kullanıcı ChatGPT-Codex analiz raporu paylaştı (mobil Lighthouse **49/100**, LCP **21.5s**, LCP öğesi = hero
> paragrafı). **KÖK NEDEN BULUNDU + DÜZELTİLDİ:** Hero H1/paragraf/logo `motion` **`initial:{opacity:0}`** ile
> başlıyordu → SSR'da görünmez, **JS hidrasyonuna kadar boş** → yavaş mobil JS'te LCP 21s. FIX (`Hero.tsx`): 6 hero
> üst-kısım öğesinden (3 mobil + 3 masaüstü) **`opacity:0` kaldırıldı**, y-kayma animasyonu KALDI → metin SSR'da
> ANINDA görünür (LCP≈FCP ~3.8s). Canlı doğrulandı: hero 5 öğesi opacity:0-suz (accent-bar bilerek kaldı; kalan
> opacity:0'lar ekran-dışı whileInView bölümler = normal). ⚠️ Görsel: hero fade-in gitti, kayma kaldı (kabul). **Codex
> raporu YENİ bulgular (kalan, taze oturum):** (a) JS bundle böl — 519KB unused JS (framer + `17r_1domwcj4v.js`);
> user animasyon-azaltmayı reddetti ama edit-mode/overlay split denenebilir. (b) ⚠️ **TR/EN karışımı** (footer/ürün
> vitrini/testimonial'da İngilizce metin). ✅ **KISMEN DÜZELTİLDİ (d430c55):** `categories.wallbox.name`
> 'AC Wallbox Chargers'→'AC Wallbox Şarj İstasyonu', `portable.name` 'AC Mobile Chargers'→'Taşınabilir Şarj Cihazı'
> (TR kartlar/navbar Türkçeleşti, canlı). ✅✅ **EN OFF-BY-ONE DÜZELTİLDİ (099efae):** 8 kategori EN `name`+`subtitle`
> +1 kaymıştı (her kategori bir SONRAKİNİN EN'ini gösteriyordu; wallbox EN'i kayıp, dc-units duplike) — HER İKİ kaynakta
> (gömülü `_translations.en` + `content-en.json`) doğru geri-hizalandı; wallbox EN yeniden yazıldı ("AC Wallbox Chargers"),
> "Overtime"→"Extension" düzeltildi. ⚠️ FAQ ZATEN doğruydu (kaymamış) → dokunulmadı. Canlı doğrulandı. **footer/
> testimonial/vitrin İngilizce KONTROL EDİLDİ → TEMİZ** (İngilizce YOK; Codex bu bulguda da font gibi imprecise). **✅ TR/EN
> ITEM TAMAMEN BİTTİ.** ⏳ **KALAN (kaliteyi riske atmadan yapılamaz, taze/dikkatli oturum):** JS split (framer=görsel risk;
> edit-mode weaving=riskli) + i.ibb.co 112 görsel self-host (yanlış giderse KIRIK görsel = kalite düşer). (c) i.ibb.co ürün
> görsellerini self-host (112 görsel, büyük migrasyon). (d) YouTube facade (poster+tık) = Lighthouse skorunu daha çok
> artırır ama autoplay-passive UX değişir (SOR). **Codex FONT bulgusu YANLIŞ:** Roboto/Google Fonts YOK (0), next/font
> Inter self-hosted zaten. **Zaten yapılmış (Codex tekrar önerdi):** YouTube scroll-lazy, content-visibility, meta,
> blog→ürün iç link, çapraz-link, 3 blog, llms/llms-full.


> ✍️ **SON-KULLANICI SEO BLOG SERİSİ + PWA (kesin) + AI-Bakışı link (2026-07-02, CANLI · commit 75b988a/076a806):**
> Kullanıcı: "üretici" GEÇMEYEN alıcı-cümleleri hedefleyen bloglar ("elektrikli araç şarj kablosu / şarj cihazı /
> ev şarj ünitesi / şarj kablosu ac"). Plan (AskUserQuestion): **3'ünü de sırayla** — (1) 2-3 amiral rehber →
> (2) kategori/ürün sayfalarını bu cümlelere göre güçlendir → (3) 5-6'lık seri. **YAPILDI (#1'in ilk 2'si, CANLI+
> doğrulandı, FAQPage+Article şema, sitemap+/blog listesinde):** `elektrikli-arac-sarj-kablosu-kac-metre-kac-amper`
> (16A/32A, monofaze 7,4kW/trifaze 22kW, 5-7-10m, onboard limit) + `ev-sarj-unitesi-mi-tasinabilir-sarj-cihazi-mi`
> (wallbox vs portable karar rehberi). Uydurma spec YOK, rakip marka YOK, iç link (cables/wallbox/portable/uretici).
> **+ 3. yazı CANLI:** `elektrikli-arac-sarj-kablosu-disarida-yagmurda-kullanilir-mi` (IP54/65/66 dış-kullanım/yağmur —
> alıcı merak konusu). **✅ PLAN #1 TAMAM (3 amiral rehber canlı+doğrulandı).** **⏳ KALAN: PLAN #2 (kategori/ürün
> sayfalarını bu cümlelere göre güçlendir — /products/cables + /uretici) → PLAN #3 (5-6'lık geniş seri).**
> **PLAN #2 BAŞLADI (meta adımı, canlı d9af638):** `CATEGORY_SEO` (lib/seo.ts) desc'leri artık **alıcı-cümlesiyle
> başlıyor** ("Elektrikli araç şarj kablosu…", "Ev şarj ünitesi…", "Taşınabilir elektrikli araç şarj cihazı…") — eskiden
> "Bemis yerli üretim…" ile başlıyordu; başlıklar zaten alıcı-cümlesiydi. Bemis entity+specs korundu. **+ llms.txt
> (93dd47c):** 3 yeni blog `app/llms.txt/route.ts` Rehberler'e + **`app/llms-full.txt/route.ts` `GUIDE_SLUGS`'a** (tam
> gövde, c80ed1c) eklendi (İKİSİ DE ELLE liste — otomatik değil! yeni blog eklerken GUIDE_SLUGS + llms.txt'e de ekle;
> canlı doğrulandı). Artık yeni bloglar sitemap+llms.txt+llms-full.txt = tam AI keşif/alıntı kapsamı. **⏳ KALAN PLAN #2:**
> kategori sayfası GÖVDE içeriğini zenginleştir + 3 yeni blogu kategori/uretici sayfalarından çapraz-linkle (topikal
> otorite → AI-Bakışı kaynak-seçimi). **✅ ÇAPRAZ-LİNK YAPILDI (b613a57):** `ProductCategoryClient`'e FAQ'tan sonra
> **"İlgili Rehberler"** bloğu (IIFE, TR-only, `GUIDES` kategori→blog haritası: cables/wallbox/portable/dc-units/v2l-c2l);
> bloglar zaten kategorilere linkliydi → mesh çift-yönlü oldu, canlı doğrulandı. **✅ PLAN #2 TAMAM** (meta + llms +
> llms-full + çapraz-link). **⏳ KALAN: yalnız PLAN #3** = 5-6'lık yeni blog serisi (şarj cihazı çeşitleri, AC şarj nedir,
> evde şarj maliyeti vb. — ⚠️ mevcut ~22 yazıyla ÇAKIŞTIRMA; yeni içerik = taze bağlam işi). Blog eklemek = `app/blog/
> posts.ts` BLOG_POSTS başına ekle (slug/title/description/excerpt/category/datePublished/readingMinutes/keywords/
> body[p·h2·ul·cta]/faq[~90kelime]/related) → /blog+sitemap+JSON-LD otomatik. **⛔ PWA (4. kez, KESİN):** site %100
> temiz (manifest yok, SW yok, 5 endpoint 404, web-app-capable meta yok). Gördüğü "uygulama olarak indir" =
> **Chrome'un HER sitede sunduğu "sayfayı uygulama yap"** (google.com dahil); **kod ile kapatılamaz** (web standardı
> yok). NoAppInstall zaten ekli. theme-color/apple-touch-icon kaldırmak Chrome'u DURDURMAZ + legit → yapılmadı.
> **🎯 AI-Bakışı:** "elektrikli araç şarj kablosu yerli üretici"de Bemis **EN ÜSTTE** (entity işi tuttu) ama LİNKSİZ;
> rakipte link var çünkü Google onların ürün sayfasını KAYNAK seçmiş. Link zorlanamaz; blog+sayfa güçlendirme
> (plan #2/#3) alıntı-kaynağı seçilme ihtimalini artırır (dolaylı yol).

> ⚡⚡ **PERF 2. RAUND — YOUTUBE LAZY (ASIL SUÇLU) + GTM lazyOnload (2026-07-01, CANLI · commit 7c22ac6, Fable 5):**
> PageSpeed derin döküm: **6MB'lik yükün ~%80'i (~4.9MB) = DNA bölümü YouTube arka plan videosu** (googlevideo
> 3.8MB + player JS 1.1MB) İLK YÜKTE otomatik iniyordu; ayrıca LCP elementi görsel değil **H1 başlık** (animasyon
> opacity-0 → JS bekliyor). **KULLANICI SEÇİMİ (AskUserQuestion):** YouTube-lazy ✓ + GTM geciktir ✓ + küçük
> temizlikler ✓; **LCP-H1 fix REDDETTİ** (mikro görünür fark istemedi). **YAPILDI:** (1) `useNearViewport` hook'u
> (`useBackgroundVideo.ts`) — kutu viewport'a 600px yaklaşınca `near=true` (IO yoksa eager fallback); **DNA +
> /kurumsal** video iframe'i artık `videoNear` gate'li → player sayfa açılışında İNMEZ, poster+autoplay akışı
> birebir aynı. (2) `GoogleAnalytics`: gtag.js+config **lazyOnload** (consent stub afterInteractive kaldı →
> dataLayer kuyruklanır, veri kaybolmaz). CANLI KANIT: SSR HTML'de youtube-nocookie **0** + gtag **0** (önce 1'er).
> (3) 43KB ham i.ibb.co görseli: optimizer SAĞLIKLI (AVIF 200 döndü); ham iniş content-JSON yan kullanımı →
> kovalanmadı (kazanç küçük). Legacy-JS 12KB browserslist işi ATLANDI (tüm-bundle regresyon riski > kazanç).
> **SEO/GEO HIZLI DOĞRULAMA (drift): TEMİZ** — Org şema + Wikidata/GBP sameAs + hreflang tr/en/x-default +
> llms/sitemap/robots 200 + sözlük DefinedTerm/FAQ/seeAlso/SVG + ürün Product/AggregateRating/Review/ImageObject ✓.
> ⓘ Fable 5 token: ayrı kova YOK, "all models"ten düşer (3.-parti kaynak, resmi doc erişilemedi; Settings→Usage kesin).

> ⚡ **PERF / PageSpeed mobil — globe mobil-2D + EImage lazy (2026-07-01, CANLI · commit 2a93374):**
> Kullanıcı PSI mobil paylaştı. Yerel Lighthouse: mobil **28/100** (LCP 16.5s, TBT 5.3s, ~6MB, ana-iş 36.7s —
> ⚠️ yerel makinede şişkin olabilir; teşhis kesin: **JS + görsel ağır anasayfa**). Config ZATEN optimize (brotli
> 382→68KB, AVIF, kod-böl, 30g cache, Sentry Replay çıkık, TTFB 0.31s). **KULLANICI ONAYI:** geç-yükleme + görünmez
> kazanımlar + globe→mobil-statik; **animasyon/hero'ya DOKUNMA** (reddetti). **YAPILDI:** (1) `DealerNetwork` mobilde
> (≤767px) worldRender VARSAYILAN **"2d"** → react-globe.gl (three.js/WebGL/4K doku) mobilde İNMEZ (globe zaten
> "Dünya" sekmesine ertelenmiş = ilk skoru değil mobil-Dünya'yı hafifletir; masaüstü 3D aynen, toggle duruyor).
> (2) `EImage` (içerik görsel bileşeni) `loading=lazy`+`decoding=async` → ekran-dışı içerik görselleri geldikçe
> yüklenir (canlı 25 lazy img); LCP hero'da (next/image) → etkilenmez. (3) **`SectionWrapper`** (index≥1)
> **`content-visibility:auto`** + `contain-intrinsic-size:auto 900px` (commit d72740c) → ekran-dışı **10 bölümün**
> render/paint/layout maliyeti atlanır (1900+ DOM); mevcut `contain:layout style paint`'i genişletir. İlk bölüm
> (index 0) hariç = folda yakın/LCP. Canlı doğrulandı: HTML'de 11 `contain:` / **10 content-visibility** + anchor
> id'leri (#dealer/#calculator/#products/#dna) DURUYOR → SSR/SEO/navigasyon/görünüm korundu; desteklemeyen tarayıcı
> yok sayar (güvenli degrade); anchor render'ı scrollIntoView+retry tetikler. **ⓘ KALAN İLK-SKOR KALDIRACI:**
> animasyon azaltma (kullanıcı REDDETTİ) VEYA gerçek `ssr:false` per-bölüm lazy (anchor/SEO riski, dikkatli tur).

> 🖼️ **REFERANS PROJE ODAKLARI (data'ya gömüldü) + KARANLIK KART ZEMİNİ YUMUŞADI (2026-07-01, CANLI · commit 2ed4bb1):**
> **(1) Referans projeler "revert" bug'ı:** admin'den `imagePos` (odak) ayarı KALMIYOR. KÖK NEDEN = **Blob bozuk**
> (apeiron token); site `data/content.json` okuyor, admin Blob'a yazıyor → yansımıyor → center'a döner. ⚠️ Blob
> düzelene kadar admin kalıcı DEĞİL. GEÇİCİ ÇÖZÜM: 3 referans görseline `imagePos` **`data/content.json`'a GÖMÜLDÜ**
> (TR + `_translations.en`): ref0 duvar `"50% 42%"` / ref1 showroom `"50% 45%"` / ref2 gece `"50% 40%"` (canlı
> doğrulandı, özneler görünür). Yeni odak istenirse `referenceProjectsSection.items[].imagePos`'a göm (Blob'a yazma).
> **(2) Karanlık mod kart zemini:** bir önceki tur ürün-kartı görsel alanı açık `#f3f4f6` HER modda idi → dark modda
> çok STARK. Artık **mod-koşullu**: dark `#dbdee3` (yumuşak) + accent tint biraz fazla, light `#f3f4f6`; bottom-fade
> de dark zemine uyumlandı (`ProductCategoryClient` + `ProductsClient`). Canlı ✓.
> **(3) ⚠️ ADMIN KAYDI CANLIYA YANSIMIYOR — KULLANICI TARAFINDAN TEYİT EDİLDİ (önemli):** kullanıcı MC2 bayisinin
> iletişimini admin'den değiştirip kaydetti ama ana sayfada düzelmedi. KÖK NEDEN = aynı **Blob bozuk** sorunu (admin
> Blob'a yazıyor, site `data/*.json` fallback okuyor). ⚠️ Bu SADECE bu bayi değil — **TÜM admin düzenlemeleri
> (ürün/içerik/bayi) canlıya yansımıyor** (Blob token apeiron store'a bakıyor). Kalıcı çözüm = Vercel'de doğru bemis
> Blob store'unu yeniden bağlamak (dev/infra, KULLANICI). O düzelene kadar değişiklikler koda/veriye elle işleniyor.
> MC2 örnegi ÇÖZÜLDÜ (commit c3272bc, `data/dealers.json`): whatsapp `05550862226→05550862227`, email
> `satis@mc2enerji.com` eklendi (telefon+website korundu); canlı `/api/dealers` doğrulandı. ⚠️ Bayi düzenlemesi =
> `data/dealers.json` (şehir→dealers[]); EN kopyası yok.

> 🎯 **HERO ODAK NOKTALARI + KART GÖRSELİ AÇIK ZEMİN + "UYGULAMA YÜKLE" (2026-07-01, CANLI · commit'ler ec0b66c/2fa9e6e):**
> Kullanıcı: "görsellerin çerçeveye oturması + odak noktaları doğru yeri göstersin; ürün kartı görselleri çerçeveye uyumlu olsun."
> **(1) bg-hero ODAK:** `CATEGORY_HERO_FOCUS` kod-haritası (object-position) — geniş-kısa hero object-cover üst/altı
> kırpar, dikey Y özneyi ortalar: portable `"50% 38%"` · cables `"50% 40%"` · dc-units `"50% 42%"` · v2l-c2l `"60% 50%"`
> (hepsi CANLI Playwright ile doğrulandı, özneler net görünüyor). `CategoryMeta`'ya `descImagePos?` eklendi (admin override).
> **(2) ⚠️ wallbox → SPLIT'e ALINDI:** wallbox fotosunda duvar cihazı SOLDA; sol-hizalı metin gradyanı örtüyordu
> (canlı doğrulandı; odakla DÜZELMEZ çünkü tam-genişlik görünür = yatay kaydırılamaz) → `splitByDefault`'a eklendi
> (çerçeveli görsel cihazı NET gösteriyor, canlı ✓). **bg-hero artık 4:** portable/cables/v2l-c2l/dc-units. **split:**
> converters/accessories/**wallbox** + charger-equipment(whiteHero). **(3) ÜRÜN KARTLARI = AÇIK ZEMİN:** kart image
> alanı dark modda KOYU idi (#1c1c1f) → beyaz-zeminli ürün fotoları beyaz blok / şeffaflar koyuya karışıyordu (TUTARSIZ).
> Artık HER modda açık zemin (`#f3f4f6`) → tüm ürün fotoları tek tutarlı yüzeyde, net (K3 "açık inner-card"). Badge metni
> (`accent`) + bottom-fade açık zemine uyumlandı. `ProductCategoryClient` + `ProductsClient` (kategori + tüm-ürünler). Canlı 4/4 ✓.
> **(4) "UYGULAMA OLARAK YÜKLE" tuşu:** kullanıcı yine gördü. TARAMA: site %100 temiz (manifest yok, SW yok, /*.webmanifest
> = 404, beforeinstallprompt/serviceWorker kodu yok, pwa/workbox paketi yok) → önceki kaldırma sağlam. Buton = TARAYICININ
> KENDİ özelliği (özellikle **Edge** adres çubuğunda her sitede "uygulama yükle" gösterir — site KALDIRAMAZ). Ek güvence:
> `NoAppInstall.tsx` (layout) → `beforeinstallprompt` preventDefault + eski SW unregister (yine de residual buton = tarayıcı).

> 🖼️ **KATEGORİ HERO = TAM-BLEED ARKA PLAN (sahne fotolu kategoriler) (2026-07-01, CANLI · commit feebac8):**
> Kullanıcı önce cables'ta denedi+beğendi (`670fd2a`), sonra "kaldığın yerden devam" → **sahne fotolu TÜM
> kategorilere** yayıldı. `ProductCategoryClient.tsx` hero artık koşullu: **bgHero** (tam-bleed `object-cover`
> arka plan + sol→sağ koyu gradyan + üstüne beyaz eyebrow/H1/tagline/açıklama) vs **split** (klasik yan-yana,
> başlık sol + çerçeveli görsel sağ). **bg-hero (5):** wallbox·portable·cables·v2l-c2l(kamp)·dc-units(DC+Tesla
> sahnesi). **split (3):** converters(uzatma kablosu) + accessories(şarj çantası) = ÜRÜN fotosu beyaz zemin →
> tam-bleed'de kötü durur; charger-equipment = whiteHero (şeffaf PNG) zaten hariç. Karar görselleri TEK TEK
> görerek verildi (foto kaynağı incelendi). **Mantık:** `productPhotoCategory=converters|accessories`;
> `heroStyleResolved = categories[id].heroStyle ?? (productPhotoCategory?"split":"bg")` → **admin `heroStyle`
> ayarı DAİMA öncelikli** (ileride per-kategori UI). `CategoryMeta`'ya `heroStyle?:"split"|"bg"` eklendi
> (ContentContext.tsx). ⚠️ **BUILD FIX:** önceki `c4061a0` deploy FAIL idi (`heroStyle` CategoryMeta tipinde
> yoktu = TS2339) → `feebac8` düzeltti (tsc 0, Vercel success). Canlı doğrulandı (Playwright): dc-units bg-hero
> ✓ + converters split ✓. Bir kategoriyi çevirmek = `productPhotoCategory`/kod-varsayılanına 1 kelime (veya
> Blob düzelince admin `heroStyle`). ⚠️ Tam admin-panel kontrolü Blob-write düzelmesini bekler (apeiron token sorunu).
> ⚠️ Ayrıca bu turda: ürün grid'leri 2xl'de `max-w-[1600px]`+`2xl:grid-cols-6` (geniş ekran adaptive); portable kart-boyutu
> bug'ı düzeldi (`w-full`). Değişen: `ProductCategoryClient.tsx`, `ProductsClient.tsx`, `ContentContext.tsx`.

> 🎨 **GÖRSEL/TASARIM DENETİMİ (2026-06-28f) — skor 58/100 (seo-visual ajan + kod):**
> **TEŞHİS EDİLEN (ama GERİ ALINDI — kullanıcı "sadece değerlendir, değişiklik yapma" dedi):** **K2 iletişim haritası**
> = BUG: `<iframe src=google.com/maps?output=embed>` var ama CSP `frame-src`'te google.com YOK → tarayıcı blokluyor
> (boş alan). FIX 1 satır (next.config frame-src'e `https://www.google.com https://maps.google.com` ekle) — uygulandı,
> doğrulandı (CSP header'da göründü), sonra kullanıcı isteğiyle GERİ ALINDI. Onay verilince anında re-apply. ⚠️ ŞU AN
> kullanıcı yalnız DEĞERLENDİRME istiyor, hiçbir görsel/kod değişikliği YAPMA. **AÇIK DESIGN KARARLARI (kullanıcıda, ben tek-taraflı redesign yapmadım):**
> **K1 (kritik) tema tutarsızlığı** — site %60 KOYU (ana/products/kurumsal) ama sözlük/blog/export AÇIK/beyaz →
> "siteyi değiştirdim mi?" hissi; sistematik kural lazım (hep-koyu / hep-açık / koyu-nav+açık-içerik hibrit).
> **K3 ürün listesi** kart ayırt-edilebilirliği düşük (koyu kart+koyu ürün foto → kayboluyor; açık inner-card öneri).
> **O4 buton sistemi** tutarsız (kırmızı dolgu / mavi outline / yeşil badge — 3 aksiyona 3 renk). **DİĞER quick-win:**
> mobil çerez-popup iletişimi örtüyor (O1), mobil ürün foto küçük ~200px (O2), export ortada boş alan (O3), footer
> sosyal ikon <48px dokunma (K01), blog hero görseli yok (K02). **TEMEL:** tasarım token'ı YOK → renkler inline
> hardcoded (178× #3b82f6) → açık-mod ~30 `!important` override yaması (kırılgan ama public orphan az: navbar/layout
> theme-aware). Marka: kırmızı **#E31E24** (gradient-text) + mavi **#3B82F6** (enerji, baskın). SVG diyagramlar render OK.


> 🔧 **SVG DİYAGRAM YERLEŞİM DÜZELTMESİ (2026-06-28d, CANLI):** 3 teknik SVG önce SADECE blog postlarındaydı;
> denetim `/sozluk/*` bekliyordu (orada `<text>`=0, `<figure>`=0). **KÖK SEBEP = yanlış route** (render/client/
> deploy hatası DEĞİL — GlossaryClient "use client" ama statik JSX'i SSR'lanıyor; FAQ/tanım ham HTML'de). **FİX:**
> SVG'ler `app/lib/diagrams.ts` **TEK KAYNAK**'a alındı (`DIAGRAM_TYPE2_CCS2/MOD23/DLM`) → `glossary.ts` 4 terime
> (`type-2`, `ccs2`, `mod-2-mod-3`, `yuk-yonetimi-dlm`) `diagram` alanı + `GlossaryClient` term-mode'a
> `<figure>`+svg(dangerouslySetInnerHTML)+`<figcaption>` (server-render → ham HTML'de `<text>` etiketleri). Blog
> inline kopyalar DEDUP EDİLDİ → `posts.ts` artık `diagrams.ts`'ten import ediyor (`{type:"figure", ...DIAGRAM_X}`);
> `diagrams.ts` GERÇEK tek kaynak (yalnız orijinal AC/DC figürü blog'da inline kaldı). tsc 0 + next build 0 (sözlük ● SSG).


> 🟦 **TIER 1 ON-SITE (mesh + FAQ + manifest + ImageObject) (2026-06-28c, CANLI):**
> Kapsamlı TIER planının TIER 1'i. **1.3 İÇ-LİNK MESH (en değerli):** `glossary.ts` → `TERM_SEE_ALSO`
> haritası (terim↔terim); `definedTermSchema(t, seeAlso)` → `seeAlso` JSON-LD; `GlossaryClient` term-mode'a
> görünür **"İlgili Terimler"** + **FAQ** blokları; `productSchema` → **`about`→DefinedTerm** (`CATEGORY_TERM`
> haritası: wallbox→wallbox, cables→type-2, v2l-c2l→v2l, dc-units/charger-equipment→ccs2, portable→mod-2-mod-3).
> Homepage→kategori crawl: **Footer'da 8 kategori `<a href>` zaten var** → hero kartları (router.push) DEĞİŞMEDİ
> (riskli, gereksiz). **1.4 FAQPage:** 15 sözlük terimine `faq` (2-3 Q&A, tanımlardan türetildi, 41 soru) + term
> sayfasına `faqSchema` + görünür FAQ; kategoriler zaten vardı. ⚠️ alt-ajan stall oldu (11/15), kalan 4'ü
> (mod-2-mod-3/rfid/taper/wallbox) elle ekledim; tarama TEMİZ (rakip marka 0, uydurma spec 0). **1.2 ImageObject:**
> `productSchema` image → ImageObject+caption (Google Görseller); hero=globe→OG, kategori kapak ertelendi.
> **1.5 alt:** ProductDetailClient thumbnail `alt=""`→açıklayıcı. **1.7:** `public/site.webmanifest` +
> `viewport.themeColor` (light/dark). **1.1 geo** (önceki batch) + **3.1 cache** zaten ✅. **ERTELENEN:** 1.6 OG
> (ImageResponse PNG sıkıştırılamaz), 1.8 SearchAction (URL arama yok→atla). tsc 0 + next build 0 (sözlük ● SSG).
> **TIER 2 (kısmi):** **2.4** llms-full.txt'e sözlük FAQ eklendi; **2.3** term sayfasına `openGraph.modifiedTime`
> (`GLOSSARY_UPDATED` const, tazelik). **ERTELENEN:** **2.1** /export SSR `<html lang=en>` (root layout'ta pathname
> okumak = headers()→tüm site dinamik olur, statik ürünleri bozar; route-group restructure riskli → client HtmlLang
> kalıyor), **2.2** ürün yorum hacmi (gerçek ek yorum yok, uydurma yasak), **2.5** http+non-www→https+www tek-hop
> (**Vercel domain ayarı = KULLANICI**, kod değil; www'yi primary yap). **TIER 3:** 3.1 cache ✅ zaten; 3.2 bundle
> AYRI branch+profil ister (riskli, yapılmadı). **TIER 4.1 SVG ✅:** 3 özgün inline-SVG teknik diyagram
> eklendi (`posts.ts` figure): **Type 2 vs CCS2 pin dizilimi** → `ev-sarj-soketi-tipleri-...` postu; **Mod 2 vs
> Mod 3** + **DLM yük paylaşımı** → `...kurulum-rehberi` postu (currentColor+#3B82F6, etiketli, BlogShell figure
> render). 4.2 VideoObject = kullanıcıda video yok (sonra). **PWA/manifest TAMAMEN KALDIRILDI** (2026-06-28e: önce `display: browser` yaptım ama kullanıcı HÂLÂ
> "uygulamada aç" görüyordu → layout `manifest:` satırı + `public/site.webmanifest` SİLİNDİ; manifest yoksa
> tarayıcı PWA install/app affordance sunamaz; theme-color `viewport.themeColor`'dan kalır, site %100 normal web). _(eski: manifest `display: browser`_
> — kullanıcı "uygulama yükle" istemini istemedi; theme-color/SEO kaldı). **KULLANICI tarafı DURUM:** Wikidata P159
> Bursa ✅, Vercel www primary ✅, backlink (bemis.com.tr + devam) ✅; ürün yorumları + video kullanıcıdan gelecek.



> 🔧 **ON-SITE 88→ (hreflang ÇİFT-YÖNLÜ + review datePublished) (2026-06-28b, CANLI):**
> **#1 hreflang resiprokal:** anasayfa `app/page.tsx` artık SERVER sarmalayıcı (tüm UI →
> `app/HomeClient.tsx`, git mv) → `en→/export` geri-dönen etiketi ekler (Google çifti artık
> görür; client sayfa metadata veremiyordu, refactor bunu çözdü). /export → yeni `HtmlLang`
> client bileşeni `document.documentElement.lang="en"` yapar (SSR lang="tr" KALIR; tam SSR
> override route-group ROOT layout ister = riskli, yapılmadı). **#2 datePublished:** 6 ürün
> review'ına TR "Ay YYYY"→ISO (`toIsoDate` helper, ör. Kasım 2024→2024-11-01). ⚠️ Ek GERÇEK
> yorum YOK (uydurma yasak) → reviewCount=1 kalıyor; daha fazlası gerçek Trendyol/HB yorumu
> ister (kullanıcıda). **#3 geo: TAMAM** — kullanıcı GBP pin koordinatını verdi →
> `export const ORG_GEO = {lat:40.245558, lng:28.945849}` (seo.ts, TEK KAYNAK) →
> `localBusinessSchema` artık HER ZAMAN `geo` emit eder (/bursa) + /iletisim inline `geo`.
> Ayrıca kullanıcı GBP Maps linkini verdi → `ORG_SAME_AS`'a eklendi (`maps.app.goo.gl/...` —
> site↔GBP kartı entity bağı, her sayfada organizationSchema.sameAs; harita/yerel SEO sinyali).
> tsc 0 (geo küçük değişiklik; full build önceki commit'te yeşildi, Vercel build net).

> 🔧 **ON-SITE DENETİM 81→86 — FOOTER NAP + ÜRÜN YILDIZ + LocalBusiness (2026-06-28, CANLI):**
> **#1 Footer NAP regresyonu:** footer'ı besleyen `contact` verisi ESKİ "Yeşil cd. NO:19" + home-footer eski email gösteriyordu
> → `data/content.json` + `content-en.json`: adres→**"Yeşil Cad. No:31"**, addressSub→"16140 Bursa, Türkiye", gömülü-EN
> email→info@bemisevcharge.com (3 nokta; 0 eski değer kaldı). Org JSON-LD zaten ORG_ADDRESS ile doğruydu; footer
> `meta.addressStreet`(=content.address) okuyordu → regresyon oradaydı. **#2 Yorum yıldızı:** marka-geneli 4.9/500+
> **self-serving** (Google `Organization`'a yıldız VERMEZ + risk) → layout'tan org-reviews spread KALDIRILDI; 6 gerçek müşteri
> yorumu (Trendyol/Hepsiburada, her birinde `product` alanı) curated `PRODUCT_REVIEW_KEY` ile 6 ürün DETAY sayfasına
> **Product AggregateRating+Review** olarak bağlandı (`reviewsForProduct`+productSchema `reviews` param; eşleşme 6/6 doğrulandı;
> review metni kW içermez→ürün-agnostik güvenli). **#3 Title ≤60:** blog'a `metaTitle` alanı (H1 zengin KALIR, `<title>` kısalır:
> "AC ve DC Şarj Farkı Nedir?" / "Apartmana EV Şarj İstasyonu Kurulumu") + wallbox kategori "—AC Wallbox"→"—Wallbox".
> **#4 LocalBusiness:** `openingHoursSpecification` (Pzt–Cuma 08:30–18:00 GERÇEK) /iletisim inline + `localBusinessSchema`
> helper'a (→ /bursa). **geo lat/long KULLANICI KOORDİNATI bekliyor** (uydurmadım; helper'da `geo?` param hazır).
> **#5a /export hreflang:** `tr:/ + en:/export + x-default:/` (doğru küme). ⚠️ Anasayfa "use client" → karşılıklı `en→/export`
> + `<html lang=en>` ERTELENDİ (root'a eklemek 8 client sayfasını kirletir; tam küme anasayfa server-wrapper refactor ister;
> mevcut izole-x-default GÜVENLİ). **#5b** 15 sözlük tanımı ~109→~133-169 kelimeye (alt-ajan, sadece `definition`; marka
> taraması TEMİZ). tsc 0 + `next build` 0 (ürünler ● SSG) + curl doğrulandı. **[KULLANICI]:** #4 geo → GBP/Maps'ten
> enlem,boylam ver. Ayrı GBP kartı (EV Charge, doğrulanmış, 25 yorum) sende; harita-sıralaması GBP tarafında.

> 🎯 **KAPSAMLI SEO/GEO ON-SITE DENETİMİ — P0+P1+P2 (2026-06-27, CANLI · commit'ler 202e92f→d53eae7):**
> A-Z denetim sonrası on-site düzeltmeler. **YAPILDI+canlı:** **#1 hreflang** (homepage SAHTE 'en'=/?lang=en KALDIRILDI →
> tr+x-default; /products, kategoriler, ürünler, /uretici, /bursa, /kurumsal, /blog'a tr+x-default; /export en+x-default).
> **#2 og:image** 11 sayfaya (yeni `ogImage()`/`OG_URL` helper, 1200×630+alt+twitter; ürün foto/post kapağı KORUNUR).
> **#3 schema:** kategori hattı **Product+AggregateOffer → ItemList** (`categoryProductSchema`→`categoryListSchema`; kategori
> sayfaları zaten CollectionPage); productSchema image **dedupe** + **additionalProperty** (specs→PropertyValue). **#4 NAP:**
> ORG_ADDRESS **Yeşil Cad. No:31, 16140 Bursa** + postalCode (tel +90 224 433 02 16 / info@bemisevcharge.com — KANONİK, kullanıcı
> teyit etti). **#5 YENİ /iletisim** (`app/iletisim/`: NAP+harita+ContactPage+LocalBusiness; yeni `localBusinessSchema` helper;
> navbar 'İletişim' + sitemap; /bursa'ya da LocalBusiness). **#9** H1 bitişik düzeltildi (homepage Hero + /kurumsal: `<br/>`
> sınırına `{" "}`) + 4 sayfa `<title>` ≤60 (export/products/uretici/blog). **#10** i.ibb.co preconnect+dns-prefetch.
> **#13 YENİ blog** `elektrikli-arac-sarj-istasyonu-kurulum-rehberi` (HowTo 6-step + FAQ + tablo). **#14a YENİ /llms-full.txt**
> (`app/llms-full.txt/`: sözlük + 10 rehber TAM gövde; glossary+posts'tan). **#12** 15 sözlük tanımı ~50→~109 kelimeye
> (`glossary.ts` definition; passage citability; alt-ajan, sadece definition). **#14b** 19 blog Article'ına gerçek
> `dateModified: "2026-06-27"` (hepsi bugün FAQ-derinleştirme/yeni rehberle düzenlendi). Tümü tsc 0 + curl doğrulandı.
> **#6 cache — YAPILDI+CANLI (commit 5c8b3fe):** ürün+kategori sayfaları force-dynamic → **static**: `generateStaticParams` +
> **`dynamicParams=false`** (bilinmeyen URL 404 → bot AMPLİFİKASYONU YOK; eski force-dynamic kararının asıl korkusu çözüldü) +
> `revalidate=86400`. Canlı doğrulandı: gerçek ürün/kategori 200, uydurma URL 404, **X-Vercel-Cache MISS→HIT** (TTFB düştü).
> ⚠️ ISR Writes düşük (~113 sayfa, kotanın çok altında) ama **birkaç gün metriği İZLE**; artışta revalidate'i uzat/geri al.
> ⚠️ Yeni ürün artık redeploy ister (Blob okuması kapalı zaten content'i commit'le veriyordu → tutarlı). **#7 bundle:** ana
> sayfa ZATEN tam `next/dynamic` kod-bölünmüş (globe react-globe.gl ssr:false dahil); actionable kısım bitik. Kalan kabuk
> ağırlığı = framer→CSS gibi derin/riskli refactor (profil gerek) → yapılmadı. **#11 video** kullanıcının YouTube URL'i bekliyor
> (SVG diyagram YAPILDI). **#9 kategori başlıkları** keyword-optimize (62kr marjinal, korundu).

> 🚨 **KRİTİK İNFRA BULGUSU — SİTE BLOB DEĞİL data/content.json OKUYOR (2026-06-27):** `vercel link bemis-server` +
> `env pull production` ile doğrulandı: bemis-server'ın **`BLOB_READ_WRITE_TOKEN`'ı APEIRON blob store'una bakıyor**
> (`list` → 13 apeiron blob'u, **`bins/content.json` YOK**; env'de ayrıca `APEIRON_PIN` var = projeler karışmış).
> Sonuç: `readBin("content")` → `get("bins/content.json")` 403/not-found → app **`data/content.json` fallback'ine düşüyor.**
> KANIT: `/api/content` ≡ `data/content.json` (company/contact birebir). **Yani bemis Blob içerik katmanı ÇALIŞMIYOR;
> site repo'daki data/*.json'ı serve ediyor → admin panel değişiklikleri canlıya YANSIMIYOR olabilir.** ⚠️ DERS: içerik
> düzeltmesi = `data/*.json`'ı düzenle+commit+deploy (Blob'a yazma anlamsız/yanlış store). **[KULLANICI/DEV]:** Vercel →
> bemis-server → Storage'da doğru bemis Blob store'una yeniden bağla + apeiron env'lerini ayıkla. (Path B Blob-write
> denendi→TIKANDI: get 403 her yerden + revalidate route build'i bozdu; geçici route+token temizlendi.)

> 📚 **GEO 2. RAUND — skor 75 → (haber şema + tablo + SÖZLÜK HUB) (2026-06-27, CANLI · commit'ler 113dec4 / c7fca73):**
> Re-denetim 63→**75/100** sonrası 5 yeni açık. **Task 1,3,4,5 YAPILDI+canlı; Task 2 KULLANICIDA (admin).**
> **#1 Haber Article şema:** `articleSchema` `datePublished` OPSİYONEL; `press.ts`'e `keywords` alanı + 6 habere keyword;
> haber page TÜM 6 habere full Article (image 1200×630, wordCount, keywords, articleSection=Haber/Fuar). Tarihsiz 3 haber
> de Article alır (uydurma tarih YOK). **#3 llms.txt** Rehberler 2→9. **#4 Nötr spec tablo:** blog'a yeni **`table` blok tipi**
> (BlogSection union + BlogShell `Section` case, tema-uyumlu HTML `<table>`); 2 rehbere RAKİPSİZ tablo (ac-dc: AC vs DC;
> nasil-secilir: Bemis ürün gamı — ⚠️ DC **BEVDC 40/80/120 = 40–120 kW** doğrulandı, sadece 40 değil). **#5 SÖZLÜK HUB:**
> `app/lib/glossary.ts` (15 terim) + `/sozluk` (DefinedTermSet) + `/sozluk/[slug]` (DefinedTerm + 40-60 kelime doğrudan-cevap)
> + `GlossaryClient` (tema-uyumlu Navbar/Footer); `seo.ts`'e `definedTermSetSchema`/`definedTermSchema`/`howToSchema`; **HowTo**
> apartmana-kurulum'a (4 step; is-yerine prosedürel değil→eklenmedi; BlogPost'a `howTo?` alanı + blog page emit); keşif:
> sitemap (16) + llms + Navbar "Rehber" dropdown'a Sözlük. tsc temiz, hepsi canlı doğrulandı. **Yeni blog/terim eklerken bu desenleri kullan.**
> **✅ #2 RAKİP MARKA — CANLIDA ÇÖZÜLDÜ (fallback yoluyla, commit 4d49519/3dc9613):** TR+EN tüm sayfalar + /api/content'te
> "ABB, Schneider, Wallbox, Easee" = **0** (kapsamlı doğrulandı). NASIL: `data/content.json` + `content-en.json` MARKASIZ
> commit'lendi → deploy content cache'ini düşürdü → **Blob `get()` 403 verince** (lokal+Vercel ikisinde de!) layout
> markasız **`data/content.json` fallback'ine düştü**. Yani site şu an **Blob'u değil fallback'i serve ediyor** = markasız.
> ⚠️ **ÖNEMLİ İNFRA BULGUSU:** Blob `content` `get()` Vercel runtime'da DA 403 → site genel olarak data/content.json
> fallback'inde çalışıyor (admin Blob değişiklikleri okunmuyor olabilir). Token/@vercel/blob `get` access'i ileride
> incelenmeli. Blob okuması düzelir + branded Blob yeniden cache'lenirse markalar GERİ DÖNEBİLİR → kalıcı garanti için
> uygun olunca admin'den o SSS'i bir kez markasız KAYDET (writeBin → Blob da temizlenir). Path B (lokal/sunucu read-modify-write)
> denenip TIKANDI: get 403 + revalidatePath route build'i bozdu; geçici route kaldırıldı, token temizlendi.

> ⛔ **AKSESUAR-SSS RAKİP MARKA TEMİZLİĞİ (2026-06-27):** "Bemis aksesuarları diğer markalarla
> uyumlu mu?" SSS yanıtı (accessories kategorisi) rakip marka listesi içeriyordu — TR: "…Bemis
> aksesuarlarımız **ABB, Schneider, Wallbox, Easee** ve diğer…" / EN aynısı. **REPO'DA DÜZELTİLDİ**
> (markasız → TR: "Type 2 / CCS2 standart konnektörlü tüm elektrikli araçlar ve şarj istasyonlarıyla
> uyumludur" · EN: "compatible with all electric vehicles and charging stations that use standard
> Type 2 / CCS2 connectors"): `data/content.json` (TR @294 + gömülü `_translations.en` @1151),
> `data/content-en.json` @290, `scripts/seed-faqs.cjs` @202 (defunct JSONBin seed, hijyen).
> ⚠️ **CANLI HÂLÂ ESKİ** — içerik **Blob** `content` bin'inden okunur (layout → ContentProvider →
> HER sayfanın HTML'ine gömülü; canlı anasayfada string 2× görünüyordu), repo dosyaları sadece
> **fallback**. Lokal makinede `BLOB_READ_WRITE_TOKEN` YOK → Blob'a yazamıyorum. **Canlıya yansıtmak
> için:** admin panel → **Aksesuarlar** kategorisi → bu SSS yanıtını markasız TR metinle yeniden
> KAYDET (kaydedince TR Blob'a yazılır + arka planda `translateContent` EN'i otomatik tazeler →
> `_translations.en` da temizlenir). Tarama yapıldı: başka rakip-marka (Vestel/ABB/Schneider/KEBA/
> go-e/Easee) YOK; jenerik "AC Wallbox" kategori/ürün adı serbest.

> 🌍 **/export İNGİLİZCE SAYFA + RAKİP-MARKA TEMİZLİĞİ + GEO #2-5 (2026-06-27, CANLI · commit'ler 6c12da8 / 98da2f9 / 515ae6e):**
> **(a) `/export`** — yabancı/İngilizce alıcılar için İngilizce üretici landing'i + "Request a Quote" formu (→ `/api/contact`,
> `topic:"export"`, honeypot+elapsed spam korumalı). İLK sürüm off-brand'di → **siteyle TAM uyumlu yeniden kuruldu:** gerçek
> `<Navbar>` (gerçek logo) + `<SearchOverlay>` + `<Footer>` + `useTheme` açık/koyu mod + site renk token'ları/hero/kart stili
> (`CityLandingClient` deseni). `app/export/ExportLandingClient.tsx` (use client) + `app/export/page.tsx` (EN metadata +
> Service/FAQPage/Breadcrumb JSON-LD). sitemap (prio 0.85) + llms.txt'te. ⚠️ Footer'a iç link EKLENMEDİ (eski Footer
> build-cache takıntısı); keşif sitemap+llms+reklam üzerinden. **Reklam Export(EN) kampanyası → `/export`'a yönlendirilecek.**
> **(b) ⛔ RAKİP MARKA YASAĞI (kullanıcı kesin kararı):** sitede **Vestel/ABB vb. RAKİP MARKA ASLA olmayacak** ("saçma
> algılanır"). "Bemis vs Vestel" + "Türkiye'nin en iyi yerli markalar" yazıları **SİLİNDİ → 404** (posts.ts'ten string-güvenli
> brace-match script + llms.txt'ten). ⚠️ **Rakip adı geçen içerik/karşılaştırma/öneri ÜRETME.** (Markasız "nasıl seçilir"
> rehberi serbest.) ⚠️ GEO denetimleri bu 2 silinen yazıyı işaret ederse = **BAYAT rapor** (silmeden önce alınmış).
> **(c-2) FAQ DERİNLİĞİ SİTE GENELİ (2026-06-27, CANLI · commit b8ffd29):** kalan 15 yazının FAQ'ı da ~30 → **~98 kelime**
> ortalamaya çıkarıldı (5 paralel general-purpose ajan, her yazının KENDİ fact-check'li gövdesinden; çekişmeli kontrol: rakip
> marka YOK, uydurma fiyat/EPDK/garanti YOK; bazılarına gövdeden 1-2 yeni soru). Ajanlar JSON'a yazdı → string-güvenli
> bracket-match script `posts.ts`'e uyguladı (faq item'ları artık tırnaklı `{ "q":, "a": }`, anahtar `faq:` tırnaksız kaldı; tsc OK).
> **ARTIK 18 blog yazısının HEPSİ derin FAQ + FAQPage şemalı** (84 FAQ canlı doğrulandı). ⚠️ Yeni blog eklerken FAQ'ı baştan
> ~80-100 kelime yaz.
> **(c) GEO açıkları #2-5 (re-denetim 47→62, hedef 75+):** **#2** `articleSchema` (seo.ts) → `image`=ImageObject (kapak varsa o,
> yoksa `${SITE_URL}/opengraph-image` **1200×630**) + `wordCount`/`keywords`/`articleSection`; blog `[slug]/page.tsx` `countWords()`
> + post.keywords/category geçiyor (TÜM yazılara otomatik). **#3** 3 ana rehberin (yük-yönetimi/filo/nasıl-çalışır) **21 FAQ
> yanıtı ~40-55 → ~90 kelime** (self-contained; içerik fact-check'li gövdeden, uydurma YOK). **#4** soru-H2 bu 3 yazıda ZATEN
> vardı (3-6/yazı) → ek iş yok. **#5** blog metadata `alternates.languages {tr, x-default}` (Next `hrefLang` camelCase basar=normal)
> + `organizationSchema` BASELINE: `ORG_PHONE`(+90 224 433 02 16)/`ORG_EMAIL`(info@bemisevcharge.com)/`ORG_ADDRESS`(Bursa OSB) →
> content meta boş gelse de contactPoint+PostalAddress HEP emit (sameAs baseline mantığı; canlıda boştu). Canlı doğrulandı.
> **(d) ⚠️ 301 HÂLÂ KULLANICIDA** (en büyük lever) + GBP 3 ürün + marketplace + Ads launch.

> 🖼️ **WHATSAPP/OG GÖRSEL FIX (2026-06-24, CANLI · commit c3f6176):** WhatsApp'ta link paylaşınca admin'in
> yüklediği özel marka görseli (content bin `ogImage` = i.ibb.co beton-duvar Bemis logosu) yerine JENERİK
> sentez kart görünüyordu. KÖK NEDEN: `app/opengraph-image.tsx` (og:image üreteci) `runtime` sabit değildi →
> edge'de çalışıp `readBin("content")` BAŞARISIZ oluyordu → `ogOverride` null → sentez karta düşüyordu (logo da
> "B" yedeği = aynı başarısız okuma). FIX: (1) `export const runtime = "nodejs"`; (2) `fetchBranding` Blob
> okunamazsa `data/content.json` mirror'ına düşer (ogImage+faviconUrl orada da senkron). Runtime log temiz.
> ⏳ **Görsel GÖZLE doğrulanamadı** (aşağıdaki challenge yüzünden); mantık+log sağlam, kullanıcı WhatsApp'ta teyit edecek.
> ⚠️ OG görsel admin → İçerik → `ogImage`'den yönetilir; değişince WhatsApp cache'i için yeni paylaşım gerekir
> (`?v=` param'lı link veya FB Sharing Debugger ile "Scrape Again").
> ⚠️⚠️ **DERS (ÖNEMLİ — tekrarlama):** deploy beklerken `gh api .../status` + yüzlerce hızlı `curl` gecikme
> döngüsü KULLANMA → Vercel **otomatik bot/saldırı mitigation**'ını tetikler (`X-Vercel-Mitigated: challenge`,
> tüm route'lar IP'ne 403 — IP'ye özel + geçici; gerçek kullanıcı/WhatsApp scraper ETKİLENMEZ ama lokal curl
> doğrulaması bloke olur, dakikalarca sürebilir). Poll'u SEYREK + az tekrarlı yap; gecikme için homepage'i
> döngüyle dövme. Mitigation site genelinde DEĞİL (ilk curl'ler geçti, çok istekten sonra başladı = rate-temelli).

> 🆕 **ÜRÜN SEO ALANLARI + 113 ÜRÜN ÖN-DOLDURMA (2026-06-20, CANLI · commit 757fd2b):** Admin ürün
> düzenlemeye **4 SEO alanı** eklendi (SEO Başlığı / SEO Açıklaması / Odak Anahtar Kelime / Anahtar
> Kelimeler — IdeaSoft tarzı; `ProductEntry`+`ProductShape`'e alan). BOŞ = otomatik üretilen meta;
> DOLU = `<title>` / meta description / `<meta keywords>` / Product JSON-LD `keywords`'te AYNEN
> (product `generateMetadata` + `productSchema`; yeni `productKeywords()` helper, seo.ts). **113 ürünün
> TAMAMI ön-dolduruldu** (8-ajanlı çekişmeli fact-check workflow) → `app/lib/productSeo.ts` `PRODUCT_SEO`
> haritası; `applyProductSeo` 3 okuma yoluna (**getServerProducts + /api/products + /api/admin/products
> GET**) birleştirir. ⚠️ **Üründe zaten değer varsa KORUNUR → admin'de düzenlenen / Blob değeri DAİMA
> KAZANIR** (override edilebilir; `pick`). Admin bir ürünü düzenleyip kaydederse o değer Blob'a yazılır.
> ⚠️ **NEDEN KOD HARİTASI, doğrudan Blob DEĞİL:** lokal makineden `@vercel/blob` **`get` (private içerik
> okuma) = 403 Forbidden** (`list` ÇALIŞIR; private blob içeriği yalnız Vercel ağı/OIDC ile okunur). Yani
> mevcut sharding'i okuyamadan Blob'a yazmak kataloğu bozma riski → SEO kodda fallback olarak tutuldu.
> ⚠️ **`scripts/fix-*.cjs` Blob `get`'leri artık lokalden 403 alabilir** (yazma da güvenilmez); Blob veri
> düzeltmesi gerekiyorsa admin paneli veya Vercel runtime üzerinden yapılmalı. SEO regen: geçici workflow
> (scriptler repo'da tutulmadı). EN ürün sayfaları SEO override almaz → otomatik üretilene düşer (kabul).
> 🔎 **VERCEL KOTA — GERÇEK METRİK + FIX (2026-06-20, CANLI · commit f6cdb9e):** Kullanıcı ekran görüntüsü
> verdi. AŞILAN 2 metrik (aylık): **ISR Writes 209K/200K** + **Blob Advanced Operations 3.1K/2K** (diğer
> HEPSİ limit altında — Image Optimization 1.6K/5K, Edge 260K/1M vb. SORUN DEĞİL). Bunlar tam olarak önceki
> oturumların "düzelttiği" iki metrik → free tier bu büyüyen site için DAR. KÖK NEDEN: `readBin`
> `unstable_cache` (revalidate **1800s**) + okuma API'leri (**3600s**) çok sık tazeleniyordu → content/
> products okuyan STATİK sayfalar ~30dk'da bir yeniden yazılıyor (ISR write patlaması) + cache-miss Blob
> okumaları. **FIX:** tüm okuma backstop'ları **21600s (6 saat)** — `lib/store.ts` readBin + `/api/products`,
> `/api/dealers`, `/api/documents`, `/api/b2b`. Bayatlama YOK (admin/içerik/ürün/iletişim yazımları
> `revalidateTag(store:<bin>,"max")` + `revalidatePath` ile cache'i ANINDA temizler; 6 saat sadece backstop).
> Beklenen: ISR write ~10×, Blob read ~12× düşer → ikisi de limit altına. ⚠️ Metrikler AYLIK sıfırlanır +
> fix birkaç günde meterde görünür. **Blob ops'ta 2. olası kaynak: iletişim formu spam'i** (her mesaj =
> readBin(fresh)+writeBin = 2 Blob op) → **ÇÖZÜLDÜ (commit da55d55):** iletişim + bayilik formlarına
> **honeypot** (gizli `website` alanı) + **zaman-tuzağı** (`elapsed`<2sn) eklendi; `app/api/contact`
> bunları Blob/e-posta'dan ÖNCE kontrol eder → spam'de SESSİZCE 200 döner, `writeBin(messages)` ÇALIŞMAZ
> (Blob op tüketilmez). Mevcut IP rate-limit (3/saat) korunuyor. Honeypot dolu/elapsed<2sn yolları canlı
> doğrulandı (yanıt sadece `{ok:true}`, adminSent yok). **Kalıcı güvenlik = Vercel Pro (~$20/ay)** — 5 proje + büyüyen trafik için free tier tekrar
> tökezler (Pro: ISR 200K→2M, Blob 2K→çok daha fazla). ⚠️ revalidate değerlerini TEKRAR kısaltma — kota dolar.

> 🆕 **WIKIDATA BİTTİ + 3 YENİ BLOG (2026-06-20, CANLI · commit f7bf64d):**
> **(a) WIKIDATA %100 KAPANDI** — kullanıcı logo dahil tamamladı. ⚠️ ÖĞRENİLEN: Wikidata **logo image
> (P154)** alanı **Commons media file** tipindedir → değer **yalnız çıplak dosya adı + uzantı** (örn.
> `Bemis-ev-charge-logo-siyah (2).png`); `[[File:...|thumb|...]]` wiki-markup KOYMA ("file extension is
> missing" hatası bundan). Logo dosyası Commons'ta DOĞRULANDI (arama yeni yüklemeyi geç indeksler; tam-ad
> imageinfo sorgusu kesin). **(b) 3 YENİ BLOG (blog 15→18):** taslak→çekişmeli fact-check workflow (6 ajan)
> ile üretildi, hepsi diske yazılıp `posts.ts` BAŞINA eklendi (tsc temiz): `elektrikli-arac-sarj-yuk-yonetimi`
> (Yük Yönetimi/Load Management, Teknik) · `arac-filosu-elektrikli-sarj-cozumleri` (Filo/depo-gece şarjı, Rehber)
> · `elektrikli-arac-sarj-istasyonu-nasil-calisir` (çalışma prensibi AC/DC/güvenlik, Teknik). Fact-check: post-0'da
> "33kW/3 araç=tam 11kW" matematik hatası düzeltildi; diğer 2 temiz. Uydurma sertifika/fiyat/garanti/EPDK YOK
> (yalnız CE/IP65-66 + "OCPP uyumlu modeller"). Gerçek içerik boşlukları, mevcut 15 yazıyla çakışma yok.
> **(c) ⚠️ 301 HÂLÂ YAPILMADI:** 2026-06-20'de `bemis.com.tr/sarj-cihazlari` hâlâ **200** (kendi ürün listesini
> gösteriyor; ajans "yaptık" dedi ama uygulanmamış). EN BÜYÜK SEO kaldıracı; harita `Desktop\Bemis_301_Yonlendirme_Haritasi.txt`.
> **KALAN tamamen [KULLANICI]:** 301 · GBP 3 ürün (6 Çanta/7 BEVDC40/8 Kablolu Priz) + kart sahiplenme · pazaryeri
> listeleme (hepsiburada/n11) · bayi backlink mesajı (`Desktop\Bemis_Bayi_Link_Talebi.txt` hazır) · jsonbin key iptali.

> 🔔 **HATIRLATMA — KULLANICI (2026-06-16):** GBP'ye (Google İşletme Profili → Ürünler) amiral
> ürünler ekleniyor. **1-5 EKLENDİ** (Charger 2 · Mini Mobile · Type 2 Seti · V2L · CEE Norm Adaptör).
> **KALAN 3:** 6 Şarj Kablosu Çantası · 7 BEVDC 40 · 8 Kablolu Şarj Prizi (charger-equipment). + **GBP
> Soru-Cevap:** kullanıcı bölümü bulamadı — public kartta (knowledge panel/Haritalar), Düzenle'de değil;
> yeni profilde hiç görünmeyebilir → opsiyonel, çıkmazsa atla. ⚠️ Ben GBP'yi tamamlayamam (Google login
> yasağı + Chrome eklentisi bağlı değildi). Kullanıcı "sonra bakacağız, hatırlat" dedi → **bu satırı
> görünce HATIRLAT.** Her ürün için hazır kart (ad/açıklama/link) + GBP kategori adı önceki sohbette
> verildi; tekrar gerekirse `/api/products`'tan amiral ürün + `/products/<cat>/<id>` linki üret.
> ⚠️ GBP ürünleri ORTA fayda (vitrin/dönüşüm), sıralama kozu değil. **Asıl kaldıraç hâlâ 301:**
> eski `bemis.com.tr/sarj-cihazlari` + `/ev-charge` 2026-06-16'da hâlâ **200** (yönlendirme YAPILMADI).
> **301 HARİTASI HAZIRLANDI (2026-06-16):** `C:\Users\sales\Desktop\Bemis_301_Yonlendirme_Haritasi.txt`
> — 11 EV ürünü (BEV kodundan birebir) + 8 EV kategori/landing → yeni URL, hepsi 200 doğrulandı +
> .htaccess/Nginx örnekleri. **Kullanıcı ajansa/panele İLETECEK** (eski site klasik PHP template, soft-404
> her URL'ye 200 döner; gerçek linkler /sarj-cihazlari sayfasından çıkarıldı). ⚠️ /dokumanlar endüstriyelle
> ortak → yönlendirme; sadece EV URL'leri. → Uygulanınca bu satırı güncelle.

> ⚙️ **BLOB KOTA FIX (2026-06-16, CANLI · commit 00c4524):** Vercel maili "Advanced Requests (2.000
> işlem/ay) %100" → kaynak: `lib/store.ts` `readBin` her private `get`'i = 1 Blob *advanced op*, ÖNBELLEKSİZ
> her ziyaretçi/bot isteği bunu tüketiyordu. **FIX:** `readBin` salt-okuma çağrıları artık `unstable_cache`
> (tag `store:<bin>`, `revalidate:1800`); `writeBin`'in mevcut `revalidateTag(store:<bin>,"max")`'i yazınca
> temizler. **Oku-değiştir-yaz akışları ZATEN `{fresh:true}` geçiyor** (tüm admin route + iletişim formu
> mesaj-ekleme) → cache'i atlar, stale-yazma yok. Blob op ~%95+ düştü. ⚠️ **DİKKAT:** (1) `scripts/*.cjs`
> Blob'a DOĞRUDAN yazar (writeBin değil) → `revalidateTag` ÇAĞIRMAZ → değişiklik en geç 30 dk'da (veya yeni
> deploy) görünür; acil tazelik gerekiyorsa redeploy. (2) Statik sayfalar artık 30m revalidate (ISR, 200k/ay
> bol kota — sorun değil); `[id]` ürün sayfaları HÂLÂ force-dynamic (bot-amplifikasyon riski yok). (3) Kota
> AYLIK sıfırlanır; trafik büyürse Pro kalıcı çözüm. `cacheComponents:true` AÇILMADI (çok kapsamlı/riskli).

> 🤖 **GEO/AEO — YZ ARAMA GÖRÜNÜRLÜĞÜ (2026-06-16, CANLI · commit bf6d1ae):** YZ (ChatGPT/Perplexity/
> AI Overviews) Bemis'i doğru tanısın+alıntılasın diye sitenin "ben yerli EV şarj üreticisiyim" tarafı
> güçlendirildi. **(a)** `lib/seo.ts` `organizationSchema`: `sameAs` SABİT baseline (4 gerçek sosyal link —
> içerik build'de boş gelse bile asla boş kalmaz; eskiden canlıda sameAs=0 idi) + `description` + `slogan` +
> `knowsAbout` (12) + `areaServed:"Türkiye"` + `hasOfferCatalog` (8 ürün hattı). Atıf DOĞRU: 1994/16.000m²/
> miras = `parentOrganization` Bemis Teknik; EV markası onun markası. **(b)** YENİ `app/llms.txt/route.ts`
> (statik, /llms.txt) — YZ tarayıcılarına marka özeti + ana sayfalar. **(c)** YENİ blog
> `turkiye-yerli-ev-sarj-istasyonu-ureticisi` (category "Marka") — YZ sorgularını ("yerli EV şarj üreticisi
> kim") alıntılanabilir Soru-Cevapla cevaplar; sitemap+listede otomatik. İçerik 4-ajanlı workflow ile üretilip
> ÇEKİŞMELİ fact-check edildi (uydurma sertifika/bölge/blanket-OCPP düzeltildi; yalnız CE/IP65-66/OCPP/60+ ülke).
> JSON-LD canlı doğrulandı (parse OK, &amp; kaçağı yok). robots YZ botlarını ZATEN engellemiyor (iyi).
> ⚠️ **KALAN [KULLANICI] off-site (asıl öneri gücü):** Wikidata kaydı · "en iyi yerli EV şarj markaları"
> listelerine girmek · pazaryeri (Hepsiburada/N11) · Google+forum yorumları. (sameAs sosyal linkleri kodda
> SABİT — admin'de sosyal değişirse `ORG_SAME_AS`'i de güncelle.)

> 🗂️ **GBP ürün + Wikidata (2026-06-16):** GBP'ye ürün ekleme Chrome eklentisiyle DENENDİ →
> **ürün fotoğrafı ZORUNLU** ve foto seçimi Windows native dosya penceresi (sayfa Google iframe'i,
> erişilebilir file-input yok) → **otomasyonla yüklenemiyor.** Kullanıcı 3 kalan ürünü (6 Çanta,
> 7 BEVDC 40, 8 Kablolu Priz) KENDİ ekliyor; görseller indirildi: `C:\Users\sales\bemis_gbp\`
> (6-canta.png/7-bevdc.png/8-priz.png) + metinler hazır. **Wikidata paketi HAZIR (off-site GEO):**
> `Desktop\Bemis_Wikidata_Paketi.txt` (doldurmaya hazır: label/açıklama/ifadeler/kaynak; marka +
> opsiyonel ana şirket öğesi). Kullanıcı Wikidata Q-no verince → sitedeki `ORG_SAME_AS`'e Wikidata
> linkini EKLE (entity bağını kapatır). Yol haritası: `Desktop\Bemis_Yol_Haritasi.txt`.

> 🌐 **WIKIDATA DURUM (2026-06-16):** Bemis E-V Charge öğesi CANLI = **Q140262626** (instance of Brand,
> country TR, website, Instagram/LinkedIn/Facebook). **Siteye `sameAs` olarak EKLENDİ** (`lib/seo.ts`
> ORG_SAME_AS, commit 28a9cfe — entity bağı kapandı). ⚠️ **KULLANICIDA 2 DÜZELTME:** (a) owned-by (P127)
> KENDİNE işaret ediyor (Q140262626→Q140262626, self-ref) → Bemis Teknik'e çevrilecek; (b) headquarters
> (P159) İstanbul YANLIŞ → **Bursa (Q40858)**. **Bemis Teknik Elektrik A.Ş. Wikidata'da YOK** → kullanıcı
> oluşturacak (roadmap verildi: instance business, inception 1994, HQ Bursa, brand→Q140262626; sonra
> Q140262626 owned-by = Bemis Teknik). Referans haber linkleri = `app/blog/press.ts` (5 canlı: Electricity
> Turkey, Eko Haber, 3× Sektörüm Dergisi). Daha çok Bemis öğesi Wikidata'da yok (sadece soyadı/yer adları).
> **GÜNCELLEME (tamamlandı):** Bemis Teknik = **Q140267525** oluşturuldu (instance business, country TR,
> HQ Bursa=**Q40738**, inception 1994, website bemis.com.tr, brand→Q140262626). Q140262626 owned-by ARTIK
> Q140267525 (self-ref düzeltildi). HQ zaten Q40738=Bursa idi (DOĞRU; "İstanbul" ilk WebFetch'in yanlış
> etiketiydi). ⚠️ NOT: **Q40858 = doğalgaz, Bursa DEĞİL** (Bursa=Q40738). Q140267525 siteye
> `parentOrganization.sameAs` olarak EKLENDİ (commit 86c59a2). Tam zincir canlı: site→Q140262626→Q140267525.
> ✅ **WIKIDATA %100 TAMAM (2026-06-16):** her iki öğede 4'er referans (haber + site) + alias'lar eklendi/
> temizlendi (parent'tan yanlış marka-alias + "plugs and sockets...ceenorm" çöpü silindi; en: Bemis Technic/
> Electric/Turkey, tr: Bemis Teknik/Elektrik). API ile doğrulandı. Bu iş KAPANDI — yeni rötuş gerekmez.

> ✍️ **SEO içerik 2 iş (2026-06-16, CANLI · commit f44e07a):** (2) YENİ blog
> `ev-sarj-soketi-tipleri-type-2-ccs2-chademo` ("Type 2/CCS2/CHAdeMO farkı" — YZ-citable karşılaştırma,
> category "Teknik"; 2-ajan workflow + çekişmeli fact-check, verdict TEMİZ). (3) **Kategori H1'leri
> keyword'lü:** `lib/seo.ts`'e `categoryH1(id)` eklendi (CATEGORY_SEO.title döner) + `ProductCategoryClient`
> H1'i TR'de `categoryH1(category.id) || category.name` (EN + SEO'suz kategori → category.name; CMS verisi
> DEĞİŞMEDİ). Örn. cables H1 = "Elektrikli Araç Şarj Kablosu — Type 2", dc-units = "DC Hızlı Şarj Üniteleri
> — CCS2". H1 artık meta <title> ile aynı (tutarlılık). Canlı SSR'da doğrulandı. ⚠️ Kategori H1 değişmek
> istenirse CMS değil `CATEGORY_SEO[id].title` düzenlenir (seo.ts).

> ✍️ **SEO içerik 2. raund (2026-06-16, CANLI · commit 590640c):** (2) YENİ blog
> `elektrikli-arac-sarj-suresi-kac-saatte-dolar` ("EV kaç saatte dolar" — formül + AC/DC örnek hesap,
> kabul-gücü/taper vurgulu; 2-ajan workflow + fact-check TEMİZ). (3) **/products ana H1:** sabit
> "Tüm Ürünler" → iki dilli keyword `ProductsClient` ("Elektrikli Araç Şarj Ürünleri" / "EV Charging
> Products"). **Bu oturumda blog 11→14** (marka-entity + soket-tipleri + şarj-süresi). Blog deseni:
> `app/blog/posts.ts` BLOG_POSTS'a ekle → /blog liste + sitemap + JSON-LD OTOMATİK.

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
   **+ (2026-06-13 son2 — grup logo linkleri + /uretici marka görselleri, CANLI · commit 1a89922):** /kurumsal grup
   markaları logoları artık TIKLANABİLİR (`BrandLink` + `BRAND_URLS` isim→url: **Bemis→bemis.com.tr, BYES→byes.com.tr**,
   yeni sekme; Bemis E-V Charge bu site=linksiz). groupBrands CMS verisinde url alanı YOK → isimle eşleniyor (live ad
   "Bemis"/"BYES" tam eşleşmeli). /uretici: hero'ya **yerli-üretim güven rozeti** (`/badges/yerli-uretim.jpg`, siyah rozet
   beyaz çipte=iki modda okunur) + miras kartına **kırmızı Bemis ana-şirket logosu** (`/brand/bemis-logo.png`). Varlıklar:
   `/brand/bemis-logo.png`=kırmızı Bemis, `/badges/yerli-uretim.jpg`=YERLİ ÜRETİM damgası, `/logo*.png`=EV Charge logoları.
   **+ (2026-06-13 son3 — admin uyum + güvenlik + Bursa SEO sayfası, CANLI · commit'ler 909091c/2aeee12/b59fb21):**
   **(a) Admin uyumu:** /kurumsal'dan kaldırılan Üretim Süreci + Değerler/Sertifika bölümlerinin admin "hayalet
   editörleri" temizlendi (`admin/page.tsx`): productionStep* / highlights / features / certifications editörleri +
   kurumsalLabels production*/valuesEyebrow alanları + cascade (updateDnaHighlight/Feature, handleStepImgUpload,
   stepImg* state/ref) kaldırıldı. KALDI: Tarihçe (timeline), Hakkımızda Videosu, **Grup Markaları**, fabrika foto/video.
   ⚠️ Veri/tip DEĞİŞMEDİ — `content` alanları + Blob verisi korundu, sadece editör UI kalktı (geri eklenebilir).
   **(b) Güvenlik:** GitHub secret `JSONBIN_MASTER_KEY` SİLİNDİ (hiçbir workflow kullanmıyordu) + anahtarın gömülü
   gerçek değeri 5 `scripts/*.cjs` yorumundan `<JSONBIN_MASTER_KEY>` ile temizlendi. ⚠️ Anahtar git GEÇMİŞİNDE hâlâ var;
   tam etkisizleştirme = jsonbin.io'da anahtarı iptal/yenile (KULLANICI). **(c) SEO — Bursa yerel landing sayfası:**
   `/bursa-ev-sarj-istasyonu` ("bursa ev şarj" aramasına yönelik). Veri-tabanlı: **`app/lib/cities.ts`** (CITY_PAGES;
   yeni şehir = 1 kayıt + `app/<slug>/page.tsx` kopyası) + **`CityLandingClient.tsx`** (tekrar kullanılabilir UI,
   /uretici animasyon dili). JSON-LD: Breadcrumb + Service `areaServed:Bursa` + FAQPage. sitemap'e eklendi (prio 0.75),
   /uretici'den taranabilir iç link ("Bölgesel: …"). İçerik ÖZGÜN, rakip marka yok.
   **+ (2026-06-14 — logo fix + 2 blog + iç link; KARAR: şehir sayfası YAPMA, CANLI · commit'ler 962bb66/b12438b):**
   **(a) Logo:** `/brand/bemis-logo.png` (kırmızı Bemis, /uretici miras kartı) RGBA idi ama 'b' counter'ı + ® içi OPAK
   BEYAZ → karanlık modda beyaz leke. `sharp` ile beyaz/açık pikseller şeffaf yapıldı (kenar yumuşatmalı); yıldızdaki B
   knockout oldu (iki modda doğru). **(b) ⭐ KARAR (kullanıcı):** YENİ ŞEHİR SAYFASI YAPMA — şehirsel SEO içeriği BLOG'da
   yapılacak. `/bursa-ev-sarj-istasyonu` KALIYOR (kullanıcı GSC'ye verdi); İstanbul/Ankara/İzmir vb. için AYRI SAYFA AÇMA,
   blog yaz. `app/lib/cities.ts` + `CityLandingClient.tsx` duruyor ama YENİ kayıt EKLEME. **(c) Blog (9→11):** 2 özgün yazı —
   `turkiye-sehir-sehir-ev-sarj-rehberi` (İstanbul/Ankara/İzmir/Bursa, şehirsel detay blogda) + `ev-sarj-istasyonu-maliyeti`
   (yüksek-arama fiyat sorgusu, spesifik fiyat/rakip YOK). **(d) İç link:** yeni postlar /bursa + ürünler + /uretici + çapraz
   blog; apartmana-kurulum postuna /bursa + şehir-rehberi eklendi. Blog slug→statik sayfa + sitemap OTOMATİK (BLOG_POSTS'a ekle).
   **⚠️ Kullanıcı yeni blog 2 URL'i GSC'ye verecek.** **Hâlâ KULLANICI'da:** **301 (EN KRİTİK** — 2026-06-14 doğrulandı, eski
   bemis.com.tr EV sayfaları hâlâ 200/sıralanıyor, kanibalizasyon sürüyor; redirect haritası geçmiş turda verildi**)**, GBP
   kartı sahiplen/doğrula (kart VAR ama "Own this business?"), GSC dizine-ekleme. (Mail = info@bemisevcharge.com SİZDE,
   Workspace alias GEREKMEZ.) **Site içi SEO + marka sıralaması İYİ** (yeni site "bemis ev charge"de #2).
   **+ (2026-06-14 son — kategori/ürün meta keyword optimizasyonu, CANLI · commit 6641733):** Kullanıcı: "elektrikli araç
   şarj kablosu yerli üretici"de çıkmıyoruz. KÖK NEDEN: kategori meta başlığı SADECE CMS adıydı ("AC Şarj Kabloları") —
   rakipler (elektromarketim "Elektrikli Araç Şarj Kablosu Tip 2 Modelleri" #1, truwatt.com.tr, greenc-ev.com "EV Şarj
   Kablosu Üreticisi") tam arama kelimesini başlığa koyuyor. FIX (`lib/seo.ts`): **CATEGORY_SEO** haritası (8 kategori,
   title+desc+short). `categoryMetaTitle` artık keyword başlığı ("Elektrikli Araç Şarj Kablosu — Type 2"); `categoryMetaDescription`
   keyword-optimize; `productMetaDescription` kategori kelimesini öne alıyor ("Type 2 EV Şarj Kablosu — …"). Ürün page.tsx'e
   kategori id geçildi. ⚠️ Ahrefs/keyword MCP araçları "Insufficient plan" → gerçek keyword verisi çekilemedi (plan gerekir).
   **EN BÜYÜK BEKLEYEN [KULLANICI] (rakip avantajı):** **marketplace listeleme** (hepsiburada/n11/akakçe/pazarama — rakipler
   oradan kazanıyor, hem satış hem backlink) + 301 + backlink + GBP+yorum. **Ben-işi opsiyon:** kategori H1/ürün adlarına
   keyword (CMS/kod), daha çok blog. AI/GEO: net "Bemis = Türkiye'de Type 2 EV şarj kablosu üreticisi" entity cümleleri + şema.
   **+ (2026-06-14 son2 — performans optimizasyonu, KALİTE KAYBI YOK, CANLI · commit 761ef32):** 4-ajanlı denetim workflow'u
   (görsel/hero-geçiş/bundle/CWV-mobil) + sentez. ⚠️ **Görsel quality DEĞİŞMEDİ (75/88/90) — piksel kaybı YOK** (CWV ajanının
   hero q90→82 önerisi kurala aykırı diye PLANA ALINMADI). Uygulanan 10 hızlı kazanım + hero çift-tampon: **AVIF format**
   (`next.config` formats avif+webp; canlı WebP-only dönüyordu → şimdi AVIF, örnek %27 küçük, aynı kalite) + minimumCacheTTL 30g +
   **optimizePackageImports** (react-icons/framer-motion) + **Sentry bundleSizeOptimizations** (Replay çıkar) + GA consent
   afterInteractive + **preconnect** (gtm/fb) + kurumsal hero `priority` + Hero logo `sizes` + /uretici rozet eager→lazy + ölü
   `.hero-bg-animate` CSS sil + **HERO SLIDER ÇİFT-TAMPON** (Hero.tsx: yalnız aktif+komşu katman render → mobil GPU jank biter,
   crossfade korunur). ⚠️ ContentContext no-store refetch'e DOKUNULMADI (dokümante staleness fix). **SONRAKİ TUR (büyük dokunuş,
   denetimde "later"):** section CSS bg'leri → next/image (AVIF kazanır), ham `<img>`'ler (ProductShowcase/ReferenceProjects/
   DealerNetwork harita) → next/image, JS reduced-motion saygısı, InternationalGlobe dynamic import + globe dokularını self-host,
   SectionWrapper framer→CSS, hash-scroll polling→IntersectionObserver, energy-streak background-position shimmer kaldır.
   **+ (2026-06-14 son3 — perf 2. tur, CANLI · commit 012cb24):** YAPILDI: DealerNetwork Türkiye haritası ham `<img>` →
   `next/image` (AVIF, 1327x621, `Image` importu eklendi); Hero `prefers-reduced-motion` JS saygısı (slider crossfade interval
   + RotatingWord, reduce'da durur); InternationalGlobe doku görselleri unpkg → **self-host `/public/globe/`** (4K blue-marble
   1.46MB + 2K topology, KÜÇÜLTÜLMEDİ). ⚠️ **ATLANDI (no-op/risk):** section bg görselleri + referans projeler migrasyonu —
   canlı veride **0 set** (şu an hiçbir şeye dokunmuyor; admin bg yüklerse ileride yapılır); ProductShowcase galeri (drag/slide/
   zoom/odak karmaşık framer — tek görsel için bozma riski). energy-streak background-position dokunulmadı (görsel değişikliği
   riski). ⚠️ Build sırasında `.next` stale-types bozulması olursa `rm -rf .next && npm run build` (eşzamanlı dev+build çakışması).

1. **[KULLANICI] Admin kayıt testi** — Vercel'den `ADMIN_PASSWORD` ayarla → `/admin` giriş →
   bir ürünü değiştir → Kaydet → yenile → durdu mu? **Blob'a yazmanın uygulama üzerinden son
   kanıtı.** Hata verirse Vercel'de `BLOB_READ_WRITE_TOKEN` env'inin deploy'da olduğunu kontrol et.
2. **[KULLANICI] Katalog veri girişi** — EAN/desi/uzun açıklama değerleri (alanlar hazır; uydurulamaz).
3. **[ERTELENDİ] hreflang `/en/`** — ayrı indekslenebilir EN URL; görünür+riskli → ayrı oturum.
4. **[GÜVENLİK] temizlik** — ✅ GitHub secret `JSONBIN_MASTER_KEY` SİLİNDİ + gömülü değer script'lerden temizlendi (2026-06-13).
   **KALAN [KULLANICI]:** anahtar git GEÇMİŞİNDE duruyor → jsonbin.io'da iptal/yenile (tam etkisizleştirme). (ops.) Blob token yenile.

---

> 🖼️ **UI (2026-06-16):** (a) **Referans Projeler — KULLANICI SON KARARI (commit 29c584b):** SABİT 3:2 çerçeve
> (`width clamp280-380 × height clamp190-260`) + görsel `w-full h-full object-cover` + `objectPosition=imagePos`.
> Kullanıcı kırpmayı **admin'den manuel odak noktasıyla** yönetiyor. ⚠️ Flip-flop çok oldu (contain→cover→
> contain→auto-width→**ŞİMDİ cover+imagePos**); kullanıcı KASITLI bunu seçti → DEĞİŞTİRME, sorMADAN dokunma.
> (b) **Portable kart görselleri (commit 29c584b):** `ProductCategoryClient` kart Image'i portable'da `object-cover`
> (diğerleri `object-contain p-1`). NEDEN: portable fotolar ≈KARE (1.05) → contain'de uzun kart çerçevesini
> doldurmaz, küçük kalır; wallbox fotolar DİKEY (0.46-0.94) → contain'de zaten doluyor. `id==="portable"` özel.
> (c) **Reviews mobil overflow (commit 29c584b):** `Reviews.tsx` grid item'larına (`lg:col-span-2/3`) **min-w-0**
> → mobilde grid sütunu 387→335px (içerik min-content sütunu şişirip section overflow-hidden ile kırpıyordu).
> (d) **Teknik çizim galeri padding:** `/teknik-cizim/` görseli ise `p-1` (yoksa `p-4`) → çizim daha büyük oturur.
> (b) **Navbar "Ürünler" thumbnail zemini `#e8eaee` açık gri** (eskiden dark `rgba(255,255,255,0.06)` → ürünler
> kayboluyordu). ℹ️ JSX etiketi İÇİNE `//` yorum koyma = parse hatası (öğrenildi).

> 📐 **TEKNİK ÇİZİMLER (2026-06-16, CANLI · commit fdd20bf):** Eski bemis.com.tr'de teknik çizim deseni
> `bemis.com.tr/img/resimler/bemis/teknikcizim/ev-charge/<KOD>.jpg` — sadece **7 wallbox şarj cihazında** var.
> 7'si indirilip **self-host:** `public/teknik-cizim/<KOD>.jpg`. `ProductDetailClient.tsx` içinde **TECH_DRAWINGS**
> (kod→yol) haritası galeri SONUNA ekler (object-contain). ⚠️ Blob `products` bin'i 403 verdi → veri yerine
> KOD ile çözüldü (daha temiz). Yeni çizim eklemek = görseli `public/teknik-cizim/`'e koy + TECH_DRAWINGS'e 1 satır.
> ⚠️ TECH_DRAWINGS artık `ProductDetailClient.tsx` **module-level**; galeri+lightbox ortak `galleryImages` (gövdede).
> 🔍 **GÖRSEL LIGHTBOX (commit dd49bec):** ürün galeri görseline tıkla → `ImageLightbox` (createPortal→body,
> framer transform'larından kaçar) TAM EKRAN açılır; tıkla-yakınlaş 2.4x (tıklanan noktaya), Pointer Events ile
> sürükle-gezin (mouse+dokunmatik), prev/next + ok tuşları, Esc/dış-tık/✕ kapat, body kilitli. Preview doğrulandı
> (portal-to-body, inline scale 2.4). ⚠️ Mobil PINCH yok (tap-zoom + drag-pan var); istenirse 2-parmak eklenir.
> ⚠️ 301 HÂLÂ YOK (ajans "yaptık" dedi ama 2026-06-16'da eski EV sayfaları hâlâ 200). Hosting Vercel'de KALIYOR
> (kullanıcı kararı; WordPress'e çevirme önerilmedi — SEO downgrade olur).

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
