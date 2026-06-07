// Tek seferlik: "Kullanıcı Yorumları" bölümü artık blog ile birleşti.
// Başlık/etiket/alt-başlığı birleşik bölüme uygun hale getirir (Blob + yerel).
// Çalıştırma: BLOB_READ_WRITE_TOKEN='...' node scripts/fix-reviews-heading.cjs

const { get, put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

const NEW = {
  sectionLabel: "Görüşler & İçerik",
  heading: "Görüşler ve Rehberler",
  subheading: "Gerçek kullanıcı yorumları ve EV şarj rehberlerimiz bir arada.",
};

const LOCAL = path.join(__dirname, "..", "data", "content.json");

async function s2s(st) {
  if (st && typeof st[Symbol.asyncIterator] === "function") {
    let s = ""; for await (const c of st) s += Buffer.from(c).toString("utf8"); return s;
  }
  const r = st.getReader(); const d = new TextDecoder(); let s = "";
  for (;;) { const { done, value } = await r.read(); if (done) break; s += d.decode(value, { stream: true }); }
  return s + d.decode();
}

function applyTo(obj) {
  // reviews bloğu ya kökte ya .record altında olabilir; ikisini de dene.
  const target = obj && obj.reviews ? obj : (obj && obj.record && obj.record.reviews ? obj.record : null);
  if (!target || !target.reviews) return false;
  target.reviews.sectionLabel = NEW.sectionLabel;
  target.reviews.heading = NEW.heading;
  target.reviews.subheading = NEW.subheading;
  return true;
}

(async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("BLOB_READ_WRITE_TOKEN yok"); process.exit(1); }

  // 1) Blob
  const res = await get("bins/content.json", { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) throw new Error("Blob read fail " + (res && res.statusCode));
  const data = JSON.parse(await s2s(res.stream));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(__dirname, `_backup-content-${stamp}.json`), JSON.stringify(data));
  if (!applyTo(data)) throw new Error("Blob içinde reviews bulunamadı");
  await put("bins/content.json", JSON.stringify(data), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  console.log("✓ Blob güncellendi");

  // 2) Yerel fallback
  try {
    const local = JSON.parse(fs.readFileSync(LOCAL, "utf8"));
    if (applyTo(local)) {
      fs.writeFileSync(LOCAL, JSON.stringify(local, null, 2) + "\n", "utf8");
      console.log("✓ data/content.json güncellendi");
    } else { console.log("! yerel data/content.json içinde reviews bulunamadı (atlandı)"); }
  } catch (e) { console.log("! yerel güncellenemedi:", e.message); }

  // 3) Doğrula
  const res2 = await get("bins/content.json", { access: "private" });
  const after = JSON.parse(await s2s(res2.stream));
  const t = after.reviews || (after.record && after.record.reviews);
  console.log("Canlı başlık şimdi:", JSON.stringify(t && { sectionLabel: t.sectionLabel, heading: t.heading, subheading: t.subheading }));
})().catch((e) => { console.error("ERR", e && e.message || e); process.exit(1); });
