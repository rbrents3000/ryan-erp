"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { jobLabor } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type TimeCard = typeof jobLabor.$inferSelect;

interface ColumnActions {
  onEdit: (item: TimeCard) => void;
  onDelete: (item: TimeCard) => void;
}

export function getTimeCardColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<TimeCard>[] {
  return [
    {
      accessorKey: "jobId",
      header: "Job",
      cell: ({ row }) => row.original.jobId.slice(0, 8) + "...",
    },
    {
      accessorKey: "employeeName",
      header: "Employee",
    },
    {
      accessorKey: "workDate",
      header: "Date",
    },
    {
      accessorKey: "hoursWorked",
      header: "Hours",
    },
    {
      accessorKey: "laborRate",
      header: "Rate",
      cell: ({ row }) =>
        parseFloat(row.original.laborRate).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      accessorKey: "laborCost",
      header: "Cost",
      cell: ({ row }) =>
        parseFloat(row.original.laborCost).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      accessorKey: "operation",
      header: "Operation",
      cell: ({ row }) => row.original.operation || "—",
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
