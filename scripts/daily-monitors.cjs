#!/usr/bin/env node
/**
 * Daily monitor sweep — quick checks, each gated by a hard threshold so we
 * only ping the operator when something actually needs attention.
 *
 *   form-spam : new contact-form submissions in the last 24h > 10
 *   ssl-expiry: production cert < 14 days from expiry
 *
 * NOT: Eski "bin-size" kontrolü kaldırıldı — veri JSONBin'den Vercel Blob'a
 * taşındı (2026-06-01). Blob'da 100KB kayıt limiti YOK, dolayısıyla boyut
 * uyarısına gerek kalmadı.
 *
 * Each surfaced finding is piped through notify-finding.cjs so the
 * notification surface stays uniform (GitHub Issue + email).
 *
 * Env required:
 *   BLOB_READ_WRITE_TOKEN — read messages bin from Vercel Blob
 *   GH_TOKEN + GH_REPO    — issue creation
 *   RESEND_API_KEY + NOTIFY_EMAIL — email pipe (notify-finding)
 *
 * Idempotency: notify-finding.cjs already de-dupes by issue title.
 */

const { spawnSync } = require("child_process");
const tls = require("tls");
// ⚠️ 2026-08-22: Vercel Blob TERK EDİLDİ (2026-07-02'de R2'ye geçildi) ama bu betik
//    mesajları hâlâ oradan okuyordu → her gün "0 mesaj" yazıyor, gerçek bir spam
//    dalgasını ASLA yakalayamıyordu. Artık sayıyı sitenin korumalı sayaç ucundan alır.
//    Böylece R2 kimlikleri ve şifre anahtarı GitHub secret'larına kopyalanmak zorunda
//    kalmadı; robotun eline yalnız bir SAYI geçiyor (ad/e-posta/telefon çıkmıyor).
const SITE       = process.env.SITE_URL || "https://www.bemisevcharge.com.tr";
const MONITOR_KEY = process.env.MONITOR_KEY;

const FORM_SPAM_THRESHOLD = 10;     // mesaj / 24h
const SSL_DAYS_THRESHOLD  = 14;

