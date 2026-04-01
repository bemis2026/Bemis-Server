"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import FeaturedProducts from "./components/FeaturedProducts";
import Calculator from "./components/Calculator";
import Stats from "./components/Stats";
import DNA from "./components/DNA";
import DealerNetwork from "./components/DealerNetwork";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SearchOverlay from "./components/SearchOverlay";
import AIChatButton from "./components/AIChatButton";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <main className="relative">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <Hero />
      <Stats />
      <DNA />
      <Products />
      <FeaturedProducts />
      <DealerNetwork />
      <Reviews />
      <Calculator />
      <Contact />
      <Footer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIChatButton />
    </main>
  );
}
