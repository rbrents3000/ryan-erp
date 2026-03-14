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
import { assetSchema, type AssetFormData } from "@/lib/validations/fixed-assets";
import { createAsset, updateAsset } from "./actions";
import type { Asset } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Asset | null;
  onSuccess?: () => void;
}

export function AssetForm({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: AssetFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editing;

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      assetNumber: editing?.assetNumber ?? "",
      name: editing?.name ?? "",
      description: editing?.description ?? "",
      category: editing?.category ?? "",
      location: editing?.location ?? "",
      acquisitionDate: editing?.acquisitionDate ?? "",
      acquisitionCost: editing?.acquisitionCost ?? "",
      salvageValue: editing?.salvageValue ?? "0",
      usefulLifeMonths: editing?.usefulLifeMonths?.toString() ?? "60",
      depreciationMethod: editing?.depreciationMethod ?? "straight_line",
      glAccountId: editing?.glAccountId ?? "",
      depreciationAccountId: editing?.depreciationAccountId ?? "",
      status: editing?.status ?? "active",
    },
  });

  async function onSubmit(data: AssetFormData) {
    setError(null);
    const result = isEditing
      ? await updateAsset(editing!.id, data)
      : await createAsset(data);

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Asset" : "New Asset"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetNumber">Asset #</Label>
              <Input
                id="assetNumber"
                {...form.register("assetNumber")}
                disabled={isEditing}
              />
              {form.formState.errors.assetNumber && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.assetNumber.message}
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
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...form.register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...form.register("category")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Acquisition Date</Label>
              <Input
                id="acquisitionDate"
                type="date"
                {...form.register("acquisitionDate")}
              />
              {form.formState.errors.acquisitionDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.acquisitionDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
              <Input
                id="acquisitionCost"
                {...form.register("acquisitionCost")}
              />
              {form.formState.errors.acquisitionCost && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.acquisitionCost.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salvageValue">Salvage Value</Label>
              <Input id="salvageValue" {...form.register("salvageValue")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usefulLifeMonths">Useful Life (Months)</Label>
              <Input
                id="usefulLifeMonths"
                {...form.register("usefulLifeMonths")}
              />
              {form.formState.errors.usefulLifeMonths && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.usefulLifeMonths.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="depreciationMethod">Depreciation Method</Label>
              <select
                id="depreciationMethod"
                {...form.register("depreciationMethod")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="straight_line">Straight Line</option>
                <option value="declining_balance">Declining Balance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="glAccountId">GL Account ID</Label>
              <Input
                id="glAccountId"
                {...form.register("glAccountId")}
                placeholder="Optional UUID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depreciationAccountId">
                Depreciation Account ID
              </Label>
              <Input
                id="depreciationAccountId"
                {...form.register("depreciationAccountId")}
                placeholder="Optional UUID"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...form.register("status")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              <option value="active">Active</option>
              <option value="disposed">Disposed</option>
              <option value="fully_depreciated">Fully Depreciated</option>
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
