import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableQRGenerator } from "@/components/admin/TableQRGenerator";

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 h-full max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="font-heading font-black text-6xl uppercase tracking-tighter text-white">
            Atelier <span className="text-primary italic">Settings</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Configure environment & tactile interfaces</p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2">Tactile Interface</h2>
          <p className="text-zinc-500 text-sm">Generate table-specific QR codes for high-fidelity table linking.</p>
        </div>
        <TableQRGenerator />
      </section>

      <div className="h-px bg-white/5" />

      <section className="space-y-6">
        <div className="px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Identity & Contact</h2>
        </div>
        <Card className="border-white/5 bg-white/[0.02] rounded-[40px] overflow-hidden backdrop-blur-md">
          <CardContent className="p-8 md:p-10 space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Restaurant Name</Label>
              <Input 
                defaultValue="Mfood" 
                className="bg-zinc-900/50 border-white/10 h-14 rounded-2xl focus:border-primary font-bold text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Phone Number</Label>
                <Input 
                  defaultValue="(555) 123-4567" 
                  className="bg-zinc-900/50 border-white/10 h-14 rounded-2xl focus:border-primary font-bold text-white"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Support</Label>
                <Input 
                  defaultValue="hello@mfood.com" 
                  className="bg-zinc-900/50 border-white/10 h-14 rounded-2xl focus:border-primary font-bold text-white"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-black/40 border-t border-white/5 p-8 flex justify-end">
            <Button className="h-14 px-10 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 active:scale-[0.98] transition-all">
              Save Master Profile
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
