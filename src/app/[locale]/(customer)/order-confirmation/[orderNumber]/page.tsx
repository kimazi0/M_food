"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MotionViewport } from "@/components/ui/MotionViewport";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { CheckCircle2, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface Order {
  id: string;
  orderNumber: string;
  orderType: string;
  tableNumber?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  total: number;
  status: string;
  items: Array<{
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    modifications: string;
    specialInstructions: string | null;
  }>;
  createdAt: Date;
}

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
}) {
  const { locale, orderNumber } = React.use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { getOrderByNumber } = await import("@/lib/actions/orders");
        const result = await getOrderByNumber(orderNumber);
        
        if (result.success && result.order) {
          setOrder(result.order as any);
        } else {
          setError(result.error || "Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const downloadQR = () => {
    const element = document.getElementById("qr-code");
    if (element) {
      const link = document.createElement("a");
      link.href = (element.querySelector("canvas") as HTMLCanvasElement)?.toDataURL() || "";
      link.download = `order-${orderNumber}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <MotionViewport className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter text-white mb-3">
            Order Not Found
          </h1>
          <p className="text-zinc-400 mb-8">{error || "We couldn't find your order details."}</p>
          <Link href={`/${locale}/menu`}>
            <Button className="bg-primary text-secondary font-black uppercase">
              Back to Menu
            </Button>
          </Link>
        </MotionViewport>
      </div>
    );
  }

  const nextSteps =
    order.orderType === "DINE_IN"
      ? `Your order will be prepared and served at table ${order.tableNumber}`
      : `Your order will be ready for pickup. We'll notify you when it's ready`;

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <MotionViewport className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-green-900/20 flex items-center justify-center mx-auto mb-8 border border-green-500/30">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-primary font-black mb-2">Order #{order.orderNumber}</p>
          <p className="text-zinc-400 mb-8">{nextSteps}</p>
        </MotionViewport>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Order Details */}
          <MotionViewport className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
            <h2 className="font-heading text-xl font-bold text-white uppercase mb-6">
              Order Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400 uppercase">Order Type</span>
                <span className="text-sm font-bold text-white">
                  {order.orderType === "DINE_IN" ? "Dine In" : "Takeaway"}
                </span>
              </div>
              {order.orderType === "DINE_IN" && order.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400 uppercase">Table</span>
                  <span className="text-sm font-bold text-white">#{order.tableNumber}</span>
                </div>
              )}
              {order.orderType === "TAKEAWAY" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400 uppercase">Name</span>
                    <span className="text-sm font-bold text-white">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400 uppercase">Phone</span>
                    <span className="text-sm font-bold text-white">{order.customerPhone}</span>
                  </div>
                </>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between">
                <span className="text-sm font-bold text-white uppercase">Total Amount</span>
                <span className="text-2xl font-black text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </MotionViewport>

          {/* QR Code */}
          <MotionViewport className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center">
            <h2 className="font-heading text-lg font-bold text-white uppercase mb-6 text-center">
              Order QR Code
            </h2>
            <div id="qr-code" className="mb-6">
              <QRCodeCanvas
                value={order.orderNumber}
                size={200}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-zinc-400 text-center mb-4">
              Share this code with kitchen staff
            </p>
            <Button
              onClick={downloadQR}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 text-xs font-bold"
            >
              <Download className="w-3 h-3 mr-2" />
              Download QR
            </Button>
          </MotionViewport>
        </div>

        {/* Items List */}
        <MotionViewport className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 mb-12">
          <h2 className="font-heading text-xl font-bold text-white uppercase mb-6">
            Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => {
              const mods = JSON.parse(item.modifications || "[]");
              return (
                <div key={item.id} className="flex justify-between pb-4 border-b border-white/5 last:border-b-0">
                  <div>
                    <p className="text-white font-bold">
                      {item.quantity}x {item.name || `Item #${item.menuItemId.slice(0, 8)}`}
                    </p>
                    {mods.length > 0 && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Mods: {mods.join(", ")}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </MotionViewport>

        {/* Action Buttons */}
        <MotionViewport className="flex flex-col sm:flex-row gap-4">
          <Link href={`/${locale}/menu`} className="flex-1">
            <Button className="w-full bg-primary text-secondary font-black uppercase rounded-2xl h-14">
              Back to Menu
            </Button>
          </Link>
        </MotionViewport>
      </div>
    </div>
  );
}
