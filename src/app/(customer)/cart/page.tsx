"use client";

import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function CartPageContent() {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY">("DINE_IN");
  const [tableNumber, setTableNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setIsClient(true);
    const tableParam = searchParams.get("table");
    if (tableParam) { setTableNumber(tableParam); setOrderType("DINE_IN"); }
  }, [searchParams]);

  if (!isClient) return <div className="p-8 text-center text-zinc-500">Loading…</div>;

  const total = getTotal();
  const tax = total * 0.08;
  const grandTotal = total + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    alert("Order placed! (API integration ready)");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#0a0a0a]">
        <div className="w-24 h-24 rounded-3xl bg-[#111111] border border-[#2a2a2a] flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-[#a1a1a1]" />
        </div>
        <h1 className="font-heading font-black text-4xl mb-3 tracking-tighter uppercase text-white">Your cart is empty</h1>
        <p className="text-[#a1a1a1] mb-8 max-w-sm">Looks like you haven't added anything yet. Explore the menu and pick something delicious.</p>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-full h-14 px-10 font-bold bg-primary text-white tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_4px_20px_-5px_rgba(196,30,58,0.5)]"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="border-b border-[#2a2a2a] bg-[#111111] py-5">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link href="/menu" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:text-primary transition-colors text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-black uppercase tracking-tighter text-white leading-none">Checkout</h1>
            <p className="text-[#a1a1a1] text-sm mt-1 uppercase tracking-widest font-bold">{items.length} item{items.length > 1 ? "s" : ""} in your order</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Order details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Order type selector */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[20px] p-6 lg:p-8 shadow-2xl">
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-white mb-6">How would you like to dine?</h2>
              <RadioGroup value={orderType} onValueChange={(v: any) => setOrderType(v)} className="grid grid-cols-2 gap-4">
                {[
                  { value: "DINE_IN", label: "🍽️ Dine In", sub: "Seat yourself" },
                  { value: "TAKEAWAY", label: "🛍️ Takeaway", sub: "Pick up later" },
                ].map((opt) => (
                  <div key={opt.value}>
                    <RadioGroupItem value={opt.value} id={opt.value} className="peer sr-only" />
                    <Label
                      htmlFor={opt.value}
                      className="flex flex-col gap-1 p-5 rounded-2xl border-2 border-[#2a2a2a] bg-[#111111] cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                    >
                      <span className="font-bold text-white text-base">{opt.label}</span>
                      <span className="text-xs font-bold text-[#a1a1a1] uppercase tracking-widest">{opt.sub}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Customer info form */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[20px] p-6 lg:p-8 shadow-2xl">
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-white mb-6">
                {orderType === "DINE_IN" ? "Table Number" : "Your Details"}
              </h2>
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                {orderType === "DINE_IN" ? (
                  <div className="space-y-2">
                    <Label htmlFor="table" className="text-xs font-bold uppercase tracking-widest text-[#a1a1a1]">Table</Label>
                    <Input id="table" placeholder="e.g. 5" required type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}
                      className="bg-[#111111] border-[#2a2a2a] focus:border-primary focus:ring-1 focus:ring-primary h-14 rounded-xl text-lg text-white font-bold" />
                    {searchParams.get("table") && (
                      <p className="text-xs font-bold text-[#22c55e] mt-2 uppercase tracking-widest">✓ Auto-detected from QR code</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#a1a1a1]">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)}
                        className="bg-[#111111] border-[#2a2a2a] focus:border-primary focus:ring-1 focus:ring-primary h-14 rounded-xl text-lg text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-[#a1a1a1]">Phone Number</Label>
                      <Input id="phone" placeholder="(555) 123-4567" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="bg-[#111111] border-[#2a2a2a] focus:border-primary focus:ring-1 focus:ring-primary h-14 rounded-xl text-lg text-white" />
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[20px] p-6 lg:p-8 shadow-2xl sticky top-28">
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-white mb-6">Order Summary</h2>

              <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 items-start">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-[#111111] border border-[#2a2a2a]">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-heading font-bold text-lg leading-tight uppercase tracking-tight text-white truncate">{item.name}</p>
                        <span className="font-heading font-black text-lg text-primary shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-xs text-[#a1a1a1] mt-1 truncate italic">"{item.specialInstructions}"</p>
                      )}
                      
                      {/* Item controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-[#111111] border border-[#2a2a2a] rounded-full h-8 px-1 gap-1">
                          <button onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center rounded-full text-[#a1a1a1] hover:text-primary hover:bg-[#2a2a2a] transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full text-[#a1a1a1] hover:text-primary hover:bg-[#2a2a2a] transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.cartItemId)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#111111] border border-[#2a2a2a] text-[#a1a1a1] hover:text-primary hover:border-primary/50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-[#2a2a2a] pt-6 mb-6">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-[#a1a1a1]">
                  <span>Subtotal</span><span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-[#a1a1a1]">
                  <span>Tax (8%)</span><span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-[#2a2a2a] mt-2">
                  <span className="font-heading font-black text-xl uppercase tracking-tight text-white">Total</span>
                  <span className="font-heading font-black text-4xl text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full h-16 rounded-full font-bold text-lg uppercase tracking-widest text-white bg-primary hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_-5px_rgba(196,30,58,0.5)]"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#a1a1a1] font-bold uppercase tracking-widest">Loading cart...</div>}>
      <CartPageContent />
    </Suspense>
  );
}
