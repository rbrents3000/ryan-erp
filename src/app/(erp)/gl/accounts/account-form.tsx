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
import { glAccountSchema, type GlAccountFormData } from "@/lib/validations/finance";
import { createGlAccount, updateGlAccount } from "./actions";
import type { GlAccount } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface AccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: GlAccount | null;
}

export function AccountForm({ open, onOpenChange, account }: AccountFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!account;

  const form = useForm<GlAccountFormData>({
    resolver: zodResolver(glAccountSchema),
    defaultValues: {
      accountNumber: account?.accountNumber ?? "",
      name: account?.name ?? "",
      accountType: account?.accountType ?? "Asset",
      normalBalance: account?.normalBalance ?? "debit",
      isHeader: account?.isHeader ?? false,
      isPosting: account?.isPosting ?? true,
      parentId: account?.parentId ?? "",
      status: account?.status ?? "active",
    },
  });

  async function onSubmit(data: GlAccountFormData) {
    setError(null);
    const result = isEditing
      ? await updateGlAccount(account!.id, data)
      : await createGlAccount(data);

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
          <DialogTitle>{isEditing ? "Edit Account" : "Add Account"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account #</Label>
              <Input
                id="accountNumber"
                {...form.register("accountNumber")}
                disabled={isEditing}
              />
              {form.formState.errors.accountNumber && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.accountNumber.message}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                {...form.register("accountType")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
              {form.formState.errors.accountType && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.accountType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="normalBalance">Normal Balance</Label>
              <select
                id="normalBalance"
                {...form.register("normalBalance")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
              {form.formState.errors.normalBalance && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.normalBalance.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isHeader")}
                className="size-4 rounded border-input"
              />
              <span className="text-sm">Header Account</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isPosting")}
                className="size-4 rounded border-input"
              />
              <span className="text-sm">Posting Account</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Account ID</Label>
              <Input
                id="parentId"
                {...form.register("parentId")}
                placeholder="Optional UUID"
              />
              {form.formState.errors.parentId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.parentId.message}
                </p>
              )}
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
              {form.formState.errors.status && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
