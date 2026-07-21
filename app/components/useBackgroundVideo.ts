"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Background ("passive screen") controller for the factory / about videos.
 * Two jobs:
 *
 *  1. NEVER show the YouTube player chrome. The black poster stays up until
 *     the player reports it is genuinely PLAYING (YouTube IFrame API), and
 *     is re-applied whenever the tab is backgrounded — so the splash / play
 *     button / related tiles never flash on first load, on tab switches, or
 *     when a window regains focus.
 *  2. Opt-in sound. The video autoplays muted (browser policy); a button
 *     toggles audio. Defaults to muted/closed.
 *
 * Works with a YouTube IFrame embed (the src MUST include `enablejsapi=1`)
 * and with a plain HTML5 <video>. Attach `ref` — a callback ref that takes
 * either element with no casts — to whichever renders. `covered` drives the
 * poster opacity; wire `onIframeLoad` to the iframe's onLoad and
 * `onVideoPlaying` to the <video>'s onPlaying.
 */
/**
 * ⚡ Ağır embed'leri (YouTube iframe ≈860KB player JS + ≈1.4MB video akışı) SAYFA
 * AÇILIŞINDA indirmemek için: verilen kutu viewport'a girene kadar bekler.
 * `near` bir kez true olur ve geri dönmez → embed o anda mount edilir;
 * autoplay + poster akışı birebir aynı çalışır (poster `covered=true` ile
 * video PLAYING olana dek örttüğü için görsel boşluk OLUŞMAZ).
 * IntersectionObserver yoksa hemen true → eski (eager) davranışa düşer.
 *
 * ⚠️⚠️ rootMargin NEDEN "0px" (eskiden "600px 0px" idi — MOBİLDE BOZUKTU):
 * Hero `min-h-screen` olduğu için video bölümü (DNA / kurumsal) ekranın TAM
 * dibinde başlıyor → mobilde (390×844) kutunun ekran altına uzaklığı **0px**.
 * 600px'lik önden-yükleme marjı bunu kapsadığından kapı SAYFA AÇILIR AÇILMAZ
 * tetikleniyordu = "lazy" koruma mobilde hiç devreye girmiyor, ilk yüklemede
 * ~2.2MB YouTube iniyordu (ölçüldü: sayfa ağırlığının %61'i, ana iş
 * parçacığının 5.7s'si). Ölçüm kanıtı ve karar: BEMIS_OTURUM_BAGLAM.md.
 * ⚠️ Bu değeri tekrar büyütme — mobilde lazy-load'u sessizce iptal eder.
 */
export function useNearViewport<T extends HTMLElement>(rootMargin = "0px") {
  const boxRef = useRef<T | null>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    const el = boxRef.current;
    // Kutu render edilmemiş / API yok → güvenli taraf: hemen mount et.
    if (!el || typeof IntersectionObserver === "undefined") { setNear(true); return; }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) setNear(true); },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, rootMargin]);
  return { boxRef, near };
}

export function useBackgroundVideo() {
  const elRef = useRef<HTMLIFrameElement | HTMLVideoElement | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [covered, setCovered] = useState(true);

  const postYT = useCallback((func: string, args: unknown = "") => {
    const el = elRef.current;
    if (el && el.tagName === "IFRAME") {
      (el as HTMLIFrameElement).contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*",
      );
    }
  }, []);

  const ref = useCallback((el: HTMLIFrameElement | HTMLVideoElement | null) => {
    elRef.current = el;
  }, []);

  const reveal = useCallback(() => {
    if (revealTimer.current) { clearTimeout(revealTimer.current); revealTimer.current = null; }
    setCovered(false);
  }, []);

  const armSafetyReveal = useCallback((ms: number) => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => setCovered(false), ms);
  }, []);

  const toggle = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      const el = elRef.current;
      if (el) {
        if (el.tagName === "IFRAME") postYT(next ? "unMute" : "mute");
        else (el as HTMLVideoElement).muted = !next;
      }
      return next;
    });
  }, [postYT]);

  // Receive YouTube IFrame API events and reveal the instant the player is
  // truly PLAYING — that is what keeps the YouTube splash from ever showing.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const el = elRef.current;
      if (!el || el.tagName !== "IFRAME") return;
      if (e.source !== (el as HTMLIFrameElement).contentWindow) return; // only our embed
      let data: { event?: string; info?: unknown } | null;
      try { data = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch { return; }
      if (!data) return;
      if (data.event === "onReady") {
        postYT("playVideo");
      } else if (data.event === "onStateChange" || data.event === "infoDelivery") {
        const info = data.info as number | { playerState?: number } | undefined;
        const state = typeof info === "object" && info !== null ? info.playerState : info;
        if (state === 1) reveal(); // 1 = PLAYING
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postYT, reveal]);

  // Re-cover on ANY visibility change, then (when visible again) nudge
  // playback and reveal only once it truly resumes — so the paused player's
  // play button never peeks through during the resume gap.
  useEffect(() => {
    const onVis = () => {
      setCovered(true); // cover first, no matter the direction
      if (document.visibilityState !== "visible") return;
      const el = elRef.current;
      if (el) {
        if (el.tagName === "IFRAME") postYT("playVideo"); // a PLAYING event will reveal
        else (el as HTMLVideoElement).play?.().catch(() => {});
      }
      armSafetyReveal(1500); // fallback if no PLAYING event arrives
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [postYT, armSafetyReveal]);

  // Clean up any pending safety timer on unmount.
  useEffect(() => () => { if (revealTimer.current) clearTimeout(revealTimer.current); }, []);

  // Start the IFrame API handshake once the iframe document has loaded.
  const onIframeLoad = useCallback(() => {
    const el = elRef.current;
    if (el && el.tagName === "IFRAME") {
      (el as HTMLIFrameElement).contentWindow?.postMessage(JSON.stringify({ event: "listening" }), "*");
      armSafetyReveal(2000); // reveal anyway if the API stays silent
    }
  }, [armSafetyReveal]);

  const onVideoPlaying = useCallback(() => reveal(), [reveal]);

  return { ref, soundOn, toggle, covered, onIframeLoad, onVideoPlaying };
}
