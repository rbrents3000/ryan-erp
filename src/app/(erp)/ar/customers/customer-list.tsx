"use client";

import { useState, useMemo } from "react";
import type { Customer } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getCustomerColumns } from "./columns";
import { CustomerForm } from "./customer-form";
import { deleteCustomer } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CustomerListProps {
  data: Customer[];
}

export function CustomerList({ data }: CustomerListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const columns = useMemo(
    () =>
      getCustomerColumns({
        onEdit: (customer) => {
          setEditing(customer);
          setFormOpen(true);
        },
        onDelete: async (customer) => {
          if (confirm(`Delete customer "${customer.name}"?`)) {
            await deleteCustomer(customer.id);
            router.refresh();
          }
        },
      }),
    [router]
  );

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add Customer
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search customers..." />
      <CustomerForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        customer={editing}
      />
    </>
  );
}
