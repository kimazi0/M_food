import { Link } from "@/navigation";
import Image from "next/image";
import { UtensilsCrossed, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background pt-32 pb-16 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-16 h-16 shadow-2xl">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="font-heading font-black text-3xl uppercase tracking-tighter text-white">M<span className="text-primary italic">food</span></span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-medium">
              A modern dining experience where bold flavours meet an unforgettable atmosphere. The future of artisan burgers.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-heading font-black text-xs mb-8 uppercase tracking-[0.3em] text-zinc-500">Navigate</h4>
            <ul className="space-y-4">
              {[["Menu", "/menu"], ["Gallery", "/gallery"], ["Contact", "/contact"]].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-white hover:text-primary text-sm font-black uppercase tracking-widest transition-colors flex items-center gap-3 group">
                    <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading font-black text-xs mb-8 uppercase tracking-[0.3em] text-zinc-500">Service Hours</h4>
            <ul className="space-y-4 text-zinc-300 text-sm font-black tracking-widest uppercase">
              <li className="flex justify-between border-b border-white/5 pb-3"><span>Mon–Fri</span><span className="text-white">11:00 – 22:00</span></li>
              <li className="flex justify-between border-b border-white/5 pb-3"><span>Sat</span><span className="text-white">11:00 – 23:00</span></li>
              <li className="flex justify-between border-b border-white/5 pb-3"><span>Sun</span><span className="text-white">12:00 – 21:00</span></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-black text-xs mb-8 uppercase tracking-[0.3em] text-zinc-500">Follow Us</h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all hover:-translate-y-2 shadow-xl group"
                >
                   <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} Mfood Artisan Kitchen. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors text-zinc-200">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
