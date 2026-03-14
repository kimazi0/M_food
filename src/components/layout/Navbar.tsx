"use client";

import Link from "next/link";
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
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-md shadow-lg shadow-black/40 border-b border-[#2a2a2a] py-3"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex h-auto items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
              <UtensilsCrossed className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter text-white uppercase">
              M<span className="text-primary">food</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-zinc-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 relative group px-1 flex items-center h-full uppercase tracking-wide"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out rounded-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button
                className="relative h-12 w-12 !p-0 rounded-full bg-transparent hover:bg-white/10 border border-[#2a2a2a] transition-all hover:scale-105 active:scale-95 duration-200"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {isMounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-white font-bold border-2 border-[#0a0a0a] animate-in zoom-in-50 duration-300 shadow-sm">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              className="md:hidden h-12 w-12 !p-0 rounded-full bg-[#111111] border border-[#2a2a2a] hover:bg-primary transition-all active:scale-95 text-white"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#111111] border-l border-[#2a2a2a] flex flex-col p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <span className="font-heading font-black text-2xl tracking-tighter text-white uppercase">
                M<span className="text-primary">food</span>
              </span>
              <Button
                className="h-10 w-10 !p-0 rounded-full bg-transparent hover:bg-white/10 text-white"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors font-medium"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
