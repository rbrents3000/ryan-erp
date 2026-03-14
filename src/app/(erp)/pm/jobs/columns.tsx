"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Job } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const statusColors: Record<string, string> = {
  planned: "text-blue-600",
  in_progress: "text-yellow-600",
  completed: "text-green-600",
  cancelled: "text-red-600",
};

interface ColumnActions {
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

export function getJobColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Job>[] {
  return [
    {
      accessorKey: "jobNumber",
      header: "Job #",
    },
    {
      accessorKey: "plannedQuantity",
      header: "Planned Qty",
    },
    {
      accessorKey: "actualQuantity",
      header: "Actual Qty",
    },
    {
      accessorKey: "plannedStart",
      header: "Start",
      cell: ({ row }) => row.original.plannedStart ?? "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = statusColors[status] ?? "";
        return (
          <span className={`font-medium ${color}`}>
            {status.replace("_", " ")}
          </span>
        );
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
