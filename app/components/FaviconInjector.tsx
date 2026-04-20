"use client";

import { useEffect, useRef } from "react";
import { useContent } from "../context/ContentContext";

export default function FaviconInjector() {
  const { faviconUrl } = useContent();
  const urlRef = useRef<string>("");
  const observingRef = useRef(false);

  useEffect(() => {
    if (!faviconUrl) return;
    urlRef.current = faviconUrl;

    function applyFavicon() {
      const url = urlRef.current;
      if (!url) return;
      document
        .querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
        .forEach(el => el.remove());
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = url.endsWith(".ico") ? "image/x-icon" : "image/png";
      link.href = url + "?v=" + Date.now();
      document.head.appendChild(link);
    }

    applyFavicon();

    if (observingRef.current) return;
    observingRef.current = true;

    const observer = new MutationObserver((mutations) => {
      const url = urlRef.current;
      if (!url) return;
      const base = url.split("?")[0];
      let shouldReapply = false;
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLLinkElement) {
            const rel = node.rel?.toLowerCase() ?? "";
            if (rel === "icon" || rel === "shortcut icon" || rel === "apple-touch-icon") {
              if (!node.href.startsWith(base)) {
                node.remove();
                shouldReapply = true;
              }
            }
          }
        }
      }
      if (shouldReapply) applyFavicon();
    });

    observer.observe(document.head, { childList: true });
    return () => {
      observer.disconnect();
      observingRef.current = false;
    };
  }, [faviconUrl]);

  return null;
}
