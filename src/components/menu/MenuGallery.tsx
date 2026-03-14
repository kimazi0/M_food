"use client";

import { useState } from "react";
import { MenuItemCard } from "./MenuItemCard";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  ALL: { label: "All Items", color: "border-zinc-600 text-zinc-300 bg-zinc-800 hover:bg-zinc-700", dot: "bg-zinc-400" },
  MAIN: { label: "Mains", color: "border-[#FF6B35]/40 text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20", dot: "bg-[#FF6B35]" },
  DRINK: { label: "Drinks", color: "border-[#4ECDC4]/40 text-[#4ECDC4] bg-[#4ECDC4]/10 hover:bg-[#4ECDC4]/20", dot: "bg-[#4ECDC4]" },
  DESSERT: { label: "Desserts", color: "border-[#F7D794]/40 text-[#F7D794] bg-[#F7D794]/10 hover:bg-[#F7D794]/20", dot: "bg-[#F7D794]" },
  SIDE: { label: "Sides", color: "border-[#95E1D3]/40 text-[#95E1D3] bg-[#95E1D3]/10 hover:bg-[#95E1D3]/20", dot: "bg-[#95E1D3]" },
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  modifications: any[];
}

export function MenuGallery({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredItems =
    activeCategory === "ALL" ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${cfg.color} ${
              activeCategory === key ? "ring-2 ring-offset-2 ring-offset-zinc-950 ring-current" : ""
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
            <span className="text-xs opacity-70">
              {key === "ALL"
                ? `(${items.length})`
                : `(${items.filter((i) => i.category === key).length})`}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
        {filteredItems.length === 0 && (
          <p className="col-span-full text-center py-16 text-zinc-500">
            No items in this category.
          </p>
        )}
      </div>
    </div>
  );
}
