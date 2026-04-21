"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useContent } from "../context/ContentContext";

export default function FaviconInjector() {
  const { faviconUrl } = useContent();
  const pathname = usePathname();

  useEffect(() => {
    if (!faviconUrl) return;
    // Remove existing favicon links injected by Next.js metadata system
    document
      .querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
      .forEach(el => el.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = faviconUrl.endsWith(".ico") ? "image/x-icon" : "image/png";
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [faviconUrl, pathname]); // re-apply on every route change

  return null;
}
