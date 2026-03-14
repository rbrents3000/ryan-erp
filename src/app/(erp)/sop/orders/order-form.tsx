"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orderSchema, type OrderFormData } from "@/lib/validations/sales";
import { createOrder, updateOrder } from "./actions";
import type { Order } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
}

export function OrderForm({ open, onOpenChange, order }: OrderFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!order;

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: order?.orderNumber ?? "",
      customerId: order?.customerId ?? "",
      orderDate: order?.orderDate ?? new Date().toISOString().slice(0, 10),
      requiredDate: order?.requiredDate ?? "",
      currencyCode: order?.currencyCode ?? "USD",
      notes: order?.notes ?? "",
    },
  });

  async function onSubmit(data: OrderFormData) {
    setError(null);
    const result = isEditing
      ? await updateOrder(order!.id, data)
      : await createOrder(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Sales Order" : "New Sales Order"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            <Input
              id="orderNumber"
              {...form.register("orderNumber")}
              disabled={isEditing}
            />
            {form.formState.errors.orderNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.orderNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <Input id="customerId" {...form.register("customerId")} />
            {form.formState.errors.customerId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.customerId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <Input
                id="orderDate"
                type="date"
                {...form.register("orderDate")}
              />
              {form.formState.errors.orderDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.orderDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredDate">Required Date</Label>
              <Input
                id="requiredDate"
                type="date"
                {...form.register("requiredDate")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencyCode">Currency</Label>
            <Input id="currencyCode" {...form.register("currencyCode")} />
            {form.formState.errors.currencyCode && (
              <p className="text-xs text-destructive">
                {form.formState.errors.currencyCode.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...form.register("notes")} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
