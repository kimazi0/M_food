"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, User as UserIcon, AlertCircle, ChevronRight, CheckCircle2, PlayCircle, Loader2, CreditCard } from "lucide-react";
import { updateOrderStatus, completeOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { MotionViewport } from "@/components/ui/MotionViewport";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ACTIVE_COLUMNS = [
  { id: "PENDING", title: "New Orders", emoji: "🆕", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", btn: "bg-amber-500" },
  { id: "PREPARING", title: "Preparing", emoji: "👨‍🍳", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", btn: "bg-primary" },
  { id: "READY", title: "Ready", emoji: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", btn: "bg-emerald-500" },
];

function getElapsed(date: Date) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1m ago";
  return `${mins}m ago`;
}

export function KitchenDisplay({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Auto refresh every 15 seconds to catch new orders from customers
  useEffect(() => {
    const t = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(t);
  }, [router]);

  // Update local state when initialOrders change (from refresh)
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleMoveOrder = async (orderId: string, currentStatus: string, direction: 1 | -1) => {
    const allCols = [...ACTIVE_COLUMNS, { id: "SERVED", title: "Served", emoji: "🍽️", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", btn: "bg-zinc-500" }];
    const idx = allCols.findIndex((c) => c.id === currentStatus);
    const nextCol = allCols[idx + direction];
    if (!nextCol) return;

    setUpdatingId(orderId);
    
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextCol.id } : o));

    const result = await updateOrderStatus(orderId, nextCol.id);
    if (!result.success) {
      // Revert on failure
      setOrders(initialOrders);
    }
    setUpdatingId(null);
  };

  const handlePaymentConfirmed = async (orderId: string) => {
    setUpdatingId(orderId);
    const result = await completeOrder(orderId);
    if (result.success) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success("Order archived and payment confirmed");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to confirm payment");
      setOrders(initialOrders);
    }
    setUpdatingId(null);
  };

  const pendingCount = orders.filter(o => o.status === "PENDING").length;
  
  // Sort orders by createdAt (oldest first = highest priority)
  const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const servedOrders = sortedOrders.filter(o => o.status === "SERVED");

  return (
    <div className="p-8 h-full flex flex-col space-y-8 relative">
       <div className="fixed inset-0 bg-band-pattern opacity-30 pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-black text-4xl tracking-tighter text-white">
            <span className="font-irish">Command</span> <span className="font-italiano text-primary lowercase ml-1">center</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Live Orchestration Dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {pendingCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest animate-pulse"
              >
                <AlertCircle className="w-4 h-4" />
                {pendingCount} Priority Action Required
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Live</span>
          </div>
        </div>
      </div>

      {/* TOP: Active Orders Grid (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {ACTIVE_COLUMNS.map((col) => {
          const colOrders = sortedOrders.filter((o) => o.status === col.id);
          const colIdx = ACTIVE_COLUMNS.findIndex((c) => c.id === col.id);
          
          return (
            <div key={col.id} className="flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
              {/* Column Header */}
              <div className={`p-6 border-b border-white/5 flex items-center justify-between ${col.bg}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{col.emoji}</span>
                  <span className={`font-black uppercase tracking-widest text-xs ${col.color}`}>{col.title}</span>
                </div>
                <span className="bg-white/5 text-[10px] font-black px-3 py-1 rounded-full border border-white/10 text-zinc-400">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {colOrders.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Standby Mode</p>
                  </div>
                )}
                
                <AnimatePresence mode="popLayout">
                  {colOrders.map((order) => (
                    <motion.div
                      layout
                      key={order.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-[32px] p-6 hover:border-primary/40 transition-all shadow-xl"
                    >
                      {updatingId === order.id && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-[32px]">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] font-black text-primary tracking-widest">{order.orderNumber}</span>
                        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${order.orderType === "DINE_IN" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}>
                          {order.orderType === "DINE_IN" ? "Dine In" : "Pick Up"}
                        </div>
                      </div>

                      {order.orderType === "DINE_IN" ? (
                        <div className="mb-4">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Serving Station</p>
                          <div className="text-3xl font-heading font-black text-white">Table {order.tableNumber}</div>
                        </div>
                      ) : (
                        <div className="mb-4 bg-white/5 rounded-2xl p-4 space-y-1">
                           <div className="flex items-center gap-2 text-xs font-bold text-white">
                             <UserIcon className="w-3.5 h-3.5 text-zinc-500" /> {order.customerName}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                             <Phone className="w-3 h-3 text-zinc-700" /> {order.customerPhone}
                           </div>
                        </div>
                      )}

                      {/* Scrollable Items */}
                      <div className="mb-5 max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                         {order.items.map((item: any, idx: number) => (
                           <div key={idx} className="flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-zinc-300">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                             <span className="truncate">{item.menuItem?.name || "Unknown Item"}</span>
                             <span className="text-[10px] text-zinc-600 ml-auto flex-shrink-0">x{item.quantity}</span>
                           </div>
                         ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                          <Clock className="w-3.5 h-3.5" /> {getElapsed(order.createdAt)}
                        </div>
                        
                        <div className="flex gap-2">
                          {colIdx > 0 && (
                            <button 
                              onClick={() => handleMoveOrder(order.id, order.status, -1)}
                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-zinc-400 transition-all border border-white/5"
                            >
                              <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleMoveOrder(order.id, order.status, 1)}
                            className={`h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all shadow-lg ${col.btn} text-white`}
                          >
                            {colIdx === ACTIVE_COLUMNS.length - 1 ? (
                              <><CheckCircle2 className="w-3.5 h-3.5 text-white" /> Complete</>
                            ) : (
                              <><PlayCircle className="w-3.5 h-3.5 text-white" /> Start</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM: Served Orders (Awaiting Payment) */}
      {servedOrders.length > 0 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Section Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-500/10">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍽️</span>
              <span className="font-black uppercase tracking-widest text-xs text-zinc-400">Served - Awaiting Payment</span>
            </div>
            <span className="bg-white/5 text-[10px] font-black px-3 py-1 rounded-full border border-white/10 text-zinc-400">
              {servedOrders.length}
            </span>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 overflow-y-auto max-h-80 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {servedOrders.map((order) => (
                <motion.div
                  layout
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-[32px] p-6 hover:border-emerald-400/40 transition-all shadow-xl"
                >
                  {updatingId === order.id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-[32px]">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] font-black text-primary tracking-widest">{order.orderNumber}</span>
                    <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${order.orderType === "DINE_IN" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}>
                      {order.orderType === "DINE_IN" ? "Dine In" : "Pick Up"}
                    </div>
                  </div>

                  {order.orderType === "DINE_IN" ? (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Table</p>
                      <div className="text-3xl font-heading font-black text-white">#{order.tableNumber}</div>
                    </div>
                  ) : (
                    <div className="mb-4 bg-white/5 rounded-2xl p-4 space-y-1">
                       <div className="flex items-center gap-2 text-xs font-bold text-white">
                         <UserIcon className="w-3.5 h-3.5 text-zinc-500" /> {order.customerName}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                         <Phone className="w-3 h-3 text-zinc-700" /> {order.customerPhone}
                       </div>
                    </div>
                  )}

                  {/* Scrollable Items */}
                  <div className="mb-5 max-h-32 overflow-y-auto custom-scrollbar space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                     {order.items.map((item: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-zinc-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/40 group-hover:bg-emerald-400 transition-colors flex-shrink-0" />
                         <span className="truncate">{item.menuItem?.name || "Unknown Item"}</span>
                         <span className="text-[10px] text-zinc-600 ml-auto flex-shrink-0">x{item.quantity}</span>
                       </div>
                     ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      <Clock className="w-3.5 h-3.5" /> {getElapsed(order.createdAt)}
                    </div>
                    
                    <button 
                      onClick={() => handlePaymentConfirmed(order.id)}
                      className="h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all shadow-lg bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> PAID
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
