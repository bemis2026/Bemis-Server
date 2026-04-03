"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import Navbar from "../../../components/Navbar";
import ContactBar from "../../../components/ContactBar";
import SearchOverlay from "../../../components/SearchOverlay";
import {
  RiChargingPile2Line, RiBatteryChargeLine, RiFlashlightLine,
  RiPlugLine, RiCarLine, RiToolsLine, RiToolsFill, RiGasStationLine,
  RiArrowLeftLine,
} from "react-icons/ri";
import { HiMail, HiPhone } from "react-icons/hi";

type SpecItem  = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductEntry = {
  id: string; name: string; subtitle: string; badge: string | null;
  description: string; specs: SpecGroup[]; image?: string;
};
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

const categoryIcons: Record<string, React.ElementType> = {
  wallbox: RiChargingPile2Line, portable: RiBatteryChargeLine,
  cables: RiFlashlightLine, "v2l-c2l": RiCarLine,
  converters: RiToolsLine, "charger-equipment": RiToolsFill,
  accessories: RiPlugLine, "dc-units": RiGasStationLine,
};

export default function ProductDetailPage() {
  const params    = useParams();
  const router    = useRouter();
  const { theme } = useTheme();
  const d         = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory]     = useState<CategoryData | null>(null);
  const [product,  setProduct]      = useState<ProductEntry | null>(null);
  const [loading,  setLoading]      = useState(true);

  const categoryId = typeof params.id        === "string" ? params.id        : "";
  const productId  = typeof params.productId === "string" ? params.productId : "";

  useEffect(() => {
    if (!categoryId || !productId) return;
    fetch("/api/products")
      .then(r => r.json())
      .then((data: CategoryData[]) => {
        const cat  = data.find(c => c.id === categoryId) ?? null;
        const prod = cat?.products.find(p => p.id === productId) ?? null;
        setCategory(cat);
        setProduct(prod);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId, productId]);

  const bg           = d ? "#0c0c0e" : "#f8f8fb";
  const surface      = d ? "#141416" : "#ffffff";
  const border       = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider      = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const groupHdr     = d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
  const textPrimary  = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted    = d ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.52)";
  const textFaint    = d ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)";
  const accent       = category?.accent ?? "#3B82F6";
  const Icon         = categoryIcons[categoryId] ?? RiChargingPile2Line;

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Back bar */}
      <div
        className="sticky top-16 z-40 border-b"
        style={{ background: surface, borderColor: divider }}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 h-12 flex items-center gap-3">
          <button
            onClick={() => router.push(`/products/${categoryId}`)}
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: textMuted }}
          >
            <RiArrowLeftLine size={16} />
            {category?.name ?? "Kategoriye Dön"}
          </button>
          {product && (
            <>
              <span style={{ color: textFaint }}>›</span>
              <span className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                {product.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accent}50`, borderTopColor: "transparent" }} />
          </div>
        )}

        {!loading && !product && (
          <div className="text-center py-32">
            <p className="text-lg font-bold mb-2" style={{ color: textPrimary }}>Ürün bulunamadı</p>
            <button onClick={() => router.push("/products")} className="text-sm underline" style={{ color: accent }}>
              Tüm ürünlere dön
            </button>
          </div>
        )}

        {!loading && product && category && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                style={{ width: 56, height: 56, background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon style={{ fontSize: 26, color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black" style={{ color: textPrimary }}>
                    {product.name}
                  </h1>
                  {product.badge && (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                {product.subtitle && (
                  <p className="text-sm" style={{ color: textFaint }}>{product.subtitle}</p>
                )}
                <p className="text-xs mt-1 font-medium" style={{ color: accent }}>{category.name}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">

              {/* Left — image + description */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {/* Image */}
                {product.image ? (
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${border}`, background: surface }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full object-cover"
                      style={{ maxHeight: 280 }}
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-2xl flex items-center justify-center"
                    style={{
                      height: 200,
                      background: d
                        ? `linear-gradient(145deg, ${accent}14 0%, #111 100%)`
                        : `linear-gradient(145deg, ${accent}10 0%, #f4f4f4 100%)`,
                      border: `1px solid ${accent}22`,
                    }}
                  >
                    <Icon style={{ fontSize: 64, color: accent, opacity: 0.35 }} />
                  </div>
                )}

                {/* Description */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: accent }}>
                    Ürün Hakkında
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                    {product.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => router.push("/#contact")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: accent, color: "#fff" }}
                  >
                    <HiMail size={15} /> Fiyat Teklifi Al
                  </button>
                  <button
                    onClick={() => router.push("/#contact")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                  >
                    <HiPhone size={14} /> Teknik Destek
                  </button>
                </div>
              </div>

              {/* Right — specs */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <h2 className="text-base font-bold" style={{ color: textPrimary }}>Teknik Özellikler</h2>
                {product.specs.map((group, gi) => (
                  <motion.div
                    key={gi}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: gi * 0.07 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${border}` }}
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-2"
                      style={{ background: groupHdr, borderBottom: `1px solid ${divider}` }}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent }} />
                      <span className="text-xs font-bold" style={{ color: textPrimary }}>{group.group}</span>
                    </div>
                    {group.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="px-4 py-3 flex items-center justify-between gap-4"
                        style={{ borderBottom: ii < group.items.length - 1 ? `1px solid ${divider}` : "none" }}
                      >
                        <span className="text-sm" style={{ color: textFaint }}>{item.label}</span>
                        <span className="text-sm font-semibold text-right" style={{ color: textMuted }}>{item.value}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </div>

      <ContactBar />
    </div>
  );
}
