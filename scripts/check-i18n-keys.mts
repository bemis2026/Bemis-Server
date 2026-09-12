/**
 * ARAYÜZ ÇEVİRİ BEKÇİSİ — `npm run check:i18n`
 *
 * DÖRT SESSİZ KUSUR SINIFINI birlikte arar. Hiçbiri hata/uyarı vermez; yalnız
 * de/es/ar/ru/nl ziyaretçisi İngilizce (ya da Türkçe) metin görür.
 * Hepsi 2026-09-12'de canlıda GERÇEKTEN çıktı — kullanıcı sosyal paylaşımlar
 * bölümünün yabancı dillerde İngilizce kaldığını bildirdi, tarama 4 sınıfı buldu.
 *
 * 1) EKSİK ANAHTAR — `pickText(lang, tr, en)` sözlüğe İNGİLİZCE dizeyle bakar
 *    (`UI[en]?.[lang] ?? en`). Anahtar `data/i18n/ui.json`'da yoksa İngilizce
 *    döner. Bulunan: 20 anahtar (SocialWall'in 9'undan 8'i eksikti).
 *
 * 2) ŞABLON DEĞİŞKENLİ ANAHTAR — `pickText(lang, \`${n} sürüm\`, \`${n} versions\`)`
 *    biçiminde anahtar her değerde DEĞİŞİR → sözlükte hiçbir zaman eşleşemez →
 *    5 dil KALICI İngilizce görür. (1) bunu yakalayamaz: anahtar "eksik" değil,
 *    var OLAMAZ. Çözüm `fillText(lang, "... {n} ...", ..., { n })`.
 *
 * 3) `lib/uiStrings.ts` STRINGS girdileri — `useUiStrings()` TEK argümanlı
 *    `t(key)` döner, içeride `pickText(lang, p.tr, p.en)` çağırır. Çağrı biçimi
 *    farklı olduğu için (1) numaralı tarama bu 222 girdinin HİÇBİRİNİ görmez.
 *
 * 4) SABİT TÜRKÇE ÖZNİTELİK — `aria-label="Öne çıkan ürünler …"` gibi hiç çağrı
 *    İÇERMEYEN dizeler. (1) 0 dönerken bu metinler 6 dilde TÜRKÇE kalır; Arapça
 *    sayfa doğrulanırken 3 bölümde bizzat görüldü (toplam 17 düzeltildi).
 *
 * ⚠️ BUILD ZİNCİRİNE BİLEREK EKLENMEDİ (check:clones ile aynı gerekçe): bu bir
 *    UYARI denetimi. Eksik anahtar sayfayı kırmaz, İngilizce'ye düşer — dağıtımı
 *    durdurmak yeni bir dize eklerken işi tıkar. Rakip-marka guard'ı ise hard
 *    stop olmalıdır (manuel işlem riski), o yüzden o build'e zincirli.
 * 📌 Yeni arayüz dizesi / aria-label ekledikten sonra ÇALIŞTIR.
 */
import fs from "node:fs";

const DILLER = ["de", "es", "ar", "ru", "nl"];
const TR = /[ğışİŞĞ]/; // ⚠️ ö/ü/ç ile tarama Almanca/Fransızca dizelerde YANLIŞ ALARM verir

// ── (1) BİLEREK sözlükte olmayan anahtarlar ──────────────────────────────────
// "." → CookieConsent'te mailto cümlesini kurmak için dil hilesi: TR
//   " adresine yazabilirsiniz." ↔ EN "." (İngilizcede cümle e-postayla biter).
const ANAHTAR_MUAF = new Set(["."]);

