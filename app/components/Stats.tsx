"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";

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
  const { stats } = useContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const BLUE = "#3B82F6";

  return (
    <section
      id="stats"
      className="relative"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 40%, #0f0f12 100%)" }}
    >
      <div className="section-divider" />
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ background: `${BLUE}20` }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              className="transition-all duration-300 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center text-center"
              style={{ background: "linear-gradient(145deg, #111114 0%, #0d0d10 100%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(145deg, #141418 0%, #101014 100%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(145deg, #111114 0%, #0d0d10 100%)"; }}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1.5 tabular-nums" style={{ color: "#93C5FD" }}>
                <CountUp value={stat.value} suffix={stat.suffix} prefix={stat.prefix} active={inView} />
              </div>
              <div className="text-white font-semibold text-sm sm:text-base mb-0.5">{stat.label}</div>
              <div className="text-white/40 text-xs sm:text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
