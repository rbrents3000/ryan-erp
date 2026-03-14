"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ScheduleRow } from "./actions";

const statusColors: Record<string, string> = {
  planned: "text-yellow-600",
  released: "text-blue-600",
  in_progress: "text-green-600",
};

export const scheduleColumns: ColumnDef<ScheduleRow>[] = [
  {
    accessorKey: "jobNumber",
    header: "Job #",
  },
  {
    accessorKey: "recipeName",
    header: "Recipe",
    cell: ({ row }) => (
      <span>
        {row.original.recipeCode} - {row.original.recipeName}
      </span>
    ),
  },
  {
    accessorKey: "plannedQty",
    header: "Planned Qty",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.plannedQty}</span>
    ),
  },
  {
    accessorKey: "actualQty",
    header: "Actual Qty",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.actualQty}</span>
    ),
  },
  {
    accessorKey: "plannedStart",
    header: "Planned Start",
    cell: ({ row }) => row.original.plannedStart ?? "-",
  },
  {
    accessorKey: "plannedEnd",
    header: "Planned End",
    cell: ({ row }) => row.original.plannedEnd ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colorClass = statusColors[status] ?? "text-muted-foreground";
      const label = status.replace("_", " ");
      return (
        <span className={`font-medium capitalize ${colorClass}`}>
          {label}
        </span>
      );
    },
  },
];
