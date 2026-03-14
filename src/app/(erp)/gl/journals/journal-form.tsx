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
import { journalHeaderSchema, type JournalHeaderFormData } from "@/lib/validations/finance";
import { createJournal, updateJournal } from "./actions";
import type { JournalHeader } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface JournalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journal?: JournalHeader | null;
}

export function JournalForm({ open, onOpenChange, journal }: JournalFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!journal;

  const form = useForm<JournalHeaderFormData>({
    resolver: zodResolver(journalHeaderSchema),
    defaultValues: {
      journalDate: journal?.journalDate ?? "",
      description: journal?.description ?? "",
      source: journal?.source ?? "",
    },
  });

  async function onSubmit(data: JournalHeaderFormData) {
    setError(null);
    const result = isEditing
      ? await updateJournal(journal!.id, data)
      : await createJournal(data);

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
          <DialogTitle>{isEditing ? "Edit Journal" : "New Journal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="journalDate">Date</Label>
            <Input
              id="journalDate"
              type="date"
              {...form.register("journalDate")}
            />
            {form.formState.errors.journalDate && (
              <p className="text-xs text-destructive">
                {form.formState.errors.journalDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source (optional)</Label>
            <Input
              id="source"
              {...form.register("source")}
            />
            {form.formState.errors.source && (
              <p className="text-xs text-destructive">
                {form.formState.errors.source.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Journal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
