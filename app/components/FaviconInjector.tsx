"use client";

import { useEffect } from "react";
import { useContent } from "../context/ContentContext";

const FAVICON_LINK_ID = "bemis-favicon";

function applyFavicon(href: string) {
  // Remove all existing favicon links
  document
    .querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
    .forEach((el) => el.remove());

  // Remove our previously injected link if any
  document.getElementById(FAVICON_LINK_ID)?.remove();

  const link = document.createElement("link");
  link.id = FAVICON_LINK_ID;
  link.rel = "icon";
  link.type = href.endsWith(".ico") ? "image/x-icon" : "image/png";
  link.href = href + "?v=" + Date.now(); // bust browser cache
  document.head.appendChild(link);
}

export default function FaviconInjector() {
  const { faviconUrl } = useContent();
  const resolved = faviconUrl || "/logo.png";

  useEffect(() => {
    applyFavicon(resolved);
  }, [resolved]);

  return null;
}
