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
import { vendorSchema, type VendorFormData } from "@/lib/validations/purchasing";
import { createVendor, updateVendor } from "./actions";
import type { Vendor } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface VendorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor | null;
}

export function VendorForm({ open, onOpenChange, vendor }: VendorFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!vendor;

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorNumber: vendor?.vendorNumber ?? "",
      name: vendor?.name ?? "",
      contactName: vendor?.contactName ?? "",
      phone: vendor?.phone ?? "",
      email: vendor?.email ?? "",
      addressLine1: vendor?.addressLine1 ?? "",
      addressLine2: vendor?.addressLine2 ?? "",
      city: vendor?.city ?? "",
      state: vendor?.state ?? "",
      postalCode: vendor?.postalCode ?? "",
      country: vendor?.country ?? "US",
      taxId: vendor?.taxId ?? "",
      termsCode: vendor?.termsCode ?? "",
      currencyCode: vendor?.currencyCode ?? "USD",
      status: vendor?.status ?? "active",
    },
  });

  async function onSubmit(data: VendorFormData) {
    setError(null);
    const result = isEditing
      ? await updateVendor(vendor!.id, data)
      : await createVendor(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendorNumber">Vendor #</Label>
              <Input
                id="vendorNumber"
                {...form.register("vendorNumber")}
                disabled={isEditing}
              />
              {form.formState.errors.vendorNumber && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.vendorNumber.message}
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
              <Label htmlFor="contactName">Contact Name</Label>
              <Input id="contactName" {...form.register("contactName")} />
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" {...form.register("taxId")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termsCode">Terms Code</Label>
              <Input id="termsCode" {...form.register("termsCode")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currencyCode">Currency</Label>
              <Input id="currencyCode" {...form.register("currencyCode")} />
            </div>
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
              <option value="blocked">Blocked</option>
            </select>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
