"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import E from "./E";

function CountUp({ value, suffix, prefix, active }: { value: number; suffix: string; prefix?: string; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const duration = 1800;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, step);
    return () => clearInterval(timer);
  }, [active, value]);

  return <span>{prefix ?? ""}{count}{suffix}</span>;
}

export default function Stats() {
  const { stats, sectionBgs } = useContent();
  const { theme } = useTheme();
  const d = theme === "dark";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const BLUE = "#3B82F6";
  const sectionBgUrl = sectionBgs?.["stats"] ?? "";

  const cardBgDefault  = d ? "linear-gradient(145deg, #111114 0%, #0d0d10 100%)" : "#ffffff";
  const cardBgHover    = d ? "linear-gradient(145deg, #141418 0%, #101014 100%)" : "#f8f8fb";
  const statNumColor   = d ? "#93C5FD" : "#1D4ED8";
  const labelColor     = d ? "#ffffff" : "#111111";
  const descColor      = d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)";

  return (
    <section
      id="stats"
      className="relative"
      style={{ background: d ? "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 40%, #0f0f12 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)" }}
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div className="section-divider" />
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ background: d ? `${BLUE}20` : `${BLUE}15` }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              className="transition-all duration-300 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center text-center"
              style={{ background: cardBgDefault }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = cardBgHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = cardBgDefault; }}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1.5 tabular-nums" style={{ color: statNumColor }}>
                <CountUp value={stat.value} suffix={stat.suffix} prefix={stat.prefix} active={inView} />
              </div>
              <div className="font-semibold text-sm sm:text-base mb-0.5" style={{ color: labelColor }}>
                <E field={`stats.${i}.label`} tag="span">{stat.label}</E>
              </div>
              <div className="text-xs sm:text-sm" style={{ color: descColor }}>
                <E field={`stats.${i}.description`} tag="span">{stat.description}</E>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
