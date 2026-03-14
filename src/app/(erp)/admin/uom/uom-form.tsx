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
import { uomSchema, type UomFormData } from "@/lib/validations/system";
import { createUom, updateUom } from "./actions";
import type { UnitOfMeasure } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface UomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uom?: UnitOfMeasure | null;
}

export function UomForm({ open, onOpenChange, uom }: UomFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!uom;

  const form = useForm<UomFormData>({
    resolver: zodResolver(uomSchema),
    defaultValues: {
      code: uom?.code ?? "",
      name: uom?.name ?? "",
      uomType: uom?.uomType ?? "unit",
    },
  });

  async function onSubmit(data: UomFormData) {
    setError(null);
    const result = isEditing
      ? await updateUom(uom!.id, data)
      : await createUom(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Unit of Measure" : "Add Unit of Measure"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" {...form.register("code")} disabled={isEditing} />
              {form.formState.errors.code && (
                <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="uomType">Type</Label>
            <Input id="uomType" {...form.register("uomType")} placeholder="unit, weight, volume, etc." />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create UOM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
