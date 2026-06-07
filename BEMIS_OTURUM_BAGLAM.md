# Bemis Website — Yaşayan Oturum Bağlamı (HER OTURUMDA OKU)

> **Bu dosya CLAUDE.md `@import` ile her oturumda OTOMATİK yüklenir.** Amacı: sohbet dolup
> sıfırlansa/temizlense bile yeni oturum bağlamdan KOPMADAN, halüsinasyon görmeden devam etsin.
>
> **Kural:** Anlamlı her değişiklikten sonra + sohbet dolmaya yaklaşınca bu dosyayı GÜNCELLE.
> Derin teknik bağlam: `Desktop/Claude Çalışmaları/Bemis Website/md/BEMIS_PROJECT_CONTEXT.md`
> (özellikle §15.16 denetim, §15.17 Blob taşıması).
>
> Son güncelleme: **2026-06-07**

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
   **Kilit SEO dosyaları:** `app/blog/*`, `app/uretici/*`, `app/lib/seo.ts` (articleSchema/faqSchema/
   blogListingSchema), `app/sitemap.ts`, `Footer.tsx`, `ProductDetailClient.tsx`, `ProductCategoryClient.tsx`.
   **GBP gerçeği:** Bemis Teknik kartı VAR; aynı adreste AYRI "Bemis E-V Charge" kartı Google yinelenen
   sayıyor → Teknik kartını EV için kullan (kategori+foto+açıklama). **Mail:** bemisevcharge.com.tr'de MX YOK;
   Google Workspace'e alan-adı-alias ile `info@bemisevcharge.com.tr` açılacak (hafta içi). Merchant+Ads kuruldu
   (feed.xml hazır ama EUR fiyat + sepet olmadan tam çalışmaz). 
   **Sıradaki sen-işi:** GSC'de yeni sayfalara "dizine eklenmesini iste" + GBP doldur + ürün açıklamaları(TL).
   **Sıradaki ben-işi (opsiyon):** şehir sayfaları, daha çok blog. İkinci hedef: e-ticaret (ödeme sağlayıcı + TL fiyat gelince).

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
