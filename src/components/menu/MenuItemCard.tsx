"use client";

import Image from "next/image";
import { Plus, Flame, Leaf } from "lucide-react";
import { useState } from "react";
import { MenuItemModal } from "./MenuItemModal";

const CATEGORY_ACCENT: Record<string, string> = {
  MAIN: "#FF6B35",
  DRINK: "#4ECDC4",
  DESSERT: "#F7D794",
  SIDE: "#95E1D3",
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

export function MenuItemCard({ item }: { item: MenuItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const accent = CATEGORY_ACCENT[item.category] ?? "#FF6B35";

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-[16px] bg-[#1a1a1a] border border-[#2a2a2a] hover:border-primary cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(196,30,58,0.3)]"
        onClick={() => setModalOpen(true)}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={
              item.image ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
            }
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80" />
          {/* Category badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
            style={{ background: accent }}
          >
            {item.category}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 relative">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="font-heading text-xl font-bold uppercase tracking-tight leading-tight flex-1 text-white">{item.name}</h3>
            <span
              className="font-heading font-black text-xl shrink-0 tabular-nums text-primary"
            >
              ${item.price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-[#a1a1a1] line-clamp-2 mb-6 leading-relaxed flex-1">
            {item.description}
          </p>

          {/* Add button */}
          <div
            className="flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 text-white group-hover:bg-primary border border-white/10 group-hover:border-primary/50"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Plus className="w-4 h-4" />
            Add to Order
          </div>
        </div>
      </div>

      <MenuItemModal item={item} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
