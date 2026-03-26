"use client";

import { useState } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { MotionViewport } from "@/components/ui/MotionViewport";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORY_COLORS: Record<string, { color: string; dot: string }> = {
  ALL: { color: "border-zinc-600 text-zinc-300 bg-zinc-800 hover:bg-zinc-700", dot: "bg-zinc-400" },
  DEFAULT: { color: "border-primary/40 text-primary bg-primary/10 hover:bg-primary/20", dot: "bg-primary" },
};

// Helper to get color for a category name
const getCategoryStyle = (categoryName: string) => {
  return CATEGORY_COLORS.DEFAULT;
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string | null;
  image: string;
  modifications: any[];
}

export function MenuGallery({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(items.map(i => i.categoryName).filter(Boolean))) as string[]];

  const filteredItems =
    activeCategory === "ALL" ? items : items.filter((i) => i.categoryName === activeCategory);

  return (
    <div className="space-y-12">
      {/* Category pills */}
      <MotionViewport direction="none" distance={0} duration={0.6}>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => {
            const style = cat === "ALL" ? CATEGORY_COLORS.ALL : getCategoryStyle(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border text-xs font-black uppercase tracking-widest transition-all duration-300 ${style.color} ${
                  activeCategory === cat ? "ring-2 ring-primary ring-offset-4 ring-offset-[#020617] scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                {cat === "ALL" ? "All Items" : cat}
                <span className="text-[10px] opacity-50">
                  {cat === "ALL"
                    ? items.length
                    : items.filter((i) => i.categoryName === cat).length}
                </span>
              </button>
            );
          })}
        </div>
      </MotionViewport>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <MenuItemCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredItems.length === 0 && (
          <p className="col-span-full text-center py-32 text-zinc-600 font-black uppercase tracking-[0.4em] text-xs">
            No items in this category.
          </p>
        )}
      </div>
    </div>
  );
}
