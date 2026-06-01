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

  // Re-cover when the tab is backgrounded; nudge playback + reveal on return.
  useEffect(() => {
    const onVis = () => {
      const el = elRef.current;
      if (document.visibilityState === "hidden") {
        setCovered(true);
        return;
      }
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