// ── (4) BİLEREK Türkçe kalan öznitelikler ───────────────────────────────────
// Anahtar: "<dosya>|<metin>". Gerekçesiz muafiyet EKLEME.
const OZNITELIK_MUAF = new Map<string, string>([
  // ADMIN DÜZENLEME MODU — ziyaretçiye hiç render edilmez, arayüzü Türkçe.
  ["components/SectionWrapper.tsx|Yukarı Taşı", "admin düzenleme modu"],
  ["components/SectionWrapper.tsx|Aşağı Taşı", "admin düzenleme modu"],
  ["components/EditBar.tsx|İleri Al (Ctrl+Y)", "admin düzenleme modu"],
  ["components/PropertiesPanel.tsx|varsayılan", "admin düzenleme modu"],
  // TR-ONLY İÇERİK SAYFALARI — gövde metni Türkçe; alt/title'ı çevirmek
  // Türkçe gövdeyle çelişen karma dil üretir (yabancı adresleri de yok).
  ["destek/DestekClient.tsx|Şarj sorunlarının çoğu cihaz arızası değildir — tesisat, araç ayarı veya bağlantı kaynaklıdır. Belirtinizi bulun, adımları sırayla deneyin.", "/destek TR-only içerik"],
  ["destek/DestekClient.tsx|Hızlı kontroller sorunu çözmediyse kaydınızı şu sırayla açın.", "/destek TR-only içerik"],
  ["uretici/UreticiClient.tsx|Kendi Markanızla, Kendi Renginizde Üretim", "/uretici TR-only içerik"],
  ["iletisim/ContactPageClient.tsx|Bemis E-V Charge konum haritası", "/iletisim TR-only içerik"],
  // HUKUK METNİ BAŞLIKLARI — KVKK/çerez metinleri Türk mevzuatı, TR kanonik.
  ["cerez-politikasi/page.tsx|Çerez Politikası", "KVKK/hukuk metni TR kanonik"],
  ["gizlilik/page.tsx|Gizlilik ve Kişisel Verilerin Korunması Aydınlatma Metni", "KVKK/hukuk metni TR kanonik"],
  // KANONİK KİMLİK — resmî unvan ve site-geneli tek OG görseli çevrilmez.
  ["uretici/UreticiClient.tsx|Bemis Teknik Elektrik A.Ş.", "resmî unvan (kanonik NAP)"],
  ["opengraph-image.tsx|Bemis E-V Charge — Yerli EV Şarj Ekipmanı Üreticisi", "site-geneli tek OG görseli"],
]);

const ui = JSON.parse(fs.readFileSync("data/i18n/ui.json", "utf8")) as Record<string, Record<string, string>>;

const dosyalar: string[] = [];
const gez = (d: string) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const yol = `${d}/${e.name}`;
    if (e.isDirectory()) gez(yol);
    else if (/\.(tsx|ts)$/.test(e.name)) dosyalar.push(yol);
  }
};
gez("app");
gez("lib");

/** Yorum satırlarını boşaltır (satır numaraları korunur) — ui.ts'teki
 *  "böyle YAPMA" örneği aksi hâlde kalıcı yanlış alarm verir. */
function yorumsuz(s: string): string {
  return s
    .split("\n")
    .map((l) => {
      const t = l.trim();
      return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") ? "" : l;
    })
    .join("\n");
}
const satirNo = (s: string, i: number) => s.slice(0, i).split("\n").length;

// ⚠️ Çok satırlı çağrılarda sondaki VİRGÜL opsiyoneldir (`,?`) — bunu hesaba
//    katmayan ilk sürüm hesaplayıcı sayfasının uzun paragrafını kaçırdı.
const DUZ = [
  /(?:pickText|fillText)\(\s*[A-Za-z_$][\w$]*\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,?/g,
  /\b[tTL]{1,2}\(\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,?\s*\)/g,
];
const SABLON = [
  /pickText\(\s*[A-Za-z_$][\w$]*\s*,\s*`([^`]*)`\s*,\s*`([^`]*)`/g,
  /\b[tTL]{1,2}\(\s*`([^`]*)`\s*,\s*`([^`]*)`/g,
  /pickText\(\s*[A-Za-z_$][\w$]*\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*`([^`]*)`/g,
  /pickText\(\s*[A-Za-z_$][\w$]*\s*,\s*`([^`]*)`\s*,\s*"((?:\\.|[^"\\])*)"/g,
];
const OZNITELIK = /(aria-label|aria-description|alt|title|placeholder)\s*=\s*"([^"]*)"/g;

type Bulgu = { en: string; tr: string; dosya: string; satir: number; ek?: string };
const eksik: Bulgu[] = [];
const yarim: Bulgu[] = [];
const dinamik: Bulgu[] = [];
const sabit: Bulgu[] = [];
const gorulen = new Set<string>();
let cagri = 0;

