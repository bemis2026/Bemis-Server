"use client";
import React from "react";
import { useEditMode, ElementDescriptor } from "../context/EditModeContext";

interface EImageProps {
  field: string;
  src: string;
  alt?: string;
  label?: string;
  uploadFolder?: string;
  className?: string;
  style?: React.CSSProperties;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  children?: React.ReactNode; // placeholder when no src
}

export default function EImage({
  field, src, alt = "", label, uploadFolder,
  className, style, imgClassName, imgStyle, children,
}: EImageProps) {
  const { isEditMode, selectElement } = useEditMode();

  const descriptor: ElementDescriptor = {
    field,
    type: "image",
    label: label ?? "Görsel",
    uploadFolder: uploadFolder ?? "uploads",
  };

  if (!isEditMode) {
    if (!src) return <>{children}</>;
    return <img src={src} alt={alt} className={imgClassName} style={imgStyle} />;
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        cursor: "pointer",
        ...style,
      }}
      onClick={e => { e.stopPropagation(); selectElement(descriptor); }}
      title={`Düzenle: ${field}`}
    >
      {src ? (
        <img src={src} alt={alt} className={imgClassName} style={{ ...imgStyle, pointerEvents: "none" }} />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 6, pointerEvents: "none",
        }}>
          {children}
        </div>
      )}
      {/* Edit overlay */}
      <div style={{
        position: "absolute", inset: 0,
        border: "2px dashed rgba(59,130,246,0.6)",
        borderRadius: "inherit",
        transition: "border-color 0.15s",
        pointerEvents: "none",
      }} />
      {/* Camera badge */}
      <div style={{
        position: "absolute", top: 6, right: 6,
        background: "rgba(59,130,246,0.85)",
        borderRadius: 6, padding: "3px 7px",
        fontSize: 11, color: "#fff", fontWeight: 600,
        pointerEvents: "none",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        📷 Değiştir
      </div>
    </div>
  );
}
