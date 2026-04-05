"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/lib/schemas/checkout";
import { createOrder } from "@/lib/actions/orders";
import { useCart } from "@/store/useCart";
import { useTable } from "@/store/useTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { tableNumber } = useTable();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const defaultOrderType = tableNumber ? "DINE_IN" : "TAKEAWAY";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError: setFormError,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: defaultOrderType as any,
      tableNumber: tableNumber || undefined,
      customerName: "",
      customerPhone: "",
    },
  });

  const orderType = watch("orderType");

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createOrder({
        orderType: data.orderType,
        tableNumber: data.orderType === "DINE_IN" ? data.tableNumber : undefined,
        customerName: data.orderType === "TAKEAWAY" ? data.customerName : undefined,
        customerPhone: data.orderType === "TAKEAWAY" ? data.customerPhone : undefined,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          modifications: item.modifications || [],
          specialInstructions: item.specialInstructions || "",
        })),
        total: getTotal(),
      });

      if (!result.success) {
        toast.error(result.error || "Failed to create order");
        return;
      }

      // Success
      clearCart();
      toast.success(`Order placed! Number: ${result.orderNumber}`);
      onClose();
      router.push(`/order-confirmation/${result.orderNumber}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-zinc-950 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white uppercase">
            {step === 1 ? "Select Order Type" : "Complete Order"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Order Type Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <RadioGroup
                value={orderType}
                onValueChange={(value) => {
                  setValue("orderType", value as any);
                }}
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg border border-white/10 hover:border-primary/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="DINE_IN" id="dine-in" />
                  <Label htmlFor="dine-in" className="flex-1 cursor-pointer">
                    <div className="font-bold text-white">Dine In</div>
                    <div className="text-xs text-zinc-400">Eat at our restaurant</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 rounded-lg border border-white/10 hover:border-primary/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="TAKEAWAY" id="takeaway" />
                  <Label htmlFor="takeaway" className="flex-1 cursor-pointer">
                    <div className="font-bold text-white">Takeaway</div>
                    <div className="text-xs text-zinc-400">Pick up your order</div>
                  </Label>
                </div>
              </RadioGroup>

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-primary text-secondary font-black uppercase"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Order Details */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-zinc-400 uppercase">Items</span>
                  <span className="text-sm font-bold text-white">{items.length}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-xs text-zinc-400 uppercase">Total</span>
                  <span className="text-lg font-black text-primary">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Dine In Fields */}
              {orderType === "DINE_IN" && (
                <div className="space-y-2">
                  <Label htmlFor="tableNumber" className="text-white text-sm font-bold uppercase">
                    Table Number
                  </Label>
                  <Input
                    id="tableNumber"
                    type="number"
                    placeholder="Enter table number"
                    disabled={!!tableNumber}
                    {...register("tableNumber", { valueAsNumber: true })}
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600"
                  />
                  {errors.tableNumber && (
                    <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.tableNumber.message}
                    </div>
                  )}
                  {tableNumber && (
                    <p className="text-xs text-zinc-400 italic">QR code table: {tableNumber}</p>
                  )}
                </div>
              )}

              {/* Takeaway Fields */}
              {orderType === "TAKEAWAY" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-white text-sm font-bold uppercase">
                      Your Name
                    </Label>
                    <Input
                      id="customerName"
                      placeholder="Enter your name"
                      {...register("customerName")}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600"
                    />
                    {errors.customerName && (
                      <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.customerName.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-white text-sm font-bold uppercase">
                      Phone Number
                    </Label>
                    <Input
                      id="customerPhone"
                      placeholder="Enter your phone number"
                      {...register("customerPhone")}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600"
                    />
                    {errors.customerPhone && (
                      <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.customerPhone.message}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 text-white border-white/10"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="flex-1 bg-primary text-secondary font-black uppercase"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
