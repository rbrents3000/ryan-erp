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
import { updateUserProfile } from "./actions";
import type { UserProfile } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { z } from "zod";

const userProfileSchema = z.object({
  displayName: z.string().optional(),
  defaultCompanyCode: z.string().min(1, "Default company code is required"),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: UserProfile | null;
  onSuccess?: () => void;
}

export function UserProfileForm({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: UserProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: editing?.displayName ?? "",
      defaultCompanyCode: editing?.defaultCompanyCode ?? "01",
    },
  });

  async function onSubmit(data: UserProfileFormData) {
    if (!editing) return;
    setError(null);
    const result = await updateUserProfile(editing.id, data);

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
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              {...form.register("displayName")}
              placeholder="Optional"
            />
            {form.formState.errors.displayName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.displayName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultCompanyCode">Default Company Code</Label>
            <Input
              id="defaultCompanyCode"
              {...form.register("defaultCompanyCode")}
            />
            {form.formState.errors.defaultCompanyCode && (
              <p className="text-xs text-destructive">
                {form.formState.errors.defaultCompanyCode.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
