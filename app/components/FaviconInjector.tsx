"use client";

import { useEffect } from "react";
import { useContent } from "../context/ContentContext";

const FAVICON_LINK_ID = "bemis-favicon";

// /icon is the same-origin Next.js route that fetches faviconUrl from
// JSONBin and normalizes the image (white logos auto-inverted, transparent
// areas flattened onto white). Live preview after admin upload is handled
// by busting the cache with the faviconUrl as a version key.
function applyFavicon(href: string) {
  document
    .querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
    .forEach((el) => el.remove());

  document.getElementById(FAVICON_LINK_ID)?.remove();

  const link = document.createElement("link");
  link.id = FAVICON_LINK_ID;
  link.rel = "icon";
  link.type = "image/png";
  link.href = href;
  document.head.appendChild(link);
}

export default function FaviconInjector() {
  const { faviconUrl } = useContent();

  useEffect(() => {
    const v = faviconUrl ? encodeURIComponent(faviconUrl) : "default";
    applyFavicon(`/icon?v=${v}`);
  }, [faviconUrl]);

  return null;
}
