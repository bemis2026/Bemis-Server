"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type ElementDescriptor = {
  field: string;
  type: "text" | "image" | "color" | "link" | "number";
  label: string;
  multiline?: boolean;
  uploadFolder?: string;
  presetColors?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
};

type EditModeContextType = {
  isEditMode: boolean;
  pendingCount: number;
  markPending: (field: string) => void;
  clearPending: () => void;
  enter: () => void;
  exit: () => void;
  selectedElement: ElementDescriptor | null;
  selectElement: (el: ElementDescriptor | null) => void;
  clearSelection: () => void;
};

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false, pendingCount: 0,
  markPending: () => {}, clearPending: () => {},
  enter: () => {}, exit: () => {},
  selectedElement: null,
  selectElement: () => {},
  clearSelection: () => {},
});

export function useEditMode() { return useContext(EditModeContext); }

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [selectedElement, setSelectedElement] = useState<ElementDescriptor | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("bemis-edit-mode") === "1") {
      setIsEditMode(true);
    }
  }, []);

  const enter = useCallback(() => {
    localStorage.setItem("bemis-edit-mode", "1");
    setIsEditMode(true);
  }, []);

  const exit = useCallback(() => {
    localStorage.removeItem("bemis-edit-mode");
    setIsEditMode(false);
    setPending(new Set());
    setSelectedElement(null);
  }, []);

  const markPending = useCallback((field: string) => {
    setPending(prev => new Set([...prev, field]));
  }, []);

  const clearPending = useCallback(() => setPending(new Set()), []);

  const selectElement = useCallback((el: ElementDescriptor | null) => {
    setSelectedElement(el);
  }, []);

  const clearSelection = useCallback(() => setSelectedElement(null), []);

  return (
    <EditModeContext.Provider value={{
      isEditMode, pendingCount: pending.size,
      markPending, clearPending,
      enter, exit,
      selectedElement, selectElement, clearSelection,
    }}>
      {children}
    </EditModeContext.Provider>
  );
}
