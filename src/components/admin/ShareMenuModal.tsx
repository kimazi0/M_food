"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, Download, Copy, Check } from "lucide-react";

interface ShareMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareMenuModal({ isOpen, onClose }: ShareMenuModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const menuUrl = typeof window !== "undefined" ? `${window.location.origin}/menu` : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "mfood-menu-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-sm bg-[#0a0a0c] border border-white/10 rounded-[40px] p-8 md:p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-black text-2xl uppercase tracking-tighter text-white">
            Share <span className="text-primary italic">Menu</span>
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8 flex flex-col items-center">
          <div className="p-6 bg-white rounded-3xl shadow-2xl transition-transform hover:scale-105 duration-500" ref={qrRef}>
            <QRCodeCanvas
              value={menuUrl}
              size={200}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/favicon.ico",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          <div className="w-full space-y-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownloadQR}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all group"
              >
                <Download className="w-4 h-4 text-primary group-hover:-translate-y-1 transition-transform" />
                Download Image
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Menu Link
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[9px] text-zinc-500 text-center font-black uppercase tracking-[0.2em]">
              Customers can scan this to view your menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
