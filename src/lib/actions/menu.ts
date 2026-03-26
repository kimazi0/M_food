"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertMenuItem(data: {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}) {
  try {
    if (data.id) {
      await prisma.menuItem.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category ? { connect: { name: data.category } } : undefined,
          image: data.image,
          available: data.available,
        },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category ? { connect: { name: data.category } } : undefined,
          image: data.image,
          available: data.available,
        },
      });
    }
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Menu item upsert failed:", error);
    return { success: false };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await prisma.menuItem.delete({
      where: { id },
    });
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Menu item deletion failed:", error);
    return { success: false };
  }
}

export async function getVisibleMenuItems() {
  try {
    const items = await prisma.menuItem.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
    });
    return items;
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    return [];
  }
}
