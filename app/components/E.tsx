"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useEditMode } from "../context/EditModeContext";
import { useContent } from "../context/ContentContext";

interface EditableProps {
  field: string;
  children: string;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function E({ field, children, tag, className, style, ...rest }: EditableProps) {
  const { isEditMode, markPending } = useEditMode();
  const { liveUpdate } = useContent();
  const [editing, setEditing] = useState(false);
  const ref = useRef<any>(null);
  // Track original text for Escape key restoration
  const originalText = useRef<string>(children);

  const Tag = (tag ?? "span") as any;

  // Keep ref text in sync when NOT editing (e.g. external content change)
  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== children) {
      ref.current.textContent = children;
    }
    originalText.current = children;
  }, [children, editing]);

  const handleClick = useCallback(() => {
    if (!isEditMode) return;
    setEditing(true);
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
        // Place cursor at end
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  }, [isEditMode]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const newText = ref.current?.textContent ?? "";
    if (newText !== originalText.current) {
      liveUpdate(field, newText);
      markPending(field);
      originalText.current = newText;
    }
  }, [field, liveUpdate, markPending]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    } else if (e.key === "Escape") {
      if (ref.current) {
        ref.current.textContent = originalText.current;
      }
      ref.current?.blur();
    }
  }, []);

  if (!isEditMode) {
    return (
      <Tag className={className} style={style} {...rest}>
        {children}
      </Tag>
    );
  }

  const editStyle: React.CSSProperties = {
    ...style,
    outline: editing
      ? "2px solid #3B82F6"
      : "1px dashed rgba(59,130,246,0.5)",
    outlineOffset: "2px",
    borderRadius: "2px",
    cursor: editing ? "text" : "pointer",
    whiteSpace: "pre-wrap",
    minWidth: "1em",
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={editStyle}
      contentEditable={editing}
      suppressContentEditableWarning
      title={`Düzenle: ${field}`}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </Tag>
  );
}
