"use client";

import { useContent } from "../context/ContentContext";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";
import { RiLinkedinFill, RiInstagramLine } from "react-icons/ri";

export default function ContactBar() {
  const { contact, social } = useContent();

  return (
    <div style={{ background: "#0c0c0e", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/logo-white.png" alt="Bemis E-V Charge"
              style={{ height: 28, objectFit: "contain", opacity: 0.85 }} />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-white/10 flex-shrink-0" />

          {/* Contact details */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 flex-1">
            {contact.address && (
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <HiLocationMarker className="flex-shrink-0 text-white/25" />
                {contact.address}
              </span>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/65 transition-colors">
                <HiPhone className="flex-shrink-0 text-white/25" />
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/65 transition-colors">
                <HiMail className="flex-shrink-0 text-white/25" />
                {contact.email}
              </a>
            )}
          </div>

          {/* Social + copyright */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/60 transition-colors">
                <RiLinkedinFill size={16} />
              </a>
            )}
            {social?.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/60 transition-colors">
                <RiInstagramLine size={16} />
              </a>
            )}
            <span className="text-[10px] text-white/20 pl-2">
              © {new Date().getFullYear()} Bemis Teknik Elektrik A.Ş.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
