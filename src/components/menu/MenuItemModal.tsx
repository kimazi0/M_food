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

export function MenuItemModal({
  item, isOpen, onClose,
}: {
  item: MenuItem; isOpen: boolean; onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const addItem = useCart((state) => state.addItem);
  const accent = CATEGORY_ACCENT[item.category] ?? "#FF6B35";

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
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] rounded-[24px] shadow-2xl">
        {/* Hero image */}
        <div className="relative h-60 w-full overflow-hidden">
          <Image
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
          {/* Category chip */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
            style={{ background: accent }}
          >
            {item.category}
          </div>
          {/* Price overlay */}
          <div className="absolute bottom-4 right-4 text-3xl font-heading font-black tabular-nums tracking-tighter" style={{ color: accent }}>
            ${item.price.toFixed(2)}
          </div>
        </div>

        <div className="p-6 md:p-8 pt-2">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-heading text-3xl font-bold uppercase tracking-tight text-white">{item.name}</DialogTitle>
            <DialogDescription className="text-[#a1a1a1] mt-2 text-base leading-relaxed">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-[#a1a1a1]">
              Special Instructions
            </label>
            <Textarea
              placeholder="Allergies, preferences, extra spicy? Let us know."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none bg-[#111111] border-[#2a2a2a] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-white placeholder:text-zinc-600"
              rows={3}
            />
          </div>

          {/* Quantity + CTA */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[#2a2a2a]">
            {/* Qty selector */}
            <div className="flex items-center justify-between min-w-[120px] h-14 bg-[#111111] border border-[#2a2a2a] rounded-full px-2">
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#2a2a2a] hover:text-primary transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-8 text-center font-heading font-black text-xl text-white">{quantity}</span>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#2a2a2a] hover:text-primary transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-3 h-14 rounded-full font-bold text-sm uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]"
              style={{ background: accent }}
            >
              <ShoppingCart className="h-5 w-5" />
              Add — ${(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
