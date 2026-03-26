import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ChevronRight } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // No session — just render children (allows login page to show)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden relative">
      {/* Background Decor Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="fixed inset-0 bg-band-pattern opacity-50 pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-white/5 flex-col hidden md:flex z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-geometric opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-halftone opacity-[0.05] pointer-events-none" />
        
        <div className="h-24 flex items-center px-8 gap-3 relative z-10">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-110 shadow-lg shadow-black/40">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight leading-none text-2xl">
              <span className="font-irish text-white">M</span>
              <span className="font-italiano text-primary lowercase">food</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1.5 ml-0.5">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {[
            { href: "/admin/dashboard", icon: LayoutDashboard, label: "Kitchen Board" },
            { href: "/admin/orders", icon: ClipboardList, label: "Order History" },
            ...(session.user && (session.user as any).role === "ADMIN"
              ? [
                  { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu Editor" },
                  { href: "/admin/settings", icon: Settings, label: "Global Settings" },
                ]
              : []),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between px-4 py-3.5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-white/[0.02] transition-all" />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-heading font-black text-zinc-400">
              {session.user?.name?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold truncate text-white">{session.user?.name}</p>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none mt-1">
                {(session.user as any)?.role ?? "STAFF"}
              </p>
            </div>
          </div>
          <a
            href="/api/auth/signout"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-zinc-900 border border-white/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto w-full relative z-10 bg-zinc-950/20 backdrop-blur-sm">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
