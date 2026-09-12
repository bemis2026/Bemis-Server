/**
 * ÖLÇÜM TAKVİMİ — vadesi gelen kontrol noktalarını listeler.
 *   npm run olcum
 *
 * ⚠️ NEDEN: referans SEO çalışmasındaki en pratik disiplinlerden biri "her işe
 * ölçüm tarihi yaz". Tarihsiz iş ölçülmeyen iştir: bir ay sonra kimse "16 başlığı
 * yeniden yazdık, TO ne oldu?" diye sormuyor. Liste bir JSON'da durursa kimse
 * açmaz; bu betik vadesi geleni ÖNE ÇIKARIR ve oturum başında görünür.
 *
 * 📌 Yeni bir iş bitince `data/olcum-takvimi.json`a kontrol noktası EKLE.
 * 📌 Ölçüm yapıldıysa `durum`u "kapandı" yap ve `sonuc` yaz — SİLME (tarihçe).
 */
import fs from "node:fs";

type Kontrol = {
  tarih: string;
  is: string;
  olcum: string;
  hedef: string;
  nasil: string;
  durum: string;
  sonuc?: string;
};

const j = JSON.parse(fs.readFileSync("data/olcum-takvimi.json", "utf8")) as { kontroller: Kontrol[] };
const bugun = new Date().toISOString().slice(0, 10);
const gun = (t: string) => Math.round((new Date(t).getTime() - new Date(bugun).getTime()) / 86400000);

const acik = j.kontroller.filter((k) => k.durum !== "kapandı");
const vadesi = acik.filter((k) => k.tarih <= bugun).sort((a, b) => a.tarih.localeCompare(b.tarih));
const yaklasan = acik.filter((k) => k.tarih > bugun).sort((a, b) => a.tarih.localeCompare(b.tarih));
const kapali = j.kontroller.filter((k) => k.durum === "kapandı");

console.log(`ÖLÇÜM TAKVİMİ — bugün ${bugun}\n`);

if (vadesi.length) {
  console.log(`🔔 VADESİ GELDİ (${vadesi.length})`);
  for (const k of vadesi) {
    console.log(`\n  ▸ ${k.tarih} (${-gun(k.tarih)} gün geçti) — ${k.is}`);
    console.log(`     ölç   : ${k.olcum}`);
    console.log(`     hedef : ${k.hedef}`);
    console.log(`     nasıl : ${k.nasil}`);
  }
  console.log("");
} else {
  console.log("✓ vadesi gelen kontrol yok\n");
}

if (yaklasan.length) {
  console.log(`📅 YAKLAŞAN (${yaklasan.length})`);
  for (const k of yaklasan) console.log(`  ${k.tarih}  (+${gun(k.tarih)} gün)  ${k.is}`);
}
if (kapali.length) {
  console.log(`\n✅ KAPANAN (${kapali.length})`);
  for (const k of kapali) console.log(`  ${k.tarih}  ${k.is}${k.sonuc ? ` → ${k.sonuc}` : ""}`);
}
