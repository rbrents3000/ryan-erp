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
import {
  poHeaderSchema,
  type PoHeaderFormData,
} from "@/lib/validations/purchasing";
import { createPoOrder, updatePoOrder } from "./actions";
import type { PoHeader } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface PoOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poHeader?: PoHeader | null;
}

export function PoOrderForm({
  open,
  onOpenChange,
  poHeader,
}: PoOrderFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!poHeader;

  const form = useForm<PoHeaderFormData>({
    resolver: zodResolver(poHeaderSchema),
    defaultValues: {
      poNumber: poHeader?.poNumber ?? "",
      vendorId: poHeader?.vendorId ?? "",
      orderDate: poHeader?.orderDate ?? new Date().toISOString().slice(0, 10),
      expectedDate: poHeader?.expectedDate ?? "",
      currencyCode: poHeader?.currencyCode ?? "USD",
      notes: poHeader?.notes ?? "",
    },
  });

  async function onSubmit(data: PoHeaderFormData) {
    setError(null);
    const result = isEditing
      ? await updatePoOrder(poHeader!.id, data)
      : await createPoOrder(data);

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
            {isEditing ? "Edit Purchase Order" : "New Purchase Order"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poNumber">PO Number</Label>
            <Input
              id="poNumber"
              {...form.register("poNumber")}
              disabled={isEditing}
            />
            {form.formState.errors.poNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.poNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="vendorId">Vendor ID</Label>
            <Input id="vendorId" {...form.register("vendorId")} />
            {form.formState.errors.vendorId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.vendorId.message}
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
              <Label htmlFor="expectedDate">Expected Date</Label>
              <Input
                id="expectedDate"
                type="date"
                {...form.register("expectedDate")}
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
                  : "Create PO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
