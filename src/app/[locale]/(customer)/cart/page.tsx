"use client";

import { useCart } from "@/store/useCart";
import { MotionViewport } from "@/components/ui/MotionViewport";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24 px-4">
        <MotionViewport className="text-center">
          <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-8 mx-auto border border-white/5">
            <ShoppingBag className="w-10 h-10 text-zinc-600" />
          </div>
          <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-white mb-4">Your cart is empty</h1>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/menu">
            <Button className="h-14 px-10 rounded-full bg-primary text-secondary font-black uppercase tracking-widest text-xs">
              Go to Menu
            </Button>
          </Link>
        </MotionViewport>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <MotionViewport className="mb-12 flex items-center justify-between">
          <h1 className="font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
            Shopping <span className="text-primary italic">Cart</span>
          </h1>
          <button 
            onClick={clearCart}
            className="text-xs font-black text-zinc-500 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </MotionViewport>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <MotionViewport key={item.cartItemId} delay={i * 0.05} direction="none">
                <div className="flex gap-6 p-6 rounded-3xl bg-zinc-900/50 border border-white/5 items-center">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/logo.png"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-heading text-lg font-bold text-white uppercase mb-1">{item.name}</h3>
                    <p className="text-primary font-black text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 rounded-full p-1 border border-white/10">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-400"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </MotionViewport>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <MotionViewport className="p-8 rounded-[40px] bg-zinc-950 border border-white/10 sticky top-32">
              <h2 className="font-heading text-2xl font-bold text-white uppercase mb-8">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-400">
                  <span className="text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="text-sm uppercase tracking-widest">Service Fee</span>
                  <span className="font-bold text-white">$0.00</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="font-heading text-xl font-bold text-white uppercase">Total</span>
                  <span className="font-heading text-3xl font-black text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full h-16 rounded-2xl bg-primary text-secondary font-black uppercase tracking-widest text-xs hover:brightness-110 shadow-xl shadow-primary/20">
                Checkout Now
              </Button>
              <Link href="/menu" className="block text-center mt-6 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                Continue Shopping
              </Link>
            </MotionViewport>
          </div>
        </div>
      </div>
    </div>
  );
}
