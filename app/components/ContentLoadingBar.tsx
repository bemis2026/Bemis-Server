"use client";

import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";

export default function ContentLoadingBar() {
  const { contentLoading } = useContent();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (contentLoading) {
      setVisible(true);
      setWidth(0);
      const t1 = setTimeout(() => setWidth(70), 50);
      return () => clearTimeout(t1);
    } else {
      setWidth(100);
      const t2 = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t2);
    }
  }, [contentLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] pointer-events-none">
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
          transition: contentLoading
            ? "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "width 0.25s ease-out, opacity 0.3s ease 0.1s",
          opacity: width === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
