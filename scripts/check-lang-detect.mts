/**
 * TARAYICI DİLİ ALGILAMA BEKÇİSİ — `npm run check:dil`
 *
 * ⚠️ NEDEN KALICI BİR TEST: `detectBrowserLang()` içindeki BOT KAPISI SEO açısından
 * kritiktir. Googlebot'un render servisi JS çalıştırır ve navigator.language tipik
 * olarak en-US'tur → kapı bozulursa Google `/` adresinde İNGİLİZCE içerik görür,
 * oysa `/` Türkçe canonical + hreflang tr. Bu SESSİZ bir regresyon olurdu: sayfa
 * ziyaretçiye doğru görünür, yalnız arama motoru yanlış dili indeksler.
 *
 * ⚠️ İkinci korunan davranış: "Türkçe listede önde ise hiçbir şey yapma". Bozulursa
 * Türk ziyaretçiler İngilizce açılır (trafiğin %98'i TR).
 *
 * GERÇEK kaynaktan import eder (kopya mantık YOK) → fonksiyon değişirse test düşer.
 * Build zincirine BİLEREK eklenmedi (check:i18n / check:clones ile aynı gerekçe:
 * uyarı denetimi, dağıtımı durdurmamalı). `app/lib/languages.ts` düzenledikten
 * sonra ÇALIŞTIR.
 */
import { detectBrowserLang } from "../app/lib/languages";

const UA_NORMAL = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36";
const UA_GOOGLEBOT = "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function kur(langs: string[], ua = UA_NORMAL, webdriver = false) {
  Object.defineProperty(globalThis, "navigator", {
    value: { languages: langs, language: langs[0], userAgent: ua, webdriver },
    configurable: true, writable: true,
  });
}

const VAKALAR: [string, string[], string | null, string?, boolean?][] = [
  ["Türk ziyaretçi",                 ["tr-TR", "tr"],   null],
  ["Alman ziyaretçi",                ["de-DE", "de"],   "de"],
  ["ABD ziyaretçi",                  ["en-US", "en"],   "en"],
  ["Fransız (desteklenmeyen dil)",   ["fr-FR"],         "en"],
  ["Suudi ziyaretçi",                ["ar-SA", "ar"],   "ar"],
  ["Rus ziyaretçi",                  ["ru-RU"],         "ru"],
  ["Hollandalı",                     ["nl-NL"],         "nl"],
  ["İngilizce tarayıcı + TR ikinci", ["en-US", "tr"],   "en"],
  ["Türkçe önde, İngilizce ikinci",  ["tr-TR", "en"],   null],
  ["GOOGLEBOT (bot kapısı)",         ["en-US"],         null, UA_GOOGLEBOT],
  ["Otomasyon (webdriver)",          ["de-DE"],         null, UA_NORMAL, true],
  ["Dil listesi boş",                [],                null],
];

let gecen = 0, kalan = 0;
for (const [ad, langs, beklenen, ua, wd] of VAKALAR) {
  kur(langs, ua ?? UA_NORMAL, wd ?? false);
  const c = detectBrowserLang();
  const ok = c === beklenen;
  ok ? gecen++ : kalan++;
  console.log(`${ok ? "OK  " : "HATA"} ${ad.padEnd(32)} -> ${String(c).padEnd(5)} (beklenen ${beklenen})`);
}
console.log(`\n${gecen}/${VAKALAR.length} gecti${kalan ? "  ** " + kalan + " HATA **" : ""}`);
process.exit(kalan ? 1 : 0);
