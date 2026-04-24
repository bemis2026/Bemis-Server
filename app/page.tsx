"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { useEditMode } from "./context/EditModeContext";
import { useContent } from "./context/ContentContext";
import Footer from "./components/Footer";
import SectionWrapper from "./components/SectionWrapper";

const EditBar = dynamic(() => import("./components/EditBar"), { ssr: false });
const Stats = dynamic(() => import("./components/Stats"));
const DNA = dynamic(() => import("./components/DNA"));
const Products = dynamic(() => import("./components/Products"));
const ProductShowcase = dynamic(() => import("./components/ProductShowcase"));
const SmartCharger = dynamic(() => import("./components/SmartCharger"));
const FeaturedProducts = dynamic(() => import("./components/FeaturedProducts"));
const DealerNetwork = dynamic(() => import("./components/DealerNetwork"));
const Reviews = dynamic(() => import("./components/Reviews"));
const Calculator = dynamic(() => import("./components/Calculator"));
const B2BCta = dynamic(() => import("./components/B2BCta"));
const Contact = dynamic(() => import("./components/Contact"));
const SearchOverlay = dynamic(() => import("./components/SearchOverlay"), { ssr: false });
const AIChatButton = dynamic(() => import("./components/AIChatButton"), { ssr: false });

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  stats: Stats,
  dna: DNA,
  products: Products,
  productshowcase: ProductShowcase,
  smartcharger: SmartCharger,
  featured: FeaturedProducts,
  dealer: DealerNetwork,
  reviews: Reviews,
  calculator: Calculator,
  b2bcta: B2BCta,
  contact: Contact,
};

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isEditMode } = useEditMode();
  const { sectionOrder } = useContent();

  return (
    <main className="relative" style={{ paddingLeft: isEditMode ? 48 : 0, transition: "padding-left 0.2s" }}>
      {isEditMode && <EditBar />}
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

      <Contact />
      <Footer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatButton />
    </main>
  );
}
