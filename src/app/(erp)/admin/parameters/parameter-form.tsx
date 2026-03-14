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
import { parameterSchema, type ParameterFormData } from "@/lib/validations/system";
import { createParameter, updateParameter } from "./actions";
import { useRouter } from "next/navigation";

type Parameter = {
  id: string;
  companyCode: string | null;
  key: string;
  value: string | null;
};

interface ParameterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parameter?: Parameter | null;
}

export function ParameterForm({ open, onOpenChange, parameter }: ParameterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!parameter;

  const form = useForm<ParameterFormData>({
    resolver: zodResolver(parameterSchema),
    defaultValues: {
      companyCode: parameter?.companyCode ?? "",
      key: parameter?.key ?? "",
      value: parameter?.value ?? "",
    },
  });

  async function onSubmit(data: ParameterFormData) {
    setError(null);
    const result = isEditing
      ? await updateParameter(parameter!.id, data)
      : await createParameter(data);

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
          <DialogTitle>{isEditing ? "Edit Parameter" : "Add Parameter"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input id="key" {...form.register("key")} />
            {form.formState.errors.key && (
              <p className="text-xs text-destructive">{form.formState.errors.key.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input id="value" {...form.register("value")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyCode">Company Code (leave blank for global)</Label>
            <Input id="companyCode" {...form.register("companyCode")} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Parameter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
