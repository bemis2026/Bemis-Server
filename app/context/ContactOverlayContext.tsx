"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

type ContactOverlayContextType = {
  open: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactOverlayContext = createContext<ContactOverlayContextType>({
  open: false,
  openContact: () => {},
  closeContact: () => {},
});

export function useContactOverlay() { return useContext(ContactOverlayContext); }

export function ContactOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openContact, closeContact }), [open, openContact, closeContact]);
  return (
    <ContactOverlayContext.Provider value={value}>
      {children}
    </ContactOverlayContext.Provider>
  );
}
