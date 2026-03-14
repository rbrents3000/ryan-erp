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
import { createDespatchNote, updateDespatchNote } from "./actions";
import type { despatchNotes } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { z } from "zod";

type DespatchNote = typeof despatchNotes.$inferSelect;

const despatchSchema = z.object({
  despatchNumber: z.string().min(1, "Despatch number is required"),
  orderId: z.string().uuid("Valid Order ID is required"),
  customerId: z.string().uuid("Valid Customer ID is required"),
  despatchDate: z.string().min(1, "Despatch date is required"),
  warehouseId: z.string().uuid("Valid Warehouse ID is required"),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

type DespatchFormData = z.infer<typeof despatchSchema>;

interface DespatchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: DespatchNote | null;
  onSuccess?: () => void;
}

export function DespatchForm({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: DespatchFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editing;

  const form = useForm<DespatchFormData>({
    resolver: zodResolver(despatchSchema),
    defaultValues: {
      despatchNumber: editing?.despatchNumber ?? "",
      orderId: editing?.orderId ?? "",
      customerId: editing?.customerId ?? "",
      despatchDate: editing?.despatchDate ?? "",
      warehouseId: editing?.warehouseId ?? "",
      carrier: editing?.carrier ?? "",
      trackingNumber: editing?.trackingNumber ?? "",
      notes: editing?.notes ?? "",
    },
  });

  async function onSubmit(data: DespatchFormData) {
    setError(null);
    const result = isEditing
      ? await updateDespatchNote(editing!.id, data)
      : await createDespatchNote(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    onSuccess?.();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Despatch Note" : "New Despatch Note"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="despatchNumber">Despatch #</Label>
            <Input
              id="despatchNumber"
              {...form.register("despatchNumber")}
            />
            {form.formState.errors.despatchNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.despatchNumber.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                {...form.register("orderId")}
                placeholder="UUID"
              />
              {form.formState.errors.orderId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.orderId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                {...form.register("customerId")}
                placeholder="UUID"
              />
              {form.formState.errors.customerId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.customerId.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="despatchDate">Despatch Date</Label>
              <Input
                id="despatchDate"
                type="date"
                {...form.register("despatchDate")}
              />
              {form.formState.errors.despatchDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.despatchDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouseId">Warehouse ID</Label>
              <Input
                id="warehouseId"
                {...form.register("warehouseId")}
                placeholder="UUID"
              />
              {form.formState.errors.warehouseId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.warehouseId.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input id="carrier" {...form.register("carrier")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking #</Label>
              <Input
                id="trackingNumber"
                {...form.register("trackingNumber")}
              />
            </div>
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
                  : "Create Despatch Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
