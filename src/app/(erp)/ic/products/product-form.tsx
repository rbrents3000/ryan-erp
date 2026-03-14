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
import { productSchema, type ProductFormData } from "@/lib/validations/inventory";
import { createProduct, updateProduct } from "./actions";
import type { Product } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      partNumber: product?.partNumber ?? "",
      name: product?.name ?? "",
      description: product?.description ?? "",
      productType: product?.productType ?? "stock",
      uomCode: product?.uomCode ?? "EA",
      productGroup: product?.productGroup ?? "",
      standardCost: product?.standardCost ?? "0",
      listPrice: product?.listPrice ?? "0",
      weight: product?.weight ?? "",
      weightUom: product?.weightUom ?? "",
      status: product?.status ?? "active",
    },
  });

  async function onSubmit(data: ProductFormData) {
    setError(null);
    const result = isEditing
      ? await updateProduct(product!.id, data)
      : await createProduct(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partNumber">Part Number</Label>
              <Input
                id="partNumber"
                {...form.register("partNumber")}
                disabled={isEditing}
              />
              {form.formState.errors.partNumber && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.partNumber.message}
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <select
                id="productType"
                {...form.register("productType")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="stock">Stock</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="uomCode">Unit of Measure</Label>
              <Input id="uomCode" {...form.register("uomCode")} />
              {form.formState.errors.uomCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.uomCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="productGroup">Product Group</Label>
              <Input id="productGroup" {...form.register("productGroup")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standardCost">Standard Cost</Label>
              <Input
                id="standardCost"
                type="number"
                step="0.01"
                {...form.register("standardCost")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listPrice">List Price</Label>
              <Input
                id="listPrice"
                type="number"
                step="0.01"
                {...form.register("listPrice")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.0001"
                {...form.register("weight")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightUom">Weight UoM</Label>
              <Input id="weightUom" {...form.register("weightUom")} />
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
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
