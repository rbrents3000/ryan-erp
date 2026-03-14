"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Currency } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (currency: Currency) => void;
  onDelete: (currency: Currency) => void;
}

export function getCurrencyColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Currency>[] {
  return [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "symbol", header: "Symbol" },
    { accessorKey: "decimalPlaces", header: "Decimals" },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon-xs" onClick={() => onEdit(row.original)}>
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => onDelete(row.original)}>
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}
