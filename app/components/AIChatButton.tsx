"use client";

import { motion } from "framer-motion";
import { RiWhatsappFill } from "react-icons/ri";
import { useContent } from "../context/ContentContext";

export default function AIChatButton() {
  const { contact } = useContent();

  // Prefer whatsappPhone if explicitly set; otherwise reuse contact.phone.
  const rawNumber = (contact.whatsappPhone?.trim() || contact.phone || "").trim();
  const digits = rawNumber.replace(/\D/g, "");
  if (!digits) return null;

  const message = (contact.whatsappMessage ?? "").trim()
    || "Merhaba, Bemis E-V Charge ürünleri hakkında bilgi almak istiyorum.";

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
      style={{
        background: "#25D366",
        border: "1px solid rgba(255,255,255,0.20)",
        color: "#ffffff",
        boxShadow: "0 6px 24px rgba(37,211,102,0.35)",
      }}
      aria-label="WhatsApp ile iletişime geç"
      title={`WhatsApp · ${rawNumber}`}
    >
      <RiWhatsappFill size={26} />
    </motion.a>
  );
}
