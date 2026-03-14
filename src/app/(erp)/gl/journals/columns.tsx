"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { JournalHeader } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (journal: JournalHeader) => void;
  onDelete: (journal: JournalHeader) => void;
}

export function getJournalColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<JournalHeader>[] {
  return [
    {
      accessorKey: "journalNumber",
      header: "Journal #",
    },
    {
      accessorKey: "journalDate",
      header: "Date",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const colors: Record<string, string> = {
          draft: "text-yellow-600",
          posted: "text-green-600",
          reversed: "text-red-600",
        };
        return <span className={colors[s] || ""}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
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
