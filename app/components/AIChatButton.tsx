"use client";

import { motion } from "framer-motion";
import { HiPhone } from "react-icons/hi";
import { useContent } from "../context/ContentContext";

export default function AIChatButton() {
  const { contact } = useContent();

  // Strip non-numeric chars for tel: href, keep + prefix
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <motion.a
      href={telHref}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "rgba(255,255,255,0.75)",
      }}
      aria-label="Bizi Arayın"
      title={contact.phone}
    >
      <HiPhone size={22} />
    </motion.a>
  );
}
