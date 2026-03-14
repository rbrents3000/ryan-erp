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
import { currencySchema, type CurrencyFormData } from "@/lib/validations/system";
import { createCurrency, updateCurrency } from "./actions";
import type { Currency } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface CurrencyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency?: Currency | null;
}

export function CurrencyForm({ open, onOpenChange, currency }: CurrencyFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!currency;

  const form = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: currency?.code ?? "",
      name: currency?.name ?? "",
      symbol: currency?.symbol ?? "$",
      decimalPlaces: currency?.decimalPlaces ?? 2,
    },
  });

  async function onSubmit(data: CurrencyFormData) {
    setError(null);
    const result = isEditing
      ? await updateCurrency(currency!.id, data)
      : await createCurrency(data);

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
          <DialogTitle>{isEditing ? "Edit Currency" : "Add Currency"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" {...form.register("code")} disabled={isEditing} maxLength={3} />
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" {...form.register("symbol")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimalPlaces">Decimal Places</Label>
              <Input id="decimalPlaces" type="number" {...form.register("decimalPlaces", { valueAsNumber: true })} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Currency"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
