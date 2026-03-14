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
import { Textarea } from "@/components/ui/textarea";
import {
  cashReceiptSchema,
  type CashReceiptFormData,
} from "@/lib/validations/sales";
import { createReceipt, updateReceipt } from "./actions";
import type { cashReceipts } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

type CashReceipt = typeof cashReceipts.$inferSelect;

interface ReceiptFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt?: CashReceipt | null;
}

export function ReceiptForm({ open, onOpenChange, receipt }: ReceiptFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!receipt;

  const form = useForm<CashReceiptFormData>({
    resolver: zodResolver(cashReceiptSchema),
    defaultValues: {
      customerId: receipt?.customerId ?? "",
      receiptDate: receipt?.receiptDate ?? "",
      paymentMethod: receipt?.paymentMethod ?? "check",
      referenceNumber: receipt?.referenceNumber ?? "",
      amount: receipt?.amount ?? "",
      currencyCode: receipt?.currencyCode ?? "USD",
      notes: receipt?.notes ?? "",
    },
  });

  async function onSubmit(data: CashReceiptFormData) {
    setError(null);
    const result = isEditing
      ? await updateReceipt(receipt!.id, data)
      : await createReceipt(data);

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
            {isEditing ? "Edit Receipt" : "New Receipt"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="receiptDate">Receipt Date</Label>
              <Input
                id="receiptDate"
                type="date"
                {...form.register("receiptDate")}
              />
              {form.formState.errors.receiptDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.receiptDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                {...form.register("paymentMethod")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="check">Check</option>
                <option value="ach">ACH</option>
                <option value="wire">Wire</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input id="referenceNumber" {...form.register("referenceNumber")} />
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
          <div className="space-y-2">
            <Label htmlFor="currencyCode">Currency</Label>
            <Input id="currencyCode" {...form.register("currencyCode")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Receipt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
