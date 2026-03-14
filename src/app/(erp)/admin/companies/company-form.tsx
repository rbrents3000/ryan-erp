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
import { companySchema, type CompanyFormData } from "@/lib/validations/system";
import { createCompany, updateCompany } from "./actions";
import type { Company } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
}

export function CompanyForm({ open, onOpenChange, company }: CompanyFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!company;

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyCode: company?.companyCode ?? "",
      name: company?.name ?? "",
      baseCurrency: company?.baseCurrency ?? "USD",
      addressLine1: company?.addressLine1 ?? "",
      addressLine2: company?.addressLine2 ?? "",
      city: company?.city ?? "",
      state: company?.state ?? "",
      postalCode: company?.postalCode ?? "",
      country: company?.country ?? "US",
      phone: company?.phone ?? "",
      email: company?.email ?? "",
      taxId: company?.taxId ?? "",
    },
  });

  async function onSubmit(data: CompanyFormData) {
    setError(null);
    const result = isEditing
      ? await updateCompany(company!.id, data)
      : await createCompany(data);

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
          <DialogTitle>{isEditing ? "Edit Company" : "Add Company"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyCode">Company Code</Label>
              <Input
                id="companyCode"
                {...form.register("companyCode")}
                disabled={isEditing}
              />
              {form.formState.errors.companyCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.companyCode.message}
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseCurrency">Base Currency</Label>
              <Input id="baseCurrency" {...form.register("baseCurrency")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input id="addressLine1" {...form.register("addressLine1")} />
            <Input {...form.register("addressLine2")} placeholder="Address line 2" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...form.register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...form.register("state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Zip</Label>
              <Input id="postalCode" {...form.register("postalCode")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...form.register("country")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input id="taxId" {...form.register("taxId")} />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
