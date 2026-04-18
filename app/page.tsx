"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EditBar from "./components/EditBar";
import { useEditMode } from "./context/EditModeContext";
import { useContent } from "./context/ContentContext";
import Products from "./components/Products";
import FeaturedProducts from "./components/FeaturedProducts";
import Calculator from "./components/Calculator";
import Stats from "./components/Stats";
import DNA from "./components/DNA";
import DealerNetwork from "./components/DealerNetwork";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import B2BCta from "./components/B2BCta";
import SearchOverlay from "./components/SearchOverlay";
import AIChatButton from "./components/AIChatButton";
import SectionWrapper from "./components/SectionWrapper";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  stats: Stats,
  dna: DNA,
  products: Products,
  featured: FeaturedProducts,
  dealer: DealerNetwork,
  reviews: Reviews,
  calculator: Calculator,
  contact: Contact,
};

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isEditMode } = useEditMode();
  const { sectionOrder } = useContent();

  return (
    <main className="relative" style={{ paddingLeft: isEditMode ? 48 : 0, transition: "padding-left 0.2s" }}>
      <EditBar />
      {isEditMode && <div style={{ height: 42 }} />}
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <Hero />

      {sectionOrder.map((id, i) => {
        const SectionComponent = SECTION_COMPONENTS[id];
        if (!SectionComponent) return null;
        return (
          <SectionWrapper key={id} id={id} index={i} total={sectionOrder.length}>
            <SectionComponent />
          </SectionWrapper>
        );
      })}

      <B2BCta />
      <Footer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatButton />
    </main>
  );
}
