import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, UtensilsCrossed, ClipboardList, Settings } from "lucide-react";

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
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#e55a24] flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg">M<span className="text-primary">food</span> <span className="text-xs font-normal text-zinc-500">Staff</span></span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {[
            { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/orders", icon: ClipboardList, label: "Orders" },
            ...(session.user && (session.user as any).role === "ADMIN"
              ? [
                  { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu CMS" },
                  { href: "/admin/settings", icon: Settings, label: "Settings" },
                ]
              : []),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold truncate">{session.user?.name}</p>
            <p className="text-xs text-zinc-500">{(session.user as any)?.role ?? "STAFF"}</p>
          </div>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto w-full">{children}</main>
    </div>
  );
}
