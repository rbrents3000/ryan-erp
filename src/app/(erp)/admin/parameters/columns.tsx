"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Parameter = {
  id: string;
  tenantId: string;
  companyCode: string | null;
  key: string;
  value: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface ColumnActions {
  onEdit: (param: Parameter) => void;
  onDelete: (param: Parameter) => void;
}

export function getParameterColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Parameter>[] {
  return [
    { accessorKey: "key", header: "Key" },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => row.original.value ?? "—",
    },
    {
      accessorKey: "companyCode",
      header: "Company",
      cell: ({ row }) => row.original.companyCode ?? "Global",
    },
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
