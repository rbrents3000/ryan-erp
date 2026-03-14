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
import { periodSchema, type PeriodFormData } from "@/lib/validations/system";
import { createPeriod, updatePeriod } from "./actions";
import type { Period } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface PeriodFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period?: Period | null;
  companyCode: string;
}

export function PeriodForm({ open, onOpenChange, period, companyCode }: PeriodFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!period;

  const form = useForm<PeriodFormData>({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      companyCode: period?.companyCode ?? companyCode,
      fiscalYear: period?.fiscalYear ?? new Date().getFullYear(),
      periodNum: period?.periodNum ?? 1,
      startDate: period?.startDate ?? "",
      endDate: period?.endDate ?? "",
      status: period?.status ?? "open",
    },
  });

  async function onSubmit(data: PeriodFormData) {
    setError(null);
    const result = isEditing
      ? await updatePeriod(period!.id, data)
      : await createPeriod(data);

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
          <DialogTitle>{isEditing ? "Edit Period" : "Add Period"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...form.register("companyCode")} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year</Label>
              <Input id="fiscalYear" type="number" {...form.register("fiscalYear", { valueAsNumber: true })} />
              {form.formState.errors.fiscalYear && (
                <p className="text-xs text-destructive">{form.formState.errors.fiscalYear.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodNum">Period</Label>
              <Input id="periodNum" type="number" {...form.register("periodNum", { valueAsNumber: true })} />
              {form.formState.errors.periodNum && (
                <p className="text-xs text-destructive">{form.formState.errors.periodNum.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...form.register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...form.register("endDate")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" {...form.register("status")} placeholder="open or closed" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Period"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
