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
import { jobSchema, type JobFormData } from "@/lib/validations/production";
import { createJob, updateJob } from "./actions";
import type { Job } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
}

export function JobForm({ open, onOpenChange, job }: JobFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!job;

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobNumber: job?.jobNumber ?? "",
      recipeId: job?.recipeId ?? "",
      plannedQuantity: job?.plannedQuantity ?? "",
      plannedStart: job?.plannedStart ?? "",
      plannedEnd: job?.plannedEnd ?? "",
      warehouseId: job?.warehouseId ?? "",
      status: job?.status ?? "planned",
      notes: job?.notes ?? "",
    },
  });

  async function onSubmit(data: JobFormData) {
    setError(null);
    const result = isEditing
      ? await updateJob(job!.id, data)
      : await createJob(data);

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
          <DialogTitle>{isEditing ? "Edit Job" : "New Job"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobNumber">Job Number</Label>
            <Input
              id="jobNumber"
              {...form.register("jobNumber")}
              disabled={isEditing}
            />
            {form.formState.errors.jobNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.jobNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipeId">Recipe ID</Label>
            <Input id="recipeId" {...form.register("recipeId")} />
            {form.formState.errors.recipeId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.recipeId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="plannedQuantity">Planned Quantity</Label>
            <Input id="plannedQuantity" {...form.register("plannedQuantity")} />
            {form.formState.errors.plannedQuantity && (
              <p className="text-xs text-destructive">
                {form.formState.errors.plannedQuantity.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plannedStart">Planned Start</Label>
              <Input id="plannedStart" type="date" {...form.register("plannedStart")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedEnd">Planned End</Label>
              <Input id="plannedEnd" type="date" {...form.register("plannedEnd")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="warehouseId">Warehouse ID</Label>
            <Input id="warehouseId" {...form.register("warehouseId")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...form.register("status")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...form.register("notes")} />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
