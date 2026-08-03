# Telefondan ve farklı bilgisayarlardan çalışma

> Son güncelleme: 2026-08-03

## Kısa cevap

Evet — ve şu an bunu kullanıyorsun. Telefondan açtığın bu oturum, projenin
tamamını (kod + yaşayan bağlam + ajanlar + otomasyonlar) bulutta klonlayıp
üstünde çalışıyor. Masaüstündeki bilgisayarın kapalı olması hiçbir şeyi
durdurmuyor.

**Tek kural:** proje hafızası repoda durur. Bir oturum işini commit'lemezse,
sonraki cihaz onu göremez.

---

## Ortak yönetim sohbeti (telefon + PC aynı sohbet)

**Kural: Bemis işleri için sohbet Claude Code'un BULUT oturumundan açılır.**

| Nereden | Nasıl |
|---|---|
| Telefon | Claude uygulaması → **Code** → oturumu seç |
| PC (tarayıcı) | **claude.ai/code** → aynı oturum listede |
| PC (masaüstü uygulaması) | Claude uygulaması → **Code** |

Üçü de aynı hesaba bağlı olduğu için **aynı sohbeti** gösterir; telefonda
bıraktığın yerden PC'de devam edersin.

### ⚠️ Bilgisayardaki terminal sohbeti senkronlanmaz

Windows'ta terminalde `claude` yazarak açılan oturumlar **o makinede kalır**
(`~/.claude/projects`), hesaba yüklenmez. Eski sohbetlerin cihaza bağlı
kalmasının sebebi buydu. Ortak yönetilecek işleri terminalden başlatma —
terminal yalnız o bilgisayara özgü işler için (GA raporu, görsel doğrulama,
`vercel env pull`).

### Eski sohbetler taşınmaz — hafıza taşınır

Geçmiş konuşmalar aktarılamaz. Aktarılan şey **proje hafızası**:
`BEMIS_OTURUM_BAGLAM.md` her yeni oturumda otomatik yüklenir. Yani sıfırdan
açılan bir sohbet bile "nerede kalmıştık"ı bilir. Bu yüzden her oturumu
commit ile bitirmek şart.

### Yeni cihazda sıfırdan başlarken

Yeni bir oturum aç, repo olarak **`bemis2026/Bemis-Server`**'ı seç ve şunu yaz:

> Bemis sitesi üzerinde çalışıyoruz. `BEMIS_OTURUM_BAGLAM.md` §0'ı ve
> `docs/ACIK_ISLER.md`'yi oku, nerede kaldığımızı özetle.

Bağlam zaten otomatik yüklenir; bu cümle sadece özet çıkarmasını söyler.

---

## Kontrol Odası (GitHub) — yeni işler için ortak kanal

**Issue #20: "📌 Bemis Kontrol Odası"** — cihazdan ve oturumdan tamamen
bağımsız ortak kanal. Telefon (GitHub uygulaması), herhangi bir PC (tarayıcı)
ve e-posta bildirimi; üçünden de aynı başlık.

Yoruma tetikleyici kelimeyi (**@** + **claude**, bitişik) yazıp isteği eklersin
→ `.github/workflows/claude.yml` çalışır, GitHub'ın sunucusunda repo okunur, iş
yapılır, dal açılır ve aynı başlığa cevap yazılır.

Claude Code oturumlarından farkı: **kalıcı ve aranabilir**. Konteyner ömrü ya da
oturum listesi önemli değil.

### ⚠️ Bu kanal şu an kullanılamıyor — hesap kademesi

11 Mayıs 2026'da 3 kez denenmiş, **üçü de başarısız**. Sebep ayar hatası değil:

```
API Error: Request rejected (429)
This request would exceed your organization's rate limit of
10,000 input tokens per minute (model: claude-opus-4-7)
```

Anahtar geçerli, faturalama çalışıyor (denemede 0,19 $ işlendi). Sorun,
Anthropic API hesabının **dakikalık limit kademesinin düşük** olması — Claude
Code'un istemi tek istekte 10.000 girdi jetonunu aşıyor, bu yüzden her çağrı
anında reddediliyor.

- **Repo tarafında yapıldı:** model Opus → **Sonnet**, `--max-turns 10`
  (`claude.yml`). Hız limitleri model sınıfı başına ayrı tutulur, Sonnet'in payı
  daha yüksek. Yeterli *olabilir*, garanti değil.
- **Kalıcı çözüm (hesap tarafı):** console.anthropic.com → Billing → bakiye
  ekle; kullanım kademesi yükselince dakikalık limit de yükselir.

📌 Bu bir **API hesabı** limiti; Claude uygulamasındaki aboneliğinle ilgisi yok.
İkisi ayrı faturalanır.

### Henüz kurulu olmayan (istersen eklenir)

- **Günlük uyanan oturum:** sohbet her sabah kendiliğinden uyanıp durum özeti
  bırakır (Routine). Hangi cihazdan bakarsan bak güncel olur.

---

## Nasıl devam edersin

**Telefondan veya herhangi bir bilgisayardan:** claude.ai/code → `Bemis-Server`
reposunu seç → yaz. Oturum açılırken `CLAUDE.md` üzerinden
`BEMIS_OTURUM_BAGLAM.md` (yaşayan bağlam) otomatik yüklenir; yani "nerede
kalmıştık" bilgisi kendiliğinden gelir.

**Oturumu kapatmadan önce** anlamlı bir değişiklik olduysa:
`BEMIS_OTURUM_BAGLAM.md` güncellensin ve **commit edilsin**. Bu, cihazlar arası
devamlılığın tek şartı.

**Yayına alma:** telefondan da aynı — `git push` → Vercel otomatik deploy eder.
Ayrıca `vercel --prod` çalıştırma (çift deploy kuyruğu şişiriyor).

