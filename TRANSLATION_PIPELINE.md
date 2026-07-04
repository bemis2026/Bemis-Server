# Çok-dilli AI Çeviri Pipeline'ı

Siteyi Türkçe (kaynak) → **EN · DE · ES · AR · RU** dillerine, Anthropic Claude ile
**AI kalitesinde** çeviren sistem. EV-şarj terminolojisine hâkim; marka/standart/birim
adlarını korur; **her güncellemede yalnız değişeni yeniden çevirir** (oto-senkron).

## Parçalar

| Dosya | Ne yapar |
|---|---|
| `app/lib/languages.ts` | 6 dilin TEK KAYNAĞI (kod, ad, yön/dir, bayrak). Yeni dil = 1 kayıt. |
| `lib/aiTranslate.ts` | AI çeviri motoru (Claude). EV-terminoloji sistem-prompt'u + korunan terimler. |
| `scripts/translate.ts` | Pipeline: içeriği okur → çevirir → `data/i18n/*.json`'a yazar. Oto-senkron. |
| `data/i18n/glossary.json` | Sözlük çevirileri (dile göre). Pipeline üretir; `app/lib/glossaryI18n.ts` okur. |
| `data/i18n/.manifest.json` | Kaynak (TR) içerik hash'leri → neyin değiştiğini bilir (oto-senkron belleği). |

## Kullanım

```powershell
# 1) Anahtarı ayarla (console.anthropic.com → API Keys)
$env:ANTHROPIC_API_KEY = "sk-ant-..."

# 2) Ne çevrileceğini gör (API çağrısı YOK, ücretsiz)
npm run translate -- --dry

# 3) Değişen/eksik olan HER ŞEYİ çevir
npm run translate

# Seçenekler
npm run translate -- --lang de,es    # yalnız seçili diller
npm run translate -- --force         # her şeyi baştan (manifest'i yok say)
```

Model varsayılan **claude-opus-4-8** (en kaliteli). Maliyet düşürmek için:
`$env:TRANSLATE_MODEL = "claude-sonnet-5"` (veya `claude-haiku-4-5`).

## Oto-senkron nasıl çalışır

Her kaynak parçanın (bir sözlük terimi, bir blog vb.) TR içeriğinin hash'i
`.manifest.json`'da tutulur. `npm run translate` çalışınca:

- Hash aynı + çeviri var → **atla** (maliyet yok).
- TR metin değişmiş (hash farklı) → o parçayı **tüm dillerde yeniden çevir**.
- Yeni parça / eksik dil → **çevir**.

Yani: içeriği düzenle → `npm run translate` → yalnız değişen yeniden çevrilir (kuruş
maliyet). İçerik güncellemeden sonra bunu çalıştırmak = çevirileri senkron tutmak.

## Kapsam (aşamalı)

- ✅ **Sözlük** (`app/lib/glossary.ts`, 15 terim) — pilot, bağlı.
- ⏳ **Blog** (`app/blog/posts.ts`) — `SOURCES`'a kaynak eklenecek.
- ⏳ **Sayfa/UI metinleri** (bileşenlerdeki sabit dizeler) — toplanıp kaynak eklenecek.
- ⏳ **CMS içeriği** (ürün/içerik/b2b — R2 bin'leri) — admin-kayıtta oto-çeviri
  bugün MyMemory (makine) ile EN üretiyor (`lib/contentTranslate.ts`,
  `lib/productsTranslate.ts`); bu motora + 5 dile yükseltilecek. Üretimde
  **Vercel env `ANTHROPIC_API_KEY`** gerekir.

Yeni içerik türü eklemek: `scripts/translate.ts` içindeki `SOURCES` dizisine bir
kaynak ekle (`units()` → çevrilecek parçalar + hash; `apply()` → çeviriyi yerleştir).
Motor ve senkron mantığı aynen çalışır.

## Dil seçici / RTL (sıradaki adım)

Diller üretildikten SONRA `LanguageContext` + Navbar dil seçici 6 dile genişletilecek;
Arapça için `<html dir="rtl">` (config `dir:"rtl"` zaten hazır). Şu an seçici tr/en.
