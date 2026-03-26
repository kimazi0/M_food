"use client";

import { MotionViewport } from "@/components/ui/MotionViewport";
import { Beef, Flame, Leaf, Clock } from "lucide-react";

export function Features() {
  const items = [
    {
      title: "Prime Quality Beef",
      desc: "Our beef is sourced from local farms, ensuring the highest standards of freshness and flavour in every bite.",
      icon: <Beef className="w-8 h-8 text-primary" />,
    },
    {
      title: "Flame Grilled",
      desc: "Authentic wood-fire grilling techniques that lock in the juices and provide that signature smoky aroma.",
      icon: <Flame className="w-8 h-8 text-primary" />,
    },
    {
      title: "Hand-Picked Herbs",
      desc: "Fresh, seasonal ingredients and home-grown herbs that elevate our secret recipe sauces to perfection.",
      icon: <Leaf className="w-8 h-8 text-primary" />,
    },
    {
      title: "Crafted with Time",
      desc: "Slow-fermented dough for our artisan buns, baked daily for the perfect soft texture and rich crumb.",
      icon: <Clock className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-zinc-950/50">
      <div className="container mx-auto px-6">
        <MotionViewport className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {items.map((item, i) => (
            <div key={i} className="group relative">
              {/* Card Decoration */}
              <div className="absolute -inset-4 bg-white/5 rounded-[2rem] scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="relative space-y-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-500">
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </MotionViewport>
      </div>
    </section>
  );
}
