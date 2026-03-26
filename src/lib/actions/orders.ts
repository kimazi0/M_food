"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Order status update failed:", error);
    return { success: false };
  }
}

export async function createOrder(data: {
  orderType: "DINE_IN" | "TAKEAWAY";
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  items: any[];
  total: number;
}) {
  try {
    const orderNumber = `MF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderType: data.orderType,
        tableNumber: data.tableNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        total: data.total,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            modifications: JSON.stringify(item.modifications),
            specialInstructions: item.specialInstructions || "",
          })),
        },
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    
    return { success: true, orderId: order.id, orderNumber };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "Failed to create order" };
  }
}
