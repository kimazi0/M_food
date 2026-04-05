"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/schemas/checkout";

function generateOrderNumber(): string {
  // Generate a more robust order number: MF-XXXXXX where X is alphanumeric
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "MF-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
    // Validate input using Zod schema
    const validationData = {
      orderType: data.orderType,
      tableNumber: data.orderType === "DINE_IN" ? data.tableNumber : undefined,
      customerName: data.orderType === "TAKEAWAY" ? data.customerName : undefined,
      customerPhone: data.orderType === "TAKEAWAY" ? data.customerPhone : undefined,
    };

    const validation = checkoutSchema.safeParse(validationData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      const fieldError = errors.fieldErrors ? Object.values(errors.fieldErrors)[0]?.[0] : errors.formErrors[0];
      return { success: false, error: fieldError || "Invalid order details" };
    }

    // Validate items array is not empty
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // Validate each menu item exists and get current prices for validation
    const itemIds = data.items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    if (menuItems.length !== data.items.length) {
      const foundIds = new Set(menuItems.map((m: any) => m.id));
      const missingId = itemIds.find((id: any) => !foundIds.has(id));
      return { success: false, error: `Menu item not found` };
    }

    // Validate prices haven't changed dramatically (prevent tampering)
    const priceMap = new Map(menuItems.map((m: any) => [m.id, m.price]));
    for (const item of data.items) {
      const currentPrice = priceMap.get(item.menuItemId);
      if (!currentPrice) {
        return { success: false, error: "Invalid menu item" };
      }
      // Allow small price differences due to modifications, but flag large changes
      if (Math.abs(currentPrice - item.menuItemId) > 100) {
        return { success: false, error: "Price mismatch. Please refresh and try again." };
      }
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderType: data.orderType,
        tableNumber: data.orderType === "DINE_IN" ? data.tableNumber : null,
        customerName: data.orderType === "TAKEAWAY" ? data.customerName : null,
        customerPhone: data.orderType === "TAKEAWAY" ? data.customerPhone : null,
        total: data.total,
        status: "PENDING",
        items: {
          create: data.items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            modifications: JSON.stringify(item.modifications || []),
            specialInstructions: item.specialInstructions || null,
          })),
        },
      },
      include: { items: true },
    });

    // Revalidate cache
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    revalidatePath("/[locale]/(customer)/menu");
    
    return { success: true, orderId: order.id, orderNumber };
  } catch (error) {
    console.error("Order creation failed:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return { success: false, error: "Order number conflict. Please try again." };
      }
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Failed to create order. Please try again." };
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Transform order for client consumption
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      orderType: order.orderType,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item: any) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        modifications: item.modifications,
        specialInstructions: item.specialInstructions,
      })),
    };

    return { success: true, order: transformedOrder };
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return { success: false, error: "Failed to load order details" };
  }
}

export async function completeOrder(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");

    return { success: true, message: "Order marked as paid and archived" };
  } catch (error) {
    console.error("Failed to complete order:", error);
    return { success: false, error: "Failed to complete order" };
  }
}
