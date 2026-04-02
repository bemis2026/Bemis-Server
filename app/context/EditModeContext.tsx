"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

type EditModeContextType = {
  isEditMode: boolean;
  pendingCount: number;
  markPending: (field: string) => void;
  clearPending: () => void;
  enter: () => void;
  exit: () => void;
};

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false, pendingCount: 0,
  markPending: () => {}, clearPending: () => {},
  enter: () => {}, exit: () => {},
});

export function useEditMode() { return useContext(EditModeContext); }

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pending, setPending] = useState<Set<string>>(new Set());

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
  }, []);

  const markPending = useCallback((field: string) => {
    setPending(prev => new Set([...prev, field]));
  }, []);

  const clearPending = useCallback(() => setPending(new Set()), []);

  return (
    <EditModeContext.Provider value={{ isEditMode, pendingCount: pending.size, markPending, clearPending, enter, exit }}>
      {children}
    </EditModeContext.Provider>
  );
}
