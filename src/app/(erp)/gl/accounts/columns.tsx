"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { GlAccount } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (account: GlAccount) => void;
  onDelete: (account: GlAccount) => void;
}

export function getAccountColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<GlAccount>[] {
  return [
    {
      accessorKey: "accountNumber",
      header: "Account #",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "accountType",
      header: "Type",
    },
    {
      accessorKey: "normalBalance",
      header: "Normal Balance",
    },
    {
      id: "headerPosting",
      header: "Header/Posting",
      cell: ({ row }) => {
        const { isHeader, isPosting } = row.original;
        const flags: string[] = [];
        if (isHeader) flags.push("Header");
        if (isPosting) flags.push("Posting");
        return flags.join(", ") || "—";
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
