"use client";

import Image from "next/image";
import { Plus, Flame, Leaf } from "lucide-react";
import { useState } from "react";
import { MenuItemModal } from "./MenuItemModal";

const CATEGORY_ACCENT: Record<string, string> = {
  MAIN: "#FACC15",
  DRINK: "#FDE047",
  DESSERT: "#EAB308",
  SIDE: "#CA8A04",
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

export function MenuItemCard({ item }: { item: MenuItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const accent = CATEGORY_ACCENT[item.categoryName || ""] ?? "#FACC15";

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-[32px] bg-card/60 backdrop-blur-md border border-white/5 hover:border-primary/50 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]"
        onClick={() => setModalOpen(true)}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={
              item.image ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
            }
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
          {/* Category badge */}
          <div
            className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-md border border-white/10"
            style={{ background: accent + "66" }} // 40% opacity
          >
            {item.categoryName}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-8 relative">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="font-heading text-2xl font-black uppercase tracking-tighter leading-none flex-1 text-white">{item.name}</h3>
            <span
              className="font-heading font-black text-2xl shrink-0 tabular-nums text-primary"
            >
              ${item.price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-zinc-500 line-clamp-2 mb-8 leading-relaxed flex-1 font-medium">
            {item.description}
          </p>

          {/* Add button */}
          <div
            className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 text-white bg-white/5 border border-white/5 group-hover:bg-primary group-hover:text-secondary group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]"
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
