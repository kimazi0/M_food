"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TableQRGenerator() {
  const [startTable, setStartTable] = useState(1);
  const [endTable, setEndTable] = useState(10);
  const [generatedTables, setGeneratedTables] = useState<number[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    const start = Math.max(1, startTable);
    const end = Math.max(start, endTable);
    const tables = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    setGeneratedTables(tables);
  };

  const handlePrint = () => {
    window.print();
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-8">
      <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-md">
        <h3 className="font-heading font-black text-xl uppercase tracking-tight text-white mb-6">QR Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Start Table #</Label>
            <Input 
              type="number" 
              value={startTable} 
              onChange={(e) => setStartTable(parseInt(e.target.value) || 1)}
              className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary font-bold text-white text-xl"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">End Table #</Label>
            <Input 
              type="number" 
              value={endTable} 
              onChange={(e) => setEndTable(parseInt(e.target.value) || 1)}
              className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary font-bold text-white text-xl"
            />
          </div>
        </div>
        <Button 
          onClick={handleGenerate}
          className="w-full h-16 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all gap-3"
        >
          <QrCode className="w-5 h-5" /> Generate QR Batch
        </Button>
      </div>

      {generatedTables.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-heading font-black text-xl uppercase tracking-tight text-white">Generated Batch ({generatedTables.length} Tables)</h3>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="h-12 border-white/10 bg-white/5 rounded-xl font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-white transition-all gap-2"
              >
                <Printer className="w-4 h-4" /> Print Codes
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setGeneratedTables([])}
                className="h-12 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-2 print:gap-10" 
            ref={printRef}
          >
            {generatedTables.map((num) => (
              <div 
                key={num} 
                className="group relative bg-[#0a0a0c] border border-white/10 rounded-[32px] p-6 flex flex-col items-center gap-4 transition-all hover:border-primary/50 hover:bg-primary/5 print:border-black print:bg-white print:p-8"
              >
                <div className="p-4 bg-white rounded-2xl shadow-xl transition-transform group-hover:scale-105 duration-500 print:shadow-none print:p-0">
                  <QRCodeCanvas
                    value={`${origin}/en/menu?table=${num}`}
                    size={140}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "/favicon.ico",
                      height: 30,
                      width: 30,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-primary transition-colors print:text-black">Table</span>
                  <p className="font-heading font-black text-3xl text-white group-hover:text-primary transition-colors print:text-black leading-none mt-1">{num}</p>
                </div>
                
                {/* Print only watermark */}
                <div className="hidden print:block absolute bottom-2 right-4 text-[8px] font-bold text-zinc-300">
                  mfood.com
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          .print\:hidden {
            display: none !important;
          }
          .admin-layout-sidebar, .admin-header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
