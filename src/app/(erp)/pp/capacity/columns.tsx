"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { CapacityRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export const capacityColumns: ColumnDef<CapacityRow>[] = [
  {
    accessorKey: "weekStart",
    header: "Week Starting",
  },
  {
    accessorKey: "jobCount",
    header: "Jobs",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.jobCount}</span>
    ),
  },
  {
    accessorKey: "workerCount",
    header: "Workers",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.workerCount}</span>
    ),
  },
  {
    accessorKey: "totalHours",
    header: "Total Hours",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.totalHours.toFixed(1)}</span>
    ),
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.totalCost)}
      </span>
    ),
  },
];
