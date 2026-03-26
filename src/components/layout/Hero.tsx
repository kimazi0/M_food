"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { MotionViewport } from "@/components/ui/MotionViewport";
import { ArrowRight, Utensils } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <MotionViewport className="flex flex-col items-center text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Utensils className="w-3 h-3 child-primary" />
            <span>The Premier Artisan Burger Experience</span>
          </motion.div>

          {/* Branded Headline */}
          <h1 className="relative mb-8">
            <span className="block text-7xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-2">
              <span className="font-irish text-white">M</span>
              <span className="font-italiano text-primary lowercase -ml-4 md:-ml-8">food</span>
            </span>
            <span className="block text-2xl md:text-4xl font-black uppercase tracking-[0.2em] text-zinc-500">
              Artisan Kitchen
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
            A modern dining experience where <span className="text-white font-medium">bold flavours</span> meet an <span className="text-white font-medium">unforgettable atmosphere</span>. Experience the future of artisan burgers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/menu">
              <Button size="lg" className="h-16 px-10 rounded-full bg-primary hover:bg-primary/90 text-secondary font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 group">
                Explore Menu
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
              className="h-16 px-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:border-white/20 active:scale-95"
            >
              Book a Table
            </button>
          </div>

          {/* Stats/Features simple */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-24">
            {[
              { label: "Locally Sourced", val: "100%" },
              { label: "Premium Cuts", val: "Hand-Picked" },
              { label: "Daily Baked", val: "Artisan Buns" },
              { label: "Secret Sauce", val: "Recipe X" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                className="flex flex-col gap-1"
              >
                <span className="text-primary font-black text-xl uppercase tracking-tighter">{stat.val}</span>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </MotionViewport>
      </div>
      
      {/* Decorative scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
