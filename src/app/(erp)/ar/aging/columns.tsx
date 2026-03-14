"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AgingRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export const agingColumns: ColumnDef<AgingRow>[] = [
  {
    accessorKey: "customerNumber",
    header: "Customer #",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "current",
    header: "Current",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatCurrency(row.original.current)}</span>
    ),
  },
  {
    accessorKey: "days31to60",
    header: "31-60 Days",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatCurrency(row.original.days31to60)}</span>
    ),
  },
  {
    accessorKey: "days61to90",
    header: "61-90 Days",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatCurrency(row.original.days61to90)}</span>
    ),
  },
  {
    accessorKey: "days90plus",
    header: "90+ Days",
    cell: ({ row }) => {
      const val = row.original.days90plus;
      return (
        <span className={`tabular-nums ${val > 0 ? "text-red-600 font-medium" : ""}`}>
          {formatCurrency(val)}
        </span>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">{formatCurrency(row.original.total)}</span>
    ),
  },
];