function notify(title, severity, body, source) {
  const payload = JSON.stringify({ title, severity, body, source });
  const r = spawnSync("node", ["scripts/notify-finding.cjs"], {
    input: payload,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (r.status !== 0) console.error("[monitors] notify failed");
}

// Form sayacını oku. ⚠️ Uç 401/503 dönerse SESSİZ GEÇME — körlük tam da bu şekilde
//    oluşmuştu; hata fırlatılır ve aşağıda raporlanır.
async function formSayaci() {
  if (!MONITOR_KEY) throw new Error("MONITOR_KEY tanımlı değil");
  const r = await fetch(`${SITE}/api/health/form-count`, {
    headers: { "x-monitor-key": MONITOR_KEY },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`sayaç ucu HTTP ${r.status}`);
  return await r.json();
}
// ── form spam ──
async function checkFormSpam() {
  try {
    const sayac = await formSayaci();
    const recent = { length: sayac.son24Saat };
    console.log(`form spam: ${sayac.son24Saat} mesaj / 24h (arşiv toplam ${sayac.toplam})`);
    if (recent.length > FORM_SPAM_THRESHOLD) {
      notify(
        `İletişim formu — 24 saatte ${recent.length} mesaj (eşik ${FORM_SPAM_THRESHOLD})`,
        recent.length > FORM_SPAM_THRESHOLD * 3 ? "critical" : "medium",
        [
          `Son 24 saatte ${recent.length} form gönderildi (normal eşik: ${FORM_SPAM_THRESHOLD}).`,
          ``,
          `Spam olabilir — admin → Mesajlar üzerinden gözden geçir.`,
          `Yoğun bir kampanya/PR çıktığı bir gün ise yok say.`,
          ``,
          `Konu dağılımı:`,
          ...Object.entries(sayac.konular || {}).map(([k, v]) => `  · ${k}: ${v}`),
        ].join("\n"),
        "form-spam"
      );
    }
  } catch (e) {
    // ⚠️ Eskiden burada yalnız console.error vardı → kontrol yıllarca kör kalabilirdi.
    //    Artık okunamama DA bildirilir; sessiz başarısızlık yok.
    console.error("form spam check failed:", e.message);
    notify(
      "İzleme: form sayacı okunamadı",
      "medium",
      [`Günlük robot form sayısını alamadı: ${e.message}`, ``,
       `Kontrol: MONITOR_KEY hem Vercel env'inde hem GitHub secret'larında tanımlı mı?`,
       `Uç: ${SITE}/api/health/form-count`].join(String.fromCharCode(10)),
      "form-count-unreachable"
    );
  }
}


// ── katalog sağlığı ──
// ⚠️ NEDEN VAR (2026-08-22): kullanıcı "IP68 uzatma kablosunu sitede göremedim"
//    dedi. Ürün VARDI ama ayırt edici niteliği (IP68) yalnız ALT BAŞLIKTAYDI ve
//    3 varyant aynı adı paylaştığı için tek kartta gruplanıyordu. Bu sınıf hata
//    gözle bakmadan fark edilmiyor → artık her sabah otomatik denetleniyor.
// ⚠️ Buradaki dört sayının HEPSİ normalde 0 olmalı; eşik/temel gerekmez.
//    Sıfırdan büyük her değer gerçek bir kusurdur.
async function checkKatalogSagligi() {
  try {
    const r = await fetch(`${SITE}/api/products`, { cache: "no-store" });
    if (!r.ok) throw new Error(`/api/products HTTP ${r.status}`);
    const j = await r.json();
    const kats = Array.isArray(j) ? j : j.products;
    if (!Array.isArray(kats)) throw new Error("ürün yapısı tanınmadı");
    const hepsi = [];
    for (const k of kats) for (const p of (k.products || [])) hepsi.push(p);
    const fiyatVar = (p) => (p.specs || []).some((g) => (g.items || []).some((i) => /fiyat|price/i.test(i.label || "") && String(i.value || "").trim()));
    const gorselsiz = hepsi.filter((p) => !p.image);
    const fiyatsiz  = hepsi.filter((p) => !fiyatVar(p));
    const aciksiz   = hepsi.filter((p) => !String(p.description || "").trim());
    // Ad + alt başlığı AYNI olan ürünler kartta hiç ayırt edilemez.
    const anahtar = {};
    for (const p of hepsi) { const a = `${p.name}||${p.subtitle || ""}`; (anahtar[a] = anahtar[a] || []).push(p.code || p.id); }
    const ikiz = Object.entries(anahtar).filter(([, v]) => v.length > 1);
    console.log(`katalog: ${hepsi.length} ürün · görselsiz ${gorselsiz.length} · fiyatsız ${fiyatsiz.length} · açıklamasız ${aciksiz.length} · ayırt edilemeyen ${ikiz.length}`);
    const sorun = [];
    if (gorselsiz.length) sorun.push([`Görselsiz ürün: ${gorselsiz.length}`, gorselsiz.slice(0, 8).map((p) => `  · ${p.code || p.id} — ${p.name}`)]);
    if (fiyatsiz.length)  sorun.push([`Fiyatsız ürün: ${fiyatsiz.length}`,  fiyatsiz.slice(0, 8).map((p) => `  · ${p.code || p.id} — ${p.name}`)]);
    if (aciksiz.length)   sorun.push([`Açıklamasız ürün: ${aciksiz.length}`, aciksiz.slice(0, 8).map((p) => `  · ${p.code || p.id} — ${p.name}`)]);
    if (ikiz.length)      sorun.push([`Ayırt edilemeyen varyant: ${ikiz.length} grup`, ikiz.slice(0, 8).map(([a, v]) => `  · ${a.split("||")[0]} — ${v.join(", ")}`)]);
    if (!sorun.length) return;
    notify(
      `Katalog: ${sorun.length} kusur (${hepsi.length} üründe)`,
      gorselsiz.length || fiyatsiz.length ? "medium" : "low",
      [
        `Ürün kataloğunda müşteriye eksik görünecek kayıtlar var:`,
        ``,
        ...sorun.flatMap(([b, satirlar]) => [b, ...satirlar, ``]),
        `Görselsiz ürün Google Merchant / Meta kataloğuna GİREMEZ (image_link zorunlu).`,
        `Ayırt edilemeyen varyant: adı VE alt başlığı aynı olan ürünler kartta`,
        `birbirinden ayrılamaz — ayırt edici niteliği ürün ADINA taşı.`,
      ].join(String.fromCharCode(10)),
      "katalog-sagligi"
    );
  } catch (e) {
    // ⚠️ Sessiz geçme — körlük tam da böyle oluşuyor.
    console.error("katalog kontrolü başarısız:", e.message);
    notify("İzleme: katalog kontrolü çalışmadı", "low",
      `Günlük robot /api/products okuyamadı: ${e.message}`, "katalog-unreachable");
  }
}
// ── SSL expiry ──
// ── soğuk sayfa ısıtıcı ──
// ⚠️ NEDEN VAR (2026-08-27 ölçümü): ISR süresi dolan sayfa ilk ziyaretçiye 2,6 sn'ye
//    kadar geç açılıyor (blog, MISS); ısınınca 0,3 sn (HIT). Google botu da çoğu
//    zaman "ilk ziyaretçi"dir → soğuk sayfa tarama verimini düşürür. Bu adım her
//    sabah ~30 önemli sayfaya TEK GET atar; gün boyu ilk ziyaretçiler ve botlar
//    sıcak kopya bulur. İstekler 400 ms arayla SIRALI gider (Vercel bot-mitigation
//    tetiklenmesin — bu betik daha önce hızlı curl döngüsüyle IP engeli yemişti).
//    Yalnız BAŞARISIZLIKTA bildirir; başarı sessizdir (bildirim spam'i olmasın).
async function isitici() {
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    const sm = await fetch(`${SITE}/sitemap.xml`, { cache: "no-store" });
    if (!sm.ok) throw new Error(`sitemap HTTP ${sm.status}`);
    const urls = [...(await sm.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const yol = (u) => u.replace(SITE, "") || "/";

    // Öncelik: giriş sayfaları + kategoriler (TR/EN) + rehber/şehir + ilk 5 blog.
    const sabit = ["/", "/products", "/en/products", "/uretici", "/destek", "/iletisim",
      "/blog", "/sozluk", "/arac-sarj-uyumlulugu", "/bursa-ev-sarj-istasyonu", "/bursa-sarj-kablosu"];
    const kategoriler = urls.filter((u) => /\/(en\/)?products\/[^/]+$/.test(yol(u)));
    const bloglar = urls.filter((u) => /^\/blog\/[^/]+$/.test(yol(u))).slice(0, 5);
    const hedefler = [...new Set([
      ...sabit.map((p) => SITE + p),
      ...kategoriler,
      ...bloglar,
    ])].slice(0, 32);

    let ok = 0, soguk = 0, hatali = 0, toplamMs = 0;
    for (const u of hedefler) {
      const t0 = Date.now();
      try {
        const r = await fetch(u, { redirect: "follow" });
        toplamMs += Date.now() - t0;
        if (r.ok) {
          ok++;
          const c = (r.headers.get("x-vercel-cache") || "").toUpperCase();
          if (c === "MISS" || c === "EXPIRED") soguk++;
        } else hatali++;
        // Gövdeyi tüket ki bağlantı temiz kapansın (ısıtma zaten tam yanıt ister).
        await r.arrayBuffer();
      } catch { hatali++; }
      await bekle(400);
    }
    console.log(`ısıtıcı: ${ok}/${hedefler.length} sayfa ısıtıldı · soğuk bulunan ${soguk} · hata ${hatali} · ort ${Math.round(toplamMs / Math.max(1, ok + hatali))} ms`);
    if (hatali >= 3) {
      notify("İzleme: ısıtıcı birden çok sayfada hata gördü", "medium",
        `${hedefler.length} sayfanın ${hatali} tanesi hata verdi (200 dönmedi ya da erişilemedi). Site genelinde bir sorun olabilir — site-sentinel raporuna da bakın.`,
        "daily-monitors/isitici");
    }
  } catch (e) {
    // Isıtıcının kendisi çalışamazsa da SESSİZ GEÇME (körlük dersi).
    notify("İzleme: soğuk sayfa ısıtıcı çalışmadı", "low",
      `Isıtma adımı hata verdi: ${String(e.message || e).slice(0, 140)}. Sayfalar yine çalışır, yalnız ilk ziyaretçiler soğuk kopyaya denk gelebilir.`,
      "daily-monitors/isitici");
  }
}

function checkSsl(host) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert?.valid_to) return resolve({ ok: false });
      const expires = new Date(cert.valid_to);
      const days = Math.round((expires.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      resolve({ ok: true, days, expires });
    });
    socket.on("error", () => resolve({ ok: false }));
    socket.setTimeout(8000, () => { socket.destroy(); resolve({ ok: false }); });
  });
}