for (const f of dosyalar) {
  const ham = fs.readFileSync(f, "utf8");
  const s = yorumsuz(ham);
  const takmaVar = /const\s+[tTL]{1,2}\s*=\s*\([^)]*\)\s*=>\s*pickText\(/.test(s);

  // (1) eksik / yarım anahtar
  for (const [i, re] of DUZ.entries()) {
    if (i === 1 && !takmaVar) continue;
    for (const m of s.matchAll(re)) {
      cagri++;
      const en = m[2], tr = m[1];
      if (gorulen.has(en) || ANAHTAR_MUAF.has(en)) continue;
      gorulen.add(en);
      const b = { en, tr, dosya: f, satir: satirNo(s, m.index!) };
      const v = ui[en];
      if (!v) { eksik.push(b); continue; }
      const ed = DILLER.filter((d) => !v[d]?.trim());
      if (ed.length) yarim.push({ ...b, ek: ed.join(",") });
    }
  }

  // (2) şablon değişkenli anahtar
  for (const re of SABLON) {
    for (const m of s.matchAll(re)) {
      if (!m[1].includes("${") && !m[2].includes("${")) continue;
      dinamik.push({ en: m[2], tr: m[1], dosya: f, satir: satirNo(s, m.index!) });
    }
  }

  // (4) sabit Türkçe öznitelik — admin paneli BİLEREK yalnız Türkçe
  if (!f.includes("/admin/") && f.endsWith(".tsx")) {
    for (const m of s.matchAll(OZNITELIK)) {
      if (!TR.test(m[2])) continue;
      const kisa = f.replace(/^app\//, "");
      if (OZNITELIK_MUAF.has(`${kisa}|${m[2]}`)) continue;
      sabit.push({ en: m[1], tr: m[2], dosya: f, satir: satirNo(s, m.index!) });
    }
  }
}

// (3) lib/uiStrings.ts STRINGS haritası
const usSrc = fs.readFileSync("lib/uiStrings.ts", "utf8");
const usRe = /^\s*([A-Za-z_][\w]*)\s*:\s*\{\s*tr:\s*"((?:\\.|[^"\\])*)"\s*,\s*en:\s*"((?:\\.|[^"\\])*)"\s*\}/gm;
const usGirdi = [...usSrc.matchAll(usRe)].map((m) => ({ anahtar: m[1], tr: m[2], en: m[3] }));
const usEksik: typeof usGirdi = [];
for (const g of usGirdi) {
  if (g.tr === g.en) continue;          // marka/ölçü/kısaltma — çeviri gerekmez
  if (ANAHTAR_MUAF.has(g.en)) continue;
  const v = ui[g.en];
  if (!v || DILLER.some((d) => !v[d]?.trim())) usEksik.push(g);
}

console.log(`taranan dosya: ${dosyalar.length} · pickText çağrısı: ${cagri} · tekil anahtar: ${gorulen.size}`);
console.log(`uiStrings girdisi: ${usGirdi.length} · ui.json: ${Object.keys(ui).length}`);

const yaz = (baslik: string, l: Bulgu[], bicim: (b: Bulgu) => string) => {
  if (!l.length) return;
  console.log(`\n${baslik}: ${l.length}`);
  const g = new Map<string, Bulgu[]>();
  for (const b of l) {
    const k = b.dosya.replace(/^app\/|^lib\//, "");
    if (!g.has(k)) g.set(k, []);
    g.get(k)!.push(b);
  }
  for (const [f, bl] of [...g].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`── ${f}  (${bl.length})`);
    for (const b of bl) console.log(`   :${b.satir}  ${bicim(b)}`);
  }
};

yaz("🔴 (1) ui.json'da HİÇ OLMAYAN anahtar  → 5 dil İNGİLİZCE görür", eksik, (b) => `"${b.en}"   ←  "${b.tr}"`);
yaz("🟡 (1) VAR ama bazı diller eksik", yarim, (b) => `"${b.en}"  eksik: ${b.ek}`);
yaz("🔴 (2) ŞABLON DEĞİŞKENLİ anahtar  → 5 dil KALICI İngilizce; fillText kullan", dinamik, (b) => `tr: ${b.tr}  ·  en: ${b.en}`);
yaz("🔴 (4) SABİT TÜRKÇE öznitelik  → 6 dilde TÜRKÇE kalır; pickText'e bağla", sabit, (b) => `${b.en}="${b.tr}"`);
if (usEksik.length) {
  console.log(`\n🔴 (3) uiStrings girdisi ui.json'da eksik: ${usEksik.length}`);
  for (const g of usEksik) console.log(`   ${g.anahtar}  "${g.en}"   ←  "${g.tr}"`);
}

const toplam = eksik.length + yarim.length + dinamik.length + sabit.length + usEksik.length;
console.log(
  toplam
    ? `\n🔴 ${toplam} sorun — ui.json'a ekle / fillText'e çevir / pickText'e bağla.\n   (Bilerek Türkçe kalan bir öznitelik varsa OZNITELIK_MUAF'a GEREKÇESİYLE ekle.)`
    : `\n✅ Arayüz çeviri bekçisi: temiz (4 sınıf · ${OZNITELIK_MUAF.size} gerekçeli muafiyet).`,
);
process.exit(toplam ? 1 : 0);
