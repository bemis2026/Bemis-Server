"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

export type DealerApplyMode = "tr" | "intl";

type DealerApplyOverlayContextType = {
  open: boolean;
  mode: DealerApplyMode;
  openDealerApply: (mode?: DealerApplyMode) => void;
  closeDealerApply: () => void;
};

const DealerApplyOverlayContext = createContext<DealerApplyOverlayContextType>({
  open: false,
  mode: "tr",
  openDealerApply: () => {},
  closeDealerApply: () => {},
});

export function useDealerApplyOverlay() { return useContext(DealerApplyOverlayContext); }

export function DealerApplyOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DealerApplyMode>("tr");
  const openDealerApply = useCallback((m: DealerApplyMode = "tr") => {
    setMode(m);
    setOpen(true);
  }, []);
  const closeDealerApply = useCallback(() => setOpen(false), []);
  const value = useMemo(
    () => ({ open, mode, openDealerApply, closeDealerApply }),
    [open, mode, openDealerApply, closeDealerApply]
  );
  return (
    <DealerApplyOverlayContext.Provider value={value}>
      {children}
    </DealerApplyOverlayContext.Provider>
  );
}
