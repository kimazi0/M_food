"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mfood.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { redirect: false, email, password });
    if (result?.error) {
      setError("Identification failed. Please verify your credentials.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/40 relative group">
            <div className="absolute inset-0 bg-white/20 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity" />
            <UtensilsCrossed className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="flex flex-col items-center">
            <span className="font-black text-4xl tracking-tighter text-white mb-2">
              <span className="font-irish">Staff</span>
              <span className="font-italiano text-primary lowercase ml-3">authentication</span>
            </span>
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] mt-3">Access Mfood Headquarters</p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="bg-zinc-950/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Work Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@mfood.com"
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary focus:ring-primary/20 transition-all text-white placeholder:text-zinc-700 font-bold"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Security Key</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary focus:ring-primary/20 transition-all text-white placeholder:text-zinc-700 font-bold"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-shake">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white bg-primary hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              {loading ? "Verifying..." : (
                <>
                  Connect to Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">System Access Codes</p>
            <div className="flex items-center justify-center gap-4 text-xs font-bold">
              <span className="text-zinc-400">admin@mfood.com</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="text-zinc-400">admin123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] mt-10">
          &copy; 2026 Mfood Systems Internatonal. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
