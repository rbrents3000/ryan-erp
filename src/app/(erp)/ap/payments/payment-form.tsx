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
  paymentSchema,
  type PaymentFormData,
} from "@/lib/validations/purchasing";
import { createPayment, updatePayment } from "./actions";
import type { payments } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

type Payment = typeof payments.$inferSelect;

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
}

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

export function PaymentForm({
  open,
  onOpenChange,
  payment,
}: PaymentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!payment;

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      vendorId: payment?.vendorId ?? "",
      paymentDate: payment?.paymentDate ?? "",
      paymentMethod: payment?.paymentMethod ?? "check",
      checkNumber: payment?.checkNumber ?? "",
      amount: payment?.amount ?? "",
      currencyCode: payment?.currencyCode ?? "USD",
      notes: payment?.notes ?? "",
    },
  });

  async function onSubmit(data: PaymentFormData) {
    setError(null);
    const result = isEditing
      ? await updatePayment(payment!.id, data)
      : await createPayment(data);

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
            {isEditing ? "Edit Payment" : "New Payment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                {...form.register("paymentDate")}
              />
              {form.formState.errors.paymentDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.paymentDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                {...form.register("paymentMethod")}
                className={selectClassName}
              >
                <option value="check">Check</option>
                <option value="ach">ACH</option>
                <option value="wire">Wire</option>
                <option value="cash">Cash</option>
              </select>
              {form.formState.errors.paymentMethod && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkNumber">Check Number</Label>
            <Input id="checkNumber" {...form.register("checkNumber")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...form.register("amount")}
            />
            {form.formState.errors.amount && (
              <p className="text-xs text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currencyCode">Currency</Label>
              <Input
                id="currencyCode"
                {...form.register("currencyCode")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...form.register("notes")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
