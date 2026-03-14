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
import { createGoodsReceived, updateGoodsReceived } from "./actions";
import type { goodsReceived } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { z } from "zod";

type GoodsReceivedNote = typeof goodsReceived.$inferSelect;

const goodsReceivedSchema = z.object({
  grnNumber: z.string().min(1, "GRN number is required"),
  poHeaderId: z.string().uuid("Valid PO ID is required"),
  vendorId: z.string().uuid("Valid Vendor ID is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  warehouseId: z.string().uuid("Valid Warehouse ID is required"),
  notes: z.string().optional(),
});

type GoodsReceivedFormData = z.infer<typeof goodsReceivedSchema>;

interface GoodsReceivedFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: GoodsReceivedNote | null;
  onSuccess?: () => void;
}

export function GoodsReceivedForm({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: GoodsReceivedFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editing;

  const form = useForm<GoodsReceivedFormData>({
    resolver: zodResolver(goodsReceivedSchema),
    defaultValues: {
      grnNumber: editing?.grnNumber ?? "",
      poHeaderId: editing?.poHeaderId ?? "",
      vendorId: editing?.vendorId ?? "",
      receivedDate: editing?.receivedDate ?? "",
      warehouseId: editing?.warehouseId ?? "",
      notes: editing?.notes ?? "",
    },
  });

  async function onSubmit(data: GoodsReceivedFormData) {
    setError(null);
    const result = isEditing
      ? await updateGoodsReceived(editing!.id, data)
      : await createGoodsReceived(data);

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
            {isEditing ? "Edit Goods Received" : "New Goods Received"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grnNumber">GRN #</Label>
            <Input id="grnNumber" {...form.register("grnNumber")} />
            {form.formState.errors.grnNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.grnNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="poHeaderId">PO Header ID</Label>
            <Input
              id="poHeaderId"
              {...form.register("poHeaderId")}
              placeholder="UUID"
            />
            {form.formState.errors.poHeaderId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.poHeaderId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="vendorId">Vendor ID</Label>
            <Input
              id="vendorId"
              {...form.register("vendorId")}
              placeholder="UUID"
            />
            {form.formState.errors.vendorId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.vendorId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Received Date</Label>
              <Input
                id="receivedDate"
                type="date"
                {...form.register("receivedDate")}
              />
              {form.formState.errors.receivedDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.receivedDate.message}
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
                  : "Create GRN"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
