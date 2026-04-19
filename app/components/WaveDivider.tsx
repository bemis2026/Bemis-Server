"use client";
import { useTheme } from "../context/ThemeContext";

export default function WaveDivider({ flip = false }: { flip?: boolean }) {
  const { theme } = useTheme();
  const d = theme === "dark";

  const fill = d ? "#0e0e12" : "#f0f1f6";

  return (
    <div
      className="relative pointer-events-none"
      style={{
        height: 52,
        marginTop: -26,
        marginBottom: -26,
        zIndex: 20,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <svg
        viewBox="0 0 1440 52"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
        aria-hidden="true"
      >
        <path
          d="M0,16 C240,48 480,4 720,24 C960,44 1200,8 1440,28 L1440,52 L0,52 Z"
          fill={fill}
          fillOpacity="0.55"
        />
        <path
          d="M0,28 C320,4 640,44 960,20 C1120,10 1280,36 1440,18 L1440,52 L0,52 Z"
          fill={fill}
          fillOpacity="0.35"
        />
      </svg>
    </div>
  );
}
