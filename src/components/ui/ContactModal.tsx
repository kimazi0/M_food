"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Instagram, Twitter, Facebook, Phone, MapPin, X } from "lucide-react";
import Image from "next/image";

const LOCATIONS = [
  { 
    name: "Downtown Flagship", 
    address: "123 Burger Avenue, DXB", 
    phone: "+971 50 123 4567",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" 
  },
  { 
    name: "Beachside Grill", 
    address: "Marine Drive, JBR", 
    phone: "+971 50 987 6543",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" 
  }
];

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpen);
    return () => window.removeEventListener("open-contact-modal", handleOpen);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background border-white/10 rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Locations Info */}
          <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-geometric opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-halftone opacity-[0.05] pointer-events-none" />
            
            <DialogHeader className="mb-10 relative z-10">
              <DialogTitle className="font-heading font-black text-4xl uppercase tracking-tighter text-white">
                Our <span className="text-primary italic">Presence</span>
              </DialogTitle>
              <p className="text-zinc-500 text-sm mt-3 uppercase font-black tracking-widest">Connect with our culinary hubs</p>
            </DialogHeader>

            <div className="space-y-8 relative z-10">
              {LOCATIONS.map((loc, i) => (
                <div key={i} className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary transition-colors">
                      <MapPin className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-bold text-white uppercase mb-1">{loc.name}</h4>
                      <p className="text-zinc-400 text-sm mb-2 font-medium">{loc.address}</p>
                      <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-widest uppercase">
                        <Phone className="w-3 h-3" /> {loc.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Social Networks</p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual Presence */}
          <div className="w-full md:w-[300px] bg-zinc-900/50 p-4 shrink-0 flex flex-col gap-4">
            {LOCATIONS.map((loc, i) => (
              <div key={i} className="relative flex-1 rounded-[24px] overflow-hidden group">
                <Image 
                  src={loc.img} 
                  alt={loc.name} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{loc.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
