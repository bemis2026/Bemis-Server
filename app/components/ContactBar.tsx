"use client";

import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";
import { RiLinkedinFill, RiInstagramLine } from "react-icons/ri";

export default function ContactBar() {
  const { contact, social } = useContent();
  const { theme } = useTheme();
  const d = theme === "dark";

  const bg         = d ? "#0c0c0e" : "#f0f0f0";
  const borderTop  = d ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)";
  const dividerBg  = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const textColor  = d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)";
  const iconColor  = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.30)";
  const socialColor= d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)";
  const copyColor  = d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.30)";
  const hoverColor = d ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)";

  return (
    <div style={{ background: bg, borderTop }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/logo-white.png"
              alt="Bemis E-V Charge"
              style={{
                height: 28,
                objectFit: "contain",
                opacity: d ? 0.85 : 0.9,
                filter: d ? "none" : "drop-shadow(0 0 1px rgba(0,0,0,0.20)) drop-shadow(0 1px 3px rgba(0,0,0,0.15))",
              }}
            />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 flex-shrink-0" style={{ background: dividerBg }} />

          {/* Contact details */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 flex-1">
            {contact.address && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: textColor }}>
                <HiLocationMarker className="flex-shrink-0" style={{ color: iconColor }} />
                {contact.address}
              </span>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: textColor }}
                onMouseEnter={e => (e.currentTarget.style.color = hoverColor)}
                onMouseLeave={e => (e.currentTarget.style.color = textColor)}
              >
                <HiPhone className="flex-shrink-0" style={{ color: iconColor }} />
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: textColor }}
                onMouseEnter={e => (e.currentTarget.style.color = hoverColor)}
                onMouseLeave={e => (e.currentTarget.style.color = textColor)}
              >
                <HiMail className="flex-shrink-0" style={{ color: iconColor }} />
                {contact.email}
              </a>
            )}
          </div>

          {/* Social + copyright */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ color: socialColor }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = hoverColor)}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = socialColor)}
              >
                <RiLinkedinFill size={16} />
              </a>
            )}
            {social?.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                style={{ color: socialColor }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = hoverColor)}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = socialColor)}
              >
                <RiInstagramLine size={16} />
              </a>
            )}
            <span className="text-[10px] pl-2" style={{ color: copyColor }}>
              © {new Date().getFullYear()} Bemis Teknik Elektrik A.Ş.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
