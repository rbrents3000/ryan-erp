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
  arInvoiceSchema,
  type ArInvoiceFormData,
} from "@/lib/validations/sales";
import { createArInvoice, updateArInvoice } from "./actions";
import type { ArInvoice } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: ArInvoice | null;
}

export function InvoiceForm({ open, onOpenChange, invoice }: InvoiceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!invoice;

  const form = useForm<ArInvoiceFormData>({
    resolver: zodResolver(arInvoiceSchema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber ?? "",
      customerId: invoice?.customerId ?? "",
      invoiceDate: invoice?.invoiceDate ?? "",
      dueDate: invoice?.dueDate ?? "",
      currencyCode: invoice?.currencyCode ?? "USD",
      termsCode: invoice?.termsCode ?? "",
      notes: invoice?.notes ?? "",
    },
  });

  async function onSubmit(data: ArInvoiceFormData) {
    setError(null);
    const result = isEditing
      ? await updateArInvoice(invoice!.id, data)
      : await createArInvoice(data);

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
            {isEditing ? "Edit Invoice" : "New Invoice"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              {...form.register("invoiceNumber")}
              disabled={isEditing}
            />
            {form.formState.errors.invoiceNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.invoiceNumber.message}
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
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                {...form.register("invoiceDate")}
              />
              {form.formState.errors.invoiceDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.invoiceDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...form.register("dueDate")}
              />
              {form.formState.errors.dueDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currencyCode">Currency</Label>
              <Input
                id="currencyCode"
                {...form.register("currencyCode")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termsCode">Terms Code</Label>
              <Input id="termsCode" {...form.register("termsCode")} />
            </div>
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
                : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
