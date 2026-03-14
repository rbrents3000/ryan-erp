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
import { warehouseSchema, type WarehouseFormData } from "@/lib/validations/inventory";
import { createWarehouse, updateWarehouse } from "./actions";
import type { Warehouse } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface WarehouseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse | null;
}

export function WarehouseForm({ open, onOpenChange, warehouse }: WarehouseFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!warehouse;

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      warehouseCode: warehouse?.warehouseCode ?? "",
      name: warehouse?.name ?? "",
      address: warehouse?.address ?? "",
      isDefault: warehouse?.isDefault ?? false,
      status: warehouse?.status ?? "active",
    },
  });

  async function onSubmit(data: WarehouseFormData) {
    setError(null);
    const result = isEditing
      ? await updateWarehouse(warehouse!.id, data)
      : await createWarehouse(data);

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
          <DialogTitle>{isEditing ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseCode">Warehouse Code</Label>
              <Input
                id="warehouseCode"
                {...form.register("warehouseCode")}
                disabled={isEditing}
              />
              {form.formState.errors.warehouseCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.warehouseCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...form.register("isDefault")} className="size-4 rounded border-input" />
                <span className="text-sm">Default Warehouse</span>
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...form.register("status")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
