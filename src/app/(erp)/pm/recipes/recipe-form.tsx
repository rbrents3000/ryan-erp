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
import { recipeSchema, type RecipeFormData } from "@/lib/validations/production";
import { createRecipe, updateRecipe } from "./actions";
import type { Recipe } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface RecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe | null;
}

export function RecipeForm({ open, onOpenChange, recipe }: RecipeFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!recipe;

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      recipeCode: recipe?.recipeCode ?? "",
      name: recipe?.name ?? "",
      description: recipe?.description ?? "",
      outputProductId: recipe?.outputProductId ?? "",
      outputQuantity: recipe?.outputQuantity ?? "1",
      outputUom: recipe?.outputUom ?? "EA",
      status: recipe?.status ?? "active",
    },
  });

  async function onSubmit(data: RecipeFormData) {
    setError(null);
    const result = isEditing
      ? await updateRecipe(recipe!.id, data)
      : await createRecipe(data);

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
          <DialogTitle>{isEditing ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipeCode">Recipe Code</Label>
              <Input
                id="recipeCode"
                {...form.register("recipeCode")}
                disabled={isEditing}
              />
              {form.formState.errors.recipeCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.recipeCode.message}
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
          <div className="space-y-2">
            <Label htmlFor="outputProductId">Output Product ID</Label>
            <Input id="outputProductId" {...form.register("outputProductId")} />
            {form.formState.errors.outputProductId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.outputProductId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="outputQuantity">Output Quantity</Label>
              <Input id="outputQuantity" {...form.register("outputQuantity")} />
              {form.formState.errors.outputQuantity && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.outputQuantity.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="outputUom">Output UoM</Label>
              <Input id="outputUom" {...form.register("outputUom")} />
              {form.formState.errors.outputUom && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.outputUom.message}
                </p>
              )}
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
            </select>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Recipe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
