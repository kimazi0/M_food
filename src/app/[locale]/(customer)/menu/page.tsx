"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MenuGallery } from "@/components/menu/MenuGallery";
import { MotionViewport } from "@/components/ui/MotionViewport";
import { useTable } from "@/store/useTable";
import { UtensilsCrossed } from "lucide-react";
import { getVisibleMenuItems } from "@/lib/actions/menu";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const { setTableNumber, tableNumber } = useTable();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract table number from URL query parameter
    const tableParam = searchParams.get("table");
    if (tableParam) {
      const tableNum = parseInt(tableParam, 10);
      if (!isNaN(tableNum) && tableNum > 0) {
        setTableNumber(tableNum);
      }
    }
  }, [searchParams, setTableNumber]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await getVisibleMenuItems();
        setItems(data as any);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Table Info Banner */}
        {tableNumber && (
          <div className="mb-8 p-4 rounded-2xl bg-primary/10 border border-primary/30">
            <p className="text-center text-sm font-black text-primary uppercase tracking-widest">
              🍽️ Table {tableNumber} - Dine In
            </p>
          </div>
        )}

        {/* Header */}
        <MotionViewport className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-white mb-4">
            Our <span className="text-primary italic">Menu</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Discover our curated selection of premium dishes, crafted with the finest ingredients and passion for flavour.
          </p>
        </MotionViewport>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MenuGallery items={items as any} />
        )}
      </div>
    </div>
  );
}
