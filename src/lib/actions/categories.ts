"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string) {
  try {
    await prisma.category.create({
      data: { name },
    });
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    console.error("Category creation failed:", error);
    return { success: false };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    console.error("Category deletion failed:", error);
    return { success: false };
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
