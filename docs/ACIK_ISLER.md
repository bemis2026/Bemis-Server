# Açık işler — taşınabilir kontrol listesi

> Son güncelleme: 2026-08-03 · Kaynak: `BEMIS_OTURUM_BAGLAM.md` §0
>
> Bu dosya, masaüstündeki `Desktop\Bemis_*.md` teslim dosyalarının **özeti**dir;
> amacı telefondan da "bende ne var" sorusunun cevaplanabilmesi. Ayrıntılı
> adımlar hâlâ o masaüstü dosyalarında. Bir madde bitince buradan sil ve
> `BEMIS_OTURUM_BAGLAM.md`'i de güncelle.

---

## Sende (operatör) bekleyenler

### Google / arama tarafı

- [ ] **Search Console → Ürün şeması → "Doğrulamayı başlat"**
      "brand alanı yineleniyor" uyarısı için. Kod tarafı 2026-08-01'de düzeltildi
      (sayfa başına tek Product); Google'ın yeniden taraması 1-2 hafta sürer.
- [ ] **Google İşletme Profili (GBP) — 7 adım**
      Yinelenen kart kontrolü → kategori → açıklama → 3 eksik ürün → yorum
      toplama → fotoğraf → telefon/web sitesi tutarlılığı.
      Ayrıntı: `Desktop\Bemis_Bursa_Gorunurluk_Adimlari.md`
      ⚠️ "Elektrikli araç şarj istasyonu" kategorisi **halka açık şarj noktası**
      olan yerler içindir; tesiste halka açık ünite yoksa seçme (askıya alma riski).
- [ ] **GBP telefon + web sitesi** sitedekiyle birebir aynı mı? (GBP'de e-posta
      alanı yok — profilde e-posta göstermek istersen tek yol işletme açıklaması,
      Soru-Cevap ya da mesajlaşma.)
- [ ] **Search Console → Performans → Sorgular + Sayfalar → CSV dışa aktar**
      Gerçek SERP sırası yalnız burada görünüyor (Ahrefs planı yetersiz,
      WebSearch ABD merkezli). CSV gelince analiz edilecek.
- [ ] **Bing Webmaster Tools erişimi**
      AI trafiğinin %100'ü ChatGPT; Perplexity + Copilot sıfır — sebep izin değil,
      Bing indeksinde olmamamız. Search Console'dan içe aktarma kısayolu:
      `Desktop\Bemis_Bing_Kurulum.md`

### Ürün / ticari

- [ ] **2026 fiyat listesi — 3 teyit** (üretimle görüşülecek)
      1. Charger Plus 2'de GSM'li modeller sunuluyor mu? (sitede canlı, listede yok)
      2. Sayaç kod şeması: `-1015` mi, `M/G` son eki mi?
         ⚠️ Kod değişirse Merchant/Meta kataloğu ürünü **yeni** sayar (feedId koddan türüyor).
      3. Şarj setleri 16A mı 20A mı? (site 20A, yeni liste 16A diyor)
- [ ] **Vercel `REPLY_TO_EMAIL` env'i** — otomatik yanıtların "cevapla" adresini
      o belirliyor; eski adreste kalmış olabilir.

### Ajans / eski site

- [ ] **bemis.com.tr'deki eski EV fiyat listesi PDF'i** hâlâ yayında
      (`/resimler/bemis/dokumanlar/fiyat-listesi/...2026.pdf`). Ya güncel sürüme
      301'lensin ya kaldırılsın — güncelliği şüpheli fiyat listesi riski.
- [ ] **`http://` → `https://` yönlendirmesi 302** (301 olmalı) ve www'suz varyant
      bir atlama ekliyor. Site geneli davranış, EV yönlendirmelerine özel değil.
      *(Ana 301 haritası 2026-07-29'da uygulandı ve 19/19 doğru — bu sadece artık.)*

---

## Bende (Claude) bekleyenler

- [ ] **Alıntılanabilir cevap blokları** (seçilmiş iş, 2026-08-03)
      Kategori sayfalarına dokunacağı için CMS (R2 `content`) + 5 dil çevirisi
      gerektirir → dikkatli yapılmalı.
- [ ] **V2L kümesini büyütme** — sitenin en güçlü organik damarı
      (Hyundai V2L adaptörü 28 günde 7→35 oturum). İçerik işi, kapsamı netleşmeli.
- [ ] **Footer menüsü yabancı dillerde tamamen İngilizce** — 24 linkin 24'ü.
      Sebep: `byLang` **dizi** değerlerde `ui.json`'a bakmıyor, `{tr,en}` dizisinin
      `en` koluna düşüyor. Kodda böyle yazılmış (tasarım kararı) ama yabancı
      ziyaretçi için gerçek boşluk.
- [ ] **`ui.json` + `glossary` tembel yükleme** — doğru tasarımla yeniden
      denenebilir: sözlüğü modül değişkeni yerine **context state'ine** taşıyarak.
- [ ] **React Compiler** — yalnız yukarıdaki madde bittikten sonra.
      ⚠️ `reactCompiler: true` yapmadan önce `BEMIS_OTURUM_BAGLAM.md`'deki
      "REACT COMPILER AÇILDI → 5 DİLDE İÇERİK KIRILDI" bloğunu oku.

---

## Yakın zamanda kapananlar (tekrar açma)

- ✅ **301 yönlendirmeleri** (2026-07-29) — 19/19 doğru, tek atlama, hedeflerin
  hepsi sitemap'te. Aylardır bekleyen en büyük SEO kaldıracıydı.
- ✅ **Döküman kapakları** (2026-08-02) — 14 dökümanın kapağı üretildi ve
  `next/image`'e alındı. *(Eski "14/14 coverUrl yok" maddesi artık geçersiz.)*
- ✅ **Search Console "brand alanı yineleniyor"** kod tarafı (2026-08-01) —
  sayfa başına tek Product; yalnız Google doğrulaması bekliyor (yukarıda).
- ✅ **Merchant Center** (2026-07-26) — 118 ürün, tek kaynak, yalnız Türkiye,
  KDV dahil fiyat sayfa↔feed birebir.
