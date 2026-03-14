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
import { createTimeCard, updateTimeCard } from "./actions";
import type { jobLabor } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { z } from "zod";

type TimeCard = typeof jobLabor.$inferSelect;

const timeCardSchema = z.object({
  jobId: z.string().uuid("Valid Job ID is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  workDate: z.string().min(1, "Work date is required"),
  hoursWorked: z.string().min(1, "Hours worked is required"),
  laborRate: z.string().optional(),
  operation: z.string().optional(),
  notes: z.string().optional(),
});

type TimeCardFormData = z.infer<typeof timeCardSchema>;

interface TimeCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: TimeCard | null;
  onSuccess?: () => void;
}

export function TimeCardForm({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: TimeCardFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editing;

  const form = useForm<TimeCardFormData>({
    resolver: zodResolver(timeCardSchema),
    defaultValues: {
      jobId: editing?.jobId ?? "",
      employeeName: editing?.employeeName ?? "",
      workDate: editing?.workDate ?? "",
      hoursWorked: editing?.hoursWorked ?? "",
      laborRate: editing?.laborRate ?? "0",
      operation: editing?.operation ?? "",
      notes: editing?.notes ?? "",
    },
  });

  async function onSubmit(data: TimeCardFormData) {
    setError(null);
    const result = isEditing
      ? await updateTimeCard(editing!.id, data)
      : await createTimeCard(data);

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
            {isEditing ? "Edit Time Card" : "New Time Card"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobId">Job ID</Label>
            <Input
              id="jobId"
              {...form.register("jobId")}
              placeholder="UUID"
            />
            {form.formState.errors.jobId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.jobId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input id="employeeName" {...form.register("employeeName")} />
            {form.formState.errors.employeeName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.employeeName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workDate">Work Date</Label>
              <Input
                id="workDate"
                type="date"
                {...form.register("workDate")}
              />
              {form.formState.errors.workDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.workDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input id="hoursWorked" {...form.register("hoursWorked")} />
              {form.formState.errors.hoursWorked && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.hoursWorked.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborRate">Labor Rate</Label>
              <Input id="laborRate" {...form.register("laborRate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operation">Operation</Label>
              <Input id="operation" {...form.register("operation")} />
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
                  : "Create Time Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
