"use client";

import { useEffect, useRef, useState } from "react";

// Native overflow-x scroll + slow auto-scroll loop + drag-to-scroll (mouse) +
// native touch + smooth scroll button helper.
//
// Auto-scroll hover'da DURMAZ — sadece drag ve touch sırasında duraklar.
// Bant hep kayar; kullanıcı drag bıraktığında veya parmağı kaldırdığında
// kayışa devam eder. Button click anlık scrollBy yapar, auto-scroll
// arka planda devam eder.
//
// Container'ı 2× duplicate items'la doldur. Auto-scroll scrollWidth/2'ye
// ulaşınca scrollLeft'i 0'a alır → görsel olarak kesintisiz akış.
//
// Returns:
//   scrollRef       — outer .overflow-x-auto div'e bağlanır
//   handlers        — outer div'in onMouse*/onTouch* prop'ları
//   scrollByAmount  — sol/sağ button'lar için programmatic smooth scroll
// ⚠️ 2026-08-07: anasayfada İKİ marquee ART ARDA duruyor ("En Çok Tercih
// Edilenler" + "Sahada Bemis E-V Charge"). İkisi de aynı yönde, aynı hızda
// akınca ekranın yarısı tek parça hâlinde kayıyor gibi görünüyor ve baş
// döndürüyor. Çözüm: `direction` ile ters yön + hafifçe FARKLI hız
// (eşit hız ters yönde de "ayna" etkisi yaratır, o da göze batar).
export function useMarqueeScroll(opts?: { speed?: number; direction?: 1 | -1 }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const touchedRef = useRef(false);
  // Button click başlattığında smooth scroll bitene kadar RAF'i durdur —
  // aksi halde her frame'deki +speed smooth scroll'un hedefini ezer.
  const buttonPauseUntil = useRef(0);
  // px / frame. 0.5 ≈ 30 px/sn idi; iki bant birlikte akınca hızlı geliyordu
  // → sakinleştirildi (0.30 ≈ 18 px/sn).
  const speed = opts?.speed ?? 0.30;
  const dir = opts?.direction ?? 1;

  // ⚠️ Marquee YALNIZ masaüstünde (fine pointer). Dokunmatik cihazlarda
  // (pointer: coarse = telefon/tablet) otomatik kaydırma parmak-kaydırmasıyla
  // çakışıyordu: parmak bırakılınca RAF devreye girip scrollLeft'i yarıda
  // sıfırlıyor = "kaydırınca başa dönüyor". Mobilde marquee kapalı → saf native
  // scroll. isMarquee ayrıca bileşende 2× kopya yerine 1× göstermek için kullanılır
  // (SSR = false → mobil ilk render'la uyumlu, hydration mismatch yok).
  const [isMarquee, setIsMarquee] = useState(false);

  // ⚠️ Önbelleğe alınan ölçüler. scrollWidth/clientWidth'i HER KAREDE okumak —
  // hele scrollLeft yazımından SONRA — zorunlu senkron reflow tetikler (PSI
  // "Forced reflow" bulgusu + scroll takılması). Bu değerler yalnız resize /
  // içerik yüklenince değişir → ResizeObserver ile ölçülüp önbelleğe alınır.
  const metrics = useRef({ half: 0, overflow: false });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (reduceMotion || coarse) return; // isMarquee false kalır → mobil/erişilebilirlik: manuel scroll
    setIsMarquee(true);

    // Ölçümü tek yerde yap; içerik (ürün görselleri) async yüklendikçe scrollWidth
    // büyür → ResizeObserver yeniden ölçer. Kare döngüsü artık layout OKUMAZ.
    const measure = () => {
      metrics.current.half = el.scrollWidth / 2;
      metrics.current.overflow = el.scrollWidth > el.clientWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild); // iç şerit de büyüyünce

    let rafId = 0;
    let running = false;
    const tick = () => {
      const buttonActive = performance.now() < buttonPauseUntil.current;
      if (!dragRef.current.active && !touchedRef.current && !buttonActive && metrics.current.overflow) {
        // scrollLeft'i başta bir kez oku (layout temizken = zorlamasız), önbellekli
        // yarı-genişlikle sar, sonra yaz. Kare içinde scrollWidth OKUNMAZ.
        // 2× kopya sayesinde `half` noktası başlangıçla AYNI görüntüyü verir →
        // her iki yönde de sarma görsel olarak kesintisizdir.
        const half = metrics.current.half;
        let next = el.scrollLeft + speed * dir;
        if (next >= half) next -= half;
        else if (next < 0) next += half;
        el.scrollLeft = next;
      }
      rafId = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; rafId = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(rafId); };

    // ⚠️ Yalnız şerit EKRANDA iken çalış — iki marquee aksi halde sayfa çok
    // aşağıdayken bile sürekli RAF + scroll yazımı yapıp ana-işi meşgul ediyordu.
    // 200px rootMargin: kullanıcı yaklaşınca zaten akıyor, "durmuş" görünmez.
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => { if (entries.some((e) => e.isIntersecting)) start(); else stop(); },
        { rootMargin: "200px 0px" },
      );
      io.observe(el);
    } else {
      start(); // gözlemci yoksa güvenli taraf: her zaman çalış (eski davranış)
    }

    return () => { stop(); io?.disconnect(); ro.disconnect(); };
  }, [speed, dir]);

  const handlers = {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      dragRef.current = {
        active: true,
        startX: e.pageX - el.offsetLeft,
        startScroll: el.scrollLeft,
      };
    },
    onMouseUp: () => {
      dragRef.current.active = false;
    },
    onMouseLeave: () => {
      // Mouse container dışına çıkarsa drag'i iptal et — auto-scroll'a
      // dokunmaz çünkü hover-based pause yok.
      dragRef.current.active = false;
    },
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      const el = scrollRef.current;
      if (!el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = dragRef.current.startScroll - (x - dragRef.current.startX);
    },
    onTouchStart: () => {
      touchedRef.current = true;
    },
    onTouchEnd: () => {
      touchedRef.current = false;
    },
  };

  const scrollByAmount = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    // Smooth scroll'a ~700ms süre tanı; bu pencerede RAF dokunmaz.
    // Klikten önce loop reset koşulunu kontrol et — eğer scrollLeft
    // çok yüksekse (yarısına yakın) sıfırla ki sağ scroll loop'a yakın
    // zıplama yapmasın.
    buttonPauseUntil.current = performance.now() + 700;
    // ⚠️ SONSUZ KAYDIRMA (kullanıcı isteği): şerit uçlarda DURMAZ, başa
    // dönerek devam eder. 2× kopya olduğu için `half` konumu başlangıçla
    // aynı görüntüyü verir → hedef aralık dışına taşacaksa ÖNCE anlık olarak
    // eşdeğer konuma sarılır, sonra yumuşak kaydırma yapılır. Sıçrama
    // görünmez çünkü sarma noktasındaki içerik birebir aynıdır.
    // ⓘ `half` yalnız marquee açıkken (masaüstü) doludur; mobilde 0 kalır →
    //   koşul çalışmaz, öğeler 1× kopya olduğu için sarma zaten yanlış olurdu.
    const half = metrics.current.half;
    if (half > 0) {
      const hedef = el.scrollLeft + delta;
      if (hedef > half) el.scrollLeft -= half;
      else if (hedef < 0) el.scrollLeft += half;
    }
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return { scrollRef, handlers, scrollByAmount, isMarquee };
}