async function checkSslExpiry() {
  const hosts = ["www.bemisevcharge.com.tr", "bemisevcharge.com.tr", "www.bemisevcharge.com", "bemisevcharge.com"];
  const results = [];
  for (const h of hosts) {
    const r = await checkSsl(h);
    results.push({ host: h, ...r });
    console.log(`ssl ${h.padEnd(28)} ${r.ok ? r.days + " gün" : "—"}`);
  }
  const expiring = results.filter((r) => r.ok && r.days < SSL_DAYS_THRESHOLD);
  if (expiring.length > 0) {
    notify(
      `SSL sertifikası uyarısı — ${expiring.length} domain <14 gün`,
      expiring.some((r) => r.days < 5) ? "critical" : "medium",
      [
        `Let's Encrypt 90 günlük — Vercel otomatik yeniliyor. Yenileme başarısız olursa erken uyarı:`,
        ``,
        ...expiring.map((r) => `  · ${r.host}: ${r.days} gün (${r.expires?.toISOString()?.slice(0, 10)})`),
        ``,
        `Vercel → Domains → her domain için "Refresh" tetikle. Hala yenilenmiyorsa DNS sorunu var.`,
      ].join("\n"),
      "ssl-expiry"
    );
  }
}

(async () => {
  console.log(`=== Daily monitors — ${new Date().toISOString()} ===\n`);
  await checkFormSpam();
  console.log("");
  await checkSslExpiry();
  console.log("");
  await checkKatalogSagligi();
  console.log("");
  await isitici();
})();
