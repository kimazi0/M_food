"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, User as UserIcon, AlertCircle } from "lucide-react";

const INITIAL_ORDERS = [
  { id: "1", orderNumber: "ORD-001", tableNumber: 5, status: "PENDING", type: "DINE_IN", items: ["Spicy Volcano Burger", "Truffle Fries"], time: new Date() },
  { id: "2", orderNumber: "ORD-002", customerName: "John Doe", customerPhone: "(555) 123-4567", status: "PREPARING", type: "TAKEAWAY", items: ["Grilled Salmon", "Iced Matcha Latte"], time: new Date(Date.now() - 10 * 60000) },
  { id: "3", orderNumber: "ORD-003", tableNumber: 2, status: "READY", type: "DINE_IN", items: ["Classic Cheeseburger", "Sunset Lemonade", "Crème Brûlée"], time: new Date(Date.now() - 25 * 60000) },
  { id: "4", orderNumber: "ORD-004", tableNumber: 8, status: "PREPARING", type: "DINE_IN", items: ["Molten Lava Cake", "Iced Matcha Latte"], time: new Date(Date.now() - 5 * 60000) },
];

const COLUMNS = [
  { id: "PENDING", title: "New Orders", emoji: "🆕", ring: "ring-blue-500/30", badge: "bg-blue-500/15 text-blue-400 border-blue-500/20", btn: "bg-blue-500 text-white" },
  { id: "PREPARING", title: "Preparing", emoji: "👨‍🍳", ring: "ring-orange-500/30", badge: "bg-orange-500/15 text-orange-400 border-orange-500/20", btn: "bg-orange-500 text-white" },
  { id: "READY", title: "Ready to Serve", emoji: "✅", ring: "ring-green-500/30", badge: "bg-green-500/15 text-green-400 border-green-500/20", btn: "bg-green-500 text-white" },
  { id: "COMPLETED", title: "Completed", emoji: "🏁", ring: "ring-zinc-500/30", badge: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20", btn: "bg-zinc-500 text-white" },
];

function getElapsed(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const moveOrder = (orderId: string, direction: 1 | -1) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = COLUMNS.findIndex((c) => c.id === o.status);
        const next = COLUMNS[idx + direction];
        return next ? { ...o, status: next.id } : o;
      })
    );
  };

  const totalPending = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Kitchen Display</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Live order management board</p>
        </div>
        <div className="flex items-center gap-3">
          {totalPending > 0 && (
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full px-4 py-1.5 text-sm font-semibold">
              <AlertCircle className="w-4 h-4" />
              {totalPending} new order{totalPending > 1 ? "s" : ""} pending!
            </div>
          )}
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-4 py-1.5 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {COLUMNS.map((col) => {
          const count = orders.filter((o) => o.status === col.id).length;
          return (
            <div key={col.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold">{count}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{col.title}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 min-h-[400px]">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.id);
          const colIdx = COLUMNS.findIndex((c) => c.id === col.id);
          return (
            <div key={col.id} className="flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              {/* Column header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{col.emoji}</span>
                  <span className="font-bold text-sm">{col.title}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.badge}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colOrders.length === 0 && (
                  <div className="text-center py-8 text-zinc-600 text-sm">No orders here</div>
                )}
                {colOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all ring-1 ring-transparent hover:${col.ring}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-primary">{order.orderNumber}</span>
                      <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
                        {order.type === "DINE_IN" ? "🍽️" : "🛍️"} {order.type === "DINE_IN" ? "Dine In" : "Takeaway"}
                      </span>
                    </div>

                    {order.type === "DINE_IN" ? (
                      <div className="text-3xl font-extrabold text-center py-3 bg-zinc-900 rounded-xl mb-3">
                        Table {order.tableNumber}
                      </div>
                    ) : (
                      <div className="bg-zinc-900 rounded-xl p-3 mb-3 space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-zinc-300"><UserIcon className="w-4 h-4 text-zinc-500" />{order.customerName}</div>
                        <div className="flex items-center gap-2 text-zinc-300"><Phone className="w-4 h-4 text-zinc-500" />{order.customerPhone}</div>
                      </div>
                    )}

                    {/* Items snippet */}
                    <div className="text-xs text-zinc-500 space-y-0.5 mb-3">
                      {order.items.map((it, i) => <div key={i}>&bull; {it}</div>)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-600 mb-3">
                      <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{getElapsed(order.time)}</div>
                    </div>

                    {/* Move buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {colIdx > 0 && (
                        <button onClick={() => moveOrder(order.id, -1)} className="text-xs py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                          ← Back
                        </button>
                      )}
                      {colIdx < COLUMNS.length - 1 && (
                        <button
                          onClick={() => moveOrder(order.id, 1)}
                          className={`text-xs py-1.5 px-2 rounded-lg font-semibold transition-colors ${col.btn} ${colIdx === 0 ? "col-span-2" : ""}`}
                        >
                          {colIdx === COLUMNS.length - 2 ? "Complete ✓" : "Forward →"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
