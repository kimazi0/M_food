"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { ShoppingCart, Menu as MenuIcon, X, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useEffect, useState } from "react";

export function Navbar() {
  const items = useCart((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
          <header
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl h-14 transition-all duration-500 ease-in-out rounded-full border border-white/10 flex items-center ${
              scrolled
                ? "bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                : "bg-transparent"
            }`}
          >
            <div className="container mx-auto px-6 h-full flex items-center justify-between pointer-events-none">
              {/* Logo */}
              <Link href="/" className="flex items-center group h-full pointer-events-auto">
                <div className="relative w-28 h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain object-left" 
                  />
                </div>
              </Link>

              <div className="flex items-center gap-8 pointer-events-auto">

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/menu"
              className="text-[13px] font-black text-zinc-400 hover:text-white transition-all duration-300 relative group px-1 flex items-center h-full uppercase tracking-widest"
            >
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out rounded-full" />
            </Link>
            <Link
              href="/#gallery"
              className="text-[13px] font-black text-zinc-400 hover:text-white transition-all duration-300 relative group px-1 flex items-center h-full uppercase tracking-widest"
            >
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out rounded-full" />
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
              className="text-[13px] font-black text-zinc-400 hover:text-white transition-all duration-300 relative group px-1 flex items-center h-full uppercase tracking-widest cursor-pointer"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out rounded-full" />
            </button>
          </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative group">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <ShoppingCart className="h-4 w-4 text-zinc-300 group-hover:text-white" />
                </div>
                {isMounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-secondary font-black animate-in zoom-in-50 duration-300 shadow-lg">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              <Link href="/menu" className="hidden sm:block">
                <Button
                  className="h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-secondary font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Order Now
                </Button>
              </Link>

              <button
                className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-4 top-4 bottom-4 w-72 bg-zinc-950 border border-white/10 rounded-3xl flex flex-col p-8 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <span className="font-heading font-black text-2xl tracking-tighter text-white uppercase">
                M<span className="text-primary">food</span>
              </span>
              <button
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-400"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              <Link
                href="/menu"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Menu
              </Link>
              <Link
                href="/#gallery"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Gallery
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent("open-contact-modal"));
                }}
                className="text-left text-lg font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Contact
              </button>
              <Link href="/menu" onClick={() => setMobileOpen(false)} className="mt-8">
                <Button className="w-full h-14 rounded-2xl bg-primary text-secondary font-black uppercase tracking-widest text-sm">
                  Order Now
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
