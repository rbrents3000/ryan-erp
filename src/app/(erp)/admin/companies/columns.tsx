"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Company } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function getCompanyColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Company>[] {
  return [
    {
      accessorKey: "companyCode",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "baseCurrency",
      header: "Currency",
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
