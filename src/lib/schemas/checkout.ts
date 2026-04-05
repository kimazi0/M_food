import { z } from "zod";

export const checkoutSchema = z.discriminatedUnion("orderType", [
  z.object({
    orderType: z.literal("DINE_IN"),
    tableNumber: z.number().int().positive("Table number must be a positive number"),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
  }),
  z.object({
    orderType: z.literal("TAKEAWAY"),
    tableNumber: z.number().optional(),
    customerName: z.string().min(2, "Name must be at least 2 characters"),
    customerPhone: z.string().regex(/^\d{10,}/, "Phone must be at least 10 digits"),
  }),
]);

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