---

## Neyi nereden yapabilirsin

| İş | Telefon / web | Masaüstü |
|---|---|---|
| Kod okuma, düzenleme, commit, push | ✅ | ✅ |
| PR açma / inceleme / birleştirme | ✅ | ✅ |
| Yayına alma (push → Vercel) | ✅ | ✅ |
| İçerik/ürün/bayi düzenleme (`/admin` paneli, tarayıcıdan) | ✅ | ✅ |
| GitHub Issue'da `@claude <iş>` ile iş verdirme | ✅ | ✅ |
| Site sağlık / SEO / Sentry otomasyonları | ✅ (GitHub'da çalışır) | ✅ |
| Canlı siteye istek atıp doğrulama | ⚠️ bkz. aşağıda | ✅ |
| Google Analytics raporu | ❌ | ✅ |
| Ekran görüntüsü / Playwright görsel doğrulama | ❌ | ✅ |
| `vercel env pull`, doğrudan R2 yazma | ❌ | ✅ |

---

## Telefondan yapılamayanlar ve çözümü

**1. Canlı siteye erişim.** Bu bulut ortamının ağ politikası
`www.bemisevcharge.com.tr` adresine çıkışı engelliyor (2026-08-03'te ölçüldü:
CONNECT → 403). Yani buradan "sayfa 200 mü, şu metin canlıda var mı" diye
bakılamıyor.
→ **Çözüm:** canlı kontroller GitHub Actions'a taşındı (aşağıdaki liste). Ayrıca
Claude Code web ayarlarından ortamın ağ politikası genişletilirse bu oturumdan da
erişilebilir hale gelir.

**2. Google Analytics.** `ga-bemis` bağlantısının anahtarı masaüstünde
(`C:\Users\sales\.ga\bemis-ga-key.json`). GA raporu gerektiren işler masaüstü
oturumunda yapılmalı; ya da GA panelinden ekran görüntüsü/CSV paylaşılır.

**3. Görsel doğrulama.** Tarayıcı ile ölçüm (kadraj, kontrast, taşma) masaüstü
işi. Telefondan yapılan tasarım değişikliklerinde bunu açıkça belirt — "görsel
doğrulanmadı" diye not düş.

---

## Hiçbir cihaz açık olmasa da çalışanlar

Bunlar GitHub'ın sunucusunda çalışır; bilgisayarın kapalı olması etkilemez:

| Otomasyon | Ne zaman | Ne yapar |
|---|---|---|
| `daily-site-health.yml` | Her gün 08:00 | Sayfa erişimi + katalog sayımları; her düşüş 🔴 alarm |
| `daily-monitors.yml` | Her gün 06:00 | Form spam'i + SSL sertifika süresi |
| `weekly-health.yml` | Pazartesi 09:00 | Sentry 14 günlük hata özeti |
| `monthly-deep-audit.yml` | Ayın 1'i 05:00 | Sitemap + PageSpeed anlık görüntüsü |
| `claude.yml` | `@claude` yazınca | Issue/PR içinde iş yapar |

Hepsi bulguyu **GitHub Issue + e-posta** olarak gönderir → telefondan görürsün.
Temizse sessiz kalır.

### Site sağlık bekçisi hakkında

`scripts/site-sentinel.cjs` sayımları `data/site-baseline.json` ile karşılaştırır:

- Sayım **artarsa** taban çizgisi yukarı güncellenir (normal büyüme).
- Sayım **düşerse** 🔴 alarm — düşüş asla "yeni normal" sayılmaz.
- Alarm varken taban çizgisi **dondurulur** (maskeleme yok).
- Düşüş meşruysa: `node scripts/site-sentinel.cjs --rebaseline`

Taban çizgisi ilk çalışmada canlı siteden kendi kendine oluşur; elle sayı
girmek gerekmez. Uç noktalardan biri okunamazsa tohumlama atlanır (yanlış
taban çizgisi yazılmaz).

---

## Masaüstüne bağlı kalanlar (dürüst liste)

- **Masaüstü uygulamasındaki 6 zamanlanmış görev.** Bunlar
  `Desktop\Bemis_Raporlar\*.cjs` dosyalarını çağırır ve yalnız o bilgisayarda
  çalışır. Günlük site sağlık kontrolü artık GitHub'da da çalıştığı için
  **`gunluk-site-saglik` yerel görevi gereksiz hale geldi** — istersen kaldır
  (ikisi birden kalırsa aynı gün iki bildirim gelir).
- **Masaüstündeki teslim dosyaları** (`Desktop\Bemis_*.md` — Bing kurulumu,
  Bursa görünürlük adımları, 301 haritası, GEO paketi vb.). Bunların *özeti*
  `docs/ACIK_ISLER.md` içinde; tam metinleri hâlâ masaüstünde. Telefondan
  gerekiyorsa o dosyayı repoya taşımak gerekir.
- **`BEMIS_PROJECT_CONTEXT.md`** (masaüstündeki eski kanonik bağlam dosyası).
  Artık kanonik değil — yetkili kaynak repodaki `BEMIS_OTURUM_BAGLAM.md`.

---

## Sık karşılaşılan durum

**"Masaüstünde bir şey yaptım, telefonda görünmüyor."**
Muhtemelen commit/push edilmemiştir. Masaüstünde `git status` → commit → push.
Doğrusu: her oturumu commit ile bitir.

**"Telefondan değiştirdim, masaüstü eski hâlde."**
Masaüstünde `git pull origin main` (veya çalıştığın dal).

**"İki cihazdan aynı anda çalıştım, çakıştı."**
Aynı dosyada çakışma olduysa git birleştirme yapar. Karışıklığı önlemek için
her iş için ayrı dal aç, telefondan PR olarak birleştir.
