"use client";

import { useEffect } from "react";
import { useContent } from "../context/ContentContext";

export default function FaviconInjector() {
  const { faviconUrl } = useContent();

  useEffect(() => {
    if (!faviconUrl) return;
    // Remove any existing icon links so the new one takes effect
    document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
      .forEach(el => el.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = faviconUrl.endsWith(".ico") ? "image/x-icon" : "image/png";
    link.href = faviconUrl + "?v=" + Date.now(); // bust browser cache
    document.head.appendChild(link);
  }, [faviconUrl]);

  return null;
}
