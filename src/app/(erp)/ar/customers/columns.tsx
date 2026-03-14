"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Customer } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function getCustomerColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: "customerNumber",
      header: "Customer #",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const { city, state } = row.original;
        return [city, state].filter(Boolean).join(", ") || "—";
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "creditLimit",
      header: "Credit Limit",
      cell: ({ row }) => {
        const val = parseFloat(row.original.creditLimit) || 0;
        return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}
