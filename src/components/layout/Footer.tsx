import Link from "next/link";
import { UtensilsCrossed, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_4px_20px_-5px_rgba(196,30,58,0.5)]">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-black text-2xl uppercase tracking-tighter text-white">M<span className="text-primary">food</span></span>
            </div>
            <p className="text-[#a1a1a1] text-sm leading-relaxed max-w-xs font-medium">
              A modern dining experience where bold flavours meet an unforgettable atmosphere.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-heading font-black text-lg mb-6 uppercase tracking-widest text-white">Navigate</h4>
            <ul className="space-y-4">
              {[["Menu", "/menu"], ["Gallery", "/gallery"], ["Contact", "/contact"]].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-[#a1a1a1] hover:text-primary text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                    <span className="w-2 h-px bg-current opacity-0 transition-opacity group-hover:opacity-100" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading font-black text-lg mb-6 uppercase tracking-widest text-white">Hours</h4>
            <ul className="space-y-4 text-[#a1a1a1] text-sm font-bold tracking-wide">
              <li className="flex justify-between border-b border-[#2a2a2a] pb-2"><span>Mon–Fri</span><span className="text-white">11 AM – 10 PM</span></li>
              <li className="flex justify-between border-b border-[#2a2a2a] pb-2"><span>Sat</span><span className="text-white">11 AM – 11 PM</span></li>
              <li className="flex justify-between border-b border-[#2a2a2a] pb-2"><span>Sun</span><span className="text-white">12 PM – 9 PM</span></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-black text-lg mb-6 uppercase tracking-widest text-white">Follow Us</h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full bg-[#111111] border border-[#2a2a2a] text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#a1a1a1] text-xs font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Mfood Restaurant. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-white transition-colors">Staff Portal</Link>
        </div>
      </div>
    </footer>
  );
}
