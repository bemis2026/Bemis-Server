"use client";

import dynamic from "next/dynamic";
import { useEditMode } from "../context/EditModeContext";

const PropertiesPanel = dynamic(() => import("./PropertiesPanel"), { ssr: false });

export default function PropertiesPanelLoader() {
  const { isEditMode } = useEditMode();
  if (!isEditMode) return null;
  return <PropertiesPanel />;
}
