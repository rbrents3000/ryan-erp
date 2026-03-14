"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Warehouse } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

export function getWarehouseColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Warehouse>[] {
  return [
    {
      accessorKey: "warehouseCode",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "isDefault",
      header: "Default",
      cell: ({ row }) => row.original.isDefault ? "Yes" : "No",
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
