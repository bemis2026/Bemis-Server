/**
 * CANLI SAYFADA KALAN TÜRKÇE TARAYICI — Browser panelinde javascript_tool ile çalıştır.
 * Çeviri boşluğunu KODDAN değil, TAM YÜKLENMİŞ CANLI SAYFADAN ölçer (statik analiz şişiriyor:
 * varsayılan/yedek değerler ve pickText'in Türkçe argümanı "çevrilmemiş" sanılıyor).
 *
 * ⚠️ GÖRÜNÜRLÜK: `el.offsetParent !== null` KULLANMA — SVG elemanlarında `offsetParent`
 *    `undefined`'dır, bu yüzden KAPALI SEKMEDEKİ SVG metinleri "görünür" sayılır ve
 *    yanlış alarm üretir (2026-09-12'de 3 madde böyle yanlış raporlandı).
 *    Doğrusu: `checkVisibility()` + `getBoundingClientRect()` boyut kontrolü.
 * ⚠️ Zamanlayıcı/animasyon ölçeceksen sekmeyi ÖNE AL (gizli sekmede setInterval kısılır).
 *
 * Kullanım: sayfayı hedef dilde aç, bu betiği yapıştır. Dönen listede yalnız GERÇEKTEN
 * görünen Türkçe metinler olur.
 */
(async () => {
  // tembel bölümler mount olsun
  for (let y = 0; y < document.body.scrollHeight; y += 800) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise((r) => setTimeout(r, 1500));

  const TR = /[ğışİŞĞ]|(?:^|\s)(?:ve|için|ile|Şarj|Ürün|Bayi|Türkiye|Distribütör|Ülke|Müsait|Aktif|Galeri|Pazartesi)(?:\s|$)/;
  const gorunur = (el) => {
    if (!el) return false;
    if (typeof el.checkVisibility === "function" && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    if (el.closest('[hidden],[aria-hidden="true"]')) return false;
    return true;
  };

  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim();
    if (t.length < 3 || !TR.test(t)) continue;
    const e = n.parentElement;
    if (!gorunur(e)) continue;
    const sec = e.closest("section[id],footer,header,nav");
    out.push({ t: t.slice(0, 70), b: sec ? sec.id || sec.tagName : "?" });
  }
  const u = [...new Map(out.map((o) => [o.t, o])).values()];
  return JSON.stringify({ dil: document.documentElement.lang, adet: u.length, liste: u }, null, 1);
})()
