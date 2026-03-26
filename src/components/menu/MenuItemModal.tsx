"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/store/useCart";

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

export function MenuItemModal({
  item, isOpen, onClose,
}: {
  item: MenuItem; isOpen: boolean; onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const addItem = useCart((state) => state.addItem);
  const accent = CATEGORY_ACCENT[item.categoryName || ""] ?? "#FACC15";

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      modifications: [],
      specialInstructions,
      image: item.image,
    });
    setQuantity(1);
    setSpecialInstructions("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-background border-white/10 rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)]">
        {/* Hero image */}
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          {/* Category chip */}
          <div
            className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-md border border-white/10"
            style={{ background: accent + "66" }}
          >
            {item.categoryName}
          </div>
          {/* Price overlay */}
          <div className="absolute bottom-6 right-6 text-4xl font-heading font-black tabular-nums tracking-tighter text-white drop-shadow-xl">
            ${item.price.toFixed(2)}
          </div>
        </div>

        <div className="p-8 md:p-10 pt-4">
          <DialogHeader className="mb-8">
            <DialogTitle className="font-heading text-4xl font-black uppercase tracking-tighter text-white leading-tight">{item.name}</DialogTitle>
            <DialogDescription className="text-zinc-500 mt-4 text-base leading-relaxed font-medium">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Special Instructions
            </label>
            <Textarea
              placeholder="Allergies, preferences, extra spicy? Let us know."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none bg-white/[0.03] border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl text-white placeholder:text-zinc-700 h-24"
            />
          </div>

          {/* Quantity + CTA */}
          <div className="flex items-center justify-between gap-6 mt-12 pt-8 border-t border-white/5">
            {/* Qty selector */}
            <div className="flex items-center justify-between min-w-[140px] h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-3">
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-20"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-8 text-center font-heading font-black text-2xl text-white">{quantity}</span>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <button
               type="button"
               onClick={handleAddToCart}
               className="flex-1 flex items-center justify-center gap-3 h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-secondary bg-primary hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <ShoppingCart className="h-5 w-5" />
              ADD — ${(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
