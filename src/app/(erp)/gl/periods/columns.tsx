"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Period } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (period: Period) => void;
  onDelete: (period: Period) => void;
}

export function getPeriodColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Period>[] {
  return [
    { accessorKey: "fiscalYear", header: "Year" },
    { accessorKey: "periodNum", header: "Period" },
    { accessorKey: "startDate", header: "Start Date" },
    { accessorKey: "endDate", header: "End Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.original.status === "open"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {row.original.status}
        </span>
      ),
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
