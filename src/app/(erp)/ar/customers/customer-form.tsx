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
import { customerSchema, type CustomerFormData } from "@/lib/validations/sales";
import { createCustomer, updateCustomer } from "./actions";
import type { Customer } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}

export function CustomerForm({ open, onOpenChange, customer }: CustomerFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!customer;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerNumber: customer?.customerNumber ?? "",
      name: customer?.name ?? "",
      contactName: customer?.contactName ?? "",
      phone: customer?.phone ?? "",
      email: customer?.email ?? "",
      addressLine1: customer?.addressLine1 ?? "",
      addressLine2: customer?.addressLine2 ?? "",
      city: customer?.city ?? "",
      state: customer?.state ?? "",
      postalCode: customer?.postalCode ?? "",
      country: customer?.country ?? "US",
      taxId: customer?.taxId ?? "",
      termsCode: customer?.termsCode ?? "",
      currencyCode: customer?.currencyCode ?? "USD",
      creditLimit: customer?.creditLimit ?? "0",
      status: customer?.status ?? "active",
    },
  });

  async function onSubmit(data: CustomerFormData) {
    setError(null);
    const result = isEditing
      ? await updateCustomer(customer!.id, data)
      : await createCustomer(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  const selectClassName = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerNumber">Customer #</Label>
              <Input
                id="customerNumber"
                {...form.register("customerNumber")}
                disabled={isEditing}
              />
              {form.formState.errors.customerNumber && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.customerNumber.message}
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
          <div className="grid grid-cols-4 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input
                id="creditLimit"
                type="number"
                {...form.register("creditLimit")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className={selectClassName}
              {...form.register("status")}
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
              {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
