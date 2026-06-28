# Bemis Website — Yaşayan Oturum Bağlamı (HER OTURUMDA OKU)

> **Bu dosya CLAUDE.md `@import` ile her oturumda OTOMATİK yüklenir.** Amacı: sohbet dolup
> sıfırlansa/temizlense bile yeni oturum bağlamdan KOPMADAN, halüsinasyon görmeden devam etsin.
>
> **Kural:** Anlamlı her değişiklikten sonra + sohbet dolmaya yaklaşınca bu dosyayı GÜNCELLE.
> Derin teknik bağlam: `Desktop/Claude Çalışmaları/Bemis Website/md/BEMIS_PROJECT_CONTEXT.md`
> (özellikle §15.16 denetim, §15.17 Blob taşıması).
>
> Son güncelleme: **2026-06-28**

---

## 0. ŞU AN AÇIK İŞ (önce burayı oku)

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
