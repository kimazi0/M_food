import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { menuItem: true } } }
  });

  return (
    <div className="p-8 h-full flex flex-col space-y-8 relative">
      <div className="fixed inset-0 bg-band-pattern opacity-30 pointer-events-none" />
      <div className="relative z-10">
        <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-white">
          Order <span className="text-primary italic">Atelier Log</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Archives of Gastronomic Expeditions</p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
        {orders.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center opacity-20 grayscale">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Chronicles Empty</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-black/40 border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Timeline</th>
                <th className="px-8 py-5">Guest / Origin</th>
                <th className="px-8 py-5">Net Value</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 font-mono font-bold text-primary group-hover:text-white transition-colors">
                    {order.orderNumber}
                  </td>
                  <td className="px-8 py-5 text-zinc-400 tabular-nums font-bold text-xs uppercase">
                    {order.createdAt.toLocaleDateString()} <span className="text-zinc-600 opacity-50">@</span> {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-8 py-5 font-bold text-white">
                    {order.orderType === "DINE_IN" ? (
                      <span className="flex items-center gap-2">
                        <span className="text-blue-400 opacity-50">🍽️</span> Table {order.tableNumber}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-orange-400 opacity-50">🛍️</span> {order.customerName}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 tabular-nums font-mono font-black text-white text-base">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:border-primary/20 group-hover:text-primary transition-all">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
