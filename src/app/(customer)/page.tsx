import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode, Star, Clock, MapPin, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
  "https://images.unsplash.com/photo-1576107232684-1279f39085cb?w=600&q=80",
  "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
];

const FEATURES = [
  { icon: QrCode, title: "Scan & Order", desc: "Scan a table QR code to order without waiting for a waiter." },
  { icon: Clock, title: "Real-time Updates", desc: "Watch your order status update live from kitchen to table." },
  { icon: Star, title: "Premium Quality", desc: "Every dish is crafted with the freshest ingredients." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background dark overlay on an image - assuming we would use an image here, let's gradient it dark for now */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0a0a0a]/90 to-[#0a0a0a] z-0" />
        <div 
          className="absolute inset-0 z-[-1] opacity-30 object-cover" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
        />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-20">
          <div className="max-w-4xl">
            <h1 className="font-heading font-black text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-tighter uppercase mb-6 drop-shadow-2xl flex flex-col items-center">
              <span className="text-white">The Real</span>
              <span className="text-outline-primary tracking-widest mt-2">Burger</span>
              <span className="text-primary mt-2">Experience</span>
            </h1>

            <p className="text-lg md:text-xl text-[#a1a1a1] mb-12 max-w-2xl mx-auto font-medium">
              A cutting-edge dining experience where technology meets flavour. Order right from your table, track your food live.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/menu" className="inline-flex items-center justify-center gap-3 h-14 md:h-16 px-10 rounded-full bg-primary text-white font-bold text-lg hover:brightness-110 hover:-translate-y-1 transition-all shadow-[0_0_30px_-5px_rgba(196,30,58,0.5)] group">
                ORDER NOW <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center h-14 md:h-16 px-10 rounded-full border-2 border-white/20 bg-transparent text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all">
                OUR LOCATIONS
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-10 animate-bounce">
            <div className="w-10 h-16 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-24 relative z-10 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="relative p-8 rounded-[16px] bg-[#1a1a1a] border border-[#2a2a2a] hover:border-primary hover:-translate-y-2 transition-all duration-300 group overflow-hidden">
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-xs font-bold text-[#a1a1a1] border border-[#2a2a2a]">
                  0{i + 1}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-[#2a2a2a] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3 text-white">{f.title}</h3>
                <p className="text-[#a1a1a1] text-base leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Display */}
      <section className="py-20 border-y border-[#2a2a2a] bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-around gap-12 text-center">
            <div className="flex flex-col items-center">
              <span className="font-heading font-black text-6xl md:text-7xl text-white mb-2 tracking-tighter">50K+</span>
              <span className="text-sm font-bold text-[#a1a1a1] uppercase tracking-widest">Happy Customers</span>
            </div>
            <div className="hidden md:block w-px h-20 bg-[#2a2a2a]"></div>
            <div className="flex flex-col items-center">
              <span className="font-heading font-black text-6xl md:text-7xl text-white mb-2 tracking-tighter">12</span>
              <span className="text-sm font-bold text-[#a1a1a1] uppercase tracking-widest">Store Locations</span>
            </div>
            <div className="hidden md:block w-px h-20 bg-[#2a2a2a]"></div>
            <div className="flex flex-col items-center">
              <span className="font-heading font-black text-6xl md:text-7xl text-white mb-2 tracking-tighter">4.9</span>
              <span className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-1"><Star className="w-4 h-4 fill-accent" /> Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section (Location card style mixed) */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-[#1a1a1a] rounded-[24px] border border-[#2a2a2a] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
            {/* abstract bg graphic */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                All Locations Open
              </div>
              <h2 className="font-heading font-black text-5xl md:text-6xl uppercase tracking-tighter mb-6 leading-tight">
                Skip The Line. <br />
                <span className="text-primary">Order Ahead.</span>
              </h2>
              <p className="text-[#a1a1a1] text-lg mb-8">
                Scan the QR code at your table or pick up your order directly from the counter.
              </p>
              <div className="flex gap-4">
                <Link href="/menu" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-white font-bold hover:brightness-110 transition-all flex-1 md:flex-none">
                  START ORDER 
                </Link>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto">
               <div className="p-4 rounded-[20px] bg-[#111111] border border-[#2a2a2a] shadow-2xl flex flex-col items-center gap-4">
                 <div className="w-48 h-48 bg-white rounded-[12px] flex items-center justify-center p-2">
                   {/* In a real app this is an actual QR code component, using an icon for now */}
                   <QrCode className="w-full h-full text-black" strokeWidth={1} />
                 </div>
                 <p className="text-sm font-bold text-[#a1a1a1] uppercase tracking-widest text-center">Scan to order at table</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
