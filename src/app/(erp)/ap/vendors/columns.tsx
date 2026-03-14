"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Vendor } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export function getVendorColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Vendor>[] {
  return [
    {
      accessorKey: "vendorNumber",
      header: "Vendor #",
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
        return [city, state].filter(Boolean).join(", ") || "\u2014";
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "currencyCode",
      header: "Currency",
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
