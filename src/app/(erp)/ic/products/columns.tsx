"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function getProductColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "partNumber",
      header: "Part #",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "productType",
      header: "Type",
    },
    {
      accessorKey: "uomCode",
      header: "UoM",
    },
    {
      accessorKey: "standardCost",
      header: "Std Cost",
      cell: ({ row }) => {
        const val = parseFloat(row.original.standardCost) || 0;
        return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
      },
    },
    {
      accessorKey: "listPrice",
      header: "List Price",
      cell: ({ row }) => {
        const val = parseFloat(row.original.listPrice) || 0;
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
