"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Sound control for a "passive screen" video that autoplays muted.
 *
 * The factory / about videos start muted (mute=1) because browsers only
 * allow muted autoplay. This hook adds an opt-in sound toggle:
 *
 *  - YouTube IFrame embed → drives mute/unMute through the IFrame Player
 *    API via postMessage. The iframe MUST include `enablejsapi=1` in its
 *    src for the command to reach the player.
 *  - Plain HTML5 <video>  → flips the element's `.muted` property.
 *
 * Attach `ref` (a callback ref, so it accepts either an <iframe> or a
 * <video> with no casts) to whichever element renders. `soundOn` drives
 * the button icon; `toggle` flips the state. Defaults to muted/closed.
 */
export function useVideoSound() {
  const elRef = useRef<HTMLIFrameElement | HTMLVideoElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  const ref = useCallback((el: HTMLIFrameElement | HTMLVideoElement | null) => {
    elRef.current = el;
  }, []);

  const toggle = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      const el = elRef.current;
      if (el) {
        if (el.tagName === "IFRAME") {
          (el as HTMLIFrameElement).contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: next ? "unMute" : "mute", args: "" }),
            "*",
          );
        } else {
          (el as HTMLVideoElement).muted = !next;
        }
      }
      return next;
    });
  }, []);

  return { ref, soundOn, toggle };
}
